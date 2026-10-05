import React from 'react'
import { StyleSheet, FlatList, ActivityIndicator, View } from 'react-native'
import { connect } from 'react-redux'
import FilmItem from './FilmItem'

class FilmList extends React.Component {

    constructor(props) {
        super(props)
    }



    _displayDetailForFilm = (idFilm) => {
        this.props.navigation.navigate('FilmDetail', {idFilm: idFilm, isFilmFavorite: this._checkFavorite(idFilm)})
    }

    _checkFavorite(idFilm){
        return this.props.favoritesFilm.findIndex(item=>item.id===idFilm)!==-1
    }


    render (){

        return (
            <View style={styles.main_container}>
           
                <FlatList
                    data = {this.props.films}
                    extraData={this.props.favoritesFilm}
                    keyExtractor = {(item) => item.id.toString()}
                    renderItem = {({item}) => <FilmItem film={item} displayDetailForFilm={this._displayDetailForFilm} isFilmFavorite={this._checkFavorite(item.id)}/>}
                    onEndReachedThreshold={1}
                    contentContainerStyle={{ paddingBottom: 240 }}
                    onEndReached={() => {
                      if (this.props.page < this.props.totalPages) {
                        // On appelle la méthode loadFilm du component Search pour charger plus de films
                        this.props.loadFilms()
                      }
                    }}
                />
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
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
    }
})

const mapStateToProps = (state) => {
    return {
        favoritesFilm: state.toogleFavorite.favoritesFilm
    }
}



export default connect(mapStateToProps)(FilmList)