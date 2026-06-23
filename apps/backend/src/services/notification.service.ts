import { prisma } from "../config/db"

interface SendNotificationPayload {
  title: string
  body: string
  senderId: string
  senderName: string
  targetDeptId?: string // Provided if sending to a specific department
  isAdminOnly?: boolean // Provided if sending upwards to system admins
}

export async function createAndDeliverNotification(
  payload: SendNotificationPayload
) {
  const { title, body, senderId, senderName, targetDeptId, isAdminOnly } =
    payload

  // 1. Save the primary notification context record
  const notification = await prisma.notification.create({
    data: {
      title,
      body,
      senderId,
      senderName,
      targetDeptId,
      isAdminOnly: isAdminOnly || false,
    },
  })

  // 2. Resolve exactly which target user IDs need to receive this log
  let targetUserIds: string[] = []

  if (isAdminOnly) {
    // Send to all administrators
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    })
    targetUserIds = admins.map((a) => a.id)
  } else if (targetDeptId) {
    // Send to all members of that department + copy all global administrators
    const recipients = await prisma.user.findMany({
      where: {
        OR: [
          { departments: { some: { id: targetDeptId } } },
          { role: "ADMIN" }, // Admins receive copies of everything as requested!
        ],
      },
      select: { id: true },
    })
    targetUserIds = recipients.map((r) => r.id)
  }

  // 3. Bulk insert the delivery states as unread logs
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

  // 4. PUT YOUR EXISTING PUSH NOTIFICATION TRIGGER HERE
  // e.g., sendPushToUserIds(targetUserIds, title, body);

  return notification
}
