import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Blocks,
  CheckCircle2,
  AlertTriangle,
  Link,
  Search,
  RefreshCw,
  Hash,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileCode
} from 'lucide-react';

export default function BlockchainExplorerPage() {
  const [chain, setChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  const fetchBlockchain = async () => {
    setLoading(true);
    try {
      const res = await api.getBlockchain();
      if (res.success) {
        setChain(res.chain || []);
      }
    } catch (err) {
      console.error('Failed to load blockchain:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockchain();
  }, []);

  const handleValidateChain = async () => {
    setValidating(true);
    try {
      const res = await api.validateBlockchain();
      setValidationResult(res);
    } catch (err) {
      setValidationResult({
        valid: false,
        error: err.message || 'Validation error occurred'
      });
    } finally {
      setValidating(false);
    }
  };

  const filteredChain = chain.filter(b => {
    if (!searchFilter.trim()) return true;
    const term = searchFilter.toLowerCase();
    const strIndex = String(b.index);
    const hash = b.hash.toLowerCase();
    const tx = JSON.stringify(b.transaction || '').toLowerCase();
    return strIndex.includes(term) || hash.includes(term) || tx.includes(term);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Blocks className="w-5 h-5 text-cyan-400" />
            <span>Cryptographic Blockchain Explorer</span>
          </h1>
          <p className="text-xs text-slate-400">
            Immutable hash-linked blocks anchored via SHA-256 cryptographic proofs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBlockchain}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="Refresh blocks"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleValidateChain}
            disabled={validating}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide transition shadow-[0_0_15px_rgba(0,212,255,0.3)] flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{validating ? 'Verifying Hashes...' : 'Validate Blockchain'}</span>
          </button>
        </div>
      </div>

      {/* Validation Result Banner */}
      {validationResult && (
        <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs animate-in fade-in duration-200 ${
          validationResult.valid
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
            : 'bg-rose-950/40 border-rose-500/50 text-rose-200 shadow-[0_0_25px_rgba(244,63,94,0.2)]'
        }`}>
          {validationResult.valid ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <div className="font-extrabold text-sm">
              {validationResult.valid
                ? '✓ Blockchain integrity verified'
                : '⚠ Blockchain integrity compromised'}
            </div>
            <p className="text-slate-300">
              {validationResult.message || validationResult.error}
            </p>
            {validationResult.valid && (
              <div className="text-[11px] text-emerald-400/80 font-mono">
                Total blocks verified: {validationResult.blockCount} • Cryptographic links: 100% Intact
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search / Filter Block */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-500 ml-2" />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Filter by Block #, Block Hash, Transaction ID, or Survey Number..."
          className="w-full bg-transparent text-white text-xs placeholder-slate-500 focus:outline-none"
        />
        {searchFilter && (
          <button
            onClick={() => setSearchFilter('')}
            className="text-xs text-slate-400 hover:text-white px-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Chain Stream */}
      {loading ? (
        <div className="p-16 text-center text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
          Loading cryptographic chain from ledger...
        </div>
      ) : (
        <div className="space-y-4 relative">
          {filteredChain.map((block, idx) => {
            const isGenesis = block.index === 0;
            const isExpanded = expandedIndex === block.index;
            const txType = block.transaction?.type || block.transaction?.transaction_type || 'UNKNOWN';

            return (
              <div key={block.index} className="space-y-3">
                {/* Connecting Cryptographic Hash Link (arrow between blocks) */}
                {idx > 0 && (
                  <div className="flex flex-col items-center justify-center my-1 text-cyan-500/60">
                    <div className="w-0.5 h-4 bg-gradient-to-b from-cyan-500/60 to-cyan-500/20" />
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 border border-cyan-900/60 text-[10px] font-mono text-cyan-400">
                      <Link className="w-2.5 h-2.5" />
                      <span>prev_hash linked</span>
                      <span>↓</span>
                    </div>
                    <div className="w-0.5 h-4 bg-gradient-to-b from-cyan-500/20 to-cyan-500/60" />
                  </div>
                )}

                {/* Block Card */}
                <div className={`p-5 rounded-2xl border transition-all ${
                  isGenesis
                    ? 'bg-gradient-to-r from-purple-950/20 to-slate-900/80 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.1)]'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                        isGenesis
                          ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
                          : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                      }`}>
                        #{block.index}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {isGenesis ? 'Genesis Block #0' : `Block #${block.index}`}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                            isGenesis 
                              ? 'bg-purple-950 text-purple-300 border border-purple-800' 
                              : txType === 'ADD_LAND_RECORD'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            {txType}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {new Date(block.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <button
                        onClick={() => setExpandedIndex(isExpanded ? null : block.index)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition"
                      >
                        <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{isExpanded ? 'Collapse Block' : 'Inspect Block Payload'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Hashes Summary Grid */}
                  <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">
                        Previous Block Hash
                      </span>
                      <p className="font-mono text-[11px] text-slate-400 break-all">
                        {block.previousHash}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/40 border border-cyan-900/40">
                      <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider block mb-0.5">
                        Current Block SHA-256 Hash
                      </span>
                      <p className="font-mono text-[11px] text-cyan-300 font-semibold break-all">
                        {block.hash}
                      </p>
                    </div>
                  </div>

                  {/* Expandable Detailed Payload */}
                  {isExpanded && (
                    <div className="mt-4 p-4 rounded-xl bg-black/60 border border-slate-800 space-y-3 animate-in fade-in duration-200">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Block Transaction Payload:
                      </div>

                      <pre className="text-[11px] font-mono text-cyan-200 bg-slate-950 p-3 rounded-lg overflow-x-auto border border-slate-800/80">
                        {JSON.stringify(block.transaction, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
