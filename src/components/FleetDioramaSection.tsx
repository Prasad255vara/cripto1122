import React, { useState } from 'react';
import { FleetModel, CameraPreset } from '../types';
import { audioService } from '../services/audioService';
import { Compass, Sparkles, Layers, ArrowUpRight, ShieldCheck, Cpu } from 'lucide-react';

interface FleetDioramaSectionProps {
  onSelectPreset: (preset: CameraPreset) => void;
  onOpenMissionWithFleet?: (fleetName: string) => void;
}

export const EXHIBITION_FLEET: FleetModel[] = [
  // --- ROW 1 ---
  {
    id: 'orion-scout',
    name: 'ORION SCOUT',
    designation: 'SC-01 / VANGUARD',
    category: 'Scout',
    row: 1,
    platformTone: 'copper',
    plateSerial: 'NP-COPPER-8812',
    role: 'Deep Void Reconnaissance & Exoplanetary Sensor Array',
    length: '94 meters',
    crew: '4 Specialists',
    propulsion: 'Micro-Fusion Pulsed Thruster',
    maxVelocity: '0.08c (24,000 km/s)',
    status: 'Exhibition Active',
    description: 'Equipped with forward gravitational wave radar and deployable telemetry buoys to map jump corridors beyond the Oort cloud.',
    specs: [
      { label: 'Platform Tone', value: 'Aged Copper & Bronze' },
      { label: 'Sensor Sweep', value: '3.8 AU Synthetic Aperture' },
      { label: 'Delta-V Yield', value: '36,500 km/s' },
      { label: 'Stealth Rating', value: 'Class 4 EM Baffle' },
    ],
    cameraTarget: {
      position: [-10, -7.5, 7],
      lookAt: [-10, -7.5, 7],
    },
  },
  {
    id: 'atlas-cargo',
    name: 'ATLAS CARGO',
    designation: 'CR-09 / ARCHON',
    category: 'Cargo',
    row: 1,
    platformTone: 'purple',
    plateSerial: 'NP-PURPLE-4402',
    role: 'Modular Habitat Transport & Megastructure Section Delivery',
    length: '380 meters',
    crew: '14 Crew',
    propulsion: 'High-Mass Xenon Ion Grid Array',
    maxVelocity: '85 km/s Interplanetary Cruise',
    status: 'Exhibition Active',
    description: 'Constructed to transport heavy centrifugal habitat rings and pressurized dome modules directly from orbital drydocks to frontier colonies.',
    specs: [
      { label: 'Platform Tone', value: 'Rich Amethyst Purple' },
      { label: 'Dry Cargo Load', value: '850,000 Metric Tons' },
      { label: 'Keel Material', value: 'Titanium Nanocomposite' },
      { label: 'Docking Bays', value: '8 Magnetic Latches' },
    ],
    cameraTarget: {
      position: [-6, -7.8, 8.5],
      lookAt: [-6, -7.8, 8.5],
    },
  },
  {
    id: 'nebula-miner',
    name: 'NEBULA MINER',
    designation: 'MN-14 / VULCAN',
    category: 'Miner',
    row: 1,
    platformTone: 'copper',
    plateSerial: 'NP-COPPER-6309',
    role: 'Asteroid Volatile Extraction & Rare-Earth Refinery Rig',
    length: '240 meters',
    crew: '8 Operators / AI Assisted',
    propulsion: 'Thermal Magneto-Plasma Drill Arc',
    maxVelocity: '110 km/s Transit',
    status: 'Exhibition Active',
    description: 'Specialized for boring into carbonaceous chondrites to siphon primordial water-ice, helium-3 isotopes, and heavy platinum group ores.',
    specs: [
      { label: 'Platform Tone', value: 'Hammered Copper Bed' },
      { label: 'Excavation Rate', value: '4,200 Tons/Hour' },
      { label: 'Refinery Arc', value: 'Dual Plasma Furnace' },
      { label: 'Crusher Keel', value: 'Tungsten Carbide Edge' },
    ],
    cameraTarget: {
      position: [-2, -8.0, 9.5],
      lookAt: [-2, -8.0, 9.5],
    },
  },
  {
    id: 'reclaimer',
    name: 'RECLAIMER',
    designation: 'RC-03 / OSIRIS',
    category: 'Reclaimer',
    row: 1,
    platformTone: 'purple',
    plateSerial: 'NP-PURPLE-2911',
    role: 'Deep Salvage, Structural Recirculation & Kinetic Capture',
    length: '310 meters',
    crew: '18 Engineers',
    propulsion: 'Quad Vectored Magnetoplasmadynamic Drive',
    maxVelocity: '95 km/s Vector',
    status: 'Exhibition Active',
    description: 'Features a massive articulating magnetic grapple cradle and robotic disassembly cutters to recycle derelict hulls into usable orbital feedstock.',
    specs: [
      { label: 'Platform Tone', value: 'Deep Purple Anodized' },
      { label: 'Grapple Force', value: '6.8 MegaNewtons' },
      { label: 'Recovery Smelter', value: 'Zero-G Induction Crucible' },
      { label: 'Tether Cable', value: 'Carbon Nanotube 12km' },
    ],
    cameraTarget: {
      position: [2, -8.0, 9.5],
      lookAt: [2, -8.0, 9.5],
    },
  },

  // --- ROW 2 (Unique names, unique classes, zero repetition) ---
  {
    id: 'voyager-explorer',
    name: 'VOYAGER EXPLORER',
    designation: 'EX-07 / HORIZON',
    category: 'Explorer',
    row: 2,
    platformTone: 'copper',
    plateSerial: 'NP-COPPER-9105',
    role: 'Exoplanetary Atmospheric Insertion & Biological Survey',
    length: '180 meters',
    crew: '24 Scientists',
    propulsion: 'Interstellar Photonic Laser Sail + Micro-Fusion',
    maxVelocity: '0.14c (42,000 km/s)',
    status: 'Exhibition Active',
    description: 'Carries autonomous bio-hazard lab capsules and cryogenic planetary probes to examine atmospheric signatures on candidate exoworlds.',
    specs: [
      { label: 'Platform Tone', value: 'Polished Bronze Inlay' },
      { label: 'Probe Pods', value: '32 Sub-Orbital Probes' },
      { label: 'Bio-Clean Lab', value: 'Biosafety Level 5' },
      { label: 'Thermal Shroud', value: 'Reflective Metamaterial' },
    ],
    cameraTarget: {
      position: [6, -7.8, 8.5],
      lookAt: [6, -7.8, 8.5],
    },
  },
  {
    id: 'luna-rover',
    name: 'LUNA ROVER',
    designation: 'RV-22 / SELENE',
    category: 'Surface',
    row: 2,
    platformTone: 'purple',
    plateSerial: 'NP-PURPLE-7721',
    role: 'Extreme Regolith Exploration & Sub-Surface Lava Tube Crawler',
    length: '32 meters',
    crew: '6 Crew / 120 Days Autonomy',
    propulsion: '12-Wheel All-Terrain Titanium Mesh Drive',
    maxVelocity: '45 km/h Surface Traverse',
    status: 'Exhibition Active',
    description: 'Engineered for navigating permanently shadowed craters at lunar and martian poles, equipped with sub-surface neutron spectrometers and drill cores.',
    specs: [
      { label: 'Platform Tone', value: 'Rich Purple Slate Base' },
      { label: 'Grade Ascent', value: 'Up to 55° Incline' },
      { label: 'Sub-Surface Radar', value: 'Depth 250 Meters' },
      { label: 'Life Chamber', value: 'Radiation-Hardened Bay' },
    ],
    cameraTarget: {
      position: [10, -7.5, 7],
      lookAt: [10, -7.5, 7],
    },
  },
  {
    id: 'chronos-recon',
    name: 'CHRONOS RECON',
    designation: 'RN-11 / ZEPHYR',
    category: 'Recon',
    row: 2,
    platformTone: 'copper',
    plateSerial: 'NP-COPPER-5188',
    role: 'Relativistic Chronometric Synchronization & Spatial Mapping',
    length: '115 meters',
    crew: '5 Navigators',
    propulsion: 'Pulsed Laser Trajectory Engine',
    maxVelocity: '0.10c Relativistic',
    status: 'Exhibition Active',
    description: 'Coordinates universal clock sync for fleet vessels across deep space via optical atomic clocks and quantum entanglement transceivers.',
    specs: [
      { label: 'Platform Tone', value: 'Aged Copper Platform' },
      { label: 'Time Drift', value: '< 1 Femtosecond / Year' },
      { label: 'Beacon Power', value: '25 kW Laser Array' },
      { label: 'Chassis', value: 'Gold-Plated Ceramic' },
    ],
    cameraTarget: {
      position: [0, -8.0, 9.0],
      lookAt: [0, -8.0, 9.0],
    },
  },
  {
    id: 'hyperion-dock',
    name: 'HYPERION DOCK',
    designation: 'DK-05 / AETHEL',
    category: 'Dock',
    row: 2,
    platformTone: 'purple',
    plateSerial: 'NP-PURPLE-1154',
    role: 'Mobile Orbital Assembly Cradle & Robotic Construction Gantry',
    length: '520 meters',
    crew: '30 Technicians',
    propulsion: 'Multi-Axis RCS Stabilizer Suite',
    maxVelocity: 'Stationary Drydock Orbit',
    status: 'Exhibition Active',
    description: 'A mobile orbital scaffold equipped with quad tele-operated construction cranes to assemble space stations in high orbit.',
    specs: [
      { label: 'Platform Tone', value: 'Deep Purple Anodized' },
      { label: 'Assembly Cradle', value: 'Enclosed 450m Berth' },
      { label: 'Gantry Cranes', value: '4 Heavy Mag-Arms' },
      { label: 'Power Bus', value: '8.5 GW Solar Truss' },
    ],
    cameraTarget: {
      position: [4, -7.8, 8.5],
      lookAt: [4, -7.8, 8.5],
    },
  },
];

export default function FleetDioramaSection({
  onSelectPreset,
  onOpenMissionWithFleet,
}: FleetDioramaSectionProps) {
  const [selectedFleet, setSelectedFleet] = useState<FleetModel>(EXHIBITION_FLEET[0]);

  const handleSelectFleet = (fleet: FleetModel) => {
    audioService.playClickBeep();
    setSelectedFleet(fleet);
    onSelectPreset('fleet');
  };

  const row1Fleets = EXHIBITION_FLEET.filter((f) => f.row === 1);
  const row2Fleets = EXHIBITION_FLEET.filter((f) => f.row === 2);

  return (
    <section id="fleet" className="relative z-20 py-20 px-6 sm:px-12 max-w-7xl mx-auto">
      {/* Exhibition Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-amber-500/20 pb-8">
        <div>
          <div className="text-xs uppercase font-mono-numbers tracking-widest text-amber-400 mb-2 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5" />
            <span>EXHIBITION DIORAMA // FOREGROUND DISPLAY PEDESTALS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-headline uppercase tracking-tight text-white">
            Physical Fleet Models & Display Modules
          </h2>
        </div>
        <p className="text-sm text-slate-300 max-w-md leading-relaxed">
          Physical dioramas on individually textured copper and deep purple platforms. Select any module to inspect engraved physical nameplates and technical specs.
        </p>
      </div>

      {/* Row 1 Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-mono-numbers text-amber-300 font-bold uppercase tracking-wider bg-amber-950/60 px-2.5 py-1 rounded border border-amber-500/30">
          TIER 1 PLATFORMS // ORBITAL FLEET
        </span>
        <div className="h-px bg-slate-800 flex-1" />
      </div>

      {/* Row 1 Grid (ORION SCOUT, ATLAS CARGO, NEBULA MINER, RECLAIMER) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {row1Fleets.map((fleet) => {
          const isSelected = selectedFleet.id === fleet.id;
          const isCopper = fleet.platformTone === 'copper';

          return (
            <div
              key={fleet.id}
              onClick={() => handleSelectFleet(fleet)}
              onMouseEnter={() => audioService.playHoverBlip()}
              className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md ${
                isSelected
                  ? isCopper
                    ? 'bg-amber-950/40 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.35)] -translate-y-1'
                    : 'bg-purple-950/40 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.35)] -translate-y-1'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-600'
              }`}
            >
              {/* Physical Metallic Nameplate Badge */}
              <div
                className={`flex items-center justify-between text-[11px] font-mono-numbers px-2.5 py-1 rounded border mb-3 ${
                  isCopper
                    ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                    : 'bg-purple-950/80 border-purple-500/50 text-purple-300'
                }`}
              >
                <span>PLATE: {fleet.plateSerial}</span>
                <span className="uppercase text-[10px] font-bold">
                  {fleet.platformTone} PLATFORM
                </span>
              </div>

              {/* Diorama Miniature Schematic Visual */}
              <div className="h-28 mb-3 rounded-xl bg-slate-950/90 border border-slate-800/80 flex items-center justify-center relative overflow-hidden group-hover:border-slate-600 transition-colors">
                <div className="absolute inset-0 space-grid opacity-25" />
                <div className="relative z-10 text-center">
                  <div
                    className={`text-xl font-bold font-headline tracking-widest ${
                      isCopper ? 'text-amber-300' : 'text-purple-300'
                    }`}
                  >
                    {fleet.category.toUpperCase()}
                  </div>
                  <div className="text-[10px] font-mono-numbers text-slate-400 mt-1">
                    {fleet.designation}
                  </div>
                </div>
              </div>

              {/* Title & Role */}
              <h3 className="text-base font-extrabold font-headline text-white mb-1 group-hover:text-amber-300 transition-colors">
                {fleet.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                {fleet.role}
              </p>

              {/* Compact Specs */}
              <div className="border-t border-slate-800/80 pt-2 text-xs font-mono-numbers flex justify-between text-slate-400">
                <span>Velocity</span>
                <span className="text-slate-200">{fleet.maxVelocity}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 2 Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-mono-numbers text-purple-300 font-bold uppercase tracking-wider bg-purple-950/60 px-2.5 py-1 rounded border border-purple-500/30">
          TIER 2 PLATFORMS // SURFACE & DEEP EXPEDITIONS
        </span>
        <div className="h-px bg-slate-800 flex-1" />
      </div>

      {/* Row 2 Grid (VOYAGER EXPLORER, LUNA ROVER, CHRONOS RECON, HYPERION DOCK) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {row2Fleets.map((fleet) => {
          const isSelected = selectedFleet.id === fleet.id;
          const isCopper = fleet.platformTone === 'copper';

          return (
            <div
              key={fleet.id}
              onClick={() => handleSelectFleet(fleet)}
              onMouseEnter={() => audioService.playHoverBlip()}
              className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md ${
                isSelected
                  ? isCopper
                    ? 'bg-amber-950/40 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.35)] -translate-y-1'
                    : 'bg-purple-950/40 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.35)] -translate-y-1'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-600'
              }`}
            >
              {/* Physical Metallic Nameplate Badge */}
              <div
                className={`flex items-center justify-between text-[11px] font-mono-numbers px-2.5 py-1 rounded border mb-3 ${
                  isCopper
                    ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                    : 'bg-purple-950/80 border-purple-500/50 text-purple-300'
                }`}
              >
                <span>PLATE: {fleet.plateSerial}</span>
                <span className="uppercase text-[10px] font-bold">
                  {fleet.platformTone} PLATFORM
                </span>
              </div>

              {/* Diorama Miniature Schematic Visual */}
              <div className="h-28 mb-3 rounded-xl bg-slate-950/90 border border-slate-800/80 flex items-center justify-center relative overflow-hidden group-hover:border-slate-600 transition-colors">
                <div className="absolute inset-0 space-grid opacity-25" />
                <div className="relative z-10 text-center">
                  <div
                    className={`text-xl font-bold font-headline tracking-widest ${
                      isCopper ? 'text-amber-300' : 'text-purple-300'
                    }`}
                  >
                    {fleet.category.toUpperCase()}
                  </div>
                  <div className="text-[10px] font-mono-numbers text-slate-400 mt-1">
                    {fleet.designation}
                  </div>
                </div>
              </div>

              {/* Title & Role */}
              <h3 className="text-base font-extrabold font-headline text-white mb-1 group-hover:text-purple-300 transition-colors">
                {fleet.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                {fleet.role}
              </p>

              {/* Compact Specs */}
              <div className="border-t border-slate-800/80 pt-2 text-xs font-mono-numbers flex justify-between text-slate-400">
                <span>Crew / Cap</span>
                <span className="text-slate-200">{fleet.crew}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspection Plaque for Selected Fleet Diorama */}
      <div className="rounded-2xl border border-amber-500/30 bg-slate-950/90 backdrop-blur-xl p-6 sm:p-8 relative overflow-hidden shadow-[0_0_35px_rgba(0,0,0,0.7)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-numbers text-amber-400 mb-2">
              <span className="font-bold">CURATED DIORAMA MODEL</span>
              <span>/</span>
              <span className="text-white">{selectedFleet.plateSerial}</span>
              <span>/</span>
              <span className="text-emerald-400">{selectedFleet.status}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-headline text-white">
              {selectedFleet.name}
            </h3>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {selectedFleet.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                audioService.playClickBeep();
                if (onOpenMissionWithFleet) {
                  onOpenMissionWithFleet(selectedFleet.name);
                }
              }}
              onMouseEnter={() => audioService.playHoverBlip()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-headline text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] cursor-pointer whitespace-nowrap"
            >
              Enlist Craft for Expedition
            </button>
          </div>
        </div>

        {/* 4 Detailed Museum Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {selectedFleet.specs.map((spec, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="text-xs font-mono-numbers text-slate-400 mb-1">{spec.label}</div>
              <div className="text-base font-bold font-mono-numbers text-amber-300">
                {spec.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
