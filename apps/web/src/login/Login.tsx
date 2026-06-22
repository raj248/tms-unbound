import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Button } from "@workspace/ui/components/button"
import { toast } from "@workspace/ui/components/sonner"
import { 
  IconLayoutDashboard, 
  IconCheck, 
  IconUsers, 
  IconChartBar, 
  IconBell,
  IconEye,
  IconEyeOff,
  IconBrandGoogle,
  IconBrandGithub
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
        
        const sessionRes = await refresh()
        
        if (sessionRes?.data?.user?.role === "ADMIN") {
          navigate("/admin/dashboard") 
        } else {
          navigate("/department/dashboard") 
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Invalid email or password."
      toast.error("Login Failed", { description: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-white text-zinc-950 font-sans relative overflow-hidden">
      
      {/* Global Right Side Decorative Background blobs (visible mainly on right side/mobile) */}
      <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-100/60 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-blue-50/80 blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-purple-50/60 blur-[80px]" />
      </div>

      {/* Left side - Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 p-16 relative overflow-hidden border-r border-zinc-100">
        {/* Decorative backgrounds for left side */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[80%] h-[80%] rounded-full bg-blue-200/40 blur-[140px]" />
          <div className="absolute bottom-[0%] right-[0%] w-[70%] h-[70%] rounded-full bg-indigo-200/30 blur-[120px]" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom_right,white,transparent)] opacity-60"></div>
        </div>

        <div className="relative z-10 flex flex-col items-start gap-12 max-w-xl w-full">
          <div className="flex items-center gap-4">
            <img src="/unbound_logo.png" alt="Unbound Script Logo" className="h-12 w-auto object-contain" />
            <span className="text-3xl font-extrabold tracking-tight text-zinc-900">Unbound Script</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl xl:text-6xl font-black tracking-tight text-zinc-900 leading-[1.1]">
              Manage your work, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">effortlessly</span>
            </h1>
            <p className="text-zinc-600 text-xl leading-relaxed max-w-lg">
              Stay on top of every project, deadline, and collaboration — all in one beautifully designed workspace.
            </p>
          </div>
          
          <div className="space-y-8 pt-6 w-full">
            <div className="flex items-center gap-5 group">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-zinc-100 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                <IconCheck className="h-6 w-6 text-indigo-600" stroke={2.5} />
              </div>
              <span className="text-zinc-800 font-semibold text-lg">Smart task prioritization with AI assist</span>
            </div>
            <div className="flex items-center gap-5 group">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-zinc-100 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                <IconUsers className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="text-zinc-800 font-semibold text-lg">Real-time team collaboration boards</span>
            </div>
            <div className="flex items-center gap-5 group">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-zinc-100 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                <IconChartBar className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="text-zinc-800 font-semibold text-lg">Progress analytics and rich reporting</span>
            </div>
            <div className="flex items-center gap-5 group">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-zinc-100 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                <IconBell className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="text-zinc-800 font-semibold text-lg">Deadline reminders and smart alerts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form & Mobile Header */}
      <div className="relative z-10 flex flex-1 flex-col items-center lg:justify-center p-0 lg:p-12 overflow-y-auto backdrop-blur-[2px]">
        
        {/* Mobile Header Block */}
        <div className="lg:hidden w-full bg-gradient-to-br from-indigo-50 via-blue-50/50 to-white px-6 pt-16 pb-12 flex flex-col items-center text-center relative overflow-hidden mb-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border-b border-zinc-100">
          <div className="absolute top-[-20%] right-[-20%] w-[150%] h-[150%] rounded-full bg-indigo-200/30 blur-[60px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[100%] h-[100%] rounded-full bg-blue-300/20 blur-[50px] pointer-events-none" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-40"></div>
          
          <div className="relative z-10 flex items-center gap-3 mb-8">
            <img src="/unbound_logo.png" alt="Unbound Script Logo" className="h-10 w-auto object-contain" />
            <span className="text-2xl font-extrabold text-zinc-900 tracking-tight">Unbound Script</span>
          </div>
          
          <h2 className="relative z-10 text-3xl font-black text-zinc-900 mb-3 tracking-tight">Welcome back!</h2>
          <p className="relative z-10 text-zinc-600 font-medium text-lg">Sign in to your workspace</p>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[480px] px-6 lg:px-0 space-y-12 pb-12">
          
          {/* Desktop Heading */}
          <div className="hidden lg:flex flex-col space-y-3">
            <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900">Welcome back</h2>
            <p className="text-zinc-500 font-medium text-lg">
              Sign in to continue to your workspace
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold text-zinc-700 text-sm uppercase tracking-wider">
                  Email address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-16 px-5 text-lg rounded-xl border-zinc-200 bg-white/80 backdrop-blur-sm placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 transition-all shadow-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="font-bold text-zinc-700 text-sm uppercase tracking-wider">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-16 px-5 text-lg rounded-xl border-zinc-200 bg-white/80 backdrop-blur-sm placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 transition-all shadow-sm pr-14"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-indigo-600 transition-colors p-1"
                  >
                    {showPassword ? <IconEyeOff size={24} /> : <IconEye size={24} />}
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
                  className="rounded-md border-zinc-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5 transition-all" 
                />
                <Label htmlFor="remember" className="font-medium text-zinc-700 text-base cursor-pointer select-none">Remember me</Label>
              </div>
              <a href="#" className="text-base font-bold text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-4 transition-all" tabIndex={-1}>
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full h-16 text-lg font-bold bg-zinc-900 hover:bg-zinc-800 text-white shadow-md rounded-xl transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
