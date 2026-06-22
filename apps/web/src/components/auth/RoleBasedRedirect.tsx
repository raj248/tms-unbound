import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/auth-context"

const RoleBasedRedirect: React.FC = () => {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (user.role === "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />
  }

  return <Navigate to="/department/dashboard" replace />
}

export default RoleBasedRedirect
