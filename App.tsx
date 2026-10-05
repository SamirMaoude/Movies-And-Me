import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import BootSplash from "react-native-bootsplash";
import { Provider } from 'react-redux';
import Store from './Store/configureStore';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import Navigation from './Navigation/Navigation';

const persistor = persistStore(Store);

export default function App() {
  const scheme = useColorScheme(); // 'dark' | 'light' | null
  const isDark = scheme === 'dark';

  return (
    <Provider store={Store}>
      <PersistGate
        persistor={persistor}
        onBeforeLift={() => {
                        setTimeout(() => BootSplash.hide({ fade: true }), 300);
                     }}
      >
        <>
          <StatusBar
            barStyle={isDark ? 'light-content' : 'dark-content'}
            backgroundColor={isDark ? '#000000' : '#ffffff'} // Android
          />
          <Navigation />
        </>
      </PersistGate>
    </Provider>
  );
}
