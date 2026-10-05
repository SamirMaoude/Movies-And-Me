import React from 'react'
import {View, TextInput, Button, StyleSheet, FlatList, ActivityIndicator, Keyboard} from 'react-native'
import FilmItem from './FilmItem';
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi'
import {connect} from 'react-redux'
import FilmList from './FilmList';
import EmptyState from './EmptyState';

class Search extends React.Component {

    constructor(props){
        super(props)
        this.searchedText =  ""
        this.searchId = 0
        this.page = 0
        this.total_pages = 0
        this.state = {
            films: [],
            isLoading: false,
            error: false,
            query: "" // texte de la dernière recherche lancée, utilisé aussi pour charger les pages suivantes
        }

        this._loadFilms = this._loadFilms.bind(this)
    }

    _loadFilms(){
        if(this.state.query.length>0 && !this.state.isLoading){
            // Une réponse arrivée après le lancement d'une nouvelle recherche est ignorée
            const searchId = this.searchId
            this.setState({isLoading: true, error: false})
            getFilmsFromApiWithSearchedText(this.state.query, this.page+1).then(data => {
                if (searchId !== this.searchId) {
                    return
                }
                this.page = data.page
                this.total_pages = data.total_pages
                this.setState({films: [...this.state.films ,...data.results], isLoading: false})
            }).catch(() => {
                if (searchId !== this.searchId) {
                    return
                }
                this.setState({isLoading: false, error: true})
            })
        }
    }

    _searchTextInputChangedtext(text){
        this.searchedText = text
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
        return (
            <EmptyState
                message="Impossible de charger les films. Vérifie ta connexion internet."
                buttonTitle="Réessayer"
                onPress={this._loadFilms}
            />
        )
    }

    _displayResults(){
        const { films, isLoading, error, query } = this.state
        if (films.length > 0) {
            return (
                <FilmList
                    films={films}
                    navigation={this.props.navigation}
                    loadFilms={this._loadFilms}
                    page={this.page}
                    totalPages={this.total_pages}
                    footer={error ? this._displayError() : null}
                />
            )
        }
        if (isLoading) {
            return null
        }
        if (error) {
            return this._displayError()
        }
        if (query.length > 0) {
            return <EmptyState message={'Aucun film trouvé pour « ' + query + ' ».'} />
        }
        return <EmptyState message="Tape le titre d'un film puis lance la recherche." />
    }

    _searchFilms(){
        Keyboard.dismiss()
        this.searchId++
        this.page = 0
        this.total_pages = 0
        this.setState({films: [], isLoading: false, error: false, query: this.searchedText.trim()}, () => {this._loadFilms()})
    }



    _displayDetailForFilm = (idFilm) => {
        this.props.navigation.navigate('FilmDetail', {idFilm: idFilm})
    }

    render() {
        return (

            <View style={styles.main_container}>
            <TextInput
                style={styles.textinput}
                placeholder="Titre du film"
                placeholderTextColor="#999"
                onChangeText={(text) => this._searchTextInputChangedtext(text)}
                onSubmitEditing={() => this._searchFilms()}
            />

                <Button
                    title='Rechercher'
                    onPress={() => this._searchFilms()}
                />
                {this._displayResults()}
                {this._displayLoading()}
            </View>
        );
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
        color: '#000',
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

export default connect(mapStateToProps)(Search)
