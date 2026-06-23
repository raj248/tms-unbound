export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

// Add this to your types definition file
export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  meta: {
    page: number
    limit: number
    totalCount: number
    hasMore: boolean
  }
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
  receivedNotifications?: NotificationStatus[]
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

export interface Notification {
  id: string
  title: string
  body: string
  senderId: string | null
  senderName: string
  targetDeptId: string | null // Null if broadcasted to all admins
  isAdminOnly: boolean
  createdAt: string | Date
}

export interface NotificationStatus {
  id: string
  notificationId: string
  userId: string
  isRead: boolean
  readAt: string | Date | null

  notification?: Notification
}

/**
 * Represents an item in a user's notification feed center.
 * It contains the individual read status line along with the embedded message body.
 */
export interface NotificationHistoryItem extends NotificationStatus {
  notification: Notification
}

/**
 * Input format for explicitly dispatching a custom notification via the API.
 * e.g., POST /api/notifications/send
 */
export interface SendNotificationRequest {
  title: string
  body: string
  targetDeptId?: string // Target a specific department (loops in admins too)
  isAdminOnly?: boolean // Target admins exclusively
}

/**
 * A Task along with its attached relational context
 */
export interface TaskWithDetails extends Task {
  department: Department
  assignee: Omit<User, "role" | "createdAt"> | null
  remarks: Remark[]
}

/**
 * A Department showing its full group assignment
 */
export interface DepartmentWithUsers extends Department {
  users: Omit<User, "createdAt">[]
  _count?: {
    tasks: number
    users: number
  }
}

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
  authorName: string
}

export interface CreateUserRequest {
  username: string
  name: string
  password: string
  role: Role
  departmentId: string
}

export interface UpdateTaskRequest {
  name?: string
  description?: string
  status?: TaskStatus
  departmentId?: string
  assigneeId?: string | null
  deadline?: string | Date | null
}

export * from "./mockData"
