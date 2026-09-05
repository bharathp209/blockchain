import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  Search,
  Filter,
  ShieldCheck,
  Eye,
  Edit,
  AlertTriangle,
  PlusCircle,
  FileText,
  RefreshCw,
  FileDown
} from 'lucide-react';

export default function LandRecordsPage({
  onSelectRecord,
  onVerifyRecord,
  onOpenAdd,
  onSimulateTamper
}) {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      const res = await api.getLandRecords(params);
      if (res.success) {
        setRecords(res.records || []);
      }
    } catch (err) {
      console.error('Failed to load land records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRecords();
  };

  const isRegistrarOrAdmin = ['ADMIN', 'REGISTRAR'].includes(user?.role);
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Registered Land Parcels
          </h1>
          <p className="text-xs text-slate-400">
            Immutable land registry verified against SHA-256 blockchain ledger
          </p>
        </div>

        {isRegistrarOrAdmin && (
          <button
            onClick={onOpenAdd}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wide transition shadow-[0_0_15px_rgba(0,212,255,0.3)] flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Land Record</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Survey No, Owner Name, Village, or District..."
            className="w-full pl-10 pr-24 py-2.5 rounded-lg bg-black/40 border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs rounded transition"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-cyan-400 font-medium"
          >
            <option value="">All Statuses</option>
            <option value="REGISTERED">REGISTERED</option>
            <option value="TAMPERED">TAMPERED</option>
          </select>

          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('');
              fetchRecords();
            }}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="Reset Filters"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Land Records Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Survey Number</th>
                <th className="px-5 py-3.5">Owner Name</th>
                <th className="px-5 py-3.5">Village / Taluk</th>
                <th className="px-5 py-3.5">District</th>
                <th className="px-5 py-3.5">Land Area</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Verification & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-cyan-400" />
                    Querying secure SQLite registry...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-500">
                    No land records match your search query.
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr
                    key={rec.id}
                    className="hover:bg-slate-800/40 transition group"
                  >
                    <td className="px-5 py-4 font-mono font-bold text-cyan-300 whitespace-nowrap">
                      {rec.survey_number}
                    </td>
                    <td className="px-5 py-4 font-semibold text-white">
                      {rec.owner_name}
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      {rec.village}
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      {rec.district}
                    </td>
                    <td className="px-5 py-4 text-slate-300 whitespace-nowrap font-medium">
                      {rec.land_area}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={rec.status} />
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap space-x-1.5">
                      {/* Verify Button (All Roles) */}
                      <button
                        onClick={() => onVerifyRecord(rec.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold transition inline-flex items-center gap-1"
                        title="Cryptographically verify against blockchain"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Verify</span>
                      </button>

                      {/* View Details */}
                      <button
                        onClick={() => onSelectRecord(rec.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition inline-flex items-center gap-1"
                        title="View complete record & blockchain anchor"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>

                      {/* Admin Tamper Simulation shortcut */}
                      {isAdmin && (
                        <button
                          onClick={() => onSimulateTamper(rec)}
                          className="px-2 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-medium transition inline-flex items-center gap-1 text-[11px]"
                          title="Simulate database modification (Demo)"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Tamper Demo</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
