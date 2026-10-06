/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test("affiche l'écran de recherche au démarrage", async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  // Exécute les minuteurs en attente (simulés, cf. jest.config.js), dont le masquage différé de l'écran de démarrage
  await ReactTestRenderer.act(async () => {
    jest.runOnlyPendingTimers();
  });

  // PersistGate n'affiche l'app qu'une fois le store réhydraté (AsyncStorage est mocké)
  expect(
    renderer.root.findByProps({ placeholder: 'Rechercher un film' }),
  ).toBeTruthy();
  expect(
    renderer.root.findByProps({ children: 'Trouve ton prochain film' }),
  ).toBeTruthy();

  // Démonter avant la fin du test, sinon le nettoyage de la navigation s'exécute après l'environnement Jest
  await ReactTestRenderer.act(async () => {
    renderer.unmount();
  });
});
