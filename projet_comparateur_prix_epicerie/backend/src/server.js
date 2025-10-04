const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./models/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Grocery Price Comparator API' });
});

// Search products endpoint
app.get('/api/products/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.json([]);
    }

    const searchTerm = `%${q.trim()}%`;

    const products = await db.all(`
      SELECT
        p.id,
        p.name,
        p.brand,
        p.size,
        p.category,
        MIN(pr.price) as min_price,
        GROUP_CONCAT(
          json_object(
            'store', s.name,
            'price', pr.price,
            'url', pr.url,
            'in_stock', pr.in_stock
          )
        ) as prices
      FROM products p
      INNER JOIN prices pr ON p.id = pr.product_id
      INNER JOIN stores s ON pr.store_id = s.id
      WHERE p.name LIKE ? OR p.brand LIKE ?
      GROUP BY p.id
      ORDER BY min_price ASC
      LIMIT 50
    `, [searchTerm, searchTerm]);

    // Parse the prices JSON for each product
    const parsedProducts = products.map(product => ({
      ...product,
      prices: product.prices ? product.prices.split(',').map(p => JSON.parse(p)) : []
    }));

    res.json(parsedProducts);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Initialize database and start server
db.initDatabase()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
