import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Button } from "@workspace/ui/components/button"
import { toast } from "@workspace/ui/components/sonner"
import {
  IconCheck,
  IconUsers,
  IconChartBar,
  IconBell,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react"

import api from "@/lib/api"
import { useAuth } from "@/context/auth-context"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
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
      const response = await api.post("/auth/login", {
        username: email,
        password,
      })

      const { accessToken, refreshToken } = response.data
      if (accessToken) {
        sessionStorage.setItem("accessToken", accessToken)
        sessionStorage.setItem("refreshToken", refreshToken)
        toast.success("Welcome back!", { description: "Login successful." })

        await refresh()
        navigate("/dashboard")
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      const errorMessage =
        error.response?.data?.message || "Invalid email or password."
      toast.error("Login Failed", { description: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-white font-sans text-zinc-950">
      {/* Global Right Side Decorative Background blobs (visible mainly on right side/mobile) */}
      <div className="pointer-events-none absolute top-0 right-0 z-0 h-full w-full overflow-hidden lg:w-1/2">
        <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-indigo-100/60 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] h-[600px] w-[600px] rounded-full bg-blue-50/80 blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] h-[300px] w-[300px] rounded-full bg-purple-50/60 blur-[80px]" />
      </div>

      {/* Left side - Branding (Desktop) */}
      <div className="relative hidden flex-col justify-center overflow-hidden border-r border-zinc-100 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 p-16 lg:flex lg:w-1/2">
        {/* Decorative backgrounds for left side */}
        <div className="pointer-events-none absolute top-0 left-0 z-0 h-full w-full overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] h-[80%] w-[80%] rounded-full bg-blue-200/40 blur-[140px]" />
          <div className="absolute right-[0%] bottom-[0%] h-[70%] w-[70%] rounded-full bg-indigo-200/30 blur-[120px]" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom_right,white,transparent)] opacity-60"></div>
        </div>

        <div className="relative z-10 flex w-full max-w-xl flex-col items-start gap-12">
          <div className="flex items-center gap-4">
            <img
              src="/unbound_logo.png"
              alt="Unbound Script Logo"
              className="h-20 w-auto object-contain"
            />
            <span className="text-4xl font-extrabold tracking-tight text-zinc-900">
              Unbound Script
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl leading-[1.1] font-black tracking-tight text-zinc-900 xl:text-6xl">
              Manage your work,{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                effortlessly
              </span>
            </h1>
            <p className="max-w-lg text-xl leading-relaxed text-zinc-600">
              Stay on top of every project, deadline, and collaboration — all in
              one beautifully designed workspace.
            </p>
          </div>

          <div className="w-full space-y-8 pt-6">
            <div className="group flex items-center gap-5">
              <div className="rounded-xl border border-zinc-100 bg-white p-3 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                <IconCheck className="h-6 w-6 text-indigo-600" stroke={2.5} />
              </div>
              <span className="text-lg font-semibold text-zinc-800">
                Smart task prioritization with AI assist
              </span>
            </div>
            <div className="group flex items-center gap-5">
              <div className="rounded-xl border border-zinc-100 bg-white p-3 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                <IconUsers className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="text-lg font-semibold text-zinc-800">
                Real-time team collaboration boards
              </span>
            </div>
            <div className="group flex items-center gap-5">
              <div className="rounded-xl border border-zinc-100 bg-white p-3 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                <IconChartBar className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="text-lg font-semibold text-zinc-800">
                Progress analytics and rich reporting
              </span>
            </div>
            <div className="group flex items-center gap-5">
              <div className="rounded-xl border border-zinc-100 bg-white p-3 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                <IconBell className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="text-lg font-semibold text-zinc-800">
                Deadline reminders and smart alerts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form & Mobile Header */}
      <div className="relative z-10 flex flex-1 flex-col items-center overflow-y-auto p-0 backdrop-blur-[2px] lg:justify-center lg:p-12">
        {/* Mobile Header Block */}
        <div className="relative mb-10 flex w-full flex-col items-center overflow-hidden border-b border-zinc-100 bg-gradient-to-br from-indigo-50 via-blue-50/50 to-white px-6 pt-16 pb-12 text-center shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] lg:hidden">
          <div className="pointer-events-none absolute top-[-20%] right-[-20%] h-[150%] w-[150%] rounded-full bg-indigo-200/30 blur-[60px]" />
          <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-[100%] w-[100%] rounded-full bg-blue-300/20 blur-[50px]" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-40"></div>

          <div className="relative z-10 mb-8 flex items-center gap-3">
            <img
              src="/unbound_logo.png"
              alt="Unbound Script Logo"
              className="h-16 w-auto object-contain"
            />
            <span className="text-3xl font-extrabold tracking-tight text-zinc-900">
              Unbound Script
            </span>
          </div>

          <h2 className="relative z-10 mb-3 text-3xl font-black tracking-tight text-zinc-900">
            Welcome back!
          </h2>
          <p className="relative z-10 text-lg font-medium text-zinc-600">
            Sign in to your workspace
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[480px] space-y-12 px-6 pb-12 lg:px-0">
          {/* Desktop Heading */}
          <div className="hidden flex-col space-y-3 lg:flex">
            <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900">
              Welcome back
            </h2>
            <p className="text-lg font-medium text-zinc-500">
              Sign in to continue to your workspace
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-bold tracking-wider text-zinc-700 uppercase"
                >
                  Username
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="text"
                    placeholder="username@company"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-16 rounded-xl border-zinc-200 bg-white/80 px-5 text-lg shadow-sm backdrop-blur-sm transition-all placeholder:text-zinc-400 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-bold tracking-wider text-zinc-700 uppercase"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-16 rounded-xl border-zinc-200 bg-white/80 px-5 pr-14 text-lg shadow-sm backdrop-blur-sm transition-all placeholder:text-zinc-400 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-5 -translate-y-1/2 p-1 text-zinc-400 transition-colors hover:text-indigo-600"
                  >
                    {showPassword ? (
                      <IconEyeOff size={24} />
                    ) : (
                      <IconEye size={24} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-5 w-5 rounded-md border-zinc-300 text-indigo-600 transition-all focus:ring-indigo-500"
                />
                <Label
                  htmlFor="remember"
                  className="cursor-pointer text-base font-medium text-zinc-700 select-none"
                >
                  Remember me
                </Label>
              </div>
              <a
                href="#"
                className="text-base font-bold text-indigo-600 underline-offset-4 transition-all hover:text-indigo-700 hover:underline"
                tabIndex={-1}
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="h-16 w-full rounded-xl bg-zinc-900 text-lg font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-xl active:translate-y-0"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
