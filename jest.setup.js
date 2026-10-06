/* eslint-env jest */
// Mocks des modules natifs, absents de l'environnement Jest (Node)

jest.mock('react-native-bootsplash', () => ({
  hide: jest.fn().mockResolvedValue(),
  isVisible: jest.fn().mockResolvedValue(false),
  useHideAnimation: jest.fn().mockReturnValue({
    container: {},
    logo: { source: 0 },
    brand: { source: 0 },
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mocks fournis par Reanimated 4 et Worklets (animations exécutées immédiatement)
jest.mock('react-native-worklets', () =>
  require('react-native-worklets/lib/module/mock'),
);
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/lib/module/mock'),
);
