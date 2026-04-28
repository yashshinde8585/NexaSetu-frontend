import React from 'react';
import { Box } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = Box, 
  title = 'NO_DATA_FOUND', 
  message = 'SYSTEM DETECTED AN EMPTY SECTOR. PLEASE INITIALIZE CONTENT.',
  action = null
}) => {
  return (
    <div className="py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-xl">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-white/5 rounded-full border border-white/10">
          <Icon size={32} className="text-white/20" />
        </div>
      </div>
      <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] max-w-xs mx-auto leading-relaxed mb-6">
        {message}
      </p>
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
