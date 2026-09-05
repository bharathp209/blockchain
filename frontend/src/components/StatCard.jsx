import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'cyan' }) {
  const colorMap = {
    cyan: 'from-cyan-500/10 to-transparent border-cyan-500/30 text-cyan-400',
    emerald: 'from-emerald-500/10 to-transparent border-emerald-500/30 text-emerald-400',
    rose: 'from-rose-500/10 to-transparent border-rose-500/30 text-rose-400',
    amber: 'from-amber-500/10 to-transparent border-amber-500/30 text-amber-400',
    purple: 'from-purple-500/10 to-transparent border-purple-500/30 text-purple-400'
  };

  const selectedColor = colorMap[color] || colorMap.cyan;

  return (
    <div className={`relative overflow-hidden rounded-xl border bg-gradient-to-b ${selectedColor} bg-slate-900/60 p-5 shadow-lg backdrop-blur-sm transition hover:border-slate-600`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-white">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {subtitle && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
}
