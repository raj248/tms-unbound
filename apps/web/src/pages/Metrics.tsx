import { useState, useMemo } from "react"
import { useTasks } from "@/hooks/task"
import { useDepartments } from "@/hooks/department"
import { useAuth } from "@/context/auth-context"
import { useUsers } from "@/hooks/user"
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
import { Badge } from "@workspace/ui/components/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { IconPrinter } from "@workspace/ui/lib/Icons"
import { Button } from "@workspace/ui/components/button"
import { generateMetricsPDF } from "@/lib/pdf"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]
const QUARTERS = ["Q1", "Q2", "Q3", "Q4"]

export default function MetricsPage() {
  const currentDate = new Date()

  const { user } = useAuth()
  const { data: users = [] } = useUsers()
  const currentUserObj = users.find((u) => u.id === user?.id)
  const myDepartmentId = currentUserObj?.departments?.[0]?.id
  const isAdmin = user?.role === "ADMIN"

  // Metrics Filters
  const [selectedDept, setSelectedDept] = useState<string>("ALL")
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear())
  const [viewType, setViewType] = useState<"MONTH" | "QUARTER" | "WEEK">("MONTH")
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth())
  const [selectedQuarter, setSelectedQuarter] = useState<number>(Math.floor(currentDate.getMonth() / 3))
  const [selectedWeek, setSelectedWeek] = useState<number>(1)

  const { data: departments = [] } = useDepartments()

  // For non-admins, force the department to their own.
  const effectiveDept = isAdmin ? selectedDept : (myDepartmentId || "ALL")

  // Use frontend query parameter implementation for API
  const { data: allTasks = [], isLoading } = useTasks(
    undefined,
    effectiveDept === "ALL" ? undefined : effectiveDept
  )

  const availableYears = useMemo(() => {
    const currentDate = new Date()
    if (!allTasks.length) return [currentDate.getFullYear()]
    const years = new Set<number>()
    allTasks.forEach(t => years.add(new Date(t.createdAt).getFullYear()))
    years.add(currentDate.getFullYear())
    return Array.from(years).sort((a, b) => b - a)
  }, [allTasks])

  const filteredTasks = useMemo(() => {
    return allTasks.filter(t => {
      // 1. Year filter
      const taskDate = new Date(t.createdAt)
      if (taskDate.getFullYear() !== selectedYear) return false

      // 2. Month / Quarter / Week filter
      if (viewType === "MONTH") {
        if (taskDate.getMonth() !== selectedMonth) return false
      } else if (viewType === "QUARTER") {
        const q = Math.floor(taskDate.getMonth() / 3)
        if (q !== selectedQuarter) return false
      } else if (viewType === "WEEK") {
        if (taskDate.getMonth() !== selectedMonth) return false
        const day = taskDate.getDate()
        let w = 4
        if (day <= 7) w = 1
        else if (day <= 14) w = 2
        else if (day <= 21) w = 3
        if (w !== selectedWeek) return false
      }

      return true
    })
  }, [allTasks, selectedYear, viewType, selectedMonth, selectedQuarter, selectedWeek])

  // Calculate stats for current metrics timeframe
  const totalTasks = filteredTasks.length
  const completedTasks = filteredTasks.filter(t => t.status === "COMPLETED").length
  const holdTasks = filteredTasks.filter(t => t.status === "HOLD").length
  const inProgressTasks = filteredTasks.filter(t => t.status === "IN_PROGRESS").length

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const totalMetricValue = filteredTasks.reduce((sum, task) => sum + (task.metricValue || 0), 0)

  const departmentData = useMemo(() => {
    if (!filteredTasks) return []

    const grouped = new Map<string, {
      department: string
      total: number
      completed: number
      inProgress: number
      hold: number
    }>()

    filteredTasks.forEach((task) => {
      const deptName = task.department?.name || "Unassigned"
      const key = deptName

      if (!grouped.has(key)) {
        grouped.set(key, {
          department: deptName,
          total: 0,
          completed: 0,
          inProgress: 0,
          hold: 0,
        })
      }

      const stats = grouped.get(key)!
      stats.total += 1

      if (task.status === "COMPLETED") stats.completed += 1
      else if (task.status === "IN_PROGRESS") stats.inProgress += 1
      else if (task.status === "HOLD") stats.hold += 1
    })

    return Array.from(grouped.values()).sort((a, b) => a.department.localeCompare(b.department))
  }, [filteredTasks])

  const handlePrint = () => {
    const deptName = effectiveDept === "ALL" 
      ? "All Departments" 
      : departments.find(d => d.id === effectiveDept)?.name || "Unknown"
      
    let timeframeStr = `${selectedYear}`
    if (viewType === "MONTH") {
      timeframeStr = `${MONTHS[selectedMonth]} ${selectedYear}`
    } else if (viewType === "QUARTER") {
      timeframeStr = `${QUARTERS[selectedQuarter]} ${selectedYear}`
    } else if (viewType === "WEEK") {
      timeframeStr = `Week ${selectedWeek}, ${MONTHS[selectedMonth]} ${selectedYear}`
    }

    generateMetricsPDF({
      title: "Metrics & Audit Report",
      totalTasks,
      completionRate,
      holdTasks,
      totalMetricValue,
      departmentData,
      tasks: filteredTasks,
      filters: {
        department: deptName,
        timeframe: timeframeStr
      }
    })
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col gap-6 overflow-auto p-6 md:p-8 bg-zinc-50/30 dark:bg-zinc-950/30 print:bg-white print:m-0 print:min-h-0 print:p-0 print:overflow-visible">

      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 print:text-black">
            Metrics & Audit
          </h1>
          <p className="text-muted-foreground mt-1 print:text-gray-600">
            Track departmental progress and audit task resolutions over time.
          </p>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <IconPrinter className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </header>

      {/* Metrics Filters - Hidden when printing */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end print:hidden bg-white dark:bg-zinc-900 p-4 rounded-md">
        <div className="flex-1 flex flex-wrap items-end gap-4 lg:gap-6">
          {isAdmin && (
            <div className="space-y-1 w-full sm:w-[180px]">
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
          )}

          <div className="space-y-1 w-full sm:w-[140px]">
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

          <div className="space-y-1 w-full sm:w-[240px]">
            <label className="text-xs font-medium">View By</label>
            <Tabs value={viewType} onValueChange={(v) => setViewType(v as "MONTH" | "QUARTER" | "WEEK")} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-9">
                <TabsTrigger value="WEEK" className="text-xs">Week</TabsTrigger>
                <TabsTrigger value="MONTH" className="text-xs">Month</TabsTrigger>
                <TabsTrigger value="QUARTER" className="text-xs">Quarter</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-wrap w-full sm:w-auto gap-4 lg:gap-6">
            <div className="space-y-1 w-full sm:w-[140px]">
              <label className="text-xs font-medium">
                {viewType === "MONTH" || viewType === "WEEK" ? "Month" : "Quarter"}
              </label>
              {viewType === "MONTH" || viewType === "WEEK" ? (
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

            {viewType === "WEEK" && (
              <div className="space-y-1 w-full sm:w-[180px]">
                <label className="text-xs font-medium">Week</label>
                <Select value={selectedWeek.toString()} onValueChange={(v) => setSelectedWeek(Number(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Week" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Week 1 (1st - 7th)</SelectItem>
                    <SelectItem value="2">Week 2 (8th - 14th)</SelectItem>
                    <SelectItem value="3">Week 3 (15th - 21st)</SelectItem>
                    <SelectItem value="4">Week 4 (22nd - End)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-muted-foreground">
          Loading metrics...
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-12 print:block print:space-y-6">
          {/* Top Metrics Cards - take 8 columns */}
          <div className="md:col-span-8 grid gap-6 md:grid-cols-4 print:grid-cols-4 print:gap-4 print:mb-6">
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
                <CardTitle className="text-sm font-medium">Active Hold</CardTitle>
                <IconAlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{holdTasks}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tasks currently on hold
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <IconChartBar className="h-4 w-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMetricValue.toLocaleString("en-US")}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Sum of task values
                </p>
              </CardContent>
            </Card>

            {/* Department Breakdown integrated here */}
            <Card className="md:col-span-4 print:col-span-4 print:break-inside-avoid print:shadow-none print:border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Department Breakdown</CardTitle>
                <CardDescription>
                  Detailed overall statistics split by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-zinc-200 dark:border-zinc-800 overflow-hidden print:border-gray-300">
                  <Table>
                    <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50 print:bg-gray-50">
                      <TableRow>
                        <TableHead>Department</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right text-emerald-600 dark:text-emerald-400 print:text-emerald-700">Completed</TableHead>
                        <TableHead className="text-right text-blue-600 dark:text-blue-400 print:text-blue-700">In Progress</TableHead>
                        <TableHead className="text-right text-orange-600 dark:text-orange-400 print:text-orange-700">Hold</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {departmentData.length > 0 ? (
                        departmentData.map((row, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{row.department}</TableCell>
                            <TableCell className="text-right">{row.total}</TableCell>
                            <TableCell className="text-right">{row.completed}</TableCell>
                            <TableCell className="text-right">{row.inProgress}</TableCell>
                            <TableCell className="text-right">{row.hold}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No department data available.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Breakdown - Made smaller by taking 4 columns */}
          <Card className="md:col-span-4 print:mb-6">
            <CardHeader>
              <CardTitle>Task Status Breakdown</CardTitle>
              <CardDescription>Status distribution for selected timeframe.</CardDescription>
            </CardHeader>
            <CardContent>
              {totalTasks === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No tasks found for the selected filters.
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-medium">
                        <span className="h-2 w-2 rounded-full bg-blue-400" />
                        In Progress
                      </span>
                      <span>{inProgressTasks} ({totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0}%)</span>
                    </div>
                    <Progress value={totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0} className="h-2 [&>div]:bg-blue-400" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-medium">
                        <span className="h-2 w-2 rounded-full bg-orange-500" />
                        Hold
                      </span>
                      <span>{holdTasks} ({totalTasks > 0 ? Math.round((holdTasks / totalTasks) * 100) : 0}%)</span>
                    </div>
                    <Progress value={totalTasks > 0 ? (holdTasks / totalTasks) * 100 : 0} className="h-2 [&>div]:bg-orange-500" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-medium">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Completed
                      </span>
                      <span>{completedTasks} ({totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%)</span>
                    </div>
                    <Progress value={totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0} className="h-2 [&>div]:bg-emerald-500" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tasks List */}
          <Card className="md:col-span-12 print:break-inside-avoid mt-2">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Filtered Tasks</CardTitle>
              <CardDescription>
                Tasks matching your current metrics filters ({filteredTasks.length})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-zinc-200 dark:border-zinc-800 overflow-hidden print:border-gray-300">
                <Table>
                  <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50 print:bg-gray-50">
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => {
                        let customStatusClass = ""
                        if (task.status === "IN_PROGRESS") {
                          customStatusClass = "bg-blue-50 text-blue-600 border-transparent"
                        } else if (task.status === "COMPLETED") {
                          customStatusClass = "bg-emerald-50 text-emerald-600 border-transparent"
                        } else if (task.status === "HOLD") {
                          customStatusClass = "bg-orange-50 text-orange-600 border-transparent"
                        }

                        return (
                          <TableRow key={task.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{task.name}</TableCell>
                            <TableCell>
                              <Badge className={`px-2.5 py-0.5 text-[10px] font-bold ${customStatusClass}`}>
                                {task.status.replace("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">{task.department?.name || "Unassigned"}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{new Date(task.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right font-medium">
                              {task.metricValue != null ? task.metricValue.toLocaleString("en-US") : "—"}
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No tasks found for the selected filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  )
}
