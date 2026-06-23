import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateTaskRequest, Task } from "@workspace/types"
import api from "@/lib/api"

// --- 1. READ (Get All Tasks) ---
export const useTasks = () => {
  return useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await api.get(`/tasks`)
      return data
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
    },
  })
}
