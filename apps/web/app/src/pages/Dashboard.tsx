import { useEffect, useState } from 'react';
import { Plus, Calendar, Utensils, ChevronRight, Trash2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { deletePet, loadPets, type StoredPet } from '../lib/petStore';

function petCardImage(pet: StoredPet): string {
  if (pet.photoDataUrl) return pet.photoDataUrl;
  return `https://placehold.co/280x200/e8e8e8/5b5d70?text=${encodeURIComponent(pet.name)}`;
}

function formatSpecies(s: string): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function petSubtitle(pet: StoredPet): string {
  const bits = [
    formatSpecies(pet.species),
    pet.breed?.trim(),
    pet.ageText,
    pet.location,
  ].filter(Boolean);
  return bits.join(' · ');
}

export default function Dashboard() {
  const location = useLocation();
  const [pets, setPets] = useState<StoredPet[]>(() => loadPets());
  useEffect(() => {
    setPets(loadPets());
  }, [location.pathname, location.key]);

  function handleDeletePet(id: string, name: string) {
    if (!window.confirm(`Remove “${name}” from this device? This cannot be undone.`)) return;
    deletePet(id);
    setPets(loadPets());
  }

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 md:px-10 py-10">
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-on-secondary-fixed tracking-tight mb-2">
            {greeting}!
          </h1>
          <p className="text-secondary text-lg leading-relaxed">
            {pets.length === 0
              ? 'Add your first pet to get started.'
              : 'Your pack is enjoying the '}
            {pets.length > 0 && (
              <>
                <span className="text-primary italic font-serif">golden hour</span>. Everything looks paw-fect for
                today.
              </>
            )}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold text-on-secondary-fixed">Your Pets</h2>
                <Link
                  to="/onboarding"
                  className="flex items-center gap-1 text-sm text-primary font-medium hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                >
                  Add pet <ChevronRight size={14} />
                </Link>
              </div>

              {pets.length === 0 ? (
                <Link
                  to="/onboarding"
                  className="inline-block bg-surface-container-lowest rounded-[2rem] px-6 py-4 text-primary font-medium shadow-sm hover:opacity-90"
                >
                  Add your first pet →
                </Link>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pets.map((pet) => (
                    <div
                      key={pet.id}
                      className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0_8px_24px_-8px_rgba(67,70,88,0.08)] hover:-translate-y-1 hover:shadow-[0_16px_32px_-8px_rgba(67,70,88,0.12)] transition-[transform,box-shadow] duration-200"
                    >
                      <Link
                        to={`/pet-profile?id=${pet.id}`}
                        className="block focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                      >
                        <div className="relative">
                          <img
                            src={petCardImage(pet)}
                            alt={pet.name}
                            className="w-full h-44 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-tertiary-container text-tertiary">
                            ACTIVE
                          </span>
                        </div>

                        <div className="px-5 pt-4">
                          <p className="font-display font-semibold text-on-secondary-fixed text-lg">{pet.name}</p>
                          <p className="text-secondary text-xs mt-0.5">{petSubtitle(pet)}</p>
                        </div>
                      </Link>
                      <div className="px-5 pb-4 flex items-center justify-between gap-2">
                        <div className="flex-1 flex items-center gap-2 bg-surface-container-low rounded-full px-4 py-2 justify-center min-w-0">
                          <span className="text-sm shrink-0">🐾</span>
                          <span className="text-secondary text-xs font-medium truncate">Ready for a stroll</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Link
                            to={`/pet-profile?id=${pet.id}&edit=1`}
                            className="text-primary text-xs font-semibold hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-full px-3 py-2"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeletePet(pet.id, pet.name)}
                            className="flex items-center justify-center p-2 rounded-full text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors focus-visible:outline-2 focus-visible:outline-red-500 focus-visible:outline-offset-2"
                            aria-label={`Remove ${pet.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-on-secondary-fixed mb-4">Recent Activity</h2>
              <div className="bg-surface-container-lowest rounded-[2rem] px-6 py-5 shadow-[0_8px_24px_-8px_rgba(67,70,88,0.06)]">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 bg-primary" />
                    <div>
                      <p className="text-sm font-medium text-on-secondary-fixed">Pets saved on this device</p>
                      <p className="text-xs text-secondary mt-0.5">Data stays in your browser (localStorage)</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:w-72 shrink-0">
            <div className="bg-secondary text-on-primary rounded-[2rem] px-6 py-6 shadow-[0_16px_40px_-8px_rgba(91,93,112,0.25)]">
              <div className="flex items-center gap-2 mb-5">
                <Calendar size={16} className="opacity-80" />
                <h3 className="font-display font-semibold text-base">Daily Care</h3>
              </div>

              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-3 bg-white/10 rounded-[1.5rem] px-4 py-3">
                  <Utensils size={16} className="mt-0.5 opacity-70 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Meals & hydration</p>
                    <p className="text-xs opacity-70 mt-0.5">Track routines in each pet profile</p>
                  </div>
                </li>
              </ul>

              <Link
                to="/onboarding"
                className="block w-full text-center bg-surface-container-lowest text-on-secondary-fixed text-sm font-semibold py-3 rounded-full hover:bg-surface-container-low transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
              >
                Add another pet
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Link
        to="/onboarding"
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(154,67,69,0.3)] hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
        aria-label="Add pet"
      >
        <Plus size={24} />
      </Link>
    </div>
  );
}
