import React, { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const ReactMarkdown = lazy(() => import('react-markdown'));

const LazyMarkdown = (props) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-2 py-4">
          <Loader2 className="animate-spin text-primary/40" size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
            Rendering...
          </span>
        </div>
      }
    >
      <ReactMarkdown {...props} />
    </Suspense>
  );
};

export default ReactMarkdown ? LazyMarkdown : null; // Support cases where import is pending
