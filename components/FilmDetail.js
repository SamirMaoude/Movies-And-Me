import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Share,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Film, Share2, WifiOff } from 'lucide-react-native';
import { getFilmDetailFromApi, getImageFromApi } from '../API/TMDBApi';
import {
  formatDate,
  formatDollars,
  formatNumber,
  formatReleaseShort,
  formatRuntime,
} from '../Helpers/format';
import EmptyState from './EmptyState';
import FavoriteButton from './FavoriteButton';
import RatingBadge from './RatingBadge';
import { FilmDetailSkeleton } from './Skeleton';

function Section({ title, children }) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {children}
    </View>
  );
}

function InfoRow({ label, value }) {
  const { colors } = useTheme();
  if (!value) {
    return null;
  }
  return (
    <View style={[styles.infoRow, { borderColor: colors.border }]}>
      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

export default function FilmDetail({ route, navigation }) {
  const { idFilm } = route.params;
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const isFavorite = useSelector(state =>
    state.toogleFavorite.favoritesFilm.some(film => film.id === idFilm),
  );
  const [film, setFilm] = useState(null);
  const [error, setError] = useState(false);

  const loadFilm = useCallback(() => {
    setError(false);
    getFilmDetailFromApi(idFilm)
      .then(setFilm)
      .catch(() => setError(true));
  }, [idFilm]);

  useEffect(() => {
    loadFilm();
  }, [loadFilm]);

  const toggleFavorite = useCallback(() => {
    dispatch({ type: 'TOGGLE_FAVORITE', value: film });
  }, [dispatch, film]);

  const shareFilm = useCallback(() => {
    Share.share({
      title: film.title,
      message: `${film.title}\n\n${film.overview}\n\nhttps://www.themoviedb.org/movie/${film.id}`,
    });
  }, [film]);

  // Actions dans l'en-tête, une fois le film chargé
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: film
        ? () => (
            <View style={styles.headerActions}>
              <FavoriteButton
                isFavorite={isFavorite}
                onPress={toggleFavorite}
              />
              <Pressable
                onPress={shareFilm}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Partager"
              >
                <Share2 size={22} color={colors.text} />
              </Pressable>
            </View>
          )
        : undefined,
    });
  }, [navigation, film, isFavorite, toggleFavorite, shareFilm, colors]);

  if (error) {
    return (
      <EmptyState
        icon={WifiOff}
        title="Pas de connexion"
        message="Impossible de charger ce film. Vérifie ta connexion internet."
        buttonTitle="Réessayer"
        onPress={loadFilm}
      />
    );
  }
  if (!film) {
    return <FilmDetailSkeleton />;
  }

  const backdropUri = getImageFromApi(film.backdrop_path, 'w780');
  const posterUri = getImageFromApi(film.poster_path);
  const meta = [
    formatReleaseShort(film.release_date),
    formatRuntime(film.runtime),
  ]
    .filter(Boolean)
    .join(' · ');
  const companies = film.production_companies
    .map(company => company.name)
    .join(', ');

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      {backdropUri ? (
        <Image style={styles.backdrop} source={{ uri: backdropUri }} />
      ) : (
        <View style={[styles.backdrop, { backgroundColor: colors.skeleton }]} />
      )}

      <View style={styles.hero}>
        {posterUri ? (
          <Image
            style={[styles.poster, { borderColor: colors.background }]}
            source={{ uri: posterUri }}
          />
        ) : (
          <View
            style={[
              styles.poster,
              styles.posterPlaceholder,
              {
                borderColor: colors.background,
                backgroundColor: colors.skeleton,
              },
            ]}
          >
            <Film size={36} color={colors.textSecondary} />
          </View>
        )}
        <View style={styles.heroText}>
          <Text style={[styles.title, { color: colors.text }]}>
            {film.title}
          </Text>
          {meta ? (
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              {meta}
            </Text>
          ) : null}
          <View style={styles.ratingRow}>
            <RatingBadge film={film} size="large" />
            {film.vote_count > 0 && (
              <Text style={[styles.votes, { color: colors.textSecondary }]}>
                {formatNumber(film.vote_count)} votes
              </Text>
            )}
          </View>
        </View>
      </View>

      {film.genres.length > 0 && (
        <View style={styles.genres}>
          {film.genres.map(genre => (
            <View
              key={genre.id}
              style={[
                styles.chip,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.chipText, { color: colors.text }]}>
                {genre.name}
              </Text>
            </View>
          ))}
        </View>
      )}

      {film.tagline ? (
        <Text style={[styles.tagline, { color: colors.primary }]}>
          « {film.tagline} »
        </Text>
      ) : null}

      <Section title="Synopsis">
        <Text style={[styles.overview, { color: colors.text }]}>
          {film.overview || 'Aucun résumé disponible.'}
        </Text>
      </Section>

      <Section title="Informations">
        <InfoRow
          label="Date de sortie"
          value={formatDate(film.release_date) || 'Inconnue'}
        />
        {film.original_title !== film.title && (
          <InfoRow label="Titre original" value={film.original_title} />
        )}
        {film.budget > 0 && (
          <InfoRow label="Budget" value={formatDollars(film.budget)} />
        )}
        {film.revenue > 0 && (
          <InfoRow label="Recettes" value={formatDollars(film.revenue)} />
        )}
        <InfoRow label="Production" value={companies} />
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  backdrop: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  hero: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: -48,
  },
  poster: {
    width: 110,
    height: 165,
    borderRadius: 10,
    borderWidth: 3,
  },
  posterPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    flex: 1,
    marginLeft: 14,
    marginTop: 56,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 27,
  },
  meta: {
    fontSize: 14,
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  votes: {
    fontSize: 13,
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tagline: {
    fontSize: 15,
    fontStyle: 'italic',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  overview: {
    fontSize: 15,
    lineHeight: 23,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
});
