import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { User, CreateUserRequest } from "@workspace/types"
import api from "@/lib/api"

// --- 1. READ (Get All Users) ---
export const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get(`/users`)
      // Grabs the data field from your standard Express response layout { success: true, data: [...] }
      return data.data
    },
  })
}

// --- 2. CREATE (Register/Add User) ---
export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newUser: CreateUserRequest) => {
      const { data } = await api.post(`/users`, newUser)
      return data.data
    },
    onSuccess: () => {
      // Invalidate the main users query cache to trigger a background update
      queryClient.invalidateQueries({ queryKey: ["users"] })

      // Also invalidate departments since a user count metric inside a department might have updated
      queryClient.invalidateQueries({ queryKey: ["departments"] })
    },
  })
}

// --- 3. DELETE (Purge User Profile) ---
export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/users/${id}`)
      return data.data
    },
    onSuccess: () => {
      // Flush cache lists instantly to visually wipe the profile card from view layouts
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["departments"] })
    },
  })
}
