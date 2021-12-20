import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { createAppContainer } from 'react-navigation'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import FilmDetail from '../componenets/FilmDetail'

import Search from '../componenets/Search'
import Favorites from '../componenets/Favorites';
import { NavigationContainer } from '@react-navigation/native';
import { LogBox } from 'react-native';
import FilmNew from '../componenets/FilmNew'

LogBox.ignoreLogs(['Warning: ...'])

const Stack = createStackNavigator()

const SearchStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName='Search'
        >
            <Stack.Screen
                name="Search"
                component={Search}
            />
            <Stack.Screen
                name="FilmDetail"
                component={FilmDetail}
            />
        </Stack.Navigator>
    )
}

const FavoriteStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName='Favorites'
        >
            <Stack.Screen
                name="Favorites"
                component={Favorites}
            />
            <Stack.Screen
                name="FilmDetail"
                component={FilmDetail}
            />
            
        </Stack.Navigator>
    )
}

const NewStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}

            initialRouteName='News'
        >
            <Stack.Screen
                name="News"
                component={FilmNew}
            />
            <Stack.Screen
                name="FilmDetail"
                component={FilmDetail}
            />
            
            
        </Stack.Navigator>
    )
}


const Tab = createBottomTabNavigator()

export default function moviesTabNavigator () {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveBackgroundColor: '#DDDDDD', // Couleur d'arrière-plan de l'onglet sélectionné
                    tabBarInactiveBackgroundColor: '#FFFFFF', // Couleur d'arrière-plan des onglets non sélectionnés
                    tabBarShowLabel: false, // On masque les titres
                    tabBarShowIcon: true, // On informe le TabNavigator qu'on souhaite afficher les icônes définis
               
                }}
            >
                <Tab.Screen
                    name="Rechercher"
                    component={SearchStackNavigator}
                    options={{
                        tabBarIcon:() => {
                        return <Image
                          source={require('../assets/ic_search.png')}
                          style={styles.icon}/>
                      }
                    }}
                />
                <Tab.Screen
                    name="Favoris"
                    component={FavoriteStackNavigator}
                    options={{
                        tabBarIcon:() => {
                        return <Image
                          source={require('../assets/selected_favorite.png')}
                          style={styles.icon}/>
                      }
                    }}
                />
                <Tab.Screen
                    name="Nouveautés"
                    component={NewStackNavigator}
                    options={{
                        tabBarIcon:() => {
                        return <Image
                          source={require('../assets/ic_fiber_new.png')}
                          style={styles.icon}/>
                      }
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    icon: {
        width: 30,
        height: 30
    }
})

//export default createAppContainer(SearchStackNavigator)