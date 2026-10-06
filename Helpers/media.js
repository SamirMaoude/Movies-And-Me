// Bande-annonce et plateformes de visionnage, à partir des données ajoutées à la fiche TMDB
// (append_to_response=videos,watch/providers)

const VIDEO_TYPE_RANK = { Trailer: 0, Teaser: 1 };

// Meilleure vidéo YouTube : bande-annonce avant teaser, en français si possible,
// officielle de préférence, puis la plus récente ; null s'il n'y en a pas
export function pickTrailer(videos) {
  const candidates = ((videos && videos.results) || []).filter(
    video => video.site === 'YouTube' && video.type in VIDEO_TYPE_RANK,
  );
  candidates.sort(
    (a, b) =>
      VIDEO_TYPE_RANK[a.type] - VIDEO_TYPE_RANK[b.type] ||
      (b.iso_639_1 === 'fr') - (a.iso_639_1 === 'fr') ||
      b.official - a.official ||
      (b.published_at || '').localeCompare(a.published_at || ''),
  );
  return candidates[0] || null;
}

export function youtubeUrl(video) {
  return 'https://www.youtube.com/watch?v=' + video.key;
}

// Plateformes d'un pays, regroupées par mode d'accès et triées comme sur TMDB.
// link : page TMDB qui renvoie vers chaque plateforme (null si le film n'y est pas référencé)
export function groupWatchProviders(watchProviders, country = 'FR') {
  const data =
    watchProviders && watchProviders.results && watchProviders.results[country];
  if (!data) {
    return { link: null, groups: [] };
  }
  const groups = [
    { label: 'Abonnement', providers: data.flatrate || [] },
    {
      label: 'Gratuit',
      providers: [...(data.free || []), ...(data.ads || [])],
    },
    { label: 'Location', providers: data.rent || [] },
    { label: 'Achat', providers: data.buy || [] },
  ]
    .filter(group => group.providers.length > 0)
    .map(group => ({
      ...group,
      providers: [...group.providers].sort(
        (a, b) => a.display_priority - b.display_priority,
      ),
    }));
  return { link: data.link || null, groups };
}
