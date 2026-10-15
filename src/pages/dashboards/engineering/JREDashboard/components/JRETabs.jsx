import React from 'react';
import {
  Layout,
  Briefcase,
  BookOpen,
  Code as CodeIcon,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

const JRETabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Layout size={12} /> },
    { id: 'my_work', label: 'My Work', icon: <Briefcase size={12} /> },
    { id: 'learn', label: 'Learn', icon: <BookOpen size={12} /> },
    { id: 'code', label: 'Code', icon: <CodeIcon size={12} /> },
    { id: 'feedback', label: 'Feedback', icon: <MessageSquare size={12} /> },
    { id: 'insights', label: 'Insights', icon: <Sparkles size={12} /> },
  ];

  return (
    <div className="flex border-b border-border-subtle overflow-x-auto scrollbar-none gap-1.5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === tab.id
              ? 'border-primary text-text bg-background-elevated'
              : 'border-transparent text-text-subtle hover:text-text hover:bg-card'
          }`}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default JRETabs;
