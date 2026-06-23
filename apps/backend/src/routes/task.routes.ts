import { Router } from "express"
import { prisma } from "../config/db" // Your Prisma Client instance
import {
  requireAuth,
  AuthenticatedRequest,
} from "../middlewares/auth.middleware"
import {
  CreateTaskRequest,
  UpdateTaskRequest,
  CreateRemarkRequest,
} from "@workspace/types"
import { AppError } from "../utils/app-error.utils"

const router: Router = Router()

// Apply auth barrier globally across all task pathways
router.use(requireAuth)

// ==========================================
// 1. CREATE TASK
// ==========================================
router.post("/", async (req: AuthenticatedRequest, res) => {
  try {
    const { name, description, departmentId, deadline } =
      req.body as CreateTaskRequest

    const assigneeId = req.user?.userId
    const newTask = await prisma.task.create({
      data: {
        name,
        description,
        departmentId,
        assigneeId: assigneeId || null,
        deadline: deadline ? new Date(deadline) : null,
        assigneeName:
          req.user?.name || req.user?.username || "Anonymous System User",
        status: "PENDING",
      },
      include: { department: true },
    })

    return res.status(201).json({ success: true, data: newTask })
  } catch (error: any) {
    throw new AppError(error.message, 500)
  }
})

// ==========================================
// 2. READ ALL (With Optional Queries)
// ==========================================
router.get("/", async (req, res) => {
  try {
    const { status, departmentId } = req.query

    const tasks = await prisma.task.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(departmentId && { departmentId: departmentId as string }),
      },
      include: {
        department: true,
        assignee: { select: { id: true, username: true, name: true } },
        remarks: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    })

    return res.json({ success: true, data: tasks })
  } catch (error: any) {
    throw new AppError(error.message, 500)
  }
})

// ==========================================
// 3. READ SINGLE (Hydrated with Remarks)
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        department: true,
        assignee: { select: { id: true, username: true, name: true } },
        remarks: { orderBy: { createdAt: "asc" } },
      },
    })

    if (!task) throw new AppError("Task not found", 404)

    return res.json({ success: true, data: task })
  } catch (error: any) {
    throw new AppError(error.message, 500)
  }
})

// ==========================================
// 4. UPDATE TASK
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const body = req.body as UpdateTaskRequest

    // Handle assignee update tracking safety
    let assigneeNameUpdate = undefined
    if (body.assigneeId) {
      const user = await prisma.user.findUnique({
        where: { id: body.assigneeId },
      })
      if (user) assigneeNameUpdate = user.name || user.username
    } else if (body.assigneeId === null) {
      assigneeNameUpdate = null
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description !== undefined && {
          description: body.description,
        }),
        ...(body.status && { status: body.status }),
        ...(body.departmentId && { departmentId: body.departmentId }),
        ...(body.assigneeId !== undefined && { assigneeId: body.assigneeId }),
        ...(assigneeNameUpdate !== undefined && {
          assigneeName: assigneeNameUpdate,
        }),
        ...(body.deadline !== undefined && {
          deadline: body.deadline ? new Date(body.deadline) : null,
        }),
      },
    })

    return res.json({ success: true, data: updatedTask })
  } catch (error: any) {
    throw new AppError(error.message, 500)
  }
})

// ==========================================
// 5. DELETE TASK
// ==========================================
router.delete("/:id", async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params

    // Check if user is ADMIN if you want to gate this
    if (req.user?.role !== "ADMIN") {
      throw new AppError("Only admins can drop tasks", 403)
    }

    await prisma.task.delete({ where: { id: id as string } })
    return res.json({
      success: true,
      data: { message: "Task successfully deleted" },
    })
  } catch (error: any) {
    throw new AppError(error.message, 500)
  }
})

// ==========================================
// 6. ADD REMARK
// ==========================================
router.post("/:id/remarks", async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    const { text } = req.body as Omit<
      CreateRemarkRequest,
      "taskId" | "authorName"
    >

    // Extract user profile name directly from active session token context securely
    const authorName =
      req.user?.name || req.user?.username || "Anonymous System User"

    const newRemark = await prisma.remark.create({
      data: {
        text,
        taskId: id as string,
        authorName,
      },
    })

    return res.status(201).json({ success: true, data: newRemark })
  } catch (error: any) {
    throw new AppError(error.message, 500)
  }
})

export default router
