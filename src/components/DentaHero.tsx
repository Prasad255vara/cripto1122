import React, { useState, useEffect } from 'react';
import { Implant3D } from './Implant3D';
import { ChevronRight, ArrowRight, ShieldCheck, Clock, Sparkles } from 'lucide-react';

interface DentaHeroProps {
  onOpenHealthCheck: () => void;
  onNavigateSection: (sectionId: string) => void;
  onSelectDoctor: (doctorName: string) => void;
}

interface DoctorCard {
  id: string;
  name: string;
  role: string;
  specialty: string;
  experience: string;
  image: string;
}

export const DentaHero: React.FC<DentaHeroProps> = ({
  onOpenHealthCheck,
  onNavigateSection,
  onSelectDoctor,
}) => {
  // Live ticking clock in GMT+1 (Barcelona, Spain)
  const [timeStr, setTimeStr] = useState<string>('17:17:03 GMT+1');
  const [activeDoctorIndex, setActiveDoctorIndex] = useState<number>(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to GMT+1 / Europe/Madrid time
      try {
        const formatter = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Europe/Madrid',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        setTimeStr(`${formatter.format(now)} GMT+1`);
      } catch (e) {
        setTimeStr(now.toTimeString().split(' ')[0] + ' GMT+1');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const doctors: DoctorCard[] = [
    {
      id: 'clara-collins',
      name: 'Clara Collins',
      role: 'Lead Aesthetic Ceramist',
      specialty: 'Implants & Porcelain Aesthetics',
      experience: '14 Years',
      // High-grade styled medical portrait with fallback
      image: 'https://images.unsplash.com/photo-1594824813589-9a0082f42a78?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'mason-harper',
      name: 'Mason Harper',
      role: 'Oral Surgeon & Implantologist',
      specialty: 'Guided 3D Osteotomy',
      experience: '16 Years',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'sofia-martinez',
      name: 'Sofia Martinez',
      role: 'Micro-Endodontist',
      specialty: 'Biological Diagnostics',
      experience: '11 Years',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleNextDoctor = () => {
    setActiveDoctorIndex((prev) => (prev + 1) % doctors.length);
  };

  const currentDoctor = doctors[activeDoctorIndex];
  const nextDoctor = doctors[(activeDoctorIndex + 1) % doctors.length];

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#c94b1a] via-[#ab3b12] to-[#792408] text-white flex flex-col justify-between overflow-hidden">
      {/* Subtle background lighting effect */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#541604]/40 to-[#350d02]/80 pointer-events-none" />

      {/* TOP NAVIGATION BAR */}
      <header className="relative z-20 w-full px-6 sm:px-10 lg:px-14 py-7 flex items-center justify-between border-b border-white/[0.08]">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="grid grid-cols-2 gap-1 w-6 h-6">
            <span className="w-2.5 h-2.5 bg-white rounded-[2px]" />
            <span className="w-2.5 h-2.5 bg-white rounded-[2px]" />
            <span className="w-2.5 h-2.5 bg-white rounded-[2px]" />
            <span className="w-2 h-2 bg-white/70 rounded-[2px] translate-x-0.5 translate-y-0.5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white font-sans">
            Denta
          </span>
        </div>

        {/* Center Nav Links with clean bullets as shown in the screenshot */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90">
          <button
            onClick={() => onNavigateSection('services')}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <span className="text-white/60 text-xs">•</span>
            <span>Services</span>
          </button>
          <button
            onClick={() => onNavigateSection('implants')}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <span className="text-white/60 text-xs">•</span>
            <span>Implants</span>
          </button>
          <button
            onClick={() => onNavigateSection('pricing')}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <span className="text-white/60 text-xs">•</span>
            <span>Price</span>
          </button>
          <button
            onClick={() => onNavigateSection('preventive')}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <span className="text-white/60 text-xs">•</span>
            <span>Preventive Care</span>
          </button>
        </nav>

        {/* Right CTA Button: Health Check */}
        <button
          onClick={onOpenHealthCheck}
          className="px-6 py-2.5 text-sm font-medium border border-white/80 hover:border-white bg-white/5 hover:bg-white/15 text-white rounded-lg transition-all duration-200 tracking-wide shadow-sm"
        >
          Health Check
        </button>
      </header>

      {/* HERO MAIN BODY (Split 3-Zone Architecture) */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 items-center px-6 sm:px-10 lg:px-14 py-8 lg:py-4 gap-8">
        {/* LEFT COLUMN: Narrative & Massive Headline */}
        <div className="lg:col-span-4 flex flex-col justify-between h-full py-4 lg:py-8 space-y-12">
          {/* Top Editorial Subtext */}
          <p className="text-white/85 text-sm sm:text-base font-light leading-relaxed max-w-sm">
            From preventive care to complex restorations, a comprehensive approach to your dental health.
          </p>

          {/* Master Headline */}
          <div className="space-y-0.5">
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-light tracking-tight text-white leading-[1.05]">
              <span className="block font-normal">Modern</span>
              <span className="block font-normal">Care for</span>
              <span className="block font-normal">a Perfect</span>
              <span className="block font-medium">Smile</span>
            </h1>
          </div>
        </div>

        {/* CENTER COLUMN: Interactive 3D Dental Implant */}
        <div className="lg:col-span-5 flex items-center justify-center relative min-h-[460px] lg:min-h-[600px]">
          <Implant3D onInspect={onOpenHealthCheck} />
        </div>

        {/* RIGHT COLUMN: Doctors & Technology Carousel with Vertical Divider */}
        <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-white/[0.12] lg:pl-8 flex flex-col justify-between h-full py-4 lg:py-8 space-y-8 bg-black/[0.08] lg:bg-transparent rounded-2xl lg:rounded-none p-6 lg:p-0">
          {/* Top 'Next >' Control */}
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-white/60 font-mono">Specialists</span>
            <button
              onClick={handleNextDoctor}
              className="text-xs text-white/80 hover:text-white flex items-center gap-1 group py-1 px-2 rounded-md hover:bg-white/10 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Doctor Cards Showcase */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {/* Doctor 1 Card (Active) */}
              <div
                onClick={() => onSelectDoctor(currentDoctor.name)}
                className="group relative cursor-pointer overflow-hidden rounded-xl bg-black/30 border border-white/20 transition-all hover:border-white/50"
              >
                <div className="aspect-[3/4] w-full relative overflow-hidden bg-[#240c06]">
                  <img
                    src={currentDoctor.image}
                    alt={currentDoctor.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback elegant avatar container
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {/* Subtle scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="absolute bottom-2 left-2 right-2 text-left">
                  <span className="block text-xs font-semibold text-white tracking-wide truncate">
                    {currentDoctor.name}
                  </span>
                  <span className="block text-[10px] text-white/70 truncate">
                    {currentDoctor.role}
                  </span>
                </div>
              </div>

              {/* Doctor 2 Card (Next Preview) */}
              <div
                onClick={() => onSelectDoctor(nextDoctor.name)}
                className="group relative cursor-pointer overflow-hidden rounded-xl bg-black/20 border border-white/10 opacity-75 hover:opacity-100 transition-all hover:border-white/40"
              >
                <div className="aspect-[3/4] w-full relative overflow-hidden bg-[#1e0a05]">
                  <img
                    src={nextDoctor.image}
                    alt={nextDoctor.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="absolute bottom-2 left-2 right-2 text-left">
                  <span className="block text-xs font-semibold text-white tracking-wide truncate">
                    {nextDoctor.name}
                  </span>
                  <span className="block text-[10px] text-white/70 truncate">
                    {nextDoctor.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick consultation trigger with selected doctor */}
            <button
              onClick={() => onSelectDoctor(currentDoctor.name)}
              className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg text-xs font-medium text-white flex items-center justify-between transition-colors"
            >
              <span>Book with {currentDoctor.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom Right Label: Advanced Dental Technologies */}
          <div className="pt-6 border-t border-white/[0.12]">
            <span className="block text-sm font-normal text-white/95">
              Advanced Dental Technologies
            </span>
            <span className="block text-xs text-white/60 mt-0.5">
              3D CBCT · Swiss Ceramic · Zero Prep
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
