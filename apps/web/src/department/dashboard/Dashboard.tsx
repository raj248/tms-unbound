// made by harsh
import React from 'react';

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
          <h1 className="text-2xl font-bold text-black">Department Dashboard</h1>
          <p className="text-sm text-black/50 mt-1">Engineering · June 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full">
            Engineering Dept
          </span>
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
            RS
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-black/50 font-medium mb-1">Total Tasks</p>
          <h2 className="text-3xl font-bold text-black">24</h2>
          <p className="text-xs text-black/40 mt-1">Assigned this month</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-black/50 font-medium mb-1">In Progress</p>
          <h2 className="text-3xl font-bold text-black">9</h2>
          <p className="text-xs text-black/40 mt-1">Active right now</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-black/50 font-medium mb-1">Completed</p>
          <h2 className="text-3xl font-bold text-black">11</h2>
          <p className="text-xs text-black/40 mt-1">4 this week</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-black/50 font-medium mb-1">Overdue</p>
          <h2 className="text-3xl font-bold text-red-600">4</h2>
          <p className="text-xs text-black/40 mt-1">Needs attention</p>
        </div>
      </div>

      {/* Progress Bar Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-sm font-bold text-black">Overall department progress</h3>
            <p className="text-sm font-semibold text-black mt-2">62% complete</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-black/40">This month</p>
            <p className="text-xs text-black/50 mt-2">Target: 75% by Jun 30</p>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 mb-1 overflow-hidden">
          <div className="bg-blue-600 h-3 rounded-full" style={{ width: '62%' }}></div>
        </div>
      </div>

      {/* Active Tasks Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-sm font-bold text-black">Active tasks</h3>
          <span className="text-xs text-black/40">9 tasks</span>
        </div>
        <div className="divide-y divide-gray-100">
          {activeTasks.map((task) => (
            <div key={task.id} className="p-4 px-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="w-1/2">
                <p className="text-sm font-medium text-black">{task.title}</p>
                <p className={`text-xs mt-0.5 ${task.isOverdue ? 'text-red-500' : 'text-black/50'}`}>
                  {task.due}
                </p>
              </div>
              <div className="w-1/3 flex items-center gap-3">
                <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className={`${task.color} h-1.5 rounded-full`} style={{ width: `${task.progress}%` }}></div>
                </div>
                <span className={`text-xs font-bold ${task.isOverdue ? 'text-red-600' : 'text-blue-700'} w-8 text-right`}>
                  {task.progress}%
                </span>
              </div>
              <div className="w-16 flex justify-end">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  task.priority === 'High' ? 'bg-red-50 text-red-600' :
                  task.priority === 'Med' ? 'bg-amber-50 text-amber-600' :
                  'bg-emerald-50 text-emerald-600'
                }`}>
                  {task.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two column layout for Weekly completions & Recent activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Completions Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-bold text-black">Weekly completions</h3>
            <span className="text-xs text-black/40">Last 6 weeks</span>
          </div>
          <div className="flex-1 flex items-end justify-between gap-2 mt-auto">
            {weeklyCompletions.map((week, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1">
                <span className="text-xs font-medium text-black/70 mb-2">{week.count}</span>
                <div className={`w-full ${week.height} ${week.color} rounded-t-sm transition-all hover:opacity-80`}></div>
                <span className="text-[10px] text-black/40 mt-2 text-center">{week.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-black mb-6">Recent activity</h3>
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="mt-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${activity.dotColor}`}></div>
                </div>
                <div>
                  <p className="text-sm text-black/70">{activity.text}</p>
                  <p className="text-[11px] text-black/40 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
