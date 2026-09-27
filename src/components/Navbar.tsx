import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Compass, Type, Layers } from 'lucide-react';
import { audioService } from '../services/audioService';

export type FontTheme = 'space-grotesk' | 'syne-futurism' | 'chakra-tactical' | 'orbitron-classic';

interface NavbarProps {
  onOpenMission: () => void;
  onSelectNav: (sectionId: string) => void;
  activeSection: string;
  currentFontTheme: FontTheme;
  onChangeFontTheme: (theme: FontTheme) => void;
}

export default function Navbar({
  onOpenMission,
  onSelectNav,
  activeSection,
  currentFontTheme,
  onChangeFontTheme,
}: NavbarProps) {
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);

  const handleAudioToggle = () => {
    const muted = audioService.toggleMute();
    setIsAudioMuted(muted);
  };

  const navLinks = [
    { id: 'hero', label: 'Installation' },
    { id: 'fleet', label: 'Fleet Diorama' },
    { id: 'console', label: 'Mission Console' },
    { id: 'crystals', label: 'Data Crystals' },
    { id: 'megastructure', label: 'ASTRA-1 Core' },
  ];

  const fontOptions: { id: FontTheme; label: string; preview: string }[] = [
    { id: 'space-grotesk', label: 'Space Grotesk', preview: 'Clean Precision' },
    { id: 'syne-futurism', label: 'Syne Avant-Garde', preview: 'Ultra Modern' },
    { id: 'chakra-tactical', label: 'Chakra Petch', preview: 'Sci-Fi HUD' },
    { id: 'orbitron-classic', label: 'Orbitron Classic', preview: 'Cyber Geometric' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass-panel border-b border-amber-500/25 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Wordmark */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            audioService.playClickBeep();
            onSelectNav('hero');
          }}
          className="text-base sm:text-lg font-extrabold tracking-widest font-headline text-white hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_12px_#f59e0b] inline-block animate-pulse" />
          <span>ASTROGENESIS INITIATIVE</span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                audioService.playHoverBlip();
                onSelectNav(link.id);
              }}
              onMouseEnter={() => audioService.playHoverBlip()}
              className={`hover:text-amber-300 transition-colors whitespace-nowrap cursor-pointer relative py-1 ${
                activeSection === link.id ? 'text-amber-400 font-semibold' : 'text-slate-400'
              }`}
            >
              {link.label}
              {activeSection === link.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-cyan-400 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: Actions + Typography Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Font Typography Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                audioService.playClickBeep();
                setIsFontMenuOpen((prev) => !prev);
              }}
              aria-label="Change Typography Font"
              title="Change Typography Preset"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-slate-900/70 hover:bg-amber-950/40 text-xs font-mono-numbers text-amber-300 transition-all cursor-pointer whitespace-nowrap"
            >
              <Type className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">
                {fontOptions.find((f) => f.id === currentFontTheme)?.label.split(' ')[0]}
              </span>
            </button>

            {isFontMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-amber-500/30 bg-slate-950/95 shadow-[0_0_25px_rgba(245,158,11,0.25)] backdrop-blur-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 text-[10px] font-mono-numbers text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                  Typography Style
                </div>
                {fontOptions.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => {
                      audioService.playTelemetrySweep();
                      onChangeFontTheme(font.id);
                      setIsFontMenuOpen(false);
                    }}
                    onMouseEnter={() => audioService.playHoverBlip()}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-between ${
                      currentFontTheme === font.id
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <div>
                      <div>{font.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{font.preview}</div>
                    </div>
                    {currentFontTheme === font.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Audio Ambience Toggle */}
          <button
            onClick={handleAudioToggle}
            aria-label={isAudioMuted ? 'Activate Cosmic Audio Ambience' : 'Mute Cosmic Audio Ambience'}
            title={isAudioMuted ? 'Enable Ambient Gallery Hum' : 'Disable Gallery Hum'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-slate-900/60 hover:bg-amber-950/40 text-xs font-mono-numbers text-amber-300 transition-all cursor-pointer whitespace-nowrap"
          >
            {isAudioMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline text-slate-400">Audio Off</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="hidden sm:inline text-amber-300">Gallery Hum</span>
              </>
            )}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => {
              audioService.playClickBeep();
              onOpenMission();
            }}
            onMouseEnter={() => audioService.playHoverBlip()}
            className="px-4 py-2 text-xs font-semibold font-headline tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 rounded-lg transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer whitespace-nowrap flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>EXHIBITION PORTAL</span>
          </button>
        </div>
      </div>
    </header>
  );
}
