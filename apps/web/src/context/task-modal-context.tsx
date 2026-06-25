// src/context/task-modal-context.tsx
import React, { createContext, useContext, useState } from "react"
import type { TaskWithDetails } from "@workspace/types"
import { TaskDetailDialog } from "@/components/tasks/TaskDetailDialog"
import { useTask } from "@/hooks/task" // Import your fresh hook here

interface TaskModalContextType {
  openTask: (task: TaskWithDetails) => void
  closeTask: () => void
}

const TaskModalContext = createContext<TaskModalContextType | null>(null)

export function TaskModalProvider({ children }: { children: React.ReactNode }) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  // 1. Fetch exactly one fresh task definition by id
  const { data: selectedTask = null, isLoading } = useTask(selectedTaskId)

  return (
    <TaskModalContext.Provider
      value={{
        openTask: (task) => setSelectedTaskId(task.id),
        closeTask: () => setSelectedTaskId(null),
      }}
    >
      {children}

      {/* 2. Bind layout attributes to the singular response thread */}
      <TaskDetailDialog
        task={selectedTask}
        open={!!selectedTaskId}
        isLoading={isLoading} // Optional: add a loader indicator directly inside the dialog if needed
        onOpenChange={(v) => {
          if (!v) setSelectedTaskId(null)
        }}
      />
    </TaskModalContext.Provider>
  )
}

export const useTaskModal = () => {
  const ctx = useContext(TaskModalContext)
  if (!ctx)
    throw new Error("useTaskModal must be used within TaskModalProvider")
  return ctx
}
