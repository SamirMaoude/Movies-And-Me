import { pickTrailer, youtubeUrl, groupWatchProviders } from '../Helpers/media';

const video = (key, overrides) => ({
  key,
  site: 'YouTube',
  type: 'Trailer',
  iso_639_1: 'en',
  official: true,
  published_at: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

describe('pickTrailer', () => {
  test('préfère une bande-annonce en français', () => {
    const videos = {
      results: [video('en'), video('fr', { iso_639_1: 'fr' })],
    };
    expect(pickTrailer(videos).key).toBe('fr');
  });

  test('préfère une bande-annonce à un teaser, même en français', () => {
    const videos = {
      results: [
        video('teaser-fr', { type: 'Teaser', iso_639_1: 'fr' }),
        video('trailer-en'),
      ],
    };
    expect(pickTrailer(videos).key).toBe('trailer-en');
  });

  test('à égalité, la vidéo officielle puis la plus récente', () => {
    const videos = {
      results: [
        video('ancienne', { published_at: '2023-01-01T00:00:00.000Z' }),
        video('fan', {
          official: false,
          published_at: '2025-01-01T00:00:00.000Z',
        }),
        video('recente', { published_at: '2024-06-01T00:00:00.000Z' }),
      ],
    };
    expect(pickTrailer(videos).key).toBe('recente');
  });

  test('ignore les extraits et les vidéos hors YouTube', () => {
    const videos = {
      results: [
        video('clip', { type: 'Clip' }),
        video('vimeo', { site: 'Vimeo' }),
      ],
    };
    expect(pickTrailer(videos)).toBeNull();
    expect(pickTrailer(undefined)).toBeNull();
  });
});

test('youtubeUrl', () => {
  expect(youtubeUrl(video('abc123'))).toBe(
    'https://www.youtube.com/watch?v=abc123',
  );
});

describe('groupWatchProviders', () => {
  const provider = (id, priority) => ({
    provider_id: id,
    provider_name: `Plateforme ${id}`,
    logo_path: `/${id}.png`,
    display_priority: priority,
  });

  test('regroupe par mode d’accès, triés par priorité, gratuit = free + ads', () => {
    const watchProviders = {
      results: {
        FR: {
          link: 'https://www.themoviedb.org/movie/1/watch?locale=FR',
          flatrate: [provider(2, 5), provider(1, 1)],
          ads: [provider(3, 2)],
          buy: [provider(4, 1)],
        },
      },
    };
    const { link, groups } = groupWatchProviders(watchProviders);
    expect(link).toBe('https://www.themoviedb.org/movie/1/watch?locale=FR');
    expect(groups.map(group => group.label)).toEqual([
      'Abonnement',
      'Gratuit',
      'Achat',
    ]);
    expect(groups[0].providers.map(p => p.provider_id)).toEqual([1, 2]);
  });

  test('aucune plateforme pour le pays', () => {
    expect(groupWatchProviders({ results: { US: {} } })).toEqual({
      link: null,
      groups: [],
    });
    expect(groupWatchProviders(undefined).groups).toEqual([]);
  });
});
