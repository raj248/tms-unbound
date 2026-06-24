import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query"
import type {
  NotificationHistoryItem,
  PaginatedResponse,
  SendNotificationRequest,
} from "@workspace/types"
import api from "@/lib/api"

// --- UPDATED READ: PAGINATED INFINITE FEED ---
export const useNotifications = (limit = 20) => {
  return useInfiniteQuery<PaginatedResponse<NotificationHistoryItem>, Error>({
    queryKey: ["notifications", "history", { limit }],
    queryFn: async ({ pageParam = 1 }) => {
      // Axios call appending the query params over the wire
      const { data } = await api.get<
        PaginatedResponse<NotificationHistoryItem>
      >(`/notifications?page=${pageParam}&limit=${limit}`)
      return data
    },
    initialPageParam: 1,
    // Determines the next page index to request based on backend metadata values
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta.hasMore) return undefined
      return lastPage.meta.page + 1
    },
    // Background refresh sync window configuration
    refetchInterval: 30 * 1000,
  })
}
// --- 2. UPDATE (Mark a Single Notification as Read) ---
export const useMarkAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (statusId: string) => {
      const { data } = await api.put(`/notifications/${statusId}/read`)
      return data.data
    },
    // Optimistic Update: Instantly flip the read state in UI cache for latency-free feedback
    onMutate: async (statusId) => {
      await queryClient.cancelQueries({
        queryKey: ["notifications", "history"],
      })

      const previousHistory = queryClient.getQueryData<
        NotificationHistoryItem[]
      >(["notifications", "history"])

      if (previousHistory) {
        queryClient.setQueryData<NotificationHistoryItem[]>(
          ["notifications", "history"],
          previousHistory.map((item) =>
            item.id === statusId
              ? { ...item, isRead: true, readAt: new Date() }
              : item
          )
        )
      }

      return { previousHistory }
    },
    // Roll back cache if network connection fails dropping updates over the air
    onError: (_err, _statusId, context) => {
      if (context?.previousHistory) {
        queryClient.setQueryData(
          ["notifications", "history"],
          context.previousHistory
        )
      }
    },
    // Ensure sync alignment on completion
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "history"] })
    },
  })
}

// --- 3. CREATE (Manually Dispatch/Send a Custom Notification) ---
export const useSendNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: SendNotificationRequest) => {
      const { data } = await api.post(`/notifications/send`, payload)
      return data.data
    },
    onSuccess: () => {
      // Invalidate target metrics histories
      queryClient.invalidateQueries({ queryKey: ["notifications", "history"] })
    },
  })
}
