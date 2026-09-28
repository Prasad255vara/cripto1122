import React from 'react';
import { Calendar, Phone } from 'lucide-react';

interface NavigationProps {
  onOpenBooking: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenBooking }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#07080b]/80 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          className="text-lg md:text-xl font-serif tracking-[0.25em] uppercase text-white hover:text-[#c6a87c] transition-colors"
        >
          Aura Dental Atelier
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.18em] text-slate-300 font-medium">
          <a
            href="#atelier"
            className="hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#c6a87c] hover:after:w-full after:transition-all"
          >
            Atelier
          </a>
          <a
            href="#treatments"
            className="hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#c6a87c] hover:after:w-full after:transition-all"
          >
            Treatments
          </a>
          <a
            href="#smile-gallery"
            className="hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#c6a87c] hover:after:w-full after:transition-all"
          >
            Smile Gallery
          </a>
          <a
            href="#technology"
            className="hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#c6a87c] hover:after:w-full after:transition-all"
          >
            Technology
          </a>
          <a
            href="#investment"
            className="hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#c6a87c] hover:after:w-full after:transition-all"
          >
            Investment
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <a
            href="tel:+18002872336"
            className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs font-mono-numbers text-slate-300 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#c6a87c]" />
            <span>+1 (800) 287-2336</span>
          </a>

          <button
            onClick={onOpenBooking}
            className="px-5 py-2.5 text-xs uppercase tracking-[0.16em] font-semibold text-[#07080b] bg-[#c6a87c] hover:bg-[#d8bc92] rounded-lg transition-all shadow-md hover:shadow-[#c6a87c]/20 whitespace-nowrap"
          >
            Reserve Consultation
          </button>
        </div>
      </div>
    </header>
  );
};
