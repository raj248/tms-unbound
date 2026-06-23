import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  IconUser,
  IconDashboard,
  IconActivity,
  IconBell,
  IconChartBar,
  IconLoader2,
  IconAlertTriangle,
} from "@workspace/ui/lib/Icons"
import { useTasks } from "@/hooks/task"
import { useTaskModal } from "@/context/task-modal-context"

const formatStatusText = (status: string) => {
  if (status === "PENDING") return "Pending"
  if (status === "IN_PROGRESS") return "In Progress"
  if (status === "COMPLETED") return "Completed"
  return status
}

export default function AdminDashboard() {
  const { data: tasks, isLoading, error } = useTasks()
  const { openTask } = useTaskModal()

  const totalTasks = tasks?.length || 0
  const inProgress =
    tasks?.filter((t) => t.status === "IN_PROGRESS").length || 0
  const completed = tasks?.filter((t) => t.status === "COMPLETED").length || 0
  const pending = tasks?.filter((t) => t.status === "PENDING").length || 0

  const metrics = [
    {
      title: "Total Tasks",
      value: totalTasks.toString(),
      desc: "Across all departments",
      icon: IconDashboard,
      color: "text-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
    },
    {
      title: "Completed",
      value: completed.toString(),
      desc: "Successfully finished",
      icon: IconActivity,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      title: "In Progress",
      value: inProgress.toString(),
      desc: "Actively being worked on",
      icon: IconUser,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      title: "Pending",
      value: pending.toString(),
      desc: "Waiting to be started",
      icon: IconBell,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-500/10",
    },
  ]

  const recentTasks = tasks?.slice(0, 5).map((t) => {
    const initials = t.assigneeName
      ? t.assigneeName
          .split(" ")
          .map((n) => n[0])
          .join("")
      : "UN"
    let statusColor =
      "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
    if (t.status === "PENDING")
      statusColor =
        "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10"
    if (t.status === "IN_PROGRESS")
      statusColor =
        "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10"

    return {
      name: t.name,
      department: t.department?.name || "Unassigned Dept",
      status: formatStatusText(t.status),
      statusColor,
      initials,
      fullTask: t,
    }
  })

  return (
    <div className="-m-6 flex min-h-[calc(100vh-3.5rem)] bg-zinc-50/30 dark:bg-zinc-950/30">
      <main className="flex-1 overflow-y-auto p-8">
        <div className="space-y-8">
          <header className="flex items-end justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                Dashboard
              </h1>
              <p className="text-base text-zinc-500 dark:text-zinc-400">
                Welcome back, here's what's happening today.
              </p>
            </div>
          </header>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-24 text-muted-foreground">
              <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm">Loading tasks…</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center justify-center gap-2 py-24 text-sm text-destructive">
              <IconAlertTriangle className="h-4 w-4" />
              Failed to load tasks. Please try again.
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {!isLoading &&
              !error &&
              metrics.map((item, index) => {
                const Icon = item.icon
                return (
                  <Card
                    key={index}
                    className="group overflow-hidden border-zinc-200/60 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800/60 dark:hover:border-zinc-700"
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-white/50 pb-2 dark:bg-zinc-900/50">
                      <CardTitle className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                        {item.title}
                      </CardTitle>
                      <div
                        className={`rounded-xl p-2 ${item.bg} transition-transform group-hover:scale-110`}
                      >
                        <Icon
                          className={`h-4 w-4 ${item.color}`}
                          stroke={2.5}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="bg-white pt-4 dark:bg-zinc-900">
                      <div className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {item.value}
                      </div>
                      <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {item.desc}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 border-zinc-200/60 shadow-sm dark:border-zinc-800/60">
              <CardHeader className="border-b border-zinc-100 bg-white pb-5 dark:border-zinc-800/50 dark:bg-zinc-900">
                <CardTitle className="text-lg font-bold">
                  Task Completion Overview
                </CardTitle>
                <CardDescription className="text-zinc-500">
                  Task resolution performance tracked across all departments.
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white p-6 dark:bg-zinc-900">
                <div className="flex h-[300px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/50">
                  <div className="mb-3 rounded-full bg-indigo-50 p-3 dark:bg-indigo-500/10">
                    <IconChartBar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Interactive Chart Area
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3 border-zinc-200/60 shadow-sm dark:border-zinc-800/60">
              <CardHeader className="border-b border-zinc-100 bg-white pb-5 dark:border-zinc-800/50 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold">
                    Recent Tasks
                  </CardTitle>
                  <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    {tasks?.length} overall
                  </span>
                </div>
              </CardHeader>
              <CardContent className="bg-white p-0 dark:bg-zinc-900">
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                  {recentTasks &&
                    recentTasks?.map((task, index) => (
                      <div
                        key={index}
                        className="flex cursor-pointer items-center justify-between p-5 transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30"
                        onClick={() => openTask(task.fullTask)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                            {task.initials}
                          </div>
                          <div className="space-y-0.5">
                            <p className="w-[160px] truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                              {task.name}
                            </p>
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                              {task.department}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`rounded-full px-2.5 py-1 text-sm font-bold ${task.statusColor}`}
                        >
                          {task.status}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
