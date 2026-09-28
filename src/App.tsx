import React, { useState } from 'react';
import { DentaHero } from './components/DentaHero';
import { ServicesSection } from './components/ServicesSection';
import { PricingSection } from './components/PricingSection';
import { HealthCheckModal } from './components/HealthCheckModal';
import { Footer } from './components/Footer';

export function App() {
  const [isHealthCheckOpen, setIsHealthCheckOpen] = useState<boolean>(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('Clara Collins');

  const handleOpenHealthCheck = (doctorName?: string) => {
    if (doctorName) {
      setSelectedDoctor(doctorName);
    }
    setIsHealthCheckOpen(true);
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#110401] text-white selection:bg-[#ec5b24] selection:text-white">
      {/* 1. DENTA HERO (Exact replica of the uploaded reference photo) */}
      <DentaHero
        onOpenHealthCheck={() => handleOpenHealthCheck()}
        onNavigateSection={handleNavigateSection}
        onSelectDoctor={(doc) => handleOpenHealthCheck(doc)}
      />

      {/* 2. CLINICAL SERVICES & 3D SPECS */}
      <div id="implants">
        <ServicesSection
          onBookService={(service) => handleOpenHealthCheck()}
        />
      </div>

      {/* 3. TRANSPARENT PRICING & SMILE CALCULATOR */}
      <div id="preventive">
        <PricingSection
          onBookTreatment={(treatment) => handleOpenHealthCheck()}
        />
      </div>

      {/* 4. FOOTER (Exact copy of user's copyright & credits screenshot) */}
      <Footer onOpenHealthCheck={() => handleOpenHealthCheck()} />

      {/* 5. HEALTH CHECK MODAL (Interactive Booking & Diagnostic Flow) */}
      <HealthCheckModal
        isOpen={isHealthCheckOpen}
        onClose={() => setIsHealthCheckOpen(false)}
        preselectedDoctor={selectedDoctor}
      />
    </div>
  );
}

export default App;
