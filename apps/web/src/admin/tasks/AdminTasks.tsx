import React, { useState } from 'react';
import { IconSearch, IconArrowsSort, IconEdit, IconCheck, IconPlus, IconX } from '@tabler/icons-react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Badge } from '@workspace/ui/components/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';
import { Card } from '@workspace/ui/components/card';
import { Label } from '@workspace/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { toast } from "@workspace/ui/components/sonner";

import { mockTasksWithDetails, type TaskWithDetails } from '@workspace/types';

const getPriorityStyle = (priority: string) => {
  if (priority === 'High') return 'bg-red-50 text-red-600 hover:bg-red-50';
  if (priority === 'Med') return 'bg-amber-50 text-amber-600 hover:bg-amber-50';
  return 'bg-emerald-50 text-emerald-600 hover:bg-emerald-50';
};

const getStatusStyle = (status: string) => {
  if (status === 'PENDING') return 'destructive';
  if (status === 'IN_PROGRESS') return 'default';
  return 'secondary';
};

const formatStatusText = (status: string) => {
  if (status === 'PENDING') return 'Pending';
  if (status === 'IN_PROGRESS') return 'In Progress';
  if (status === 'COMPLETED') return 'Completed';
  return status;
}

const formatDeadline = (dateString: string | Date | null) => {
  if (!dateString) return "No date";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
};

const derivePriority = (status: string) => {
  if (status === 'PENDING') return 'High';
  if (status === 'IN_PROGRESS') return 'Med';
  return 'Low';
}

export default function AdminTasks() {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState<'ALL' | 'IN_PROGRESS' | 'COMPLETED' | 'PENDING'>('ALL');

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskDept, setNewTaskDept] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [formErrors, setFormErrors] = useState<{ title?: string, dept?: string, deadline?: string, desc?: string }>({});
  const [successMsg, setSuccessMsg] = useState('');

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const filteredTasks = (mockTasksWithDetails || []).filter(t => filter === 'ALL' || t.status === filter);

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const dateA = a.deadline ? new Date(a.deadline).getTime() : 0;
    const dateB = b.deadline ? new Date(b.deadline).getTime() : 0;
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const safeTasks = sortedTasks;

  return (
    <div className="p-8 pb-12 w-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">Admin · {safeTasks.length} tasks across departments</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm rounded-full px-5">
          <IconPlus className="w-4 h-4" /> Create Task
        </Button>
      </div>

      {/* Filters and Search Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative w-48">
            <IconSearch className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search all tasks..."
              className="pl-9 h-9 rounded-full"
            />
          </div>
          <Button
            onClick={() => setFilter('ALL')}
            variant={filter === 'ALL' ? 'default' : 'outline'}
            className={`h-9 rounded-full px-4 ${filter === 'ALL' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 border border-blue-200 shadow-none' : 'text-muted-foreground'}`}>
            All
          </Button>
          <Button
            onClick={() => setFilter('IN_PROGRESS')}
            variant={filter === 'IN_PROGRESS' ? 'default' : 'outline'}
            className={`h-9 rounded-full px-4 ${filter === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 border border-blue-200 shadow-none' : 'text-muted-foreground'}`}>
            In progress
          </Button>
          <Button
            onClick={() => setFilter('COMPLETED')}
            variant={filter === 'COMPLETED' ? 'default' : 'outline'}
            className={`h-9 rounded-full px-4 ${filter === 'COMPLETED' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 border border-blue-200 shadow-none' : 'text-muted-foreground'}`}>
            Completed
          </Button>
          <Button
            onClick={() => setFilter('PENDING')}
            variant={filter === 'PENDING' ? 'default' : 'outline'}
            className={`h-9 rounded-full px-4 ${filter === 'PENDING' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 border border-blue-200 shadow-none' : 'text-muted-foreground'}`}>
            Pending
          </Button>
        </div>
        <Button onClick={handleSortToggle} variant="outline" className="h-9 rounded-full px-4 text-muted-foreground flex items-center gap-2 transition-all">
          <IconArrowsSort className={`w-4 h-4 transition-transform duration-300 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
          Sort: {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
        </Button>
      </div>

      {/* Task Table Structure */}
      <Card className="overflow-hidden shadow-none border-zinc-200/60 dark:border-zinc-800/60">
        <Table>
          <TableHeader className="bg-muted/50 hidden md:table-header-group">
            <TableRow>
              <TableHead className="w-[35%]">Task</TableHead>
              <TableHead className="text-center w-[15%]">Priority</TableHead>
              <TableHead className="text-center w-[15%]">Status</TableHead>
              <TableHead className="text-center w-[20%]">Due Date</TableHead>
              <TableHead className="text-right w-[15%] pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {safeTasks.map(task => (
              <TaskRow key={task.id} task={task} />
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination Footer */}
      {safeTasks.length > 10 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <span className="text-xs font-medium text-muted-foreground text-center sm:text-left">Showing {safeTasks.length} of {mockTasksWithDetails.length} tasks</span>
          <div className="flex flex-wrap justify-center gap-1">
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
              &larr; Prev
            </Button>
            <Button variant="secondary" size="sm" className="h-8 w-8 p-0 text-xs bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100">
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-lg shadow-2xl border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/50 flex justify-between items-center bg-white dark:bg-zinc-900">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Create New Task</h2>
              <button onClick={() => {
                setIsCreateModalOpen(false);
                setFormErrors({});
                setSuccessMsg('');
              }} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 bg-white dark:bg-zinc-900">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-semibold uppercase text-muted-foreground">Task Title</Label>
                <Input id="title" placeholder="e.g. Update API Gateway" value={newTaskTitle} onChange={(e) => { setNewTaskTitle(e.target.value); setFormErrors({ ...formErrors, title: undefined }); setSuccessMsg(''); }} className={`h-10 ${formErrors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}`} />
                {formErrors.title && <p className="text-[11px] text-red-500 mt-1">{formErrors.title}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-xs font-semibold uppercase text-muted-foreground">Department</Label>
                  <Select value={newTaskDept} onValueChange={(val) => { setNewTaskDept(val); setFormErrors({ ...formErrors, dept: undefined }); setSuccessMsg(''); }}>
                    <SelectTrigger className={`w-full h-10 rounded-md ${formErrors.dept ? 'border-red-500 ring-red-500 focus-visible:ring-red-500' : ''}`}>
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
                  {formErrors.dept && <p className="text-[11px] text-red-500 mt-1">{formErrors.dept}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-xs font-semibold uppercase text-muted-foreground">Deadline</Label>
                  <Input id="deadline" type="date" value={newTaskDeadline} onChange={(e) => { setNewTaskDeadline(e.target.value); setFormErrors({ ...formErrors, deadline: undefined }); setSuccessMsg(''); }} className={`h-10 ${formErrors.deadline ? 'border-red-500 focus-visible:ring-red-500' : ''}`} />
                  {formErrors.deadline && <p className="text-[11px] text-red-500 mt-1">{formErrors.deadline}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="desc" className="text-xs font-semibold uppercase text-muted-foreground">Description</Label>
                <textarea
                  id="desc"
                  className={`flex min-h-[100px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${formErrors.desc ? 'border-red-500 focus-visible:ring-red-500' : 'border-input focus-visible:ring-ring'}`}
                  placeholder="Provide any additional context or instructions..."
                  value={newTaskDesc}
                  onChange={(e) => { setNewTaskDesc(e.target.value); setFormErrors({ ...formErrors, desc: undefined }); setSuccessMsg(''); }}
                />
                {formErrors.desc && <p className="text-[11px] text-red-500 mt-1">{formErrors.desc}</p>}
              </div>
            </div>

            <div className="p-5 border-t border-zinc-100 dark:border-zinc-800/50 flex flex-col bg-zinc-50/50 dark:bg-zinc-950/50">
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => {
                  setIsCreateModalOpen(false);
                  setFormErrors({});
                  setSuccessMsg('');
                }}>Cancel</Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm" onClick={() => {
                  const errors: any = {};
                  if (!newTaskTitle.trim()) errors.title = "Task title is required.";
                  if (!newTaskDept) errors.dept = "Department selection is required.";
                  if (!newTaskDeadline) errors.deadline = "Deadline is required.";
                  if (!newTaskDesc.trim()) errors.desc = "Description is required.";

                  if (Object.keys(errors).length > 0) {
                    setFormErrors(errors);
                    setSuccessMsg('');
                    return;
                  }

                  // Here we would normally submit to the backend via an API
                  console.log({ newTaskTitle, newTaskDesc, newTaskDept, newTaskDeadline });

                  // On success
                  setFormErrors({});
                  setSuccessMsg("Task created successfully!");

                  // Clean up fields so form is empty
                  setNewTaskTitle('');
                  setNewTaskDesc('');
                  setNewTaskDept('');
                  setNewTaskDeadline('');
                }}>Create Task</Button>
              </div>
              {successMsg && (
                <div className="flex justify-center mt-3">
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <IconCheck className="w-4 h-4" /> {successMsg}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );

  function TaskRow({ task }: { task: TaskWithDetails }) {
    const statusVariant = getStatusStyle(task.status) as any;
    const priority = derivePriority(task.status);

    let customStatusClass = "";
    if (task.status === "IN_PROGRESS") {
      customStatusClass = "bg-blue-50 text-blue-600 hover:bg-blue-50";
    } else if (task.status === "COMPLETED") {
      customStatusClass = "bg-emerald-50 text-emerald-600 hover:bg-emerald-50";
    }

    return (
      <TableRow className="flex flex-col md:table-row hover:bg-muted/50 border-border border-b">
        <TableCell className="font-medium px-6 py-4 md:py-3 block md:table-cell">
          <p className="text-sm font-medium text-foreground truncate">{task.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.department?.name || 'Unassigned Dept'} · {task.assigneeName || 'Unassigned'}</p>
        </TableCell>

        <TableCell className="px-6 py-1 md:py-3 md:text-center flex justify-between md:table-cell">
          <span className="md:hidden text-xs text-muted-foreground">Priority:</span>
          <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 border-transparent ${getPriorityStyle(priority)}`}>
            {priority}
          </Badge>
        </TableCell>

        <TableCell className="px-6 py-1 md:py-3 md:text-center flex justify-between items-center md:table-cell">
          <span className="md:hidden text-xs text-muted-foreground">Status:</span>
          <Badge variant={statusVariant === "default" || statusVariant === "secondary" ? "outline" : statusVariant} className={`text-[10px] font-bold px-2.5 py-0.5 border-transparent ${customStatusClass}`}>
            {formatStatusText(task.status)}
          </Badge>
        </TableCell>

        <TableCell className="px-6 py-1 md:py-3 md:text-center flex justify-between md:table-cell">
          <span className="md:hidden text-xs text-muted-foreground">Due:</span>
          <span className={`text-xs font-semibold ${task.status === 'PENDING' ? 'text-destructive' : 'text-muted-foreground'}`}>
            {formatDeadline(task.deadline)}
          </span>
        </TableCell>

        <TableCell className="px-6 py-3 pb-4 md:py-3 text-right flex justify-end md:table-cell">
          {task.status !== 'COMPLETED' ? (
            <Button variant="outline" size="sm" className="h-7 text-[11px] px-3 gap-1.5">
              <IconEdit className="w-3 h-3 text-muted-foreground" />
              Update
            </Button>
          ) : (
            <Button variant="secondary" size="sm" className="h-7 text-[11px] px-3 gap-1.5 cursor-default hover:bg-secondary">
              <IconCheck className="w-3 h-3 text-muted-foreground" />
              Done
            </Button>
          )}
        </TableCell>
      </TableRow>
    );
  }
}
