import React from 'react';
import { StatusBar } from 'react-native';
import BootSplash from "react-native-bootsplash";
import { Provider } from 'react-redux';
import Store from './Store/configureStore';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import Navigation from './Navigation/Navigation';

const persistor = persistStore(Store);

export default function App() {
  return (
    <Provider store={Store}>
      <PersistGate
        persistor={persistor}
        onBeforeLift={() => {
                        setTimeout(() => BootSplash.hide({ fade: true }), 300);
                     }}
      >
        <>
          {/* L'interface n'existe qu'en thème clair : icônes sombres même si le téléphone est en mode sombre
              (sur Android 15+, backgroundColor est ignoré et la barre est transparente) */}
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          <Navigation />
        </>
      </PersistGate>
    </Provider>
  );
}
