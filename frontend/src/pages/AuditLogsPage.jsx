import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  FileCheck2,
  Filter,
  Search,
  RefreshCw,
  Clock,
  Shield,
  User,
  AlertTriangle
} from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (actionFilter) params.action = actionFilter;
      if (statusFilter) params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.getAuditLogs(params);
      if (res.success) {
        setLogs(res.logs || []);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  const handleReset = () => {
    setActionFilter('');
    setStatusFilter('');
    setSearch('');
    setTimeout(fetchLogs, 50);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            <span>Forensic Audit Trail</span>
          </h1>
          <p className="text-xs text-slate-400">
            Immutable log of all user authentications, registrations, verifications, tamper detections & RBAC denials
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Trail</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by survey no, user name, or keyword..."
            className="w-full pl-10 pr-20 py-2 rounded-lg bg-black/40 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-800 text-cyan-400 text-xs font-semibold rounded"
          >
            Filter
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="">All Actions</option>
            <option value="LOGIN_SUCCESS">LOGIN_SUCCESS</option>
            <option value="LOGIN_FAILED">LOGIN_FAILED</option>
            <option value="ADD_LAND_RECORD">ADD_LAND_RECORD</option>
            <option value="UPDATE_LAND_RECORD">UPDATE_LAND_RECORD</option>
            <option value="VERIFY_RECORD">VERIFY_RECORD</option>
            <option value="ACCESS_DENIED">ACCESS_DENIED</option>
            <option value="TAMPER_DETECTED">TAMPER_DETECTED</option>
            <option value="TAMPER_SIMULATION_EXECUTED">TAMPER_SIMULATION_EXECUTED</option>
            <option value="BLOCKCHAIN_VALIDATED">BLOCKCHAIN_VALIDATED</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="">All Statuses</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="ACCESS_DENIED">ACCESS DENIED</option>
            <option value="TAMPERED">TAMPERED</option>
            <option value="FAILED">FAILED</option>
          </select>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition text-xs"
            title="Reset Filters"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Action</th>
                <th className="px-5 py-3.5">Resource Target</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Audit Forensic Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-cyan-400" />
                    Querying audit trail logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-500">
                    No audit records match the selected filters.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const isTamper = log.action === 'TAMPER_DETECTED' || log.status === 'TAMPERED';
                  const isDenied = log.action === 'ACCESS_DENIED' || log.status === 'ACCESS_DENIED';

                  return (
                    <tr
                      key={log.id}
                      className={`hover:bg-slate-800/40 transition ${
                        isTamper ? 'bg-rose-950/20' : isDenied ? 'bg-amber-950/15' : ''
                      }`}
                    >
                      <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-white whitespace-nowrap">
                        {log.user_name || 'SYSTEM'}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <StatusBadge status={log.user_role} />
                      </td>
                      <td className="px-5 py-3.5 font-bold font-mono text-[11px] text-cyan-300 whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="px-5 py-3.5 text-slate-300 whitespace-nowrap font-medium">
                        {log.resource}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <StatusBadge status={log.status} />
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-[11px] max-w-xs truncate" title={log.details}>
                        {log.details}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
