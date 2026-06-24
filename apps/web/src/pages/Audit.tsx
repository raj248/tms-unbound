import { useMemo, useState } from "react"
import { useTasks } from "@/hooks/task"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { IconLoader2, IconAlertTriangle, IconPrinter } from "@workspace/ui/lib/Icons"
import { Button } from "@workspace/ui/components/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

type TimeRange = "monthly" | "quarterly" | "yearly"

export default function AuditPage() {
  const { data: tasks, isLoading, error } = useTasks()
  const [timeRange, setTimeRange] = useState<TimeRange>("monthly")

  const aggregatedData = useMemo(() => {
    if (!tasks) return []

    const grouped = new Map<string, {
      period: string
      total: number
      completed: number
      inProgress: number
      pending: number
    }>()

    tasks.forEach((task) => {
      const date = new Date(task.createdAt)
      let periodKey = ""

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
  }, [tasks, timeRange])

  const departmentData = useMemo(() => {
    if (!tasks) return []

    const grouped = new Map<string, {
      department: string
      total: number
      completed: number
      inProgress: number
      pending: number
    }>()

    tasks.forEach((task) => {
      // Only include tasks that match the selected period logic? 
      // Actually, to make it simple, we group ALL tasks by department 
      // AND their respective period. But typically "department split" means 
      // an overall breakdown across the whole timeframe or broken down by period.
      // Let's group by Department and Period to show a detailed split.
      const date = new Date(task.createdAt)
      let periodKey = ""

      if (timeRange === "monthly") {
        periodKey = date.toLocaleString("default", { month: "short", year: "numeric" })
      } else if (timeRange === "quarterly") {
        const q = Math.floor(date.getMonth() / 3) + 1
        periodKey = `Q${q} ${date.getFullYear()}`
      } else {
        periodKey = `${date.getFullYear()}`
      }

      const deptName = task.department?.name || "Unassigned"
      // Key is Department + Period
      const key = `${deptName}-${periodKey}`

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
  }, [tasks, timeRange])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="-m-6 flex min-h-[calc(100vh-3.5rem)] bg-zinc-50/30 dark:bg-zinc-950/30 print:bg-white print:m-0 print:min-h-0">
      <main className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible">
        <div className="space-y-8">
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 print:text-black">
                Audit Report
              </h1>
              <p className="text-base text-zinc-500 dark:text-zinc-400 print:text-gray-600">
                Concise task management report across periods.
              </p>
            </div>
            
            <div className="flex items-center gap-3 print:hidden">
              <div className="w-48">
                <Select value={timeRange} onValueChange={(val: TimeRange) => setTimeRange(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              </div>
              <Button onClick={handlePrint} variant="outline" className="gap-2">
                <IconPrinter className="h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </header>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-24 text-muted-foreground">
              <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm">Loading audit data…</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center justify-center gap-2 py-24 text-sm text-destructive">
              <IconAlertTriangle className="h-4 w-4" />
              Failed to load data. Please try again.
            </div>
          )}

          {!isLoading && !error && (
            <div className="grid gap-5 xl:grid-cols-2">
              <Card className="border-zinc-200/60 shadow-sm dark:border-zinc-800/60">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Trend Analysis</CardTitle>
                  <CardDescription>
                    Task resolutions grouped by {timeRange}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={aggregatedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(161, 161, 170, 0.2)" />
                        <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                        <Tooltip cursor={{ fill: "rgba(244, 244, 245, 0.5)" }} contentStyle={{ borderRadius: "8px", border: "1px solid #e4e4e7", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                        <Legend wrapperStyle={{ paddingTop: "20px" }} />
                        <Bar dataKey="completed" name="Completed" stackId={timeRange === 'yearly' ? undefined : 'a'} fill="#059669" radius={timeRange === 'yearly' ? [4, 4, 0, 0] : [0, 0, 4, 4]} />
                        <Bar dataKey="inProgress" name="In Progress" stackId={timeRange === 'yearly' ? undefined : 'a'} fill="#2563eb" radius={timeRange === 'yearly' ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
                        <Bar dataKey="pending" name="Pending" stackId={timeRange === 'yearly' ? undefined : 'a'} fill="#d97706" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-zinc-200/60 shadow-sm dark:border-zinc-800/60">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Audit Summary</CardTitle>
                  <CardDescription>
                    Detailed task statistics by {timeRange}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
                        <TableRow>
                          <TableHead>Period</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-right text-emerald-600 dark:text-emerald-400">Completed</TableHead>
                          <TableHead className="text-right text-blue-600 dark:text-blue-400">In Progress</TableHead>
                          <TableHead className="text-right text-amber-600 dark:text-amber-400">Pending</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {aggregatedData.length > 0 ? (
                          aggregatedData.map((row) => (
                            <TableRow key={row.period}>
                              <TableCell className="font-medium">{row.period}</TableCell>
                              <TableCell className="text-right">{row.total}</TableCell>
                              <TableCell className="text-right">{row.completed}</TableCell>
                              <TableCell className="text-right">{row.inProgress}</TableCell>
                              <TableCell className="text-right">{row.pending}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                              No data available.
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

          {!isLoading && !error && (
            <Card className="border-zinc-200/60 shadow-sm dark:border-zinc-800/60 print:break-inside-avoid print:shadow-none print:border-gray-200 mt-8">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Department Breakdown</CardTitle>
                <CardDescription>
                  Detailed statistics split by department
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
          )}
        </div>
      </main>
    </div>
  )
}
