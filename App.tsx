import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { Provider } from 'react-redux';
import Store from './Store/configureStore';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import Navigation from './Navigation/Navigation';
import { DarkAppTheme, LightAppTheme } from './Theme/themes';

const persistor = persistStore(Store);

export default function App() {
  const theme = useColorScheme() === 'dark' ? DarkAppTheme : LightAppTheme;
  return (
    <Provider store={Store}>
      <PersistGate
        persistor={persistor}
        onBeforeLift={() => {
          setTimeout(() => BootSplash.hide({ fade: true }), 300);
        }}
      >
        <>
          {/* Barre d'état assortie aux en-têtes (sur Android 15+, backgroundColor est ignoré et la barre est transparente) */}
          <StatusBar
            barStyle={theme.dark ? 'light-content' : 'dark-content'}
            backgroundColor={theme.colors.card}
          />
          <Navigation />
        </>
      </PersistGate>
    </Provider>
  );
}
