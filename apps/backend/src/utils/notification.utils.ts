// utils/notification.util.ts

// firebase-admin v14 — named imports from submodules, no more admin.* namespace
import { initializeApp, getApps, cert, type App } from "firebase-admin/app"
import {
  getMessaging,
  type MulticastMessage,
  type BatchResponse,
  type SendResponse,
} from "firebase-admin/messaging"
import { prisma } from "../config/db"

// ---------------------------------------------------------------------------
// Firebase init — runs once on first import
// ---------------------------------------------------------------------------

let app: App

if (getApps().length === 0) {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
  if (!serviceAccountPath) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_PATH env variable is not set.")
  }
  app = initializeApp({ credential: cert(serviceAccountPath) })
} else {
  app = getApps()[0]
}

// Messaging instance bound to our app
const messaging = getMessaging(app)

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

/**
 * Send a multicast message with exponential backoff + jitter.
 * Retries on transient network errors and rate-limit responses only.
 */
async function safeSendBatch(
  message: MulticastMessage,
  maxRetries = 5
): Promise<BatchResponse> {
  let attempt = 0

  while (attempt <= maxRetries) {
    try {
      return await messaging.sendEachForMulticast(message)
    } catch (err: unknown) {
      const fcmErr = err as {
        code?: string
        response?: { headers?: Record<string, string> }
        headers?: Record<string, string>
      }

      const isNetworkError =
        fcmErr.code === "messaging/internal-error" ||
        fcmErr.code === "messaging/server-unavailable"
      const isRateLimit = fcmErr.code === "messaging/too-many-requests"

      if (isNetworkError || isRateLimit) {
        attempt++
        if (attempt > maxRetries) throw err

        let waitMs = Math.min(1000 * 2 ** attempt, 60_000)

        if (isRateLimit) {
          const retryAfter =
            fcmErr.response?.headers?.["retry-after"] ??
            fcmErr.headers?.["retry-after"]
          if (retryAfter) waitMs = parseInt(retryAfter, 10) * 1000
        }

        const jitter = waitMs * (0.8 + Math.random() * 0.4)
        console.warn(
          `[FCM] ${fcmErr.code}. Retrying in ${Math.round(jitter)}ms (Attempt ${attempt}/${maxRetries})`
        )
        await delay(jitter)
      } else {
        throw err // Non-retryable
      }
    }
  }

  throw new Error("[FCM] Max retries reached")
}

// ---------------------------------------------------------------------------
// Core push delivery — generic, reusable
// ---------------------------------------------------------------------------

interface PushPayload {
  title: string
  body: string
  data?: Record<string, string>
}

/**
 * Resolve FCM tokens for the given user IDs, send in 500-token chunks,
 * and clean up tokens that Firebase reports as invalid/expired.
 */
export async function sendPushToUserIds(
  userIds: string[],
  payload: PushPayload
): Promise<void> {
  if (userIds.length === 0) return

  // 1. Fetch valid FCM tokens
  const users = await prisma.user.findMany({
    where: { id: { in: userIds }, fcmToken: { not: null } },
    select: { id: true, fcmToken: true },
  })

  const tokensWithIds = users
    .filter((u): u is typeof u & { fcmToken: string } => !!u.fcmToken)
    .map((u) => ({ userId: u.id, token: u.fcmToken }))

  if (tokensWithIds.length === 0) {
    console.log("[FCM] No valid tokens found — skipping push.")
    return
  }

  // 2. Chunk into ≤500 (FCM multicast limit)
  const chunks = chunkArray(tokensWithIds, 500)

  for (const chunk of chunks) {
    const tokens = chunk.map((c) => c.token)

    const message: MulticastMessage = {
      notification: { title: payload.title, body: payload.body },
      data: payload.data ?? {},
      tokens,
    }

    const response = await safeSendBatch(message)

    // 3. Purge invalid/expired tokens
    const tokensToRemove = response.responses
      .map((res: SendResponse, idx: number) => ({
        res,
        token: chunk[idx].token,
      }))
      .filter(
        ({ res }: { res: SendResponse }) =>
          !res.success &&
          (res.error?.code === "messaging/registration-token-not-registered" ||
            res.error?.code === "messaging/invalid-registration-token")
      )
      .map(({ token }: { token: string }) => token)

    if (tokensToRemove.length > 0) {
      console.log(`[FCM] Removing ${tokensToRemove.length} invalid tokens…`)
      await prisma.user.updateMany({
        where: { fcmToken: { in: tokensToRemove } },
        data: { fcmToken: null },
      })
    }

    // Log non-invalid failures for visibility
    response.responses.forEach((res: SendResponse, idx: number) => {
      if (!res.success && !tokensToRemove.includes(chunk[idx].token)) {
        console.warn(
          `[FCM] Non-fatal error for token[${idx}]:`,
          res.error?.code
        )
      }
    })

    console.log(
      `[FCM] Chunk done — Success: ${response.successCount}, Failure: ${response.failureCount}`
    )
  }
}

// ---------------------------------------------------------------------------
// Notification + delivery log creator
// ---------------------------------------------------------------------------

interface SendNotificationPayload {
  title: string
  body: string
  senderId: string
  senderName: string
  targetDeptId?: string // Send to a specific dept (+ admin copies)
  isAdminOnly?: boolean // Send only to system admins
  pushData?: Record<string, string> // Extra FCM data (deep links, etc.)
}

/**
 * Persists a Notification record + NotificationStatus rows,
 * then fires FCM push to all resolved recipients.
 */
export async function createAndDeliverNotification(
  payload: SendNotificationPayload
) {
  const {
    title,
    body,
    senderId,
    senderName,
    targetDeptId,
    isAdminOnly,
    pushData,
  } = payload

  // 1. Persist notification
  const notification = await prisma.notification.create({
    data: {
      title,
      body,
      senderId,
      senderName,
      targetDeptId: targetDeptId ?? null,
      isAdminOnly: isAdminOnly ?? false,
    },
  })

  // 2. Resolve target user IDs
  let targetUserIds: string[] = []

  if (isAdminOnly) {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    })
    targetUserIds = admins.map((a) => a.id)
  } else if (targetDeptId) {
    const recipients = await prisma.user.findMany({
      where: {
        OR: [
          { departments: { some: { id: targetDeptId } } },
          { role: "ADMIN" },
        ],
      },
      select: { id: true },
    })
    targetUserIds = recipients.map((r) => r.id)
  }

  // 3. Bulk insert unread delivery status rows
  if (targetUserIds.length > 0) {
    await prisma.notificationStatus.createMany({
      data: targetUserIds.map((userId) => ({
        notificationId: notification.id,
        userId,
        isRead: false,
      })),
      skipDuplicates: true,
    })
  }

  // 4. Fire FCM push
  await sendPushToUserIds(targetUserIds, {
    title,
    body,
    data: {
      notificationId: notification.id,
      ...(pushData ?? {}),
    },
  })

  return notification
}

// ---------------------------------------------------------------------------
// Legacy export — backwards compat wrapper
// ---------------------------------------------------------------------------

export const sendBulkSalesNotifications = async (
  authorIds: string[],
  _fromDate: string,
  toDate: string
) => {
  const formattedDateLabel = new Date(toDate).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  })

  await sendPushToUserIds(authorIds, {
    title: "📊 New Sales Report Published",
    body: `Your sales report for ${formattedDateLabel} is now available for download.`,
    data: { url: "/author/dashboard" },
  })
}
