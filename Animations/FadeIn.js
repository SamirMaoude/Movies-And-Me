import React from "react"
import { Animated, Dimensions } from "react-native"



class FadeIn extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            leftPosition: new Animated.Value(Dimensions.get('window').width)
        }
    }

    componentDidMount() {
        Animated.spring(
            this.state.leftPosition,
            {
                toValue: 0,
                useNativeDriver: false
            }
        ).start()
    }

    render() {
        return (
            <Animated.View style={{left: this.state.leftPosition}}>
                {this.props.children}
            </Animated.View>
        )
    }
}

export default FadeIn