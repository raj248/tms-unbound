// made by harsh
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';

const activeTasks = [
  { id: 1, title: 'API Gateway Refactor', due: 'Due Jun 25', priority: 'High' },
  { id: 2, title: 'Auth Service Migration', due: 'Due Jun 28', priority: 'Med' },
  { id: 3, title: 'CI/CD Pipeline Setup', due: 'Due Jul 3', priority: 'Med' },
  { id: 4, title: 'DB Index Optimization', due: 'Due Jun 23 · Overdue', priority: 'High', isOverdue: true },
  { id: 5, title: 'Load Testing Report', due: 'Due Jul 10', priority: 'Low' },
];

const weeklyCompletions = [
  { label: 'May 5', count: 2, height: 'h-10', color: 'bg-indigo-200 dark:bg-indigo-500/20' },
  { label: 'May 12', count: 3, height: 'h-16', color: 'bg-indigo-300 dark:bg-indigo-500/40' },
  { label: 'May 19', count: 1, height: 'h-6', color: 'bg-indigo-200 dark:bg-indigo-500/20' },
  { label: 'May 26', count: 4, height: 'h-20', color: 'bg-indigo-500 dark:bg-indigo-500' },
  { label: 'Jun 9', count: 2, height: 'h-10', color: 'bg-indigo-200 dark:bg-indigo-500/20' },
  { label: 'Jun 16', count: 4, height: 'h-20', color: 'bg-indigo-600 dark:bg-indigo-400' },
];

const activities = [
  { id: 1, text: 'CI/CD Pipeline progress updated', time: 'Today, 10:42 AM', dotColor: 'bg-emerald-500' },
  { id: 2, text: 'API Gateway Refactor marked in progress', time: 'Today, 9:15 AM', dotColor: 'bg-indigo-500' },
  { id: 3, text: 'DB Index Optimization flagged overdue', time: 'Yesterday, 6:00 PM', dotColor: 'bg-red-500' },
];

export default function Dashboard() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] -m-6 bg-zinc-50/30 dark:bg-zinc-950/30">
      <main className="flex-1 overflow-y-auto p-8">
        <div className="space-y-8 max-w-full mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">Department Dashboard</h1>
              <p className="text-base text-zinc-500 dark:text-zinc-400">Engineering · June 2026</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <Card className="shadow-sm border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/50 transition-all hover:shadow-md">
              <CardHeader className="p-5 pb-0">
                <CardDescription className="font-semibold mb-1 text-zinc-500 dark:text-zinc-400">Total Tasks</CardDescription>
                <CardTitle className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">24</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-1">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Assigned this month</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/50 transition-all hover:shadow-md">
              <CardHeader className="p-5 pb-0">
                <CardDescription className="font-semibold mb-1 text-zinc-500 dark:text-zinc-400">In Progress</CardDescription>
                <CardTitle className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">9</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-1">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Active right now</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/50 transition-all hover:shadow-md">
              <CardHeader className="p-5 pb-0">
                <CardDescription className="font-semibold mb-1 text-zinc-500 dark:text-zinc-400">Completed</CardDescription>
                <CardTitle className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">11</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-1">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">4 this week</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/50 transition-all hover:shadow-md">
              <CardHeader className="p-5 pb-0">
                <CardDescription className="font-semibold mb-1 text-zinc-500 dark:text-zinc-400">Overdue</CardDescription>
                <CardTitle className="text-3xl font-bold text-red-600 dark:text-red-500">4</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-1">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Needs attention</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-7">
            {/* Active Tasks Card */}
            <Card className="col-span-4 shadow-sm border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 overflow-hidden">
              <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800/50 flex justify-between items-center bg-white/50 dark:bg-zinc-900/50">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Active Tasks</h3>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full dark:bg-indigo-500/10 dark:text-indigo-400">9 tasks remaining</span>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {activeTasks.map((task) => (
                  <div key={task.id} className="p-5 px-6 flex items-center justify-between hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors">
                    <div className="flex-1 space-y-0.5">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{task.title}</p>
                      <p className={`text-xs font-medium ${task.isOverdue ? 'text-red-600 dark:text-red-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                        {task.due}
                      </p>
                    </div>
                    <div className="w-20 flex justify-end">
                      <Badge variant={task.isOverdue ? "destructive" : "secondary"} className={`text-[11px] font-bold px-2.5 py-0.5 shadow-none ${task.priority === 'High' && !task.isOverdue ? 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20' :
                          task.priority === 'Med' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20' :
                            task.priority === 'Low' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20' : ''
                        }`}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="col-span-3 flex flex-col gap-5">
              {/* Weekly Completions Card */}
              <Card className="flex flex-col shadow-sm border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900">
                <CardHeader className="p-6 pb-2 border-b border-zinc-100 dark:border-zinc-800/50 mb-4 bg-white/50 dark:bg-zinc-900/50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-bold">Velocity</CardTitle>
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Last 6 weeks</span>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-2 flex-1 flex items-end justify-between gap-3 mt-auto">
                  {weeklyCompletions.map((week, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1 group">
                      <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 mb-2 transition-colors group-hover:text-zinc-900 dark:group-hover:text-zinc-100">{week.count}</span>
                      <div className={`w-full ${week.height} ${week.color} rounded-md transition-all group-hover:opacity-80`}></div>
                      <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 mt-2 text-center">{week.label}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity Card */}
              <Card className="shadow-sm border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 flex-1">
                <CardHeader className="p-6 pb-5 border-b border-zinc-100 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50">
                  <CardTitle className="text-lg font-bold">Activity</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex gap-4 items-start">
                      <div className="mt-1.5 relative">
                        <div className={`w-2.5 h-2.5 rounded-full ${activity.dotColor} shadow-sm relative z-10`}></div>
                        {activity.id !== activities.length && (
                          <div className="absolute top-2.5 left-1/2 -ml-px w-0.5 h-10 bg-zinc-100 dark:bg-zinc-800/50"></div>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{activity.text}</p>
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
