import React from 'react';
import { CameraPreset } from '../types';
import { audioService } from '../services/audioService';
import { Sparkles, Eye, Compass, Shield, Orbit, Layers } from 'lucide-react';

interface ExhibitionBrandingProps {
  onJoinMission: () => void;
  onSelectPreset: (preset: CameraPreset) => void;
  currentPreset: CameraPreset;
}

export default function ExhibitionBranding({
  onJoinMission,
  onSelectPreset,
  currentPreset,
}: ExhibitionBrandingProps) {
  return (
    <div className="relative min-h-[92vh] flex flex-col justify-between pt-28 pb-10 px-6 sm:px-12 max-w-7xl mx-auto pointer-events-none select-none">
      {/* Museum Exhibition Tagline Bar */}
      <div className="pointer-events-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono-numbers text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b] inline-block animate-pulse" />
          <span className="text-amber-400 font-semibold tracking-wider">
            GALLERY INSTALLATION // SECTOR 07
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-cyan-300">PHYSICAL DIORAMA: ASTRA-1</span>
        </div>

        <div className="flex items-center gap-3 text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <span>CENTERPIECE: AGED COPPER & TITANIUM</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400">STATUS: ON DISPLAY</span>
        </div>
      </div>

      {/* Main Exhibition Branding and Main Text */}
      <div className="max-w-4xl my-auto py-8">
        {/* Physical Illuminated Sign with Complex Multi-Colored Metallic Elements */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-950/60 via-purple-950/50 to-slate-950/80 border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.25)] mb-6">
          {/* Complex Multi-Colored Metallic Logo */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-rose-500 to-purple-600 p-[1.5px] shadow-[0_0_12px_rgba(245,158,11,0.5)]">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-300 fill-none stroke-current stroke-2">
                <polygon points="12 2 19 8 19 16 12 22 5 16 5 8" />
                <circle cx="12" cy="12" r="3" className="fill-cyan-400" />
              </svg>
            </div>
          </div>
          <div>
            <span className="text-xs font-mono-numbers text-amber-300 font-semibold uppercase tracking-widest block">
              PERMANENT CURATION
            </span>
            <span className="text-sm font-extrabold font-headline tracking-wider bg-gradient-to-r from-amber-200 via-yellow-100 to-cyan-200 bg-clip-text text-transparent">
              ASTROGENESIS INITIATIVE
            </span>
          </div>
        </div>

        {/* Physically Textured Panel Main Mission Statement */}
        <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-amber-950/20 border border-slate-800/80 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-md mb-8">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-headline tracking-tight text-white uppercase leading-[1.08] mb-4 drop-shadow-[0_0_25px_rgba(245,158,11,0.2)]">
            <span className="block text-slate-100">Exoplanet Colonization</span>
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-cyan-300 bg-clip-text text-transparent">
              & Advanced Habitats
            </span>
          </h1>

          {/* Distinct Illuminated Sub-Statement */}
          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/30 max-w-2xl text-amber-200 font-headline font-bold text-sm sm:text-base tracking-wider uppercase flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] shrink-0 animate-ping" />
            <span>MISSION MANDATE: BEYOND THE RED HORIZON</span>
          </div>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mt-4 max-w-2xl">
            A museum-grade physical installation displaying the colossal <strong className="text-white">ASTRA-1</strong> orbital station alongside physical copper and amethyst fleet miniatures, tactile mission consoles, and glowing crystalline telemetry hubs.
          </p>
        </div>

        {/* Action Controls Zone */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-4">
          <button
            onClick={() => {
              audioService.playTelemetrySweep();
              onJoinMission();
            }}
            onMouseEnter={() => audioService.playHoverBlip()}
            className="group px-7 py-3.5 rounded-xl border border-amber-400/80 bg-gradient-to-r from-amber-500/30 via-amber-400/20 to-cyan-500/20 hover:from-amber-400 hover:to-cyan-400 text-amber-100 hover:text-slate-950 font-headline text-sm font-bold tracking-wider uppercase transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(245,158,11,0.4)] cursor-pointer flex items-center gap-2 whitespace-nowrap"
          >
            <span>JOIN THE MISSION</span>
            <Sparkles className="w-4 h-4 text-amber-300 group-hover:text-slate-950 transition-colors" />
          </button>

          <button
            onClick={() => {
              audioService.playClickBeep();
              onSelectPreset('astra1');
            }}
            onMouseEnter={() => audioService.playHoverBlip()}
            className="px-6 py-3.5 rounded-xl border border-slate-700/80 bg-slate-900/70 hover:bg-slate-800 text-slate-200 hover:text-white font-headline text-sm font-semibold tracking-wider uppercase transition-all backdrop-blur-sm cursor-pointer flex items-center gap-2 whitespace-nowrap"
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span>INSPECT ASTRA-1</span>
          </button>
        </div>
      </div>

      {/* Gallery Diorama Camera Views Ribbon */}
      <div className="pointer-events-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono-numbers text-slate-400 uppercase tracking-wider mr-1">
            Gallery Viewpoint:
          </span>
          {[
            { id: 'gallery' as CameraPreset, label: 'Exhibition Overview' },
            { id: 'astra1' as CameraPreset, label: 'ASTRA-1 Close-Up' },
            { id: 'fleet' as CameraPreset, label: 'Fleet Diorama' },
            { id: 'console' as CameraPreset, label: 'Tactile Console' },
            { id: 'crystals' as CameraPreset, label: 'Data Crystals' },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => {
                audioService.playClickBeep();
                onSelectPreset(view.id);
              }}
              onMouseEnter={() => audioService.playHoverBlip()}
              className={`px-3 py-1.5 text-xs font-mono-numbers rounded-lg transition-all border cursor-pointer ${
                currentPreset === view.id
                  ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono-numbers text-slate-300">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Click 3D space for Nebula Sparks</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Orbit className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>Drag to Orbit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
