import React from 'react';
import { Image, StyleSheet, LogBox } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import FilmDetail from '../componenets/FilmDetail';
import Search from '../componenets/Search';
import Favorites from '../componenets/Favorites';
import FilmNew from '../componenets/FilmNew';

LogBox.ignoreLogs(['Warning: ...']);

const Stack = createStackNavigator();

const SearchStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Search">
    <Stack.Screen name="Search" component={Search} />
    <Stack.Screen name="FilmDetail" component={FilmDetail} />
  </Stack.Navigator>
);

const FavoriteStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Favorites">
    <Stack.Screen name="Favorites" component={Favorites} />
    <Stack.Screen name="FilmDetail" component={FilmDetail} />
  </Stack.Navigator>
);

const NewStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="News">
    <Stack.Screen name="News" component={FilmNew} />
    <Stack.Screen name="FilmDetail" component={FilmDetail} />
  </Stack.Navigator>
);

const Tab = createBottomTabNavigator();

export default function MoviesTabNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
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
