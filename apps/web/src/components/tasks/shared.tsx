import { type TaskStatus } from "@workspace/types"
import { IconTrash, IconLoader2 } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"

export const STATUS_CONFIG: Record<
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

export function StatusBadge({ status }: { status: TaskStatus }) {
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

export function formatDeadline(dateString: string | Date | null) {
  if (!dateString) return null
  const date = new Date(dateString)
  const isOverdue = date < new Date()
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  return { formatted, isOverdue }
}

export function StatusSelect({
  value,
  disabled,
  onCommit,
}: {
  value: TaskStatus
  disabled?: boolean
  onCommit: (next: TaskStatus) => void
}) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onCommit(v as TaskStatus)}
      disabled={disabled}
    >
      <SelectTrigger className="h-7 w-36 border-0 bg-transparent p-0 text-[11px] shadow-none focus:ring-0 [&>svg]:hidden">
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

export function DeleteButton({
  taskName,
  onConfirm,
  isPending,
}: {
  taskName: string
  onConfirm: () => void
  isPending: boolean
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          disabled={isPending}
        >
          {isPending ? (
            <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <IconTrash className="h-3.5 w-3.5" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete task?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">"{taskName}"</span>{" "}
            will be permanently removed. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
