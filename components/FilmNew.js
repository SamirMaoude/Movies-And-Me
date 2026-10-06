import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { WifiOff } from 'lucide-react-native';
import { getLatestFilms } from '../API/TMDBApi';
import usePaginatedFilms from '../Hooks/usePaginatedFilms';
import FilmList from './FilmList';
import EmptyState from './EmptyState';
import { FilmListSkeleton } from './Skeleton';

// Dernières sorties parmi les films ayant au moins 1 000 votes ; tirer vers le bas pour rafraîchir
export default function FilmNew() {
  const { colors } = useTheme();
  const { films, isLoading, isRefreshing, error, loadMore, retry, refresh } =
    usePaginatedFilms(getLatestFilms);

  let content;
  if (films.length > 0) {
    content = (
      <FilmList
        films={films}
        onEndReached={loadMore}
        isLoading={isLoading}
        error={error}
        onRetry={retry}
        refreshing={isRefreshing}
        onRefresh={refresh}
      />
    );
  } else if (error) {
    content = (
      <EmptyState
        icon={WifiOff}
        title="Pas de connexion"
        message="Impossible de charger les nouveautés. Vérifie ta connexion internet."
        buttonTitle="Réessayer"
        onPress={retry}
      />
    );
  } else {
    content = <FilmListSkeleton />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
