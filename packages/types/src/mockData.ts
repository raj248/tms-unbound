import {
  User,
  Department,
  Task,
  Remark,
  TaskWithDetails,
  DepartmentWithUsers,
  ApiResponse,
  AuthResponse,
  AuthVerifyResponse,
} from "./index" // Adjust relative import path as needed

// ==========================================
// 1. BASE ENTITY MOCKS
// ==========================================

export const mockUsers: User[] = [
  {
    id: "cuj1234567890user1",
    username: "bell_dev",
    name: "Bell Cranel",
    role: "ADMIN",
  },
  {
    id: "cuj1234567890user2",
    username: "john_doe",
    name: "John Doe",
    role: "USER",
  },
  {
    id: "cuj1234567890user3",
    username: "jane_smith",
    name: "Jane Smith",
    role: "USER",
  },
]

export const mockDepartments: Department[] = [
  {
    id: "cuj1234567890dept1",
    name: "Engineering",
    createdAt: "2026-01-15T08:30:00.000Z",
    updatedAt: "2026-01-15T08:30:00.000Z",
  },
  {
    id: "cuj1234567890dept2",
    name: "Quality Assurance",
    createdAt: "2026-02-01T10:00:00.000Z",
    updatedAt: "2026-02-18T14:22:00.000Z",
  },
  {
    id: "cuj1234567890dept3",
    name: "Operations",
    createdAt: "2026-03-10T09:15:00.000Z",
    updatedAt: "2026-03-10T09:15:00.000Z",
  },
]

export const mockTasks: Task[] = [
  {
    id: "cuj1234567890task1",
    name: "Fix CORS issue on Auth Router",
    description:
      "Update the Express backend initialization to pass cross-origin access rules configurations mapping directly to port 5173 rather than wildcards.",
    status: "COMPLETED",
    departmentId: "cuj1234567890dept1",
    assigneeId: "cuj1234567890user1",
    assigneeName: "Bell Cranel",
    deadline: "2026-06-25T18:00:00.000Z",
    createdAt: "2026-06-20T04:11:00.000Z",
    updatedAt: "2026-06-22T23:30:00.000Z",
  },
  {
    id: "cuj1234567890task2",
    name: "Design Prisma Migration Profile",
    description:
      "Shift baseline tracking indices from autoincrement integer rows to global CUID arrays and build standard relational cascading profiles.",
    status: "IN_PROGRESS",
    departmentId: "cuj1234567890dept1",
    assigneeId: "cuj1234567890user2",
    assigneeName: "John Doe",
    deadline: "2026-06-30T23:59:59.000Z",
    createdAt: "2026-06-22T11:00:00.000Z",
    updatedAt: "2026-06-22T11:45:00.000Z",
  },
  {
    id: "cuj1234567890task3",
    name: "Write Unit Tests for Payment Webhooks",
    description:
      "Ensure incoming payload validation schema captures transaction events correctly even when underlying database clusters encounter heavy concurrency.",
    status: "PENDING",
    departmentId: "cuj1234567890dept2",
    assigneeId: null,
    assigneeName: null,
    deadline: null,
    createdAt: "2026-06-22T15:20:00.000Z",
    updatedAt: "2026-06-22T15:20:00.000Z",
  },
]

export const mockRemarks: Remark[] = [
  {
    id: "cuj1234567890rem1",
    text: "Initial exploration shows that wildcards collide with credentialed browser requests.",
    taskId: "cuj1234567890task1",
    authorName: "Bell Cranel",
    createdAt: "2026-06-20T06:00:00.000Z",
  },
  {
    id: "cuj1234567890rem2",
    text: "CORS parameters configured, tested locally against Vite 8 dev client workspace. Closing task out.",
    taskId: "cuj1234567890task1",
    authorName: "Bell Cranel",
    createdAt: "2026-06-22T23:30:00.000Z",
  },
  {
    id: "cuj1234567890rem3",
    text: "Draft schemas set up. Awaiting peer code evaluation check before executing push sequence.",
    taskId: "cuj1234567890task2",
    authorName: "John Doe",
    createdAt: "2026-06-22T13:10:00.000Z",
  },
]

// ==========================================
// 2. COMPLEX / RELATIONAL HYDRATED MOCKS
// ==========================================

export const mockTasksWithDetails: TaskWithDetails[] = [
  {
    ...mockTasks[0],
    department: mockDepartments[0],
    assignee: {
      id: "cuj1234567890user1",
      username: "bell_dev",
      name: "Bell Cranel",
    },
    remarks: [mockRemarks[0], mockRemarks[1]],
  },
  {
    ...mockTasks[1],
    department: mockDepartments[0],
    assignee: {
      id: "cuj1234567890user2",
      username: "john_doe",
      name: "John Doe",
    },
    remarks: [mockRemarks[2]],
  },
  {
    ...mockTasks[2],
    department: mockDepartments[1],
    assignee: null,
    remarks: [],
  },
]

export const mockDepartmentsWithUsers: DepartmentWithUsers[] = [
  {
    ...mockDepartments[0],
    users: [
      {
        id: "cuj1234567890user1",
        username: "bell_dev",
        name: "Bell Cranel",
        role: "ADMIN",
      },
      {
        id: "cuj1234567890user2",
        username: "john_doe",
        name: "John Doe",
        role: "USER",
      },
    ],
    _count: {
      tasks: 2,
      users: 2,
    },
  },
  {
    ...mockDepartments[1],
    users: [
      {
        id: "cuj1234567890user3",
        username: "jane_smith",
        name: "Jane Smith",
        role: "USER",
      },
    ],
    _count: {
      tasks: 1,
      users: 1,
    },
  },
]

// ==========================================
// 3. API RESPONSE / NETWORK TRAFFIC MOCKS
// ==========================================

export const mockLoginResponse: ApiResponse<AuthResponse> = {
  success: true,
  data: {
    message: "Login successful",
    accessToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImN1ajEyMzQ1Njc4OTB1c2VyMSIsInVzZXJuYW1lIjoiYmVsbF9kZXYiLCJyb2xlIjoiQURNSU4ifQ",
    refreshToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImN1ajEyMzQ1Njc4OTB1c2VyMSIsInVzZXJuYW1lIjoiYmVsbF9kZXYiLCJyb2xlIjoiQURNSU4ifQ",
    user: mockUsers[0],
  },
}

export const mockAuthVerifyResponse: ApiResponse<AuthVerifyResponse> = {
  success: true,
  data: {
    authenticated: true,
    user: mockUsers[0],
  },
}

export const mockTaskListResponse: ApiResponse<TaskWithDetails[]> = {
  success: true,
  data: mockTasksWithDetails,
}

export const mockApiFailureResponse: ApiResponse<null> = {
  success: false,
  data: null,
  error: "Unauthorized access: Session signature token has expired.",
}
