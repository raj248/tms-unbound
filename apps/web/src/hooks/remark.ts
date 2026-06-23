import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Remark, CreateRemarkRequest } from "@workspace/types"
import api from "@/lib/api"

// --- 1. READ (Get All Remarks for a Specific Task) ---
export const useRemarks = (taskId: string) => {
  return useQuery<Remark[], Error>({
    queryKey: ["remarks", taskId],
    queryFn: async () => {
      const { data } = await api.get(`/remarks/task/${taskId}`)
      // Expecting standard response structure { success: true, data: [...] }
      return data.data
    },
    enabled: !!taskId, // Prevent querying if taskId is undefined or empty
  })
}

// --- 2. CREATE (Add a Remark) ---
export const useCreateRemark = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newRemark: Omit<CreateRemarkRequest, "authorName">) => {
      const { data } = await api.post(`/remarks`, newRemark)
      return data.data
    },
    onSuccess: (data: Remark) => {
      const { taskId } = data

      // Refresh the specific remark timeline thread
      queryClient.invalidateQueries({ queryKey: ["remarks", taskId] })

      // Also invalidate the detailed task query since it embeds the remarks array
      //   queryClient.invalidateQueries({ queryKey: ["tasks", taskId] })

      // Also invalidate the detailed task query since it embeds the remarks array
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })
}

// --- 3. DELETE (Remove a Remark) ---
export const useDeleteRemark = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: { id: string; taskId: string }) => {
      const { data } = await api.delete(`/remarks/${id}`)
      return data.data
    },
    onSuccess: (_data, variables) => {
      const { taskId } = variables

      // Sync caches to immediately drop the comment from the screen layout
      queryClient.invalidateQueries({ queryKey: ["remarks", taskId] })
      //   queryClient.invalidateQueries({ queryKey: ["tasks", taskId] })

      // Also invalidate the detailed task query since it embeds the remarks array
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })
}
