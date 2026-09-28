import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Clock, Check, ArrowRight, Layers, Award } from 'lucide-react';

interface ServicesSectionProps {
  onBookService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onBookService }) => {
  const [selectedService, setSelectedService] = useState<number>(0);

  const services = [
    {
      id: 'implants',
      number: '01',
      title: 'Guided Dental Implants',
      tagline: 'Titanium & Zirconia Osteointegration',
      description: 'Using 3D CBCT digital navigational surgery, we place biocompatible titanium and ceramic implants with sub-millimeter precision for natural osseous integration and permanent stability.',
      specs: [
        { label: 'Precision', value: '±0.15mm CBCT Guided' },
        { label: 'Success Rate', value: '99.2% Clinical Retention' },
        { label: 'Recovery', value: 'Immediate Provisional Loading' },
        { label: 'Warranty', value: 'Lifetime Structural Guarantee' },
      ],
      idealFor: ['Single missing tooth', 'Full-arch All-on-4 / All-on-6', 'Failing bridge replacement'],
    },
    {
      id: 'veneers',
      number: '02',
      title: 'Minimal-Prep Porcelain Veneers',
      tagline: 'Master Swiss Feldspathic Ceramic',
      description: 'Ultra-thin (0.2mm) hand-layered ceramic veneers created under Carl Zeiss microscopic magnification, preserving over 95% of natural tooth enamel while correcting shape, color, and symmetry.',
      specs: [
        { label: 'Enamel Prep', value: '0.2mm Ultra-Conservative' },
        { label: 'Translucency', value: 'Multi-layer Incisal Halo' },
        { label: 'Visits', value: '2 Precision Appointments' },
        { label: 'Ceramics', value: 'Swiss E.max & Feldspathic' },
      ],
      idealFor: ['Discoloration resistant to whitening', 'Chipped or uneven enamel', 'Golden ratio smile realignment'],
    },
    {
      id: 'preventive',
      number: '03',
      title: 'Guided Biofilm Preventive Care',
      tagline: 'Non-Invasive Airflow Remineralization',
      description: 'Swiss EMS Airflow technology gently removes microscopic bacterial biofilm, stains, and calculus using warm water and erythritol powder without touching or scratching delicate enamel.',
      specs: [
        { label: 'Sensation', value: '100% Painless Warm Hydro-Flow' },
        { label: 'Diagnostics', value: '3D TRIOS Digital Scanning' },
        { label: 'Duration', value: '45 Minutes' },
        { label: 'Enamel Impact', value: 'Zero Scratches or Abrasions' },
      ],
      idealFor: ['Semi-annual biological checkups', 'Implant maintenance', 'Deep stain removal before events'],
    },
    {
      id: 'reconstruction',
      number: '04',
      title: 'Full-Arch Restorative Reconstruction',
      tagline: 'Neuromuscular Bite Elevation',
      description: 'Comprehensive restorative engineering restoring collapsed vertical dimension of occlusion, chronic TMJ wear, and severely fractured dentition into a youthful, balanced functional smile.',
      specs: [
        { label: 'Approach', value: 'Biomimetic Digital Planning' },
        { label: 'Jaw Relief', value: 'TMJ Muscle Deprogramming' },
        { label: 'Materials', value: 'Monolithic Katana Zirconia' },
        { label: 'Lifespan', value: '25+ Years Functional Lifespan' },
      ],
      idealFor: ['Severe bruxism (grinding) wear', 'Full mouth restoration', 'Chronic jaw joint tension'],
    },
  ];

  return (
    <section id="services" className="relative py-24 bg-[#1a0703] border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#ff9248] font-mono">
            <span>• Clinical Spectrum</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white">
            Specialized Care &amp; Architectural Precision
          </h2>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            Every procedure at Denta combines biological tissue conservation with advanced Swiss ceramic craftsmanship.
          </p>
        </div>

        {/* Interactive Service Selector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Column */}
          <div className="lg:col-span-5 space-y-3">
            {services.map((svc, idx) => (
              <div
                key={svc.id}
                onClick={() => setSelectedService(idx)}
                className={`p-6 rounded-2xl cursor-pointer border transition-all duration-300 ${
                  selectedService === idx
                    ? 'bg-gradient-to-r from-[#882b0e] to-[#5a1b09] border-[#ec5b24] shadow-xl translate-x-2'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#ff9248]">{svc.number}</span>
                  {selectedService === idx && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/20 text-white">
                      Selected
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-medium text-white mt-1">{svc.title}</h3>
                <p className="text-xs text-white/70 mt-1">{svc.tagline}</p>
              </div>
            ))}
          </div>

          {/* Active Service Showcase Card */}
          <div className="lg:col-span-7 bg-[#280c06] border border-white/15 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#ec5b24]/10 blur-3xl pointer-events-none rounded-full" />

            <div className="relative z-10 space-y-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#ff9248] font-mono">
                  Treatment Spec Sheet {services[selectedService].number}
                </span>
                <h3 className="text-2xl sm:text-3xl font-light text-white mt-1">
                  {services[selectedService].title}
                </h3>
                <p className="text-sm text-white/80 leading-relaxed mt-3">
                  {services[selectedService].description}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10">
                {services[selectedService].specs.map((spec, i) => (
                  <div key={i} className="space-y-1">
                    <span className="text-[11px] text-white/50 uppercase tracking-wider block font-mono">
                      {spec.label}
                    </span>
                    <span className="text-sm font-semibold text-white block font-mono-numbers">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Recommended Candidates */}
              <div>
                <span className="text-xs uppercase tracking-wider text-white/60 block font-mono mb-2">
                  Clinical Indications:
                </span>
                <div className="flex flex-wrap gap-2">
                  {services[selectedService].idealFor.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white/90"
                    >
                      <Check className="w-3.5 h-3.5 text-[#ff9248]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={() => onBookService(services[selectedService].title)}
                className="w-full py-3.5 bg-[#ec5b24] hover:bg-[#ff6f38] text-[#190401] font-semibold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Schedule Consultation For {services[selectedService].title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
