import React from 'react';

const LearnTab = ({ learningLessons }) => {
  return (
    <div className="bg-card border border-border-subtle rounded-none p-5">
      <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
          Structured Learning Paths
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learningLessons.map((lesson, idx) => (
          <div
            key={idx}
            className="p-4 bg-card border border-border-subtle rounded-none"
          >
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-text">{lesson.name}</span>
              <span className="text-text-subtle">
                {lesson.completed}/{lesson.total} lessons
              </span>
            </div>
            <div className="w-full h-1.5 bg-background rounded-none overflow-hidden">
              <div
                className="h-full bg-status-success rounded-none"
                style={{ width: `${lesson.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearnTab;
