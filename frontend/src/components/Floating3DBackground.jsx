import React from 'react';

export default function Floating3DBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 3D Perspective Floor Grid */}
      <div className="cyber-grid-perspective" />

      {/* Atmospheric Ambient Glow Spheres */}
      <div className="glow-spot-blue -top-32 -left-32 opacity-40" />
      <div className="glow-spot-cyan top-1/3 -right-32 opacity-35" />
      <div className="glow-spot-emerald -bottom-32 left-1/3 opacity-30" />

      {/* 3D Wireframe Cube 1 (Far Top Right corner - away from all content) */}
      <div className="cube-wireframe top-20 right-[5%] opacity-35 animate-drift-1">
        <div className="front border-cyan-400/60" />
        <div className="back border-cyan-400/60" />
        <div className="right border-cyan-400/60" />
        <div className="left border-cyan-400/60" />
        <div className="top border-cyan-400/60" />
        <div className="bottom border-cyan-400/60" />
      </div>

      {/* 3D Wireframe Cube 2 (Far Bottom Left corner - away from all content) */}
      <div className="cube-wireframe bottom-24 left-[3%] scale-75 opacity-30 animate-drift-2" style={{ animationDuration: '28s' }}>
        <div className="front border-purple-400/60" />
        <div className="back border-purple-400/60" />
        <div className="right border-purple-400/60" />
        <div className="left border-purple-400/60" />
        <div className="top border-purple-400/60" />
        <div className="bottom border-purple-400/60" />
      </div>

      {/* Subtle Floating Star / Hash Nodes (Tiny dots that never block text) */}
      <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-cyan-400/60 animate-ping" style={{ animationDuration: '3s' }} />
      <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 rounded-full bg-emerald-400/50 animate-pulse" />
      <div className="absolute top-1/3 right-1/3 w-1 h-1 rounded-full bg-purple-400/40 animate-ping" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-1 h-1 rounded-full bg-blue-400/50 animate-pulse" />
    </div>
  );
}
