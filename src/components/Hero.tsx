import React from 'react';
import { ArrowUpRight, ShieldCheck, Sparkles, Compass } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onExplore3D: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onExplore3D }) => {
  return (
    <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-white/[0.06] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#c6a87c]/[0.06] blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-[#38bdf8]/[0.03] blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Subtle Top Kicker - Unboxed, no pill badges */}
          <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.25em] text-[#c6a87c]">
            <span className="w-8 h-[1px] bg-[#c6a87c]/40" />
            <span>Center For Biological Aesthetics &amp; Restorative Surgery</span>
            <span className="w-8 h-[1px] bg-[#c6a87c]/40" />
          </div>

          {/* Master Headline with text-wrap balance */}
          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal tracking-tight text-white leading-[1.08]"
            style={{ textWrap: 'balance' }}
          >
            Architectural Dentistry &amp; Sculptural Aesthetics
          </h1>

          {/* Concrete Value Proposition */}
          <p
            className="text-base sm:text-lg text-slate-300 font-editorial italic max-w-2xl mx-auto leading-relaxed"
            style={{ textWrap: 'balance' }}
          >
            We curate bespoke facial harmony using minimal-preparation feldspathic porcelain, 
            sub-millimeter guided implantology, and Carl Zeiss microscopic precision. 
            Engineered to endure for a lifetime.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto px-8 py-4 text-xs uppercase tracking-[0.2em] font-semibold text-[#07080b] bg-[#c6a87c] hover:bg-[#d8bc92] rounded-xl transition-all shadow-xl hover:shadow-[#c6a87c]/25 flex items-center justify-center gap-2 group"
            >
              <span>Schedule Private Consultation</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button
              onClick={onExplore3D}
              className="w-full sm:w-auto px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#c6a87c]" />
              <span>Inspect 3D Ceramic Anatomy</span>
            </button>
          </div>

          {/* Proof Standards - Clean unboxed metadata with typographic separators */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-slate-400 font-mono-numbers">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c6a87c]" />
              <span>0.2mm Conservative Enamel Prep</span>
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#c6a87c]" />
              <span>99.4% 15-Year Retention Rate</span>
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div className="flex items-center gap-2">
              <span>Carl Zeiss 28x Micro-Surgical Optics</span>
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div className="flex items-center gap-2">
              <span>Swiss &amp; German Ceramic Milling</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
