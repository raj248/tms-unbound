import { Router } from "express"
import { prisma } from "../config/db"
import {
  requireAuth,
  AuthenticatedRequest,
} from "../middlewares/auth.middleware"
import type { CreateUserRequest } from "@workspace/types"
import { AppError } from "../utils/app-error.utils"
import * as bcrypt from "bcryptjs"

const router: Router = Router()

// Protect all user management capabilities behind your active authentication gate
router.use(requireAuth)

// ==========================================
// 1. CREATE USER ACCOUNT
// ==========================================
router.post("/", async (req: AuthenticatedRequest, res) => {
  try {
    // Only Administrators can explicitly spin up brand new employee nodes
    if (req.user?.role !== "ADMIN") {
      throw new AppError("Only admins can create user accounts", 403)
    }

    const { username, name, role, departmentId, password } =
      req.body as CreateUserRequest

    // Raw body sanity validations
    if (!username || !username.trim())
      throw new AppError("Username is required", 400)
    if (!name || !name.trim()) throw new AppError("Name is required", 400)
    if (!departmentId)
      throw new AppError("A primary department selection is required", 400)

    // Verify username availability across the environment scope
    const identityConflict = await prisma.user.findUnique({
      where: { username: username.trim().toLowerCase() },
    })
    if (identityConflict) {
      throw new AppError("This username is already taken", 400)
    }

    // Verify target department node exists before attempting mapping connections
    const targetDept = await prisma.department.findUnique({
      where: { id: departmentId },
    })
    if (!targetDept) {
      throw new AppError("Selected department does not exist", 404)
    }

    // Establish a secure system baseline hash password for initial enrollment
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        username: username.trim().toLowerCase(),
        name: name.trim(),
        role,
        password: hashedPassword,
        departments: {
          connect: { id: departmentId },
        },
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
        departments: true,
      },
    })

    return res.status(201).json({ success: true, data: newUser })
  } catch (error: any) {
    if (error instanceof AppError) throw error
    throw new AppError(error.message, 500)
  }
})

// ==========================================
// 2. READ ALL USERS (Hydrated with Departments & Counts)
// ==========================================
router.get("/", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
        departments: {
          select: { id: true, name: true },
        },
        _count: {
          select: { assignedTasks: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return res.json({ success: true, data: users })
  } catch (error: any) {
    if (error instanceof AppError) throw error
    throw new AppError(error.message, 500)
  }
})

// ==========================================
// 3. DELETION (Purge Profile Safely)
// ==========================================
router.delete("/:id", async (req: AuthenticatedRequest, res) => {
  try {
    if (req.user?.role !== "ADMIN") {
      throw new AppError("Only admins can purge user accounts", 403)
    }

    const { id } = req.params

    // Block self-destruct scenarios
    if (id === req.user.userId) {
      throw new AppError(
        "Self-destruction block: You cannot delete your own active administrator profile",
        400
      )
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: id as string },
      include: { _count: { select: { assignedTasks: true } } },
    })

    if (!targetUser) {
      throw new AppError("Target profile account not found", 404)
    }

    // Safety check: Prevent orphan foreign key states if tasks are assigned to this user
    if (targetUser._count.assignedTasks > 0) {
      throw new AppError(
        `Cannot drop user. This profile has ${targetUser._count.assignedTasks} active tasks assigned. Re-assign them first.`,
        400
      )
    }

    await prisma.user.delete({ where: { id: id as string } })

    return res.json({
      success: true,
      data: {
        message: "Account profile successfully removed from system databases",
      },
    })
  } catch (error: any) {
    if (error instanceof AppError) throw error
    throw new AppError(error.message, 500)
  }
})

export default router
