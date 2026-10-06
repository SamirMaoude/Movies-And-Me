import React from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Film, Heart } from 'lucide-react-native';
import { getImageFromApi } from '../API/TMDBApi';
import { formatReleaseShort } from '../Helpers/format';
import RatingBadge from './RatingBadge';

// Carte d'un film dans les listes : affiche, titre, note, date et début du résumé
function FilmItem({ film, isFavorite, onPress }) {
  const { colors } = useTheme();
  const posterUri = getImageFromApi(film.poster_path);

  return (
    <Animated.View entering={FadeIn.duration(250)}>
      <Pressable
        onPress={() => onPress(film.id)}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        {posterUri ? (
          <Image style={styles.poster} source={{ uri: posterUri }} />
        ) : (
          <View
            style={[
              styles.poster,
              styles.posterPlaceholder,
              { backgroundColor: colors.skeleton },
            ]}
            accessibilityLabel="Pas d'affiche"
          >
            <Film size={28} color={colors.textSecondary} />
          </View>
        )}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text
              style={[styles.title, { color: colors.text }]}
              numberOfLines={2}
            >
              {film.title}
            </Text>
            {isFavorite && (
              <Heart
                size={16}
                color={colors.favorite}
                fill={colors.favorite}
                accessibilityLabel="En favori"
              />
            )}
          </View>
          <View style={styles.meta}>
            <RatingBadge film={film} />
            <Text style={[styles.date, { color: colors.textSecondary }]}>
              {formatReleaseShort(film.release_date)}
            </Text>
          </View>
          <Text
            style={[styles.overview, { color: colors.textSecondary }]}
            numberOfLines={3}
          >
            {film.overview || 'Aucun résumé disponible.'}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default React.memo(FilmItem);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  posterPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 21,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  date: {
    fontSize: 13,
  },
  overview: {
    fontSize: 13.5,
    lineHeight: 19,
    marginTop: 8,
  },
});
