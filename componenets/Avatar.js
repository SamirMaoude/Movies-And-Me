import React from "react";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { connect } from 'react-redux'


class Avatar extends React.Component {

    constructor(props) {
        super(props)
    }

    _avatarClicked = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                maxWidth: 100,
                maxHeight: 100,
                quality: 1
            }, (response) => {
            if (response.didCancel) {
                console.log('L\'utilisateur a annulé')
            }
            else if (response.errorCode) {
                console.log('Erreur : ', response.errorMessage)
            }
            else {
                let requireSource = { uri: response.assets[0].uri }
                const action = {type:'SET_AVATAR', value:requireSource}
                this.props.dispatch(action)
            }
        })
            
    }

    render() {
        return (
            <TouchableOpacity
                style={styles.touchableOpacity}
                onPress={this._avatarClicked}>
                <Image style={styles.avatar} source={this.props.avatar} />
            </TouchableOpacity>
        )
    }

}

const styles = StyleSheet.create({
    touchableOpacity: {
        margin: 5,
        width: 100, // Pensez bien à définir une largeur ici, sinon toute la largeur de l'écran sera cliquable
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: '#9B9B9B',
        borderWidth: 2
    }
})

const mapStateToProps = state => {
    return {
        avatar: state.setAvatar.avatar
    }
}

export default connect(mapStateToProps)(Avatar)