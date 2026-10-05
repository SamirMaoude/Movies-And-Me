import moment from 'moment'

// Mises en forme partagées entre la liste et la fiche film

export function formatReleaseDate (releaseDate) {
    if (!releaseDate) {
        return 'Date de sortie inconnue'
    }
    const date = moment(releaseDate, 'YYYY-MM-DD')
    const prefix = date.isAfter(moment()) ? 'Sortie prévue le ' : 'Sorti le '
    return prefix + date.format('DD/MM/YYYY')
}

// Note sur 10 avec une décimale ; un film sans vote (souvent pas encore sorti) n'a pas de note
export function formatVote (film) {
    if (!film.vote_count) {
        return '–'
    }
    return film.vote_average.toFixed(1).replace('.', ',')
}

export function formatNumber (value) {
    return new Intl.NumberFormat('fr-FR').format(value)
}

// TMDB donne les budgets en dollars américains
export function formatBudget (budget) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(budget)
}
