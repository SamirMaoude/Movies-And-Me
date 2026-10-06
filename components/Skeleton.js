import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

// Bloc qui pulse pendant le chargement, à la place du contenu attendu
export function SkeletonBox({ style }) {
  const { colors } = useTheme();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.4, { duration: 700 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      style={[
        styles.box,
        { backgroundColor: colors.skeleton },
        style,
        animatedStyle,
      ]}
    />
  );
}

// Cartes factices qui reprennent la forme de FilmItem
export function FilmListSkeleton() {
  const { colors } = useTheme();
  return (
    <View
      style={styles.list}
      accessible
      accessibilityLabel="Chargement des films"
    >
      {[0, 1, 2, 3, 4].map(index => (
        <View
          key={index}
          style={[styles.card, { backgroundColor: colors.card }]}
        >
          <SkeletonBox style={styles.poster} />
          <View style={styles.cardContent}>
            <SkeletonBox style={styles.lineTitle} />
            <SkeletonBox style={styles.lineBadge} />
            <SkeletonBox style={styles.line} />
            <SkeletonBox style={styles.line} />
            <SkeletonBox style={styles.lineShort} />
          </View>
        </View>
      ))}
    </View>
  );
}

// Fiche factice qui reprend la forme de FilmDetail
export function FilmDetailSkeleton() {
  return (
    <ScrollView accessible accessibilityLabel="Chargement du film">
      <SkeletonBox style={styles.backdrop} />
      <View style={styles.hero}>
        <SkeletonBox style={styles.detailPoster} />
        <View style={styles.heroText}>
          <SkeletonBox style={styles.lineTitle} />
          <SkeletonBox style={styles.lineShort} />
          <SkeletonBox style={styles.lineBadge} />
        </View>
      </View>
      <View style={styles.section}>
        <SkeletonBox style={styles.line} />
        <SkeletonBox style={styles.line} />
        <SkeletonBox style={styles.line} />
        <SkeletonBox style={styles.lineShort} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 6,
  },
  list: {
    paddingVertical: 6,
  },
  card: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 10,
    borderRadius: 14,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
    gap: 8,
  },
  lineTitle: {
    height: 18,
    width: '70%',
  },
  lineBadge: {
    height: 18,
    width: 64,
    borderRadius: 10,
  },
  line: {
    height: 12,
    width: '100%',
  },
  lineShort: {
    height: 12,
    width: '55%',
  },
  backdrop: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 0,
  },
  hero: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: -48,
  },
  detailPoster: {
    width: 110,
    height: 165,
    borderRadius: 10,
  },
  heroText: {
    flex: 1,
    marginLeft: 14,
    marginTop: 60,
    gap: 10,
  },
  section: {
    padding: 16,
    gap: 8,
  },
});
