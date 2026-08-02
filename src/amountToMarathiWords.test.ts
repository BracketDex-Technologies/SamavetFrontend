import { describe, expect, it } from 'vitest';
import { amountToMarathiWords } from './App';

describe('amountToMarathiWords', () => {
  it.each([
    [0, 'शून्य रुपये फक्त'],
    [100, 'शंभर रुपये फक्त'],
    [101, 'एकशे एक रुपये फक्त'],
    [1101, 'एक हजार एकशे एक रुपये फक्त'],
  ])('renders %s using natural Marathi wording', (amount, expected) => {
    expect(amountToMarathiWords(amount)).toBe(expected);
  });

  it('rejects invalid or negative amounts', () => {
    expect(amountToMarathiWords(-1)).toBe('');
    expect(amountToMarathiWords('not-a-number')).toBe('');
  });
});
