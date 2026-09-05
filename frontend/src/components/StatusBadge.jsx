import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, XCircle, Clock, ShieldAlert } from 'lucide-react';

export default function StatusBadge({ status, size = 'sm' }) {
  const norm = (status || '').toUpperCase();

  const sizeClasses = size === 'lg' 
    ? 'px-3 py-1.5 text-sm font-semibold' 
    : 'px-2.5 py-0.5 text-xs font-medium';

  if (norm === 'VERIFIED' || norm === 'REGISTERED' || norm === 'SUCCESS' || norm === 'ACTIVE') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <CheckCircle className="w-3.5 h-3.5" />
        {norm}
      </span>
    );
  }

  if (norm === 'TAMPERED' || norm === 'TAMPERED_UNCONFIRMED' || norm === 'TAMPER_DETECTED') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)] ${sizeClasses}`}>
        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
        TAMPERED
      </span>
    );
  }

  if (norm === 'ACCESS_DENIED' || norm === 'FAILED' || norm === 'DENIED') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 ${sizeClasses}`}>
        <XCircle className="w-3.5 h-3.5" />
        {norm === 'ACCESS_DENIED' ? 'ACCESS DENIED' : norm}
      </span>
    );
  }

  if (norm === 'PENDING') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 ${sizeClasses}`}>
        <Clock className="w-3.5 h-3.5" />
        PENDING
      </span>
    );
  }

  // User Roles
  if (norm === 'ADMIN') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold ${sizeClasses}`}>
        <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
        ADMIN
      </span>
    );
  }

  if (norm === 'REGISTRAR') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/30 font-semibold ${sizeClasses}`}>
        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
        REGISTRAR
      </span>
    );
  }

  if (norm === 'CITIZEN') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-md bg-slate-500/15 text-slate-300 border border-slate-600/30 font-semibold ${sizeClasses}`}>
        CITIZEN
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full bg-slate-700/40 text-slate-300 border border-slate-600/30 ${sizeClasses}`}>
      {norm}
    </span>
  );
}
