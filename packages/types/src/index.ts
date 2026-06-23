export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

export type Role = "USER" | "ADMIN"

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "BLOCKED" | "COMPLETED"

export interface User {
  id: string
  username: string
  name: string | null
  role: Role

  // Relations (Optional, to handle include blocks cleanly)
  departments?: Department[]
  assignedTasks?: Task[]
}

export interface Department {
  id: string
  name: string
  createdAt: string | Date
  updatedAt: string | Date
}

export interface Task {
  id: string
  name: string
  description: string | null
  status: TaskStatus
  departmentId: string
  assigneeId: string | null
  assigneeName: string | null
  deadline: string | null | Date
  createdAt: string | Date
  updatedAt: string | Date
}

export interface Remark {
  id: string
  text: string
  taskId: string
  authorName: string
  createdAt: string | Date
}

// A Task along with its attached relational context
export interface TaskWithDetails extends Task {
  department: Department
  assignee: Omit<User, "role" | "createdAt"> | null
  remarks: Remark[]
}

// A Department showing its full group assignment
export interface DepartmentWithUsers extends Department {
  users: Omit<User, "createdAt">[]
  _count?: {
    tasks: number
    users: number
  }
}

// Auth Payloads
export interface LoginRequest {
  username: string
  password: string
}

export interface AuthResponse {
  message: string
  accessToken: string
  refreshToken: string
  user: User
}

export interface AuthVerifyResponse {
  authenticated: boolean
  user: User
}

// Creation Payloads
export interface CreateTaskRequest {
  name: string
  description?: string
  departmentId: string
  deadline?: string | Date
}

export interface CreateDepartmentRequest {
  name: string
}

export interface CreateRemarkRequest {
  taskId: string
  text: string
  authorName: string // Captured from session on backend
}

// Update Payloads
export interface UpdateTaskRequest {
  name?: string
  description?: string
  status?: TaskStatus
  departmentId?: string
  assigneeId?: string | null
  deadline?: string | Date | null
}

export * from "./mockData"
