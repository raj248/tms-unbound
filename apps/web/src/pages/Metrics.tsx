import { useState, useMemo } from "react"
import { useTasks } from "@/hooks/task"
import { useDepartments } from "@/hooks/department"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Progress } from "@workspace/ui/components/progress"
import { IconChartBar, IconTarget, IconAlertTriangle } from "@tabler/icons-react"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]
const QUARTERS = ["Q1", "Q2", "Q3", "Q4"]

export default function MetricsPage() {
  const currentDate = new Date()
  
  const [selectedDept, setSelectedDept] = useState<string>("ALL")
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear())
  const [viewType, setViewType] = useState<"MONTH" | "QUARTER">("MONTH")
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth())
  const [selectedQuarter, setSelectedQuarter] = useState<number>(Math.floor(currentDate.getMonth() / 3))

  const { data: departments = [] } = useDepartments()
  const { data: allTasks = [], isLoading } = useTasks()

  const availableYears = useMemo(() => {
    if (!allTasks.length) return [currentDate.getFullYear()]
    const years = new Set<number>()
    allTasks.forEach(t => years.add(new Date(t.createdAt).getFullYear()))
    years.add(currentDate.getFullYear())
    return Array.from(years).sort((a, b) => b - a)
  }, [allTasks, currentDate])

  const filteredTasks = useMemo(() => {
    return allTasks.filter(t => {
      // 1. Department filter
      if (selectedDept !== "ALL" && t.departmentId !== selectedDept) return false

      // 2. Year filter
      const taskDate = new Date(t.createdAt)
      if (taskDate.getFullYear() !== selectedYear) return false

      // 3. Month / Quarter filter
      if (viewType === "MONTH") {
        if (taskDate.getMonth() !== selectedMonth) return false
      } else {
        const q = Math.floor(taskDate.getMonth() / 3)
        if (q !== selectedQuarter) return false
      }

      return true
    })
  }, [allTasks, selectedDept, selectedYear, viewType, selectedMonth, selectedQuarter])

  // Calculate stats
  const totalTasks = filteredTasks.length
  const completedTasks = filteredTasks.filter(t => t.status === "COMPLETED").length
  const blockedTasks = filteredTasks.filter(t => t.status === "BLOCKED").length
  const inProgressTasks = filteredTasks.filter(t => t.status === "IN_PROGRESS").length
  const pendingTasks = filteredTasks.filter(t => t.status === "PENDING").length

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="flex h-full flex-col gap-6 overflow-auto p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Metrics & Progress</h1>
        <p className="text-muted-foreground mt-1">
          Track departmental progress and task statistics.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        {/* Filters */}
        <div className="flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="space-y-1">
            <label className="text-xs font-medium">Department</label>
            <Select value={selectedDept} onValueChange={setSelectedDept}>
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Departments</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Year</label>
            <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(Number(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(y => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">View By</label>
            <Tabs value={viewType} onValueChange={(v) => setViewType(v as "MONTH" | "QUARTER")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-9">
                <TabsTrigger value="MONTH" className="text-xs">Month</TabsTrigger>
                <TabsTrigger value="QUARTER" className="text-xs">Quarter</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">
              {viewType === "MONTH" ? "Month" : "Quarter"}
            </label>
            {viewType === "MONTH" ? (
              <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(Number(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m, i) => (
                    <SelectItem key={i} value={i.toString()}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Select value={selectedQuarter.toString()} onValueChange={(v) => setSelectedQuarter(Number(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Quarter" />
                </SelectTrigger>
                <SelectContent>
                  {QUARTERS.map((q, i) => (
                    <SelectItem key={i} value={i.toString()}>{q}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-muted-foreground">
          Loading metrics...
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <IconChartBar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
              <p className="text-xs text-muted-foreground mt-1">
                For the selected timeframe
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <IconTarget className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate}%</div>
              <Progress value={completionRate} className="h-2 mt-3" />
              <p className="text-xs text-muted-foreground mt-2">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Blockers</CardTitle>
              <IconAlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blockedTasks}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Tasks currently blocked
              </p>
            </CardContent>
          </Card>

          {/* Status Breakdown */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Task Status Breakdown</CardTitle>
              <CardDescription>Visual representation of task distribution by current status.</CardDescription>
            </CardHeader>
            <CardContent>
              {totalTasks === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No tasks found for the selected filters.
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-medium">
                        <span className="h-2 w-2 rounded-full bg-orange-400" />
                        Pending
                      </span>
                      <span>{pendingTasks} ({Math.round((pendingTasks/totalTasks)*100)}%)</span>
                    </div>
                    <Progress value={(pendingTasks/totalTasks)*100} className="h-2 [&>div]:bg-orange-400" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-medium">
                        <span className="h-2 w-2 rounded-full bg-blue-400" />
                        In Progress
                      </span>
                      <span>{inProgressTasks} ({Math.round((inProgressTasks/totalTasks)*100)}%)</span>
                    </div>
                    <Progress value={(inProgressTasks/totalTasks)*100} className="h-2 [&>div]:bg-blue-400" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-medium">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        Blocked
                      </span>
                      <span>{blockedTasks} ({Math.round((blockedTasks/totalTasks)*100)}%)</span>
                    </div>
                    <Progress value={(blockedTasks/totalTasks)*100} className="h-2 [&>div]:bg-red-500" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-medium">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Completed
                      </span>
                      <span>{completedTasks} ({Math.round((completedTasks/totalTasks)*100)}%)</span>
                    </div>
                    <Progress value={(completedTasks/totalTasks)*100} className="h-2 [&>div]:bg-emerald-500" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
