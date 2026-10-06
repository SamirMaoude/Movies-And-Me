import {
  formatDate,
  formatReleaseShort,
  formatRuntime,
  formatVote,
  formatNumber,
  formatDollars,
} from '../Helpers/format';

// Intl sépare les milliers par des espaces insécables en français : on les normalise pour comparer
const withPlainSpaces = text => text.replace(/\s/g, ' ');

describe('formatDate', () => {
  test('au format jour/mois/année', () => {
    expect(formatDate('2024-02-27')).toBe('27/02/2024');
  });

  test('null si la date est inconnue', () => {
    expect(formatDate('')).toBeNull();
    expect(formatDate(undefined)).toBeNull();
  });
});

describe('formatReleaseShort', () => {
  test("l'année d'un film déjà sorti", () => {
    expect(formatReleaseShort('2023-05-17')).toBe('2023');
  });

  test("la date complète d'un film pas encore sorti", () => {
    expect(formatReleaseShort('2999-12-15')).toBe('Sortie le 15/12/2999');
  });

  test('date inconnue', () => {
    expect(formatReleaseShort('')).toBe('Date inconnue');
  });
});

describe('formatRuntime', () => {
  test('heures et minutes', () => {
    expect(formatRuntime(166)).toBe('2 h 46');
    expect(formatRuntime(120)).toBe('2 h 00');
  });

  test("minutes seules sous l'heure", () => {
    expect(formatRuntime(45)).toBe('45 min');
  });

  test('null si la durée est inconnue', () => {
    expect(formatRuntime(0)).toBeNull();
    expect(formatRuntime(null)).toBeNull();
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

test('formatDollars affiche des dollars américains sans décimales', () => {
  expect(withPlainSpaces(formatDollars(340000000))).toBe('340 000 000 $US');
});
