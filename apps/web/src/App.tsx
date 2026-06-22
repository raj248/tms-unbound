import { useState } from "react"
import { IconLayoutDashboard, IconListDetails, IconChartBar, IconClock, IconSettings, IconMenu2, IconX } from "@tabler/icons-react"
import Dashboard from "./department/dashboard/Dashboard"
import Tasks from "./department/tasks/Tasks"

export function App() {
  const [activePage, setActivePage] = useState<"dashboard" | "tasks">("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-[#f8f9fa] text-slate-900 relative">
      {/* Mobile Top Header (only visible on small screens) */}
      <div className="lg:hidden flex items-center gap-3 p-4 bg-white border-b border-slate-200 sticky top-0 z-20 w-full">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-md"
        >
          {isSidebarOpen ? <IconX className="w-6 h-6" /> : <IconMenu2 className="w-6 h-6" />}
        </button>
        <div className="flex items-center gap-2 font-bold text-lg text-indigo-900">
          <div className="bg-indigo-600 text-white p-1 rounded-md">
            <span className="text-sm px-1">US</span>
          </div>
          Unbound Scripts
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 hidden lg:block">
          <div className="flex items-center gap-2 font-bold text-xl text-indigo-900">
            <div className="bg-indigo-600 text-white p-1 rounded-md">
              <span className="text-sm px-1">US</span>
            </div>
            Unbound Scripts
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-6 lg:mt-2 overflow-y-auto">
          <button
            onClick={() => {
              setActivePage("dashboard")
              setIsSidebarOpen(false)
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activePage === "dashboard"
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
          >
            <IconLayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => {
              setActivePage("tasks")
              setIsSidebarOpen(false)
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activePage === "tasks"
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
          >
            <IconListDetails className="w-4 h-4" />
            Tasks
          </button>

          <div className="mt-8 mb-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Reports
          </div>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-md transition-colors">
            <IconChartBar className="w-4 h-4" />
            Progress
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-md transition-colors">
            <IconClock className="w-4 h-4" />
            Timeline
          </button>

          <div className="mt-8 mb-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Account
          </div>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-md transition-colors">
            <IconSettings className="w-4 h-4" />
            Settings
          </button>
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
