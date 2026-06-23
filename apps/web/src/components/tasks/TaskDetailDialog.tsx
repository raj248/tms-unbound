import { useRef, useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import {
  IconCalendar,
  IconUser,
  IconBuilding,
  IconSend,
  IconTrash,
  IconLoader2,
  IconMessageCircle,
} from "@tabler/icons-react"
import type { TaskWithDetails, TaskStatus } from "@workspace/types"
import { useRemarks, useCreateRemark, useDeleteRemark } from "@/hooks/remark"
import { useAuth } from "@/context/auth-context"

// ---------------------------------------------------------------------------
// Config (mirrors AdminTasks)
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

function formatDate(
  d: string | Date | null,
  opts?: Intl.DateTimeFormatOptions
) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString(
    "en-US",
    opts ?? { month: "short", day: "numeric", year: "numeric" }
  )
}

function formatTime(d: string | Date) {
  return new Date(d).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
}

// ---------------------------------------------------------------------------
// Remark bubble
// ---------------------------------------------------------------------------

function RemarkBubble({
  remark,
  isOwn,
  taskId,
}: {
  remark: {
    id: string
    text: string
    authorName: string
    createdAt: string | Date
  }
  isOwn: boolean
  taskId: string
}) {
  const { mutate: deleteRemark, isPending } = useDeleteRemark()

  return (
    <div
      className={`group flex items-end gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
        {remark.authorName.charAt(0).toUpperCase()}
      </div>

      {/* Bubble */}
      <div
        className={`relative max-w-[72%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-0.5`}
      >
        {!isOwn && (
          <span className="pl-1 text-[10px] font-semibold text-muted-foreground">
            {remark.authorName}
          </span>
        )}
        <div
          className={[
            "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
            isOwn
              ? "rounded-br-sm bg-primary text-primary-foreground"
              : "rounded-bl-sm bg-muted text-foreground",
          ].join(" ")}
        >
          {remark.text}
          <span
            className={`mt-1 block text-right text-[10px] ${isOwn ? "text-primary-foreground/60" : "text-muted-foreground"}`}
          >
            {formatTime(remark.createdAt)}
          </span>
        </div>
      </div>

      {/* Delete — only visible on hover, only for own remarks */}
      {isOwn && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => deleteRemark({ id: remark.id, taskId })}
                disabled={isPending}
                className="mb-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <IconTrash className="h-3.5 w-3.5" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs">
              Delete remark
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Date separator
// ---------------------------------------------------------------------------

function DateSeparator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="h-px flex-1 bg-border" />
      <span className="text-[10px] font-medium text-muted-foreground">
        {label}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Task Detail Dialog
// ---------------------------------------------------------------------------

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
}: {
  task: TaskWithDetails | null
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const { user } = useAuth()
  const [text, setText] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  const { data: remarks = [], isLoading: loadingRemarks } = useRemarks(
    task?.id ?? ""
  )
  const { mutate: createRemark, isPending: sending } = useCreateRemark()

  // Scroll to bottom when remarks load or new one arrives
  useEffect(() => {
    if (open) {
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        80
      )
    }
  }, [remarks.length, open])

  function handleSend() {
    const trimmed = text.trim()
    if (!trimmed || !task) return
    createRemark(
      { taskId: task.id, text: trimmed },
      { onSuccess: () => setText("") }
    )
  }

  // Group remarks by calendar day for date separators
  const grouped: { label: string; items: typeof remarks }[] = []
  for (const r of remarks) {
    const label = formatDate(r.createdAt, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    const last = grouped[grouped.length - 1]
    if (last?.label === label) last.items.push(r)
    else grouped.push({ label, items: [r] })
  }

  const deadline = task ? formatDate(task.deadline) : "—"
  const isOverdue =
    task?.deadline &&
    new Date(task.deadline) < new Date() &&
    task.status !== "COMPLETED"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[85vh] max-h-[720px] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
        {/* ── Header ── */}
        <DialogHeader className="shrink-0 border-b px-5 py-4">
          <div className="mt-2 flex items-start justify-between gap-3 pr-8">
            <div className="min-w-0 space-y-1">
              <DialogTitle className="truncate text-base leading-tight font-semibold">
                {task?.name}
              </DialogTitle>
              {task?.description && (
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {task.description}
                </p>
              )}
            </div>
            <StatusBadge status={task?.status ?? "PENDING"} />
          </div>

          {/* Meta row */}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <IconBuilding className="h-3.5 w-3.5 shrink-0" />
              {task?.department?.name ?? "—"}
            </span>
            <span className="flex items-center gap-1.5">
              <IconUser className="h-3.5 w-3.5 shrink-0" />
              {task?.assignee?.name ?? task?.assigneeName ?? "Unassigned"}
            </span>
            <span
              className={`flex items-center gap-1.5 ${isOverdue ? "font-semibold text-red-500" : ""}`}
            >
              <IconCalendar className="h-3.5 w-3.5 shrink-0" />
              {deadline}
              {isOverdue && (
                <span className="rounded-full bg-red-100 px-1.5 py-px text-[10px] text-red-500">
                  Overdue
                </span>
              )}
            </span>
          </div>
        </DialogHeader>

        {/* ── Remarks thread ── */}
        <div className="flex flex-1 flex-col overflow-hidden bg-zinc-50/60 dark:bg-zinc-900/30">
          {/* Scrollable message area */}
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
            {loadingRemarks ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="text-xs">Loading remarks…</span>
              </div>
            ) : remarks.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
                <IconMessageCircle className="h-8 w-8 opacity-30" />
                <p className="text-xs">
                  No remarks yet. Start the conversation.
                </p>
              </div>
            ) : (
              grouped.map(({ label, items }) => (
                <div key={label} className="space-y-3">
                  <DateSeparator label={label} />
                  {items.map((r) => (
                    <RemarkBubble
                      key={r.id}
                      remark={r}
                      taskId={task?.id ?? ""}
                      isOwn={r.authorName === (user?.name ?? user?.username)}
                    />
                  ))}
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* ── Input bar ── */}
          <div className="shrink-0 border-t bg-background px-4 py-3">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Write a remark…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                className="h-9 flex-1 rounded-full bg-muted/60 text-sm focus-visible:ring-1"
                disabled={sending}
              />
              <Button
                size="icon"
                className="h-9 w-9 shrink-0 rounded-full"
                onClick={handleSend}
                disabled={!text.trim() || sending}
              >
                {sending ? (
                  <IconLoader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <IconSend className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
              Press{" "}
              <kbd className="rounded border px-1 py-px font-mono text-[9px]">
                Enter
              </kbd>{" "}
              to send
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
