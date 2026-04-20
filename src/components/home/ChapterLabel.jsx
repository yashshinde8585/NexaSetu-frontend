import React, { memo } from 'react';
import Reveal from './Reveal';

/**
 * ChapterLabel Component
 * Displays section headers with a tactical aesthetic.
 */
const ChapterLabel = memo(({ number, label }) => (
    <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] font-black text-white/40 tracking-[0.3em] uppercase">
            {String(number).padStart(2, '0')}
        </span>
        <div className="h-[1px] w-8 bg-white/20" />
        <span className="text-[10px] font-black text-primary tracking-[0.25em] uppercase">
            {label}
        </span>
    </div>
));

ChapterLabel.displayName = 'ChapterLabel';

export default ChapterLabel;
