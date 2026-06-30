import { useState, Fragment, useEffect } from "react"
import {
  IconSearch,
  IconArrowsSort,
  IconMessageCircle,
  IconCalendar,
  IconUser,
  IconBuilding,
  IconCheck,
  IconLoader2,
  IconAlertTriangle,
  IconCopy,
  IconChartBar,
} from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

import { type TaskWithDetails, type TaskStatus } from "@workspace/types"
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog"
import { TimeFilter } from "@/components/tasks/TimeFilter"
import { useUpdateTask, useDeleteTask, usePaginatedTasks } from "@/hooks/task"
import { useDepartments } from "@/hooks/department"
import { useTaskModal } from "@/context/task-modal-context"
import { PaginationFooter } from "@/components/ui/PaginationFooter"
import {
  formatDeadline,
  StatusSelect,
  DeleteButton,
  // ReopenButton,
} from "@/components/tasks/shared"
import { useAuth } from "@/context/auth-context"
// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const FILTER_TABS: { value: "ALL" | TaskStatus; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "HOLD", label: "Hold" },
  { value: "COMPLETED", label: "Completed" },
]

// ---------------------------------------------------------------------------
// Table row
// ---------------------------------------------------------------------------

function TaskTableRow({
  task,
  onSelectTask,
}: {
  task: TaskWithDetails
  onSelectTask: () => void
}) {
  const { user } = useAuth()
  const isAdmin = user?.role === "ADMIN"
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask()
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask()
  const dl = formatDeadline(task.deadline)
  return (
    <TableRow className="flex flex-col border-b border-border hover:bg-muted/40 md:table-row">
      <TableCell className="block min-w-0 py-4 pl-6 md:table-cell md:py-3 md:pl-6">
        <p
          className="cursor-pointer truncate text-sm font-medium underline-offset-2 transition-colors hover:text-primary hover:underline"
          onClick={onSelectTask}
        >
          {task.name}
        </p>
        <div className="mt-0.5 flex flex-col gap-0.5">
          {task.description && (
            <p className="max-w-md truncate text-xs text-muted-foreground">
              {task.description}
            </p>
          )}
          {task.createdAt && (
            <p className="text-[10px] text-muted-foreground/70">
              Created {formatDeadline(task.createdAt)?.formatted}
            </p>
          )}
        </div>
      </TableCell>

      <TableCell className="flex items-center justify-between px-6 py-1 md:table-cell md:px-0 md:py-3">
        <span className="text-xs text-muted-foreground md:hidden">
          Department:
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <IconBuilding className="h-3.5 w-3.5 shrink-0" />
          {task.department?.name ?? "—"}
        </span>
      </TableCell>

      <TableCell className="flex items-center justify-between px-6 py-1 md:table-cell md:px-0 md:py-3">
        <span className="text-xs text-muted-foreground md:hidden">
          Assignee:
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <IconUser className="h-3.5 w-3.5 shrink-0" />
          {task.assignee?.name ?? task.assigneeName ?? "Unassigned"}
        </span>
      </TableCell>

      <TableCell className="flex items-center justify-between px-6 py-1 md:table-cell md:px-0 md:py-3">
        <span className="text-xs text-muted-foreground md:hidden">Status:</span>
        <StatusSelect
          value={task.status}
          disabled={isUpdating}
          onCommit={(status, newDeadline) => {
            updateTask({
              id: task.id,
              status,
              ...(newDeadline ? { deadline: newDeadline.toISOString() } : {}),
            })
          }}
        />
      </TableCell>

      <TableCell className="flex items-center justify-between px-6 py-1 md:table-cell md:px-0 md:py-3">
        <span className="text-xs text-muted-foreground md:hidden">
          Last Updated:
        </span>
        <span className="text-xs text-muted-foreground">
          {task.updatedAt ? formatDeadline(task.updatedAt)?.formatted : "—"}
        </span>
      </TableCell>

      <TableCell className="flex items-center justify-between px-6 py-1 md:table-cell md:px-0 md:py-3">
        <span className="text-xs text-muted-foreground md:hidden">
          Deadline:
        </span>
        {dl ? (
          <span
            className={`flex items-center gap-1 text-xs font-medium ${dl.isOverdue && task.status !== "COMPLETED" ? "text-red-500" : "text-muted-foreground"}`}
          >
            <IconCalendar className="h-3.5 w-3.5 shrink-0" />
            {dl.formatted}
            {dl.isOverdue && task.status !== "COMPLETED" && (
              <span className="ml-1 rounded bg-red-100 px-1 py-0.5 text-[9px] text-red-500">
                Overdue
              </span>
            )}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>

      <TableCell className="flex items-center justify-between px-6 py-1 md:table-cell md:px-0 md:py-3">
        <span className="text-xs text-muted-foreground md:hidden">
          Remarks:
        </span>
        {task.remarks?.length > 0 ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex cursor-default items-center gap-1 text-xs text-muted-foreground">
                  <IconMessageCircle className="h-3.5 w-3.5" />
                  {task.remarks.length}
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="left"
                className="max-w-xs space-y-1.5 p-3 text-xs"
              >
                {task.remarks.slice(0, 3).map((r) => (
                  <p key={r.id}>
                    <span className="font-semibold">{r.authorName}:</span>{" "}
                    {r.text}
                  </p>
                ))}
                {task.remarks.length > 3 && (
                  <p className="text-muted-foreground">
                    +{task.remarks.length - 3} more
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>

      <TableCell className="flex items-center justify-between px-6 py-1 md:table-cell md:px-0 md:py-3 md:text-right">
        <span className="text-xs text-muted-foreground md:hidden">Value:</span>
        <span className="text-xs font-semibold">
          {task.metricValue != null
            ? task.metricValue.toLocaleString("en-US")
            : "—"}
        </span>
      </TableCell>

      <TableCell className="flex justify-end px-6 py-3 md:table-cell md:py-3 md:pr-6 md:pl-0 md:text-right">
        <div className="flex items-center justify-end gap-1">
          {task.status === "COMPLETED" && (
            <span className="mr-1 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <IconCheck className="h-3.5 w-3.5" /> Done
            </span>
          )}
          <CreateTaskDialog
            initialData={{
              name: task.name + " (Copy)",
              description: task.description || undefined,
              departmentId: task.departmentId,
            }}
            title="Duplicate Task"
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <IconCopy className="h-4 w-4" />
              </Button>
            }
          />
          {isAdmin ? (
            <DeleteButton
              taskName={task.name}
              isPending={isDeleting}
              onConfirm={() => deleteTask(task.id)}
            />
          ) : task.status === "IN_PROGRESS" ? (
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-[11px] font-medium text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
              onClick={(e) => {
                e.stopPropagation()
                updateTask({ id: task.id, status: "COMPLETED" })
              }}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <IconCheck className="h-3.5 w-3.5" />
              )}
              Complete
            </Button>
          ) : // : task.status === "COMPLETED" ? (
          //   <ReopenButton
          //     className="h-7 text-[11px] font-medium text-muted-foreground hover:text-foreground"
          //     disabled={isUpdating}
          //     onConfirm={(newDeadline) => {
          //       updateTask({
          //         id: task.id,
          //         status: "IN_PROGRESS",
          //         ...(newDeadline ? { deadline: newDeadline.toISOString() } : {}),
          //       })
          //     }}
          //   />
          // )

          null}
        </div>
      </TableCell>
    </TableRow>
  )
}

// ---------------------------------------------------------------------------
// Kanban card
// ---------------------------------------------------------------------------

function KanbanCard({
  task,
  onSelectTask,
}: {
  task: TaskWithDetails
  onSelectTask: (task: TaskWithDetails) => void
}) {
  const { user } = useAuth()
  const isAdmin = user?.role === "ADMIN"
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask()
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask()
  const dl = formatDeadline(task.deadline)

  return (
    <Card className="border-zinc-200/70 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800/70">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <p
            className="cursor-pointer text-sm leading-snug font-medium transition-colors hover:text-primary"
            onClick={() => onSelectTask(task)}
          >
            {task.name}
          </p>

          <div className="flex items-center gap-1">
            <CreateTaskDialog
              initialData={{
                name: task.name + " (Copy)",
                description: task.description || undefined,
                departmentId: task.departmentId,
              }}
              title="Duplicate Task"
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                >
                  <IconCopy className="h-3.5 w-3.5" />
                </Button>
              }
            />
            {isAdmin ? (
              <DeleteButton
                taskName={task.name}
                isPending={isDeleting}
                onConfirm={() => deleteTask(task.id)}
              />
            ) : task.status === "IN_PROGRESS" ? (
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                onClick={(e) => {
                  e.stopPropagation()
                  updateTask({ id: task.id, status: "COMPLETED" })
                }}
                disabled={isUpdating}
                title="Mark as Complete"
              >
                {isUpdating ? (
                  <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <IconCheck className="h-3.5 w-3.5" />
                )}
              </Button>
            ) : // : task.status === "COMPLETED" ? (
            //   <ReopenButton
            //     className="h-7 text-[11px] font-medium text-muted-foreground hover:text-foreground"
            //     disabled={isUpdating}
            //     onConfirm={(newDeadline) => {
            //       updateTask({
            //         id: task.id,
            //         status: "IN_PROGRESS",
            //         ...(newDeadline
            //           ? { deadline: newDeadline.toISOString() }
            //           : {}),
            //       })
            //     }}
            //   />
            // )

            null}
          </div>
        </div>

        {task.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {task.description}
          </p>
        )}

        <StatusSelect
          value={task.status}
          disabled={isUpdating}
          onCommit={(status, newDeadline) => {
            updateTask({
              id: task.id,
              status,
              ...(newDeadline ? { deadline: newDeadline.toISOString() } : {}),
            })
          }}
        />

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <IconBuilding className="h-3 w-3" />
            {task.department?.name ?? "—"}
          </span>
          <span className="flex items-center gap-1">
            <IconUser className="h-3 w-3" />
            {task.assignee?.name ?? task.assigneeName ?? "Unassigned"}
          </span>
          {task.createdAt && (
            <span className="flex items-center gap-1">
              <IconCalendar className="h-3 w-3" />
              Created: {formatDeadline(task.createdAt)?.formatted}
            </span>
          )}
          {dl && (
            <span
              className={`flex items-center gap-1 ${dl.isOverdue && task.status !== "COMPLETED" ? "font-semibold text-red-500" : ""}`}
            >
              <IconCalendar className="h-3 w-3" />
              Due: {dl.formatted}
            </span>
          )}
          {task.remarks?.length > 0 && (
            <span className="flex items-center gap-1">
              <IconMessageCircle className="h-3 w-3" />
              {task.remarks.length}
            </span>
          )}
          {task.metricValue != null && (
            <span className="flex items-center gap-1 font-semibold text-primary">
              <IconChartBar className="h-3 w-3" />
              {task.metricValue.toLocaleString("en-US")}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type ViewMode = "table" | "kanban"

export default function Tasks() {
  const { user } = useAuth()
  const isAdmin = user?.role === "ADMIN"
  const [myDepartment, setMyDepartment] = useState<string>("")

  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filter, setFilter] = useState<"ALL" | TaskStatus>("ALL")
  const [departmentId, setDepartmentId] = useState<string>("ALL")
  const [search, setSearch] = useState("")
  const [dateRange, setDateRange] = useState<{
    startDate?: string
    endDate?: string
  }>({})
  const { openTask } = useTaskModal()
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const { data: departments } = useDepartments()

  const {
    data: result,
    isLoading,
    error,
  } = usePaginatedTasks({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: search.trim() || undefined,
    status: filter === "ALL" ? undefined : filter,
    sortOrder,
    departmentId: departmentId === "ALL" ? undefined : departmentId,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  })

  const paginatedTasks = result?.data ?? []
  const totalTasks = result?.total ?? 0

  useEffect(() => {
    if (!isAdmin) {
      setMyDepartment(result?.data?.[0]?.department?.name ?? "")
    }
  }, [result])

  return (
    <div className="w-full min-w-0 space-y-6 p-4 pb-12 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Tasks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalTasks} task{totalTasks !== 1 ? "s" : ""} across departments
          </p>
        </div>
        <CreateTaskDialog />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <IconSearch className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="h-9 w-full rounded-full pl-8 text-sm sm:w-48"
            />
          </div>

          <Select
            value={departmentId}
            onValueChange={(val) => {
              setDepartmentId(val)
              setCurrentPage(1)
            }}
            disabled={!isAdmin}
          >
            <SelectTrigger className="h-9 w-[160px] rounded-full text-xs">
              <SelectValue
                placeholder={!isAdmin ? "All Departments" : myDepartment}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">
                {isAdmin ? "All Departments" : myDepartment}
              </SelectItem>
              {departments?.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex flex-wrap gap-1">
            {FILTER_TABS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => {
                  setFilter(value)
                  setCurrentPage(1)
                }}
                className={[
                  "h-8 rounded-full border px-3 text-xs font-medium transition-colors",
                  filter === value
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-transparent bg-muted text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Time filter component */}
          <TimeFilter onChange={setDateRange} />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-full px-3 text-xs text-muted-foreground"
            onClick={() => {
              setSortOrder((p) => (p === "asc" ? "desc" : "asc"))
              setCurrentPage(1)
            }}
          >
            <IconArrowsSort
              className={`h-3.5 w-3.5 transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`}
            />
            {sortOrder === "asc" ? "Oldest first" : "Newest first"}
          </Button>
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as ViewMode)}
          >
            <TabsList className="h-8 rounded-full p-0.5">
              <TabsTrigger
                value="table"
                className="h-7 rounded-full px-3 text-xs"
              >
                Table
              </TabsTrigger>
              <TabsTrigger
                value="kanban"
                className="h-7 rounded-full px-3 text-xs"
              >
                Kanban
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

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

      {/* Table */}
      {!isLoading && !error && viewMode === "table" && (
        <Card className="overflow-hidden border-zinc-200/60 shadow-none dark:border-zinc-800/60">
          <Table className="block w-full md:table">
            <TableHeader className="hidden bg-muted/40 md:table-header-group">
              <TableRow>
                <TableHead className="w-[18%] pl-6">Task</TableHead>
                <TableHead className="w-[11%]">Department</TableHead>
                <TableHead className="w-[11%]">Assignee</TableHead>
                <TableHead className="w-[11%]">Status</TableHead>
                <TableHead className="w-[12%]">Last Updated</TableHead>
                <TableHead className="w-[12%]">Deadline</TableHead>
                <TableHead className="w-[7%]">Remarks</TableHead>
                <TableHead className="w-[10%] text-right">Value</TableHead>
                <TableHead className="w-[8%] pr-6 text-right" />
              </TableRow>
            </TableHeader>
            <TableBody className="block md:table-row-group">
              {paginatedTasks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="min-w-0 py-20 text-center text-sm text-muted-foreground"
                  >
                    No tasks match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                Object.entries(
                  paginatedTasks.reduce(
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
                    {} as Record<string, typeof paginatedTasks>
                  )
                ).map(([dateStr, tasks]) => (
                  <Fragment key={dateStr}>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableCell
                        colSpan={9}
                        className="border-b py-2 pl-6 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                      >
                        {dateStr}
                      </TableCell>
                    </TableRow>
                    {tasks.map((task) => (
                      <TaskTableRow
                        key={task.id}
                        task={task}
                        onSelectTask={() => openTask(task)}
                      />
                    ))}
                  </Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Kanban / Grid View */}
      {!isLoading && !error && viewMode === "kanban" && (
        <div className="flex flex-col gap-6 pb-4">
          {Object.entries(
            paginatedTasks.reduce(
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
              {} as Record<string, typeof paginatedTasks>
            )
          ).map(([dateStr, tasks]) => (
            <div key={dateStr} className="flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <IconCalendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">{dateStr}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {tasks.length}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tasks.map((t) => (
                  <KanbanCard key={t.id} task={t} onSelectTask={openTask} />
                ))}
              </div>
            </div>
          ))}
        </div>
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
}
