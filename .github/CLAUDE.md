# Standards de Code Review Claude

## Vue d'ensemble du projet
Ce repo contient plusieurs projets incluant une app de comparaison de prix d'épicerie avec backend Node.js et frontend mobile React Native.

## Points de focus pour le code review

### Backend (Node.js/Express)
- **Sécurité**: Valider tous les inputs, sanitiser les données, vérifier les risques d'injection SQL
- **Gestion d'erreurs**: Blocs try-catch appropriés, messages d'erreur clairs
- **Design API**: Conventions RESTful, formats de réponse cohérents
- **Performance**: Requêtes DB efficaces, indexation appropriée
- **Qualité du code**: Noms de fonctions clairs, usage correct d'async/await
- **Dépendances**: Vérifier les packages obsolètes ou vulnérables

### Frontend (React Native/Expo)
- **Performance**: Éviter les re-renders inutiles, memoization appropriée
- **UX**: États de chargement, messages d'erreur, design responsive
- **Gestion d'état**: Usage correct des hooks, éviter le prop drilling
- **Qualité du code**: Réutilisabilité des composants, conventions de nommage claires
- **Best practices mobile**: Gérer les scénarios offline, navigation appropriée

### Web Scraping
- **Conformité légale**: Respecter robots.txt, rate limiting
- **Fiabilité**: Gestion d'erreurs réseau, validation des données
- **Performance**: Parsing efficace, éviter les requêtes redondantes
- **Maintenabilité**: Sélecteurs clairs, documenter les changements de structure

### Base de données (SQLite)
- **Design du schéma**: Relations, index et contraintes appropriés
- **Intégrité des données**: Foreign keys, règles de validation
- **Performance**: Optimisation des requêtes, types de données appropriés
- **Migrations**: Tracker les changements de schéma correctement

## Standards généraux
- **Commits Git**: Messages clairs et descriptifs
- **Documentation**: Mettre à jour README et commentaires inline au besoin
- **Tests**: Suggérer des cas de test pour fonctionnalités critiques
- **TypeScript/JSDoc**: Type safety et documentation
- **Sécurité**: Ne jamais commit de secrets, clés API ou données sensibles

## Ton du review
- Être constructif et utile
- Suggérer des améliorations avec des exemples
- Souligner autant les problèmes que les bonnes pratiques
- Prioriser les bugs critiques sur les préférences de style
