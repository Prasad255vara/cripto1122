import React, { useState, useEffect } from 'react';
import { CameraPreset } from '../types';
import { audioService } from '../services/audioService';
import { Activity, Zap, Shield, Sun, Layers, Radio, Sparkles } from 'lucide-react';

interface StationSubsystemsProps {
  onSelectPreset: (preset: CameraPreset) => void;
  wireframe: boolean;
  onToggleWireframe: () => void;
  rotationSpeed: number;
  onChangeRotationSpeed: (speed: number) => void;
}

export default function StationSubsystems({
  onSelectPreset,
  wireframe,
  onToggleWireframe,
  rotationSpeed,
  onChangeRotationSpeed,
}: StationSubsystemsProps) {
  // Live fluctuating telemetry simulation for high realism
  const [telemetry, setTelemetry] = useState({
    orbitalSpeed: 7.662,
    altitude: 418.4,
    fusionOutput: 12.45,
    fluxDensity: 1362,
    lifeSupport: 99.98,
    radiationShield: 98.4,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry((prev) => ({
        orbitalSpeed: Number((7.66 + (Math.random() * 0.008 - 0.004)).toFixed(3)),
        altitude: Number((418.4 + (Math.random() * 0.2 - 0.1)).toFixed(1)),
        fusionOutput: Number((12.45 + (Math.random() * 0.06 - 0.03)).toFixed(2)),
        fluxDensity: Math.round(1360 + Math.random() * 6),
        lifeSupport: 99.98,
        radiationShield: Number((98.4 + (Math.random() * 0.2 - 0.1)).toFixed(1)),
      }));
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  const subsystems = [
    {
      id: 'astra1-habitat',
      preset: 'astra1' as CameraPreset,
      name: 'Counter-Rotating Bronze Centrifuge Rings',
      category: 'Living Quarters & Gravity Hub',
      desc: 'Dual opposing centrifugal rings cast in polished bronze with aged copper spokes, providing 0.92G artificial gravity for 2,400 long-duration specialists.',
      metrics: 'Polished Bronze · 1.4 RPM · 100% Atmosphere Recirculation',
    },
    {
      id: 'reactor',
      preset: 'reactor' as CameraPreset,
      name: 'Pulsing Tokamak Fusion Core',
      category: 'Power & Plasma Confinement',
      desc: 'Magnetic confinement core with glowing amber-plasma emission yielding 12.4 GW continuous power to sustain station shielding and ion thrusters.',
      metrics: '12.4 GW Capacity · Superconducting Coils · 150M K Core',
    },
    {
      id: 'solar',
      preset: 'solar' as CameraPreset,
      name: 'Multi-Colored Articulated Solar Arrays',
      category: 'Renewable Orbital Harvesting',
      desc: 'Four articulated 95-meter wings composed of alternating copper-toned and cobalt photovoltaic cells with gold-leaf thermal radiators.',
      metrics: '4 Articulated Wings · Iridescent Metamaterial Surface',
    },
    {
      id: 'plaque',
      preset: 'astra1' as CameraPreset,
      name: 'ASTRA-1 Engraved Metal Nameplate',
      category: 'Museum Curation & Archival Identification',
      desc: 'Small metallic identification plate mounted to the forward titanium docking collar, inscribed "ASTRA-1: ORBITAL STATION · ARCH-01".',
      metrics: 'Physical Etched Bronze Plaque · Museum Registry Arch-01',
    },
  ];

  return (
    <section id="megastructure" className="relative z-20 py-20 px-6 sm:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-amber-500/20 pb-8">
        <div>
          <div className="text-xs uppercase font-mono-numbers tracking-widest text-amber-400 mb-2 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CENTERPIECE SPECIFICATIONS // ASTRA-1 MEGASTRUCTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-headline uppercase tracking-tight text-white">
            ASTRA-1 Architecture & Telemetry
          </h2>
        </div>
        <p className="text-sm text-slate-300 max-w-md leading-relaxed">
          The centerpiece orbital station is constructed from aged copper, polished bronze, multi-colored solar arrays, and titanium. Toggle holographic wireframe shaders or calibrate rotation speed.
        </p>
      </div>

      {/* 3D Viewport Hardware Controls Ribbon */}
      <div className="mb-10 p-5 rounded-2xl border border-amber-500/25 bg-slate-950/80 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white font-headline">
              EXHIBITION SHADING MATRIX
            </div>
            <div className="text-xs font-mono-numbers text-slate-400">
              Interactive WebGL Materials & Shaders
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Wireframe Toggle */}
          <button
            onClick={() => {
              audioService.playClickBeep();
              onToggleWireframe();
            }}
            onMouseEnter={() => audioService.playHoverBlip()}
            className={`px-4 py-2 rounded-xl text-xs font-mono-numbers font-semibold transition-all border cursor-pointer ${
              wireframe
                ? 'bg-amber-500/30 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
            }`}
          >
            {wireframe ? 'Holographic Wireframe: ON' : 'PBR Museum Metals: SOLID'}
          </button>

          {/* Rotation Speed Control */}
          <div className="flex items-center gap-2 text-xs font-mono-numbers text-slate-400">
            <span>Spin Rate:</span>
            <input
              type="range"
              min="0"
              max="3"
              step="0.25"
              value={rotationSpeed}
              onChange={(e) => {
                onChangeRotationSpeed(parseFloat(e.target.value));
              }}
              className="w-24 accent-amber-400 cursor-pointer"
            />
            <span className="text-amber-400 w-8 tabular-nums">{rotationSpeed.toFixed(1)}x</span>
          </div>
        </div>
      </div>

      {/* Telemetry Dashboard Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-xs font-mono-numbers text-slate-400 mb-1">Orbital Speed</div>
          <div className="text-lg font-bold font-mono-numbers text-amber-300">
            {telemetry.orbitalSpeed} <span className="text-xs text-slate-400">km/s</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">LEO Synchronous</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-xs font-mono-numbers text-slate-400 mb-1">Apogee Altitude</div>
          <div className="text-lg font-bold font-mono-numbers text-amber-300">
            {telemetry.altitude} <span className="text-xs text-slate-400">km</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Circular Orbit</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-xs font-mono-numbers text-slate-400 mb-1">Tokamak Core</div>
          <div className="text-lg font-bold font-mono-numbers text-amber-300">
            {telemetry.fusionOutput} <span className="text-xs text-slate-400">GW</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Pulsing Amber Plasma</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-xs font-mono-numbers text-slate-400 mb-1">Solar Flux</div>
          <div className="text-lg font-bold font-mono-numbers text-amber-300">
            {telemetry.fluxDensity} <span className="text-xs text-slate-400">W/m²</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Cobalt & Bronze Cells</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-xs font-mono-numbers text-slate-400 mb-1">Shield Matrix</div>
          <div className="text-lg font-bold font-mono-numbers text-amber-300">
            {telemetry.radiationShield}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Magnetic Deflection</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-xs font-mono-numbers text-slate-400 mb-1">Life Support</div>
          <div className="text-lg font-bold font-mono-numbers text-emerald-400">
            {telemetry.lifeSupport}%
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Closed-Loop 100%</div>
        </div>
      </div>

      {/* 4 Interactive Subsystem Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subsystems.map((sub) => (
          <div
            key={sub.id}
            onClick={() => {
              audioService.playClickBeep();
              onSelectPreset(sub.preset);
            }}
            onMouseEnter={() => audioService.playHoverBlip()}
            className="p-6 rounded-2xl border border-slate-800 bg-slate-950/70 hover:bg-slate-900/80 hover:border-amber-400/50 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs font-mono-numbers text-slate-400 mb-2">
              <span className="text-amber-400 font-semibold">{sub.category}</span>
              <span className="group-hover:text-amber-300 transition-colors">Target Camera →</span>
            </div>
            <h3 className="text-xl font-bold font-headline text-white mb-2 group-hover:text-amber-300 transition-colors">
              {sub.name}
            </h3>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              {sub.desc}
            </p>
            <div className="text-xs font-mono-numbers text-slate-400 border-t border-slate-800/80 pt-3">
              {sub.metrics}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
