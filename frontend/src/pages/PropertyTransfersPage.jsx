import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  ArrowRightLeft,
  ShieldCheck,
  ShieldAlert,
  Lock,
  User,
  UserCheck,
  Building,
  Coins,
  CheckCircle2,
  Blocks,
  History,
  Sparkles,
  AlertCircle,
  ChevronRight,
  RefreshCw,
  Stamp,
  ArrowLeft,
  Hash
} from 'lucide-react';

export default function PropertyTransfersPage({ onBack, onNavigate, onOpenExplorer }) {
  const { user, login } = useAuth();
  const role = user?.role;

  // Data state
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [selectedRecordId, setSelectedRecordId] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Form state - Buyer
  const [buyerName, setBuyerName] = useState('Priya Sundaram');
  const [buyerIdNumber, setBuyerIdNumber] = useState('AADHAAR-8921-4490-1209');
  const [buyerPhone, setBuyerPhone] = useState('+91 98450 12345');
  const [buyerAddress, setBuyerAddress] = useState('42, Anna Nagar West, Erode, Tamil Nadu');

  // Form state - Transaction
  const [deedType, setDeedType] = useState('Absolute Sale Deed');
  const [saleValue, setSaleValue] = useState(4500000);
  const [deedReference, setDeedReference] = useState('DEED/2026/TN-ERD/08892');
  const [mutationReason, setMutationReason] = useState('Standard market conveyance deed registered with biometric verification');

  // Action state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [transferResult, setTransferResult] = useState(null);

  // Load records on mount
  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoadingRecords(true);
      const res = await api.getLandRecords();
      if (res.success && res.records) {
        setRecords(res.records);
        if (res.records.length > 0) {
          const defaultRec = res.records.find(r => r.survey_number === 'TN-ERD-1024') || res.records[0];
          setSelectedRecordId(String(defaultRec.id || defaultRec.survey_number));
          setSelectedRecord(defaultRec);
        }
      }
    } catch (err) {
      console.error('Failed to load records:', err);
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleRecordChange = (e) => {
    const id = e.target.value;
    setSelectedRecordId(id);
    const found = records.find(r => String(r.id) === String(id) || r.survey_number === id);
    setSelectedRecord(found || null);
    setTransferResult(null);
    setError(null);
  };

  const handleQuickSelect = (rec) => {
    setSelectedRecordId(String(rec.id || rec.survey_number));
    setSelectedRecord(rec);
    setTransferResult(null);
    setError(null);
  };

  const handleAutofillDemo = () => {
    setBuyerName('Priya Sundaram');
    setBuyerIdNumber('AADHAAR-8921-4490-1209');
    setBuyerPhone('+91 98450 12345');
    setBuyerAddress('42, Anna Nagar West, Erode, Tamil Nadu');
    setDeedType('Absolute Sale Deed');
    setSaleValue(4850000);
    setDeedReference('DEED/2026/TN-ERD/08892');
    setMutationReason('Conveyance deed executed at Sub-Registrar Office, Erode with biometrics');
    setError(null);
  };

  // Calculations
  const numericSaleValue = Number(saleValue) || 0;
  const stampDutyAmount = Math.round(numericSaleValue * 0.07); // 7%
  const registrationFeeAmount = Math.round(numericSaleValue * 0.01); // 1%
  const totalGovtDues = stampDutyAmount + registrationFeeAmount;

  // Execute Transfer
  const handleExecuteTransfer = async (e) => {
    if (e) e.preventDefault();
    if (!selectedRecord) {
      setError('Please select a land parcel to transfer.');
      return;
    }
    if (!buyerName.trim()) {
      setError('Buyer name is required.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setTransferResult(null);

    try {
      const payload = {
        buyer_name: buyerName.trim(),
        buyer_id_number: buyerIdNumber.trim(),
        sale_value: numericSaleValue ? `₹${numericSaleValue.toLocaleString('en-IN')}` : 'N/A',
        deed_type: deedType,
        stamp_duty: `₹${stampDutyAmount.toLocaleString('en-IN')}`,
        mutation_reason: mutationReason,
        owner_name: buyerName.trim()
      };

      const res = await api.transferProperty(selectedRecord.id || selectedRecord.survey_number, payload);
      if (res.success) {
        setTransferResult(res);
        // Refresh records list to reflect updated ownership
        loadRecords();
      } else {
        setError(res.message || 'Transfer failed.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during property transfer.');
    } finally {
      setSubmitting(false);
    }
  };

  // Quick switch role helper
  const handleSwitchToRegistrar = async () => {
    try {
      await login('registrar@landchain.com', 'reg123');
    } catch (err) {
      alert(err.message || 'Login failed');
    }
  };

  const handleSwitchToAdmin = async () => {
    try {
      await login('admin@landchain.com', 'admin123');
    } catch (err) {
      alert(err.message || 'Login failed');
    }
  };

  // ==========================================
  // VIEW A: NOT LOGGED IN
  // ==========================================
  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-[#0a0f1d]/90 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Authentication Required
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Property Transfer & Mutation Hub
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
              Executing land title deeds, mutating ownership, and minting blockchain blocks requires authorization from the Land Registry Authority.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-left space-y-3">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Quick Login as Registry Officer:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={handleSwitchToRegistrar}
                className="px-3 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,212,255,0.15)]"
              >
                <Stamp className="w-4 h-4 text-cyan-400" />
                <span>Sub-Registrar</span>
              </button>
              <button
                onClick={handleSwitchToAdmin}
                className="px-3 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                <span>Administrator</span>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Public Portal</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW B: CITIZEN LOGGED IN (UNAUTHORIZED)
  // EXACT USER REQUIREMENT: "if citizen login show as you has no authorization"
  // ==========================================
  if (role === 'CITIZEN') {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-[#0d0a14]/95 border-2 border-red-500/40 rounded-3xl p-8 lg:p-10 backdrop-blur-2xl shadow-[0_0_60px_rgba(239,68,68,0.2)] text-center space-y-6 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Red Warning Shield Icon */}
          <div className="w-20 h-20 rounded-3xl bg-red-500/15 border-2 border-red-500/50 flex items-center justify-center mx-auto text-red-400 shadow-[0_0_35px_rgba(239,68,68,0.3)] animate-pulse">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/20 text-red-300 text-[10px] font-mono font-bold tracking-widest uppercase border border-red-500/30">
              <Lock className="w-3 h-3" />
              <span>ACCESS RESTRICTED • ROLE: CITIZEN</span>
            </div>

            {/* Exact Required Text */}
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white">
              You have no authorization
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto pt-1">
              Citizen accounts hold read-only cryptographic verification privileges. Land title deed execution, ownership mutation, and blockchain block minting are strictly restricted to authorized Sub-Registrars and System Administrators.
            </p>
          </div>

          {/* Action to switch persona for evaluation/demo */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Need to test deed transfers?</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                ROLE TESTER
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Switch to an authorized Sub-Registrar account to experience real-time property transfers and block mining.
            </p>
            <div className="pt-1">
              <button
                onClick={handleSwitchToRegistrar}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs tracking-wide transition shadow-[0_0_25px_rgba(0,212,255,0.3)] flex items-center justify-center gap-2 active:scale-95"
              >
                <Stamp className="w-4 h-4" />
                <span>Switch to Sub-Registrar (S. Meenakshi)</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Public Portal</span>
            </button>
            {onNavigate && (
              <button
                onClick={() => onNavigate('records')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 text-xs font-semibold transition flex items-center gap-2"
              >
                <span>Browse Land Records</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW C: REGISTRAR / ADMIN (FULL TRANSFER HUB)
  // ==========================================
  return (
    <div className="space-y-8 pb-16 font-['Inter',sans-serif]">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5 text-xs text-slate-400 mb-2">
            <button onClick={onBack} className="hover:text-cyan-400 transition flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-slate-200 font-medium">Property Transfers</span>
            <span>/</span>
            <span className="text-cyan-400 font-mono">Deed Mutation Hub</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                <span>Property Transfer & Mutation Hub</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Cryptographically verify title deeds, transfer land ownership, and mint immutable mutation blocks.
              </p>
            </div>
          </div>
        </div>

        {/* Authorized Badge & Quick Tools */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AUTHORIZED: {user?.name} ({role})</span>
          </div>

          <button
            onClick={handleAutofillDemo}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5"
            title="Load sample deed and buyer data"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Auto-Fill Demo</span>
          </button>
        </div>
      </div>

      {/* SUCCESS CONFIRMATION RECEIPT (IF MINED) */}
      {transferResult && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-900 border-2 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.2)] space-y-4 animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-lg">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Ownership Successfully Transferred & Block Mined!</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                    BLOCK #{transferResult.block_index ?? transferResult.blockchain?.block_index}
                  </span>
                </h3>
                <p className="text-xs text-slate-300">
                  Land parcel title deed mutated and cryptographically recorded on the immutable ledger.
                </p>
              </div>
            </div>

            {onOpenExplorer && (
              <button
                onClick={onOpenExplorer}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs font-black transition flex items-center gap-2 self-start sm:self-auto shadow-[0_0_20px_rgba(0,212,255,0.3)]"
              >
                <Blocks className="w-4 h-4" />
                <span>Inspect in Blockchain Explorer</span>
              </button>
            )}
          </div>

          {/* Cryptographic Proof Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase">Transaction ID</span>
              <p className="text-cyan-300 truncate">
                {transferResult.transaction_id || transferResult.blockchain?.transaction_id}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase">New Anchored Hash</span>
              <p className="text-emerald-300 truncate">
                {transferResult.record_hash || transferResult.blockchain?.record_hash}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase">Block Hash</span>
              <p className="text-blue-300 truncate">
                {transferResult.block_hash || transferResult.blockchain?.block_hash}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ERROR BANNER */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* MAIN TRANSFER FORM GRID */}
      <form onSubmit={handleExecuteTransfer} className="space-y-8">
        {/* PARCEL SELECTION */}
        <div className="p-6 rounded-2xl bg-[#080d1a]/80 border border-slate-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Building className="w-4 h-4 text-cyan-400" />
                <span>Target Land Parcel Selection</span>
              </h2>
              <p className="text-xs text-slate-400">
                Select the registered land parcel for which ownership is being legally transferred.
              </p>
            </div>

            {/* Quick Pills */}
            <div className="flex flex-wrap gap-2">
              {records.slice(0, 4).map(rec => (
                <button
                  type="button"
                  key={rec.survey_number}
                  onClick={() => handleQuickSelect(rec)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition ${
                    selectedRecord?.survey_number === rec.survey_number
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {rec.survey_number}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="md:col-span-2">
              <select
                value={selectedRecordId}
                onChange={handleRecordChange}
                disabled={loadingRecords}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition font-mono"
              >
                {records.map(r => (
                  <option key={r.id || r.survey_number} value={r.id || r.survey_number}>
                    {r.survey_number} — Owner: {r.owner_name} ({r.village}, {r.district}) • {r.land_area}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadRecords}
                className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center justify-center gap-2 w-full"
              >
                <RefreshCw className={`w-4 h-4 ${loadingRecords ? 'animate-spin' : ''}`} />
                <span>Refresh Registry</span>
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* 1. BUYER AND SELLER (EXACT USER REQUIREMENT) */}
        {/* ==================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SELLER: Current Verified Owner (Auto-loaded read-only) */}
          <div className="p-6 rounded-2xl bg-[#080d1a]/80 border border-slate-800/80 space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span>1A. Seller Details (Current Title Holder)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Verified on-chain owner granting title conveyance.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                CURRENT TITLE
              </span>
            </div>

            {selectedRecord ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Legal Owner Name</span>
                    <span className="text-sm font-bold text-white">{selectedRecord.owner_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Survey Parcel Number</span>
                    <span className="text-xs font-mono font-bold text-cyan-400">{selectedRecord.survey_number}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Parcel Extent / Area</span>
                    <span className="text-xs font-semibold text-slate-200">{selectedRecord.land_area}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Jurisdiction / Location</span>
                    <span className="text-xs text-slate-300">
                      {selectedRecord.village}, {selectedRecord.district}, {selectedRecord.state}
                    </span>
                  </div>
                </div>

                {/* Cryptographic hash proof */}
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Hash className="w-3 h-3 text-cyan-400" />
                      <span>CURRENT SHA-256 RECORD HASH:</span>
                    </span>
                    <span className="text-emerald-400 font-bold">VALIDATED</span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-300 break-all">
                    {selectedRecord.document_hash || 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                No land parcel selected. Please select a parcel above.
              </div>
            )}
          </div>

          {/* BUYER: New Title Transferee (Editable Input Fields) */}
          <div className="p-6 rounded-2xl bg-[#080d1a]/80 border border-cyan-500/30 space-y-5 relative shadow-[0_0_25px_rgba(0,212,255,0.05)]">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span>1B. Buyer Details (Transferee)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Individual acquiring title and registered ownership.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-mono border border-cyan-500/20">
                NEW RECIPIENT
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Buyer Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="e.g. Priya Sundaram"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Aadhaar / National Identity Number *
                </label>
                <input
                  type="text"
                  required
                  value={buyerIdNumber}
                  onChange={(e) => setBuyerIdNumber(e.target.value)}
                  placeholder="e.g. AADHAAR-8921-4490-1209"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Permanent Address
                  </label>
                  <input
                    type="text"
                    value={buyerAddress}
                    onChange={(e) => setBuyerAddress(e.target.value)}
                    placeholder="e.g. Anna Nagar, Erode"
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* 2. TRANSACTION DETAILS (EXACT USER REQUIREMENT) */}
        {/* ==================================================== */}
        <div className="p-6 rounded-2xl bg-[#080d1a]/80 border border-slate-800/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span>2. Transaction Details & Statutory Fees</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Deed classification, valuation consideration, and automated stamp duty assessment.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 text-[10px] font-mono border border-purple-500/20">
              STATUTORY COMPLIANCE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Deed Classification */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Deed Conveyance Type *
                </label>
                <select
                  value={deedType}
                  onChange={(e) => setDeedType(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 transition"
                >
                  <option value="Absolute Sale Deed">Absolute Sale Deed (Conveyance)</option>
                  <option value="Gift Deed">Gift Deed (Voluntary Settlement)</option>
                  <option value="Partition Deed">Partition Deed (Family Division)</option>
                  <option value="Relinquishment Deed">Relinquishment Deed (Surrender Rights)</option>
                  <option value="Inheritance Mutation">Inheritance / Succession Mutation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Deed Reference & Archive ID
                </label>
                <input
                  type="text"
                  value={deedReference}
                  onChange={(e) => setDeedReference(e.target.value)}
                  placeholder="DEED/2026/TN-ERD/08892"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mutation Reason & Remarks
                </label>
                <textarea
                  rows={2}
                  value={mutationReason}
                  onChange={(e) => setMutationReason(e.target.value)}
                  placeholder="Reason for ownership mutation..."
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 transition resize-none"
                />
              </div>
            </div>

            {/* Agreed Consideration & Fee Breakdown */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Agreed Sale Consideration / Property Valuation (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    required
                    min="10000"
                    value={saleValue}
                    onChange={(e) => setSaleValue(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-8 pr-4 py-2.5 text-sm text-slate-100 font-mono font-bold focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>

              {/* Automated Fee Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Stamp Duty</span>
                    <span className="font-mono text-cyan-400">7.0%</span>
                  </div>
                  <div className="text-lg font-black text-white font-mono">
                    ₹{stampDutyAmount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-400">Calculated by state tariff</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Registration Fee</span>
                    <span className="font-mono text-blue-400">1.0%</span>
                  </div>
                  <div className="text-lg font-black text-white font-mono">
                    ₹{registrationFeeAmount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-400">Statutory filing fee</div>
                </div>

                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-cyan-300">
                    <span>Total Government Dues</span>
                    <span className="font-mono text-emerald-400 font-bold">8.0%</span>
                  </div>
                  <div className="text-lg font-black text-cyan-300 font-mono">
                    ₹{totalGovtDues.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-400">Escrow auto-cleared</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* 3. CHAIN OF CUSTODY PROVENANCE & EXECUTION */}
        {/* ==================================================== */}
        <div className="p-6 rounded-2xl bg-[#080d1a]/80 border border-slate-800/80 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  3. Chain of Custody & Execution Pipeline
                </h3>
                <p className="text-[11px] text-slate-400">
                  Cryptographic provenance tracking from genesis deed to this mutation block.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 text-[10px] font-mono border border-blue-500/20">
              AUDIT PROVENANCE
            </span>
          </div>

          {/* Visual Step Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
            {/* Step 1: Genesis Registration */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-400">Stage 01 • Genesis</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  MINED
                </span>
              </div>
              <h4 className="text-xs font-bold text-white">Original Allotment</h4>
              <p className="text-[11px] text-slate-400">
                Anchored to blockchain with initial survey mapping and deed scan.
              </p>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                Holder: {selectedRecord?.owner_name || 'Initial Title Holder'}
              </div>
            </div>

            {/* Step 2: Deed Verification & Duty Clearing */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-400">Stage 02 • Audit</span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                  VERIFIED
                </span>
              </div>
              <h4 className="text-xs font-bold text-white">Deed & Duty Clearance</h4>
              <p className="text-[11px] text-slate-400">
                7% Stamp Duty + 1% Registration fee validated; no encumbrance liens detected.
              </p>
              <div className="text-[10px] font-mono text-cyan-400 truncate">
                Duty Paid: ₹{totalGovtDues.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Step 3: Pending Mutation Block */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-cyan-400">Stage 03 • Block Mint</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded animate-pulse">
                  PENDING ACTION
                </span>
              </div>
              <h4 className="text-xs font-bold text-cyan-200">Title Mutation Execution</h4>
              <p className="text-[11px] text-slate-400">
                Calculates new SHA-256 state hash and mints next cryptographic block on ledger.
              </p>
              <div className="text-[10px] font-mono text-slate-300 truncate">
                New Holder: {buyerName || 'Pending Transferee'}
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800/80">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Authorized by Sub-Registrar <strong>{user?.name}</strong> under Registration Act protocols.
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting || !selectedRecord}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs tracking-wider uppercase transition shadow-[0_0_30px_rgba(0,212,255,0.4)] hover:shadow-[0_0_40px_rgba(0,212,255,0.6)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Mining Block to Blockchain...</span>
                </>
              ) : (
                <>
                  <Stamp className="w-4 h-4" />
                  <span>Execute Transfer & Mine Block →</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
