import { useEffect, useRef, useState } from 'react';
import { Camera, ChevronDown, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Rabbit } from 'lucide-react';
import { addPet } from '../lib/petStore';
import {
  buildOwnerNotes,
  fileToDataUrl,
  HEALTH_FOCUS_TAGS,
  SPECIES_UI_TO_DB,
} from '../lib/petFormUtils';

const STEPS = 3;

const TAGS = HEALTH_FOCUS_TAGS;

export default function Onboarding() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState('Rabbit');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [healthConcernsText, setHealthConcernsText] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  function onPickPhotoClick() {
    fileInputRef.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setSubmitError('Please choose an image file.');
      return;
    }
    if (f.size > 8 * 1024 * 1024) {
      setSubmitError('Image must be 8MB or smaller.');
      return;
    }
    setPhotoFile(f);
    setPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
    setSubmitError(null);
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

  const handleContinue = async () => {
    if (step < STEPS) {
      setStep((s) => s + 1);
      return;
    }

    if (!petName.trim()) {
      setSubmitError('Please enter your pet’s name.');
      return;
    }

    const speciesLabel = SPECIES_UI_TO_DB[species] ?? 'other';
    const ageText = age ? `${age} year${age === '1' ? '' : 's'}` : undefined;
    const tags = Array.from(selectedTags).filter((t) => t !== 'None');
    const ownerNotes = buildOwnerNotes(tags, healthConcernsText.trim());

    setSubmitting(true);
    setSubmitError(null);

    try {
      let photoDataUrl: string | null = null;
      if (photoFile) {
        photoDataUrl = await fileToDataUrl(photoFile);
      }

      addPet({
        name: petName.trim(),
        species: speciesLabel,
        breed: breed.trim() || undefined,
        ageText,
        location: location.trim() || 'Singapore',
        allergies: tags,
        ownerNotes: ownerNotes ?? undefined,
        photoDataUrl,
      });

      navigate('/');
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : 'Could not save your pet.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-start pt-10 px-4 relative overflow-hidden">
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-secondary-container rounded-full mix-blend-multiply blur-[120px] opacity-30 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-primary-fixed rounded-full mix-blend-multiply blur-[100px] opacity-40 pointer-events-none" />

      <div className="flex items-center gap-2.5 mb-10 relative z-10">
        <div className="bg-primary-container/30 p-2 rounded-full text-primary">
          <Rabbit size={20} />
        </div>
        <span className="font-display font-semibold text-xl text-primary tracking-tight">3rabbits</span>
      </div>

      <div className="relative z-10 w-full max-w-md bg-surface-container-lowest rounded-[2.5rem] px-10 py-10 shadow-[0_40px_80px_-20px_rgba(67,70,88,0.10)]">
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-[width] duration-300 ${
                i + 1 <= step ? 'bg-primary' : 'bg-surface-container-high'
              } ${i + 1 === step ? 'w-8' : 'w-4'}`}
            />
          ))}
        </div>

        {step === 1 && (
          <>
            <h1 className="font-display text-3xl font-semibold text-on-secondary-fixed mb-2 leading-tight tracking-tight">
              Tell us about your<br />companion.
            </h1>
            <p className="text-secondary text-sm mb-8 leading-relaxed">
              Every pet is unique. We&apos;ll tailor their health plan based on their breed and age.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
            <div className="flex items-center gap-4 mb-8">
              <button
                type="button"
                onClick={onPickPhotoClick}
                className="relative w-16 h-16 rounded-full overflow-hidden bg-surface-container-low flex items-center justify-center text-secondary hover:bg-surface-container transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={22} />
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-on-primary text-xs font-bold leading-none">+</span>
                </div>
              </button>
              <div>
                <p className="text-sm font-medium text-on-secondary-fixed">Upload Photo</p>
                <p className="text-xs text-secondary mt-0.5">Optional — saved on this device</p>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-secondary uppercase tracking-widest mb-2">
                Pet&apos;s Name
              </label>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="e.g. Luna"
                className="w-full bg-surface-container-highest rounded-[1.5rem] px-5 py-3.5 text-on-secondary-fixed text-sm outline-none placeholder:text-secondary/50 focus:bg-primary-fixed transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
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
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
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
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-xs font-semibold text-secondary uppercase tracking-widest mb-2">
                Breed <span className="font-normal normal-case text-secondary/70">(optional)</span>
              </label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="e.g. Holland Lop, Golden Retriever, Domestic Shorthair"
                autoComplete="off"
                className="w-full bg-surface-container-highest rounded-[1.5rem] px-5 py-3.5 text-on-secondary-fixed text-sm outline-none placeholder:text-secondary/50 focus:bg-primary-fixed transition-colors"
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="font-display text-3xl font-semibold text-on-secondary-fixed mb-2 leading-tight tracking-tight">
              Where are you<br />located?
            </h1>
            <p className="text-secondary text-sm mb-8 leading-relaxed">
              We&apos;ll use this to find local vets and services tailored to your area.
            </p>
            <div className="mb-8">
              <label className="block text-xs font-semibold text-secondary uppercase tracking-widest mb-2">
                City or region
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Singapore, Central"
                  className="w-full bg-surface-container-highest rounded-[1.5rem] pl-11 pr-5 py-3.5 text-on-secondary-fixed text-sm outline-none placeholder:text-secondary/50 focus:bg-primary-fixed transition-colors"
                />
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="font-display text-3xl font-semibold text-on-secondary-fixed mb-2 leading-tight tracking-tight">
              Any health<br />concerns?
            </h1>
            <p className="text-secondary text-sm mb-8 leading-relaxed">
              Tell us about any existing conditions so we can personalize care.
            </p>
            <div className="flex flex-wrap gap-3 mb-5">
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
            <div className="mb-8">
              <label className="block text-xs font-semibold text-secondary uppercase tracking-widest mb-2">
                Or type your own <span className="font-normal normal-case text-secondary/70">(optional)</span>
              </label>
              <textarea
                value={healthConcernsText}
                onChange={(e) => setHealthConcernsText(e.target.value)}
                placeholder="e.g. recovering from surgery, sensitive stomach, medication schedule…"
                rows={4}
                className="w-full resize-y min-h-[5.5rem] bg-surface-container-highest rounded-[1.5rem] px-5 py-3.5 text-on-secondary-fixed text-sm outline-none placeholder:text-secondary/50 focus:bg-primary-fixed transition-colors"
              />
            </div>
          </>
        )}

        {submitError && <p className="text-sm text-red-600 dark:text-red-400 mb-4">{submitError}</p>}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => (step > 1 ? setStep((s) => s - 1) : navigate('/'))}
            className="text-secondary text-sm font-medium hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:opacity-70"
          >
            {step > 1 ? 'Back' : 'Skip'}
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={submitting}
            className="btn-primary px-8 py-3.5 text-sm shadow-[0_12px_32px_rgba(154,67,69,0.2)] disabled:opacity-50"
          >
            {submitting ? 'Saving…' : step === STEPS ? 'Get Started' : 'Continue'}
          </button>
        </div>
      </div>

      <div className="relative z-10 mt-8 flex items-start gap-2 max-w-md w-full px-4">
        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
        <p className="text-xs text-secondary leading-relaxed">
          Pets are stored in your browser only. Clearing site data will remove them.
        </p>
      </div>
    </div>
  );
}
