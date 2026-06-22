// made by harsh
import React from 'react';
import { IconSearch, IconArrowsSort, IconEdit, IconCheck } from '@tabler/icons-react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Badge } from '@workspace/ui/components/badge';
import { Progress } from '@workspace/ui/components/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';
import { Card } from '@workspace/ui/components/card';

const overdueTasks = [
  { id: 1, title: 'DB Index Optimization', subtitle: 'Improve query performance', priority: 'High', status: 'Overdue', progress: 20, due: 'Jun 23', action: 'Update' },
  { id: 2, title: 'Security Audit', subtitle: 'Quarterly vulnerability scan', priority: 'High', status: 'Overdue', progress: 35, due: 'Jun 20', action: 'Update' },
  { id: 3, title: 'Code Review Backlog', subtitle: 'Clear 2-week PR backlog', priority: 'Med', status: 'Overdue', progress: 50, due: 'Jun 18', action: 'Update' },
];

const inProgressTasks = [
  { id: 4, title: 'API Gateway Refactor', subtitle: 'Consolidate microservice endpoints', priority: 'High', status: 'In progress', progress: 70, due: 'Jun 25', action: 'Update' },
  { id: 5, title: 'CI/CD Pipeline Setup', subtitle: 'GitHub Actions + Docker', priority: 'Med', status: 'In progress', progress: 80, due: 'Jul 3', action: 'Update' },
  { id: 6, title: 'Auth Service Migration', subtitle: 'Move to OAuth 2.0', priority: 'High', status: 'In progress', progress: 45, due: 'Jun 28', action: 'Update' },
  { id: 7, title: 'Load Testing Report', subtitle: 'Simulate 10k concurrent users', priority: 'Low', status: 'In progress', progress: 55, due: 'Jul 10', action: 'Update' },
  { id: 8, title: 'Data Backup Automation', subtitle: 'Nightly S3 snapshots', priority: 'Med', status: 'In progress', progress: 60, due: 'Jul 7', action: 'Update' },
];

const completedTasks = [
  { id: 9, title: 'Server Monitoring Setup', subtitle: 'Grafana + Prometheus', priority: 'Med', status: 'Completed', progress: 100, due: 'Jun 15', action: 'Done' },
  { id: 10, title: 'API Documentation', subtitle: 'Swagger + Postman collection', priority: 'Low', status: 'Completed', progress: 100, due: 'Jun 12', action: 'Done' },
  { id: 11, title: 'Staging Environment Config', subtitle: 'Mirror prod setup', priority: 'High', status: 'Completed', progress: 100, due: 'Jun 10', action: 'Done' },
];

const getPriorityStyle = (priority: string) => {
  if (priority === 'High') return 'bg-red-50 text-red-600 hover:bg-red-50';
  if (priority === 'Med') return 'bg-amber-50 text-amber-600 hover:bg-amber-50';
  return 'bg-emerald-50 text-emerald-600 hover:bg-emerald-50';
};

const getStatusStyle = (status: string) => {
  if (status === 'Overdue') return 'destructive';
  if (status === 'In progress') return 'default'; // blue by default in our theme
  return 'secondary'; // emerald looks better, but secondary is a safe fallback
};

export default function Tasks() {
  return (
    <div className="p-8 pb-12 w-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">Engineering · 24 tasks assigned</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-50 px-3 py-1.5 rounded-full">
            Engineering Dept
          </Badge>
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
            RS
          </div>
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
      <Card className="overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50 hidden md:table-header-group">
            <TableRow>
              <TableHead className="w-[30%]">Task</TableHead>
              <TableHead className="text-center w-[10%]">Priority</TableHead>
              <TableHead className="text-center w-[15%]">Status</TableHead>
              <TableHead className="text-center w-[20%]">Progress</TableHead>
              <TableHead className="text-center w-[15%]">Due Date</TableHead>
              <TableHead className="text-right w-[10%] pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Overdue Section */}
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-t">
              <TableCell colSpan={6} className="py-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">OVERDUE · 4 TASKS</span>
              </TableCell>
            </TableRow>
            {overdueTasks.map(task => (
              <TaskRow key={task.id} task={task} />
            ))}

            {/* In Progress Section */}
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-t">
              <TableCell colSpan={6} className="py-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">IN PROGRESS · 9 TASKS</span>
              </TableCell>
            </TableRow>
            {inProgressTasks.map(task => (
              <TaskRow key={task.id} task={task} />
            ))}

            {/* Completed Section */}
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-t">
              <TableCell colSpan={6} className="py-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">COMPLETED · 11 TASKS</span>
              </TableCell>
            </TableRow>
            {completedTasks.map(task => (
              <TaskRow key={task.id} task={task} />
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <span className="text-xs font-medium text-muted-foreground text-center sm:text-left">Showing 11 of 24 tasks</span>
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
    
    // We apply custom class logic specifically to get the exact "badge" colors from before
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
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.subtitle}</p>
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

        <TableCell className="px-6 py-2 md:py-3 flex flex-col md:table-cell">
          <span className="md:hidden text-xs text-muted-foreground mb-1">Progress:</span>
          <div className="flex items-center gap-3 justify-between md:justify-center w-full">
            <Progress 
              value={task.progress} 
              className={`h-1.5 flex-1 md:w-24 bg-gray-100 ${
                task.status === 'Overdue' ? '[&>div]:bg-red-500' : 
                task.status === 'In progress' ? '[&>div]:bg-blue-600' : 
                '[&>div]:bg-emerald-500'
              }`} 
            />
            <span className="text-[11px] font-bold text-foreground/80 w-8 text-right">{task.progress}%</span>
          </div>
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
