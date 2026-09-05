import React from 'react';
import { X, CheckCircle2, ArrowRight, ShieldCheck, AlertTriangle, Key, Terminal } from 'lucide-react';

export default function DemoGuideModal({ isOpen, onClose, onSelectPersona }) {
  if (!isOpen) return null;

  const demoAccounts = [
    { role: 'REGISTRAR', email: 'registrar@landchain.com', pass: 'reg123', name: 'S. Meenakshi (Sub-Registrar)' },
    { role: 'CITIZEN', email: 'citizen@landchain.com', pass: 'citizen123', name: 'R. Karthik (Citizen / Owner)' },
    { role: 'ADMIN', email: 'admin@landchain.com', pass: 'admin123', name: 'Dr. K. Swaminathan (Zonal Admin)' },
  ];

  const steps = [
    {
      num: 1,
      role: 'Registrar',
      title: 'Login as Registrar',
      desc: 'Use registrar@landchain.com / reg123 to log in. Registrar has permissions to register records and upload title deeds.'
    },
    {
      num: 2,
      role: 'Registrar',
      title: 'Inspect Dashboard Stats',
      desc: 'Review live statistics: Total Records, Minted Blocks, Verified Count, and Recent Security Events.'
    },
    {
      num: 3,
      role: 'Registrar',
      title: 'Open Land Records',
      desc: 'Inspect existing seeded Tamil Nadu records (TN-ERD-1001 through 1010) already anchored cryptographically.'
    },
    {
      num: 4,
      role: 'Registrar',
      title: 'Register TN-ERD-1024',
      desc: 'Click "Add Land Record". Enter: Survey: TN-ERD-1024, Owner: Ravi Kumar, Village: Perundurai, District: Erode, Area: 2.50 Acres. Upload sample deed.'
    },
    {
      num: 5,
      role: 'Registrar',
      title: 'Anchor to Blockchain',
      desc: 'Click "REGISTER LAND". SHA-256 hashes generated, transaction minted, new Block added to chain, audit log recorded.'
    },
    {
      num: 6,
      role: 'Registrar',
      title: 'Inspect in Blockchain Explorer',
      desc: 'Open Blockchain Explorer. View the newest block hash-linked to previous block. Explain cryptographic immutability.'
    },
    {
      num: 7,
      role: 'Citizen',
      title: 'Switch to Citizen Persona',
      desc: 'Logout and sign in as citizen@landchain.com / citizen123. Citizen has read-only verification rights.'
    },
    {
      num: 8,
      role: 'Citizen',
      title: 'Verify TN-ERD-1024 Integrity',
      desc: 'Search TN-ERD-1024, click "Verify Record". Result displays: ✓ RECORD VERIFIED (Green shield, hash match: YES).'
    },
    {
      num: 9,
      role: 'Admin',
      title: 'Login as Admin & Simulate Tampering',
      desc: 'Sign in as admin@landchain.com / admin123. Open TN-ERD-1024, click "Simulate Tampering". Modifies SQLite directly without blockchain.'
    },
    {
      num: 10,
      role: 'Admin',
      title: 'Tamper Detection Triggered!',
      desc: 'Click "Verify Integrity". The system recalculates SHA-256 and detects the fraud! Displays: ⚠ TAMPERING DETECTED with side-by-side hash comparison.'
    },
    {
      num: 11,
      role: 'Admin',
      title: 'Inspect Audit Logs',
      desc: 'Open Audit Trail. Notice the TAMPER_DETECTED and TAMPER_SIMULATION events logged with full forensic metadata.'
    },
    {
      num: 12,
      role: 'Admin',
      title: 'Validate Blockchain Ledger',
      desc: 'Open Blockchain Explorer and click "Validate Blockchain". Shows: ✓ Blockchain integrity verified (proof that ledger remained pure).'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-3xl max-h-[90vh] rounded-2xl border border-cyan-500/40 bg-[#0a0f1d] shadow-[0_0_50px_rgba(0,212,255,0.2)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-cyan-950/40 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
              LC
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Platform Demonstration & Walkthrough Guide
              </h3>
              <p className="text-xs text-cyan-300">
                12-Step End-to-End Verification & Tamper Detection Walkthrough
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

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Persona Credentials */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              Demo Persona Credentials (Click to Quick-Switch):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {demoAccounts.map(acc => (
                <button
                  key={acc.email}
                  onClick={() => {
                    onSelectPersona(acc.email, acc.pass);
                    onClose();
                  }}
                  className="p-3 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 text-left transition group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300">{acc.role}</span>
                    <span className="text-[10px] text-cyan-400">Autofill →</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono mt-1 truncate">{acc.email}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Pass: {acc.pass}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Steps Timeline */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              12-Step Demonstration Sequence
            </h4>
            <div className="space-y-3">
              {steps.map(s => (
                <div key={s.num} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {s.num}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{s.title}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 font-mono">
                        {s.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">LANDCHAIN • Cryptographic Land Record Protocol</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition"
          >
            Ready for Demo
          </button>
        </div>
      </div>
    </div>
  );
}
