import { ArrowLeft, Bell, ChevronDown, Syringe, Stethoscope, Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const stats = [
  { label: 'Weight', value: '21kg' },
  { label: 'Height', value: '56cm' },
  { label: 'Activity', value: 'High' },
];

const medicalRecords = [
  { icon: Syringe, title: 'Rabies Vaccination', date: 'Jan 13, 2025', color: 'text-primary bg-primary-fixed' },
  { icon: Stethoscope, title: 'Annual Wellness Checkup', date: 'Aug 29, 2024', color: 'text-secondary bg-secondary-container' },
];

const appointments = [
  {
    day: '24',
    month: 'NOV',
    title: 'Grooming & Spa Day',
    sub: '9:30 AM · Pawz & Glam Salon',
    accent: 'bg-primary',
  },
];

const recentActivity = [
  { label: 'Vaccination', sub: 'Logged a 30-min walk in the park', time: '2h ago' },
  { label: 'Monthly Fee payment', sub: 'Monthly fee payment applied', time: '1d ago' },
  { label: 'Weight Update', sub: 'Weight increased +0.3kg since last visit', time: '3d ago' },
];

export default function PetProfile() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 md:px-10 py-8">
        {/* Back nav + title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-secondary text-sm font-medium hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
            >
              <ArrowLeft size={16} /> PetCare Copilot
            </Link>
          </div>
          <button className="p-2 text-secondary hover:text-on-secondary-fixed hover:bg-surface-container-low rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95">
            <Bell size={18} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main column */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Pet hero card */}
            <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0_8px_32px_-8px_rgba(67,70,88,0.08)]">
              {/* Pet image */}
              <div className="relative h-56">
                <img
                  src="https://placehold.co/800x224/e8e8e8/5b5d70?text=Luna"
                  alt="Luna"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Name + stats */}
              <div className="px-6 py-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="font-display text-3xl font-semibold text-on-secondary-fixed tracking-tight">Luna</h1>
                    <p className="text-secondary text-sm mt-1">Golden Retriever · Female · 3 years old</p>
                  </div>
                  <span className="bg-primary-fixed text-primary text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                    Healthy
                  </span>
                </div>

                {/* Stat chips */}
                <div className="flex gap-3">
                  {stats.map((s) => (
                    <div key={s.label} className="flex-1 bg-surface-container-low rounded-[1.5rem] px-4 py-3 text-center">
                      <p className="font-display font-semibold text-on-secondary-fixed text-lg">{s.value}</p>
                      <p className="text-secondary text-xs mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Tab chips */}
                <div className="flex gap-2 mt-4">
                  {['Overview', 'Vaccines', 'Nutrition', 'Behavior'].map((tab, i) => (
                    <button
                      key={tab}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95 ${
                        i === 0
                          ? 'bg-primary-fixed text-primary'
                          : 'bg-surface-container text-secondary hover:bg-surface-container-high'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Overview section */}
            <div className="bg-surface-container-lowest rounded-[2rem] px-6 py-5 shadow-[0_4px_16px_-4px_rgba(67,70,88,0.06)]">
              <button className="flex items-center justify-between w-full group focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-lg">
                <div className="flex items-center gap-2 text-on-secondary-fixed font-display font-semibold">
                  <span className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center text-secondary text-xs">ℹ</span>
                  Overview
                </div>
                <ChevronDown size={16} className="text-secondary group-hover:opacity-70 transition-opacity" />
              </button>
              <div className="mt-4 text-secondary text-sm leading-relaxed">
                <p>
                  Luna is a gentle, energetic Golden Retriever who loves morning walks in the park and greeting all her buddies.
                  She's highly vocal with lots of appetite and has a known food allergy to tree nuts.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-secondary uppercase tracking-widest font-semibold mb-1">Insurance ID</p>
                    <p className="text-on-secondary-fixed font-medium text-sm">985-712-004-928</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary uppercase tracking-widest font-semibold mb-1">Microchip Policy</p>
                    <p className="text-on-secondary-fixed font-medium text-sm">PetShield #XP-042</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Records */}
            <div className="bg-surface-container-lowest rounded-[2rem] px-6 py-5 shadow-[0_4px_16px_-4px_rgba(67,70,88,0.06)]">
              <button className="flex items-center justify-between w-full group focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-lg">
                <div className="flex items-center gap-2 text-on-secondary-fixed font-display font-semibold">
                  <span className="w-6 h-6 rounded-full bg-primary-fixed flex items-center justify-center">
                    <Stethoscope size={12} className="text-primary" />
                  </span>
                  Medical Records
                </div>
                <ChevronDown size={16} className="text-secondary group-hover:opacity-70 transition-opacity" />
              </button>

              <ul className="mt-4 space-y-3">
                {medicalRecords.map((r, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${r.color}`}>
                      <r.icon size={14} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-on-secondary-fixed">{r.title}</p>
                    </div>
                    <p className="text-xs text-secondary">{r.date}</p>
                  </li>
                ))}
              </ul>

              <button className="mt-4 text-sm text-primary font-medium hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
                View All History →
              </button>
            </div>

            {/* Appointments */}
            <div className="bg-surface-container-lowest rounded-[2rem] px-6 py-5 shadow-[0_4px_16px_-4px_rgba(67,70,88,0.06)]">
              <div className="flex items-center gap-2 text-on-secondary-fixed font-display font-semibold mb-4">
                <span className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center">
                  <Scissors size={12} className="text-secondary" />
                </span>
                Appointments
              </div>

              {appointments.map((a, i) => (
                <div key={i} className="flex items-center gap-4 bg-surface-container-low rounded-[1.5rem] px-4 py-3">
                  <div className={`${a.accent} text-on-primary rounded-[1rem] px-3 py-2 text-center shrink-0 min-w-[48px]`}>
                    <p className="font-display font-bold text-lg leading-tight">{a.day}</p>
                    <p className="text-[10px] font-semibold opacity-80 uppercase">{a.month}</p>
                  </div>
                  <div>
                    <p className="font-medium text-on-secondary-fixed text-sm">{a.title}</p>
                    <p className="text-secondary text-xs mt-0.5">{a.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:w-72 shrink-0 space-y-5">
            {/* Quick Actions */}
            <div className="bg-surface-container-lowest rounded-[2rem] px-5 py-5 shadow-[0_4px_16px_-4px_rgba(67,70,88,0.06)]">
              <h3 className="font-display font-semibold text-on-secondary-fixed mb-4">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Syringe, label: 'Vaccine' },
                  { icon: Stethoscope, label: 'Book Vet' },
                  { icon: Scissors, label: 'Grooming' },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="flex flex-col items-center gap-2 bg-surface-container-low rounded-[1.5rem] py-3 px-2 text-secondary hover:bg-secondary-container hover:text-on-secondary-fixed transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
                  >
                    <action.icon size={18} />
                    <span className="text-[10px] font-semibold">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Copilot Tip */}
            <div className="bg-tertiary-container/80 backdrop-blur-[20px] rounded-[2rem] px-5 py-5 shadow-[0_8px_24px_-8px_rgba(108,91,80,0.15)]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-semibold text-tertiary uppercase tracking-widest">AI Copilot Tip</span>
              </div>
              <p className="text-on-secondary-fixed text-sm leading-relaxed">
                Consider increasing her water intake by 15% this week. The warm weather can cause dehydration faster than usual in dense-coat breeds.
              </p>
              <Link
                to="/ai-chat"
                className="mt-3 block text-primary text-xs font-semibold hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              >
                Ask Copilot More →
              </Link>
            </div>

            {/* Recent Activity sidebar */}
            <div className="bg-surface-container-lowest rounded-[2rem] px-5 py-5 shadow-[0_4px_16px_-4px_rgba(67,70,88,0.06)]">
              <h3 className="font-display font-semibold text-on-secondary-fixed mb-4">Recent Activity</h3>
              <ul className="space-y-4">
                {recentActivity.map((a, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-on-secondary-fixed">{a.label}</p>
                      <p className="text-xs text-secondary mt-0.5 leading-snug">{a.sub}</p>
                      <p className="text-[10px] text-secondary/60 mt-1">{a.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
