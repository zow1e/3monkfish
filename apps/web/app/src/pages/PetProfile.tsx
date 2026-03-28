import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Camera,
  ChevronDown,
  MapPin,
  Pencil,
  Scissors,
  Stethoscope,
  Syringe,
  Trash2,
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { deletePet, getPet, loadPets, updatePet, type StoredPet } from '../lib/petStore';
import {
  buildOwnerNotes,
  DB_SPECIES_TO_UI,
  fileToDataUrl,
  HEALTH_FOCUS_TAGS,
  parseAdditionalConcerns,
  parseAgeYears,
  SPECIES_UI_TO_DB,
} from '../lib/petFormUtils';

const TAGS = HEALTH_FOCUS_TAGS;

const medicalRecords = [
  { icon: Syringe, title: 'Vaccination record', date: 'Add dates in a future update', color: 'text-primary bg-primary-fixed' },
  { icon: Stethoscope, title: 'Wellness checkup', date: '—', color: 'text-secondary bg-secondary-container' },
];

function heroUrl(pet: StoredPet): string {
  if (pet.photoDataUrl) return pet.photoDataUrl;
  return `https://placehold.co/800x224/e8e8e8/5b5d70?text=${encodeURIComponent(pet.name)}`;
}

function formatSpecies(s: string): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function PetProfile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const idParam = searchParams.get('id');

  const [storeVersion, setStoreVersion] = useState(0);
  const pet = useMemo(() => {
    if (idParam) return getPet(idParam);
    const list = loadPets();
    return list[0];
  }, [idParam, storeVersion]);

  const [editing, setEditing] = useState(false);
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState('Rabbit');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [healthConcernsText, setHealthConcernsText] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  function resetFormFromPet(p: StoredPet) {
    setPetName(p.name);
    setSpecies(DB_SPECIES_TO_UI[p.species] ?? 'Other');
    setBreed(p.breed ?? '');
    setAge(parseAgeYears(p.ageText));
    setLocation(p.location);
    setSelectedTags(new Set(p.allergies.length ? p.allergies : []));
    setHealthConcernsText(parseAdditionalConcerns(p.ownerNotes));
    setPhotoFile(null);
    setPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setSaveError(null);
  }

  function openEdit() {
    if (!pet) return;
    resetFormFromPet(pet);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setSaveError(null);
    setPhotoFile(null);
    setPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }

  useEffect(() => {
    if (searchParams.get('edit') !== '1' || !pet) return;
    resetFormFromPet(pet);
    setEditing(true);
    const next = new URLSearchParams(searchParams);
    next.delete('edit');
    setSearchParams(next, { replace: true });
  }, [pet, searchParams, setSearchParams]);

  function onPickPhotoClick() {
    fileInputRef.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setSaveError('Please choose an image file.');
      return;
    }
    if (f.size > 8 * 1024 * 1024) {
      setSaveError('Image must be 8MB or smaller.');
      return;
    }
    setPhotoFile(f);
    setPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
    setSaveError(null);
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (tag === 'None') {
        next.clear();
        next.add('None');
        return next;
      }
      next.delete('None');
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  function handleDeletePet() {
    if (!pet) return;
    if (
      !window.confirm(
        `Remove “${pet.name}” from this device? This cannot be undone.`,
      )
    ) {
      return;
    }
    deletePet(pet.id);
    navigate('/');
  }

  async function handleSave() {
    if (!pet) return;
    if (!petName.trim()) {
      setSaveError('Please enter your pet’s name.');
      return;
    }

    const speciesLabel = SPECIES_UI_TO_DB[species] ?? 'other';
    const ageText = age ? `${age} year${age === '1' ? '' : 's'}` : undefined;
    const tags = Array.from(selectedTags).filter((t) => t !== 'None');
    const ownerNotes = buildOwnerNotes(tags, healthConcernsText.trim());

    setSaving(true);
    setSaveError(null);

    try {
      let photoDataUrl: string | null | undefined = pet.photoDataUrl ?? undefined;
      if (photoFile) {
        photoDataUrl = await fileToDataUrl(photoFile);
      }

      const updated = updatePet(pet.id, {
        name: petName.trim(),
        species: speciesLabel,
        breed: breed.trim() || undefined,
        ageText,
        location: location.trim() || 'Singapore',
        allergies: tags,
        ownerNotes: ownerNotes ?? undefined,
        photoDataUrl: photoDataUrl ?? null,
      });

      if (!updated) {
        setSaveError('Could not save changes.');
        return;
      }

      setEditing(false);
      setPhotoFile(null);
      setPhotoPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setStoreVersion((v) => v + 1);
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  }

  const subtitle = pet
    ? [formatSpecies(pet.species), pet.breed?.trim(), pet.ageText, pet.location].filter(Boolean).join(' · ')
    : '';

  const stats = pet
    ? [
        { label: 'Species', value: formatSpecies(pet.species) },
        { label: 'Breed', value: pet.breed?.trim() || '—' },
        { label: 'Age', value: pet.ageText?.trim() || '—' },
        { label: 'Location', value: pet.location?.trim() || '—' },
      ]
    : [];

  const editHeroSrc = photoPreview ?? (pet?.photoDataUrl ? pet.photoDataUrl : null);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 md:px-10 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-secondary text-sm font-medium hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
            >
              <ArrowLeft size={16} /> PetCare Copilot
            </Link>
          </div>
          <button
            type="button"
            className="p-2 text-secondary hover:text-on-secondary-fixed hover:bg-surface-container-low rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
        </div>

        {!pet ? (
          <p className="text-secondary text-sm">
            No pet found.{' '}
            <Link to="/onboarding" className="text-primary font-medium">
              Add a pet
            </Link>
            .
          </p>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0 space-y-5">
              <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0_8px_32px_-8px_rgba(67,70,88,0.08)]">
                {editing ? (
                  <div className="px-6 py-6">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onFileChange}
                    />
                    <div className="flex items-center gap-4 mb-6">
                      <button
                        type="button"
                        onClick={onPickPhotoClick}
                        className="relative w-20 h-20 rounded-full overflow-hidden bg-surface-container-low flex items-center justify-center text-secondary hover:bg-surface-container transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 shrink-0"
                      >
                        {editHeroSrc ? (
                          <img src={editHeroSrc} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Camera size={24} />
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-on-primary text-xs font-bold leading-none">+</span>
                        </div>
                      </button>
                      <div>
                        <p className="text-sm font-medium text-on-secondary-fixed">Photo</p>
                        <p className="text-xs text-secondary mt-0.5">Optional — tap to change</p>
                      </div>
                    </div>

                    <h2 className="font-display text-xl font-semibold text-on-secondary-fixed mb-4">Edit profile</h2>

                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-xs font-semibold text-secondary uppercase tracking-widest mb-2">
                          Pet&apos;s name
                        </label>
                        <input
                          type="text"
                          value={petName}
                          onChange={(e) => setPetName(e.target.value)}
                          className="w-full bg-surface-container-highest rounded-[1.5rem] px-5 py-3.5 text-on-secondary-fixed text-sm outline-none placeholder:text-secondary/50 focus:bg-primary-fixed transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-secondary uppercase tracking-widest mb-2">
                            Species
                          </label>
                          <div className="relative">
                            <select
                              value={species}
                              onChange={(e) => setSpecies(e.target.value)}
                              className="w-full appearance-none bg-surface-container-highest rounded-[1.5rem] px-5 py-3.5 text-on-secondary-fixed text-sm outline-none focus:bg-primary-fixed transition-colors cursor-pointer"
                            >
                              <option>Dog</option>
                              <option>Cat</option>
                              <option>Rabbit</option>
                              <option>Bird</option>
                              <option>Other</option>
                            </select>
                            <ChevronDown
                              size={14}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-secondary uppercase tracking-widest mb-2">
                            Age
                          </label>
                          <div className="relative">
                            <select
                              value={age}
                              onChange={(e) => setAge(e.target.value)}
                              className="w-full appearance-none bg-surface-container-highest rounded-[1.5rem] px-5 py-3.5 text-on-secondary-fixed text-sm outline-none focus:bg-primary-fixed transition-colors cursor-pointer"
                            >
                              <option value="">Years</option>
                              {Array.from({ length: 20 }, (_, i) => i + 1).map((y) => (
                                <option key={y} value={String(y)}>
                                  {y} {y === 1 ? 'year' : 'years'}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              size={14}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-secondary uppercase tracking-widest mb-2">
                          Breed <span className="font-normal normal-case text-secondary/70">(optional)</span>
                        </label>
                        <input
                          type="text"
                          value={breed}
                          onChange={(e) => setBreed(e.target.value)}
                          autoComplete="off"
                          className="w-full bg-surface-container-highest rounded-[1.5rem] px-5 py-3.5 text-on-secondary-fixed text-sm outline-none focus:bg-primary-fixed transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-secondary uppercase tracking-widest mb-2">
                          City or region
                        </label>
                        <div className="relative">
                          <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary" />
                          <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-surface-container-highest rounded-[1.5rem] pl-11 pr-5 py-3.5 text-on-secondary-fixed text-sm outline-none focus:bg-primary-fixed transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <p className="block text-xs font-semibold text-secondary uppercase tracking-widest mb-2">
                          Health focus
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {TAGS.map((tag) => {
                            const active = selectedTags.has(tag);
                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95 ${
                                  active
                                    ? 'bg-primary-fixed text-primary'
                                    : 'bg-surface-container-low text-secondary hover:bg-secondary-container hover:text-on-secondary-fixed'
                                }`}
                              >
                                {tag}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-secondary uppercase tracking-widest mb-2">
                          Additional notes <span className="font-normal normal-case text-secondary/70">(optional)</span>
                        </label>
                        <textarea
                          value={healthConcernsText}
                          onChange={(e) => setHealthConcernsText(e.target.value)}
                          rows={4}
                          className="w-full resize-y min-h-[5rem] bg-surface-container-highest rounded-[1.5rem] px-5 py-3.5 text-on-secondary-fixed text-sm outline-none focus:bg-primary-fixed transition-colors"
                        />
                      </div>
                    </div>

                    {saveError && (
                      <p className="text-sm text-red-600 dark:text-red-400 mb-4">{saveError}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 justify-between">
                      <button
                        type="button"
                        onClick={handleDeletePet}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors focus-visible:outline-2 focus-visible:outline-red-500 focus-visible:outline-offset-2 disabled:opacity-50"
                      >
                        <Trash2 size={16} aria-hidden />
                        Remove pet
                      </button>
                      <div className="flex flex-wrap gap-3 justify-end">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          disabled={saving}
                          className="px-5 py-2.5 rounded-full text-sm font-medium text-secondary hover:bg-surface-container-low transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleSave()}
                          disabled={saving}
                          className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50"
                        >
                          {saving ? 'Saving…' : 'Save changes'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative h-56">
                      <img src={heroUrl(pet)} alt={pet.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>

                    <div className="px-6 py-5">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="min-w-0">
                          <h1 className="font-display text-3xl font-semibold text-on-secondary-fixed tracking-tight">
                            {pet.name}
                          </h1>
                          <p className="text-secondary text-sm mt-1">{subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={openEdit}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-container-high text-on-secondary-fixed hover:bg-surface-container transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={handleDeletePet}
                            className="flex items-center justify-center p-1.5 rounded-full text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors focus-visible:outline-2 focus-visible:outline-red-500 focus-visible:outline-offset-2 active:scale-95"
                            aria-label={`Remove ${pet.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                          <span className="bg-primary-fixed text-primary text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                            Healthy
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {stats.map((s) => (
                          <div key={s.label} className="bg-surface-container-low rounded-[1.5rem] px-3 py-3 text-center min-w-0">
                            <p className="font-display font-semibold text-on-secondary-fixed text-base sm:text-lg break-words">
                              {s.value}
                            </p>
                            <p className="text-secondary text-xs mt-0.5">{s.label}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 mt-4">
                        {['Overview', 'Vaccines', 'Nutrition', 'Behavior'].map((tab, i) => (
                          <button
                            key={tab}
                            type="button"
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
                  </>
                )}
              </div>

              <div className="bg-surface-container-lowest rounded-[2rem] px-6 py-5 shadow-[0_4px_16px_-4px_rgba(67,70,88,0.06)]">
                <button
                  type="button"
                  className="flex items-center justify-between w-full group focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-on-secondary-fixed font-display font-semibold">
                    <span className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center text-secondary text-xs">
                      ℹ
                    </span>
                    Overview
                  </div>
                  <ChevronDown size={16} className="text-secondary group-hover:opacity-70 transition-opacity" />
                </button>
                <div className="mt-4 text-secondary text-sm leading-relaxed">
                  <p>
                    {pet.ownerNotes?.trim() ||
                      'No extra notes yet — add health tags when you create or edit your pet.'}
                  </p>
                  {pet.allergies.length > 0 && (
                    <p className="mt-3 text-on-secondary-fixed font-medium">
                      Tags: {pet.allergies.join(', ')}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-[2rem] px-6 py-5 shadow-[0_4px_16px_-4px_rgba(67,70,88,0.06)]">
                <button
                  type="button"
                  className="flex items-center justify-between w-full group focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-lg"
                >
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
              </div>

              <div className="bg-surface-container-lowest rounded-[2rem] px-6 py-5 shadow-[0_4px_16px_-4px_rgba(67,70,88,0.06)]">
                <div className="flex items-center gap-2 text-on-secondary-fixed font-display font-semibold mb-4">
                  <span className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center">
                    <Scissors size={12} className="text-secondary" />
                  </span>
                  Appointments
                </div>
                <p className="text-secondary text-sm">
                  Connect to your database when you wire the API — for now this is local-only pet data.
                </p>
              </div>
            </div>

            <div className="lg:w-72 shrink-0 space-y-5">
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
                      type="button"
                      className="flex flex-col items-center gap-2 bg-surface-container-low rounded-[1.5rem] py-3 px-2 text-secondary hover:bg-secondary-container hover:text-on-secondary-fixed transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
                    >
                      <action.icon size={18} />
                      <span className="text-[10px] font-semibold">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-tertiary-container/80 backdrop-blur-[20px] rounded-[2rem] px-5 py-5 shadow-[0_8px_24px_-8px_rgba(108,91,80,0.15)]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-semibold text-tertiary uppercase tracking-widest">AI Copilot Tip</span>
                </div>
                <p className="text-on-secondary-fixed text-sm leading-relaxed">
                  Your pet profile is stored in this browser. You can add more pets anytime from the dashboard.
                </p>
                <Link
                  to="/ai-chat"
                  className="mt-3 block text-primary text-xs font-semibold hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                >
                  Ask Copilot More →
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
