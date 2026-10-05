import React from 'react'
import { StyleSheet, FlatList, ActivityIndicator, View } from 'react-native'
import { connect } from 'react-redux'
import FilmItem from './FilmItem'
import FilmList from './FilmList'
import Avatar from './Avatar'
import EmptyState from './EmptyState'

class Favorites extends React.Component {

    constructor(props) {
        super(props)
        this.page = 0
        this.total_pages = 0
        this.state = {
            films: [],
            isLoading: true
        }
    }

    

    _displayDetailForFilm = (idFilm) => {
        this.props.navigation.navigate('FilmDetail', {idFilm: idFilm, isFilmFavorite: true})
    }



    render (){

        return (
            <View style={styles.main_container}>

                <View style={styles.avatar_container}>
                    <Avatar />
                </View>
           
                {this.props.favoritesFilm.length > 0 ? (
                    <FilmList
                        films={this.props.favoritesFilm}
                        navigation={this.props.navigation}
                        page={this.page}
                        totalPages={this.total_pages}
                    />
                ) : (
                    <EmptyState message="Aucun favori pour l'instant. Touche le cœur dans la fiche d'un film pour l'ajouter ici." />
                )}

            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1
    },
    textinput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5,
    },

    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatar_container: {
        alignItems: 'center'
    }
})

const mapStateToProps = (state) => {
    return {
        favoritesFilm: state.toogleFavorite.favoritesFilm
    }
}



export default connect(mapStateToProps)(Favorites)