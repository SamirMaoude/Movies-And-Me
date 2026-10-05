import React from 'react'
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity, Platform, Share} from 'react-native'
import {getFilmDetailFromApi, getImageFromApi} from '../API/TMDBApi'
import { formatReleaseDate, formatVote, formatNumber, formatBudget } from '../Helpers/format'
import {connect} from 'react-redux'
import EnlargeShrink from '../Animations/EnlargeShrink'
import EmptyState from './EmptyState'

class FilmDetail extends React.Component {

    constructor(props){
        super(props)
        this.state = {
          film: undefined,
          isLoading: true,
          error: false
        }

        this._shareFilm = this._shareFilm.bind(this)
        this._loadFilm = this._loadFilm.bind(this)
    }

    _updateNavigationOptions() {
        this.props.navigation.setOptions({
            title: this.state.film.title,
            // Sur iOS le partage se fait depuis l'en-tête, sur Android depuis le bouton flottant
            headerRight: Platform.OS === 'ios' ? () => (
                <TouchableOpacity
                    style={styles.share_touchable_headerrightbutton}
                    accessibilityLabel="Partager"
                    onPress={this._shareFilm}>
                    <Image
                        style={styles.share_image}
                        source={require('../assets/ic_share.ios.png')} />
                </TouchableOpacity>
            ) : undefined
        })
    }

    componentDidMount(){
        this._loadFilm()
    }

    _loadFilm(){
        this.setState({isLoading: true, error: false})
        getFilmDetailFromApi(this.props.route.params.idFilm).then(data => {
            this.setState({
                film: data,
                isLoading: false
            }, () => { this._updateNavigationOptions() })
        }).catch(() => {
            this.setState({isLoading: false, error: true})
        })
    }

    componentDidUpdate() {
        // =console.log("componentDidUpdate : ")
        // console.log(this.props.favoritesFilm)
    }


    _toggleFavorite(){

        const action = {
            type: 'TOGGLE_FAVORITE',
            value: this.state.film
        }

        this.props.dispatch(action)

    }

    _isFavorite(){
        return this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1
    }

    _displayLoading(){
        if(this.state.isLoading){
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large' color="#00ff00"/>
                </View>
            )
        }
    }

    _displayError(){
        if(this.state.error){
            return (
                <EmptyState
                    message="Impossible de charger ce film. Vérifie ta connexion internet."
                    buttonTitle="Réessayer"
                    onPress={this._loadFilm}
                />
            )
        }
    }

    _displayFavoriteImage(){

        var sourceImage = require('../assets/unselected_favorite.png')
        var isFavoriteFilm = false

        if(this._isFavorite()){
            sourceImage = require('../assets/selected_favorite.png')
            isFavoriteFilm = true
        }

        return (
            <EnlargeShrink
                isFavoriteFilm={isFavoriteFilm}
            >
                <Image
                    style={styles.favorite_image}
                    source={sourceImage}
                />
            </EnlargeShrink>
        )

    }

    _shareFilm() {
        const { film } = this.state
        Share.share({ title: film.title, message: film.overview })
    }

    _displayFloatingActionButton() {
        const { film } = this.state
        if (film != undefined && Platform.OS === 'android') { // Uniquement sur Android et lorsque le film est chargé
          return (
            <TouchableOpacity
              style={styles.share_touchable_floatingactionbutton}
              accessibilityLabel="Partager"
              onPress={() => this._shareFilm()}>
              <Image
                style={styles.share_image}
                source={require('../assets/ic_share.android.png')} />
            </TouchableOpacity>
          )
        }
    }

    _displayBackdrop(){
        const backdropUri = getImageFromApi(this.state.film.backdrop_path, 'w780')
        if(backdropUri){
            return (
                <Image
                    style={styles.image}
                    source={{uri: backdropUri}}
                />
            )
        }
    }

    _displayFilm(){
        const { film } = this.state
        if(film != undefined){
            const genres = film.genres.map((genre) => genre.name).join(' / ')
            const companies = film.production_companies.map((compagnie) => compagnie.name).join(' / ')
            return(
                <ScrollView style={styles.image}>
                    {this._displayBackdrop()}
                    <View style={styles.title_container}>
                        <Text style={styles.title_text}>{film.title}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.favorite_container}
                        accessibilityLabel={this._isFavorite() ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        onPress={() => this._toggleFavorite()}>
                        {this._displayFavoriteImage()}
                    </TouchableOpacity>
                    <View style={styles.description_container}>
                        <Text style={styles.description_text}>{film.overview || 'Aucun résumé disponible.'}</Text>
                    </View>
                    <View style={styles.other_container}>
                        <Text style={styles.other_text}>{formatReleaseDate(film.release_date)}</Text>
                        {film.vote_count > 0 ? (
                            <>
                                <Text style={styles.other_text}>Note : {formatVote(film)} / 10</Text>
                                <Text style={styles.other_text}>Nombre de votes : {formatNumber(film.vote_count)}</Text>
                            </>
                        ) : (
                            <Text style={styles.other_text}>Pas encore de note</Text>
                        )}
                        {film.budget > 0 && (
                            <Text style={styles.other_text}>Budget : {formatBudget(film.budget)}</Text>
                        )}
                        {genres.length > 0 && (
                            <Text style={styles.other_text}>Genre(s) : {genres}</Text>
                        )}
                        {companies.length > 0 && (
                            <Text style={styles.other_text}>Compagnie(s) : {companies}</Text>
                        )}
                    </View>
                </ScrollView>
            )
        }
    }

    render(){
        return (

           <View style={ styles.main_container }>
               {this._displayFilm()}
               {this._displayError()}
               {this._displayLoading()}
               {this._displayFloatingActionButton()}
           </View>

        )
    }
}


const styles = StyleSheet.create({
    main_container: {
        flex: 1
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    scrollview_container:{
        flex: 1,
        flexDirection: 'column'
    },
    image: {
        height: 180,
        margin: 5,
    },
    title_container:{
        flex: 3
    },
    title_text: {
        fontWeight: 'bold',
        fontSize: 40,
        flex: 1,
        flexWrap: 'wrap',
        paddingRight: 5,
        alignSelf: 'center'
    },
    description_container: {
        flex: 7
    },
    description_text: {
        fontStyle: 'italic',
        color: '#666666',
        fontSize: 16,
        textAlign: 'justify'
    },
    other_container: {
        flex: 1
    },
    other_text: {
        textAlign: 'left',
        fontSize: 16,
        fontWeight: 'bold'
    },
    favorite_container: {
        alignItems: 'center', // Alignement des components enfants sur l'axe secondaire, X ici
    },
    favorite_image: {
        flex: 1,
        width: null,
        height: null
    },
    share_touchable_floatingactionbutton: {
        position: 'absolute',
        width: 60,
        height: 60,
        right: 30,
        bottom: 30,
        borderRadius: 30,
        backgroundColor: '#e91e63',
        justifyContent: 'center',
        alignItems: 'center'
      },
      share_image: {
        width: 30,
        height: 30
      },
      share_touchable_headerrightbutton: {
        marginRight: 8
      }
})

const mapStateToProps = (state) => {
    return {
        favoritesFilm: state.toogleFavorite.favoritesFilm
    }
}




export default connect(mapStateToProps)(FilmDetail)
