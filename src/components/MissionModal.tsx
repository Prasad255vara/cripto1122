import React, { useState } from 'react';
import { X, CheckCircle2, Copy, Compass, ShieldCheck, Rocket, UserCheck } from 'lucide-react';
import { audioService } from '../services/audioService';

interface MissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedFleet?: string;
}

const EXPEDITIONS = [
  {
    id: 'exp-1',
    name: 'Proxima Vanguard I',
    destination: 'Proxima Centauri B Orbit',
    duration: '22 Years (Unmanned Relay Phase)',
    departure: '2028-11-14',
    tier: 'Deep Void Exploration',
  },
  {
    id: 'exp-2',
    name: 'Titan Atmospheric Outpost',
    destination: 'Saturn / Titan High Orbit',
    duration: '3.4 Years Round-Trip',
    departure: '2027-04-19',
    tier: 'Habitation & Hydrocarbon Science',
  },
  {
    id: 'exp-3',
    name: 'Artemis Deep Reconnaissance',
    destination: 'Lunar South Pole & Gateway Hub',
    duration: '180 Days Orbital Rotation',
    departure: '2026-10-30',
    tier: 'Cislunar Commercial Station',
  },
];

const ROLES = [
  'Flight Dynamics Commander',
  'Fusion Propulsion Specialist',
  'Exobiologist & Closed-Loop Architect',
  'Orbital Infrastructure Engineer',
];

export default function MissionModal({
  isOpen,
  onClose,
  preselectedFleet,
}: MissionModalProps) {
  const [selectedExpedition, setSelectedExpedition] = useState(EXPEDITIONS[0]);
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [candidateName, setCandidateName] = useState('Dr. Elena Vance');
  const [callsign, setCallsign] = useState('STARGAZER-01');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    audioService.playTelemetrySweep();
    setIsConfirmed(true);
  };

  const handleCopyManifest = () => {
    audioService.playClickBeep();
    const manifestText = `AETHERIS ORBITAL MISSION MANIFEST\nMission: ${selectedExpedition.name}\nDestination: ${selectedExpedition.destination}\nOfficer: ${candidateName} [${callsign}]\nSpecialization: ${selectedRole}\nDeparture Window: ${selectedExpedition.departure}\nStatus: FLIGHT CLEARANCE GRANTED`;
    navigator.clipboard.writeText(manifestText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-cyan-500/40 bg-slate-950/95 shadow-[0_0_50px_rgba(6,182,212,0.25)] p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            audioService.playClickBeep();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="text-xs uppercase font-mono-numbers text-cyan-400 mb-1 flex items-center gap-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Launch Manifest & Flight Registry</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-tight text-white">
            Join the Orbital Mission
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enlist for active space station duty or register your mission payload aboard the Aetheris interstellar fleet.
          </p>
        </div>

        {!isConfirmed ? (
          <form onSubmit={handleConfirm} className="space-y-6">
            {/* Step 1: Select Expedition */}
            <div>
              <label className="block text-xs font-mono-numbers uppercase text-slate-300 mb-2">
                1. Select Expedition Track
              </label>
              <div className="space-y-2">
                {EXPEDITIONS.map((exp) => {
                  const isSelected = selectedExpedition.id === exp.id;
                  return (
                    <div
                      key={exp.id}
                      onClick={() => {
                        audioService.playHoverBlip();
                        setSelectedExpedition(exp);
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                          : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-bold font-display text-white">
                          {exp.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {exp.destination} · {exp.duration}
                        </div>
                      </div>
                      <div className="text-xs font-mono-numbers text-cyan-400 whitespace-nowrap">
                        Launch: {exp.departure}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Role Selection */}
            <div>
              <label className="block text-xs font-mono-numbers uppercase text-slate-300 mb-2">
                2. Officer Specialization
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      audioService.playHoverBlip();
                      setSelectedRole(role);
                    }}
                    className={`p-3 text-left rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      selectedRole === role
                        ? 'border-cyan-400 bg-cyan-950/50 text-cyan-200'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Personnel Identity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono-numbers uppercase text-slate-300 mb-1.5">
                  Candidate Full Name
                </label>
                <input
                  type="text"
                  required
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-900 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono-numbers"
                />
              </div>
              <div>
                <label className="block text-xs font-mono-numbers uppercase text-slate-300 mb-1.5">
                  Tactical Callsign
                </label>
                <input
                  type="text"
                  required
                  value={callsign}
                  onChange={(e) => setCallsign(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-900 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono-numbers"
                />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              onMouseEnter={() => audioService.playHoverBlip()}
              className="w-full py-3.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-display font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] cursor-pointer flex items-center justify-center gap-2"
            >
              <Rocket className="w-4 h-4" />
              <span>CONFIRM LAUNCH CREDENTIALS</span>
            </button>
          </form>
        ) : (
          /* Confirmed Flight Pass Display */
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <div className="text-sm font-bold text-white font-display">
                  FLIGHT CLEARANCE VERIFIED & RECORDED
                </div>
                <div className="text-xs text-emerald-300">
                  Transmitted to Aetheris Orbital Flight Dynamics Controller.
                </div>
              </div>
            </div>

            {/* Holographic Boarding Pass Card */}
            <div className="p-6 rounded-xl border border-cyan-400/50 bg-slate-900/90 relative overflow-hidden space-y-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono-numbers text-cyan-400 font-semibold">
                  EXPEDITION BOARDING PASS #AET-{(Math.random() * 90000 + 10000).toFixed(0)}
                </span>
                <span className="text-xs font-mono-numbers text-emerald-400">STATUS: AUTHORIZED</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono-numbers">
                <div>
                  <div className="text-slate-400">MISSION</div>
                  <div className="text-white font-bold text-sm mt-0.5">{selectedExpedition.name}</div>
                </div>
                <div>
                  <div className="text-slate-400">DESTINATION</div>
                  <div className="text-white font-bold text-sm mt-0.5">{selectedExpedition.destination}</div>
                </div>
                <div>
                  <div className="text-slate-400">CREW MEMBER</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">{candidateName}</div>
                </div>
                <div>
                  <div className="text-slate-400">CALLSIGN</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">{callsign}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-slate-400">STATION ROLE</div>
                  <div className="text-white font-medium mt-0.5">{selectedRole}</div>
                </div>
              </div>

              {/* Holographic Barcode */}
              <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                <div className="font-mono-numbers text-[10px] text-slate-500 tracking-widest">
                  ||| | | |||| || | ||||| |||| | ||| |||| |
                </div>
                <div className="text-xs font-mono-numbers text-slate-400">
                  DEPARTURE: {selectedExpedition.departure}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopyManifest}
                className="flex-1 py-3 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white font-mono-numbers text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Copy className="w-4 h-4 text-cyan-400" />
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Launch Credentials'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  audioService.playClickBeep();
                  setIsConfirmed(false);
                }}
                className="py-3 px-5 rounded-lg border border-slate-800 text-slate-400 hover:text-white text-xs font-mono-numbers transition-colors cursor-pointer"
              >
                Modify Registration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
