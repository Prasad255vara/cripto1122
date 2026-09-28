import React, { useState } from 'react';
import { Calculator, Check, ArrowRight, Shield } from 'lucide-react';

interface PricingSectionProps {
  onBookTreatment: (title: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onBookTreatment }) => {
  const [veneerCount, setVeneerCount] = useState<number>(8);
  const [includeScan, setIncludeScan] = useState<boolean>(true);
  const [includeSedation, setIncludeSedation] = useState<boolean>(false);

  // Price calculations in Euros (Barcelona)
  const baseVeneerPrice = 850;
  const scanPrice = includeScan ? 180 : 0;
  const sedationPrice = includeSedation ? 350 : 0;
  const calculatedTotal = veneerCount * baseVeneerPrice + scanPrice + sedationPrice;
  const monthlyEstimate = Math.round(calculatedTotal / 12);

  const priceTiers = [
    {
      title: 'Guided Dental Implant',
      price: '€1,450',
      period: 'per tooth completed',
      desc: 'Surgical CBCT guide, Swiss titanium fixture, custom zirconia abutment, and final ceramic crown.',
      features: [
        '3D CBCT bone density mapping',
        'Grade-5 biocompatible titanium post',
        'Custom porcelain-fused-zirconia crown',
        'Lifetime structural osseointegration warranty',
      ],
    },
    {
      title: 'Minimal-Prep Veneer',
      price: '€850',
      period: 'per master veneer',
      desc: 'Ultra-thin (0.2mm) hand-layered Swiss feldspathic ceramic with multi-layer incisal translucency.',
      features: [
        'Digital Smile Design (DSD) preview',
        '0.2mm ultra-conservative enamel prep',
        'Handcrafted in-house master ceramist work',
        '10-year aesthetic guarantee',
      ],
      highlight: true,
    },
    {
      title: 'Preventive Airflow Suite',
      price: '€140',
      period: 'per session',
      desc: 'Comprehensive biological cleaning, subgingival biofilm removal, and digital enamel check.',
      features: [
        'Swiss EMS Airflow warm hydro-clean',
        'Painless ultrasonic tartar removal',
        'High-resolution intraoral camera photography',
        'Remineralizing hydroxyapatite polish',
      ],
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#140502] border-b border-white/10 text-white relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#ff9248] font-mono">
            <span>• Investment Transparency</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white">
            Direct &amp; Transparent Treatment Pricing
          </h2>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            All prices include initial digital diagnostics, master laboratory fabrications, and our lifetime ceramic warranty.
          </p>
        </div>

        {/* 3 Main Price Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {priceTiers.map((tier, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 relative ${
                tier.highlight
                  ? 'bg-gradient-to-b from-[#70210b] to-[#431204] border-[#ec5b24] shadow-2xl scale-[1.02]'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20'
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-8 px-3 py-1 bg-[#ec5b24] text-[#190401] text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Most Requested
                </span>
              )}

              <div>
                <span className="text-xs uppercase tracking-wider text-white/50 font-mono block">
                  {tier.period}
                </span>
                <div className="text-3xl sm:text-4xl font-semibold text-white mt-1 font-mono-numbers">
                  {tier.price}
                </div>
                <h3 className="text-xl font-medium text-white mt-2">{tier.title}</h3>
                <p className="text-xs text-white/70 mt-2 leading-relaxed">{tier.desc}</p>

                <div className="pt-6 mt-6 border-t border-white/10 space-y-3">
                  {tier.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-white/85">
                      <Check className="w-3.5 h-3.5 text-[#ff9248] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onBookTreatment(tier.title)}
                className={`mt-8 w-full py-3 rounded-xl text-xs font-semibold transition-all ${
                  tier.highlight
                    ? 'bg-[#ec5b24] hover:bg-[#ff6f38] text-[#190401] shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                Inquire About {tier.title}
              </button>
            </div>
          ))}
        </div>

        {/* Interactive Treatment Cost Calculator */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#280c06] border border-white/15 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#ff9248] font-mono">
                <Calculator className="w-4 h-4" />
                <span>Interactive Smile Designer Estimate</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-light text-white">
                Customize Your Smile Architecture
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Adjust the number of aesthetic porcelain veneers and private suite amenities to see instant itemized pricing.
              </p>

              {/* Slider: Number of Teeth */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-white/80">
                  <span>Number of Porcelain Veneers:</span>
                  <strong className="text-[#ff9248] font-mono-numbers text-sm">{veneerCount} Teeth</strong>
                </div>
                <input
                  type="range"
                  min="2"
                  max="16"
                  step="1"
                  value={veneerCount}
                  onChange={(e) => setVeneerCount(parseInt(e.target.value))}
                  className="w-full accent-[#ec5b24] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-white/40 font-mono">
                  <span>2 (Accent Duo)</span>
                  <span>8 (Upper Social Smile)</span>
                  <span>16 (Complete Transformation)</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                  <input
                    type="checkbox"
                    checked={includeScan}
                    onChange={(e) => setIncludeScan(e.target.checked)}
                    className="accent-[#ec5b24] w-4 h-4 rounded"
                  />
                  <span>Includes 3D TRIOS Scan (€180)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                  <input
                    type="checkbox"
                    checked={includeSedation}
                    onChange={(e) => setIncludeSedation(e.target.checked)}
                    className="accent-[#ec5b24] w-4 h-4 rounded"
                  />
                  <span>Conscious Spa Sedation (€350)</span>
                </label>
              </div>
            </div>

            {/* Total Display Card */}
            <div className="w-full lg:w-80 bg-black/40 border border-white/15 rounded-2xl p-6 text-center space-y-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-white/50 block font-mono">
                  Estimated Investment
                </span>
                <div className="text-4xl font-bold text-white mt-1 font-mono-numbers">
                  €{calculatedTotal.toLocaleString()}
                </div>
                <span className="text-xs text-[#ff9248] block mt-1 font-mono-numbers">
                  or ~€{monthlyEstimate}/mo (0% Interest Financing)
                </span>
              </div>

              <div className="pt-4 border-t border-white/10 text-[11px] text-white/60 space-y-1 text-left font-mono-numbers">
                <div className="flex justify-between">
                  <span>{veneerCount}x Veneers:</span>
                  <span className="text-white">€{(veneerCount * baseVeneerPrice).toLocaleString()}</span>
                </div>
                {includeScan && (
                  <div className="flex justify-between">
                    <span>3D Diagnostics:</span>
                    <span className="text-white">€180</span>
                  </div>
                )}
                {includeSedation && (
                  <div className="flex justify-between">
                    <span>Conscious Sedation:</span>
                    <span className="text-white">€350</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => onBookTreatment(`${veneerCount} Porcelain Veneers Smile Plan`)}
                className="w-full py-3 bg-[#ec5b24] hover:bg-[#ff6f38] text-[#190401] font-semibold text-xs rounded-xl transition-all shadow-lg"
              >
                Reserve Consultation Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
