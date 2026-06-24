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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

type TimeRange = "monthly" | "quarterly" | "yearly"

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
  const [viewType, setViewType] = useState<"MONTH" | "QUARTER">("MONTH")
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth())
  const [selectedQuarter, setSelectedQuarter] = useState<number>(Math.floor(currentDate.getMonth() / 3))

  // Audit Filters
  const [timeRange, setTimeRange] = useState<TimeRange>("monthly")

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

      // 2. Month / Quarter filter
      if (viewType === "MONTH") {
        if (taskDate.getMonth() !== selectedMonth) return false
      } else {
        const q = Math.floor(taskDate.getMonth() / 3)
        if (q !== selectedQuarter) return false
      }

      return true
    })
  }, [allTasks, selectedYear, viewType, selectedMonth, selectedQuarter])

  // Calculate stats for current metrics timeframe
  const totalTasks = filteredTasks.length
  const completedTasks = filteredTasks.filter(t => t.status === "COMPLETED").length
  const blockedTasks = filteredTasks.filter(t => t.status === "BLOCKED").length
  const inProgressTasks = filteredTasks.filter(t => t.status === "IN_PROGRESS").length
  const pendingTasks = filteredTasks.filter(t => t.status === "PENDING").length

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Calculate audit trend data
  const aggregatedData = useMemo(() => {
    if (!allTasks) return []

    const grouped = new Map<string, {
      period: string
      total: number
      completed: number
      inProgress: number
      pending: number
    }>()

    allTasks.forEach((task) => {
      const date = new Date(task.createdAt)
      let periodKey: string

      if (timeRange === "monthly") {
        periodKey = date.toLocaleString("default", { month: "short", year: "numeric" })
      } else if (timeRange === "quarterly") {
        const q = Math.floor(date.getMonth() / 3) + 1
        periodKey = `Q${q} ${date.getFullYear()}`
      } else {
        periodKey = `${date.getFullYear()}`
      }

      if (!grouped.has(periodKey)) {
        grouped.set(periodKey, {
          period: periodKey,
          total: 0,
          completed: 0,
          inProgress: 0,
          pending: 0,
        })
      }

      const stats = grouped.get(periodKey)!
      stats.total += 1

      if (task.status === "COMPLETED") stats.completed += 1
      else if (task.status === "IN_PROGRESS") stats.inProgress += 1
      else if (task.status === "PENDING") stats.pending += 1
    })

    return Array.from(grouped.values())
  }, [allTasks, timeRange])

  const departmentData = useMemo(() => {
    if (!filteredTasks) return []

    const grouped = new Map<string, {
      department: string
      total: number
      completed: number
      inProgress: number
      pending: number
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
          pending: 0,
        })
      }

      const stats = grouped.get(key)!
      stats.total += 1

      if (task.status === "COMPLETED") stats.completed += 1
      else if (task.status === "IN_PROGRESS") stats.inProgress += 1
      else if (task.status === "PENDING") stats.pending += 1
    })

    return Array.from(grouped.values()).sort((a, b) => a.department.localeCompare(b.department))
  }, [filteredTasks])

  const handlePrint = () => {
    window.print()
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
      <div className="flex flex-col gap-4 md:flex-row md:items-end print:hidden bg-white dark:bg-zinc-900 p-4 rounded-md border shadow-sm">
        <div className="flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {isAdmin && (
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
          )}

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
        <div className="grid gap-6 md:grid-cols-12 print:block print:space-y-6">
          {/* Top Metrics Cards - take 8 columns */}
          <div className="md:col-span-8 grid gap-6 md:grid-cols-3 print:grid-cols-3 print:gap-4 print:mb-6">
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

            {/* Department Breakdown integrated here */}
            <Card className="md:col-span-3 print:col-span-3 print:break-inside-avoid print:shadow-none print:border-gray-200">
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
                        <TableHead className="text-right text-amber-600 dark:text-amber-400 print:text-amber-700">Pending</TableHead>
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
                            <TableCell className="text-right">{row.pending}</TableCell>
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
          
          {/* Trend Analysis Graph taking full width below */}
          <Card className="md:col-span-12 print:break-inside-avoid mt-2">
            <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-0">
              <div>
                <CardTitle className="text-lg font-bold">Audit Trend Analysis</CardTitle>
                <CardDescription>
                  Task resolutions grouped by {timeRange} across the entire workspace
                </CardDescription>
              </div>
              
              <div className="w-40 print:hidden">
                <Select value={timeRange} onValueChange={(val: TimeRange) => setTimeRange(val)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={aggregatedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(161, 161, 170, 0.2)" />
                    <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                    <Tooltip cursor={{ fill: "rgba(244, 244, 245, 0.1)" }} contentStyle={{ borderRadius: "8px", border: "1px solid #e4e4e7", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      name="Completed"
                      stroke="#059669"
                      strokeWidth={3}
                      activeDot={{ r: 6 }}
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />
                    <Line
                      type="monotone"
                      dataKey="inProgress"
                      name="In Progress"
                      stroke="#2563eb"
                      strokeWidth={3}
                      activeDot={{ r: 6 }}
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />
                    <Line
                      type="monotone"
                      dataKey="pending"
                      name="Pending"
                      stroke="#d97706"
                      strokeWidth={3}
                      activeDot={{ r: 6 }}
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
        </div>
      )}
    </div>
  )
}
