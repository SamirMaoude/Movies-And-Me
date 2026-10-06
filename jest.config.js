module.exports = {
  preset: 'react-native',
  // Minuteurs simulés dès le chargement des modules : persistStore (App.tsx) crée un délai de garde de 5 s
  // qui, en vrai minuteur, empêcherait Jest de se terminer
  fakeTimers: { enableGlobally: true },
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
    './jest.setup.js',
  ],
  // Ces dépendances sont publiées en modules ES : Babel doit les transformer
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|react-redux|redux)',
  ],
  // Lucide pointe React Native vers un .mjs que Jest ne transforme pas : on prend sa version CommonJS
  moduleNameMapper: {
    '^lucide-react-native$':
      '<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js',
  },
};
