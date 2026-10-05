const initialState = { favoritesFilm: [] }

function toogleFavorite(state=initialState, action){
    let nextState
    switch(action.type){
        case 'TOGGLE_FAVORITE':
            const favoriteFilmIndex = state.favoritesFilm.findIndex(item => item.id===action.value.id)

            if(favoriteFilmIndex !== -1){
                nextState = {
                    ...state,
                    favoritesFilm: state.favoritesFilm.filter((item, index)=>index !== favoriteFilmIndex)
                }
            }
            else {
                nextState = {
                    ...state,
                    favoritesFilm: [action.value, ...state.favoritesFilm]
                }
            }
        
            return nextState || state
        default:
            return state
    }
}

export default toogleFavorite