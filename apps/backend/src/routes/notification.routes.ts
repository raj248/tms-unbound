import { Router } from "express"
import { prisma } from "../config/db"
import {
  requireAuth,
  AuthenticatedRequest,
} from "../middlewares/auth.middleware"
import { createAndDeliverNotification } from "../services/notification.service"
import { AppError } from "../utils/app-error.utils"

const router: Router = Router()
router.use(requireAuth)

// ==========================================
// 1. GET MY NOTIFICATION HISTORY
// ==========================================
// src/routes/notification.routes.ts

router.get("/", async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.userId

    // 1. Parse pagination parameters with safe fallbacks
    const page = parseInt(req.query.page as string, 10) || 1
    const limit = parseInt(req.query.limit as string, 10) || 20
    const skip = (page - 1) * limit

    // 2. Run database queries in parallel for optimal throughput
    const [history, totalCount] = await Promise.all([
      prisma.notificationStatus.findMany({
        where: { userId },
        include: {
          notification: true,
        },
        orderBy: {
          notification: { createdAt: "desc" },
        },
        take: limit,
        skip: skip,
      }),
      prisma.notificationStatus.count({
        where: { userId },
      }),
    ])

    // 3. Construct clean pagination metadata
    const hasMore = skip + history.length < totalCount

    return res.json({
      success: true,
      data: history,
      meta: {
        page,
        limit,
        totalCount,
        hasMore,
      },
    })
  } catch (error: any) {
    if (error instanceof AppError) throw error
    throw new AppError(error.message, 500)
  }
})

// ==========================================
// 2. MARK INDIVIDUAL NOTIFICATION AS READ
// ==========================================
router.put("/:statusId/read", async (req: AuthenticatedRequest, res) => {
  try {
    const { statusId } = req.params
    const userId = req.user?.userId

    await prisma.notificationStatus.updateMany({
      where: {
        id: statusId as string,
        userId, // Security guard: Ensures a user can't mark someone else's log as read
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    return res.json({
      success: true,
      data: { message: "Status updated to read" },
    })
  } catch (error: any) {
    throw new AppError(error.message, 500)
  }
})

// ==========================================
// 3. TRIGGER / SEND A NEW NOTIFICATION
// ==========================================
router.post("/send", async (req: AuthenticatedRequest, res) => {
  try {
    const { title, body, targetDeptId, isAdminOnly } = req.body

    const senderId = req.user!.userId
    const senderName = req.user?.name || req.user?.username || "System"

    const notification = await createAndDeliverNotification({
      title,
      body,
      senderId,
      senderName,
      targetDeptId,
      isAdminOnly,
    })

    return res.status(201).json({ success: true, data: notification })
  } catch (error: any) {
    throw new AppError(error.message, 500)
  }
})

export default router
