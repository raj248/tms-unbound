import React from 'react';
import { IconSearch, IconArrowsSort, IconEdit, IconCheck } from '@tabler/icons-react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Badge } from '@workspace/ui/components/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';
import { Card } from '@workspace/ui/components/card';

const MOCK_TASKS = [
  { id: 'TSK-001', title: 'API Gateway Refactor', dept: 'Engineering', assignee: 'Alex Chen', status: 'In progress', priority: 'High', due: 'Jun 25', action: 'Update' },
  { id: 'TSK-002', title: 'Q3 Marketing Assets', dept: 'Marketing', assignee: 'Sarah Jenkins', status: 'In progress', priority: 'Med', due: 'Jul 01', action: 'Update' },
  { id: 'TSK-003', title: 'Employee Onboarding Flow', dept: 'HR', assignee: 'Michael Scott', status: 'Completed', priority: 'High', due: 'Jun 15', action: 'Done' },
  { id: 'TSK-004', title: 'DB Index Optimization', dept: 'Engineering', assignee: 'Alex Chen', status: 'Overdue', priority: 'High', due: 'Jun 20', action: 'Update' },
  { id: 'TSK-005', title: 'Sales Q2 Report', dept: 'Sales', assignee: 'Dwight Schrute', status: 'In progress', priority: 'Low', due: 'Jun 28', action: 'Update' },
  { id: 'TSK-006', title: 'Update Privacy Policy', dept: 'Legal', assignee: 'Jan Levinson', status: 'In progress', priority: 'High', due: 'Jul 05', action: 'Update' },
  { id: 'TSK-007', title: 'Security Audit', dept: 'Engineering', assignee: 'Marcus Webb', status: 'In progress', priority: 'High', due: 'Jul 12', action: 'Update' },
  { id: 'TSK-008', title: 'Annual Benefits Review', dept: 'HR', assignee: 'Toby Flenderson', status: 'In progress', priority: 'Med', due: 'Jun 30', action: 'Update' },
  { id: 'TSK-009', title: 'Social Media Campaign', dept: 'Marketing', assignee: 'Kelly Kapoor', status: 'Overdue', priority: 'Med', due: 'Jun 22', action: 'Update' },
  { id: 'TSK-010', title: 'Vendor Contracts Renewal', dept: 'Legal', assignee: 'Jan Levinson', status: 'Completed', priority: 'Low', due: 'Jun 18', action: 'Done' },
];

const getPriorityStyle = (priority: string) => {
  if (priority === 'High') return 'bg-red-50 text-red-600 hover:bg-red-50';
  if (priority === 'Med') return 'bg-amber-50 text-amber-600 hover:bg-amber-50';
  return 'bg-emerald-50 text-emerald-600 hover:bg-emerald-50';
};

const getStatusStyle = (status: string) => {
  if (status === 'Overdue') return 'destructive';
  if (status === 'In progress') return 'default';
  return 'secondary';
};

export default function AdminTasks() {
  const overdueTasks = MOCK_TASKS.filter(t => t.status === 'Overdue');
  const inProgressTasks = MOCK_TASKS.filter(t => t.status === 'In progress');
  const completedTasks = MOCK_TASKS.filter(t => t.status === 'Completed');

  return (
    <div className="p-8 pb-12 w-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">Admin · {MOCK_TASKS.length} tasks across departments</p>
        </div>
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
            Overdue
          </Button>
          <Button variant="outline" className="h-9 rounded-full px-4 text-muted-foreground">
            High priority
          </Button>
        </div>
        <Button variant="outline" className="h-9 rounded-full px-4 text-muted-foreground flex items-center gap-2">
          <IconArrowsSort className="w-4 h-4" /> Sort
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
            {/* Overdue Section */}
            {overdueTasks.length > 0 && (
              <>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-t">
                  <TableCell colSpan={5} className="py-2">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">OVERDUE · {overdueTasks.length} TASKS</span>
                  </TableCell>
                </TableRow>
                {overdueTasks.map(task => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </>
            )}

            {/* In Progress Section */}
            {inProgressTasks.length > 0 && (
              <>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-t">
                  <TableCell colSpan={5} className="py-2">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">IN PROGRESS · {inProgressTasks.length} TASKS</span>
                  </TableCell>
                </TableRow>
                {inProgressTasks.map(task => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </>
            )}

            {/* Completed Section */}
            {completedTasks.length > 0 && (
              <>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-t">
                  <TableCell colSpan={5} className="py-2">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">COMPLETED · {completedTasks.length} TASKS</span>
                  </TableCell>
                </TableRow>
                {completedTasks.map(task => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <span className="text-xs font-medium text-muted-foreground text-center sm:text-left">Showing {MOCK_TASKS.length} of 87 tasks</span>
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

  function TaskRow({ task }: { task: any }) {
    const statusVariant = getStatusStyle(task.status) as any;

    // We apply custom class logic specifically to get the exact "badge" colors
    let customStatusClass = "";
    if (task.status === "In progress") {
      customStatusClass = "bg-blue-50 text-blue-600 hover:bg-blue-50";
    } else if (task.status === "Completed") {
      customStatusClass = "bg-emerald-50 text-emerald-600 hover:bg-emerald-50";
    }

    return (
      <TableRow className="flex flex-col md:table-row hover:bg-muted/50 border-border border-b">
        <TableCell className="font-medium px-6 py-4 md:py-3 block md:table-cell">
          <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.dept} · {task.assignee}</p>
        </TableCell>

        <TableCell className="px-6 py-1 md:py-3 md:text-center flex justify-between md:table-cell">
          <span className="md:hidden text-xs text-muted-foreground">Priority:</span>
          <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 border-transparent ${getPriorityStyle(task.priority)}`}>
            {task.priority}
          </Badge>
        </TableCell>

        <TableCell className="px-6 py-1 md:py-3 md:text-center flex justify-between items-center md:table-cell">
          <span className="md:hidden text-xs text-muted-foreground">Status:</span>
          <Badge variant={statusVariant === "default" || statusVariant === "secondary" ? "outline" : statusVariant} className={`text-[10px] font-bold px-2.5 py-0.5 border-transparent ${customStatusClass}`}>
            {task.status}
          </Badge>
        </TableCell>

        <TableCell className="px-6 py-1 md:py-3 md:text-center flex justify-between md:table-cell">
          <span className="md:hidden text-xs text-muted-foreground">Due:</span>
          <span className={`text-xs font-semibold ${task.status === 'Overdue' ? 'text-destructive' : 'text-muted-foreground'}`}>
            {task.due}
          </span>
        </TableCell>

        <TableCell className="px-6 py-3 pb-4 md:py-3 text-right flex justify-end md:table-cell">
          {task.action === 'Update' ? (
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
