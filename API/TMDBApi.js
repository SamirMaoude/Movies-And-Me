const API_TOKEN = "c81ace88d89199044169b07448b39ea5"

// Rejette la promesse en cas d'erreur réseau ou HTTP : c'est à l'écran appelant d'afficher l'erreur
function fetchJson (url) {
    return fetch(url).then((response) => {
        if (!response.ok) {
            throw new Error('Erreur TMDB ' + response.status)
        }
        return response.json()
    })
}

export function getFilmsFromApiWithSearchedText (text, page) {
    const url = 'https://api.themoviedb.org/3/search/movie?api_key=' + API_TOKEN + '&language=fr&query=' + encodeURIComponent(text) + '&page=' + page
    return fetchJson(url)
}

// Tailles TMDB : w342 pour les affiches, w780 pour les images de fond affichées en pleine largeur
export function getImageFromApi (name, size = 'w342') {
    if (!name) {
        return null
    }
    return 'https://image.tmdb.org/t/p/' + size + name
}

// La fiche embarque aussi les vidéos (françaises et anglaises) et les plateformes de visionnage
export function getFilmDetailFromApi (id) {
    return fetchJson('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + API_TOKEN + '&language=fr'
        + '&append_to_response=videos,watch/providers&include_video_language=fr,en')
}

export function getLatestFilms(page){
    const url = 'https://api.themoviedb.org/3/discover/movie?api_key=' + API_TOKEN + '&vote_count.gte=1000&sort_by=release_date.desc&language=fr&page=' + page
    return fetchJson(url)
}
