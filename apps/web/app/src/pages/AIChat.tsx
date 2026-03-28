import { useEffect, useMemo, useState } from 'react';
import { Send, Sparkles, ListChecks, Phone } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { chatPostUrl } from '../lib/chatApi';
import { loadPets } from '../lib/petStore';
import { HOLLAND_LOP_FAQ_QUESTIONS } from '../data/hollandLopFaq';

type Message = { role: 'ai' | 'user'; text: string };

function formatSpecies(s: string): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function AIChat() {
  const location = useLocation();
  const pets = useMemo(() => loadPets(), [location.pathname, location.key]);

  const [msgs, setMsgs] = useState<Message[]>([
    {
      role: 'ai',
      text: "Hello! I'm your PetCare Copilot. Choose a Holland Lop FAQ below, or type your own question. Answers are educational only—not a substitute for a veterinarian.",
    },
  ]);
  const [input, setInput] = useState('');
  const [active, setActive] = useState(0);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (pets.length === 0) return;
    setActive((i) => Math.min(i, pets.length - 1));
  }, [pets.length]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    setMsgs((m) => [...m, { role: 'user', text: trimmed }]);
    setInput('');
    setPending(true);
    try {
      const petId = pets[active]?.id;
      const res = await fetch(chatPostUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          ...(petId ? { petId } : {}),
        }),
      });
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        let detail = `Request failed (${res.status})`;
        if (
          typeof data === 'object' &&
          data !== null &&
          'error' in data &&
          typeof (data as { error: unknown }).error === 'string'
        ) {
          detail = (data as { error: string }).error;
        } else if (res.status === 502 || res.status === 504) {
          detail =
            'Cannot reach the PetCare API (nothing listening on port 4000). From the repo root run: pnpm --filter @petcare/api dev — or pnpm dev to start API + web together. Then reload this page.';
        }
        setMsgs((m) => [...m, { role: 'ai', text: `Sorry — ${detail}` }]);
        return;
      }
      const answer =
        typeof data === 'object' &&
        data !== null &&
        'answer' in data &&
        typeof (data as { answer: unknown }).answer === 'string'
          ? (data as { answer: string }).answer
          : '';
      setMsgs((m) => [...m, { role: 'ai', text: answer.trim() || 'No answer returned.' }]);
    } catch (e) {
      const hint =
        e instanceof TypeError && e.message === 'Failed to fetch'
          ? ' (Is the API running on port 4000? Run pnpm --filter @petcare/api dev from the repo root.)'
          : '';
      setMsgs((m) => [
        ...m,
        {
          role: 'ai',
          text: `Sorry — ${e instanceof Error ? e.message : 'Network error'}${hint}`,
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  function onSendClick() {
    void sendMessage(input);
  }

  function onFaqClick(question: string) {
    setInput(question);
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />

      <div className="flex flex-1 max-w-[1200px] mx-auto w-full overflow-hidden">
        <aside className="w-64 shrink-0 border-r border-outline-variant/15 flex flex-col px-4 py-6">
          <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-4 px-2">
            Your pets
          </h2>

          {pets.length === 0 ? (
            <p className="text-xs text-secondary px-2 leading-relaxed">
              No pets yet. Add one from the Dashboard to see them listed here.
            </p>
          ) : (
            <ul className="space-y-2 flex-1">
              {pets.map((p, i) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-[1.5rem] text-left transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ${
                      active === i
                        ? 'bg-primary-fixed text-primary'
                        : 'text-secondary hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center font-display font-semibold text-secondary text-sm shrink-0">
                      {p.name[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-on-secondary-fixed truncate">{p.name}</p>
                      <p className="text-xs text-secondary truncate">
                        {[p.breed?.trim(), formatSpecies(p.species), p.ageText].filter(Boolean).join(' · ') ||
                          '—'}
                      </p>
                    </div>
                    {active === i && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-center py-4 border-b border-outline-variant/10">
            <span className="bg-surface-container-low text-secondary text-xs font-semibold px-4 py-1.5 rounded-full">
              Holland Lop FAQ
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
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
                </div>
              </div>
            ))}
            {pending && (
              <div className="flex gap-3 justify-start">
                <div className="w-9 h-9 rounded-full bg-primary-container/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles size={16} className="text-primary animate-pulse" />
                </div>
                <div className="px-5 py-4 rounded-[1.5rem] text-sm text-secondary bg-surface-container-lowest/80 rounded-tl-sm">
                  Answering…
                </div>
              </div>
            )}
          </div>

          <div className="px-6 pb-3">
            <p className="text-[10px] font-semibold text-secondary uppercase tracking-widest mb-2">
              FAQ questions
            </p>
            <div className="flex flex-col gap-2">
              {HOLLAND_LOP_FAQ_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => onFaqClick(q)}
                  className="text-left text-xs text-on-secondary-fixed bg-surface-container-low border border-outline-variant/20 rounded-[1.25rem] px-4 py-3 hover:bg-primary-fixed/50 hover:border-primary/20 transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-[2rem] flex items-center px-5 py-3 shadow-[0_4px_16px_-4px_rgba(67,70,88,0.08)]">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !pending && onSendClick()}
                placeholder="Ask anything about your pet's health..."
                className="flex-1 bg-transparent outline-none text-on-secondary-fixed text-sm placeholder:text-secondary/50 font-sans"
              />
              <div className="flex items-center gap-2 ml-3">
                <button
                  type="button"
                  className="p-1.5 text-secondary hover:text-on-secondary-fixed transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
                  aria-label="Checklist"
                >
                  <ListChecks size={16} />
                </button>
                <button
                  type="button"
                  className="p-1.5 text-secondary hover:text-on-secondary-fixed transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
                  aria-label="Phone"
                >
                  <Phone size={16} />
                </button>
                <button
                  type="button"
                  onClick={onSendClick}
                  disabled={pending}
                  className="w-8 h-8 bg-primary text-on-primary rounded-full flex items-center justify-center hover:opacity-90 transition-opacity shadow-[0_4px_12px_rgba(154,67,69,0.25)] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                  aria-label="Send"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
            <p className="text-center text-[10px] text-secondary/50 mt-2">
              AI Assistant · educational only · consult a professional for serious concerns
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
