import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { getLatestFilms } from "../API/TMDBApi";
import FilmList from "./FilmList";
import EmptyState from "./EmptyState";




class FilmNew extends React.Component {

    constructor(props) {
        super(props)
        this.page = 0
        this.total_pages = 0
        this.state = {
            films: [],
            isLoading: false,
            error: false,
        }

        this._loadFilms = this._loadFilms.bind(this)
    }

    _loadFilms(){
        if (this.state.isLoading) {
            return
        }
        this.setState({isLoading: true, error: false})
        getLatestFilms(this.page+1).then(data => {
            this.page = data.page
            this.total_pages = data.total_pages
            this.setState({films: [...this.state.films ,...data.results], isLoading: false})
        }).catch(() => {
            this.setState({isLoading: false, error: true})
        })
    }

    _displayError(){
        return (
            <EmptyState
                message="Impossible de charger les nouveautés. Vérifie ta connexion internet."
                buttonTitle="Réessayer"
                onPress={this._loadFilms}
            />
        )
    }

    componentDidMount() {

      this._loadFilms()

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

    _displayDetailForFilm = (idFilm) => {
        this.props.navigation.navigate('FilmDetail', {idFilm: idFilm})
    }

    render () {
        return (
            <View style={styles.main_container}>

                {this.state.error && this.state.films.length === 0 ? this._displayError() : (
                    <FilmList
                        films={this.state.films}
                        navigation={this.props.navigation}
                        loadFilms={this._loadFilms}
                        page={this.page}
                        totalPages={this.total_pages}
                        footer={this.state.error ? this._displayError() : null}
                    />
                )}
                {this._displayLoading()}
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
    }
})

export default FilmNew