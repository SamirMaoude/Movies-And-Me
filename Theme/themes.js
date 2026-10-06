import { DefaultTheme, DarkTheme } from '@react-navigation/native';

// Couleurs tirées du logo (bobine dorée sur fond bleu nuit).
// En plus des clés de React Navigation : textSecondary, skeleton, favorite et rating.
export const LightAppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#B7811A',
    background: '#F4F5F9',
    card: '#FFFFFF',
    text: '#141A2A',
    textSecondary: '#5B6478',
    border: '#E2E5EE',
    skeleton: '#E4E7EF',
    favorite: '#E5484D',
    rating: {
      good: '#1F8A4C',
      medium: '#B7791F',
      low: '#C7362E',
      none: '#7A8296',
    },
  },
};

export const DarkAppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#E8B44C',
    background: '#0B1020',
    card: '#151B2E',
    text: '#F2F4F8',
    textSecondary: '#9AA3B8',
    border: '#252D47',
    skeleton: '#1F2740',
    favorite: '#FF6369',
    rating: {
      good: '#3DD68C',
      medium: '#F5C451',
      low: '#FF7A70',
      none: '#8B93A7',
    },
  },
};

// Couleur d'une note TMDB sur 10 (gris quand le film n'a pas encore de vote)
export function ratingColor(colors, film) {
  if (!film.vote_count) {
    return colors.rating.none;
  }
  if (film.vote_average >= 7) {
    return colors.rating.good;
  }
  if (film.vote_average >= 5) {
    return colors.rating.medium;
  }
  return colors.rating.low;
}
