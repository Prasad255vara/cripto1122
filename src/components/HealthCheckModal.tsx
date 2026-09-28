import React, { useState } from 'react';
import { X, CheckCircle2, Calendar, Clock, User, Phone, Mail, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

interface HealthCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDoctor?: string;
}

export const HealthCheckModal: React.FC<HealthCheckModalProps> = ({
  isOpen,
  onClose,
  preselectedDoctor = 'Clara Collins',
}) => {
  const [step, setStep] = useState<number>(1);
  const [concern, setConcern] = useState<string>('implant');
  const [painLevel, setPainLevel] = useState<string>('mild');
  const [selectedDoctor, setSelectedDoctor] = useState<string>(preselectedDoctor);
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-02');
  const [selectedTime, setSelectedTime] = useState<string>('11:30 AM');
  const [patientName, setPatientName] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [confirmationCode, setConfirmationCode] = useState<string>('');

  if (!isOpen) return null;

  const concernsList = [
    { id: 'implant', title: 'Dental Implant & Restoration', desc: 'Missing tooth replacement, 3D guided titanium implant' },
    { id: 'cosmetic', title: 'Cosmetic Veneers & Aesthetics', desc: 'Smile symmetry, porcelain veneers, tooth contouring' },
    { id: 'pain', title: 'Sensitivity or Discomfort', desc: 'Enamel wear, nerve pain, urgent evaluation' },
    { id: 'preventive', title: 'Preventive Care & Deep Cleaning', desc: 'Airflow biofilm cleaning, digital 3D oral scan' },
  ];

  const timeSlots = ['09:30 AM', '11:00 AM', '02:15 PM', '04:00 PM', '05:30 PM'];

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `DENTA-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmationCode(code);
    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#210904] to-[#140502] border border-white/20 rounded-2xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden">
        {/* Ambient Warm Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ec5b24]/15 blur-3xl pointer-events-none rounded-full" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 relative z-10">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#ff9248] font-mono">Denta Clinical Intake</span>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white mt-0.5">
              {step === 3 ? 'Consultation Confirmed' : 'Dental Health Check'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Assessment of Concern */}
        {step === 1 && (
          <div className="py-6 space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-3">
                1. What is your primary dental focus today?
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {concernsList.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setConcern(item.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      concern === item.id
                        ? 'bg-[#ec5b24]/20 border-[#ec5b24] text-white shadow-sm'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-semibold text-sm">{item.title}</div>
                    <div className="text-xs text-white/60 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                2. Do you experience current discomfort?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['None (Routine)', 'Mild / Sensitive', 'Acute Discomfort'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPainLevel(lvl)}
                    className={`py-2 px-3 text-xs rounded-lg border text-center transition-all ${
                      painLevel === lvl
                        ? 'bg-[#ec5b24] text-[#1a0501] font-bold border-[#ec5b24]'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 bg-[#ec5b24] hover:bg-[#ff6f38] text-[#190401] font-semibold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>Continue to Schedule</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Doctor & Time Slot Scheduling */}
        {step === 2 && (
          <form onSubmit={handleCompleteBooking} className="py-6 space-y-5 relative z-10">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">Doctor</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/20 text-xs text-white focus:outline-none focus:border-[#ec5b24]"
                >
                  <option value="Clara Collins">Dr. Clara Collins (Aesthetic &amp; Implants)</option>
                  <option value="Mason Harper">Dr. Mason Harper (Oral Surgery)</option>
                  <option value="Sofia Martinez">Dr. Sofia Martinez (Micro-Diagnostics)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/20 text-xs text-white focus:outline-none focus:border-[#ec5b24]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Preferred Slot</label>
              <div className="grid grid-cols-5 gap-1.5">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 text-[11px] rounded-lg border text-center transition-colors font-mono ${
                      selectedTime === slot
                        ? 'bg-[#ec5b24] text-[#1a0501] font-bold border-[#ec5b24]'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <input
                type="text"
                placeholder="Full Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#ec5b24]"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#ec5b24]"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#ec5b24]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 border border-white/20 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 py-3 bg-[#ec5b24] hover:bg-[#ff6f38] text-[#190401] font-semibold text-xs rounded-xl transition-all shadow-lg"
              >
                Confirm Appointment
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Instant Confirmation State */}
        {step === 3 && (
          <div className="py-6 text-center space-y-6 relative z-10">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#ec5b24]/20 border border-[#ec5b24] flex items-center justify-center text-[#ff9248]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#ff9248] font-mono">
                Booking Reference: {confirmationCode}
              </span>
              <h3 className="text-xl font-semibold text-white">Your Health Check is Reserved</h3>
              <p className="text-xs text-white/70 max-w-sm mx-auto">
                We look forward to welcoming you at Denta Barcelona. A confirmation SMS and email have been sent.
              </p>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-xl p-4 text-xs space-y-2 text-left text-white/80 font-mono-numbers">
              <div className="flex justify-between">
                <span className="text-white/50">Patient:</span>
                <span className="text-white font-medium">{patientName || 'Private Patient'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Specialist:</span>
                <span className="text-white font-medium">{selectedDoctor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Schedule:</span>
                <span className="text-white font-medium">{selectedDate} at {selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Clinic:</span>
                <span className="text-white font-medium">Avinguda Diagonal 452, Barcelona</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold text-white transition-colors"
            >
              Done &amp; Return to Atelier
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
