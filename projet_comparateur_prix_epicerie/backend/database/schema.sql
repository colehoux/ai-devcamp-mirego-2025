-- Schéma de base de données pour le comparateur de prix d'épicerie

-- Magasins
CREATE TABLE IF NOT EXISTS stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Produits normalisés
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    brand TEXT,
    size TEXT,
    unit TEXT,
    category TEXT,
    normalized_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les recherches de produits
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_normalized_name ON products(normalized_name);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Prix par magasin
CREATE TABLE IF NOT EXISTS prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    store_id INTEGER NOT NULL,
    price REAL NOT NULL,
    original_price REAL,
    on_sale BOOLEAN DEFAULT 0,
    in_stock BOOLEAN DEFAULT 1,
    url TEXT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

-- Index pour optimiser les requêtes de prix
CREATE INDEX IF NOT EXISTS idx_prices_product ON prices(product_id);
CREATE INDEX IF NOT EXISTS idx_prices_store ON prices(store_id);
CREATE INDEX IF NOT EXISTS idx_prices_updated ON prices(last_updated);

-- Paniers
CREATE TABLE IF NOT EXISTS baskets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Items dans le panier
CREATE TABLE IF NOT EXISTS basket_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    basket_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (basket_id) REFERENCES baskets(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(basket_id, product_id)
);

-- Index pour optimiser les requêtes de panier
CREATE INDEX IF NOT EXISTS idx_basket_items_basket ON basket_items(basket_id);
CREATE INDEX IF NOT EXISTS idx_basket_items_product ON basket_items(product_id);

-- Insertion des magasins initiaux
INSERT OR IGNORE INTO stores (name, url) VALUES
    ('IGA', 'https://www.iga.net'),
    ('Metro', 'https://www.metro.ca'),
    ('Maxi', 'https://www.maxi.ca'),
    ('Super C', 'https://www.superc.ca');