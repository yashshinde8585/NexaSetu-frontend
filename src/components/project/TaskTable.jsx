import React, { useState } from 'react';
import {
  Clock,
  ShieldCheck,
  GitBranch,
  User,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { TASK_STATUS } from '../../constants';

const TaskTable = ({ tasks, onTaskClick, handleStatusChange }) => {
  return (
    <div className="space-y-6">
      <div className="bg-background-light border-2 border-border-subtle overflow-hidden shadow-sm">
        <div className="overflow-x-auto lg:overflow-x-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-border-subtle bg-background-elevated">
                <th className="px-5 py-7 text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">
                  Priority
                </th>
                <th className="px-5 py-7 text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">
                  Ticket ID
                </th>
                <th className="px-5 py-7 text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">
                  Type
                </th>
                <th className="px-5 py-7 text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">
                  Title
                </th>
                <th className="px-5 py-7 text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">
                  Status
                </th>
                <th className="px-5 py-7 text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">
                  Operator
                </th>
                <th className="px-5 py-7 text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">
                  Due Date
                </th>
                <th className="px-5 py-7 text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-white/10">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr
                    key={task._id}
                    onClick={() => onTaskClick(task)}
                    className="group hover:bg-background-elevated transition-all cursor-pointer border-l-4 border-transparent hover:border-primary"
                  >
                    <td className="px-5 py-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 ${
                            task.priority?.toUpperCase() === 'URGENT'
                              ? 'bg-status-error animate-pulse shadow-[0_0_15px_rgba(248,113,113,0.6)]'
                              : task.priority?.toUpperCase() === 'HIGH'
                                ? 'bg-status-error'
                                : task.priority?.toUpperCase() === 'MEDIUM'
                                  ? 'bg-status-warning'
                                  : 'bg-status-success'
                          }`}
                        />
                        <span
                          className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                            ['HIGH', 'URGENT'].includes(
                              task.priority?.toUpperCase()
                            )
                              ? 'text-status-error'
                              : task.priority?.toUpperCase() === 'MEDIUM'
                                ? 'text-status-warning'
                                : 'text-status-success'
                          }`}
                        >
                          {task.priority || 'MEDIUM'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-6">
                      <span className="text-[11px] font-black text-primary font-mono uppercase tracking-widest bg-primary/15 border-2 border-primary/40 px-3 py-1">
                        {task.projectKey}-{task.taskNumber}
                      </span>
                    </td>
                    <td className="px-5 py-6">
                      <span
                        className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 border ${
                          task.type === 'bug'
                            ? 'bg-status-error/10 border-status-error text-status-error'
                            : task.type === 'epic'
                              ? 'bg-secondary/10 border-secondary text-secondary'
                              : task.type === 'story'
                                ? 'bg-status-success/10 border-status-success text-status-success'
                                : task.type === 'spike'
                                  ? 'bg-primary/10 border-primary text-primary'
                                  : task.type === 'tech_debt'
                                    ? 'bg-status-warning/10 border-status-warning text-status-warning'
                                    : 'bg-background-elevated border-border-subtle text-text-subtle'
                        }`}
                      >
                        {task.type || 'TASK'}
                      </span>
                    </td>
                    <td className="px-5 py-6">
                      <span className="text-[12px] font-black text-text group-hover:text-primary transition-colors uppercase tracking-tight block max-w-[220px] truncate">
                        {task.title}
                      </span>
                    </td>
                    <td className="px-5 py-6">
                      <select
                        value={task.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleStatusChange(task._id, e.target.value)
                        }
                        className={`text-[9px] font-black px-4 py-2.5 rounded-none uppercase tracking-[0.25em] border-2 appearance-none cursor-pointer focus:outline-none transition-all ${
                          task.status === TASK_STATUS.DONE
                            ? 'bg-status-success/15 border-status-success/60 text-status-success hover:bg-status-success/30'
                            : task.status === TASK_STATUS.IN_REVIEW
                              ? 'bg-secondary/15 border-secondary/60 text-secondary hover:bg-secondary/30'
                              : task.status === TASK_STATUS.IN_PROGRESS
                                ? 'bg-status-warning/15 border-status-warning/60 text-status-warning hover:bg-status-warning/30'
                                : 'bg-background-elevated border-border-subtle text-text hover:bg-border-subtle'
                        }`}
                      >
                        <option
                          value={TASK_STATUS.TODO}
                          className="bg-background-dark text-text"
                        >
                          TO_DO
                        </option>
                        <option
                          value={TASK_STATUS.IN_PROGRESS}
                          className="bg-background-dark text-text"
                        >
                          IN_PROGRESS
                        </option>
                        <option
                          value={TASK_STATUS.IN_REVIEW}
                          className="bg-background-dark text-text"
                        >
                          IN_REVIEW
                        </option>
                        <option
                          value={TASK_STATUS.DONE}
                          className="bg-background-dark text-text"
                        >
                          DONE
                        </option>
                      </select>
                    </td>
                    <td className="px-5 py-6">
                      {task.assignedUser ? (
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 bg-background-elevated flex items-center justify-center text-[10px] font-black text-text border-2 border-border-subtle group-hover:border-primary transition-all">
                            {task.assignedUser.name[0].toUpperCase()}
                          </div>
                          <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] group-hover:text-primary transition-colors whitespace-nowrap">
                            {task.assignedUser.name.split(' ')[0]}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-text-subtle uppercase tracking-[0.2em] whitespace-nowrap">
                          UNASSIGNED
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-6">
                      <span
                        className={`text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-colors ${
                          task.dueDate &&
                          new Date(task.dueDate) < new Date() &&
                          task.status !== TASK_STATUS.DONE
                            ? 'text-status-error'
                            : task.dueDate
                              ? 'text-text-muted group-hover:text-text'
                              : 'text-primary/40'
                        }`}
                      >
                        {task.dueDate
                          ? new Date(task.dueDate)
                              .toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })
                              .toUpperCase()
                          : task.estimatedDuration
                            ? (() => {
                                const mins = task.estimatedDuration || 0;
                                const suggested = new Date(
                                  Date.now() + mins * 60 * 1000
                                );
                                return `~ ${suggested.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}`;
                              })()
                            : 'NOT SET'}
                      </span>
                    </td>
                    <td className="px-5 py-6">
                      <span className="text-[9px] font-black text-text/70 uppercase tracking-[0.2em] whitespace-nowrap group-hover:text-text-muted transition-colors">
                        {task.createdFormatted || 'NEW'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-5 py-32 text-center">
                    <div className="flex flex-col items-center justify-center grayscale opacity-40">
                      <div className="w-20 h-1 bg-white/40 mb-4" />
                      <span className="text-[11px] font-black uppercase tracking-[0.4em]">
                        No Records Found
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskTable;
