import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import { getImageFromApi } from '../API/TMDBApi'
import { formatReleaseDate, formatVote } from '../Helpers/format'

import FadeIn from '../Animations/FadeIn'

class FilmItem extends React.Component {
    _displayToggleFavorite(){
      if (this.props.isFilmFavorite){
        return (
          <Image
                style={styles.favorite_image}
                source={require('../assets/selected_favorite.png')}
            />
        )
      }
    }

    _displayPoster(film){
      const posterUri = getImageFromApi(film.poster_path)
      if (posterUri) {
        return (
          <Image
              style={styles.image}
              source={{uri: posterUri}}
          />
        )
      }
      return (
        <View style={[styles.image, styles.image_placeholder]}>
            <Text style={styles.image_placeholder_text}>Pas d'affiche</Text>
        </View>
      )
    }

    render() {
        const {film, displayDetailForFilm} = this.props
        return (
          <FadeIn>
              <TouchableOpacity
                  style={ styles.main_container }
                  onPress={() => {displayDetailForFilm(film.id)}}
              
              >

                    {this._displayPoster(film)}

                    <View style={styles.content_container}>

                        <View style={styles.header_container}>
                            {this._displayToggleFavorite()}
                            <Text style={styles.title_text}>{film.title}</Text>
                            <Text style={styles.vote_text}>{formatVote(film)}</Text>
                        </View>
                        <View style={styles.description_container}>
                            <Text style={styles.description_text} numberOfLines={6}>{film.overview || 'Aucun résumé disponible.'}</Text>
                        </View>

                        <View style={styles.date_container}>
                            <Text style={styles.date_text}>{formatReleaseDate(film.release_date)}</Text>
                        </View>
                        

                    </View>
              </TouchableOpacity>
           </FadeIn>
        )
    }
}



const styles = StyleSheet.create({
  main_container: {
    height: 190,
    flexDirection: 'row'
  },
  image: {
    width: 120,
    height: 180,
    margin: 5,
  },
  image_placeholder: {
    backgroundColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image_placeholder_text: {
    color: '#666666'
  },
  content_container: {
    flex: 1,
    margin: 5
  },
  header_container: {
    flex: 3,
    flexDirection: 'row'
  },
  title_text: {
    fontWeight: 'bold',
    fontSize: 20,
    flex: 1,
    flexWrap: 'wrap',
    paddingRight: 5
  },
  vote_text: {
    fontWeight: 'bold',
    fontSize: 26,
    color: '#666666'
  },
  description_container: {
    flex: 7
  },
  description_text: {
    fontStyle: 'italic',
    color: '#666666'
  },
  date_container: {
    flex: 1
  },
  date_text: {
    textAlign: 'right',
    fontSize: 14
  },
  favorite_image: {
    width: 40,
    height: 40
}
})



export default FilmItem