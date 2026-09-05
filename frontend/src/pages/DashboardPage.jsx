import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import {
  FileSpreadsheet,
  Blocks,
  ShieldCheck,
  ShieldAlert,
  Lock,
  ArrowRight,
  PlusCircle,
  Activity,
  AlertTriangle,
  RefreshCw,
  Hash,
  Clock,
  Shield
} from 'lucide-react';

export default function DashboardPage({ onNavigate, onVerifyRecord }) {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await api.getDashboardStats();
      if (data.success) {
        setStatsData(data);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const stats = statsData?.stats || {};
  const recentTransactions = statsData?.recentTransactions || [];
  const recentAudits = statsData?.recentAuditEvents || [];
  const securityAlerts = statsData?.securityAlerts || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/30 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Welcome, {user?.name || 'Authorized Official'}
            </h1>
            <StatusBadge status={user?.role} />
          </div>
          <p className="text-xs text-slate-400">
            Decentralized Land Record Security, Identity & Provenance Engine
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Sync Ledger'}</span>
          </button>

          {['ADMIN', 'REGISTRAR'].includes(user?.role) && (
            <button
              onClick={() => onNavigate('add-record')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wide transition shadow-[0_0_15px_rgba(0,212,255,0.3)] flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Land Parcel</span>
            </button>
          )}
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Land Records"
          value={loading ? '...' : (stats.totalRecords || 0)}
          subtitle="Registered in SQLite Registry"
          icon={FileSpreadsheet}
          color="cyan"
        />

        <StatCard
          title="Blockchain Blocks"
          value={loading ? '...' : (stats.totalBlocks || 0)}
          subtitle="Hash-Linked SHA-256 Blocks"
          icon={Blocks}
          color="purple"
        />

        <StatCard
          title="Verified Records"
          value={loading ? '...' : (stats.verifiedRecords || 0)}
          subtitle="Cryptographically Intact"
          icon={ShieldCheck}
          color="emerald"
        />

        <StatCard
          title="Tampered Records"
          value={loading ? '...' : (stats.tamperedRecords || 0)}
          subtitle={stats.tamperedRecords > 0 ? '⚠ Tampering Flagged' : 'Zero Fraud Detected'}
          icon={ShieldAlert}
          color={stats.tamperedRecords > 0 ? 'rose' : 'cyan'}
        />

        <StatCard
          title="Access Denials"
          value={loading ? '...' : (stats.accessDeniedAttempts || 0)}
          subtitle="RBAC Unauthorized Interceptions"
          icon={Lock}
          color="amber"
        />
      </div>

      {/* Blockchain Status Bar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Blocks className="w-4 h-4" />
          </div>
          <div>
            <div className="text-slate-200 font-semibold flex items-center gap-2">
              <span>Latest Chain Anchor: Block #{stats.latestBlockIndex || 0}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="font-mono text-slate-400 text-[11px] truncate max-w-md">
              Hash: {stats.latestBlockHash || '00000000000000000000000000000000'}
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('blockchain')}
          className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30 flex items-center gap-1.5 transition text-xs"
        >
          <span>Open Full Blockchain Explorer</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Security Alerts (if any) */}
      {securityAlerts.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Security & Tamper Incident Monitoring</span>
            </h3>
            <span className="text-[11px] text-slate-400">Real-time Forensic Feed</span>
          </div>

          <div className="space-y-2">
            {securityAlerts.map(alert => (
              <div
                key={alert.id}
                className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                  alert.action === 'TAMPER_DETECTED'
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                    : alert.action === 'TAMPER_SIMULATION_EXECUTED'
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={alert.action} />
                    <span className="font-semibold text-white">{alert.resource}</span>
                    <span className="text-slate-400">• By {alert.user_name} ({alert.user_role})</span>
                  </div>
                  <p className="text-slate-400 text-[11px] truncate max-w-xl">
                    {typeof alert.details === 'object' ? JSON.stringify(alert.details) : alert.details}
                  </p>
                </div>
                <div className="text-[10px] text-slate-500 font-mono shrink-0">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Split Grid: Recent Blockchain Transactions & Audit Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blockchain Transactions */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Blocks className="w-4 h-4 text-cyan-400" />
              <span>Recent Blockchain Transactions</span>
            </h3>
            <button
              onClick={() => onNavigate('blockchain')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              View all →
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {recentTransactions.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No transactions mined yet.</p>
            ) : (
              recentTransactions.map(tx => (
                <div key={tx.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-300">{tx.transaction_id}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono">
                        {tx.transaction_type}
                      </span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Parcel: <span className="text-slate-200 font-mono">{tx.survey_number}</span> ({tx.owner_name})
                    </div>
                    <div className="font-mono text-[10px] text-slate-500 truncate max-w-xs">
                      Block: {tx.block_hash ? tx.block_hash.slice(0, 24) : ''}...
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Audit Trail Events */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>System Audit Trail Activity</span>
            </h3>
            {['ADMIN', 'REGISTRAR'].includes(user?.role) && (
              <button
                onClick={() => onNavigate('audit-logs')}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
              >
                Inspect logs →
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-800/80">
            {recentAudits.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No audit events recorded.</p>
            ) : (
              recentAudits.map(log => (
                <div key={log.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">{log.action}</span>
                      <StatusBadge status={log.status} />
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      {log.resource} • <span className="text-slate-300">{log.user_name}</span> ({log.user_role})
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
