import { Router } from "express"
import { prisma } from "../config/db"
import {
  requireAuth,
  AuthenticatedRequest,
} from "../middlewares/auth.middleware"
import type { CreateRemarkRequest } from "@workspace/types"
import { AppError } from "../utils/app-error.utils"

// Merge params allows us to access variables like :taskId from the parent router if nested
const router: Router = Router({ mergeParams: true })

// Protect all remark operations behind your active auth barrier
router.use(requireAuth)

// ==========================================
// 1. ADD REMARK TO TASK
// ==========================================
router.post("/", async (req: AuthenticatedRequest, res) => {
  try {
    const { text, taskId } = req.body as CreateRemarkRequest

    if (!text || !text.trim()) {
      throw new AppError("Remark text cannot be empty", 400)
    }

    // Verify the target task exists before attaching a remark to it
    const taskExists = await prisma.task.findUnique({
      where: { id: taskId },
    })

    if (!taskExists) {
      throw new AppError("Target task not found", 404)
    }

    // Extract user profile name securely from active session token context
    const authorName =
      req.user?.name || req.user?.username || "Anonymous System User"

    const newRemark = await prisma.remark.create({
      data: {
        text: text.trim(),
        taskId,
        authorName,
      },
    })

    return res.status(201).json({ success: true, data: newRemark })
  } catch (error: any) {
    if (error instanceof AppError) throw error
    throw new AppError(error.message, 500)
  }
})

// ==========================================
// 2. GET ALL REMARKS FOR A SPECIFIC TASK
// ==========================================
router.get("/task/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params

    const remarks = await prisma.remark.findMany({
      where: { taskId },
      orderBy: { createdAt: "asc" }, // Keeps the conversation timeline chronological
    })

    return res.json({ success: true, data: remarks })
  } catch (error: any) {
    if (error instanceof AppError) throw error
    throw new AppError(error.message, 500)
  }
})

// ==========================================
// 3. DELETE A REMARK
// ==========================================
router.delete("/:id", async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params

    const remark = await prisma.remark.findUnique({
      where: { id: id as string },
    })

    if (!remark) {
      throw new AppError("Remark not found", 404)
    }

    // Guard rail: Only Admins can drop any comment, Users can only delete their own remarks
    const isAdmin = req.user?.role === "ADMIN"
    const isAuthor =
      remark.authorName === (req.user?.name || req.user?.username)

    if (!isAdmin && !isAuthor) {
      throw new AppError(
        "You do not have permission to delete this remark",
        403
      )
    }

    await prisma.remark.delete({ where: { id: id as string } })

    return res.json({
      success: true,
      data: { message: "Remark successfully removed" },
    })
  } catch (error: any) {
    if (error instanceof AppError) throw error
    throw new AppError(error.message, 500)
  }
})

export default router
