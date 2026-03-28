const STORAGE_KEY = 'petcare_pets_v1';

export type StoredPet = {
  id: string;
  name: string;
  species: string;
  /** Free text, e.g. Holland Lop, Golden Retriever */
  breed?: string;
  ageText?: string;
  location: string;
  allergies: string[];
  ownerNotes?: string;
  /** data: URL from onboarding upload (browser-only; not synced to server) */
  photoDataUrl?: string | null;
  createdAt: string;
};

function readRaw(): StoredPet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as StoredPet[]) : [];
  } catch {
    return [];
  }
}

function writeRaw(pets: StoredPet[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
}

export function loadPets(): StoredPet[] {
  return readRaw().sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function getPet(id: string): StoredPet | undefined {
  return readRaw().find((p) => p.id === id);
}

export function addPet(pet: Omit<StoredPet, 'id' | 'createdAt'>): StoredPet {
  const row: StoredPet = {
    ...pet,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const next = [...readRaw(), row];
  writeRaw(next);
  return row;
}

export function updatePet(
  id: string,
  patch: Partial<Omit<StoredPet, 'id' | 'createdAt'>>,
): StoredPet | undefined {
  const raw = readRaw();
  const idx = raw.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  const updated: StoredPet = { ...raw[idx], ...patch };
  raw[idx] = updated;
  writeRaw(raw);
  return updated;
}

export function deletePet(id: string) {
  writeRaw(readRaw().filter((p) => p.id !== id));
}
