import React from 'react';
import { BookOpen } from 'lucide-react';

const LearnTab = ({ learnAndGrow = [] }) => {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <h3 className="text-sm font-black uppercase tracking-widest text-text">
        Guided Learning
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {learnAndGrow?.map((course, idx) => (
          <div
            key={idx}
            className="bg-card border border-border-subtle p-5 flex flex-col gap-4 group hover:border-primary/40 transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-black uppercase tracking-wider text-primary">
                {course.type}
              </span>
              <BookOpen
                size={14}
                className="text-text-subtler group-hover:text-primary transition-colors"
              />
            </div>
            <h4 className="text-xs font-black text-text group-hover:text-primary transition-colors">
              {course.title}
            </h4>
            <div className="mt-auto">
              <div className="flex justify-between text-[8px] font-bold text-text-subtle mb-1 leading-none">
                <span>PROGRESS</span>
                <span>{course.progress}%</span>
              </div>
              <div className="w-full bg-background-elevated h-1.5 rounded-none overflow-hidden">
                <div
                  className="bg-status-success h-full"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
        {(!learnAndGrow || learnAndGrow.length === 0) && (
          <div className="col-span-3 text-center py-12 text-[8px] text-text-subtler uppercase font-black tracking-widest italic">
            No learning modules assigned
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnTab;
