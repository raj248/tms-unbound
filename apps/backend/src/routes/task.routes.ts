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
import { createAndDeliverNotification } from "../utils/notification.utils"

const router: Router = Router()

// Apply auth barrier globally across all task pathways
router.use(requireAuth)

// ==========================================
// 1. CREATE TASK
// ==========================================
router.post("/", async (req: AuthenticatedRequest, res) => {
  try {
    const { name, description, departmentId, deadline, metricValue } =
      req.body as CreateTaskRequest

    // 1. Raw body validation
    if (!name || !name.trim()) throw new AppError("Task name is required.", 400)
    if (!departmentId)
      throw new AppError("Target department selection is required.", 400)

    // 2. Multitier Role-Based Access Security Guard
    if (req.user?.role !== "ADMIN") {
      // Standard USER profile: Fetch departments this specific user is assigned to
      const userProfile = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        select: { departments: { select: { id: true } } },
      })

      const allowedDeptIds = userProfile?.departments.map((d) => d.id) ?? []

      // Block attempts to inject a task into a department they don't belong to
      if (!allowedDeptIds.includes(departmentId)) {
        throw new AppError(
          "Access Denied: You can only create tasks within your own assigned department.",
          403
        )
      }
    } else {
      // Admin fallback validation: Just verify the target department node actually exists
      const targetDeptExists = await prisma.department.findUnique({
        where: { id: departmentId },
      })
      if (!targetDeptExists) {
        throw new AppError("The targeted department does not exist.", 404)
      }
    }

    const senderId = req.user!.userId
    const senderName =
      req.user?.name || req.user?.username || "Anonymous System User"

    // 3. Write Task to Database
    const newTask = await prisma.task.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        departmentId,
        assigneeId: senderId,
        assigneeName: senderName,
        deadline: deadline ? new Date(deadline) : null,
        metricValue: metricValue !== undefined ? Number(metricValue) : null,
      },
      include: { department: true },
    })

    // 4. Trigger over-the-air push alerts and historic log state creation
    // This is fires asynchronously in the background so it won't add latency to your API response
    createAndDeliverNotification({
      title: "New Task Created",
      body: `"${newTask.name}" has been added to the ${newTask.department.name} queue by ${senderName}.`,
      senderId,
      senderName,
      targetDeptId: departmentId,
      isAdminOnly: false,
    }).catch((err) =>
      console.error("[Notification Error] Failed to dispatch task alert:", err)
    )

    return res.status(201).json({ success: true, data: newTask })
  } catch (error: any) {
    if (error instanceof AppError) throw error
    throw new AppError(error.message, 500)
  }
})

// ==========================================
// 2. READ ALL (With Optional Queries & Pagination)
// ==========================================
router.get("/", async (req: AuthenticatedRequest, res) => {
  try {
    const {
      status,
      departmentId,
      search,
      sortOrder,
      page,
      limit,
      startDate,
      endDate,
    } = req.query

    // 1. Core Base Filters
    const whereClause: any = {
      ...(status && status !== "ALL" && { status: status as any }),
    }

    // 2. Multi-tier Department Visibility Isolation
    if (req.user?.role === "ADMIN") {
      // Admins are unconstrained and can view specified or all departments
      if (departmentId && departmentId !== "ALL") {
        whereClause.departmentId = departmentId as string
      }
    } else {
      // Standard USER profile: Fetch departments this specific user is assigned to
      const userProfile = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        select: { departments: { select: { id: true } } },
      })

      const allowedDeptIds = userProfile?.departments.map((d) => d.id) ?? []

      if (departmentId && departmentId !== "ALL") {
        // If a USER requests a specific department, ensure they belong to it
        if (!allowedDeptIds.includes(departmentId as string)) {
          throw new AppError(
            "Access Denied: You cannot view tasks outside your assigned department(s).",
            403
          )
        }
        whereClause.departmentId = departmentId as string
      } else {
        // Otherwise, filter down implicitly to only include their allowed department nodes
        whereClause.departmentId = { in: allowedDeptIds }
      }
    }

    // 3. Time-window Ranges
    if (startDate || endDate) {
      whereClause.createdAt = {}
      if (startDate) whereClause.createdAt.gte = new Date(startDate as string)
      if (endDate) whereClause.createdAt.lte = new Date(endDate as string)
    }

    // 4. Global Search Strings
    if (search) {
      const q = String(search)
      whereClause.OR = [
        { name: { contains: q } },
        { department: { name: { contains: q } } },
        { assigneeName: { contains: q } },
        { assignee: { name: { contains: q } } },
      ]
    }

    // 5. Order Execution Rules
    const orderByClause: any = []
    if (sortOrder === "asc" || sortOrder === "desc") {
      orderByClause.push({ createdAt: sortOrder })
    } else {
      orderByClause.push({ createdAt: "desc" })
    }

    const queryOptions: any = {
      where: whereClause,
      include: {
        department: true,
        assignee: { select: { id: true, username: true, name: true } },
        remarks: { orderBy: { createdAt: "asc" } },
      },
      orderBy: orderByClause,
    }

    // 6. Paginated Pipeline Execution
    if (page && limit) {
      const pageNum = Number(page)
      const limitNum = Number(limit)
      queryOptions.skip = (pageNum - 1) * limitNum
      queryOptions.take = limitNum

      const [tasks, total] = await Promise.all([
        prisma.task.findMany(queryOptions),
        prisma.task.count({ where: whereClause }),
      ])

      return res.json({ success: true, data: tasks, total })
    }

    // 7. Non-paginated Fallback Execution
    const tasks = await prisma.task.findMany(queryOptions)
    return res.json({ success: true, data: tasks })
  } catch (error: any) {
    if (error instanceof AppError) throw error
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
// Define a sequential weight configuration for your status flows
const STATUS_WEIGHTS: Record<string, number> = {
  PENDING: 1,
  IN_PROGRESS: 2,
  HOLD: 3,
  BLOCKED: 3,
  COMPLETED: 4,
}

router.put("/:id", async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    const body = req.body as UpdateTaskRequest

    // 1. Fetch the absolute current state of the task to compare statuses
    const currentTask = await prisma.task.findUnique({
      where: { id: id as string },
    })
    if (!currentTask) throw new AppError("Target task not found", 404)

    console.log(body.status, currentTask.status)
    // 2. Multitier Status Progression Security Guard
    if (body.status && body.status !== currentTask.status) {
      if (req.user?.role !== "ADMIN") {
        const currentWeight = STATUS_WEIGHTS[currentTask.status] || 0
        const targetWeight = STATUS_WEIGHTS[body.status] || 0

        // If the target state has a lower weight, reject the state downgrade
        if (targetWeight < currentWeight) {
          // const isReopen =
          //   (currentTask.status === "COMPLETED" ||
          //     currentTask.status === "HOLD") &&
          //   body.status === "IN_PROGRESS"

          // if (!isReopen) {
          throw new AppError(
            `Access Denied: Only administrators can revert a task from ${currentTask.status} back to ${body.status}.`,
            403
          )
          // }
        }
      }
    }

    // 3. Handle assignee update tracking safety
    let assigneeNameUpdate = undefined
    if (body.assigneeId) {
      const user = await prisma.user.findUnique({
        where: { id: body.assigneeId },
      })
      if (user) assigneeNameUpdate = user.name || user.username
    } else if (body.assigneeId === null) {
      assigneeNameUpdate = null
    }

    // 4. Fire the Database Update Operation
    const updatedTask = await prisma.task.update({
      where: { id: id as string },
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
        ...(body.metricValue !== undefined && {
          metricValue:
            body.metricValue !== null ? Number(body.metricValue) : null,
        }),
        ...(body.metricLabel !== undefined && {
          metricLabel: body.metricLabel,
        }),
      },
    })

    // 5. Conditional Activity Logging Notifications (Only fire if status actually changed)
    if (body.status && currentTask.status !== body.status) {
      const senderId = req.user!.userId
      const senderName =
        req.user?.name || req.user?.username || "Anonymous System User"

      if (body.status === "COMPLETED") {
        createAndDeliverNotification({
          title: "Task Completed",
          body: `Task "${updatedTask.name}" has been completed by ${senderName}`,
          senderId,
          senderName,
          targetDeptId: updatedTask.departmentId,
          isAdminOnly: true, // Alerts the administration pool
        }).catch((err) => console.error("[FCM Alert Error]:", err))
      }

      if (body.status === "HOLD") {
        createAndDeliverNotification({
          title: "Task On Hold",
          body: `Task "${updatedTask.name}" has been placed on hold by ${senderName}`,
          senderId,
          senderName,
          targetDeptId: updatedTask.departmentId,
          isAdminOnly: true,
        }).catch((err) => console.error("[FCM Alert Error]:", err))
      }
    }

    return res.json({ success: true, data: updatedTask })
  } catch (error: any) {
    if (error instanceof AppError) throw error
    throw new AppError(error.message, 500)
  }
})

// ==========================================
// 5. DELETE TASK
// ==========================================
router.delete("/:id", async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params

    // 1. Fetch the targeted task first to evaluate department scope
    const targetTask = await prisma.task.findUnique({
      where: { id: id as string },
    })
    if (!targetTask) {
      throw new AppError("Target task not found.", 404)
    }

    // 2. Multitier Role Isolation Guard
    if (req.user?.role !== "ADMIN") {
      // Standard USER profile: Fetch the departments this user belongs to
      const userProfile = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        select: { departments: { select: { id: true } } },
      })

      const allowedDeptIds = userProfile?.departments.map((d) => d.id) ?? []

      // If the task's department ID isn't in their list, block the action
      if (!allowedDeptIds.includes(targetTask.departmentId)) {
        throw new AppError(
          "Access Denied: You do not have permission to delete tasks outside your assigned department.",
          403
        )
      }
    }

    // 3. Perform the Deletion
    await prisma.task.delete({
      where: { id: id as string },
    })

    return res.json({
      success: true,
      data: { message: "Task successfully removed from department records." },
    })
  } catch (error: any) {
    if (error instanceof AppError) throw error
    throw new AppError(error.message, 500)
  }
})
// ==========================================
// 6. ADD REMARK (OBSOLETE - REMOVE IN PRODUCTION)
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
