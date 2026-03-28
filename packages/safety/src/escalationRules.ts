import { redFlagSymptoms } from './redFlags';

export const shouldEscalateUrgently = (text: string): boolean => {
  const normalized = text.toLowerCase();
  return redFlagSymptoms.some((symptom) => normalized.includes(symptom));
};
