import React, { useState } from 'react';
import { Clock, ShieldCheck, GitBranch, User, ChevronRight, Activity } from 'lucide-react';
import { TASK_STATUS } from '../../constants';

const TaskTable = ({ tasks, onTaskClick, handleStatusChange }) => {
  return (
    <div className="space-y-6">
      <div className="bg-background-light border-2 border-white/20 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
        <div className="overflow-x-auto lg:overflow-x-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-white/20 bg-background-elevated">
                <th className="px-5 py-7 text-[10px] font-black text-white/90 uppercase tracking-[0.4em]">Priority</th>
                <th className="px-5 py-7 text-[10px] font-black text-white/90 uppercase tracking-[0.4em]">Ticket ID</th>
                <th className="px-5 py-7 text-[10px] font-black text-white/90 uppercase tracking-[0.4em]">Title</th>
                <th className="px-5 py-7 text-[10px] font-black text-white/90 uppercase tracking-[0.4em]">Status</th>
                <th className="px-5 py-7 text-[10px] font-black text-white/90 uppercase tracking-[0.4em]">Operator</th>
                <th className="px-5 py-7 text-[10px] font-black text-white/90 uppercase tracking-[0.4em]">Updated At</th>
                <th className="px-5 py-7 text-[10px] font-black text-white/90 uppercase tracking-[0.4em]">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-white/10">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr 
                    key={task._id} 
                    onClick={() => onTaskClick(task)}
                    className="group hover:bg-white/5 transition-all cursor-pointer border-l-4 border-transparent hover:border-primary"
                  >
                    <td className="px-5 py-6">
                       <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 ${
                            task.priority?.toUpperCase() === 'URGENT' ? 'bg-status-error animate-pulse shadow-[0_0_15px_rgba(248,113,113,0.6)]' :
                            task.priority?.toUpperCase() === 'HIGH' ? 'bg-status-error' :
                            task.priority?.toUpperCase() === 'MEDIUM' ? 'bg-status-warning' :
                            'bg-status-success'
                          }`} />
                          <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                            ['HIGH', 'URGENT'].includes(task.priority?.toUpperCase()) ? 'text-status-error' :
                            task.priority?.toUpperCase() === 'MEDIUM' ? 'text-status-warning' :
                            'text-status-success'
                          }`}>
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
                      <span className="text-[12px] font-black text-white group-hover:text-primary transition-colors uppercase tracking-tight block max-w-[220px] truncate">
                        {task.title}
                      </span>
                    </td>
                    <td className="px-5 py-6">
                      <select
                        value={task.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        className={`text-[9px] font-black px-4 py-2.5 rounded-none uppercase tracking-[0.25em] border-2 appearance-none cursor-pointer focus:outline-none transition-all ${
                          task.status === TASK_STATUS.DONE 
                            ? 'bg-status-success/15 border-status-success/60 text-status-success hover:bg-status-success/30'
                            : task.status === TASK_STATUS.IN_REVIEW
                              ? 'bg-secondary/15 border-secondary/60 text-secondary hover:bg-secondary/30'
                              : task.status === TASK_STATUS.IN_PROGRESS
                                ? 'bg-status-warning/15 border-status-warning/60 text-status-warning hover:bg-status-warning/30'
                                : 'bg-white/10 border-white/40 text-white hover:bg-white/20'
                        }`}
                      >
                        <option value={TASK_STATUS.TODO} className="bg-[#000] text-white">TO_DO</option>
                        <option value={TASK_STATUS.IN_PROGRESS} className="bg-[#000] text-white">IN_PROGRESS</option>
                        <option value={TASK_STATUS.IN_REVIEW} className="bg-[#000] text-white">IN_REVIEW</option>
                        <option value={TASK_STATUS.DONE} className="bg-[#000] text-white">DONE</option>
                      </select>
                    </td>
                    <td className="px-5 py-6">
                      {task.assignedUser ? (
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 bg-white/10 flex items-center justify-center text-[10px] font-black text-white border-2 border-white/30 group-hover:border-primary transition-all">
                            {task.assignedUser.name[0].toUpperCase()}
                          </div>
                          <span className="text-[10px] font-black text-white/90 uppercase tracking-[0.2em] group-hover:text-primary transition-colors whitespace-nowrap">
                            {task.assignedUser.name.split(' ')[0]}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] whitespace-nowrap">UNASSIGNED</span>
                      )}
                    </td>
                    <td className="px-5 py-6">
                      <span className="text-[9px] font-black text-white/80 uppercase tracking-[0.2em] whitespace-nowrap group-hover:text-white transition-colors">
                        {task.updatedAt ? new Date(task.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '00:00'}
                      </span>
                    </td>
                    <td className="px-5 py-6">
                      <span className="text-[9px] font-black text-white/70 uppercase tracking-[0.2em] whitespace-nowrap group-hover:text-white/90 transition-colors">
                        {task.createdFormatted}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-5 py-32 text-center">
                    <div className="flex flex-col items-center justify-center grayscale opacity-40">
                       <div className="w-20 h-1 bg-white/40 mb-4" />
                       <span className="text-[11px] font-black uppercase tracking-[0.4em]">No Records Found</span>
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
