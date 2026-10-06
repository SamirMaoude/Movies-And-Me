import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Clapperboard, SearchX, WifiOff } from 'lucide-react-native';
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi';
import usePaginatedFilms from '../Hooks/usePaginatedFilms';
import SearchBar from './SearchBar';
import FilmList from './FilmList';
import EmptyState from './EmptyState';
import { FilmListSkeleton } from './Skeleton';

// Délai après la dernière frappe avant de lancer la recherche
const SEARCH_DELAY_MS = 400;

export default function Search() {
  const { colors } = useTheme();
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');

  // Recherche au fil de la frappe
  useEffect(() => {
    const timer = setTimeout(() => setQuery(text.trim()), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [text]);

  const submit = () => {
    Keyboard.dismiss();
    setQuery(text.trim());
  };

  const fetchPage = useMemo(
    () => (query ? page => getFilmsFromApiWithSearchedText(query, page) : null),
    [query],
  );
  const { films, isLoading, error, loadMore, retry } =
    usePaginatedFilms(fetchPage);

  let content;
  if (!query) {
    content = (
      <EmptyState
        icon={Clapperboard}
        title="Trouve ton prochain film"
        message="Cherche un film par son titre : les résultats s'affichent pendant que tu tapes."
      />
    );
  } else if (films.length > 0) {
    content = (
      <FilmList
        films={films}
        onEndReached={loadMore}
        isLoading={isLoading}
        error={error}
        onRetry={retry}
      />
    );
  } else if (isLoading) {
    content = <FilmListSkeleton />;
  } else if (error) {
    content = (
      <EmptyState
        icon={WifiOff}
        title="Pas de connexion"
        message="Impossible de charger les films. Vérifie ta connexion internet."
        buttonTitle="Réessayer"
        onPress={retry}
      />
    );
  } else {
    content = (
      <EmptyState
        icon={SearchX}
        title="Aucun résultat"
        message={`Aucun film ne correspond à « ${query} ».`}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SearchBar value={text} onChangeText={setText} onSubmit={submit} />
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
