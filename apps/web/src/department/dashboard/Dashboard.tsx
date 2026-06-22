// made by harsh
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { Progress } from '@workspace/ui/components/progress';

const activeTasks = [
  { id: 1, title: 'API Gateway Refactor', due: 'Due Jun 25', progress: 70, priority: 'High', color: 'bg-blue-600' },
  { id: 2, title: 'Auth Service Migration', due: 'Due Jun 28', progress: 45, priority: 'Med', color: 'bg-blue-600' },
  { id: 3, title: 'CI/CD Pipeline Setup', due: 'Due Jul 3', progress: 80, priority: 'Med', color: 'bg-blue-600' },
  { id: 4, title: 'DB Index Optimization', due: 'Due Jun 23 · Overdue', progress: 20, priority: 'High', color: 'bg-red-500', isOverdue: true },
  { id: 5, title: 'Load Testing Report', due: 'Due Jul 10', progress: 55, priority: 'Low', color: 'bg-blue-600' },
];

const weeklyCompletions = [
  { label: 'May 5', count: 2, height: 'h-10', color: 'bg-blue-200' },
  { label: 'May 12', count: 3, height: 'h-16', color: 'bg-blue-200' },
  { label: 'May 19', count: 1, height: 'h-6', color: 'bg-blue-200' },
  { label: 'May 26', count: 4, height: 'h-20', color: 'bg-blue-600' },
  { label: 'Jun 9', count: 2, height: 'h-10', color: 'bg-blue-200' },
  { label: 'Jun 16', count: 4, height: 'h-20', color: 'bg-blue-600' },
];

const activities = [
  { id: 1, text: 'CI/CD Pipeline progress updated to 80%', time: 'Today, 10:42 AM', dotColor: 'bg-emerald-500' },
  { id: 2, text: 'API Gateway Refactor marked in progress', time: 'Today, 9:15 AM', dotColor: 'bg-blue-600' },
  { id: 3, text: 'DB Index Optimization flagged overdue', time: 'Yesterday, 6:00 PM', dotColor: 'bg-red-500' },
];

export default function Dashboard() {
  return (
    <div className="p-8 pb-12 w-full space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Department Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Engineering · June 2026</p>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="p-5 pb-0">
            <CardDescription className="font-medium mb-1 text-black/50">Total Tasks</CardDescription>
            <CardTitle className="text-3xl font-bold">24</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-1">
            <p className="text-xs text-muted-foreground mt-1">Assigned this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-5 pb-0">
            <CardDescription className="font-medium mb-1 text-black/50">In Progress</CardDescription>
            <CardTitle className="text-3xl font-bold">9</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-1">
            <p className="text-xs text-muted-foreground mt-1">Active right now</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-5 pb-0">
            <CardDescription className="font-medium mb-1 text-black/50">Completed</CardDescription>
            <CardTitle className="text-3xl font-bold">11</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-1">
            <p className="text-xs text-muted-foreground mt-1">4 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-5 pb-0">
            <CardDescription className="font-medium mb-1 text-black/50">Overdue</CardDescription>
            <CardTitle className="text-3xl font-bold text-destructive">4</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-1">
            <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">Overall department progress</h3>
              <p className="text-sm font-semibold text-foreground mt-2">62% complete</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">This month</p>
              <p className="text-xs text-muted-foreground mt-2">Target: 75% by Jun 30</p>
            </div>
          </div>
          <Progress value={62} className="h-3" />
        </CardContent>
      </Card>

      {/* Active Tasks Card */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h3 className="text-sm font-bold text-foreground">Active tasks</h3>
          <span className="text-xs text-muted-foreground">9 tasks</span>
        </div>
        <div className="divide-y divide-border">
          {activeTasks.map((task) => (
            <div key={task.id} className="p-4 px-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="w-1/2">
                <p className="text-sm font-medium text-foreground">{task.title}</p>
                <p className={`text-xs mt-0.5 ${task.isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {task.due}
                </p>
              </div>
              <div className="w-1/3 flex items-center gap-3">
                <Progress value={task.progress} className={`h-1.5 flex-1 ${task.isOverdue ? 'bg-red-100 [&>div]:bg-red-500' : 'bg-gray-100 [&>div]:bg-blue-600'}`} />
                <span className={`text-xs font-bold ${task.isOverdue ? 'text-destructive' : 'text-blue-700'} w-8 text-right`}>
                  {task.progress}%
                </span>
              </div>
              <div className="w-16 flex justify-end">
                <Badge variant={task.isOverdue ? "destructive" : "secondary"} className={`text-[10px] font-bold px-2 py-0.5 ${
                  task.priority === 'High' && !task.isOverdue ? 'bg-red-50 text-red-600 hover:bg-red-50' :
                  task.priority === 'Med' ? 'bg-amber-50 text-amber-600 hover:bg-amber-50' :
                  task.priority === 'Low' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-50' : ''
                }`}>
                  {task.priority}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Two column layout for Weekly completions & Recent activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Completions Card */}
        <Card className="flex flex-col">
          <CardHeader className="p-6 pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-bold">Weekly completions</CardTitle>
              <span className="text-xs text-muted-foreground">Last 6 weeks</span>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-2 flex-1 flex items-end justify-between gap-2 mt-auto">
            {weeklyCompletions.map((week, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1">
                <span className="text-xs font-medium text-muted-foreground mb-2">{week.count}</span>
                <div className={`w-full ${week.height} ${week.color} rounded-t-sm transition-all hover:opacity-80`}></div>
                <span className="text-[10px] text-muted-foreground mt-2 text-center">{week.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card>
          <CardHeader className="p-6 pb-6">
            <CardTitle className="text-sm font-bold">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="mt-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${activity.dotColor}`}></div>
                </div>
                <div>
                  <p className="text-sm text-foreground/90">{activity.text}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
