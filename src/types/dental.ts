export interface Treatment {
  id: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  materials: string[];
  duration: string;
  longevity: string;
  preservationRate: string;
  idealFor: string[];
}

export interface SmileCase {
  id: string;
  title: string;
  treatment: string;
  doctor: string;
  duration: string;
  teethCount: number;
  beforeDescription: string;
  afterDescription: string;
  highlights: string[];
  metrics: {
    label: string;
    value: string;
  }[];
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  credentials: string;
  specialty: string;
  experience: string;
  education: string[];
  quote: string;
  availability: string;
}

export interface BookingState {
  treatment: string;
  doctorId: string;
  date: string;
  timeSlot: string;
  name: string;
  email: string;
  phone: string;
  conciergeNotes: string;
  wantsSedation: boolean;
  referenceId: string;
}
