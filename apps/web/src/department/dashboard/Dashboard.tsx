// made by harsh
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { mockTasksWithDetails } from "@workspace/types"

const formatDeadline = (dateString: string | Date | null) => {
  if (!dateString) return "No date"
  const date = new Date(dateString)
  return `Due ${date.toLocaleDateString("en-US", { month: "short", day: "2-digit" })}`
}

const derivePriority = (status: string) => {
  if (status === "PENDING") return "High"
  if (status === "IN_PROGRESS") return "Med"
  return "Low"
}

const weeklyCompletions = [
  {
    label: "May 5",
    count: 2,
    height: "h-10",
    color: "bg-indigo-200 dark:bg-indigo-500/20",
  },
  {
    label: "May 12",
    count: 3,
    height: "h-16",
    color: "bg-indigo-300 dark:bg-indigo-500/40",
  },
  {
    label: "May 19",
    count: 1,
    height: "h-6",
    color: "bg-indigo-200 dark:bg-indigo-500/20",
  },
  {
    label: "May 26",
    count: 4,
    height: "h-20",
    color: "bg-indigo-500 dark:bg-indigo-500",
  },
  {
    label: "Jun 9",
    count: 2,
    height: "h-10",
    color: "bg-indigo-200 dark:bg-indigo-500/20",
  },
  {
    label: "Jun 16",
    count: 4,
    height: "h-20",
    color: "bg-indigo-600 dark:bg-indigo-400",
  },
]

export default function Dashboard() {
  const safeTasks = mockTasksWithDetails || []

  const totalTasks = safeTasks.length
  const inProgress = safeTasks.filter((t) => t.status === "IN_PROGRESS").length
  const completed = safeTasks.filter((t) => t.status === "COMPLETED").length
  const pending = safeTasks.filter((t) => t.status === "PENDING").length

  const activeTasks = safeTasks
    .filter((t) => t.status !== "COMPLETED")
    .slice(0, 5)
    .map((t) => {
      return {
        id: t.id,
        title: t.name,
        due: formatDeadline(t.deadline),
        priority: derivePriority(t.status),
        isOverdue: t.status === "PENDING",
      }
    })

  const activities = safeTasks.slice(0, 3).map((t, idx) => ({
    id: t.id,
    text: `${t.name} marked as ${t.status === "PENDING" ? "Pending" : t.status === "IN_PROGRESS" ? "In Progress" : "Completed"}`,
    time: `Today, ${9 + idx}:00 AM`,
    dotColor:
      t.status === "COMPLETED"
        ? "bg-emerald-500"
        : t.status === "PENDING"
          ? "bg-red-500"
          : "bg-indigo-500",
  }))

  return (
    <div className="-m-6 flex min-h-[calc(100vh-3.5rem)] bg-zinc-50/30 dark:bg-zinc-950/30">
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-full space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                Department Dashboard
              </h1>
              <p className="text-base text-zinc-500 dark:text-zinc-400">
                Engineering · June 2026
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            <Card className="border-zinc-200/60 bg-white/50 shadow-sm transition-all hover:shadow-md dark:border-zinc-800/60 dark:bg-zinc-900/50">
              <CardHeader className="p-5 pb-0">
                <CardDescription className="mb-1 font-semibold text-zinc-500 dark:text-zinc-400">
                  Total Tasks
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                  {totalTasks}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-1">
                <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Assigned this month
                </p>
              </CardContent>
            </Card>
            <Card className="border-zinc-200/60 bg-white/50 shadow-sm transition-all hover:shadow-md dark:border-zinc-800/60 dark:bg-zinc-900/50">
              <CardHeader className="p-5 pb-0">
                <CardDescription className="mb-1 font-semibold text-zinc-500 dark:text-zinc-400">
                  In Progress
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                  {inProgress}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-1">
                <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Active right now
                </p>
              </CardContent>
            </Card>
            <Card className="border-zinc-200/60 bg-white/50 shadow-sm transition-all hover:shadow-md dark:border-zinc-800/60 dark:bg-zinc-900/50">
              <CardHeader className="p-5 pb-0">
                <CardDescription className="mb-1 font-semibold text-zinc-500 dark:text-zinc-400">
                  Completed
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                  {completed}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-1">
                <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  4 this week
                </p>
              </CardContent>
            </Card>
            <Card className="border-zinc-200/60 bg-white/50 shadow-sm transition-all hover:shadow-md dark:border-zinc-800/60 dark:bg-zinc-900/50">
              <CardHeader className="p-5 pb-0">
                <CardDescription className="mb-1 font-semibold text-zinc-500 dark:text-zinc-400">
                  Pending / Overdue
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-red-600 dark:text-red-500">
                  {pending}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-1">
                <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Needs attention
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-7">
            {/* Active Tasks Card */}
            <Card className="col-span-4 overflow-hidden border-zinc-200/60 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900">
              <div className="flex items-center justify-between border-b border-zinc-100 bg-white/50 px-6 py-5 dark:border-zinc-800/50 dark:bg-zinc-900/50">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Active Tasks
                </h3>
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  {activeTasks.length} tasks remaining
                </span>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {activeTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-5 px-6 transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30"
                  >
                    <div className="flex-1 space-y-0.5">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {task.title}
                      </p>
                      <p
                        className={`text-xs font-medium ${task.isOverdue ? "text-red-600 dark:text-red-400" : "text-zinc-500 dark:text-zinc-400"}`}
                      >
                        {task.due}
                      </p>
                    </div>
                    <div className="flex w-20 justify-end">
                      <Badge
                        variant={task.isOverdue ? "destructive" : "secondary"}
                        className={`px-2.5 py-0.5 text-[11px] font-bold shadow-none ${
                          task.priority === "High" && !task.isOverdue
                            ? "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                            : task.priority === "Med"
                              ? "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20"
                              : task.priority === "Low"
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                                : ""
                        }`}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="col-span-3 flex flex-col gap-5">
              {/* Weekly Completions Card */}
              <Card className="flex flex-col border-zinc-200/60 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900">
                <CardHeader className="mb-4 border-b border-zinc-100 bg-white/50 p-6 pb-2 dark:border-zinc-800/50 dark:bg-zinc-900/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">
                      Velocity
                    </CardTitle>
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Last 6 weeks
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="mt-auto flex flex-1 items-end justify-between gap-3 px-6 pt-2 pb-6">
                  {weeklyCompletions.map((week, idx) => (
                    <div
                      key={idx}
                      className="group flex flex-1 flex-col items-center"
                    >
                      <span className="mb-2 text-xs font-semibold text-zinc-400 transition-colors group-hover:text-zinc-900 dark:text-zinc-500 dark:group-hover:text-zinc-100">
                        {week.count}
                      </span>
                      <div
                        className={`w-full ${week.height} ${week.color} rounded-md transition-all group-hover:opacity-80`}
                      ></div>
                      <span className="mt-2 text-center text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                        {week.label}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity Card */}
              <Card className="flex-1 border-zinc-200/60 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900">
                <CardHeader className="border-b border-zinc-100 bg-white/50 p-6 pb-5 dark:border-zinc-800/50 dark:bg-zinc-900/50">
                  <CardTitle className="text-lg font-bold">Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <div className="relative mt-1.5">
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${activity.dotColor} relative z-10 shadow-sm`}
                        ></div>
                        {activity.id !==
                          activities[activities.length - 1].id && (
                          <div className="absolute top-2.5 left-1/2 -ml-px h-10 w-0.5 bg-zinc-100 dark:bg-zinc-800/50"></div>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {activity.text}
                        </p>
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
