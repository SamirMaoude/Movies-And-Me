import { appendUnique } from '../Hooks/usePaginatedFilms';

const film = id => ({ id, title: `Film ${id}` });

test('ajoute une page à la suite de la précédente', () => {
  expect(appendUnique([film(1), film(2)], [film(3)])).toEqual([
    film(1),
    film(2),
    film(3),
  ]);
});

test('ignore un film déjà présent (TMDB peut le renvoyer sur deux pages)', () => {
  expect(appendUnique([film(1), film(2)], [film(2), film(3)])).toEqual([
    film(1),
    film(2),
    film(3),
  ]);
});
