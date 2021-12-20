import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Search from './componenets/Search';
import Navigation from './Navigation/Navigation';
import { Provider } from 'react-redux';
import Store from './Store/configureStore'
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';

import { LogBox } from 'react-native';



class App extends React.Component {
  render() {
    
    let persistor = persistStore(Store)
    return (
      <Provider store={Store}>
        <PersistGate persistor={persistor}>
          <Navigation/>
        </PersistGate>
      </Provider>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App
