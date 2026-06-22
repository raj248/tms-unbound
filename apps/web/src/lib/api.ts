import axios from "axios"
import { toast } from "@workspace/ui/components/sonner" // or 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

// Interceptor to inject the JWT header automatically
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null
    const originalRequest = error.config

    // Get current path to check if we are already on the Login page
    const currentPath = window.location.pathname

    if (status === 401) {
      // 1. If we are already on the login page, don't redirect or toast
      // This allows the login form to show its own "Invalid Credentials" error
      if (
        currentPath === "/" ||
        originalRequest.url.includes("/auth/login") ||
        originalRequest.url.includes("/auth/update-password")
      ) {
        return Promise.reject(error)
      }

      // 2. If we are anywhere else, it means the session actually expired
      toast.error("Session Expired", {
        description: "Please login again to continue.",
      })

      // Redirect to login
      window.location.href = "/"
    }

    if (status === 403) {
      toast.error("Access Denied", {
        description: "You don't have permission to perform this action.",
      })
      // window.location.href = "/";
      // We don't usually redirect for 403, just block the action
    }

    return Promise.reject(error)
  }
)
export default api
