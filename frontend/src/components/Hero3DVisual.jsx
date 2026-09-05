import React from 'react';
import { ShieldCheck, CheckCircle2, Blocks, Hash, Link as LinkIcon, Database, ArrowRight } from 'lucide-react';

export default function Hero3DVisual({ onExplore }) {
  return (
    <div className="relative w-full h-[580px] lg:h-[620px] flex items-center justify-center perspective-1500 select-none">
      {/* 1. Rotating Glowing Orbits in Background */}
      <div 
        className="absolute w-[460px] h-[460px] rounded-full border border-cyan-500/15 pointer-events-none"
        style={{
          transform: 'rotateX(68deg)',
          animation: 'rotateOrbit 22s linear infinite'
        }}
      >
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#00d4ff]" />
      </div>

      <div 
        className="absolute w-[360px] h-[360px] rounded-full border border-blue-500/20 pointer-events-none"
        style={{
          transform: 'rotateX(68deg) rotateZ(45deg)',
          animation: 'rotateOrbitReverse 16s linear infinite'
        }}
      >
        <div className="absolute -bottom-1.5 left-1/3 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" />
      </div>

      <div 
        className="absolute w-[560px] h-[560px] rounded-full border border-purple-500/10 pointer-events-none"
        style={{
          transform: 'rotateX(68deg) rotateZ(-30deg)',
          animation: 'rotateOrbit 30s linear infinite'
        }}
      />

      {/* 2. Central Isometric 3D Cadastral Land Parcel */}
      <div className="relative z-10 animate-float-3d">
        <div 
          className="relative w-64 h-64 sm:w-72 sm:h-72"
          style={{
            transform: 'rotateX(56deg) rotateZ(-38deg) rotateY(4deg)',
            transformStyle: 'preserve-3d',
            filter: 'drop-shadow(0 35px 35px rgba(0, 0, 0, 0.7))'
          }}
        >
          {/* Top Land Surface with Topographical Cadastral Lines */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/25 via-slate-900/90 to-blue-900/40 border-2 border-cyan-400/60 rounded-xl overflow-hidden shadow-[inset_0_0_40px_rgba(0,212,255,0.25),0_0_40px_rgba(0,212,255,0.2)]">
            {/* Grid Cadastral Partition Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,212,255,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,212,255,0.25)_1px,transparent_1px)] bg-[size:32px_32px]" />
            
            {/* Survey Boundary Polygon lines */}
            <svg className="absolute inset-0 w-full h-full stroke-cyan-300/60 stroke-[1.5] fill-cyan-500/10" viewBox="0 0 100 100">
              <polygon points="15,20 85,15 75,80 20,70" />
              <line x1="15" y1="20" x2="75" y2="80" strokeDasharray="3 3" stroke="#00d4ff" strokeWidth="1" />
              <line x1="85" y1="15" x2="20" y2="70" strokeDasharray="3 3" stroke="#10b981" strokeWidth="1" />
            </svg>

            {/* Central Geolocation Holographic Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-[0_0_20px_#00d4ff] animate-pulse">
                ✓
              </div>
              <div className="text-[8px] font-mono font-bold text-cyan-300 mt-1 bg-black/70 px-1.5 py-0.5 rounded border border-cyan-500/40 tracking-wider">
                TN-ERD-1024
              </div>
            </div>
          </div>

          {/* 3D Isometric Extruded Side Walls */}
          <div 
            className="absolute -bottom-4 left-3 w-full h-4 bg-gradient-to-r from-[#061525] to-[#0a233d] border-b border-l border-cyan-500/40"
            style={{ transform: 'skewX(45deg)' }}
          />
          <div 
            className="absolute top-3 -right-4 w-4 h-full bg-gradient-to-b from-[#081d33] to-[#040c17] border-t border-r border-cyan-500/40"
            style={{ transform: 'skewY(45deg)' }}
          />
        </div>
      </div>

      {/* 3. Non-Overlapping Spatially Distributed 3D Floating Blockchain Blocks */}
      {/* ====================================================================== */}

      {/* BLOCK #0: GENESIS (Top Left - y:0) */}
      <div 
        className="absolute top-0 left-0 z-20 p-2.5 rounded-xl bg-[#090e1a]/95 border border-purple-500/40 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.2)] w-44 transition hover:scale-105"
        style={{
          transform: 'rotateX(8deg) rotateY(10deg)',
          animation: 'float3D 7s ease-in-out infinite'
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-purple-300 font-bold text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
            BLOCK #0 • GENESIS
          </div>
          <span className="text-[8px] px-1 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/80 font-mono">
            0x000...
          </span>
        </div>
        <div className="font-mono text-[9px] text-slate-400 truncate bg-black/60 px-1.5 py-0.5 rounded border border-purple-900/30">
          HASH: 8f4a10...b92e
        </div>
      </div>

      {/* BLOCK #1: REGISTRATION (Upper Right - y:64px) */}
      <div 
        className="absolute top-16 right-0 z-20 p-2.5 rounded-xl bg-[#090e1a]/95 border border-cyan-500/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,212,255,0.2)] w-44 transition hover:scale-105"
        style={{
          transform: 'rotateX(8deg) rotateY(-10deg)',
          animation: 'float3DSlow 8s ease-in-out infinite'
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-[10px]">
            <Blocks className="w-3 h-3 text-cyan-400" />
            BLOCK #1 • MINT
          </div>
          <span className="text-[8px] px-1 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 font-mono">
            TN-ERD-1001
          </span>
        </div>
        <div className="font-mono text-[9px] text-slate-400 truncate bg-black/60 px-1.5 py-0.5 rounded border border-cyan-900/30">
          SHA: 5da626...f8fd
        </div>
      </div>

      {/* BLOCK #2: MUTATION TX (Lower Left - y:360px) */}
      <div 
        className="absolute bottom-28 left-0 z-20 p-2.5 rounded-xl bg-[#090e1a]/95 border border-blue-500/40 backdrop-blur-md shadow-[0_0_20px_rgba(20,100,255,0.2)] w-44 transition hover:scale-105"
        style={{
          transform: 'rotateX(-6deg) rotateY(8deg)',
          animation: 'float3DSlow 9s ease-in-out infinite'
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-blue-300 font-bold text-[10px]">
            <LinkIcon className="w-3 h-3 text-blue-400" />
            BLOCK #2 • MUTATION
          </div>
          <span className="text-[8px] px-1 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/80 font-mono">
            TX VALID
          </span>
        </div>
        <div className="font-mono text-[9px] text-blue-300/80 truncate bg-black/60 px-1.5 py-0.5 rounded border border-blue-900/30">
          PREV_LINK: VERIFIED ✓
        </div>
      </div>

      {/* BLOCK #3: ANCHOR VERIFIED (Lower Right - y:420px) */}
      <div 
        className="absolute bottom-16 right-0 z-20 p-2.5 rounded-xl bg-[#090e1a]/95 border border-emerald-500/40 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.2)] w-44 transition hover:scale-105"
        style={{
          transform: 'rotateX(-6deg) rotateY(-8deg)',
          animation: 'float3D 8s ease-in-out infinite'
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-[10px]">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            BLOCK #3 • VERIFIED
          </div>
          <span className="text-[8px] px-1 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 font-mono">
            IMMUTABLE
          </span>
        </div>
        <div className="font-mono text-[9px] text-emerald-400 truncate bg-black/60 px-1.5 py-0.5 rounded border border-emerald-900/30">
          STATUS: UNTAMPERED ✓
        </div>
      </div>

      {/* 4. Foreground Floating Holographic Verification Badge (Cleanly docked at bottom center) */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl bg-gradient-to-r from-slate-900/95 via-[#081220]/95 to-slate-900/95 border border-cyan-400/50 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(0,212,255,0.2)] backdrop-blur-xl flex items-center gap-3 w-max max-w-[90%]"
      >
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-wider text-white">
              TN-ERD-1024
            </span>
            <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
              VERIFIED ✓
            </span>
          </div>
          <div className="text-[10px] text-slate-300 font-medium truncate">
            Owner: <span className="text-white font-semibold">Ravi Kumar</span> (2.50 Acres)
          </div>
          <div className="text-[8px] text-cyan-400 font-mono">
            Blockchain Anchor: 100% VALID
          </div>
        </div>
      </div>
    </div>
  );
}
