import { describe, expect, it } from 'vitest';
import { buildProductSearchGoal } from '../../packages/listings-ingestion/src/goals/productSearchGoal';

describe('buildProductSearchGoal', () => {
  it('includes the key TinyFish instructions and JSON sample', () => {
    const goal = buildProductSearchGoal({
      keyword: 'cat shedding brush',
      site: 'amazon',
      maxProductCount: 5,
    });

    expect(goal).toContain('Close any cookie or consent banner first');
    expect(goal).toContain('product image');
    expect(goal).toContain('Extract only the first 5 relevant visible products');
    expect(goal).toContain('"image"');
    expect(goal).toContain('"name"');
    expect(goal).toContain('Do not click Add to Cart');
  });
});
