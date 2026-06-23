import { useState } from "react"
import {
  IconSearch,
  IconArrowsSort,
  IconEdit,
  IconCheck,
  IconPlus,
  IconX,
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
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

import { mockTasksWithDetails, type TaskWithDetails } from "@workspace/types"

const getPriorityStyle = (priority: string) => {
  if (priority === "High") return "bg-red-50 text-red-600 hover:bg-red-50"
  if (priority === "Med") return "bg-amber-50 text-amber-600 hover:bg-amber-50"
  return "bg-emerald-50 text-emerald-600 hover:bg-emerald-50"
}

const getStatusStyle = (status: string) => {
  if (status === "PENDING") return "destructive"
  if (status === "IN_PROGRESS") return "default"
  return "secondary"
}

const formatStatusText = (status: string) => {
  if (status === "PENDING") return "Pending"
  if (status === "IN_PROGRESS") return "In Progress"
  if (status === "COMPLETED") return "Completed"
  return status
}

const formatDeadline = (dateString: string | Date | null) => {
  if (!dateString) return "No date"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" })
}

const derivePriority = (status: string) => {
  if (status === "PENDING") return "High"
  if (status === "IN_PROGRESS") return "Med"
  return "Low"
}

export default function AdminTasks() {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filter, setFilter] = useState<
    "ALL" | "IN_PROGRESS" | "COMPLETED" | "PENDING"
  >("ALL")

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDesc, setNewTaskDesc] = useState("")
  const [newTaskDept, setNewTaskDept] = useState("")
  const [newTaskDeadline, setNewTaskDeadline] = useState("")
  const [formErrors, setFormErrors] = useState<{
    title?: string
    dept?: string
    deadline?: string
    desc?: string
  }>({})
  const [successMsg, setSuccessMsg] = useState("")

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
  }

  const filteredTasks = (mockTasksWithDetails || []).filter(
    (t) => filter === "ALL" || t.status === filter
  )

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const dateA = a.deadline ? new Date(a.deadline).getTime() : 0
    const dateB = b.deadline ? new Date(b.deadline).getTime() : 0
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA
  })

  const safeTasks = sortedTasks

  return (
    <div className="w-full space-y-6 p-8 pb-12">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Tasks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Admin · {safeTasks.length} tasks across departments
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="gap-2 rounded-full bg-indigo-600 px-5 text-white shadow-sm hover:bg-indigo-700"
        >
          <IconPlus className="h-4 w-4" /> Create Task
        </Button>
      </div>

      {/* Filters and Search Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-48">
            <IconSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search all tasks..."
              className="h-9 rounded-full pl-9"
            />
          </div>
          <Button
            onClick={() => setFilter("ALL")}
            variant={filter === "ALL" ? "default" : "outline"}
            className={`h-9 rounded-full px-4 ${filter === "ALL" ? "border border-blue-200 bg-blue-100 text-blue-700 shadow-none hover:bg-blue-200 hover:text-blue-800" : "text-muted-foreground"}`}
          >
            All
          </Button>
          <Button
            onClick={() => setFilter("IN_PROGRESS")}
            variant={filter === "IN_PROGRESS" ? "default" : "outline"}
            className={`h-9 rounded-full px-4 ${filter === "IN_PROGRESS" ? "border border-blue-200 bg-blue-100 text-blue-700 shadow-none hover:bg-blue-200 hover:text-blue-800" : "text-muted-foreground"}`}
          >
            In progress
          </Button>
          <Button
            onClick={() => setFilter("COMPLETED")}
            variant={filter === "COMPLETED" ? "default" : "outline"}
            className={`h-9 rounded-full px-4 ${filter === "COMPLETED" ? "border border-blue-200 bg-blue-100 text-blue-700 shadow-none hover:bg-blue-200 hover:text-blue-800" : "text-muted-foreground"}`}
          >
            Completed
          </Button>
          <Button
            onClick={() => setFilter("PENDING")}
            variant={filter === "PENDING" ? "default" : "outline"}
            className={`h-9 rounded-full px-4 ${filter === "PENDING" ? "border border-blue-200 bg-blue-100 text-blue-700 shadow-none hover:bg-blue-200 hover:text-blue-800" : "text-muted-foreground"}`}
          >
            Pending
          </Button>
        </div>
        <Button
          onClick={handleSortToggle}
          variant="outline"
          className="flex h-9 items-center gap-2 rounded-full px-4 text-muted-foreground transition-all"
        >
          <IconArrowsSort
            className={`h-4 w-4 transition-transform duration-300 ${sortOrder === "desc" ? "rotate-180" : ""}`}
          />
          Sort: {sortOrder === "asc" ? "Oldest First" : "Newest First"}
        </Button>
      </div>

      {/* Task Table Structure */}
      <Card className="overflow-hidden border-zinc-200/60 shadow-none dark:border-zinc-800/60">
        <Table>
          <TableHeader className="hidden bg-muted/50 md:table-header-group">
            <TableRow>
              <TableHead className="w-[35%]">Task</TableHead>
              <TableHead className="w-[15%] text-center">Priority</TableHead>
              <TableHead className="w-[15%] text-center">Status</TableHead>
              <TableHead className="w-[20%] text-center">Due Date</TableHead>
              <TableHead className="w-[15%] pr-6 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {safeTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination Footer */}
      {safeTasks.length > 10 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-center text-xs font-medium text-muted-foreground sm:text-left">
            Showing {safeTasks.length} of {mockTasksWithDetails.length} tasks
          </span>
          <div className="flex flex-wrap justify-center gap-1">
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
              &larr; Prev
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 border border-blue-200 bg-blue-50 p-0 text-xs text-blue-600 hover:bg-blue-100"
            >
              1
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-xs">
              2
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-xs">
              3
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
              Next &rarr;
            </Button>
          </div>
        </div>
      )}

      {/* Create Task Modal Overlay */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/40 p-4 backdrop-blur-sm duration-200 fade-in">
          <Card className="w-full max-w-lg overflow-hidden border-zinc-200/60 shadow-2xl dark:border-zinc-800/60">
            <div className="flex items-center justify-between border-b border-zinc-100 bg-white p-6 dark:border-zinc-800/50 dark:bg-zinc-900">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Create New Task
              </h2>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false)
                  setFormErrors({})
                  setSuccessMsg("")
                }}
                className="text-zinc-400 transition-colors hover:text-zinc-600"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 bg-white p-6 dark:bg-zinc-900">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-xs font-semibold text-muted-foreground uppercase"
                >
                  Task Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Update API Gateway"
                  value={newTaskTitle}
                  onChange={(e) => {
                    setNewTaskTitle(e.target.value)
                    setFormErrors({ ...formErrors, title: undefined })
                    setSuccessMsg("")
                  }}
                  className={`h-10 ${formErrors.title ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {formErrors.title && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {formErrors.title}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="department"
                    className="text-xs font-semibold text-muted-foreground uppercase"
                  >
                    Department
                  </Label>
                  <Select
                    value={newTaskDept}
                    onValueChange={(val) => {
                      setNewTaskDept(val)
                      setFormErrors({ ...formErrors, dept: undefined })
                      setSuccessMsg("")
                    }}
                  >
                    <SelectTrigger
                      className={`h-10 w-full rounded-md ${formErrors.dept ? "border-red-500 ring-red-500 focus-visible:ring-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.dept && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {formErrors.dept}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="deadline"
                    className="text-xs font-semibold text-muted-foreground uppercase"
                  >
                    Deadline
                  </Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newTaskDeadline}
                    onChange={(e) => {
                      setNewTaskDeadline(e.target.value)
                      setFormErrors({ ...formErrors, deadline: undefined })
                      setSuccessMsg("")
                    }}
                    className={`h-10 ${formErrors.deadline ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  />
                  {formErrors.deadline && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {formErrors.deadline}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="desc"
                  className="text-xs font-semibold text-muted-foreground uppercase"
                >
                  Description
                </Label>
                <textarea
                  id="desc"
                  className={`flex min-h-[100px] w-full resize-none rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${formErrors.desc ? "border-red-500 focus-visible:ring-red-500" : "border-input focus-visible:ring-ring"}`}
                  placeholder="Provide any additional context or instructions..."
                  value={newTaskDesc}
                  onChange={(e) => {
                    setNewTaskDesc(e.target.value)
                    setFormErrors({ ...formErrors, desc: undefined })
                    setSuccessMsg("")
                  }}
                />
                {formErrors.desc && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {formErrors.desc}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col border-t border-zinc-100 bg-zinc-50/50 p-5 dark:border-zinc-800/50 dark:bg-zinc-950/50">
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateModalOpen(false)
                    setFormErrors({})
                    setSuccessMsg("")
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
                  onClick={() => {
                    const errors: any = {}
                    if (!newTaskTitle.trim())
                      errors.title = "Task title is required."
                    if (!newTaskDept)
                      errors.dept = "Department selection is required."
                    if (!newTaskDeadline)
                      errors.deadline = "Deadline is required."
                    if (!newTaskDesc.trim())
                      errors.desc = "Description is required."

                    if (Object.keys(errors).length > 0) {
                      setFormErrors(errors)
                      setSuccessMsg("")
                      return
                    }

                    // Here we would normally submit to the backend via an API
                    console.log({
                      newTaskTitle,
                      newTaskDesc,
                      newTaskDept,
                      newTaskDeadline,
                    })

                    // On success
                    setFormErrors({})
                    setSuccessMsg("Task created successfully!")

                    // Clean up fields so form is empty
                    setNewTaskTitle("")
                    setNewTaskDesc("")
                    setNewTaskDept("")
                    setNewTaskDeadline("")
                  }}
                >
                  Create Task
                </Button>
              </div>
              {successMsg && (
                <div className="mt-3 flex justify-center">
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <IconCheck className="h-4 w-4" /> {successMsg}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )

  function TaskRow({ task }: { task: TaskWithDetails }) {
    const statusVariant = getStatusStyle(task.status) as any
    const priority = derivePriority(task.status)

    let customStatusClass = ""
    if (task.status === "IN_PROGRESS") {
      customStatusClass = "bg-blue-50 text-blue-600 hover:bg-blue-50"
    } else if (task.status === "COMPLETED") {
      customStatusClass = "bg-emerald-50 text-emerald-600 hover:bg-emerald-50"
    }

    return (
      <TableRow className="flex flex-col border-b border-border hover:bg-muted/50 md:table-row">
        <TableCell className="block px-6 py-4 font-medium md:table-cell md:py-3">
          <p className="truncate text-sm font-medium text-foreground">
            {task.name}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {task.department?.name || "Unassigned Dept"} ·{" "}
            {task.assigneeName || "Unassigned"}
          </p>
        </TableCell>

        <TableCell className="flex justify-between px-6 py-1 md:table-cell md:py-3 md:text-center">
          <span className="text-xs text-muted-foreground md:hidden">
            Priority:
          </span>
          <Badge
            variant="outline"
            className={`border-transparent px-2 py-0.5 text-[10px] font-bold ${getPriorityStyle(priority)}`}
          >
            {priority}
          </Badge>
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
          <span className="text-xs text-muted-foreground md:hidden">Due:</span>
          <span
            className={`text-xs font-semibold ${task.status === "PENDING" ? "text-destructive" : "text-muted-foreground"}`}
          >
            {formatDeadline(task.deadline)}
          </span>
        </TableCell>

        <TableCell className="flex justify-end px-6 py-3 pb-4 text-right md:table-cell md:py-3">
          {task.status !== "COMPLETED" ? (
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 px-3 text-[11px]"
            >
              <IconEdit className="h-3 w-3 text-muted-foreground" />
              Update
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="h-7 cursor-default gap-1.5 px-3 text-[11px] hover:bg-secondary"
            >
              <IconCheck className="h-3 w-3 text-muted-foreground" />
              Done
            </Button>
          )}
        </TableCell>
      </TableRow>
    )
  }
}
