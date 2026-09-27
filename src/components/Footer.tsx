import React from 'react';

interface FooterProps {
  onSelectNav: (id: string) => void;
  onOpenMission: () => void;
}

export default function Footer({ onSelectNav, onOpenMission }: FooterProps) {
  return (
    <footer className="relative z-20 border-t border-slate-800 bg-black/95 py-12 px-6 sm:px-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-sm font-bold font-headline tracking-widest text-amber-300 mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            ASTROGENESIS INITIATIVE
          </div>
          <p className="text-slate-400">
            Exoplanet Colonization & Advanced Deep Space Habitats: Beyond the Red Horizon.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <button
            onClick={() => onSelectNav('hero')}
            className="hover:text-amber-300 transition-colors cursor-pointer"
          >
            Installation Overview
          </button>
          <button
            onClick={() => onSelectNav('fleet')}
            className="hover:text-amber-300 transition-colors cursor-pointer"
          >
            Fleet Diorama
          </button>
          <button
            onClick={() => onSelectNav('console')}
            className="hover:text-amber-300 transition-colors cursor-pointer"
          >
            Mission Console
          </button>
          <button
            onClick={() => onSelectNav('crystals')}
            className="hover:text-amber-300 transition-colors cursor-pointer"
          >
            Data Crystals
          </button>
          <button
            onClick={() => onSelectNav('megastructure')}
            className="hover:text-amber-300 transition-colors cursor-pointer"
          >
            ASTRA-1 Core
          </button>
          <button
            onClick={onOpenMission}
            className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer font-semibold"
          >
            Exhibition Portal
          </button>
        </div>

        <div className="text-slate-400 font-mono-numbers">
          © {new Date().getFullYear()} Astrogenesis Initiative · Sector 07 Museum Curation.
        </div>
      </div>
    </footer>
  );
}
