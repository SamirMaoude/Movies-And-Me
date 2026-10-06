import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Star } from 'lucide-react-native';
import { ratingColor } from '../Theme/themes';
import { formatVote } from '../Helpers/format';

// Note du film dans une pastille colorée : vert, ambre ou rouge selon la note, gris sans vote
export default function RatingBadge({ film, size = 'small' }) {
  const { colors } = useTheme();
  const color = ratingColor(colors, film);
  const large = size === 'large';
  return (
    <View
      accessible
      accessibilityLabel={
        film.vote_count
          ? `Note ${formatVote(film)} sur 10`
          : 'Pas encore de note'
      }
      style={[
        styles.badge,
        large && styles.badgeLarge,
        { backgroundColor: color + '22', borderColor: color + '66' },
      ]}
    >
      <Star
        size={large ? 16 : 12}
        color={color}
        fill={film.vote_count ? color : 'transparent'}
      />
      <Text style={[styles.text, large && styles.textLarge, { color }]}>
        {formatVote(film)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  badgeLarge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
  },
  textLarge: {
    fontSize: 16,
  },
});
