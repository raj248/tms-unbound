import React, { createContext, useContext, useState } from "react"
import type { TaskWithDetails } from "@workspace/types"
import { TaskDetailDialog } from "@/admin/tasks/TaskDetailDialog"

interface TaskModalContextType {
  openTask: (task: TaskWithDetails) => void
}

const TaskModalContext = createContext<TaskModalContextType | null>(null)

export function TaskModalProvider({ children }: { children: React.ReactNode }) {
  const [selectedTask, setSelectedTask] = useState<TaskWithDetails | null>(null)

  return (
    <TaskModalContext.Provider value={{ openTask: setSelectedTask }}>
      {children}
      <TaskDetailDialog 
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(v) => {
          if (!v) setSelectedTask(null)
        }}
      />
    </TaskModalContext.Provider>
  )
}

export const useTaskModal = () => {
  const ctx = useContext(TaskModalContext)
  if (!ctx) throw new Error("useTaskModal must be used within TaskModalProvider")
  return ctx
}
