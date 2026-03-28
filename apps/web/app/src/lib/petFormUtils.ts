export const SPECIES_UI_TO_DB: Record<string, string> = {
  Dog: 'dog',
  Cat: 'cat',
  Rabbit: 'rabbit',
  Bird: 'bird',
  Other: 'other',
};

export const DB_SPECIES_TO_UI: Record<string, string> = {
  dog: 'Dog',
  cat: 'Cat',
  rabbit: 'Rabbit',
  bird: 'Bird',
  other: 'Other',
};

export const HEALTH_FOCUS_TAGS = [
  'Allergies',
  'Joint Pain',
  'Digestive Issues',
  'Skin Conditions',
  'Anxiety',
  'None',
] as const;

export function parseAgeYears(ageText?: string): string {
  if (!ageText?.trim()) return '';
  const m = /^(\d+)\s+years?$/i.exec(ageText.trim());
  return m ? m[1] : '';
}

/** Matches onboarding `ownerNotes` shape. */
export function parseAdditionalConcerns(ownerNotes?: string): string {
  if (!ownerNotes?.trim()) return '';
  const marker = 'Additional concerns:';
  const idx = ownerNotes.indexOf(marker);
  if (idx === -1) return '';
  return ownerNotes.slice(idx + marker.length).trim();
}

export function buildOwnerNotes(tags: string[], extra: string): string | undefined {
  const ownerNotesParts: string[] = [];
  if (tags.length > 0) ownerNotesParts.push(`Health focus: ${tags.join(', ')}`);
  if (extra) ownerNotesParts.push(`Additional concerns: ${extra}`);
  return ownerNotesParts.length > 0 ? ownerNotesParts.join('\n\n') : undefined;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error('Could not read image'));
    r.readAsDataURL(file);
  });
}
