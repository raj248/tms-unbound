import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Textarea } from "@workspace/ui/components/textarea"
import { IconPlus, IconCheck, IconAlertCircle } from "@tabler/icons-react"
import type { CreateTaskRequest } from "@workspace/types"
import { useCreateTask } from "@/hooks/task"
import { useDepartments } from "@/hooks/department"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface FormErrors {
  root?: string
  name?: string
  description?: string
  departmentId?: string
  assigneeId?: string
  status?: string
  deadline?: string
}

// ---------------------------------------------------------------------------
// CreateTaskDialog
// ---------------------------------------------------------------------------
export function CreateTaskDialog({ fixedDepartmentId }: { fixedDepartmentId?: string } = {}) {
  const [open, setOpen] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [departmentId, setDepartmentId] = useState(fixedDepartmentId || "")
  const [deadline, setDeadline] = useState("")

  const [errors, setErrors] = useState<FormErrors>({})
  const [successMsg, setSuccessMsg] = useState("")

  const createTaskMutation = useCreateTask()
  const { data: departments } = useDepartments()
  function resetForm() {
    setName("")
    setDescription("")
    if (!fixedDepartmentId) setDepartmentId("")
    setDeadline("")
    setErrors({})
    setSuccessMsg("")
  }

  function handleOpenChange(val: boolean) {
    setOpen(val)
    if (!val) resetForm()
  }

  function clearError(field: keyof FormErrors) {
    setErrors((p) => ({ ...p, [field]: undefined }))
    setSuccessMsg("")
  }

  function handleSubmit() {
    const next: FormErrors = {}
    if (!name.trim()) next.name = "Task name is required."
    if (!departmentId) next.departmentId = "Department is required."

    if (Object.keys(next).length > 0) {
      setErrors(next)
      setSuccessMsg("")
      return
    }

    const payload: CreateTaskRequest = {
      name: name.trim(),
      description: description.trim() || undefined,
      departmentId,
      deadline: deadline || undefined,
    }

    // TODO: replace with real API call
    console.log("CreateTaskRequest →", payload)

    createTaskMutation.mutate(payload, {
      onSuccess: () => {
        // Clear form tracking states only if the server accepts it
        setErrors({})
        setSuccessMsg("Task created successfully!")
        setName("")
        setDescription("")
        if (!fixedDepartmentId) setDepartmentId("")
        setDeadline("")
        setOpen(false)
      },
      onError: (error: any) => {
        setSuccessMsg("")
        setErrors({
          root:
            error?.response?.data?.message ||
            "Failed to create task. Please try again.",
        })
        console.log("error →", error?.response?.data?.message)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* ── Trigger ── */}
      <DialogTrigger asChild>
        <Button className="gap-2">
          <IconPlus className="h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>

      {/* ── Content ── */}
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle className="text-base font-semibold">
            Create New Task
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[65vh] space-y-5 overflow-y-auto px-6 py-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="task-name"
              className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
            >
              Task Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="task-name"
              placeholder="e.g. Update API Gateway"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                clearError("name")
              }}
              className={
                errors.name
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            {errors.name && (
              <p className="text-[11px] text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Department <span className="text-destructive">*</span>
              </Label>
              <Select
                value={departmentId}
                disabled={!!fixedDepartmentId}
                onValueChange={(val) => {
                  setDepartmentId(val)
                  clearError("departmentId")
                }}
              >
                <SelectTrigger
                  className={`w-full ${errors.departmentId ? "border-destructive focus-visible:ring-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {departments
                    ?.filter((d) => !fixedDepartmentId || d.id === fixedDepartmentId)
                    .map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.departmentId && (
                <p className="text-[11px] text-destructive">
                  {errors.departmentId}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="task-deadline"
                className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
              >
                Deadline
              </Label>
              <Input
                id="task-deadline"
                type="date"
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value)
                  clearError("deadline")
                }}
                className={
                  errors.deadline
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.deadline && (
                <p className="text-[11px] text-destructive">
                  {errors.deadline}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="task-desc"
              className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
            >
              Description
            </Label>
            <Textarea
              id="task-desc"
              placeholder="Provide any additional context or instructions…"
              className={`min-h-24 resize-none ${errors.description ? "border-destructive focus-visible:ring-destructive" : ""}`}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                clearError("description")
              }}
            />
            {errors.description && (
              <p className="text-[11px] text-destructive">
                {errors.description}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 border-t bg-zinc-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:bg-zinc-900/50">
          {/* Success */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            {successMsg && (
              <>
                <IconCheck className="h-3.5 w-3.5" />
                {successMsg}
              </>
            )}
          </div>
          {/* Error */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-destructive">
            {errors.root && (
              <>
                <IconAlertCircle className="h-3.5 w-3.5" />
                {errors.root}
              </>
            )}
          </div>
          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Create Task</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
