import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateDepartmentRequest, Department } from "@workspace/types" // Adjust to your actual type exports
import api from "@/lib/api"

// --- 1. READ (Get All Departments) ---
export const useDepartments = () => {
  return useQuery<Department[], Error>({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data } = await api.get(`/departments`)
      return data.data
    },
  })
}

// --- 2. CREATE ---
export const useCreateDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newDepartment: CreateDepartmentRequest) => {
      const { data } = await api.post(`/departments`, newDepartment)
      return data
    },
    onSuccess: () => {
      // Invalidate the departments cache to automatically refresh dropdowns/lists
      queryClient.invalidateQueries({ queryKey: ["departments"] })
    },
  })
}

// --- 3. DELETE ---
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/departments/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] })

      // Optional: Invalidate tasks as well if deleting a department impacts task filtering
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })
}
