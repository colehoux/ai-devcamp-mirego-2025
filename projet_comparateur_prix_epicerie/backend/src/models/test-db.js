const db = require('./database');

async function testDatabase() {
  try {
    console.log('=== Test de la base de données ===\n');

    // Initialiser la base de données
    await db.initDatabase();
    console.log('✓ Base de données initialisée\n');

    // Vérifier les magasins
    const stores = await db.all('SELECT * FROM stores');
    console.log('Magasins dans la base de données:');
    stores.forEach(store => {
      console.log(`  - ${store.name} (ID: ${store.id})`);
    });
    console.log();

    // Tester l'insertion d'un produit
    const result = await db.run(
      'INSERT INTO products (name, brand, size, unit, category, normalized_name) VALUES (?, ?, ?, ?, ?, ?)',
      ['Lait 2%', 'Natrel', '2L', 'L', 'Produits laitiers', 'lait 2% natrel 2l']
    );
    console.log(`✓ Produit inséré avec ID: ${result.id}\n`);

    // Récupérer le produit
    const product = await db.get('SELECT * FROM products WHERE id = ?', [result.id]);
    console.log('Produit récupéré:');
    console.log(`  - Nom: ${product.name}`);
    console.log(`  - Marque: ${product.brand}`);
    console.log(`  - Taille: ${product.size}\n`);

    // Insérer des prix pour ce produit
    for (const store of stores) {
      const price = (Math.random() * 3 + 4).toFixed(2); // Prix entre 4$ et 7$
      await db.run(
        'INSERT INTO prices (product_id, store_id, price, in_stock) VALUES (?, ?, ?, ?)',
        [product.id, store.id, price, 1]
      );
      console.log(`✓ Prix ajouté pour ${store.name}: ${price}$`);
    }
    console.log();

    // Récupérer tous les prix avec les informations des magasins
    const prices = await db.all(`
      SELECT p.price, p.in_stock, s.name as store_name
      FROM prices p
      JOIN stores s ON p.store_id = s.id
      WHERE p.product_id = ?
      ORDER BY p.price ASC
    `, [product.id]);

    console.log('Prix par magasin (du moins cher au plus cher):');
    prices.forEach(p => {
      console.log(`  - ${p.store_name}: ${p.price}$ ${p.in_stock ? '(en stock)' : '(rupture)'}`);
    });
    console.log();

    // Tester la création d'un panier
    const basketResult = await db.run(
      'INSERT INTO baskets (name) VALUES (?)',
      ['Mon panier test']
    );
    console.log(`✓ Panier créé avec ID: ${basketResult.id}\n`);

    // Ajouter le produit au panier
    await db.run(
      'INSERT INTO basket_items (basket_id, product_id, quantity) VALUES (?, ?, ?)',
      [basketResult.id, product.id, 2]
    );
    console.log('✓ Produit ajouté au panier (quantité: 2)\n');

    // Récupérer le contenu du panier
    const basketItems = await db.all(`
      SELECT p.name, p.brand, bi.quantity
      FROM basket_items bi
      JOIN products p ON bi.product_id = p.id
      WHERE bi.basket_id = ?
    `, [basketResult.id]);

    console.log('Contenu du panier:');
    basketItems.forEach(item => {
      console.log(`  - ${item.name} (${item.brand}) x${item.quantity}`);
    });
    console.log();

    console.log('=== Tous les tests ont réussi! ===');

    // Fermer la connexion
    await db.closeDatabase();

  } catch (error) {
    console.error('Erreur lors des tests:', error);
    process.exit(1);
  }
}

// Exécuter les tests
testDatabase();