const MetroScraper = require('./metro');
const { initDatabase, run, get, closeDatabase } = require('../models/database');

/**
 * Normalize product name for matching
 */
function normalizeProductName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .trim();
}

/**
 * Find or create a store in the database
 */
async function findOrCreateStore(storeName, storeUrl) {
  try {
    const existing = await get('SELECT id FROM stores WHERE name = ?', [storeName]);
    if (existing) {
      return existing.id;
    }

    const result = await run('INSERT INTO stores (name, url) VALUES (?, ?)', [storeName, storeUrl]);
    return result.id;
  } catch (error) {
    console.error(`Error finding/creating store ${storeName}:`, error);
    throw error;
  }
}

/**
 * Find or create a product in the database
 */
async function findOrCreateProduct(productData) {
  const normalizedName = normalizeProductName(productData.name);

  try {
    // Try to find existing product with same normalized name and brand
    const existing = await get(
      'SELECT id FROM products WHERE normalized_name = ? AND (brand = ? OR (brand IS NULL AND ? IS NULL))',
      [normalizedName, productData.brand || null, productData.brand || null]
    );

    if (existing) {
      return existing.id;
    }

    // Create new product
    const result = await run(
      `INSERT INTO products (name, brand, size, image_url, normalized_name, category)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        productData.name,
        productData.brand || null,
        productData.size || null,
        productData.image || null,
        normalizedName,
        productData.category || null
      ]
    );

    return result.id;
  } catch (error) {
    console.error(`Error finding/creating product ${productData.name}:`, error);
    throw error;
  }
}

/**
 * Save or update product price in the database
 */
async function savePrice(productId, storeId, priceData) {
  try {
    // Check if price already exists
    const existing = await get(
      'SELECT id FROM prices WHERE product_id = ? AND store_id = ?',
      [productId, storeId]
    );

    if (existing) {
      // Update existing price
      await run(
        `UPDATE prices
         SET price = ?, in_stock = ?, url = ?, last_updated = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [priceData.price, priceData.inStock ? 1 : 0, priceData.url || null, existing.id]
      );
    } else {
      // Insert new price
      await run(
        `INSERT INTO prices (product_id, store_id, price, in_stock, url, last_updated)
         VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [productId, storeId, priceData.price, priceData.inStock ? 1 : 0, priceData.url || null]
      );
    }
  } catch (error) {
    console.error(`Error saving price for product ${productId}:`, error);
    throw error;
  }
}

/**
 * Scrape specific Metro categories
 */
async function scrapeMetroCategories() {
  console.log('\n=== Starting Metro Scraping ===\n');

  const scraper = new MetroScraper();
  let totalProducts = 0;
  let totalPrices = 0;

  // Categories to scrape - only remaining categories
  const targetCategories = [
    { name: 'Plats Cuisinés', slug: 'plats-cuisines' },
    { name: 'Format Économique', slug: 'format-economique' },
    { name: 'Boissons', slug: 'boissons' },
  ];

  try {
    // Initialize database
    await initDatabase();

    // Get or create Metro store
    const storeId = await findOrCreateStore('Metro', 'https://www.metro.ca');

    console.log(`Will scrape ${targetCategories.length} categories:\n`);
    targetCategories.forEach(cat => console.log(`  - ${cat.name}`));
    console.log();

    for (let i = 0; i < targetCategories.length; i++) {
      const category = targetCategories[i];
      console.log(`\n[${i + 1}/${targetCategories.length}] Scraping category: ${category.name}`);

      const products = await scraper.getAllFromCategory(category.slug);
      console.log(`Retrieved ${products.length} products from ${category.name}`);

      let savedCount = 0;
      for (const product of products) {
        try {
          // Create or find product
          const productId = await findOrCreateProduct({
            name: product.name,
            brand: product.brand,
            size: product.size,
            image: product.image,
            category: category.name,
          });

          // Save price
          await savePrice(productId, storeId, {
            price: product.price,
            inStock: product.inStock,
            url: product.url,
          });

          savedCount++;
          totalPrices++;
        } catch (error) {
          console.error(`Failed to save product "${product.name}":`, error.message);
        }
      }

      console.log(`Saved ${savedCount} products from ${category.name}`);
      totalProducts += products.length;

      // Longer delay between categories to avoid Cloudflare blocks
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    console.log(`\n=== Scraping Complete ===`);
    console.log(`Total categories scraped: ${targetCategories.length}`);
    console.log(`Total products found: ${totalProducts}`);
    console.log(`Total prices saved: ${totalPrices}`);

  } catch (error) {
    console.error('Error during scraping:', error);
    throw error;
  } finally {
    // Close browser and database
    await scraper.closeBrowser();
    await closeDatabase();
  }
}

/**
 * Main function
 */
async function main() {
  await scrapeMetroCategories();
  process.exit(0);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  scrapeMetroCategories,
};
