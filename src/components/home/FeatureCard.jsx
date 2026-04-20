import React, { memo } from 'react';

/**
 * FeatureCard Component
 * Showcases core capabilities with a sleek, interactive design.
 */
const FeatureCard = memo(({ icon, title, description, featured = false, layout = 'vertical', visualHint = null }) => (
    <div
        className="p-8 md:p-10 bg-white/[0.04] border border-white/15 rounded-[2rem] hover:border-primary/30 transition-all group flex flex-col h-full"
    >
        <div className="mb-8 p-4 bg-white/10 border border-white/15 rounded-2xl w-fit group-hover:bg-primary/10 group-hover:border-primary/30 transition-all">
            {React.cloneElement(icon, { 'aria-hidden': 'true', size: 24 })}
        </div>
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <p className="text-white/65 text-sm md:text-base leading-relaxed">{description}</p>
    </div>
));

FeatureCard.displayName = 'FeatureCard';

export default FeatureCard;
