import React, { useState } from 'react';
import { MissionObjective } from '../types';
import { audioService } from '../services/audioService';
import { Sliders, Cpu, Radio, RotateCw, CheckCircle, Terminal, Eye } from 'lucide-react';

interface InteractiveConsoleProps {
  onFocusScreen?: (screenId: string) => void;
}

export const MISSION_SCREENS: MissionObjective[] = [
  {
    id: 'alpha-korolev',
    code: 'SCR-01 / BLUE MATRIX',
    title: 'MISSION ALPHA: NEBULA HARVEST - KOROLEV NODE',
    targetNode: 'KOROLEV EXTRACTION NODE',
    colorTheme: 'blue',
    status: 'ACTIVE EXTRACTION',
    progress: 78,
    coordinates: 'RA 18h 53m / DEC -08° 42\' / NODE 4',
    summary: 'Autonomous atmospheric scoop operations siphoning volatile hydrogen and primordial helium-3 from the outer diffuse clouds of the Korolev nebula.',
    activeMetrics: [
      { label: 'Harvest Rate', value: '1,420 kg/hr' },
      { label: 'Core Pressure', value: '84.2 MPa' },
      { label: 'Ion Purity', value: '99.84%' },
      { label: 'Refinery Status', value: 'NOMINAL-BLUE' },
    ],
  },
  {
    id: 'beta-europa',
    code: 'SCR-02 / GREEN MATRIX',
    title: 'MISSION BETA: EUROPA HAB DEPLOYMENT',
    targetNode: 'EUROPA SUB-ICE ARCHIPELAGO',
    colorTheme: 'green',
    status: 'SURFACE ANCHORING',
    progress: 64,
    coordinates: 'JUPITER SYSTEM / LAT 14.2° N / LONG 88.5° W',
    summary: 'Thermal melt probes establishing geothermal anchor pylons through the 18km icy crust to deploy pressurized sub-surface habitats.',
    activeMetrics: [
      { label: 'Ice Penetration', value: '11.8 / 18.0 km' },
      { label: 'Thermal Output', value: '450 MW Thermal' },
      { label: 'Geothermal Tap', value: 'STABLE-GREEN' },
      { label: 'Bio-Barrier', value: 'LEVEL 4 SEALED' },
    ],
  },
  {
    id: 'delta-lanikea',
    code: 'SCR-03 / PURPLE MATRIX',
    title: 'MISSION DELTA: LANIKEA RELAY SYSTEM',
    targetNode: 'LANIKEA TACHYON MESH',
    colorTheme: 'purple',
    status: 'PHASE ALIGNMENT',
    progress: 91,
    coordinates: 'GALACTIC COORD: L 284.1° / B +02.4°',
    summary: 'Deep-space quantum entanglement relay nodes interconnecting the interstellar fleet with Earth ground control with zero latency.',
    activeMetrics: [
      { label: 'Entangled Pairs', value: '2.4 × 10¹² Qubits' },
      { label: 'Mesh Latency', value: '< 0.002 ms Rel.' },
      { label: 'Coherence Time', value: '48.2 Hours' },
      { label: 'Node Sync', value: 'RESONANT-PURPLE' },
    ],
  },
];

export default function InteractiveConsole({ onFocusScreen }: InteractiveConsoleProps) {
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);

  // Tactical rotary input dials
  const [dials, setDials] = useState({
    plasmaFlux: 65,
    sensorGain: 82,
    gridDeflect: 48,
    opticalZoom: 70,
  });

  const [toggles, setToggles] = useState({
    cryoCooling: true,
    empShield: true,
    telemetryLink: true,
  });

  const activeScreen = MISSION_SCREENS[activeScreenIndex];

  const handleDialTurn = (key: keyof typeof dials) => {
    audioService.playClickBeep();
    setDials((prev) => ({
      ...prev,
      [key]: (prev[key] + 15) % 100,
    }));
  };

  const handleToggle = (key: keyof typeof toggles) => {
    audioService.playClickBeep();
    setToggles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSelectScreen = (idx: number) => {
    audioService.playTelemetrySweep();
    setActiveScreenIndex(idx);
    if (onFocusScreen) {
      onFocusScreen(MISSION_SCREENS[idx].id);
    }
  };

  return (
    <section id="console" className="relative z-20 py-20 px-6 sm:px-12 max-w-7xl mx-auto">
      {/* Console Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-amber-500/20 pb-8">
        <div>
          <div className="text-xs uppercase font-mono-numbers tracking-widest text-amber-400 mb-2 flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>PHYSICAL INTERACTIVE CONSOLE // BOTTOM RIGHT DIORAMA STATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-headline uppercase tracking-tight text-white">
            Mission Objective Console & Physical Controls
          </h2>
        </div>
        <p className="text-sm text-slate-300 max-w-md leading-relaxed">
          Tactile dials, physical switches, and 3 independent CRT/OLED tactical screens monitoring Mission Alpha, Beta, and Delta.
        </p>
      </div>

      {/* Main Physical Console Housing */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-slate-700 bg-gradient-to-b from-slate-900 via-slate-950 to-black shadow-[0_0_50px_rgba(0,0,0,0.9)] relative overflow-hidden">
        {/* Physical Rivets / Fasteners & Corner Trim */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block" />
            <span className="text-xs font-mono-numbers text-slate-400 uppercase tracking-widest">
              CONSOLE RACK #CR-904 // REINFORCED ANODIZED ALUMINUM
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono-numbers text-amber-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>DIRECT LINK: ONLINE</span>
          </div>
        </div>

        {/* 3 Physical Mission Screens Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {MISSION_SCREENS.map((screen, idx) => {
            const isSelected = activeScreenIndex === idx;

            // Dedicated color schemes based on requirements
            const isBlue = screen.colorTheme === 'blue';
            const isGreen = screen.colorTheme === 'green';
            const isPurple = screen.colorTheme === 'purple';

            const borderClass = isSelected
              ? isBlue
                ? 'border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.45)]'
                : isGreen
                ? 'border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.45)]'
                : 'border-purple-400 shadow-[0_0_25px_rgba(192,132,252,0.45)]'
              : 'border-slate-800 hover:border-slate-700';

            const screenBg = isBlue
              ? 'bg-sky-950/40'
              : isGreen
              ? 'bg-emerald-950/40'
              : 'bg-purple-950/40';

            const accentColor = isBlue
              ? 'text-sky-300'
              : isGreen
              ? 'text-emerald-300'
              : 'text-purple-300';

            return (
              <div
                key={screen.id}
                onClick={() => handleSelectScreen(idx)}
                onMouseEnter={() => audioService.playHoverBlip()}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer backdrop-blur-md relative overflow-hidden ${borderClass} ${screenBg}`}
              >
                {/* Scanline CRT overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

                {/* Screen Header */}
                <div className="flex items-center justify-between text-xs font-mono-numbers mb-3">
                  <span className={`font-bold ${accentColor}`}>{screen.code}</span>
                  <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-black/60 border border-slate-700">
                    SCREEN {idx + 1}
                  </span>
                </div>

                {/* Mission Headline */}
                <h3 className="text-base font-extrabold font-headline text-white mb-2 leading-snug">
                  {screen.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                  {screen.summary}
                </p>

                {/* Progress bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-[11px] font-mono-numbers text-slate-400">
                    <span>OBJECTIVE PROGRESS</span>
                    <span className={accentColor}>{screen.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isBlue ? 'bg-sky-400' : isGreen ? 'bg-emerald-400' : 'bg-purple-400'
                      }`}
                      style={{ width: `${screen.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono-numbers pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400">{screen.status}</span>
                  <span className={`font-semibold ${accentColor}`}>
                    {isSelected ? '● ACTIVE SCREEN' : 'SELECT →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Screen Detailed Telemetry Feed */}
        <div className="p-6 rounded-2xl bg-black/80 border border-slate-800 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-slate-800 pb-3">
            <div>
              <div className="text-xs font-mono-numbers text-amber-400 uppercase">
                ACTIVE MONITOR: {activeScreen.title}
              </div>
              <div className="text-sm font-mono-numbers text-slate-400 mt-0.5">
                Target Node: {activeScreen.targetNode} · {activeScreen.coordinates}
              </div>
            </div>
            <div className="px-3 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono-numbers text-slate-300">
              SYSTEM REFRESH: 100 Hz
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {activeScreen.activeMetrics.map((metric, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-mono-numbers text-slate-400 mb-1">{metric.label}</div>
                <div className="text-base font-bold font-mono-numbers text-white">
                  {metric.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Physical Tactile Controls: Rotary Dials & Metal Switches */}
        <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800">
          <div className="text-xs font-mono-numbers text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>TACTILE PHYSICAL HARDWARE DIALS & SWITCHES</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
            {/* Dial 1 */}
            <div
              onClick={() => handleDialTurn('plasmaFlux')}
              onMouseEnter={() => audioService.playHoverBlip()}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-amber-400 transition-all cursor-pointer text-center group"
            >
              <div className="text-xs font-mono-numbers text-slate-400 mb-2">PLASMA FLUX</div>
              <div className="w-16 h-16 mx-auto rounded-full border-4 border-slate-700 group-hover:border-amber-400 flex items-center justify-center relative transition-colors shadow-inner">
                <div
                  className="w-1.5 h-6 bg-amber-400 rounded-full origin-bottom"
                  style={{ transform: `rotate(${dials.plasmaFlux * 3.6}deg)` }}
                />
              </div>
              <div className="mt-2 text-xs font-mono-numbers font-bold text-amber-300">
                {dials.plasmaFlux}%
              </div>
            </div>

            {/* Dial 2 */}
            <div
              onClick={() => handleDialTurn('sensorGain')}
              onMouseEnter={() => audioService.playHoverBlip()}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-sky-400 transition-all cursor-pointer text-center group"
            >
              <div className="text-xs font-mono-numbers text-slate-400 mb-2">SENSOR GAIN</div>
              <div className="w-16 h-16 mx-auto rounded-full border-4 border-slate-700 group-hover:border-sky-400 flex items-center justify-center relative transition-colors shadow-inner">
                <div
                  className="w-1.5 h-6 bg-sky-400 rounded-full origin-bottom"
                  style={{ transform: `rotate(${dials.sensorGain * 3.6}deg)` }}
                />
              </div>
              <div className="mt-2 text-xs font-mono-numbers font-bold text-sky-300">
                {dials.sensorGain}%
              </div>
            </div>

            {/* Dial 3 */}
            <div
              onClick={() => handleDialTurn('gridDeflect')}
              onMouseEnter={() => audioService.playHoverBlip()}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-emerald-400 transition-all cursor-pointer text-center group"
            >
              <div className="text-xs font-mono-numbers text-slate-400 mb-2">GRID DEFLECTION</div>
              <div className="w-16 h-16 mx-auto rounded-full border-4 border-slate-700 group-hover:border-emerald-400 flex items-center justify-center relative transition-colors shadow-inner">
                <div
                  className="w-1.5 h-6 bg-emerald-400 rounded-full origin-bottom"
                  style={{ transform: `rotate(${dials.gridDeflect * 3.6}deg)` }}
                />
              </div>
              <div className="mt-2 text-xs font-mono-numbers font-bold text-emerald-300">
                {dials.gridDeflect}%
              </div>
            </div>

            {/* Dial 4 */}
            <div
              onClick={() => handleDialTurn('opticalZoom')}
              onMouseEnter={() => audioService.playHoverBlip()}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-purple-400 transition-all cursor-pointer text-center group"
            >
              <div className="text-xs font-mono-numbers text-slate-400 mb-2">OPTICAL ZOOM</div>
              <div className="w-16 h-16 mx-auto rounded-full border-4 border-slate-700 group-hover:border-purple-400 flex items-center justify-center relative transition-colors shadow-inner">
                <div
                  className="w-1.5 h-6 bg-purple-400 rounded-full origin-bottom"
                  style={{ transform: `rotate(${dials.opticalZoom * 3.6}deg)` }}
                />
              </div>
              <div className="mt-2 text-xs font-mono-numbers font-bold text-purple-300">
                {dials.opticalZoom}%
              </div>
            </div>
          </div>

          {/* Physical Toggle Switches */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <span className="text-xs font-mono-numbers text-slate-400">
              PHYSICAL BYPASS SWITCHES:
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleToggle('cryoCooling')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-numbers font-semibold transition-all border cursor-pointer ${
                  toggles.cryoCooling
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                CRYO-COOLING: {toggles.cryoCooling ? 'ENGAGED' : 'OFF'}
              </button>

              <button
                onClick={() => handleToggle('empShield')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-numbers font-semibold transition-all border cursor-pointer ${
                  toggles.empShield
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                EMP SHIELD: {toggles.empShield ? 'ONLINE' : 'BYPASS'}
              </button>

              <button
                onClick={() => handleToggle('telemetryLink')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-numbers font-semibold transition-all border cursor-pointer ${
                  toggles.telemetryLink
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                TELEMETRY LINK: {toggles.telemetryLink ? 'SECURED' : 'MUTED'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
