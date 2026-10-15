import React from 'react';

const SWETabs = ({ activeTab, setActiveTab }) => {
  const tabItems = [
    'Overview',
    'My Work',
    'Code',
    'Pull Requests',
    'Quality',
    'Deployments',
    'Learn',
    'Insights',
  ];

  return (
    <div className="flex border-b border-border-subtle overflow-x-auto scrollbar-none gap-6">
      {tabItems.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-3 text-[9px] font-black uppercase tracking-widest relative transition-all active:scale-[0.98] cursor-pointer border-none bg-transparent ${
            activeTab === tab
              ? 'text-primary'
              : 'text-text-subtle hover:text-text'
          }`}
        >
          {tab}
          {activeTab === tab && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in duration-300" />
          )}
        </button>
      ))}
    </div>
  );
};

export default SWETabs;
