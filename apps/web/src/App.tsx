import { useState } from "react"
import { IconLayoutDashboard, IconListDetails, IconChartBar, IconClock, IconSettings } from "@tabler/icons-react"
import Dashboard from "./department/dashboard/Dashboard"
import Tasks from "./department/tasks/Tasks"

export function App() {
  const [activePage, setActivePage] = useState<"dashboard" | "tasks">("dashboard")

  return (
    <div className="flex min-h-screen w-full bg-[#f8f9fa] text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col h-screen sticky top-0">
        <div className="p-6">
          <div className="flex items-center gap-2 font-bold text-xl text-indigo-900">
            <div className="bg-indigo-600 text-white p-1 rounded-md">
              <span className="text-sm px-1">D</span>
            </div>
            DeptFlow
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2">
          <button
            onClick={() => setActivePage("dashboard")}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activePage === "dashboard"
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <IconLayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          
          <button
            onClick={() => setActivePage("tasks")}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activePage === "tasks"
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
