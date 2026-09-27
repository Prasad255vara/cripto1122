export interface FleetModel {
  id: string;
  name: string;
  designation: string;
  category: 'Scout' | 'Cargo' | 'Miner' | 'Reclaimer' | 'Explorer' | 'Surface' | 'Recon' | 'Dock';
  row: 1 | 2;
  platformTone: 'copper' | 'purple';
  role: string;
  length: string;
  crew: string;
  propulsion: string;
  maxVelocity: string;
  status: 'Exhibition Active' | 'Orbital Trials' | 'Deep Cruise' | 'Surface Ops';
  plateSerial: string;
  description: string;
  specs: {
    label: string;
    value: string;
  }[];
  cameraTarget: {
    position: [number, number, number];
    lookAt: [number, number, number];
  };
}

export interface MissionObjective {
  id: string;
  code: string;
  title: string;
  targetNode: string;
  colorTheme: 'blue' | 'green' | 'purple';
  status: string;
  progress: number;
  coordinates: string;
  summary: string;
  activeMetrics: {
    label: string;
    value: string;
  }[];
}

export interface DataHubStream {
  id: string;
  title: string;
  tagline: string;
  frequency: string;
  bandwidth: string;
  status: string;
  crystalHue: string;
  metrics: {
    key: string;
    val: string;
  }[];
}

export type CameraPreset = 'gallery' | 'astra1' | 'fleet' | 'console' | 'crystals' | 'hero' | 'habitat' | 'reactor' | 'solar' | 'drift';
