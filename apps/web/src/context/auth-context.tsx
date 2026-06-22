import React, { createContext, useContext, useEffect, useState } from "react"
import { checkUserSession, logoutUser } from "@/service/authApi"
import type { Role, User } from "@workspace/types"

interface AuthContextType {
  isUser: boolean
  isAdmin: boolean
  loading: boolean
  user: User | null // ← null means "not logged in"
  logout: () => Promise<void>
  refresh: () => Promise<any>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isUser, setIsUser] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null) // ← start as null

  const refresh = async () => {
    setLoading(true)
    const res = await checkUserSession().catch((err) => {
      console.error(err)
      return { success: false, data: null }
    })

    if (res.data?.authenticated && res.data) {
      setIsUser(res.data.authenticated === true)
      setIsAdmin(res.data.user.role === "ADMIN")
      setUser({
        id: res.data.user.userId ?? "",
        name: res.data.user.name ?? "",
        username: res.data.user.username ?? "",
        role: (res.data.user.role as Role) ?? "",
      })
    } else {
      setIsUser(false)
      setIsAdmin(false)
      setUser(null) // ← explicitly null on failure
    }

    setLoading(false)
    return res
  }

  const logout = async () => {
    await logoutUser().catch(console.error)
    sessionStorage.clear()
    localStorage.clear()
    setIsUser(false)
    setIsAdmin(false)
    setUser(null) // ← null, not an empty object
    setLoading(false) // ← was missing; caused infinite loading after logout
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <AuthContext.Provider
      value={{ isUser, isAdmin, loading, user, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
