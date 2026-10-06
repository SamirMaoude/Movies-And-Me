import { useCallback, useEffect, useRef, useState } from 'react';

// Ajoute une page de résultats sans doublons (TMDB peut renvoyer un même film sur deux pages)
export function appendUnique(previous, results) {
  const ids = new Set(previous.map(film => film.id));
  return [...previous, ...results.filter(film => !ids.has(film.id))];
}

// Liste de films paginée : première page, pages suivantes, erreur, nouvel essai et rafraîchissement.
// fetchPage(page) renvoie une promesse { page, total_pages, results } ; null = rien à charger.
// Quand fetchPage change (nouvelle recherche), la liste repart de zéro et les réponses
// encore attendues pour l'ancienne source sont ignorées.
export default function usePaginatedFilms(fetchPage) {
  const [films, setFilms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const generation = useRef(0);
  const page = useRef(0);
  const totalPages = useRef(0);
  const loading = useRef(false);

  const load = useCallback(
    pageToLoad => {
      const currentGeneration = generation.current;
      loading.current = true;
      setIsLoading(true);
      setError(false);
      fetchPage(pageToLoad)
        .then(data => {
          if (currentGeneration !== generation.current) {
            return;
          }
          page.current = data.page;
          totalPages.current = data.total_pages;
          setFilms(previous =>
            appendUnique(pageToLoad === 1 ? [] : previous, data.results),
          );
        })
        .catch(() => {
          if (currentGeneration === generation.current) {
            setError(true);
          }
        })
        .finally(() => {
          if (currentGeneration === generation.current) {
            loading.current = false;
            setIsLoading(false);
            setIsRefreshing(false);
          }
        });
    },
    [fetchPage],
  );

  // Nouvelle source : on repart de la première page
  useEffect(() => {
    generation.current += 1;
    page.current = 0;
    totalPages.current = 0;
    loading.current = false;
    setFilms([]);
    setError(false);
    setIsRefreshing(false);
    setIsLoading(false);
    if (fetchPage) {
      load(1);
    }
  }, [fetchPage, load]);

  // Page suivante, appelée en arrivant en bas de la liste (pas après une erreur : l'utilisateur réessaie)
  const loadMore = useCallback(() => {
    if (
      fetchPage &&
      !loading.current &&
      !error &&
      page.current < totalPages.current
    ) {
      load(page.current + 1);
    }
  }, [fetchPage, error, load]);

  const retry = useCallback(() => {
    if (fetchPage) {
      load(page.current + 1);
    }
  }, [fetchPage, load]);

  // Recharge la première page en gardant la liste affichée jusqu'à la réponse
  const refresh = useCallback(() => {
    if (fetchPage) {
      generation.current += 1;
      setIsRefreshing(true);
      load(1);
    }
  }, [fetchPage, load]);

  return { films, isLoading, isRefreshing, error, loadMore, retry, refresh };
}
