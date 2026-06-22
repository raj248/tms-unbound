import { useState } from "react"
import { IconLayoutDashboard, IconListDetails, IconChartBar, IconClock, IconSettings, IconMenu2 } from "@tabler/icons-react"
import Dashboard from "./department/dashboard/Dashboard"
import Tasks from "./department/tasks/Tasks"
import { Sheet, SheetContent, SheetTrigger } from "@workspace/ui/components/sheet"
import { Button } from "@workspace/ui/components/button"

export function App() {
  const [activePage, setActivePage] = useState<"dashboard" | "tasks">("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const NavLinks = ({ onClick = () => {} }: { onClick?: () => void }) => (
    <>
      <Button
        variant={activePage === "dashboard" ? "secondary" : "ghost"}
        className={`w-full justify-start gap-3 px-3 ${activePage === "dashboard" ? "bg-blue-50 text-blue-700 hover:bg-blue-50" : "text-foreground/70"}`}
        onClick={() => {
          setActivePage("dashboard")
          onClick()
        }}
      >
        <IconLayoutDashboard className="w-4 h-4" />
        Dashboard
      </Button>

      <Button
        variant={activePage === "tasks" ? "secondary" : "ghost"}
        className={`w-full justify-start gap-3 px-3 ${activePage === "tasks" ? "bg-blue-50 text-blue-700 hover:bg-blue-50" : "text-foreground/70"}`}
        onClick={() => {
          setActivePage("tasks")
          onClick()
        }}
      >
        <IconListDetails className="w-4 h-4" />
        Tasks
      </Button>

      <div className="mt-8 mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Reports
      </div>
      <Button variant="ghost" className="w-full justify-start gap-3 px-3 text-foreground/70">
        <IconChartBar className="w-4 h-4" />
        Progress
      </Button>
      <Button variant="ghost" className="w-full justify-start gap-3 px-3 text-foreground/70">
        <IconClock className="w-4 h-4" />
        Timeline
      </Button>

      <div className="mt-8 mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Account
      </div>
      <Button variant="ghost" className="w-full justify-start gap-3 px-3 text-foreground/70">
        <IconSettings className="w-4 h-4" />
        Settings
      </Button>
    </>
  )

  const Logo = () => (
    <div className="flex items-center gap-2 font-bold text-xl text-foreground">
      <div className="bg-blue-600 text-primary-foreground p-1 rounded-md">
        <span className="text-sm px-1">US</span>
      </div>
      Unbound Scripts
    </div>
  )

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background text-foreground relative">
      {/* Mobile Top Header (only visible on small screens) */}
      <div className="lg:hidden flex items-center gap-3 p-4 bg-background border-b border-border sticky top-0 z-20 w-full">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="-ml-2">
              <IconMenu2 className="w-6 h-6" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="p-6">
              <Logo />
            </div>
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
              <NavLinks onClick={() => setIsSidebarOpen(false)} />
            </nav>
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center gap-2 font-bold text-lg text-foreground">
          <div className="bg-blue-600 text-primary-foreground p-1 rounded-md">
            <span className="text-sm px-1">US</span>
          </div>
          Unbound Scripts
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex sticky top-0 left-0 z-40 h-screen w-64 bg-background border-r border-border flex-col">
        <div className="p-6">
          <Logo />
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto">
          <NavLinks />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <div className="w-full">
          {activePage === "dashboard" ? <Dashboard /> : <Tasks />}
        </div>
      </main>
    </div>
  )
}
