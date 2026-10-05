import React from 'react'
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity, Platform, Share} from 'react-native'
import {getFilmDetailFromApi, getImageFromApi} from '../API/TMDBApi'
import moment from 'moment'
import numeral from 'numeral'
import {connect} from 'react-redux'
import EnlargeShrink from '../Animations/EnlargeShrink'

class FilmDetail extends React.Component {

    constructor(props){
        super(props)
        this.state = {
          film: undefined,
          isLoading: true
        }

        this._shareFilm = this._shareFilm.bind(this)
    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state
        // On accède à la fonction shareFilm et au film via les paramètres qu'on a ajouté à la navigation
        if (params.film != undefined && Platform.OS === 'android') {
          return {
              // On a besoin d'afficher une image, il faut donc passe par une Touchable une fois de plus
              headerRight: <TouchableOpacity
                              style={styles.share_touchable_headerrightbutton}
                              onPress={() => this._shareFilm()}>
                              <Image
                                style={styles.share_image}
                                source={require('../assets/ic_share.ios.png')} />
                            </TouchableOpacity>
          }
        }
    }

    _updateNavigationParams() {
        this.props.navigation.setParams({
          film: this.state.film
        })
      }

    componentDidMount(){
        getFilmDetailFromApi(this.props.route.params.idFilm).then(data => {
            this.setState({
                film: data,
                isLoading: false
            }, () => { this._updateNavigationParams() })
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
  
    _displayLoading(){
        if(this.state.isLoading){
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large' color="#00ff00"/>
                </View>
            )
        }
    }

    _displayFavoriteImage(){

        var sourceImage = require('../assets/unselected_favorite.png')
        var isFavoriteFilm = false

        if(this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id)!==-1){
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
              onPress={() => this._shareFilm()}>
              <Image
                style={styles.share_image}
                source={require('../assets/ic_share.android.png')} />
            </TouchableOpacity>
          )
        }
    }

    _displayFilm(){
        if(this.state.film != undefined){
            return(
                <ScrollView style={styles.image}>
                    <Image
                        style={styles.image}
                        source={{uri:getImageFromApi(this.state.film.backdrop_path)}}
                    />
                    <View style={styles.title_container}>
                        <Text style={styles.title_text}>{this.state.film.title}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.favorite_container}
                        onPress={() => this._toggleFavorite()}>
                        {this._displayFavoriteImage()}
                    </TouchableOpacity>
                    <View style={styles.description_container}>
                        <Text style={styles.description_text}>{this.state.film.overview}</Text>
                    </View>
                    <View style={styles.other_container}>
                        <Text style={styles.other_text}>Sorti le {moment(new Date(this.state.film.release_date)).format('DD/MM/YYYY')}</Text>
                        <Text style={styles.other_text}>Note : {this.state.film.vote_average} / 10</Text>
                        <Text style={styles.other_text}>Nombre de votes : {this.state.film.vote_count}</Text>
                        <Text style={styles.other_text}>Budget : {numeral(this.state.film.budget).format('0,0[.]00 $')}</Text>
                        <Text style={styles.other_text}>Genre(s) : {this.state.film.genres.map((genre)=>{
                            return genre.name;
                        }).join(' / ')}</Text>
                        <Text style={styles.other_text}>Compagnie(s) : {this.state.film.production_companies.map((compagnie)=>{
                            return compagnie.name;
                        }).join(' / ')}</Text>
                    </View>
                </ScrollView>
            )
        }
    }npm

    render(){
        return (

           <View style={ styles.main_container }>
               {this._displayFilm()}
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