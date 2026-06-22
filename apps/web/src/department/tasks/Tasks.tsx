// made by harsh
import React from 'react';
import { IconSearch, IconArrowsSort, IconEdit, IconCheck } from '@tabler/icons-react';

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
  if (priority === 'High') return 'bg-red-50 text-red-600';
  if (priority === 'Med') return 'bg-amber-50 text-amber-600';
  return 'bg-emerald-50 text-emerald-600';
};

const getStatusStyle = (status: string) => {
  if (status === 'Overdue') return 'bg-red-50 text-red-600';
  if (status === 'In progress') return 'bg-indigo-50 text-indigo-600';
  return 'bg-emerald-50 text-emerald-600';
};

const getProgressColor = (status: string) => {
  if (status === 'Overdue') return 'bg-red-500';
  if (status === 'In progress') return 'bg-indigo-600';
  return 'bg-emerald-500';
};

export default function Tasks() {
  return (
    <div className="p-8 pb-12 w-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="text-sm text-slate-500 mt-1">Engineering · 24 tasks assigned</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full">
            Engineering Dept
          </span>
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700">
            RS
          </div>
        </div>
      </div>

      {/* Filters and Search Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <IconSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-48"
            />
          </div>
          <button className="px-4 py-1.5 text-sm font-medium bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200">
            All
          </button>
          <button className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-full">
            In progress
          </button>
          <button className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-full">
            Completed
          </button>
          <button className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-full">
            Overdue
          </button>
          <button className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-full">
            High priority
          </button>
        </div>
        <button className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-full flex items-center gap-2">
          <IconArrowsSort className="w-4 h-4" /> Sort
        </button>
      </div>

      {/* Task Table Structure */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-4">Task</div>
          <div className="col-span-1 text-center">Priority</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-center">Progress</div>
          <div className="col-span-2 text-center">Due Date</div>
          <div className="col-span-1 text-center">Action</div>
        </div>

        {/* Overdue Section */}
        <div className="bg-slate-50/30 px-6 py-2 border-b border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">OVERDUE · 4 TASKS</span>
        </div>
        <div className="divide-y divide-slate-100">
          {overdueTasks.map(task => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>

        {/* In Progress Section */}
        <div className="bg-slate-50/30 px-6 py-2 border-b border-slate-200 border-t">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">IN PROGRESS · 9 TASKS</span>
        </div>
        <div className="divide-y divide-slate-100">
          {inProgressTasks.map(task => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>

        {/* Completed Section */}
        <div className="bg-slate-50/30 px-6 py-2 border-b border-slate-200 border-t">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">COMPLETED · 11 TASKS</span>
        </div>
        <div className="divide-y divide-slate-100">
          {completedTasks.map(task => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-between items-center mt-6">
        <span className="text-xs font-medium text-slate-400">Showing 11 of 24 tasks</span>
        <div className="flex gap-1">
          <button className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 bg-white rounded hover:bg-slate-50">
            &larr; Prev
          </button>
          <button className="w-8 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded">
            1
          </button>
          <button className="w-8 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 bg-white rounded hover:bg-slate-50">
            2
          </button>
          <button className="w-8 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 bg-white rounded hover:bg-slate-50">
            3
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 bg-white rounded hover:bg-slate-50">
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );

  function TaskRow({ task }: { task: any }) {
    return (
      <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors">
        <div className="col-span-4 pr-4">
          <p className="text-sm font-medium text-slate-900 truncate">{task.title}</p>
          <p className="text-xs text-slate-400 mt-0.5 truncate">{task.subtitle}</p>
        </div>
        <div className="col-span-1 flex justify-center">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getPriorityStyle(task.priority)}`}>
            {task.priority}
          </span>
        </div>
        <div className="col-span-2 flex justify-center">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${getStatusStyle(task.status)}`}>
            {task.status}
          </span>
        </div>
        <div className="col-span-2 flex items-center gap-3">
          <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className={`${getProgressColor(task.status)} h-1.5 rounded-full`} style={{ width: `${task.progress}%` }}></div>
          </div>
          <span className="text-[11px] font-bold text-slate-700 w-8 text-right">{task.progress}%</span>
        </div>
        <div className="col-span-2 flex justify-center">
          <span className={`text-xs font-semibold ${task.status === 'Overdue' ? 'text-red-600' : 'text-slate-600'}`}>
            {task.due}
          </span>
        </div>
        <div className="col-span-1 flex justify-center">
          {task.action === 'Update' ? (
            <button className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium text-slate-600 border border-slate-200 rounded bg-white hover:bg-slate-50">
              <IconEdit className="w-3 h-3 text-slate-400" />
              Update
            </button>
          ) : (
            <button className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium text-slate-400 border border-slate-100 rounded bg-slate-50 cursor-default">
              <IconCheck className="w-3 h-3" />
              Done
            </button>
          )}
        </div>
      </div>
    );
  }
}
