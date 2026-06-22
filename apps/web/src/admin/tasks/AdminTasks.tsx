import React, { useState } from 'react';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';

const MOCK_TASKS = [
  { id: 'TSK-001', title: 'API Gateway Refactor', dept: 'Engineering', assignee: 'Alex Chen', status: 'In Progress', priority: 'High', due: '2026-06-25' },
  { id: 'TSK-002', title: 'Q3 Marketing Assets', dept: 'Marketing', assignee: 'Sarah Jenkins', status: 'Pending', priority: 'Med', due: '2026-07-01' },
  { id: 'TSK-003', title: 'Employee Onboarding Flow', dept: 'HR', assignee: 'Michael Scott', status: 'Completed', priority: 'High', due: '2026-06-15' },
  { id: 'TSK-004', title: 'DB Index Optimization', dept: 'Engineering', assignee: 'Alex Chen', status: 'Overdue', priority: 'High', due: '2026-06-20' },
  { id: 'TSK-005', title: 'Sales Q2 Report', dept: 'Sales', assignee: 'Dwight Schrute', status: 'In Progress', priority: 'Low', due: '2026-06-28' },
  { id: 'TSK-006', title: 'Update Privacy Policy', dept: 'Legal', assignee: 'Jan Levinson', status: 'Pending', priority: 'High', due: '2026-07-05' },
  { id: 'TSK-007', title: 'Security Audit', dept: 'Engineering', assignee: 'Marcus Webb', status: 'Pending', priority: 'High', due: '2026-07-12' },
  { id: 'TSK-008', title: 'Annual Benefits Review', dept: 'HR', assignee: 'Toby Flenderson', status: 'In Progress', priority: 'Med', due: '2026-06-30' },
  { id: 'TSK-009', title: 'Social Media Campaign', dept: 'Marketing', assignee: 'Kelly Kapoor', status: 'Overdue', priority: 'Med', due: '2026-06-22' },
  { id: 'TSK-010', title: 'Vendor Contracts Renewal', dept: 'Legal', assignee: 'Jan Levinson', status: 'Completed', priority: 'Low', due: '2026-06-18' },
];

export default function AdminTasks() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] -m-6 bg-zinc-50/30 dark:bg-zinc-950/30">
      <main className="flex-1 overflow-y-auto p-8">
        <div className="space-y-6 max-w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">System Tasks</h1>
              <p className="text-base text-zinc-500 dark:text-zinc-400">Manage and monitor all tasks across departments.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button>Create Task</Button>
            </div>
          </div>

          <div className="overflow-hidden">
            <div className="py-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-96">
                <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"></i>
                <Input placeholder="Search tasks..." className="pl-9 bg-white/50 dark:bg-zinc-900/50 border-zinc-200/60 dark:border-zinc-800/60" />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button 
                  variant={showFilters ? "default" : "outline"} 
                  size="sm" 
                  className={`gap-2 ${!showFilters ? "border-zinc-200/60 dark:border-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 bg-white/50 dark:bg-zinc-900/50" : ""}`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <i className="ti ti-filter text-muted-foreground"></i>
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="gap-2 border-zinc-200/60 dark:border-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 bg-white/50 dark:bg-zinc-900/50">
                  <i className="ti ti-download text-muted-foreground"></i>
                  Export
                </Button>
              </div>
            </div>

            {/* Collapsible Filter Section */}
            {showFilters && (
              <div className="p-5 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40 rounded-b-xl mb-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Department</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700">Engineering</Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700">Marketing</Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700">HR</Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700">Sales</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="cursor-pointer bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400">In Progress</Badge>
                    <Badge variant="secondary" className="cursor-pointer bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300">Pending</Badge>
                    <Badge variant="secondary" className="cursor-pointer bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400">Completed</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Priority</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="cursor-pointer bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400">High</Badge>
                    <Badge variant="secondary" className="cursor-pointer bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400">Med</Badge>
                    <Badge variant="secondary" className="cursor-pointer bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400">Low</Badge>
                  </div>
                </div>
                <div className="flex items-end justify-end gap-2 sm:col-span-3 lg:col-span-1">
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="text-zinc-500">Close</Button>
                  <Button size="sm">Apply Filters</Button>
                </div>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-zinc-200/50 dark:border-zinc-800/50">
                  <TableHead className="w-[100px] font-semibold text-zinc-500 dark:text-zinc-400">Task ID</TableHead>
                  <TableHead className="font-semibold text-zinc-500 dark:text-zinc-400">Title</TableHead>
                  <TableHead className="font-semibold text-zinc-500 dark:text-zinc-400">Department</TableHead>
                  <TableHead className="font-semibold text-zinc-500 dark:text-zinc-400">Assignee</TableHead>
                  <TableHead className="font-semibold text-zinc-500 dark:text-zinc-400">Status</TableHead>
                  <TableHead className="font-semibold text-zinc-500 dark:text-zinc-400">Priority</TableHead>
                  <TableHead className="text-right font-semibold text-zinc-500 dark:text-zinc-400">Due Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_TASKS.map((task) => (
                  <TableRow key={task.id} className="border-zinc-200/50 dark:border-zinc-800/50 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30">
                    <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">{task.id}</TableCell>
                    <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100">{task.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 font-semibold">{task.dept}</Badge>
                    </TableCell>
                    <TableCell className="text-zinc-600 dark:text-zinc-400 font-medium">{task.assignee}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`font-bold border-none ${task.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                          task.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' :
                            task.status === 'Overdue' ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
                              'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`font-bold border-none shadow-none text-[11px] px-2 py-0.5 ${task.priority === 'High' ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
                          task.priority === 'Med' ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
                            'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                        }`}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-zinc-600 dark:text-zinc-400 font-medium whitespace-nowrap">
                      {task.due}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                        <i className="ti ti-dots-vertical text-lg"></i>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="py-4 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Showing 1 to {MOCK_TASKS.length} of 87 tasks</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled className="border-zinc-200/60 dark:border-zinc-800/60 font-semibold text-zinc-400 bg-white/50 dark:bg-zinc-900/50">Previous</Button>
                <Button variant="outline" size="sm" className="border-zinc-200/60 dark:border-zinc-800/60 font-semibold bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
