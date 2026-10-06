import React, { useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import FilmItem from './FilmItem';

// Bas de liste : chargement de la page suivante, ou erreur avec un bouton pour réessayer
function ListFooter({ isLoading, error, onRetry }) {
  const { colors } = useTheme();
  if (isLoading) {
    return <ActivityIndicator style={styles.footer} color={colors.primary} />;
  }
  if (error && onRetry) {
    return (
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Impossible de charger la suite.
        </Text>
        <Pressable onPress={onRetry} hitSlop={8} accessibilityRole="button">
          <Text style={[styles.footerAction, { color: colors.primary }]}>
            Réessayer
          </Text>
        </Pressable>
      </View>
    );
  }
  return null;
}

// Liste de cartes de films ; un appui ouvre la fiche du film dans la pile de l'onglet courant
export default function FilmList({
  films,
  onEndReached,
  isLoading,
  error,
  onRetry,
  refreshing,
  onRefresh,
  ListHeaderComponent,
}) {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const favorites = useSelector(state => state.toogleFavorite.favoritesFilm);
  const favoriteIds = useMemo(
    () => new Set(favorites.map(film => film.id)),
    [favorites],
  );

  const openFilm = useCallback(
    idFilm => navigation.navigate('FilmDetail', { idFilm }),
    [navigation],
  );

  return (
    <FlatList
      data={films}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <FilmItem
          film={item}
          isFavorite={favoriteIds.has(item.id)}
          onPress={openFilm}
        />
      )}
      extraData={favoriteIds}
      contentContainerStyle={styles.content}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={
        <ListFooter
          isLoading={isLoading && !refreshing}
          error={error}
          onRetry={onRetry}
        />
      }
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            progressBackgroundColor={colors.card}
          />
        ) : undefined
      }
      // Un appui sur un film l'ouvre directement, même si le clavier est ouvert
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      style={{ backgroundColor: colors.background }}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 6,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 6,
  },
  footerText: {
    fontSize: 14,
  },
  footerAction: {
    fontSize: 15,
    fontWeight: '700',
  },
});
