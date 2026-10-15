import React, { memo } from 'react';
import { Activity } from 'lucide-react';

// Interactive role metric card.
const RoleCard = memo(
  ({
    icon,
    role,
    highlight,
    description,
    important = false,
    featured = false,
    visualHint = null,
  }) => (
    <div
      className={`p-8 bg-white/[0.04] border ${
        important ? 'border-primary/40' : 'border-white/15'
      } rounded-[2rem] hover:border-primary/50 transition-all group flex flex-col h-full shadow-sm hover:shadow-primary/5`}
    >
      <div className="flex-grow">
        <div className="flex items-center gap-5 mb-8">
          <div
            className={`p-4 ${important ? 'bg-primary/20 border-primary/30' : 'bg-white/10 border-white/15'} border rounded-2xl`}
          >
            {React.cloneElement(icon, { 'aria-hidden': 'true', size: 24 })}
          </div>
          <div>
            <h4 className="font-bold text-white text-lg">{role}</h4>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">
              {highlight}
            </p>
          </div>
        </div>
        <p className="text-white/65 text-sm leading-relaxed mb-8">
          {description}
        </p>
      </div>

      {visualHint && (
        <div className="mt-auto pt-6 border-t border-white/10">
          {visualHint}
        </div>
      )}
    </div>
  )
);

RoleCard.displayName = 'RoleCard';

export default RoleCard;
