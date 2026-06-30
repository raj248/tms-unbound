import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type {
  User,
  CreateUserRequest,
  ChangePasswordPayload,
  ApiResponse,
} from "@workspace/types"
import api from "@/lib/api"
import { toast } from "@workspace/ui/components/sonner"

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
      // show toast
      toast.success("User deleted successfully.")
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    },
  })
}

interface ChangePasswordArgs {
  userId: string
  payload: ChangePasswordPayload
}

/**
 * --- MUTATION (Change or Reset User Password) ---
 */
export const useChangePassword = () => {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse<{ message: string }>,
    Error,
    ChangePasswordArgs
  >({
    mutationFn: async ({ userId, payload }) => {
      const { data } = await api.patch(`/users/${userId}/password`, payload)
      return data
    },
    onSuccess: (data) => {
      // Refresh the system users list array cache to maintain structural consistency
      queryClient.invalidateQueries({ queryKey: ["users"] })

      console.log(
        `[Security Engine] Password operation success: ${data.data.message}`
      )
    },
  })
}
