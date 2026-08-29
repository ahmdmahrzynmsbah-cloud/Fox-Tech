import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="h-screen w-full max-w-full bg-gray-50 dark:bg-[#090D16] text-gray-900 dark:text-white flex flex-col md:flex-row font-sans overflow-hidden select-none animate-pulse">
      {/* Sidebar Skeleton (Desktop) */}
      <aside className="bg-white dark:bg-[#1E2433] border-l border-gray-200 dark:border-slate-200 dark:border-white/10 hidden md:flex flex-col shrink-0 shadow-xs z-30 h-full w-64 transition-all duration-300 relative">
        {/* Logo area */}
        <div className="h-20 border-b border-gray-200 dark:border-slate-200 dark:border-white/10 flex items-center justify-center px-4 shrink-0">
          <div className="h-9 w-36 bg-slate-200 dark:bg-slate-700/60 rounded-xl" />
        </div>

        {/* User mini badge */}
        <div className="p-4 border-b border-gray-150 dark:border-blue-900/30 bg-slate-50/50 dark:bg-[#0F1117]/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-700/70 shrink-0" />
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-700/70 rounded-md" />
            <div className="h-2.5 w-16 bg-slate-150 dark:bg-slate-700/40 rounded-md" />
          </div>
        </div>

        {/* Nav list items */}
        <div className="flex-1 p-3 space-y-2 overflow-y-auto">
          {[
            { w: 'w-28', active: true },
            { w: 'w-24', active: false },
            { w: 'w-32', active: false },
            { w: 'w-20', active: false },
            { w: 'w-28', active: false },
            { w: 'w-24', active: false },
            { w: 'w-30', active: false },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl ${
                item.active
                  ? 'bg-slate-200 dark:bg-blue-900/40 border border-slate-300/40 dark:border-blue-700/30'
                  : 'bg-transparent'
              }`}
            >
              <div className="w-5 h-5 rounded-lg bg-slate-200 dark:bg-slate-700/60 shrink-0" />
              <div className={`h-3.5 ${item.w} bg-slate-200 dark:bg-slate-700/60 rounded-md`} />
            </div>
          ))}
        </div>

        {/* Bottom actions */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#0F1117]/60 flex items-center justify-between">
          <div className="h-9 w-28 bg-slate-200 dark:bg-slate-700/50 rounded-xl" />
          <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700/50 rounded-xl" />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar Skeleton */}
        <header className="h-16 sm:h-20 bg-white/80 dark:bg-[#0E1540]/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-200 dark:border-white/10 flex items-center justify-between px-4 sm:px-8 shrink-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile menu icon placeholder */}
            <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700/60 md:hidden" />
            <div className="space-y-1.5">
              <div className="h-4 w-32 sm:w-44 bg-slate-200 dark:bg-slate-700/70 rounded-md" />
              <div className="h-2.5 w-20 sm:w-28 bg-slate-150 dark:bg-slate-700/40 rounded-md hidden sm:block" />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Balance Badge Skeleton */}
            <div className="h-9 w-24 sm:w-28 rounded-full bg-slate-200 dark:bg-slate-700/60" />
            {/* Notification icon */}
            <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700/60" />
            {/* Theme Toggle */}
            <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700/60" />
            {/* User Profile Pill */}
            <div className="h-9 w-28 sm:w-36 rounded-full bg-slate-200 dark:bg-slate-700/60 hidden sm:flex items-center gap-2 px-2">
              <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-600" />
              <div className="h-3 w-16 bg-slate-300 dark:bg-slate-600 rounded-md" />
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body Skeleton */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Welcome Banner Hero Skeleton */}
          <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-[#131E5B] dark:via-[#192774] dark:to-[#131E5B] border border-slate-200 dark:border-blue-800/40 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-24 rounded-full bg-slate-300 dark:bg-slate-700/80" />
                  <div className="h-6 w-16 rounded-full bg-slate-300/70 dark:bg-slate-700/50" />
                </div>
                <div className="h-7 sm:h-9 w-64 sm:w-96 bg-slate-300 dark:bg-slate-700/80 rounded-xl" />
                <div className="h-4 w-48 sm:w-72 bg-slate-300/80 dark:bg-slate-700/50 rounded-lg" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-32 sm:w-36 rounded-2xl bg-slate-300 dark:bg-slate-700/80" />
                <div className="h-12 w-28 rounded-2xl bg-slate-300/80 dark:bg-slate-700/60 hidden sm:block" />
              </div>
            </div>
          </div>

          {/* Quick Metrics / Stats Grid (4 Bento Cards) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#1E2433] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-blue-900/30 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700/70" />
                  <div className="h-4 w-12 rounded-full bg-slate-150 dark:bg-slate-700/40" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-6 sm:h-8 w-20 sm:w-24 bg-slate-200 dark:bg-slate-700/80 rounded-lg" />
                  <div className="h-3 w-28 bg-slate-150 dark:bg-slate-700/50 rounded-md" />
                </div>
              </div>
            ))}
          </div>

          {/* Two-Column Section: Courses & Charts on Left, Activities on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left/Main Column (2 Spans) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Section Header Skeleton */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="h-5 w-36 bg-slate-200 dark:bg-slate-700/70 rounded-md" />
                  <div className="h-3 w-24 bg-slate-150 dark:bg-slate-700/40 rounded-md" />
                </div>
                <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700/60 rounded-xl" />
              </div>

              {/* Course / Learning Progress Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2].map((cardIdx) => (
                  <div
                    key={cardIdx}
                    className="bg-white dark:bg-[#1E2433] rounded-2xl border border-slate-200 dark:border-blue-900/30 overflow-hidden shadow-xs"
                  >
                    {/* Thumbnail placeholder */}
                    <div className="h-36 w-full bg-slate-200 dark:bg-slate-700/60 relative">
                      <div className="absolute top-3 right-3 h-6 w-16 bg-slate-300 dark:bg-slate-600 rounded-full" />
                    </div>
                    {/* Card Content */}
                    <div className="p-4 space-y-3">
                      <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700/70 rounded-md" />
                      <div className="h-3 w-1/2 bg-slate-150 dark:bg-slate-700/50 rounded-md" />
                      {/* Progress Bar */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between">
                          <div className="h-2.5 w-12 bg-slate-150 dark:bg-slate-700/50 rounded" />
                          <div className="h-2.5 w-8 bg-slate-150 dark:bg-slate-700/50 rounded" />
                        </div>
                        <div className="h-2 w-full bg-slate-150 dark:bg-slate-700/40 rounded-full overflow-hidden">
                          <div className="h-full w-2/3 bg-slate-300 dark:bg-slate-600 rounded-full" />
                        </div>
                      </div>
                      <div className="pt-2 flex justify-between items-center">
                        <div className="h-3.5 w-16 bg-slate-200 dark:bg-slate-700/60 rounded-md" />
                        <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700/70 rounded-xl" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Performance Chart Skeleton */}
              <div className="bg-white dark:bg-[#1E2433] p-5 rounded-2xl border border-slate-200 dark:border-blue-900/30 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700/70 rounded-md" />
                    <div className="h-2.5 w-20 bg-slate-150 dark:bg-slate-700/40 rounded-md" />
                  </div>
                  <div className="h-7 w-24 bg-slate-200 dark:bg-slate-700/60 rounded-lg" />
                </div>
                {/* Simulated Chart Bars / Waves */}
                <div className="h-44 w-full flex items-end justify-between gap-2 pt-6 px-2">
                  {[40, 75, 55, 90, 65, 80, 50, 85, 70, 95, 60, 80].map((heightPct, barI) => (
                    <div key={barI} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-slate-200 dark:bg-slate-700/60 rounded-t-md transition-all"
                        style={{ height: `${heightPct}%` }}
                      />
                      <div className="h-2 w-4 bg-slate-150 dark:bg-slate-700/40 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side Column (1 Span) */}
            <div className="space-y-6">
              {/* Upcoming Tests / Tasks Widget */}
              <div className="bg-white dark:bg-[#1E2433] p-5 rounded-2xl border border-slate-200 dark:border-blue-900/30 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700/70 rounded-md" />
                  <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700/60" />
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((taskIdx) => (
                    <div
                      key={taskIdx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-[#0F1117]/60 border border-slate-100 dark:border-slate-200 dark:border-white/10 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700/70 shrink-0" />
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700/70 rounded" />
                          <div className="h-2 w-16 bg-slate-150 dark:bg-slate-700/40 rounded" />
                        </div>
                      </div>
                      <div className="h-6 w-14 rounded-lg bg-slate-200 dark:bg-slate-700/60 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements / Stars Widget */}
              <div className="bg-white dark:bg-[#1E2433] p-5 rounded-2xl border border-slate-200 dark:border-blue-900/30 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700/70 rounded-md" />
                  <div className="h-4 w-12 bg-slate-150 dark:bg-slate-700/50 rounded-full" />
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0F1117]/60 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-700/70 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-700/70 rounded" />
                    <div className="h-2.5 w-36 bg-slate-150 dark:bg-slate-700/50 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
