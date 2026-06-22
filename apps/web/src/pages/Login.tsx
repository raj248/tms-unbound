import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Button } from "@workspace/ui/components/button"
import { toast } from "@workspace/ui/components/sonner" // or "@workspace/ui" depending on your export layout

import api from "@/lib/api"
import { useAuth } from "@/context/auth-context"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { refresh } = useAuth()
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Missing fields", {
        description: "Please fill in all fields.",
      })
      return
    }

    setIsLoading(true)

    try {
      // Adjust the endpoint to match your Express backend route
      const response = await api.post("/auth/login", {
        username: email,
        password,
      })

      // Assuming your backend returns { token: "JWT_STRING_HERE" }
      const { accessToken, refreshToken } = response.data
      console.log(response.data)
      if (accessToken) {
        sessionStorage.setItem("accessToken", accessToken)
        sessionStorage.setItem("refreshToken", refreshToken)
        toast.success("Welcome back!", { description: "Login successful." })
        await refresh()
        navigate("/dashboard") // Redirect to your authenticated dashboard layout
      }
    } catch (error: any) {
      // Your Axios interceptor lets 401s on login pass through here cleanly
      console.log(error)
      const errorMessage =
        error.response?.data?.message || "Invalid email or password."
      toast.error("Login Failed", { description: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Sign in
          </CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
