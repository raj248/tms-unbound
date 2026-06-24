import { useState, Fragment } from "react"
import {
  IconSearch,
  IconArrowsSort,
  IconEdit,
  IconCheck,
  IconCopy,
} from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Card } from "@workspace/ui/components/card"
import { type TaskWithDetails } from "@workspace/types"
import { usePaginatedTasks, useUpdateTask } from "@/hooks/task"
import { useAuth } from "@/context/auth-context"
import { useUsers } from "@/hooks/user"
import { useTaskModal } from "@/context/task-modal-context"
import { PaginationFooter } from "@/components/ui/PaginationFooter"
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog"
import { TimeFilter } from "@/components/tasks/TimeFilter"

const getStatusStyle = (status: string) => {
  if (status === "HOLD") return "destructive"
  if (status === "IN_PROGRESS") return "default"
  return "secondary"
}

const formatStatusText = (status: string) => {
  if (status === "HOLD") return "Hold"
  if (status === "IN_PROGRESS") return "In Progress"
  if (status === "COMPLETED") return "Completed"
  return status
}

const formatDeadline = (dateString: string | Date | null) => {
  if (!dateString) return "No date"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" })
}

export default function Tasks() {
  const { user } = useAuth()
  const { data: users, isLoading: usersLoading } = useUsers()

  const currentUserObj = users?.find((u) => u.id === user?.id)
  const myDepartmentId = currentUserObj?.departments?.[0]?.id
  const { openTask } = useTaskModal()

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filter, setFilter] = useState<
    "ALL" | "IN_PROGRESS" | "COMPLETED" | "HOLD"
  >("ALL")
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    setCurrentPage(1)
  }

  const handleFilterChange = (
    newFilter: "ALL" | "IN_PROGRESS" | "COMPLETED" | "HOLD"
  ) => {
    setFilter(newFilter)
    setCurrentPage(1)
  }

  const [search, setSearch] = useState("")
  const [dateRange, setDateRange] = useState<{
    startDate?: string
    endDate?: string
  }>({})

  const {
    data: result,
    isLoading: tasksLoading,
    error,
  } = usePaginatedTasks({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: search.trim() || undefined,
    status: filter === "ALL" ? undefined : filter,
    sortOrder,
    departmentId: myDepartmentId,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    enabled: !!myDepartmentId,
  })

  const isLoading = tasksLoading || usersLoading

  const totalTasks = result?.total ?? 0
  // const totalPages = Math.ceil(totalTasks / ITEMS_PER_PAGE)
  const safeTasks = result?.data ?? []

  return (
    <div className="w-full space-y-6 p-8 pb-12">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Department Tasks
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalTasks} tasks available
          </p>
        </div>
        {myDepartmentId && (
          <CreateTaskDialog fixedDepartmentId={myDepartmentId} />
        )}
      </div>

      {/* Filters and Search Row */}
      <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-48">
            <IconSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search all tasks..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="h-9 w-full rounded-full pl-9"
            />
          </div>
          <Button
            onClick={() => handleFilterChange("ALL")}
            variant={filter === "ALL" ? "default" : "outline"}
            className={`h-9 rounded-full px-4 ${filter === "ALL" ? "border border-blue-200 bg-blue-100 text-blue-700 shadow-none hover:bg-blue-200 hover:text-blue-800" : "text-muted-foreground"}`}
          >
            All
          </Button>
          <Button
            onClick={() => handleFilterChange("IN_PROGRESS")}
            variant={filter === "IN_PROGRESS" ? "default" : "outline"}
            className={`h-9 rounded-full px-4 ${filter === "IN_PROGRESS" ? "border border-blue-200 bg-blue-100 text-blue-700 shadow-none hover:bg-blue-200 hover:text-blue-800" : "text-muted-foreground"}`}
          >
            In progress
          </Button>
          <Button
            onClick={() => handleFilterChange("COMPLETED")}
            variant={filter === "COMPLETED" ? "default" : "outline"}
            className={`h-9 rounded-full px-4 ${filter === "COMPLETED" ? "border border-blue-200 bg-blue-100 text-blue-700 shadow-none hover:bg-blue-200 hover:text-blue-800" : "text-muted-foreground"}`}
          >
            Completed
          </Button>
          <Button
            onClick={() => handleFilterChange("HOLD")}
            variant={filter === "HOLD" ? "default" : "outline"}
            className={`h-9 rounded-full px-4 ${filter === "HOLD" ? "border border-orange-200 bg-orange-100 text-orange-700 shadow-none hover:bg-orange-200 hover:text-orange-800" : "text-muted-foreground"}`}
          >
            Hold
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <TimeFilter onChange={setDateRange} />
          <Button
            variant="outline"
            size="sm"
            onClick={handleSortToggle}
            className="h-9 gap-1.5 rounded-full px-4 text-xs text-muted-foreground"
          >
            <IconArrowsSort
              className={`h-4 w-4 transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`}
            />
            {sortOrder === "asc" ? "Oldest First" : "Newest First"}
          </Button>
        </div>
      </div>

      {/* Task Table Structure */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <span className="text-sm">Loading tasks…</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-24 text-sm text-destructive">
          Failed to load tasks.
        </div>
      ) : (
        <Card className="overflow-hidden border-zinc-200/60 shadow-none dark:border-zinc-800/60">
          <Table>
            <TableHeader className="hidden bg-muted/50 md:table-header-group">
              <TableRow>
                <TableHead className="w-[30%]">Task</TableHead>
                <TableHead className="w-[15%] text-center">Status</TableHead>
                <TableHead className="w-[15%] text-center">
                  Last Updated
                </TableHead>
                <TableHead className="w-[15%] text-center">Deadline</TableHead>
                <TableHead className="w-[25%] pr-6 text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeTasks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-20 text-center text-sm text-muted-foreground"
                  >
                    No tasks match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                Object.entries(
                  safeTasks.reduce(
                    (acc, task) => {
                      const dateStr = task.createdAt
                        ? new Date(task.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Unknown Date"
                      if (!acc[dateStr]) acc[dateStr] = []
                      acc[dateStr].push(task)
                      return acc
                    },
                    {} as Record<string, typeof safeTasks>
                  )
                ).map(([dateStr, tasks]) => (
                  <Fragment key={dateStr}>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableCell
                        colSpan={5}
                        className="border-b px-6 py-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                      >
                        {dateStr}
                      </TableCell>
                    </TableRow>
                    {tasks.map((task) => (
                      <TaskRow key={task.id} task={task} />
                    ))}
                  </Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Pagination Footer */}
      {!isLoading && !error && totalTasks > 0 && (
        <PaginationFooter
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={totalTasks}
          itemsPerPage={ITEMS_PER_PAGE}
          itemLabel="tasks"
        />
      )}
    </div>
  )

  function TaskRow({ task }: { task: TaskWithDetails }) {
    const statusVariant = getStatusStyle(task.status) as any
    const { mutate: updateTask, isPending } = useUpdateTask()

    let customStatusClass = ""
    if (task.status === "IN_PROGRESS") {
      customStatusClass = "bg-blue-50 text-blue-600 hover:bg-blue-50"
    } else if (task.status === "COMPLETED") {
      customStatusClass = "bg-emerald-50 text-emerald-600 hover:bg-emerald-50"
    } else if (task.status === "HOLD") {
      customStatusClass = "bg-orange-50 text-orange-600 hover:bg-orange-50"
    }

    return (
      <TableRow className="flex flex-col border-b border-border hover:bg-muted/50 md:table-row">
        <TableCell className="block px-6 py-4 font-medium md:table-cell md:py-3">
          <p
            className="cursor-pointer truncate text-sm font-medium text-foreground underline-offset-2 transition-colors hover:text-primary hover:underline"
            onClick={() => openTask(task)}
          >
            {task.name}
          </p>
          <div className="mt-0.5 flex flex-col gap-0.5">
            <p className="truncate text-xs text-muted-foreground">
              {task.department?.name || "Unassigned Dept"} ·{" "}
              {task.assigneeName || "Unassigned"}
            </p>
            {task.createdAt && (
              <p className="text-[10px] text-muted-foreground/70">
                Created {formatDeadline(task.createdAt)}
              </p>
            )}
          </div>
        </TableCell>

        <TableCell className="flex items-center justify-between px-6 py-1 md:table-cell md:py-3 md:text-center">
          <span className="text-xs text-muted-foreground md:hidden">
            Status:
          </span>
          <Badge
            variant={
              statusVariant === "default" || statusVariant === "secondary"
                ? "outline"
                : statusVariant
            }
            className={`border-transparent px-2.5 py-0.5 text-[10px] font-bold ${customStatusClass}`}
          >
            {formatStatusText(task.status)}
          </Badge>
        </TableCell>

        <TableCell className="flex justify-between px-6 py-1 md:table-cell md:py-3 md:text-center">
          <span className="text-xs text-muted-foreground md:hidden">
            Updated:
          </span>
          <span className="text-xs text-muted-foreground">
            {task.updatedAt ? formatDeadline(task.updatedAt) : "—"}
          </span>
        </TableCell>

        <TableCell className="flex justify-between px-6 py-1 md:table-cell md:py-3 md:text-center">
          <span className="text-xs text-muted-foreground md:hidden">Due:</span>
          <span
            className={`text-xs font-semibold ${task.status === "IN_PROGRESS" ? "text-destructive" : "text-muted-foreground"}`}
          >
            {formatDeadline(task.deadline)}
          </span>
        </TableCell>

        <TableCell className="flex justify-end px-6 py-3 pb-4 text-right md:table-cell md:py-3">
          <div className="flex items-center justify-end gap-2">
            <CreateTaskDialog
              fixedDepartmentId={task.departmentId}
              initialData={{
                name: task.name + " (Copy)",
                description: task.description || undefined,
              }}
              title="Duplicate Task"
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1.5 px-3 text-[11px]"
                >
                  <IconCopy className="h-3 w-3" />
                  Duplicate
                </Button>
              }
            />
            {task.status === "HOLD" ? null : task.status === "COMPLETED" ? (
              <Button
                variant="secondary"
                size="sm"
                className="h-7 cursor-default gap-1.5 px-3 text-[11px] hover:bg-secondary"
              >
                <IconCheck className="h-3 w-3 text-muted-foreground" />
                Done
              </Button>
            ) : task.status === "IN_PROGRESS" ? (
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 px-3 text-[11px] hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                disabled={isPending}
                onClick={() => updateTask({ id: task.id, status: "COMPLETED" })}
              >
                <IconCheck className="h-3 w-3 text-emerald-500" />
                Complete
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 px-3 text-[11px] hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                disabled={isPending}
                onClick={() =>
                  updateTask({ id: task.id, status: "IN_PROGRESS" })
                }
              >
                <IconEdit className="h-3 w-3 text-blue-500" />
                Start
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
    )
  }
}
