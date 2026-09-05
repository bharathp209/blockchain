import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  X,
  CheckCircle2,
  XCircle,
  Hash,
  Database,
  Blocks,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function VerifyModal({ result, record, onClose, onOpenExplorer }) {
  if (!result) return null;

  const isVerified = result.verified;
  const originalHash = result.hashes?.original_hash || '—';
  const currentHash = result.hashes?.current_hash || '—';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-2xl rounded-2xl border bg-[#0a0f1d] shadow-2xl overflow-hidden transition-all duration-300 ${
          isVerified 
            ? 'border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.25)]' 
            : 'border-rose-500/60 shadow-[0_0_60px_rgba(244,63,94,0.35)]'
        }`}
      >
        {/* Header Banner */}
        <div 
          className={`px-6 py-5 flex items-center justify-between border-b ${
            isVerified 
              ? 'bg-emerald-950/40 border-emerald-500/30' 
              : 'bg-rose-950/50 border-rose-500/40'
          }`}
        >
          <div className="flex items-center gap-3">
            {isVerified ? (
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-7 h-7 animate-pulse" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-7 h-7 animate-bounce" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-xl font-extrabold tracking-tight ${isVerified ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {isVerified ? 'RECORD VERIFIED ✓' : 'TAMPERING DETECTED ⚠'}
                </h3>
                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                  isVerified ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/25 text-rose-200 border border-rose-500/50 animate-pulse'
                }`}>
                  {isVerified ? 'INTEGRITY CONFIRMED' : 'SECURITY ALERT'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {isVerified 
                  ? 'Land record integrity confirmed against immutable blockchain ledger.' 
                  : 'Land record data has been modified without authorization! Cryptographic mismatch.'}
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

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Key Verification Certificate Grid */}
          <div className={`p-4 rounded-xl border ${
            isVerified ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-rose-950/20 border-rose-500/30'
          }`}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Survey Number</span>
                <p className="text-sm font-bold text-white font-mono mt-0.5">{result.record?.survey_number}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Current Owner</span>
                <p className="text-sm font-bold text-white mt-0.5">{result.record?.owner_name}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Hash Match</span>
                <p className={`text-sm font-extrabold mt-0.5 flex items-center gap-1.5 ${
                  isVerified ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {isVerified ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {isVerified ? 'YES' : 'NO (MISMATCH)'}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Blockchain Reference</span>
                <p className="text-sm font-bold text-cyan-400 mt-0.5 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  VALID
                </p>
              </div>
            </div>
          </div>

          {/* Cryptographic Hashes Comparison */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Hash className="w-4 h-4 text-cyan-400" />
              Cryptographic Hash Comparison (SHA-256)
            </h4>

            <div className="space-y-2">
              {/* Original Blockchain Hash */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                    <Blocks className="w-3.5 h-3.5 text-cyan-400" />
                    Original Blockchain Anchored Hash:
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">
                    IMMUTABLE LEDGER
                  </span>
                </div>
                <div className="text-xs font-mono break-all text-cyan-300 bg-black/40 p-2 rounded border border-cyan-900/40">
                  {originalHash}
                </div>
              </div>

              {/* Current Computed Hash */}
              <div className={`p-3 rounded-lg border ${
                isVerified 
                  ? 'bg-slate-900 border-slate-800' 
                  : 'bg-rose-950/30 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
              }`}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                    <Database className="w-3.5 h-3.5 text-slate-400" />
                    Current Computed Hash (from SQLite database):
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    isVerified ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {isVerified ? 'IDENTICAL' : 'ALTERED'}
                  </span>
                </div>
                <div className={`text-xs font-mono break-all p-2 rounded border ${
                  isVerified 
                    ? 'text-emerald-300 bg-black/40 border-emerald-900/40' 
                    : 'text-rose-300 bg-rose-950/40 border-rose-500/60 font-semibold'
                }`}>
                  {currentHash}
                </div>
              </div>
            </div>
          </div>

          {/* Blockchain Anchor Reference */}
          {result.blockchain_reference && (
            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Blockchain Block Anchor Proof
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                <div>
                  <span className="text-slate-500">Transaction ID: </span>
                  <span className="font-mono text-cyan-300 font-semibold">{result.blockchain_reference.transaction_id}</span>
                </div>
                <div>
                  <span className="text-slate-500">Anchored Timestamp: </span>
                  <span>{new Date(result.blockchain_reference.anchored_at).toLocaleString()}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-500">Block Hash: </span>
                <span className="font-mono text-slate-400 text-[11px] break-all">{result.blockchain_reference.block_hash}</span>
              </div>
            </div>
          )}

          {/* Tamper Warning Message Box if Tampered */}
          {!isVerified && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-rose-300">
                <ShieldAlert className="w-4 h-4" />
                CRITICAL SECURITY EVENT RECORDED IN AUDIT LOG
              </div>
              <p className="text-slate-300">
                The centralized database row does not match the immutable hash stored on the blockchain.
                This tamper event has been permanently cataloged in the system audit trail with timestamp and forensic details.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              if (onOpenExplorer) onOpenExplorer();
            }}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition"
          >
            <Blocks className="w-4 h-4" />
            <span>Inspect in Blockchain Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition"
          >
            Close Verification Window
          </button>
        </div>
      </div>
    </div>
  );
}
