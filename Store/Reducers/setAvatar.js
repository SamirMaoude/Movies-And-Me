// Photo de profil choisie par l'utilisateur ({ uri }) ; null tant qu'il n'en a pas choisi
let initialState = {avatar: null}


function setAvatar(state=initialState, action) {
    let nextState;
    switch(action.type) {
        case 'SET_AVATAR':
            nextState = {
                ...state,
                avatar: action.value
            }

            return nextState || state
        default:
            return state
    }

}

export default setAvatar
