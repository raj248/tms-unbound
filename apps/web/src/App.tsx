import { useState } from "react"
import { IconLayoutDashboard, IconListDetails, IconChartBar, IconClock, IconSettings, IconMenu2, IconUsersGroup, IconBriefcase } from "@tabler/icons-react"
import Dashboard from "./department/dashboard/Dashboard"
import Tasks from "./department/tasks/Tasks"
import AdminDashboard from "./admin/dashboard/AdminDashboard"
import AdminTasks from "./admin/tasks/AdminTasks"
import AdminDepartments from "./admin/departments/AdminDepartments"
import { Sheet, SheetContent, SheetTrigger } from "@workspace/ui/components/sheet"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"

export function App() {
  const [viewMode, setViewMode] = useState<"department" | "admin">("admin")
  const [activePage, setActivePage] = useState<string>("admin-dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const DepartmentNavLinks = ({ onClick = () => {} }: { onClick?: () => void }) => (
    <>
      <Button
        variant={activePage === "dashboard" ? "secondary" : "ghost"}
        className={`w-full justify-start gap-3 px-3 ${activePage === "dashboard" ? "bg-blue-50 text-blue-700 hover:bg-blue-50" : "text-foreground/70"}`}
        onClick={() => { setActivePage("dashboard"); onClick(); }}
      >
        <IconLayoutDashboard className="w-4 h-4" />
        Dashboard
      </Button>
      <Button
        variant={activePage === "tasks" ? "secondary" : "ghost"}
        className={`w-full justify-start gap-3 px-3 ${activePage === "tasks" ? "bg-blue-50 text-blue-700 hover:bg-blue-50" : "text-foreground/70"}`}
        onClick={() => { setActivePage("tasks"); onClick(); }}
      >
        <IconListDetails className="w-4 h-4" />
        Tasks
      </Button>
      <div className="mt-8 mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reports</div>
      <Button variant="ghost" className="w-full justify-start gap-3 px-3 text-foreground/70">
        <IconChartBar className="w-4 h-4" /> Progress
      </Button>
      <Button variant="ghost" className="w-full justify-start gap-3 px-3 text-foreground/70">
        <IconClock className="w-4 h-4" /> Timeline
      </Button>
      <div className="mt-8 mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</div>
      <Button variant="ghost" className="w-full justify-start gap-3 px-3 text-foreground/70">
        <IconSettings className="w-4 h-4" /> Settings
      </Button>
    </>
  )

  const AdminNavLinks = ({ onClick = () => {} }: { onClick?: () => void }) => (
    <>
      <Button
        variant={activePage === "admin-dashboard" ? "secondary" : "ghost"}
        className={`w-full justify-start gap-3 px-3 ${activePage === "admin-dashboard" ? "bg-blue-50 text-blue-700 hover:bg-blue-50" : "text-foreground/70"}`}
        onClick={() => { setActivePage("admin-dashboard"); onClick(); }}
      >
        <IconLayoutDashboard className="w-4 h-4" />
        Dashboard
      </Button>
      <Button
        variant={activePage === "admin-tasks" ? "secondary" : "ghost"}
        className={`w-full justify-start gap-3 px-3 ${activePage === "admin-tasks" ? "bg-blue-50 text-blue-700 hover:bg-blue-50" : "text-foreground/70"}`}
        onClick={() => { setActivePage("admin-tasks"); onClick(); }}
      >
        <IconListDetails className="w-4 h-4" />
        Tasks
      </Button>
      <Button
        variant={activePage === "admin-departments" ? "secondary" : "ghost"}
        className={`w-full justify-start gap-3 px-3 ${activePage === "admin-departments" ? "bg-blue-50 text-blue-700 hover:bg-blue-50" : "text-foreground/70"}`}
        onClick={() => { setActivePage("admin-departments"); onClick(); }}
      >
        <IconBriefcase className="w-4 h-4" />
        Departments
      </Button>

      <div className="mt-8 mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reports</div>
      <Button variant="ghost" className="w-full justify-start gap-3 px-3 text-foreground/70">
        <IconChartBar className="w-4 h-4" /> Analytics
      </Button>
      <Button variant="ghost" className="w-full justify-start gap-3 px-3 text-foreground/70">
        <IconClock className="w-4 h-4" /> Timeline
      </Button>

      <div className="mt-8 mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">System</div>
      <Button variant="ghost" className="w-full justify-start gap-3 px-3 text-foreground/70">
        <IconUsersGroup className="w-4 h-4" /> Users
      </Button>
      <Button variant="ghost" className="w-full justify-start gap-3 px-3 text-foreground/70">
        <IconSettings className="w-4 h-4" /> Settings
      </Button>
    </>
  )

  const Logo = () => (
    <div className="flex items-center gap-2 font-bold text-xl text-foreground">
      <div className="bg-blue-600 text-primary-foreground p-1 rounded-md">
        <span className="text-sm px-1">{viewMode === 'admin' ? 'A' : 'US'}</span>
      </div>
      {viewMode === 'admin' ? 'AdminFlow' : 'Unbound Scripts'}
    </div>
  )

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background text-foreground relative">
      {/* Dev toggle purely for development to switch between views */}
      <div className="fixed bottom-4 right-4 z-50">
        <Badge 
          className="cursor-pointer shadow-lg hover:bg-blue-700 bg-blue-600 text-white px-4 py-2"
          onClick={() => {
            if (viewMode === 'department') {
              setViewMode('admin');
              setActivePage('admin-dashboard');
            } else {
              setViewMode('department');
              setActivePage('dashboard');
            }
          }}
        >
          Dev: Switch to {viewMode === 'department' ? 'Admin' : 'Department'} View
        </Badge>
      </div>

      {/* Mobile Top Header (only visible on small screens) */}
      <div className="lg:hidden flex items-center gap-3 p-4 bg-background border-b border-border sticky top-0 z-20 w-full">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="-ml-2">
              <IconMenu2 className="w-6 h-6" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className={`w-64 p-0`}>
            <div className="p-6">
              <Logo />
            </div>
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
              {viewMode === 'admin' ? <AdminNavLinks onClick={() => setIsSidebarOpen(false)} /> : <DepartmentNavLinks onClick={() => setIsSidebarOpen(false)} />}
            </nav>
          </SheetContent>
        </Sheet>
        
        <Logo />
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex sticky top-0 left-0 z-40 h-screen w-64 border-r flex-col bg-background border-border`}>
        <div className="p-6">
          <Logo />
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto">
          {viewMode === 'admin' ? <AdminNavLinks /> : <DepartmentNavLinks />}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <div className="w-full">
          {activePage === "dashboard" && <Dashboard />}
          {activePage === "tasks" && <Tasks />}
          {activePage === "admin-dashboard" && <AdminDashboard />}
          {activePage === "admin-tasks" && <AdminTasks />}
          {activePage === "admin-departments" && <AdminDepartments />}
        </div>
      </main>
    </div>
  )
}
