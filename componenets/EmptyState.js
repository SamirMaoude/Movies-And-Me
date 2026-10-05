import React from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'

// Message centré affiché à la place d'une liste vide ou d'un contenu en erreur, avec un bouton optionnel
class EmptyState extends React.Component {

    render() {
        const { message, buttonTitle, onPress } = this.props
        return (
            <View style={styles.main_container}>
                <Text style={styles.message_text}>{message}</Text>
                {onPress && (
                    <Button title={buttonTitle} onPress={onPress} />
                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    message_text: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 12
    }
})

export default EmptyState
