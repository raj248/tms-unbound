import { useState } from "react"
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

import { type TaskWithDetails, type TaskStatus } from "@workspace/types"
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog"
import { useUpdateTask, useDeleteTask, usePaginatedTasks } from "@/hooks/task"
import { useTaskModal } from "@/context/task-modal-context"
import { PaginationFooter } from "@/components/ui/PaginationFooter"
import {
  STATUS_CONFIG,
  formatDeadline,
  StatusSelect,
  DeleteButton,
} from "@/components/tasks/shared"

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const FILTER_TABS: { value: "ALL" | TaskStatus; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "PENDING", label: "Pending" },
  { value: "BLOCKED", label: "Blocked" },
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
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask()
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask()
  const dl = formatDeadline(task.deadline)
  return (
    <TableRow className="flex flex-col border-b border-border hover:bg-muted/40 md:table-row">
      <TableCell className="block py-4 pl-6 md:table-cell md:py-3 md:pl-6">
        <p
          className="cursor-pointer truncate text-sm font-medium underline-offset-2 transition-colors hover:text-primary hover:underline"
          onClick={onSelectTask}
        >
          {task.name}
        </p>
        {task.description && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {task.description}
          </p>
        )}
      </TableCell>

      <TableCell className="flex items-center justify-between px-6 py-1 md:table-cell md:px-0 md:py-3">
        <span className="text-xs text-muted-foreground md:hidden">Department:</span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <IconBuilding className="h-3.5 w-3.5 shrink-0" />
          {task.department?.name ?? "—"}
        </span>
      </TableCell>

      <TableCell className="flex items-center justify-between px-6 py-1 md:table-cell md:px-0 md:py-3">
        <span className="text-xs text-muted-foreground md:hidden">Assignee:</span>
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
          onCommit={(status) => updateTask({ id: task.id, status })}
        />
      </TableCell>

      <TableCell className="flex items-center justify-between px-6 py-1 md:table-cell md:px-0 md:py-3">
        <span className="text-xs text-muted-foreground md:hidden">Deadline:</span>
        {dl ? (
          <span
            className={`flex items-center gap-1 text-xs font-medium ${dl.isOverdue && task.status !== "COMPLETED" ? "text-red-500" : "text-muted-foreground"}`}
          >
            <IconCalendar className="h-3.5 w-3.5 shrink-0" />
            {dl.formatted}
            {dl.isOverdue && task.status !== "COMPLETED" && (
              <span className="ml-1 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] text-red-500">
                Overdue
              </span>
            )}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>

      <TableCell className="flex items-center justify-between px-6 py-1 md:table-cell md:px-0 md:py-3">
        <span className="text-xs text-muted-foreground md:hidden">Remarks:</span>
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

      <TableCell className="flex justify-end px-6 py-3 md:table-cell md:py-3 md:pr-6 md:pl-0 md:text-right">
        <div className="flex items-center justify-end gap-1">
          {task.status === "COMPLETED" && (
            <span className="mr-1 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <IconCheck className="h-3.5 w-3.5" /> Done
            </span>
          )}
          <DeleteButton
            taskName={task.name}
            isPending={isDeleting}
            onConfirm={() => deleteTask(task.id)}
          />
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
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask()
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask()
  const dl = formatDeadline(task.deadline)

  return (
    <Card className="border-zinc-200/70 shadow-none transition-shadow hover:shadow-sm dark:border-zinc-800/70">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <p
            className="cursor-pointer text-sm leading-snug font-medium transition-colors hover:text-primary"
            onClick={() => onSelectTask(task)}
          >
            {task.name}
          </p>

          <DeleteButton
            taskName={task.name}
            isPending={isDeleting}
            onConfirm={() => deleteTask(task.id)}
          />
        </div>

        {task.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {task.description}
          </p>
        )}

        <StatusSelect
          value={task.status}
          disabled={isUpdating}
          onCommit={(status) => updateTask({ id: task.id, status })}
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
          {dl && (
            <span
              className={`flex items-center gap-1 ${dl.isOverdue && task.status !== "COMPLETED" ? "font-semibold text-red-500" : ""}`}
            >
              <IconCalendar className="h-3 w-3" />
              {dl.formatted}
            </span>
          )}
          {task.remarks?.length > 0 && (
            <span className="flex items-center gap-1">
              <IconMessageCircle className="h-3 w-3" />
              {task.remarks.length}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Kanban column
// ---------------------------------------------------------------------------

function KanbanColumn({
  status,
  tasks,
  onSelectTask,
}: {
  status: TaskStatus
  tasks: TaskWithDetails[]
  onSelectTask: (task: TaskWithDetails) => void
}) {
  const cfg = STATUS_CONFIG[status]
  return (
    <div className="flex min-w-[260px] flex-1 flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
          <span className="text-sm font-semibold">{cfg.label}</span>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 py-8 text-center text-xs text-muted-foreground dark:border-zinc-800">
            No tasks
          </div>
        ) : (
          tasks.map((t) => (
            <KanbanCard key={t.id} task={t} onSelectTask={onSelectTask} />
          ))
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type ViewMode = "table" | "kanban"

export default function AdminTasks() {
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filter, setFilter] = useState<"ALL" | TaskStatus>("ALL")
  const [search, setSearch] = useState("")
  const { openTask } = useTaskModal()
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

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
  })

  const paginatedTasks = result?.data ?? []
  const totalTasks = result?.total ?? 0
  // const totalPages = Math.ceil(totalTasks / ITEMS_PER_PAGE)

  return (
    <div className="w-full min-w-0 space-y-6 p-4 sm:p-6 pb-12 md:p-8">
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
          <Table>
            <TableHeader className="hidden bg-muted/40 md:table-header-group">
              <TableRow>
                <TableHead className="w-[26%] pl-6">Task</TableHead>
                <TableHead className="w-[14%]">Department</TableHead>
                <TableHead className="w-[14%]">Assignee</TableHead>
                <TableHead className="w-[14%]">Status</TableHead>
                <TableHead className="w-[15%]">Deadline</TableHead>
                <TableHead className="w-[8%]">Remarks</TableHead>
                <TableHead className="w-[9%] pr-6 text-right" />
              </TableRow>
            </TableHeader>
              <TableBody>
                {paginatedTasks.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-20 text-center text-sm text-muted-foreground"
                    >
                      No tasks match your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTasks.map((task) => (
                    <TaskTableRow
                      key={task.id}
                      task={task}
                      onSelectTask={() => openTask(task)}
                    />
                  ))
                )}
              </TableBody>
            </Table>
        </Card>
      )}

      {/* Kanban */}
      {!isLoading && !error && viewMode === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {(Object.keys(STATUS_CONFIG) as TaskStatus[]).map((s) => (
            <KanbanColumn
              key={s}
              status={s}
              tasks={paginatedTasks.filter((t) => t.status === s)}
              onSelectTask={openTask}
            />
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
