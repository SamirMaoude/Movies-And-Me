import React from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Heart, Search as SearchIcon, Sparkles } from 'lucide-react-native';

import { DarkAppTheme, LightAppTheme } from '../Theme/themes';
import FilmDetail from '../components/FilmDetail';
import Search from '../components/Search';
import Favorites from '../components/Favorites';
import FilmNew from '../components/FilmNew';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Chaque onglet a sa pile d'écrans : la fiche d'un film s'ouvre sans quitter l'onglet
function createTabStack(name, component, title) {
  return function TabStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name={name} component={component} options={{ title }} />
        <Stack.Screen
          name="FilmDetail"
          component={FilmDetail}
          options={{ title: '' }}
        />
      </Stack.Navigator>
    );
  };
}

const SearchStack = createTabStack('Search', Search, 'Rechercher');
const FavoritesStack = createTabStack('Favorites', Favorites, 'Favoris');
const NewStack = createTabStack('News', FilmNew, 'Nouveautés');

const searchIcon = ({ color, size }) => (
  <SearchIcon color={color} size={size} />
);
const favoritesIcon = ({ color, size }) => <Heart color={color} size={size} />;
const newIcon = ({ color, size }) => <Sparkles color={color} size={size} />;

// Thème clair ou sombre selon le réglage du téléphone
export default function Navigation() {
  const scheme = useColorScheme();
  return (
    <NavigationContainer
      theme={scheme === 'dark' ? DarkAppTheme : LightAppTheme}
    >
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Rechercher"
          component={SearchStack}
          options={{ tabBarIcon: searchIcon }}
        />
        <Tab.Screen
          name="Favoris"
          component={FavoritesStack}
          options={{ tabBarIcon: favoritesIcon }}
        />
        <Tab.Screen
          name="Nouveautés"
          component={NewStack}
          options={{ tabBarIcon: newIcon }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
