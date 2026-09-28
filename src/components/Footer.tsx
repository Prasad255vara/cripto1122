import React, { useState } from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface FooterProps {
  onOpenHealthCheck: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenHealthCheck }) => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer className="w-full bg-[#110401] border-t border-white/10 text-white/80 py-16 px-6 sm:px-10 lg:px-14">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        {/* Left Side: Exact Typography from User's Screenshot */}
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] font-mono text-[#c65529]">
              Copyright © 2026 Denta
            </p>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] font-mono text-[#c65529]">
              <button
                onClick={() => setActiveModal('privacy')}
                className="hover:underline hover:text-white transition-colors cursor-pointer"
              >
                Privacy Notice
              </button>
              <span className="text-[#c65529]/60">|</span>
              <button
                onClick={() => setActiveModal('terms')}
                className="hover:underline hover:text-white transition-colors cursor-pointer"
              >
                Terms of Use
              </button>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-xs uppercase tracking-[0.2em] font-mono text-[#c65529]">
              Design: Griflan
            </p>
          </div>
        </div>

        {/* Right Side: Direct Clinic Contact & Quick Navigation */}
        <div className="space-y-4 text-xs text-white/60 font-mono text-left md:text-right">
          <div>
            <span className="text-white/40 block text-[10px] uppercase">Clinic Headquarters</span>
            <span className="text-white">Avinguda Diagonal 452, 08006 Barcelona, Spain</span>
          </div>

          <div>
            <span className="text-white/40 block text-[10px] uppercase">Direct Concierge</span>
            <a href="tel:+34932187640" className="text-white hover:text-[#ff9248] transition-colors">
              +34 932 187 640
            </a>
          </div>

          <button
            onClick={onOpenHealthCheck}
            className="mt-2 px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold tracking-wide transition-colors"
          >
            Book Health Check
          </button>
        </div>
      </div>

      {/* Privacy Notice Modal */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#1f0904] border border-white/20 rounded-2xl p-6 sm:p-8 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#ff9248]" />
                <h3 className="text-sm font-semibold uppercase tracking-wider font-mono">
                  Privacy Notice &amp; Medical Confidentiality
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-white/80 leading-relaxed space-y-3 font-sans max-h-80 overflow-y-auto pr-2">
              <p>
                At Denta, your medical records, 3D intraoral scans, and personal diagnostic data are protected under European Union GDPR regulations and rigorous health information privacy standards.
              </p>
              <p>
                1. <strong>Intraoral Data Security</strong>: Digital jaw scans, photographs, and treatment designs are encrypted end-to-end and stored on secure medical-grade servers located in the EU.
              </p>
              <p>
                2. <strong>No Third-Party Sharing</strong>: Your personal information is never sold, traded, or shared with external marketing agencies.
              </p>
              <p>
                3. <strong>Patient Rights</strong>: You may request complete export or deletion of your non-statutory records at any time through our patient concierge.
              </p>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Terms of Use Modal */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#1f0904] border border-white/20 rounded-2xl p-6 sm:p-8 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#ff9248]" />
                <h3 className="text-sm font-semibold uppercase tracking-wider font-mono">
                  Terms of Treatment &amp; Clinical Protocols
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-white/80 leading-relaxed space-y-3 font-sans max-h-80 overflow-y-auto pr-2">
              <p>
                Welcome to Denta. All clinical consultations, restorative fabrications, and surgical treatments are conducted in compliance with Spanish Dental Association (COEC) protocols.
              </p>
              <p>
                1. <strong>Clinical Assessment</strong>: Final treatment feasibility is determined following in-person 3D CBCT bone analysis and comprehensive clinical evaluation.
              </p>
              <p>
                2. <strong>Warranty Terms</strong>: Ceramic veneer and implant structural guarantees apply provided standard annual preventive checkups and biofilm hygiene protocols are maintained.
              </p>
              <p>
                3. <strong>Cancellation Policy</strong>: Private treatment suite reservations require 48 hours prior notice for rescheduling.
              </p>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
