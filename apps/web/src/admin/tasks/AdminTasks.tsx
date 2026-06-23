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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

import { type TaskWithDetails, type TaskStatus } from "@workspace/types"
import { CreateTaskDialog } from "./CreateTaskDialog"
import { useTasks } from "@/hooks/task"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; className: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    className: "border-orange-200 bg-orange-50 text-orange-600",
    dot: "bg-orange-400",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "border-blue-200 bg-blue-50 text-blue-600",
    dot: "bg-blue-400",
  },
  BLOCKED: {
    label: "Blocked",
    className: "border-red-200 bg-red-50 text-red-600",
    dot: "bg-red-500",
  },
  COMPLETED: {
    label: "Completed",
    className: "border-emerald-200 bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-500",
  },
}

const FILTER_TABS: { value: "ALL" | TaskStatus; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "PENDING", label: "Pending" },
  { value: "BLOCKED", label: "Blocked" },
  { value: "COMPLETED", label: "Completed" },
]

function StatusBadge({ status }: { status: TaskStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${cfg.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

function formatDeadline(dateString: string | Date | null) {
  if (!dateString) return null
  const date = new Date(dateString)
  const now = new Date()
  const isOverdue = date < now
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  return { formatted, isOverdue }
}

// ---------------------------------------------------------------------------
// Inline status editor
// ---------------------------------------------------------------------------

function StatusSelect({
  value,
  onCommit,
}: {
  value: TaskStatus
  onCommit: (next: TaskStatus) => void
}) {
  return (
    <Select value={value} onValueChange={(v) => onCommit(v as TaskStatus)}>
      <SelectTrigger className="h-7 w-36 border-0 bg-transparent p-0 text-[11px] shadow-none focus:ring-0 [&>svg]:h-3 [&>svg]:w-3">
        <SelectValue>
          <StatusBadge status={value} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(STATUS_CONFIG) as TaskStatus[]).map((s) => (
          <SelectItem key={s} value={s} className="text-xs">
            <StatusBadge status={s} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// ---------------------------------------------------------------------------
// Kanban card
// ---------------------------------------------------------------------------

function KanbanCard({
  task,
  onStatusChange,
}: {
  task: TaskWithDetails
  onStatusChange: (id: string, s: TaskStatus) => void
}) {
  const dl = formatDeadline(task.deadline)

  return (
    <Card className="group border-zinc-200/70 shadow-none transition-shadow hover:shadow-sm dark:border-zinc-800/70">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm leading-snug font-medium text-foreground">
            {task.name}
          </p>
          <StatusSelect
            value={task.status}
            onCommit={(s) => onStatusChange(task.id, s)}
          />
        </div>

        {task.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground">
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
              {dl.isOverdue && task.status !== "COMPLETED" && " · Overdue"}
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
// Table row
// ---------------------------------------------------------------------------

function TaskTableRow({
  task,
  onStatusChange,
}: {
  task: TaskWithDetails
  onStatusChange: (id: string, s: TaskStatus) => void
}) {
  const dl = formatDeadline(task.deadline)

  return (
    <TableRow className="hover:bg-muted/40">
      {/* Task name + description */}
      <TableCell className="py-3 pl-6">
        <p className="truncate text-sm font-medium">{task.name}</p>
        {task.description && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {task.description}
          </p>
        )}
      </TableCell>

      {/* Department */}
      <TableCell className="py-3">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <IconBuilding className="h-3.5 w-3.5 shrink-0" />
          {task.department?.name ?? "—"}
        </span>
      </TableCell>

      {/* Assignee */}
      <TableCell className="py-3">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <IconUser className="h-3.5 w-3.5 shrink-0" />
          {task.assignee?.name ?? task.assigneeName ?? "Unassigned"}
        </span>
      </TableCell>

      {/* Status — inline editable */}
      <TableCell className="py-3">
        <StatusSelect
          value={task.status}
          onCommit={(s) => onStatusChange(task.id, s)}
        />
      </TableCell>

      {/* Deadline */}
      <TableCell className="py-3">
        {dl ? (
          <span
            className={`flex items-center gap-1 text-xs font-medium ${dl.isOverdue && task.status !== "COMPLETED" ? "text-red-500" : "text-muted-foreground"}`}
          >
            <IconCalendar className="h-3.5 w-3.5 shrink-0" />
            {dl.formatted}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>

      {/* Remarks */}
      <TableCell className="py-3">
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
                className="max-w-xs space-y-1 p-3 text-xs"
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

      {/* Done indicator */}
      <TableCell className="py-3 pr-6 text-right">
        {task.status === "COMPLETED" && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <IconCheck className="h-3.5 w-3.5" /> Done
          </span>
        )}
      </TableCell>
    </TableRow>
  )
}

// ---------------------------------------------------------------------------
// Kanban column
// ---------------------------------------------------------------------------

function KanbanColumn({
  status,
  tasks,
  onStatusChange,
}: {
  status: TaskStatus
  tasks: TaskWithDetails[]
  onStatusChange: (id: string, s: TaskStatus) => void
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
            <KanbanCard key={t.id} task={t} onStatusChange={onStatusChange} />
          ))
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

type ViewMode = "table" | "kanban"

export default function AdminTasks() {
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filter, setFilter] = useState<"ALL" | TaskStatus>("ALL")
  const [search, setSearch] = useState("")

  const { data: tasks, isLoading, error } = useTasks()

  // Optimistic local status overrides
  const [localOverrides, setLocalOverrides] = useState<
    Record<string, TaskStatus>
  >({})

  function handleStatusChange(id: string, next: TaskStatus) {
    setLocalOverrides((p) => ({ ...p, [id]: next }))
    // TODO: fire API mutation here, roll back on error
    console.log("update task status →", id, next)
  }

  const mergedTasks: TaskWithDetails[] = (tasks ?? []).map((t) => ({
    ...t,
    status: localOverrides[t.id] ?? t.status,
  }))

  const searched = mergedTasks.filter((t) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      t.name.toLowerCase().includes(q) ||
      t.department?.name?.toLowerCase().includes(q) ||
      (t.assignee?.name ?? t.assigneeName ?? "").toLowerCase().includes(q)
    )
  })

  const filtered = searched.filter(
    (t) => filter === "ALL" || t.status === filter
  )

  const sorted = [...filtered].sort((a, b) => {
    const da = a.deadline ? new Date(a.deadline).getTime() : 0
    const db = b.deadline ? new Date(b.deadline).getTime() : 0
    return sortOrder === "asc" ? da - db : db - da
  })

  // Kanban grouped
  const byStatus = (s: TaskStatus) => sorted.filter((t) => t.status === s)

  return (
    <div className="w-full space-y-6 p-6 pb-12 md:p-8">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">System Tasks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {sorted.length} task{sorted.length !== 1 ? "s" : ""} across
            departments
          </p>
        </div>
        <CreateTaskDialog />
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: search + filter tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <IconSearch className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-48 rounded-full pl-8 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {FILTER_TABS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
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

        {/* Right: sort + view toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-full px-3 text-xs text-muted-foreground"
            onClick={() => setSortOrder((p) => (p === "asc" ? "desc" : "asc"))}
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

      {/* ── Loading / Error ── */}
      {isLoading && (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
          <span className="text-sm">Loading tasks…</span>
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center gap-2 py-24 text-sm text-destructive">
          <IconAlertTriangle className="h-4 w-4" />
          Failed to load tasks. Please try again.
        </div>
      )}

      {/* ── Table view ── */}
      {!isLoading && !error && viewMode === "table" && (
        <Card className="overflow-hidden border-zinc-200/60 shadow-none dark:border-zinc-800/60">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[28%] pl-6">Task</TableHead>
                <TableHead className="w-[14%]">Department</TableHead>
                <TableHead className="w-[14%]">Assignee</TableHead>
                <TableHead className="w-[14%]">Status</TableHead>
                <TableHead className="w-[13%]">Deadline</TableHead>
                <TableHead className="w-[8%]">Remarks</TableHead>
                <TableHead className="w-[9%] pr-6 text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-20 text-center text-sm text-muted-foreground"
                  >
                    No tasks match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                sorted.map((task) => (
                  <TaskTableRow
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* ── Kanban view ── */}
      {!isLoading && !error && viewMode === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {(Object.keys(STATUS_CONFIG) as TaskStatus[]).map((s) => (
            <KanbanColumn
              key={s}
              status={s}
              tasks={byStatus(s)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}
