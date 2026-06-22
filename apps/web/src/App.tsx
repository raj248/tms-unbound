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

export function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
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
              <Route
                path="/department/dashboard"
                element={<DepartmentDashboard />}
              />
              {/* <Route path="/profile" element={<ProfilePage />} /> */}
              {/* <Route path="/profile/:id" element={<ProfilePage />} /> */}
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
