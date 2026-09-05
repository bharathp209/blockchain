import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  FileText,
  ShieldCheck,
  Blocks,
  AlertTriangle,
  History,
  ArrowLeft,
  RefreshCw,
  UserCheck,
  Download,
  Flame,
  FileCheck2,
  Calendar,
  MapPin,
  FileEdit
} from 'lucide-react';

export default function RecordDetailsPage({
  recordId,
  onBack,
  onVerifyRecord,
  onOpenExplorer,
  onSimulateTamper,
  onRestoreRecord
}) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mutation / Ownership Transfer state
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [newOwner, setNewOwner] = useState('');
  const [mutationReason, setMutationReason] = useState('Official sale deed / ownership transfer');
  const [updating, setUpdating] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await api.getLandRecordById(recordId);
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch land record details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [recordId]);

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (!newOwner.trim()) return;
    setUpdating(true);
    try {
      await api.updateLandRecord(recordId, {
        owner_name: newOwner.trim(),
        mutation_reason: mutationReason
      });
      setShowTransferModal(false);
      fetchDetails();
    } catch (err) {
      alert(err.message || 'Transfer failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
        Loading cryptographic record from SQLite & Blockchain...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center space-y-3">
        <div className="text-rose-400 font-semibold">{error || 'Record not found.'}</div>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg bg-slate-800 text-white text-xs"
        >
          ← Back to Land Records
        </button>
      </div>
    );
  }

  const record = data.record;
  const document = data.document;
  const transactions = data.transactions || [];
  const auditLogs = data.auditLogs || [];
  const isAdmin = user?.role === 'ADMIN';
  const isRegistrarOrAdmin = ['ADMIN', 'REGISTRAR'].includes(user?.role);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 transition self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Records List</span>
        </button>

        <div className="flex items-center gap-2.5">
          {/* Verify Integrity Button */}
          <button
            onClick={() => onVerifyRecord(record.id)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs tracking-wide transition shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Integrity</span>
          </button>

          {/* Transfer Ownership / Mutation (Registrar / Admin) */}
          {isRegistrarOrAdmin && (
            <button
              onClick={() => {
                setNewOwner('');
                setShowTransferModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-semibold text-xs transition flex items-center gap-1.5"
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Transfer Ownership</span>
            </button>
          )}

          {/* Admin Tamper Simulation Button */}
          {isAdmin && (
            <button
              onClick={() => onSimulateTamper(record)}
              className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-xs transition flex items-center gap-1.5"
              title="Tamper directly in SQLite to demonstrate tamper detection"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Demo Tamper Simulation</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Record Header Card */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-black text-cyan-300">
                {record.survey_number}
              </span>
              <StatusBadge status={record.status} size="lg" />
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              {record.village}, {record.district}, {record.state}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400">Total Registered Land Area</span>
            <p className="text-xl font-bold text-white">{record.land_area}</p>
          </div>
        </div>

        {/* 2-Column Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              Ownership & Registry Details
            </h3>

            <div className="p-4 rounded-xl bg-black/40 border border-slate-800 space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Owner:</span>
                <span className="font-bold text-white">{record.owner_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Registered By:</span>
                <span className="text-slate-200">{record.created_by_name || 'Sub-Registrar'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Registration Date:</span>
                <span className="text-slate-300">{new Date(record.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Last Mutation:</span>
                <span className="text-slate-300">{new Date(record.updated_at).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              Official Title Deed Document Proof
            </h3>

            <div className="p-4 rounded-xl bg-black/40 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="font-medium text-white truncate">
                    {record.document_name || 'title_deed.pdf'}
                  </span>
                </div>
                {document?.filepath && (
                  <a
                    href={`/uploads/${record.document_name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs"
                    title="Download deed"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div>
                <span className="text-[10px] text-slate-400">Document Integrity SHA-256 Hash:</span>
                <div className="font-mono text-[10px] text-cyan-300 bg-slate-900 p-1.5 rounded mt-0.5 break-all border border-slate-800">
                  {record.document_hash || 'None'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cryptographic Hash Status Section */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-2">
              <Blocks className="w-4 h-4 text-cyan-400" />
              Cryptographic Anchoring State
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300">
              SHA-256 CANONICAL
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500 text-[11px]">Anchored Blockchain Hash:</span>
              <p className="font-mono text-cyan-300 text-[11px] break-all mt-0.5">
                {record.blockchain_anchored_hash || 'No blockchain anchor'}
              </p>
            </div>

            <div className={`p-3 rounded-lg border ${
              record.is_tampered ? 'bg-rose-950/40 border-rose-500/50' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Current SQLite Record Hash:</span>
                <span className={`text-[10px] font-mono font-bold ${
                  record.is_tampered ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {record.is_tampered ? '⚠ TAMPERED' : '✓ INTACT'}
                </span>
              </div>
              <p className={`font-mono text-[11px] break-all mt-0.5 ${
                record.is_tampered ? 'text-rose-300' : 'text-emerald-300'
              }`}>
                {record.current_calculated_hash}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Blockchain Transactions Timeline for this record */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <span>Immutable Blockchain History for Survey No: {record.survey_number}</span>
          </h3>
          <button
            onClick={onOpenExplorer}
            className="text-xs text-cyan-400 hover:underline"
          >
            Open Explorer →
          </button>
        </div>

        <div className="space-y-3">
          {transactions.map((tx, idx) => (
            <div
              key={tx.id}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-cyan-300">{tx.transaction_id}</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px] font-bold">
                    {tx.transaction_type}
                  </span>
                </div>
                <div className="font-mono text-slate-400 text-[11px]">
                  Block Hash: <span className="text-slate-300">{tx.block_hash}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-slate-300 font-medium">
                  {new Date(tx.timestamp).toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Prev: {tx.previous_hash.slice(0, 16)}...
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Logs Specific to this Record */}
      {auditLogs.length > 0 && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <span>Audit Trail for this Parcel</span>
          </h3>

          <div className="divide-y divide-slate-800/80">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{log.action}</span>
                    <StatusBadge status={log.status} />
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    By {log.user_name} ({log.user_role}) • {log.details}
                  </p>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mutation / Ownership Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-cyan-500/40 bg-[#0a0f1d] p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Transfer Ownership / Land Mutation</h3>
            <p className="text-xs text-slate-400">
              Creates an <span className="text-cyan-300 font-mono">UPDATE_LAND_RECORD</span> transaction and mints a new block on the blockchain.
            </p>

            <form onSubmit={handleTransferSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Previous / Current Owner</label>
                <input
                  type="text"
                  disabled
                  value={record.owner_name}
                  className="w-full px-3 py-2 rounded bg-slate-800 text-slate-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">
                  New Transferee / Owner Name *
                </label>
                <input
                  type="text"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  required
                  placeholder="e.g. Arun Kumar"
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Reason / Deed Reference</label>
                <input
                  type="text"
                  value={mutationReason}
                  onChange={(e) => setMutationReason(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  {updating ? 'Minting Block...' : 'Authorize Mutation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
