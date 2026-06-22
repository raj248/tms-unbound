import api from "@/lib/api"
import type { ApiResponse } from "@workspace/types"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

// ---------------- Admin Auth ------------------
export const loginUser = async (
  username: string,
  password: string
): Promise<any> => {
  const res = await api.post<any>(`${API_URL}/auth/login`, {
    username,
    password,
  })
  return res.data
}

export const checkUserSession = async () => {
  const res = await api.get<{
    authenticated: boolean
    user: {
      userId?: string
      name?: string
      username?: string
      role?: string
    }
  }>(`${API_URL}/auth/me`, {
    withCredentials: true,
  })
  return res
}

export const logoutUser = async (): Promise<ApiResponse<null>> => {
  const res = await api.post<ApiResponse<null>>(`${API_URL}/auth/logout`)
  sessionStorage.clear()
  return res.data
}
