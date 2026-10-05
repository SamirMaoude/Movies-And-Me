import {
  formatReleaseDate,
  formatVote,
  formatNumber,
  formatBudget,
} from '../Helpers/format';

// Intl sépare les milliers par des espaces insécables en français : on les normalise pour comparer
const withPlainSpaces = text => text.replace(/\s/g, ' ');

describe('formatReleaseDate', () => {
  test('film déjà sorti', () => {
    expect(formatReleaseDate('2023-05-17')).toBe('Sorti le 17/05/2023');
  });

  test('film pas encore sorti', () => {
    expect(formatReleaseDate('2999-12-15')).toBe('Sortie prévue le 15/12/2999');
  });

  test('date inconnue', () => {
    expect(formatReleaseDate('')).toBe('Date de sortie inconnue');
    expect(formatReleaseDate(undefined)).toBe('Date de sortie inconnue');
  });
});

describe('formatVote', () => {
  test('une décimale, avec une virgule', () => {
    expect(formatVote({ vote_average: 7.671, vote_count: 6534 })).toBe('7,7');
    expect(formatVote({ vote_average: 7, vote_count: 12 })).toBe('7,0');
  });

  test("pas de note tant qu'il n'y a aucun vote", () => {
    expect(formatVote({ vote_average: 0, vote_count: 0 })).toBe('–');
  });
});

test('formatNumber sépare les milliers', () => {
  expect(withPlainSpaces(formatNumber(6534))).toBe('6 534');
});

test('formatBudget affiche des dollars américains sans décimales', () => {
  expect(withPlainSpaces(formatBudget(340000000))).toBe('340 000 000 $US');
});
