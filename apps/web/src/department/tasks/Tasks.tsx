
// made by harsh
import React, { useState } from 'react';
import { IconSearch, IconArrowsSort, IconEdit, IconCheck } from '@tabler/icons-react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Badge } from '@workspace/ui/components/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';
import { Card } from '@workspace/ui/components/card';
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

export default function Tasks() {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const sortedTasks = [...(mockTasksWithDetails || [])].sort((a, b) => {
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
          <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">Engineering · {mockTasksWithDetails.length} tasks assigned</p>
        </div>
      </div>

      {/* Filters and Search Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative w-48">
            <IconSearch className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search tasks..."
              className="pl-9 h-9 rounded-full"
            />
          </div>
          <Button variant="default" className="h-9 rounded-full px-4 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 border border-blue-200 shadow-none">
            All
          </Button>
          <Button variant="outline" className="h-9 rounded-full px-4 text-muted-foreground">
            In progress
          </Button>
          <Button variant="outline" className="h-9 rounded-full px-4 text-muted-foreground">
            Completed
          </Button>
          <Button variant="outline" className="h-9 rounded-full px-4 text-muted-foreground">
            Pending
          </Button>
        </div>
        <Button onClick={handleSortToggle} variant="outline" className="h-9 rounded-full px-4 text-muted-foreground flex items-center gap-2 transition-all">
          <IconArrowsSort className={`w-4 h-4 transition-transform duration-300 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} /> 
          Sort: {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
        </Button>
      </div>

      {/* Task Table Structure */}
      <Card className="overflow-hidden">
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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <span className="text-xs font-medium text-muted-foreground text-center sm:text-left">Showing {mockTasksWithDetails.length} of 87 tasks</span>
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
