const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Chemin vers la base de données
const DB_PATH = path.join(__dirname, '../../database/grocery.db');
const SCHEMA_PATH = path.join(__dirname, '../../database/schema.sql');

// Création de la connexion à la base de données
let db = null;

/**
 * Initialise la base de données et crée les tables si nécessaire
 */
function initDatabase() {
  return new Promise((resolve, reject) => {
    // Créer la connexion
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Erreur lors de l\'ouverture de la base de données:', err);
        reject(err);
        return;
      }

      console.log('Connexion à la base de données SQLite établie.');

      // Activer les clés étrangères
      db.run('PRAGMA foreign_keys = ON', (err) => {
        if (err) {
          console.error('Erreur lors de l\'activation des clés étrangères:', err);
          reject(err);
          return;
        }

        // Lire et exécuter le schéma
        fs.readFile(SCHEMA_PATH, 'utf8', (err, sql) => {
          if (err) {
            console.error('Erreur lors de la lecture du schéma:', err);
            reject(err);
            return;
          }

          // Exécuter le schéma SQL
          db.exec(sql, (err) => {
            if (err) {
              console.error('Erreur lors de l\'exécution du schéma:', err);
              reject(err);
              return;
            }

            console.log('Base de données initialisée avec succès.');
            resolve(db);
          });
        });
      });
    });
  });
}

/**
 * Obtenir l'instance de la base de données
 */
function getDatabase() {
  if (!db) {
    throw new Error('La base de données n\'est pas initialisée. Appelez initDatabase() d\'abord.');
  }
  return db;
}

/**
 * Fermer la connexion à la base de données
 */
function closeDatabase() {
  return new Promise((resolve, reject) => {
    if (!db) {
      resolve();
      return;
    }

    db.close((err) => {
      if (err) {
        console.error('Erreur lors de la fermeture de la base de données:', err);
        reject(err);
        return;
      }

      console.log('Connexion à la base de données fermée.');
      db = null;
      resolve();
    });
  });
}

/**
 * Wrapper pour exécuter une requête avec des promesses
 */
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    getDatabase().run(sql, params, function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

/**
 * Wrapper pour récupérer une seule ligne
 */
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    getDatabase().get(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
}

/**
 * Wrapper pour récupérer plusieurs lignes
 */
function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    getDatabase().all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

module.exports = {
  initDatabase,
  getDatabase,
  closeDatabase,
  run,
  get,
  all
};