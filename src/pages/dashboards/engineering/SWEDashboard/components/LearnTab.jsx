import React from 'react';
import { BookOpen } from 'lucide-react';

const LearnTab = ({ learnAndGrow = [] }) => {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <h3 className="text-sm font-black uppercase tracking-widest text-white">
        Guided Learning
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {learnAndGrow?.map((course, idx) => (
          <div
            key={idx}
            className="bg-[#0A0C14] border border-white/5 p-5 flex flex-col gap-4 group hover:border-primary/40 transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-black uppercase tracking-wider text-primary">
                {course.type}
              </span>
              <BookOpen
                size={14}
                className="text-white/20 group-hover:text-primary transition-colors"
              />
            </div>
            <h4 className="text-xs font-black text-white group-hover:text-primary transition-colors">
              {course.title}
            </h4>
            <div className="mt-auto">
              <div className="flex justify-between text-[8px] font-bold text-white/40 mb-1 leading-none">
                <span>PROGRESS</span>
                <span>{course.progress}%</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-none overflow-hidden">
                <div
                  className="bg-[#10B981] h-full"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
        {(!learnAndGrow || learnAndGrow.length === 0) && (
          <div className="col-span-3 text-center py-12 text-[8px] text-white/10 uppercase font-black tracking-widest italic">
            No learning modules assigned
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnTab;
