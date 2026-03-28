import { describe, expect, it } from 'vitest';
import { shouldEscalateUrgently } from '../../packages/safety/src/escalationRules';

describe('shouldEscalateUrgently', () => {
  it('matches red-flag symptom', () => {
    expect(shouldEscalateUrgently('My dog has difficulty breathing')).toBe(true);
  });
});
