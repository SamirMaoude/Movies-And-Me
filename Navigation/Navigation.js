import React from 'react';
import { Image, StyleSheet, LogBox } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import FilmDetail from '../components/FilmDetail';
import Search from '../components/Search';
import Favorites from '../components/Favorites';
import FilmNew from '../components/FilmNew';

LogBox.ignoreLogs(['Warning: ...']);

const Stack = createStackNavigator();

// L'en-tête vient des piles (et non des onglets) pour avoir la flèche retour sur la fiche film,
// dont le titre est remplacé par celui du film une fois chargé
const SearchStackNavigator = () => (
  <Stack.Navigator initialRouteName="Search">
    <Stack.Screen name="Search" component={Search} options={{ title: 'Rechercher' }} />
    <Stack.Screen name="FilmDetail" component={FilmDetail} options={{ title: '' }} />
  </Stack.Navigator>
);

const FavoriteStackNavigator = () => (
  <Stack.Navigator initialRouteName="Favorites">
    <Stack.Screen name="Favorites" component={Favorites} options={{ title: 'Favoris' }} />
    <Stack.Screen name="FilmDetail" component={FilmDetail} options={{ title: '' }} />
  </Stack.Navigator>
);

const NewStackNavigator = () => (
  <Stack.Navigator initialRouteName="News">
    <Stack.Screen name="News" component={FilmNew} options={{ title: 'Nouveautés' }} />
    <Stack.Screen name="FilmDetail" component={FilmDetail} options={{ title: '' }} />
  </Stack.Navigator>
);

const Tab = createBottomTabNavigator();

export default function MoviesTabNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveBackgroundColor: '#DDDDDD',
          tabBarInactiveBackgroundColor: '#FFFFFF',
          tabBarShowLabel: false,
          tabBarShowIcon: true,
        }}
      >
        <Tab.Screen
          name="Rechercher"
          component={SearchStackNavigator}
          options={{
            tabBarIcon: () => (
              <Image source={require('../assets/ic_search.png')} style={styles.icon} />
            ),
          }}
        />
        <Tab.Screen
          name="Favoris"
          component={FavoriteStackNavigator}
          options={{
            tabBarIcon: () => (
              <Image source={require('../assets/selected_favorite.png')} style={styles.icon} />
            ),
          }}
        />
        <Tab.Screen
          name="Nouveautés"
          component={NewStackNavigator}
          options={{
            tabBarIcon: () => (
              <Image source={require('../assets/ic_fiber_new.png')} style={styles.icon} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  icon: { width: 30, height: 30 },
});
