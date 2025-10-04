# Plan d'Application Mobile - Comparateur de Prix d'Épicerie (Localhost)

## Vue d'ensemble
Application mobile locale permettant de comparer les prix entre IGA, Metro, Maxi et Super C, avec création de panier et identification du magasin le moins cher.

## Todo List de Développement

### Phase 1: Setup Initial (Jour 1)
- [x] Initialiser le backend
  - [x] `npm init` pour créer projet Node.js
  - [x] Installer Express, SQLite3, Puppeteer/Cheerio
  - [x] Créer structure de dossiers
- [ ] Initialiser l'app mobile
  - [ ] `npx create-expo-app mobile`
  - [ ] Configuration pour iOS simulator
  - [ ] Installer dépendances (axios, react-navigation)
- [x] Base de données locale
  - [x] Créer schéma SQLite
  - [x] Tables: products, stores, prices, baskets
  - [x] Module de connexion et wrappers pour requêtes
  - [x] Script de test de la base de données

### Phase 2: Scraping des Prix (Jours 2-4)
- [ ] Scraper IGA
  - [ ] Script pour récupérer produits et prix
  - [ ] Normalisation des données
- [ ] Scraper Metro
  - [ ] Adaptation du scraper
  - [ ] Gestion des variantes de produits
- [ ] Scraper Maxi
  - [ ] Script de scraping
  - [ ] Correspondance avec autres magasins
- [ ] Scraper Super C
  - [ ] Dernier scraper
  - [ ] Script de mise à jour automatique
- [ ] Matching des produits
  - [ ] Algorithme pour matcher produits similaires entre magasins
  - [ ] Normalisation des noms/formats

### Phase 3: API Backend (Jours 5-6)
- [ ] Routes principales
  - [ ] `GET /api/products/search?q=lait` - Rechercher produits
  - [ ] `GET /api/products/:id/prices` - Prix par magasin
  - [ ] `POST /api/basket` - Créer panier
  - [ ] `GET /api/basket/:id` - Récupérer panier
  - [ ] `POST /api/basket/:id/items` - Ajouter au panier
  - [ ] `GET /api/basket/:id/compare` - Comparer prix totaux
- [ ] Logique de comparaison
  - [ ] Calculer total par magasin
  - [ ] Gérer produits manquants
  - [ ] Retourner classement des magasins

### Phase 4: Application Mobile (Jours 7-10)
- [ ] Écran de recherche
  - [ ] Barre de recherche
  - [ ] Liste de résultats avec prix par magasin
  - [ ] Bouton "Ajouter au panier"
- [ ] Écran du panier
  - [ ] Liste des produits ajoutés
  - [ ] Quantités ajustables
  - [ ] Bouton "Comparer les prix"
- [ ] Écran de comparaison
  - [ ] Affichage prix total par magasin
  - [ ] Classement du moins cher au plus cher
  - [ ] Détail des prix par produit par magasin
  - [ ] Indicateur des produits non disponibles
- [ ] Fonctionnalités additionnelles
  - [ ] Sauvegarder des listes d'épicerie
  - [ ] Historique des paniers
  - [ ] Recherche par code-barres (optionnel)

### Phase 5: Polish & Tests (Jours 11-12)
- [ ] Tests sur simulateur iOS
- [ ] Tests sur téléphone réel (via Expo Go)
- [ ] Optimisations performance
- [ ] Gestion des erreurs

## Architecture Proposée

### Stack Technologique
- **Frontend Mobile**: React Native (Expo) - compatible iOS simulator et téléphone
- **Backend Local**: Node.js + Express (tourne sur votre Mac)
- **Base de données**: SQLite (fichier local) ou PostgreSQL local
- **Scraping**: Puppeteer ou Cheerio pour récupérer les prix
- **Communication**: Backend sur http://localhost:3000, app mobile s'y connecte

## Structure du Projet

```
grocery-price-comparator/
├── mobile/                    # Application React Native
│   ├── src/
│   │   ├── screens/          # Écrans (Recherche, Panier, Comparaison)
│   │   ├── components/       # Composants réutilisables
│   │   ├── services/         # API calls au backend
│   │   └── store/            # State management (Context/Redux)
│   └── package.json
│
├── backend/                   # Serveur Node.js
│   ├── src/
│   │   ├── scrapers/         # Scrapers pour chaque épicerie
│   │   ├── routes/           # Routes API
│   │   ├── controllers/      # Logique métier
│   │   ├── models/           # Modèles de données
│   │   └── utils/            # Fonctions utilitaires
│   └── package.json
│
└── database/                  # Base de données
    └── grocery.db            # SQLite database
```

## Phases d'Implémentation

### Phase 1: Setup Initial (Jour 1)
1. **Initialiser le backend**
   - `npm init` pour créer projet Node.js
   - Installer Express, SQLite3, Puppeteer/Cheerio
   - Créer structure de dossiers

2. **Initialiser l'app mobile**
   - `npx create-expo-app mobile`
   - Configuration pour iOS simulator
   - Installer dépendances (axios, react-navigation)

3. **Base de données locale**
   - Créer schéma SQLite
   - Tables: products, stores, prices, baskets

### Phase 2: Scraping des Prix (Jours 2-4)
1. **Scraper IGA**
   - Script pour récupérer produits et prix
   - Normalisation des données

2. **Scraper Metro**
   - Adaptation du scraper
   - Gestion des variantes de produits

3. **Scraper Maxi**
   - Script de scraping
   - Correspondance avec autres magasins

4. **Scraper Super C**
   - Dernier scraper
   - Script de mise à jour automatique

5. **Matching des produits**
   - Algorithme pour matcher produits similaires entre magasins
   - Normalisation des noms/formats

### Phase 3: API Backend (Jours 5-6)
1. **Routes principales**
   - `GET /api/products/search?q=lait` - Rechercher produits
   - `GET /api/products/:id/prices` - Prix par magasin
   - `POST /api/basket` - Créer panier
   - `GET /api/basket/:id` - Récupérer panier
   - `POST /api/basket/:id/items` - Ajouter au panier
   - `GET /api/basket/:id/compare` - Comparer prix totaux

2. **Logique de comparaison**
   - Calculer total par magasin
   - Gérer produits manquants
   - Retourner classement des magasins

### Phase 4: Application Mobile (Jours 7-10)
1. **Écran de recherche**
   - Barre de recherche
   - Liste de résultats avec prix par magasin
   - Bouton "Ajouter au panier"

2. **Écran du panier**
   - Liste des produits ajoutés
   - Quantités ajustables
   - Bouton "Comparer les prix"

3. **Écran de comparaison**
   - Affichage prix total par magasin
   - Classement du moins cher au plus cher
   - Détail des prix par produit par magasin
   - Indicateur des produits non disponibles

4. **Fonctionnalités additionnelles**
   - Sauvegarder des listes d'épicerie
   - Historique des paniers
   - Recherche par code-barres (optionnel)

### Phase 5: Polish & Tests (Jours 11-12)
1. Tests sur simulateur iOS
2. Tests sur téléphone réel (via Expo Go)
3. Optimisations performance
4. Gestion des erreurs

## Commandes de Démarrage

### Backend
```bash
cd backend
npm install
npm run scrape    # Mettre à jour les prix
npm start         # Démarrer serveur sur localhost:3000
```

### Mobile
```bash
cd mobile
npm install
npx expo start    # Ouvre menu avec options iOS simulator
```

Pour téléphone: Scanner le QR code avec Expo Go app

## Défis Techniques

1. **Scraping légal**
   - Respecter robots.txt
   - Rate limiting
   - User-agent approprié

2. **Correspondance produits**
   - Algorithme de matching (similarité de texte)
   - Gérer formats différents (500ml vs 500mL vs 0.5L)
   - Produits de marques différentes

3. **Performance**
   - Cache des résultats de recherche
   - Mise à jour incrémentale des prix
   - Optimisation des requêtes SQLite

4. **Connection localhost**
   - Sur téléphone réel: utiliser IP locale (ex: 192.168.1.x:3000)
   - Sur simulator: localhost:3000 fonctionne

## Base de Données - Schéma

```sql
-- Magasins
CREATE TABLE stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL
);

-- Produits (normalisés)
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    brand TEXT,
    size TEXT,
    unit TEXT,
    category TEXT
);

-- Prix par magasin
CREATE TABLE prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    store_id INTEGER NOT NULL,
    price REAL NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    in_stock BOOLEAN DEFAULT 1,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (store_id) REFERENCES stores(id)
);

-- Paniers
CREATE TABLE baskets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Items dans panier
CREATE TABLE basket_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    basket_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (basket_id) REFERENCES baskets(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

## Timeline Estimée
- **Setup**: 1 jour
- **Scraping**: 3 jours
- **Backend API**: 2 jours
- **App Mobile**: 4 jours
- **Tests & Polish**: 2 jours
- **Total**: ~12 jours de développement

## Notes Importantes

### Configuration pour Téléphone Réel
1. Backend doit écouter sur toutes les interfaces: `app.listen(3000, '0.0.0.0')`
2. Dans l'app mobile, configurer l'URL de l'API avec votre IP locale
3. S'assurer que le téléphone et l'ordinateur sont sur le même réseau WiFi

### Alternatives au Scraping
Si le scraping devient trop complexe ou bloqué:
- Utiliser les APIs publiques si disponibles
- Saisie manuelle initiale de quelques produits de base pour MVP
- APIs tierces de comparaison de prix (payantes)

### Évolution Future Possible
- Support pour plus d'épiceries (Provigo, Costco, etc.)
- Calcul d'itinéraire optimal multi-magasins
- Prédiction de prix futurs basée sur historique
- Partage de listes entre utilisateurs
- Suggestions de recettes basées sur prix actuels
