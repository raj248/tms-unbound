import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { MainLayout } from "@/layout/MainLayout"

import LoginPage from "@/login/Login"
import NotFoundPage from "@/pages/NotFound"
import SettingsPage from "@/pages/Settings"

import DepartmentDashboard from "@/department/dashboard/Dashboard"
import AdminDashboard from "@/admin/dashboard/AdminDashboard"
import RoleBasedRedirect from "@/components/auth/RoleBasedRedirect"

import AdminTasks from "@/admin/tasks/AdminTasks"
import DepartmentTasks from "@/department/tasks/Tasks"

import MetricsPage from "@/pages/Metrics"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
const queryClient = new QueryClient()

export function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                {/* Public */}
                <Route path="/" element={<LoginPage />} />

                {/* Protected — all children rendered inside MainLayout via <Outlet> */}
                <Route
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<RoleBasedRedirect />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/tasks" element={<AdminTasks />} />
                  <Route
                    path="/department/dashboard"
                    element={<DepartmentDashboard />}
                  />
                  <Route
                    path="/department/tasks"
                    element={<DepartmentTasks />}
                  />
                  <Route path="/metrics" element={<MetricsPage />} />
                  {/* <Route path="/profile" element={<ProfilePage />} /> */}
                  {/* <Route path="/profile/:id" element={<ProfilePage />} /> */}
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
