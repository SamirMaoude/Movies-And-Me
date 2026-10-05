import toogleFavorite from '../Store/Reducers/favoriteReducer';

const dune = { id: 438631, title: 'Dune' };
const alien = { id: 348, title: 'Alien, le huitième passager' };
const toggle = film => ({ type: 'TOGGLE_FAVORITE', value: film });

test('aucun favori au départ', () => {
  expect(toogleFavorite(undefined, { type: '@@INIT' }).favoritesFilm).toEqual([]);
});

test('ajoute un film en tête des favoris', () => {
  let state = toogleFavorite(undefined, toggle(dune));
  state = toogleFavorite(state, toggle(alien));
  expect(state.favoritesFilm).toEqual([alien, dune]);
});

test('retire un film déjà en favori, sans modifier le state précédent', () => {
  const withDune = toogleFavorite(undefined, toggle(dune));
  const withoutDune = toogleFavorite(withDune, toggle({ ...dune }));
  expect(withoutDune.favoritesFilm).toEqual([]);
  expect(withDune.favoritesFilm).toEqual([dune]);
});
