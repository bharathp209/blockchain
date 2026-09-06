import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileSpreadsheet,
  PlusCircle,
  Blocks,
  FileCheck2,
  Users,
  ShieldCheck,
  Lock,
  Compass,
  ArrowRightLeft
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user } = useAuth();
  const role = user?.role || 'CITIZEN';

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'REGISTRAR', 'CITIZEN']
    },
    {
      id: 'records',
      label: 'Land Records',
      icon: FileSpreadsheet,
      roles: ['ADMIN', 'REGISTRAR', 'CITIZEN']
    },
    {
      id: 'transfers',
      label: 'Property Transfers',
      icon: ArrowRightLeft,
      roles: ['ADMIN', 'REGISTRAR', 'CITIZEN'],
      badge: role === 'CITIZEN' ? 'Restricted' : 'Mutation Hub'
    },
    {
      id: 'add-record',
      label: 'Add Land Record',
      icon: PlusCircle,
      roles: ['ADMIN', 'REGISTRAR'],
      badge: 'Registrar/Admin'
    },
    {
      id: 'blockchain',
      label: 'Blockchain Explorer',
      icon: Blocks,
      roles: ['ADMIN', 'REGISTRAR', 'CITIZEN']
    },
    {
      id: 'audit-logs',
      label: 'Audit Trail',
      icon: FileCheck2,
      roles: ['ADMIN', 'REGISTRAR'],
      badge: 'Auditors'
    },
    {
      id: 'users',
      label: 'User Access Control',
      icon: Users,
      roles: ['ADMIN'],
      badge: 'Admin Only'
    }
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-[#080c17]/95 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        {/* Navigation Group */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            System Modules
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isAllowed = item.roles.includes(role);
              const isActive = activeTab === item.id;

              if (!isAllowed) {
                // Dimmed locked item showing access control
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-slate-400 cursor-not-allowed select-none bg-slate-900/30"
                    title={`Restricted to ${item.roles.join(', ')}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span>{item.label}</span>
                    </div>
                    <Lock className="w-3 h-3 text-slate-400" />
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,212,255,0.1)]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Public Citizen Portal quick action */}
        <div className="pt-2">
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Public Gateway
          </div>
          <button
            onClick={() => setActiveTab('landing')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'landing'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Public Land Portal</span>
          </button>
        </div>
      </div>

      {/* Role & Security Banner at Bottom */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Active Role:</span>
            <span className="text-[11px] font-bold text-cyan-300">{role}</span>
          </div>
          <div className="text-[10px] text-slate-400 leading-tight">
            {role === 'ADMIN' && 'Full privileges: Tampering simulation, user audit & block validation.'}
            {role === 'REGISTRAR' && 'Registration & mutation authorization with document anchoring.'}
            {role === 'CITIZEN' && 'Read-only access with public cryptographic verification.'}
          </div>
        </div>
        <div className="mt-3 text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-mono block">LANDCHAIN PROTOCOL • SECURE NETWORK</span>
          <span className="text-[9px] text-cyan-400/70 font-mono block tracking-wider">© Bharath</span>
        </div>
      </div>
    </aside>
  );
}
