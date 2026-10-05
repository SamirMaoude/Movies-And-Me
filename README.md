# Movies & Me

Application mobile React Native pour rechercher des films, consulter leur fiche et garder ses favoris, à partir des données de [TMDB](https://www.themoviedb.org/).

<p align="center">
  <img src="docs/screenshots/recherche.jpg" width="200" alt="Recherche de films" />
  <img src="docs/screenshots/fiche.jpg" width="200" alt="Fiche d'un film" />
  <img src="docs/screenshots/favoris.jpg" width="200" alt="Films favoris" />
  <img src="docs/screenshots/nouveautes.jpg" width="200" alt="Nouveautés" />
</p>

## Fonctionnalités

- **Recherche** de films par titre, avec chargement des résultats au fil du défilement
- **Fiche détaillée** : image, résumé, date de sortie, note, nombre de votes, budget, genres et sociétés de production
- **Favoris** ajoutés depuis la fiche et conservés d'un lancement à l'autre
- **Nouveautés** : les sorties les plus récentes parmi les films ayant reçu au moins 1 000 votes
- **Partage** d'un film vers une autre application
- **Avatar** personnalisable à partir d'une photo de la galerie
- **Cas limites gérés** : absence de connexion (message et bouton Réessayer), recherche sans résultat, affiche ou résumé manquant

## Stack technique

| Domaine | Choix |
|---|---|
| Framework | React Native 0.83 (New Architecture, Hermes) |
| Navigation | React Navigation 7 : onglets et piles d'écrans |
| État | Redux, persisté avec redux-persist et AsyncStorage |
| Données | API REST de TMDB |
| Tests | Jest et react-test-renderer |
| Autres | react-native-bootsplash (écran de démarrage), react-native-image-picker, moment |

## Lancer le projet

Prérequis : Node.js 20 ou plus, JDK 17 et le SDK Android avec un émulateur ou un téléphone branché (voir [la configuration de l'environnement React Native](https://reactnative.dev/docs/set-up-your-environment)).

```sh
npm install
npm start          # serveur de développement Metro
npm run android    # dans un second terminal : compile, installe et lance l'app
```

L'application a été testée sur Android (émulateur Android 15). La version iOS n'a pas été testée.

## Tests

```sh
npm test
```

Les tests couvrent le démarrage de l'application, la mise en forme des données (dates, notes, budgets) et le reducer des favoris.

## Structure du projet

```
API/          appels à l'API TMDB
Animations/   animations de la liste et du bouton favori
components/   écrans et composants : recherche, fiche, favoris, nouveautés…
Helpers/      mise en forme des données
Navigation/   onglets et piles d'écrans
Store/        store Redux et reducers
__tests__/    tests Jest
```

## Outillage

Le dossier `.claude/skills/run-moviesandme` contient un skill [Claude Code](https://claude.com/claude-code) qui lance l'application sur l'émulateur Android et la pilote (recherche, navigation, captures d'écran) pour vérifier chaque modification dans l'app réelle.

## Crédits

Données et images fournies par [TMDB](https://www.themoviedb.org/). Ce produit utilise l'API TMDB mais n'est ni approuvé ni certifié par TMDB.

Réalisé par [@SamirMaoude](https://github.com/SamirMaoude).
