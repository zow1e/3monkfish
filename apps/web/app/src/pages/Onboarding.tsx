import { useState } from 'react';
import { Camera, ChevronDown, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Rabbit } from 'lucide-react';

const STEPS = 3;

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState('Dog');
  const [age, setAge] = useState('');

  const handleContinue = () => {
    if (step < STEPS) setStep(s => s + 1);
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-start pt-10 px-4 relative overflow-hidden">
      {/* Soft background blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-secondary-container rounded-full mix-blend-multiply blur-[120px] opacity-30 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-primary-fixed rounded-full mix-blend-multiply blur-[100px] opacity-40 pointer-events-none" />

      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-10 relative z-10">
        <div className="bg-primary-container/30 p-2 rounded-full text-primary">
          <Rabbit size={20} />
        </div>
        <span className="font-display font-semibold text-xl text-primary tracking-tight">3rabbits</span>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-surface-container-lowest rounded-[2.5rem] px-10 py-10 shadow-[0_40px_80px_-20px_rgba(67,70,88,0.10)]">
        {/* Step indicators */}
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
              Every pet is unique. We'll tailor their health plan based on their breed and age.
            </p>

            {/* Photo upload */}
            <div className="flex items-center gap-4 mb-8">
              <button className="relative w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-secondary hover:bg-surface-container transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95">
                <Camera size={22} />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-on-primary text-xs font-bold leading-none">+</span>
                </div>
              </button>
              <div>
                <p className="text-sm font-medium text-on-secondary-fixed">Upload Photo</p>
                <p className="text-xs text-secondary mt-0.5">Optional, but helpful</p>
              </div>
            </div>

            {/* Pet Name */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-secondary uppercase tracking-widest mb-2">
                Pet's Name
              </label>
              <input
                type="text"
                value={petName}
                onChange={e => setPetName(e.target.value)}
                placeholder="e.g. Luna"
                className="w-full bg-surface-container-highest rounded-[1.5rem] px-5 py-3.5 text-on-secondary-fixed text-sm outline-none placeholder:text-secondary/50 focus:bg-primary-fixed transition-colors"
              />
            </div>

            {/* Species + Age row */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase tracking-widest mb-2">
                  Species
                </label>
                <div className="relative">
                  <select
                    value={species}
                    onChange={e => setSpecies(e.target.value)}
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
                    onChange={e => setAge(e.target.value)}
                    className="w-full appearance-none bg-surface-container-highest rounded-[1.5rem] px-5 py-3.5 text-on-secondary-fixed text-sm outline-none focus:bg-primary-fixed transition-colors cursor-pointer"
                  >
                    <option value="">Years</option>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map(y => (
                      <option key={y} value={y}>{y} {y === 1 ? 'year' : 'years'}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                </div>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="font-display text-3xl font-semibold text-on-secondary-fixed mb-2 leading-tight tracking-tight">
              Where are you<br />located?
            </h1>
            <p className="text-secondary text-sm mb-8 leading-relaxed">
              We'll use this to find local vets and services tailored to your area.
            </p>
            <div className="mb-8">
              <label className="block text-xs font-semibold text-secondary uppercase tracking-widest mb-2">
                City or Zip Code
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA"
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
              Tell us about any existing conditions or allergies so we can personalize care.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {['Allergies', 'Joint Pain', 'Digestive Issues', 'Skin Conditions', 'Anxiety', 'None'].map(tag => (
                <button
                  key={tag}
                  className="px-4 py-2 rounded-full bg-surface-container-low text-secondary text-sm font-medium hover:bg-secondary-container hover:text-on-secondary-fixed transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
                >
                  {tag}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/')}
            className="text-secondary text-sm font-medium hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:opacity-70"
          >
            {step > 1 ? 'Back' : 'Skip'}
          </button>
          <button
            onClick={handleContinue}
            className="btn-primary px-8 py-3.5 text-sm shadow-[0_12px_32px_rgba(154,67,69,0.2)] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
          >
            {step === STEPS ? 'Get Started' : 'Continue'}
          </button>
        </div>
      </div>

      {/* Bottom note */}
      <div className="relative z-10 mt-8 flex items-start gap-2 max-w-md w-full px-4">
        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
        <p className="text-xs text-secondary leading-relaxed">
          We'll use this info to calculate the ideal nutrition score for your buddy.
        </p>
      </div>
    </div>
  );
}
