import { describe, expect, it } from 'vitest';
import { REVIEW_TAG_OPTIONS } from './reviews.view-model';

describe('reviews view model', () => {
  it('uses review tag codes accepted by the v1 API DTO', () => {
    const acceptedCodes = new Set([
      'punctual',
      'manner',
      'teamwork',
      'communication',
      'active',
      'considerate',
      'passionate',
      'play_again',
    ]);

    expect(REVIEW_TAG_OPTIONS.map((option) => option.code).every((code) => acceptedCodes.has(code))).toBe(true);
  });
});
