import { Plus, Calendar, Utensils, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import latteImg from '../assets/latte.png';
import leoImg from '../assets/leo.png';

const pets = [
  {
    name: 'Latte',
    breed: 'Golden Retriever',
    age: '3 years',
    status: 'ACTIVE',
    statusColor: 'bg-tertiary-container text-tertiary',
    activity: 'Ready for a stroll',
    activityIcon: '🐾',
    img: latteImg,
  },
  {
    name: 'Leo',
    breed: 'Tabby Cat',
    age: '5 years',
    status: 'NAPPING',
    statusColor: 'bg-secondary-container text-secondary',
    activity: 'Dreaming softly',
    activityIcon: '🌙',
    img: leoImg,
  },
];

const reminders = [
  {
    icon: Calendar,
    title: "Latte's Vitamins",
    subtitle: 'Scheduled for 6:00 PM',
  },
  {
    icon: Utensils,
    title: 'Dinner Time',
    subtitle: 'In 2 hours for both',
  },
];

const activities = [
  { dot: 'bg-primary', label: 'Morning Walk Finished', sub: 'Latte · 32 mins ago' },
  { dot: 'bg-secondary', label: 'Water Refilled', sub: 'Kitchen Fountain · 1h ago' },
  { dot: 'bg-surface-container-highest', label: 'Play Session Ended', sub: 'Backyard · 4h ago' },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 md:px-10 py-10">
        {/* Hero greeting */}
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-on-secondary-fixed tracking-tight mb-2">
            Good afternoon, Sarah!
          </h1>
          <p className="text-secondary text-lg leading-relaxed">
            Your pack is enjoying the{' '}
            <span className="text-primary italic font-serif">golden hour</span>. Everything looks paw-fect for today.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left — pets + activity */}
          <div className="flex-1 min-w-0">
            {/* Your Pets section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold text-on-secondary-fixed">Your Pets</h2>
                <Link
                  to="/pet-profile"
                  className="flex items-center gap-1 text-sm text-primary font-medium hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                >
                  View All <ChevronRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pets.map((pet) => (
                  <Link
                    to="/pet-profile"
                    key={pet.name}
                    className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0_8px_24px_-8px_rgba(67,70,88,0.08)] hover:-translate-y-1 hover:shadow-[0_16px_32px_-8px_rgba(67,70,88,0.12)] transition-[transform,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 block"
                  >
                    {/* Pet image */}
                    <div className="relative">
                      <img
                        src={pet.img}
                        alt={pet.name}
                        className="w-full h-44 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <span className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${pet.statusColor}`}>
                        {pet.status}
                      </span>
                    </div>

                    {/* Pet info */}
                    <div className="px-5 py-4">
                      <p className="font-display font-semibold text-on-secondary-fixed text-lg">{pet.name}</p>
                      <p className="text-secondary text-xs mt-0.5">{pet.breed} · {pet.age}</p>
                      <div className="mt-3 flex items-center gap-2 bg-surface-container-low rounded-full px-4 py-2 w-full justify-center">
                        <span className="text-sm">{pet.activityIcon}</span>
                        <span className="text-secondary text-xs font-medium">{pet.activity}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="font-display text-lg font-semibold text-on-secondary-fixed mb-4">Recent Activity</h2>
              <div className="bg-surface-container-lowest rounded-[2rem] px-6 py-5 shadow-[0_8px_24px_-8px_rgba(67,70,88,0.06)]">
                <ul className="space-y-4">
                  {activities.map((a, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${a.dot}`} />
                      <div>
                        <p className="text-sm font-medium text-on-secondary-fixed">{a.label}</p>
                        <p className="text-xs text-secondary mt-0.5">{a.sub}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right — Daily Care card */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-secondary text-on-primary rounded-[2rem] px-6 py-6 shadow-[0_16px_40px_-8px_rgba(91,93,112,0.25)]">
              <div className="flex items-center gap-2 mb-5">
                <Calendar size={16} className="opacity-80" />
                <h3 className="font-display font-semibold text-base">Daily Care</h3>
              </div>

              <ul className="space-y-4 mb-6">
                {reminders.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white/10 rounded-[1.5rem] px-4 py-3">
                    <r.icon size={16} className="mt-0.5 opacity-70 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">{r.title}</p>
                      <p className="text-xs opacity-70 mt-0.5">{r.subtitle}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <button className="w-full bg-surface-container-lowest text-on-secondary-fixed text-sm font-semibold py-3 rounded-full hover:bg-surface-container-low transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95">
                Add Reminder
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(154,67,69,0.3)] hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95">
        <Plus size={24} />
      </button>
    </div>
  );
}
