import moment from 'moment';

// Mises en forme partagées entre la liste et la fiche film

// "2024-02-27" -> "27/02/2024" ; null si la date est inconnue
export function formatDate(releaseDate) {
  if (!releaseDate) {
    return null;
  }
  return moment(releaseDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
}

// Version courte pour les cartes de la liste : l'année, ou la date complète d'un film pas encore sorti
export function formatReleaseShort(releaseDate) {
  if (!releaseDate) {
    return 'Date inconnue';
  }
  const date = moment(releaseDate, 'YYYY-MM-DD');
  if (date.isAfter(moment())) {
    return 'Sortie le ' + date.format('DD/MM/YYYY');
  }
  return date.format('YYYY');
}

// Durée en minutes : 166 -> "2 h 46", 45 -> "45 min" ; null si inconnue
export function formatRuntime(minutes) {
  if (!minutes) {
    return null;
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) {
    return rest + ' min';
  }
  return hours + ' h ' + String(rest).padStart(2, '0');
}

// Note sur 10 avec une décimale ; un film sans vote (souvent pas encore sorti) n'a pas de note
export function formatVote(film) {
  if (!film.vote_count) {
    return '–';
  }
  return film.vote_average.toFixed(1).replace('.', ',');
}

export function formatNumber(value) {
  return new Intl.NumberFormat('fr-FR').format(value);
}

// Montants TMDB (budget, recettes), en dollars américains
export function formatDollars(amount) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
