import React, { useState } from 'react';
import { DataHubStream, CameraPreset } from '../types';
import { audioService } from '../services/audioService';
import { Sparkles, Activity, ShieldCheck, Database, Radio, CheckCircle2 } from 'lucide-react';

interface DataHubCrystalsProps {
  onSelectPreset?: (preset: CameraPreset) => void;
}

export const CRYSTAL_STREAMS: DataHubStream[] = [
  {
    id: 'stream-1',
    title: 'DATA STREAM 1: EXOPLANET ANALYSIS',
    tagline: 'Spectroscopic Atmospheric Inversion & Biosignature Telemetry',
    frequency: '14.85 GHz Laser-Band',
    bandwidth: '48.2 Terabits/sec',
    status: 'CONTINUOUS FEED',
    crystalHue: 'from-cyan-400 via-sky-500 to-blue-600',
    metrics: [
      { key: 'Target System', val: 'Kepler-452 Variant' },
      { key: 'Equilibrium Temp', val: '278 K (+5°C)' },
      { key: 'Atmosphere N₂/O₂', val: '74.2% / 21.8%' },
      { key: 'Habitability Index', val: '0.94 Earth Normal' },
    ],
  },
  {
    id: 'stream-2',
    title: 'DATA STREAM 2: HABITAT STATUS',
    tagline: 'Centrifugal Gravity Torus, Closed Biosphere & Life Support',
    frequency: '8.40 GHz Deep Mesh',
    bandwidth: '12.4 Terabits/sec',
    status: '100% RECIRCULATION',
    crystalHue: 'from-purple-400 via-fuchsia-500 to-violet-600',
    metrics: [
      { key: 'Rotational Velocity', val: '1.4 RPM (0.92G)' },
      { key: 'O₂ Pressure', val: '101.3 kPa Nominal' },
      { key: 'Hydration Cycle', val: '99.98% Efficiency' },
      { key: 'Active Crew Count', val: '2,400 Residents' },
    ],
  },
  {
    id: 'stream-3',
    title: 'SYSTEM HEALTH: OPTIMAL',
    tagline: 'Tokamak Fusion Containment & Superconducting Keel Integrity',
    frequency: 'Quantum Entanglement Bus',
    bandwidth: 'Instantaneous (Sub-Relativistic)',
    status: 'CORE CONTAINED',
    crystalHue: 'from-emerald-400 via-teal-500 to-green-600',
    metrics: [
      { key: 'Core Output', val: '12.45 GW Continuous' },
      { key: 'Superconducting Temp', val: '4.2 K Stable' },
      { key: 'Deflector Shield', val: '98.4% Resilience' },
      { key: 'Thermal Radiators', val: 'Normal Dissipation' },
    ],
  },
];

export default function DataHubCrystals({ onSelectPreset }: DataHubCrystalsProps) {
  const [selectedStreamId, setSelectedStreamId] = useState(CRYSTAL_STREAMS[0].id);

  const selectedStream =
    CRYSTAL_STREAMS.find((s) => s.id === selectedStreamId) || CRYSTAL_STREAMS[0];

  const handleSelectStream = (stream: DataHubStream) => {
    audioService.playTelemetrySweep();
    setSelectedStreamId(stream.id);
    if (onSelectPreset) {
      onSelectPreset('crystals');
    }
  };

  return (
    <section id="crystals" className="relative z-20 py-20 px-6 sm:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-amber-500/20 pb-8">
        <div>
          <div className="text-xs uppercase font-mono-numbers tracking-widest text-amber-400 mb-2 flex items-center gap-2">
            <Database className="w-3.5 h-3.5" />
            <span>INTEGRATED DATA HUBS // BOTTOM CENTER CRYSTAL MODULES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-headline uppercase tracking-tight text-white">
            Crystalline Data Hubs & Metal Text Plates
          </h2>
        </div>
        <p className="text-sm text-slate-300 max-w-md leading-relaxed">
          Integrated data hub modules glowing like crystal structures with physical metal text plates reading distinct descriptions and telemetry streams.
        </p>
      </div>

      {/* 3 Glowing Crystal Hub Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {CRYSTAL_STREAMS.map((stream, idx) => {
          const isSelected = selectedStreamId === stream.id;
          const isCyan = idx === 0;
          const isPurple = idx === 1;
          const isGreen = idx === 2;

          const glowColor = isCyan
            ? 'shadow-[0_0_35px_rgba(6,182,212,0.4)] border-cyan-400'
            : isPurple
            ? 'shadow-[0_0_35px_rgba(168,85,247,0.4)] border-purple-400'
            : 'shadow-[0_0_35px_rgba(16,185,129,0.4)] border-emerald-400';

          return (
            <div
              key={stream.id}
              onClick={() => handleSelectStream(stream)}
              onMouseEnter={() => audioService.playHoverBlip()}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer backdrop-blur-md relative overflow-hidden group ${
                isSelected
                  ? `bg-slate-900/90 ${glowColor} -translate-y-1`
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Physical Metal Text Plate at the top of crystal module */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-900/80 border border-amber-500/50 mb-5 shadow-sm">
                <div className="text-[10px] font-mono-numbers text-amber-300/80 uppercase tracking-widest mb-0.5">
                  PHYSICAL ENGRAVED METAL PLATE
                </div>
                <div className="text-sm font-extrabold font-headline text-amber-100 tracking-wider uppercase">
                  {stream.title}
                </div>
              </div>

              {/* Glowing Crystalline Visual Representation */}
              <div className="h-36 mb-5 rounded-xl bg-black/60 border border-slate-800/80 flex items-center justify-center relative overflow-hidden">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${stream.crystalHue} opacity-85 rotate-45 transform transition-transform group-hover:scale-110 shadow-2xl flex items-center justify-center animate-pulse`}
                >
                  <div className="w-12 h-12 rounded-lg bg-black/40 backdrop-blur-xs flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="absolute bottom-2 right-3 text-[10px] font-mono-numbers text-slate-400">
                  {stream.bandwidth}
                </div>
              </div>

              {/* Tagline & Status */}
              <p className="text-xs text-slate-300 mb-4 leading-relaxed line-clamp-2">
                {stream.tagline}
              </p>

              <div className="flex items-center justify-between text-xs font-mono-numbers pt-3 border-t border-slate-800/80">
                <span className="text-slate-400">{stream.frequency}</span>
                <span className="text-emerald-400 font-semibold">{stream.status}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Crystal Telemetry Readout */}
      <div className="p-6 sm:p-8 rounded-2xl border border-amber-500/30 bg-slate-950/90 backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
          <div>
            <div className="text-xs font-mono-numbers text-amber-400 uppercase tracking-wider mb-1">
              ENGRAVED PLATE: {selectedStream.title}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-headline text-white">
              {selectedStream.tagline}
            </h3>
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-xs font-mono-numbers text-amber-300">
            BANDWIDTH: {selectedStream.bandwidth}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {selectedStream.metrics.map((m, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs font-mono-numbers text-slate-400 mb-1">{m.key}</div>
              <div className="text-base font-bold font-mono-numbers text-white">{m.val}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
