import React from 'react';

const FeedbackTab = () => {
  return (
    <div className="bg-card border border-border-subtle rounded-none p-5">
      <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
          Feedback
        </h3>
      </div>
      <div className="p-8 text-center text-text-subtle">
        <p className="text-sm">No recent feedback available.</p>
      </div>
    </div>
  );
};

export default FeedbackTab;
