import React from 'react';

/**
 * DashboardSkeleton
 * Matches the approximate structural layout of any role dashboard
 * (header strip + metrics row + tab content area) so the page height
 * is stable before and after data loads — preventing CLS.
 */
const DashboardSkeleton = () => (
  <div className="min-h-screen bg-background p-4 lg:p-6 flex flex-col gap-6 max-w-screen-2xl mx-auto animate-pulse">
    {/* Header row */}
    <div className="flex items-center justify-between gap-4">
      <div className="h-6 w-48 bg-white/5 rounded" />
      <div className="flex gap-2">
        <div className="h-8 w-32 bg-white/5 rounded" />
        <div className="h-8 w-24 bg-white/5 rounded" />
        <div className="h-8 w-56 bg-white/5 rounded" />
      </div>
    </div>

    {/* Metrics strip — 5 cards */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-24 bg-white/[0.03] border border-white/5 rounded-none"
        />
      ))}
    </div>

    {/* Tab bar */}
    <div className="flex gap-1 border-b border-white/10 pb-0">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-8 w-20 bg-white/[0.03] rounded-t" />
      ))}
    </div>

    {/* Tab panel — 3-column card grid */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
      <div className="lg:col-span-5 min-h-[420px] bg-white/[0.03] border border-white/5 rounded-none" />
      <div className="lg:col-span-4 min-h-[420px] bg-white/[0.03] border border-white/5 rounded-none" />
      <div className="lg:col-span-3 min-h-[420px] bg-white/[0.03] border border-white/5 rounded-none" />
    </div>
  </div>
);

export default DashboardSkeleton;
