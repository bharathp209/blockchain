import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, X, Flame, RefreshCw } from 'lucide-react';

export default function TamperModal({ record, onClose, onSimulate, onRestore }) {
  if (!record) return null;

  const [fakeOwner, setFakeOwner] = useState('Fake Owner (Unauthorized Fraud)');
  const [fakeArea, setFakeArea] = useState(record.land_area || '10.50 Acres');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSimulate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSimulate(record.id, {
        fake_owner: fakeOwner,
        fake_area: fakeArea
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to simulate tampering');
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    setError(null);
    try {
      await onRestore(record.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to restore record');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl border border-amber-500/50 bg-[#0a0f1d] shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-amber-950/40 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-amber-300">
                  Demo Tamper Simulation
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-semibold">
                  ADMIN ONLY
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Controlled review presentation tool to demonstrate cryptographic tamper detection.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSimulate} className="p-6 space-y-5">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
            <div className="font-semibold text-slate-300">Original Verified State in Database:</div>
            <div className="grid grid-cols-2 gap-2 text-slate-400">
              <div>Survey No: <span className="font-mono text-cyan-300 font-semibold">{record.survey_number}</span></div>
              <div>Current Owner: <span className="text-white font-semibold">{record.owner_name}</span></div>
              <div>Village / Taluk: <span className="text-slate-300">{record.village}</span></div>
              <div>Registered Area: <span className="text-slate-300">{record.land_area}</span></div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
            <span className="font-bold">What happens next: </span>
            This action will modify the SQLite database row directly <span className="underline font-semibold">WITHOUT</span> creating a valid blockchain block.
            When any user verifies this record, the cryptographic SHA-256 hash recalculation will immediately detect the alteration!
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-300 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tampered Owner Name (Simulated Unauthorized Transfer)
              </label>
              <input
                type="text"
                value={fakeOwner}
                onChange={(e) => setFakeOwner(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 font-medium"
                placeholder="e.g. Fake Owner"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tampered Land Area
              </label>
              <input
                type="text"
                value={fakeArea}
                onChange={(e) => setFakeArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 font-medium"
                placeholder="e.g. 100.00 Acres"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            {record.status === 'TAMPERED' || record.status === 'TAMPERED_UNCONFIRMED' ? (
              <button
                type="button"
                onClick={handleRestore}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Restore to Blockchain Truth
              </button>
            ) : <div />}

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              >
                <Flame className="w-4 h-4 text-slate-950" />
                {loading ? 'Simulating...' : 'Execute Tamper Simulation'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
