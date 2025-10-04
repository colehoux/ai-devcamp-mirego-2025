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
    console.log('Search query received:', q);

    if (!q || q.trim() === '') {
      console.log('Empty query, returning empty array');
      return res.json([]);
    }

    const searchQuery = q.trim().toLowerCase();
    const searchTerm = `%${searchQuery}%`;
    const startsWithTerm = `${searchQuery}%`;
    const startsWithSpace = `${searchQuery} %`;
    const exactWordTerm = `% ${searchQuery} %`;
    const endsWithSpace = `% ${searchQuery}`;
    console.log('Search term:', searchTerm);

    const products = await db.all(`
      SELECT
        p.id,
        p.name,
        p.brand,
        p.size,
        p.category,
        MIN(pr.price) as min_price,
        json_group_array(
          json_object(
            'store', s.name,
            'price', pr.price,
            'url', pr.url,
            'in_stock', pr.in_stock
          )
        ) as prices,
        CASE
          WHEN LOWER(p.name) = ? THEN 0
          WHEN LOWER(p.brand) = ? THEN 0
          WHEN LOWER(p.name) LIKE ? OR LOWER(p.brand) LIKE ? THEN 1
          WHEN LOWER(' ' || p.name || ' ') LIKE ? OR LOWER(' ' || p.brand || ' ') LIKE ? THEN 2
          WHEN LOWER(' ' || p.name || ' ') LIKE ? OR LOWER(' ' || p.brand || ' ') LIKE ? THEN 2
          WHEN LOWER(p.name) LIKE ? OR LOWER(p.brand) LIKE ? THEN 3
          ELSE 4
        END as priority
      FROM products p
      INNER JOIN prices pr ON p.id = pr.product_id
      INNER JOIN stores s ON pr.store_id = s.id
      WHERE LOWER(p.name) LIKE ? OR LOWER(p.brand) LIKE ?
      GROUP BY p.id
      ORDER BY priority ASC, min_price ASC
      LIMIT 50
    `, [searchQuery, searchQuery, startsWithSpace, startsWithSpace, exactWordTerm, exactWordTerm, endsWithSpace, endsWithSpace, startsWithTerm, startsWithTerm, searchTerm, searchTerm]);

    console.log('Products found:', products.length);

    // Parse the prices JSON for each product
    const parsedProducts = products.map(product => ({
      ...product,
      prices: product.prices ? JSON.parse(product.prices) : []
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
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    server.on('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
