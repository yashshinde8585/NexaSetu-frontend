import React, { memo, useRef, useState, useEffect, useMemo } from 'react';

const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

/**
 * Reveal Component
 * Handles scroll-triggered animations with performance optimizations.
 */
const Reveal = memo(({ children, delay = 0, direction = 'up', className = '', threshold = 0.12 }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(prefersReducedMotion);

    useEffect(() => {
        if (prefersReducedMotion || !ref.current) return;
        
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVisible(true);
                observer.disconnect();
            }
        }, { threshold, rootMargin: '0px 0px -60px 0px' });

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);

    const baseStyle = useMemo(() => ({
        transition: prefersReducedMotion
            ? 'none'
            : `opacity 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    }), [delay]);

    const hiddenStyle = useMemo(() => {
        if (prefersReducedMotion) return {};
        return {
            up: { opacity: 0, transform: 'translateY(40px)' },
            left: { opacity: 0, transform: 'translateX(-40px)' },
            right: { opacity: 0, transform: 'translateX(40px)' },
            scale: { opacity: 0, transform: 'scale(0.9)' },
            fade: { opacity: 0 },
        }[direction];
    }, [direction]);

    const shownStyle = { opacity: 1, transform: 'none' };

    return (
        <div
            ref={ref}
            className={className}
            style={{ ...baseStyle, ...(visible ? shownStyle : hiddenStyle) }}
        >
            {children}
        </div>
    );
});

Reveal.displayName = 'Reveal';

export default Reveal;
