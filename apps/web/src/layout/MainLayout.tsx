import { Outlet } from "react-router-dom"
import { Toaster } from "@workspace/ui/components/sonner"
import { Header } from "./header"

export function MainLayout() {
  return (
    <div className="flex min-h-svh">
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6">
          <Outlet /> {/* child routes render here */}
          <Toaster />
        </main>
      </div>
    </div>
  )
}
