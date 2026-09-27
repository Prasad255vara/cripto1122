import React, { useState, useEffect } from 'react';
import ThreeCanvas from './components/ThreeCanvas';
import Navbar, { FontTheme } from './components/Navbar';
import ExhibitionBranding from './components/ExhibitionBranding';
import FleetDioramaSection from './components/FleetDioramaSection';
import InteractiveConsole from './components/InteractiveConsole';
import DataHubCrystals from './components/DataHubCrystals';
import StationSubsystems from './components/StationSubsystems';
import MissionModal from './components/MissionModal';
import Footer from './components/Footer';
import { CameraPreset } from './types';

export default function App() {
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('gallery');
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState<boolean>(false);
  const [preselectedFleet, setPreselectedFleet] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isReady, setIsReady] = useState<boolean>(false);
  const [fontTheme, setFontTheme] = useState<FontTheme>('space-grotesk');

  useEffect(() => {
    document.body.setAttribute('data-font', fontTheme);
  }, [fontTheme]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectNav = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      setCameraPreset('gallery');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenMission = (fleetName?: string) => {
    if (fleetName) {
      setPreselectedFleet(fleetName);
    }
    setIsMissionModalOpen(true);
  };

  return (
    <div
      className={`min-h-screen bg-black text-slate-100 relative selection:bg-amber-500/30 selection:text-amber-200 transition-opacity duration-1000 ${
        isReady ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Fixed Fullscreen 3D WebGL Exhibition Diorama Canvas */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-auto">
        <ThreeCanvas
          cameraPreset={cameraPreset}
          wireframe={wireframe}
          rotationSpeed={rotationSpeed}
        />
        {/* Subtle gallery vignette scrim */}
        <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,rgba(0,0,0,0.65)_100%] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90 pointer-events-none" />
      </div>

      {/* Top Bar Navigation */}
      <Navbar
        onOpenMission={() => handleOpenMission()}
        onSelectNav={handleSelectNav}
        activeSection={activeSection}
        currentFontTheme={fontTheme}
        onChangeFontTheme={(theme) => setFontTheme(theme)}
      />

      {/* Main Exhibition Sections Layered Over 3D Diorama */}
      <main className="relative z-10">
        {/* Exhibition Branding & Curation Hero */}
        <div id="hero">
          <ExhibitionBranding
            onJoinMission={() => handleOpenMission()}
            currentPreset={cameraPreset}
            onSelectPreset={(preset) => setCameraPreset(preset)}
          />
        </div>

        {/* Foreground Exhibition Content Sections */}
        <div className="bg-gradient-to-b from-transparent via-slate-950/85 to-slate-950/95 backdrop-blur-[3px]">
          {/* Detailed Model Displays: Physical Fleet Diorama on Copper & Purple Platforms */}
          <FleetDioramaSection
            onSelectPreset={(preset) => setCameraPreset(preset)}
            onOpenMissionWithFleet={(fleetName) => handleOpenMission(fleetName)}
          />

          {/* Interactive Console: Bottom Right Console with 3 Mission Screens & Physical Controls */}
          <InteractiveConsole
            onFocusScreen={(screenId) => {
              setCameraPreset('console');
            }}
          />

          {/* Integrated Data Hubs: Glowing Crystal Modules & Metal Plates */}
          <DataHubCrystals
            onSelectPreset={(preset) => setCameraPreset(preset)}
          />

          {/* Centerpiece Space Station: ASTRA-1 Megastructure Details */}
          <StationSubsystems
            onSelectPreset={(preset) => setCameraPreset(preset)}
            wireframe={wireframe}
            onToggleWireframe={() => setWireframe((prev) => !prev)}
            rotationSpeed={rotationSpeed}
            onChangeRotationSpeed={(speed) => setRotationSpeed(speed)}
          />

          {/* Museum Curation Footer */}
          <Footer
            onSelectNav={handleSelectNav}
            onOpenMission={() => handleOpenMission()}
          />
        </div>
      </main>

      {/* Mission & Launch Manifest Portal Modal */}
      <MissionModal
        isOpen={isMissionModalOpen}
        onClose={() => setIsMissionModalOpen(false)}
        preselectedFleet={preselectedFleet}
      />
    </div>
  );
}
