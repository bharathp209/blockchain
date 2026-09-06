import React, { useState } from 'react';
import { api } from '../services/api';
import Floating3DBackground from '../components/Floating3DBackground';
import Hero3DVisual from '../components/Hero3DVisual';
import VerifyModal from '../components/VerifyModal';
import {
  ShieldCheck,
  Search,
  Lock,
  Blocks,
  ArrowRight,
  Activity,
  AlertTriangle,
  Fingerprint,
  FileCheck2,
  Database,
  FileText,
  Layers,
  Menu,
  X,
  ArrowRightLeft
} from 'lucide-react';

export default function LandingPage({ onGoToLogin, onSelectRecord, onNavigateToTransfers }) {
  const [searchSurvey, setSearchSurvey] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyError, setVerifyError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleQuickVerify = async (e) => {
    if (e) e.preventDefault();
    if (!searchSurvey.trim()) return;

    setVerifying(true);
    setVerifyError(null);
    setVerifyResult(null);

    try {
      const res = await api.verifyLandRecord(searchSurvey.trim().toUpperCase());
      setVerifyResult(res);
    } catch (err) {
      setVerifyError(err.message || 'No land record found with this survey number.');
    } finally {
      setVerifying(false);
    }
  };

  const handlePillClick = (survey) => {
    setSearchSurvey(survey);
    setVerifying(true);
    setVerifyError(null);
    api.verifyLandRecord(survey)
      .then(res => setVerifyResult(res))
      .catch(err => setVerifyError(err.message || 'Verification failed.'))
      .finally(() => setVerifying(false));
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100 flex flex-col relative overflow-hidden font-['Inter',sans-serif]">
      {/* 3D Floating Background */}
      <Floating3DBackground />

      {/* ================= COMPLETE MAIN NAVBAR ================= */}
      <header className="h-20 border-b border-slate-800/80 bg-[#05070d]/85 backdrop-blur-xl px-6 lg:px-12 flex items-center justify-between sticky top-0 z-50">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 font-bold text-xl shadow-[0_0_20px_rgba(0,212,255,0.2)]">
            ⛓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-wider text-xl text-white">
                LAND<span className="text-cyan-400">CHAIN</span>
              </span>
            </div>
            <p className="text-[9px] text-slate-400 tracking-[0.2em] uppercase font-semibold">
              SECURE LAND RECORDS
            </p>
          </div>
        </div>

        {/* Center Navigation Bar - Styled as Interactive Pill Buttons */}
        <nav className="hidden md:flex items-center gap-3 text-xs font-bold tracking-wide">
          <button
            onClick={() => scrollToSection('home')}
            className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 border border-slate-700/80 hover:border-cyan-400 text-slate-200 hover:text-slate-950 transition-all shadow-[0_0_12px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] flex items-center gap-1.5 active:scale-95"
          >
            <span>Home</span>
          </button>

          <button
            onClick={() => scrollToSection('security')}
            className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 border border-slate-700/80 hover:border-cyan-400 text-slate-200 hover:text-slate-950 transition-all shadow-[0_0_12px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] flex items-center gap-1.5 active:scale-95"
          >
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Security</span>
          </button>

          <button
            onClick={() => scrollToSection('how-it-works')}
            className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 border border-slate-700/80 hover:border-cyan-400 text-slate-200 hover:text-slate-950 transition-all shadow-[0_0_12px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] flex items-center gap-1.5 active:scale-95"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>How It Works</span>
          </button>

          <button
            onClick={() => scrollToSection('verify-section')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 hover:from-cyan-400 hover:to-teal-300 border border-cyan-400/60 hover:border-cyan-300 text-cyan-300 hover:text-slate-950 transition-all shadow-[0_0_18px_rgba(0,212,255,0.25)] hover:shadow-[0_0_25px_rgba(0,212,255,0.5)] flex items-center gap-1.5 active:scale-95 font-black"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verify</span>
          </button>

          <button
            onClick={onNavigateToTransfers}
            className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 border border-slate-700/80 hover:border-cyan-400 text-slate-200 hover:text-slate-950 transition-all shadow-[0_0_12px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] flex items-center gap-1.5 active:scale-95"
            title="Property Transfer & Mutation Hub (Registrar/Admin only)"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>Transfers</span>
          </button>
        </nav>

        {/* Right Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onGoToLogin}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs tracking-wide transition-all shadow-[0_0_25px_rgba(0,212,255,0.4)] hover:shadow-[0_0_35px_rgba(0,212,255,0.6)] flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <span>Login →</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu - Styled as Button Group */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 inset-x-0 z-40 bg-[#080d1a]/95 border-b border-slate-800 p-6 space-y-3 backdrop-blur-2xl animate-in slide-in-from-top-4">
          <button
            onClick={() => scrollToSection('home')}
            className="w-full text-center py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white hover:border-cyan-400 transition"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('security')}
            className="w-full text-center py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white hover:border-cyan-400 transition flex items-center justify-center gap-2"
          >
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            Security
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="w-full text-center py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white hover:border-cyan-400 transition flex items-center justify-center gap-2"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('verify-section')}
            className="w-full text-center py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-400 text-xs font-black text-cyan-300 flex items-center justify-center gap-2 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Verify Record
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onNavigateToTransfers) onNavigateToTransfers();
            }}
            className="w-full text-center py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white hover:border-cyan-400 transition flex items-center justify-center gap-2"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>Transfers</span>
          </button>
        </div>
      )}

      {/* ================= HERO SECTION ================= */}
      <section id="home" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-14 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>BLOCKCHAIN SECURED PLATFORM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.08]">
            Secure the Land. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              Secure the Future.
            </span>
          </h1>

          <p className="text-base text-slate-300 max-w-xl leading-relaxed">
            A blockchain-powered platform for secure, transparent, and verifiable land records. Eliminates forged title deeds and unauthorized ownership mutations with instant cryptographic proof.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => scrollToSection('verify-section')}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide transition shadow-[0_0_20px_rgba(0,212,255,0.3)] flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Land Record</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onGoToLogin}
              className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/40 text-white font-semibold text-xs transition flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Enter Platform</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 max-w-lg">
            <div>
              <div className="text-2xl font-extrabold text-cyan-400 font-mono">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Hash Verified</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono">24/7</div>
              <div className="text-xs text-slate-400 mt-0.5">Audit Trail</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-purple-400 font-mono">SHA-256</div>
              <div className="text-xs text-slate-400 mt-0.5">Cryptographic Security</div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Floating Visual */}
        <div className="lg:col-span-5 relative flex justify-center">
          <Hero3DVisual onExplore={onGoToLogin} />
        </div>
      </section>

      {/* ================= SECURITY SECTION ================= */}
      <section id="security" className="relative z-10 max-w-6xl mx-auto px-6 py-16 space-y-10">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            WHY LANDCHAIN
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Security built into every transaction.
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Every important action is authenticated, hashed, recorded, and independently verifiable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3.5 hover:border-cyan-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              🔐
            </div>
            <h3 className="text-sm font-bold text-white">Secure Identity</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Role-based authentication ensures that only authorized government officials can register or modify sensitive land records.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-slate-900/60 border border-cyan-500/30 shadow-[0_0_25px_rgba(0,212,255,0.1)] space-y-3.5 hover:border-cyan-500/50 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              🛡️
            </div>
            <h3 className="text-sm font-bold text-white">Tamper Detection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Centralized record modifications produce an immediate cryptographic hash mismatch, flagging unauthorized changes in real time.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3.5 hover:border-purple-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
              📜
            </div>
            <h3 className="text-sm font-bold text-white">Immutable Ledger</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every deed and ownership transfer is linked to previous block hashes, establishing permanent, mathematically unalterable history.
            </p>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section id="how-it-works" className="relative z-10 max-w-6xl mx-auto px-6 py-16 space-y-10">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            WORKFLOW
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            How LandChain Works
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            From official registration to public verification in three cryptographically secure steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="text-2xl font-black font-mono text-cyan-400">01</div>
            <h3 className="text-sm font-bold text-white">Official Registration</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The registrar enters parcel details, uploads the title deed, and generates a unique SHA-256 fingerprint.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="text-2xl font-black font-mono text-emerald-400">02</div>
            <h3 className="text-sm font-bold text-white">Blockchain Anchoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The transaction is mined into a new block, hash-linked to the previous block, and permanently locked into the ledger.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="text-2xl font-black font-mono text-purple-400">03</div>
            <h3 className="text-sm font-bold text-white">Instant Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Citizens and banks query any survey number to verify that current data strictly matches the immutable blockchain anchor.
            </p>
          </div>
        </div>
      </section>

      {/* ================= VERIFICATION SECTION ================= */}
      <section id="verify-section" className="relative z-10 max-w-3xl mx-auto px-6 py-14 w-full">
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-[0_0_40px_rgba(0,212,255,0.1)] backdrop-blur-xl space-y-5 text-center">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Verify Land Record
            </h2>
            <p className="text-xs text-slate-400">
              Enter any survey number to verify cryptographic integrity against the blockchain ledger.
            </p>
          </div>

          <form onSubmit={handleQuickVerify} className="flex flex-col sm:flex-row items-center gap-2.5 max-w-xl mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchSurvey}
                onChange={(e) => setSearchSurvey(e.target.value)}
                placeholder="Enter Survey Number (e.g. TN-ERD-1024)..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/50 text-white placeholder-slate-500 text-xs font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-400 border border-slate-700/80"
              />
            </div>
            <button
              type="submit"
              disabled={verifying}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shrink-0 shadow-[0_0_15px_rgba(0,212,255,0.3)]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{verifying ? 'Verifying...' : 'Verify'}</span>
            </button>
          </form>

          {verifyError && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-center gap-2 max-w-xl mx-auto">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{verifyError}</span>
            </div>
          )}

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px]">Quick Samples:</span>
            {['TN-ERD-1024', 'TN-ERD-1001', 'TN-ERD-1002', 'TN-ERD-1005'].map(s => (
              <button
                key={s}
                type="button"
                onClick={() => handlePillClick(s)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-cyan-500/20 text-cyan-300 font-mono text-[11px] border border-slate-700 transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="mt-auto border-t border-slate-800/80 py-6 px-6 lg:px-12 text-center text-xs text-slate-500 relative z-10 space-y-1.5">
        <p className="text-slate-400 font-medium">LANDCHAIN • Secure Blockchain Land Record Management</p>
        <p className="text-cyan-400/80 font-mono text-[11px] tracking-wider">
          © {new Date().getFullYear()} Bharath. All rights reserved.
        </p>
      </footer>

      {/* Verification Modal */}
      {verifyResult && (
        <VerifyModal
          result={verifyResult}
          onClose={() => setVerifyResult(null)}
          onOpenExplorer={onGoToLogin}
        />
      )}
    </div>
  );
}
