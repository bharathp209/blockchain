import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function LoginPage({ onBackToLanding }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@landchain.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const demoAccounts = [
    {
      role: 'ADMIN',
      name: 'Dr. Swaminathan',
      email: 'admin@landchain.com',
      pass: 'admin123',
      color: 'purple',
      badge: 'Full Root'
    },
    {
      role: 'REGISTRAR',
      name: 'S. Meenakshi',
      email: 'registrar@landchain.com',
      pass: 'reg123',
      color: 'cyan',
      badge: 'Officer'
    },
    {
      role: 'CITIZEN',
      name: 'R. Karthik',
      email: 'citizen@landchain.com',
      pass: 'citizen123',
      color: 'emerald',
      badge: 'Landowner'
    }
  ];

  const handleRoleSelect = (acc) => {
    setSelectedRole(acc.role);
    setEmail(acc.email);
    setPassword(acc.pass);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 py-10 relative overflow-hidden font-['Inter',sans-serif] selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background 3D Floor Grid & High-Tech Ambient Glows */}
      <div className="cyber-grid-perspective fixed inset-0 pointer-events-none opacity-50" />
      <div className="glow-spot-blue -top-32 left-1/4 opacity-40 fixed pointer-events-none" />
      <div className="glow-spot-cyan top-1/2 -right-32 opacity-35 fixed pointer-events-none" />
      <div className="glow-spot-emerald -bottom-32 left-1/3 opacity-30 fixed pointer-events-none" />

      {/* Floating Back Navigation Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onBackToLanding}
          className="px-4 py-2 rounded-xl bg-slate-900/85 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400/60 text-xs font-semibold text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-2 backdrop-blur-xl shadow-lg shadow-black/40 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Public Gateway</span>
        </button>
      </div>

      {/* Centered Single High-Tech Login Card */}
      <div className="w-full max-w-[480px] relative z-10 pt-4">
        {/* Glowing Gradient Outer Border */}
        <div className="relative p-[1.5px] rounded-3xl bg-gradient-to-b from-cyan-500/50 via-blue-600/30 to-purple-600/50 shadow-[0_0_70px_rgba(0,212,255,0.22),0_25px_60px_rgba(0,0,0,0.8)]">
          
          {/* Frosted Glass Inner Container */}
          <div className="bg-[#070b15]/95 backdrop-blur-3xl rounded-3xl p-7 sm:p-9 space-y-6 relative overflow-hidden">
            
            {/* Top Cyan Light Streak */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-20 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

            {/* Brand Header */}
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 font-black text-2xl mx-auto shadow-[0_0_30px_rgba(0,212,255,0.35)]">
                ⛓
              </div>
              
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  LAND<span className="text-cyan-400">CHAIN</span> PORTAL
                </h1>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  Decentralized Land Records & Access Management
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-semibold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00d4ff]" />
                <span>CRYPTOGRAPHIC ACCESS CONTROL</span>
              </div>
            </div>

            {/* Persona Quick Switcher Chips */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Select Demo Account:</span>
                <span className="text-[10px] text-cyan-400 font-mono font-normal">Instant Pre-fill</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {demoAccounts.map((acc) => {
                  const isSelected = selectedRole === acc.role;
                  return (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => handleRoleSelect(acc)}
                      className={`p-2.5 rounded-xl text-left transition-all relative border ${
                        isSelected
                          ? acc.role === 'ADMIN'
                            ? 'bg-purple-950/60 border-purple-500/80 shadow-[0_0_18px_rgba(168,85,247,0.35)] ring-1 ring-purple-400'
                            : acc.role === 'REGISTRAR'
                            ? 'bg-cyan-950/60 border-cyan-500/80 shadow-[0_0_18px_rgba(0,212,255,0.35)] ring-1 ring-cyan-400'
                            : 'bg-emerald-950/60 border-emerald-500/80 shadow-[0_0_18px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400'
                          : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-black tracking-wider ${
                          acc.role === 'ADMIN' ? 'text-purple-300' : acc.role === 'REGISTRAR' ? 'text-cyan-300' : 'text-emerald-300'
                        }`}>
                          {acc.role}
                        </span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00d4ff]" />
                        )}
                      </div>
                      <div className="text-[11px] font-bold text-white truncate">{acc.name}</div>
                      <div className="text-[9px] text-slate-400 font-mono mt-0.5 truncate">{acc.pass}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2 animate-shake">
                <span className="font-bold">Error:</span>
                <span>{error}</span>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@landchain.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-slate-700/90 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Security Passcode
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">
                    Role: <strong className="text-cyan-300">{selectedRole}</strong>
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-black/60 border border-slate-700/90 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Glowing High-Tech Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs tracking-wider uppercase transition shadow-[0_0_25px_rgba(0,212,255,0.4)] hover:shadow-[0_0_35px_rgba(0,212,255,0.6)] flex items-center justify-center gap-2 pt-3.5 hover:scale-[1.01] active:scale-[0.99]"
              >
                {loading ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Authenticate & Enter Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Security Footer */}
            <div className="pt-4 border-t border-slate-800/80 text-center text-[10px] text-slate-400 font-mono flex flex-col items-center justify-center gap-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>SHA-256 Ledger Consensus • 256-Bit SSL Secured</span>
              </div>
              <span className="text-cyan-400/70 text-[9px] tracking-wider">© Bharath</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
