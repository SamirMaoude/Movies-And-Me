import React from 'react'
import {View, TextInput, Button, StyleSheet, FlatList, ActivityIndicator} from 'react-native'
import FilmItem from './FilmItem';
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi'
import {connect} from 'react-redux'
import FilmList from './FilmList';

class Search extends React.Component {

    constructor(props){
        super(props)
        this.searchedText =  ""
        this.page = 0
        this.total_pages = 0
        this.state = {
            films: [],
            isLoading: false,
        }

        this._loadFilms = this._loadFilms.bind(this)
    }

    _loadFilms(){
        if(this.searchedText.length>0){
            this.setState({isLoading: true})
            getFilmsFromApiWithSearchedText(this.searchedText, this.page+1).then(data => {
                this.page = data.page
                this.total_pages = data.total_pages
                this.setState({films: [...this.state.films ,...data.results], isLoading: false})
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

    _searchFilms(){
        this.page = 0
        this.total_pages = 0
        this.setState({films: []}, () => {this._loadFilms()})
    }

    

    _displayDetailForFilm = (idFilm) => {
        this.props.navigation.navigate('FilmDetail', {idFilm: idFilm})
    }

    render() {
        return (
            
            <View style={styles.main_container}>
                <TextInput
                    style={styles.textinput}
                    placeholder='Titre du film'
                    onChangeText={(text) => this._searchTextInputChangedtext(text)}
                    onSubmitEditing={() => this._searchFilms()}
                />
                <Button
                    title='Rechercher'
                    onPress={() => this._searchFilms()}
                />
                <FilmList
                    films={this.state.films}
                    navigation={this.props.navigation}
                    loadFilms={this._loadFilms}
                    page={this.page}
                    totalPages={this.total_pages}
                />
                {this._displayLoading()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    // main_container: {
    //     flex: 1,
    //     marginTop: 20
    // },

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

export default connect(mapStateToProps)(Search)