import { Router } from "express"
import { prisma } from "../config/db"
import {
  requireAuth,
  AuthenticatedRequest,
} from "../middlewares/auth.middleware"
import type { CreateDepartmentRequest } from "@workspace/types" // Adjust path to matching schema types
import { AppError } from "../utils/app-error.utils"

const router: Router = Router()

// Protect all department operations behind your active auth firewall
router.use(requireAuth)

// ==========================================
// 1. CREATE DEPARTMENT
// ==========================================
router.post("/", async (req: AuthenticatedRequest, res) => {
  try {
    const { name } = req.body as CreateDepartmentRequest

    if (!name || !name.trim()) {
      throw new AppError("Department name is required", 400)
    }

    // Check if department name already exists to handle uniqueness validation cleanly
    const existingDept = await prisma.department.findUnique({
      where: { name: name.trim() },
    })

    if (existingDept) {
      throw new AppError("A department with this name already exists", 400)
    }

    const newDepartment = await prisma.department.create({
      data: {
        name: name.trim(),
      },
    })

    return res.status(201).json({ success: true, data: newDepartment })
  } catch (error: any) {
    if (error instanceof AppError) throw error
    throw new AppError(error.message, 500)
  }
})

// ==========================================
// 2. READ ALL DEPARTMENTS
// ==========================================
router.get("/", async (_req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: { tasks: true }, // Attaches aggregate calculation metric
        },
      },
      orderBy: { name: "asc" },
    })

    return res.json({ success: true, data: departments })
  } catch (error: any) {
    if (error instanceof AppError) throw error
    throw new AppError(error.message, 500)
  }
})

// ==========================================
// 3. READ SINGLE DEPARTMENT (With Hydrated Tasks)
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!department) {
      throw new AppError("Department not found", 404)
    }

    return res.json({ success: true, data: department })
  } catch (error: any) {
    if (error instanceof AppError) throw error
    throw new AppError(error.message, 500)
  }
})

// ==========================================
// 4. DELETE DEPARTMENT
// ==========================================
router.delete("/:id", async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params

    // Restrict configuration destruction exclusively to authorized administrators
    if (req.user?.role !== "ADMIN") {
      throw new AppError("Only admins can remove departments", 403)
    }

    // Verify entity existence before attempting data purge
    const department = await prisma.department.findUnique({
      where: { id: id as string },
      include: {
        _count: {
          select: { tasks: { where: { status: { not: "COMPLETED" } } } },
        },
      },
    })

    if (!department) {
      throw new AppError("Department not found", 404)
    }

    // Guard rail: Prevent deletion if tasks are actively bound to this department profile
    if (department._count.tasks > 0) {
      throw new AppError(
        `Cannot delete department. There are ${department._count.tasks} tasks actively bound to it.`,
        400
      )
    }

    await prisma.department.delete({ where: { id: id as string } })

    return res.json({
      success: true,
      data: { message: "Department successfully removed" },
    })
  } catch (error: any) {
    if (error instanceof AppError) throw error
    throw new AppError(error.message, 500)
  }
})

export default router
