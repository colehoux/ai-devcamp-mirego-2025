# Application Mobile - Comparateur de Prix d'Épicerie

Application mobile React Native (Expo) pour comparer les prix entre différentes épiceries.

## Installation

```bash
npm install
```

## Démarrage

```bash
# Démarrer le serveur Expo
npx expo start

# Pour iOS simulator (Mac uniquement)
npx expo start --ios

# Pour téléphone physique
# Scanner le QR code avec l'app Expo Go
```

## Configuration

### Connection au Backend

Par défaut, l'app se connecte à `http://localhost:3000/api`.

**Pour un téléphone physique:**
1. Assurez-vous que le backend écoute sur toutes les interfaces: `0.0.0.0:3000`
2. Modifiez `src/services/api.js` pour utiliser votre IP locale:
   ```javascript
   const API_BASE_URL = 'http://192.168.1.X:3000/api';
   ```
3. Vérifiez que le téléphone et l'ordinateur sont sur le même réseau WiFi

**Pour iOS simulator:**
`localhost:3000` devrait fonctionner directement.

## Structure

```
mobile/
├── src/
│   ├── screens/          # Écrans principaux
│   │   ├── SearchScreen.js
│   │   ├── BasketScreen.js
│   │   └── CompareScreen.js
│   ├── services/         # API calls
│   │   └── api.js
│   ├── store/            # State management
│   │   └── BasketContext.js
│   └── components/       # Composants réutilisables (à venir)
├── App.js                # Point d'entrée
└── package.json
```

## Fonctionnalités

- **Recherche de produits**: Rechercher et voir les prix par magasin
- **Panier**: Ajouter des produits et gérer les quantités
- **Comparaison**: Comparer les prix totaux entre magasins

## Écrans

1. **SearchScreen**: Barre de recherche et liste de résultats
2. **BasketScreen**: Gestion du panier avec quantités
3. **CompareScreen**: Comparaison des prix avec classement

## Technologies

- React Native (Expo)
- React Navigation
- Axios pour les appels API
- Context API pour la gestion d'état
