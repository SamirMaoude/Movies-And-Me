import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Heart } from 'lucide-react-native';
import Avatar from './Avatar';
import FilmList from './FilmList';
import EmptyState from './EmptyState';

function countLabel(count) {
  if (count === 0) {
    return 'Aucun film pour le moment';
  }
  return count === 1 ? '1 film favori' : `${count} films favoris`;
}

// En-tête de profil (photo et nombre de favoris) au-dessus de la liste
function ProfileHeader({ count }) {
  const { colors } = useTheme();
  return (
    <View style={styles.profile}>
      <Avatar />
      <View style={styles.profileText}>
        <Text style={[styles.title, { color: colors.text }]}>
          Ma vidéothèque
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {countLabel(count)}
        </Text>
      </View>
    </View>
  );
}

export default function Favorites() {
  const { colors } = useTheme();
  const favorites = useSelector(state => state.toogleFavorite.favoritesFilm);
  const header = <ProfileHeader count={favorites.length} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {favorites.length > 0 ? (
        <FilmList films={favorites} ListHeaderComponent={header} />
      ) : (
        <>
          {header}
          <EmptyState
            icon={Heart}
            title="Aucun favori"
            message="Touche le cœur dans la fiche d'un film pour le retrouver ici."
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  profileText: {
    marginLeft: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
});
