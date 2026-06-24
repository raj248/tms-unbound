import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateTaskRequest, Task, TaskWithDetails } from "@workspace/types"
import api from "@/lib/api"

// --- 1. READ (Get All Tasks) ---
export const useTasks = (
  status?: string | null,
  departmentId?: string | null
) => {
  return useQuery<TaskWithDetails[], Error>({
    queryKey: ["tasks", { status, departmentId }],
    queryFn: async () => {
      const { data } = await api.get(
        `/tasks?status=${status || ""}&departmentId=${departmentId || ""}`
      )
      return data.data
    },
  })
}

// --- 1.b. READ (Paginated Tasks) ---
export const usePaginatedTasks = (params: {
  page: number
  limit: number
  search?: string
  status?: string
  sortOrder?: "asc" | "desc"
  departmentId?: string
  startDate?: string
  endDate?: string
  enabled?: boolean
}) => {
  return useQuery<{ data: TaskWithDetails[]; total: number }, Error>({
    queryKey: ["tasks-paginated", params],
    enabled: params.enabled !== false,
    queryFn: async () => {
      const query = new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
        ...(params.search && { search: params.search }),
        ...(params.status && { status: params.status }),
        ...(params.sortOrder && { sortOrder: params.sortOrder }),
        ...(params.departmentId && { departmentId: params.departmentId }),
        ...(params.startDate && { startDate: params.startDate }),
        ...(params.endDate && { endDate: params.endDate }),
      }).toString()

      const { data } = await api.get(`/tasks?${query}`)
      return { data: data.data, total: data.total }
    },
  })
}

// --- 2. CREATE ---
export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newTask: CreateTaskRequest) => {
      const { data } = await api.post(`/tasks`, newTask)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      queryClient.invalidateQueries({ queryKey: ["tasks-paginated"] })
    },
  })
}

// --- 3. UPDATE ---
export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
      const { data } = await api.put(`/tasks/${id}`, updates)
      return data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["tasks-paginated"] })
    },
  })
}

// --- 4. DELETE ---
export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/tasks/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      queryClient.invalidateQueries({ queryKey: ["tasks-paginated"] })
    },
  })
}
