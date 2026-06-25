import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { TaskModalProvider } from "@/context/task-modal-context"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { MainLayout } from "@/layout/MainLayout"

import LoginPage from "@/pages/auth/Login"
import Dashboard from "@/pages/department/dashboard/Dashboard"
import Tasks from "@/pages/Tasks"
import MetricsPage from "@/pages/Metrics"
import NotFoundPage from "@/pages/NotFound"
import SettingsPage from "@/pages/Settings"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { usePushNotifications } from "./hooks/usePushNotification"
import { useEffect } from "react"
const queryClient = new QueryClient()

export function App() {
  const { onForegroundMessage, permission } = usePushNotifications()
  useEffect(() => {
    if (permission === "granted") {
      onForegroundMessage()
    }
  }, [permission])
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TaskModalProvider>
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
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/metrics" element={<MetricsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>

                  {/* Catch-all */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </TaskModalProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
