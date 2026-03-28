import { useState } from 'react';
import { Send, Sparkles, Stethoscope, Utensils, BarChart2, ListChecks, Phone } from 'lucide-react';
import Header from '../components/Header';

const patients = [
  { name: 'Leo', breed: 'Golden Retriever · 3y', online: true },
  { name: 'Milo', breed: 'British Shorthair · 2y', online: false },
];

type Message =
  | { role: 'ai'; text: string; cards?: { icon: 'checkup' | 'diet'; label: string; sub: string }[] }
  | { role: 'user'; text: string };

const initialMsgs: Message[] = [
  {
    role: 'ai',
    text: "Hello! I'm your PetCare Copilot. I have access to Leo's medical history and recent activity logs. How can I help you today?",
    cards: [
      { icon: 'checkup', label: 'Recent Checkup', sub: "Summarize Leo's last visit from Jun 13th" },
      { icon: 'diet', label: 'Dietary Advice', sub: 'Is it safe for Leo to eat pumpkin seeds?' },
    ],
  },
  {
    role: 'user',
    text: "Leo seems a bit lethargic today and didn't finish her breakfast. Is this normal?",
  },
  {
    role: 'ai',
    text: "I've checked Leo's recent data. Her activity levels were 30% lower than her usual morning average. Lethargy combined with loss of appetite can be a sign of many things.\n\nHas she vomited or shown any signs of discomfort when you touch her abdomen?",
  },
];

const suggestions = [
  { label: 'No vomiting', icon: '✓' },
  { label: 'Check symptoms list', icon: '📋' },
  { label: 'Call the vet', icon: '📞' },
];

const cardIcons = {
  checkup: Stethoscope,
  diet: Utensils,
};

export default function AIChat() {
  const [msgs] = useState<Message[]>(initialMsgs);
  const [active, setActive] = useState(0);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />

      <div className="flex flex-1 max-w-[1200px] mx-auto w-full overflow-hidden">
        {/* Left sidebar — active patients */}
        <aside className="w-64 shrink-0 border-r border-outline-variant/15 flex flex-col px-4 py-6">
          <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-4 px-2">
            Active Patient
          </h2>

          <ul className="space-y-2 flex-1">
            {patients.map((p, i) => (
              <li key={p.name}>
                <button
                  onClick={() => setActive(i)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-[1.5rem] text-left transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ${
                    active === i
                      ? 'bg-primary-fixed text-primary'
                      : 'text-secondary hover:bg-surface-container-low'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center font-display font-semibold text-secondary text-sm">
                      {p.name[0]}
                    </div>
                    {p.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-tertiary border-2 border-surface" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-on-secondary-fixed truncate">{p.name}</p>
                    <p className="text-xs text-secondary truncate">{p.breed}</p>
                  </div>
                  {active === i && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary shrink-0" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Health Insights card */}
          <div className="bg-surface-container-low rounded-[1.5rem] px-4 py-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 size={14} className="text-primary" />
              <span className="text-xs font-semibold text-on-secondary-fixed">Health Insights</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed mb-3">
              Leo has logged 67% of weekly activity. Would you like to review her trends?
            </p>
            <button className="text-xs font-semibold text-primary hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
              View Analytics →
            </button>
          </div>
        </aside>

        {/* Main chat area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Chat header chip */}
          <div className="flex items-center justify-center py-4 border-b border-outline-variant/10">
            <span className="bg-surface-container-low text-secondary text-xs font-semibold px-4 py-1.5 rounded-full">
              today
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'ai' && (
                  <div className="w-9 h-9 rounded-full bg-primary-container/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={16} className="text-primary" />
                  </div>
                )}

                <div className={`max-w-[75%] space-y-3 ${m.role === 'user' ? 'items-end flex flex-col' : ''}`}>
                  {m.role === 'ai' && (
                    <p className="text-[11px] font-semibold text-secondary uppercase tracking-widest">Copilot AI</p>
                  )}

                  <div
                    className={`px-5 py-4 rounded-[1.5rem] text-sm leading-relaxed whitespace-pre-line ${
                      m.role === 'user'
                        ? 'bg-primary text-on-primary rounded-tr-sm shadow-[0_4px_16px_rgba(154,67,69,0.2)]'
                        : 'bg-surface-container-lowest text-on-secondary-fixed shadow-[0_2px_12px_-2px_rgba(67,70,88,0.08)] rounded-tl-sm'
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Quick action cards */}
                  {'cards' in m && m.cards && (
                    <div className="flex gap-3 flex-wrap">
                      {m.cards.map((card) => {
                        const Icon = cardIcons[card.icon];
                        return (
                          <button
                            key={card.label}
                            className="flex items-start gap-3 bg-surface-container-lowest border border-outline-variant/20 rounded-[1.5rem] px-4 py-3 text-left hover:bg-primary-fixed hover:border-primary/20 transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95 max-w-[180px]"
                          >
                            <div className="w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center shrink-0 mt-0.5">
                              <Icon size={13} className="text-secondary" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-on-secondary-fixed">{card.label}</p>
                              <p className="text-[10px] text-secondary mt-0.5 leading-snug">{card.sub}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Suggestion chips */}
          <div className="px-6 pb-3 flex gap-2 flex-wrap">
            {suggestions.map((s) => (
              <button
                key={s.label}
                className="flex items-center gap-1.5 px-4 py-2 bg-surface-container-lowest border border-outline-variant/25 rounded-full text-secondary text-xs font-medium hover:bg-primary-fixed hover:border-primary/20 hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
              >
                <span>{s.icon}</span> {s.label}
              </button>
            ))}
          </div>

          {/* Input bar */}
          <div className="px-6 pb-6">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-[2rem] flex items-center px-5 py-3 shadow-[0_4px_16px_-4px_rgba(67,70,88,0.08)]">
              <input
                type="text"
                placeholder="Ask anything about your pet's health..."
                className="flex-1 bg-transparent outline-none text-on-secondary-fixed text-sm placeholder:text-secondary/50 font-sans"
              />
              <div className="flex items-center gap-2 ml-3">
                <button className="p-1.5 text-secondary hover:text-on-secondary-fixed transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95">
                  <ListChecks size={16} />
                </button>
                <button className="p-1.5 text-secondary hover:text-on-secondary-fixed transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95">
                  <Phone size={16} />
                </button>
                <button className="w-8 h-8 bg-primary text-on-primary rounded-full flex items-center justify-center hover:opacity-90 transition-opacity shadow-[0_4px_12px_rgba(154,67,69,0.25)] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95">
                  <Send size={14} />
                </button>
              </div>
            </div>
            <p className="text-center text-[10px] text-secondary/50 mt-2">
              AI Assistant · consult a professional for serious concerns
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
