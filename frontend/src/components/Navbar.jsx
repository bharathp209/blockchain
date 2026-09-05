import React from 'react';
import { useAuth } from '../context/AuthContext';
import StatusBadge from './StatusBadge';
import { Shield, Link2, LogOut, User, Activity, AlertOctagon } from 'lucide-react';

export default function Navbar({ onOpenDemoGuide, stats }) {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-slate-800 bg-[#05070d]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,212,255,0.2)]">
          <Link2 className="w-5 h-5 text-cyan-400 rotate-45" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wider text-lg text-white">
              LAND<span className="text-cyan-400">CHAIN</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-mono font-semibold">
              PROTOCOL V1.0
            </span>
          </div>
          <p className="text-[11px] text-slate-400 tracking-tight">
            Secure Blockchain-Based Land Record Management Platform
          </p>
        </div>
      </div>

      {/* Center status: Blockchain Health */}
      <div className="hidden lg:flex items-center gap-4 bg-slate-900/60 border border-slate-800 px-4 py-1.5 rounded-full text-xs">
        <div className="flex items-center gap-2 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-medium">Blockchain SimNet: Active</span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="text-slate-300 font-mono">
          Blocks: <span className="text-cyan-400 font-semibold">{stats?.totalBlocks || '—'}</span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="text-slate-400">
          Engine: <span className="text-slate-200">SHA-256 Hash-Linked</span>
        </div>
      </div>

      {/* Right Controls & User info */}
      <div className="flex items-center gap-3">
        {/* Review Guide Button */}
        <button
          onClick={onOpenDemoGuide}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition"
          title="Step-by-step Review Presentation Guide"
        >
          <Activity className="w-3.5 h-3.5" />
          Guide
        </button>

        {user ? (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-slate-200">{user.name}</div>
              <div className="mt-0.5">
                <StatusBadge status={user.role} />
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-400 border border-slate-700 text-slate-400 transition"
              title="Logout session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <a
            href="#login"
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition shadow-[0_0_15px_rgba(0,212,255,0.3)]"
          >
            Sign In
          </a>
        )}
      </div>
    </header>
  );
}
