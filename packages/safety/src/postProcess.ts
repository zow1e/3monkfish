export interface SafetyValidator {
  ensureNoDiagnosticCertainty(response: string): string;
}

export const appendMedicalDisclaimer = (response: string): string =>
  `${response}\n\nDisclaimer: This assistant provides general educational guidance and is not a substitute for veterinary care.`;
