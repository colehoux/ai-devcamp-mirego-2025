const puppeteer = require('puppeteer');

class SuperCScraper {
  constructor() {
    this.baseUrl = 'https://www.superc.ca';
    this.searchUrl = `${this.baseUrl}/recherche`;
    this.browser = null;
  }

  async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
    return this.browser;
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Search for products by keyword
   * @param {string} query - Search query
   * @param {number} limit - Maximum number of results (default: 20)
   * @returns {Promise<Array>} Array of products
   */
  async search(query, limit = 20) {
    const browser = await this.initBrowser();
    const page = await browser.newPage();

    try {
      console.log(`[Super C] Searching for: ${query}`);

      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      const url = `${this.searchUrl}?q=${encodeURIComponent(query)}`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

      // Wait for products to load - give extra time for JavaScript rendering
      await page.waitForSelector('.default-product-tile', { timeout: 10000 });

      // Wait an additional 2 seconds for all products to render
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Extract products from the page
      const products = await page.evaluate((baseUrl, limitVal) => {
        const items = [];
        const productElements = document.querySelectorAll('.default-product-tile');

        productElements.forEach((elem) => {
          if (items.length >= limitVal) return;

          try {
            // Get name from data attribute or .head__title
            const name = elem.getAttribute('data-product-name') ||
                        elem.querySelector('.head__title')?.textContent.trim() || '';

            // Get price from .price-update or pricing__sale-price
            const priceElem = elem.querySelector('.price-update, .pricing__sale-price');
            const priceText = priceElem ? priceElem.textContent.trim() : '';

            // Get brand from .head__brand
            const brandElem = elem.querySelector('.head__brand');
            const brand = brandElem ? brandElem.textContent.trim() : '';

            // Get image
            const imageElem = elem.querySelector('img');
            const image = imageElem ? (imageElem.src || imageElem.getAttribute('data-src')) : '';

            // Get size/format
            const sizeElem = elem.querySelector('.head__format, .format');
            const size = sizeElem ? sizeElem.textContent.trim() : '';

            // Get product code
            const productCode = elem.getAttribute('data-product-code');

            // Get product URL
            const linkElem = elem.querySelector('.product-details-link');
            const productUrl = linkElem ? linkElem.getAttribute('href') : '';

            if (!name || !priceText) return;

            // Parse price - extract first number
            const priceMatch = priceText.match(/[\d,]+/);
            if (!priceMatch) return;

            const price = parseFloat(priceMatch[0].replace(',', '.'));
            if (isNaN(price)) return;

            items.push({
              name: name,
              brand: brand || 'Unknown',
              price: price,
              size: size,
              store: 'Super C',
              productCode: productCode,
              url: productUrl ? (productUrl.startsWith('http') ? productUrl : `${baseUrl}${productUrl}`) : '',
              image: image && image.startsWith('http') ? image : (image ? `${baseUrl}${image}` : ''),
              inStock: true,
              scrapedAt: new Date().toISOString(),
            });
          } catch (e) {
            // Skip this product
          }
        });

        return items;
      }, this.baseUrl, limit);

      console.log(`[Super C] Found ${products.length} products`);
      await page.close();
      return products;

    } catch (error) {
      console.error(`[Super C] Error searching for "${query}":`, error.message);
      await page.close();
      return [];
    }
  }

  /**
   * Get all categories from /allees page
   * @returns {Promise<Array>} Array of category objects {name, url}
   */
  async getAllCategories() {
    const browser = await this.initBrowser();
    const page = await browser.newPage();

    try {
      console.log('[Super C] Fetching all categories...');

      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      await page.goto(`${this.baseUrl}/allees`, { waitUntil: 'networkidle2', timeout: 30000 });

      // Wait for categories to load
      await page.waitForSelector('.rectangle-aisles--container', { timeout: 10000 });

      // Extract category links
      const categories = await page.evaluate(() => {
        const items = [];
        const links = document.querySelectorAll('.rectangle-aisles--container ul li a');

        links.forEach((link) => {
          const href = link.getAttribute('href');
          const name = link.textContent.trim();

          if (href && href.startsWith('/allees/') && !href.includes('livraison-illimitee')) {
            items.push({
              name: name,
              slug: href.replace('/allees/', ''),
              url: href,
            });
          }
        });

        return items;
      });

      console.log(`[Super C] Found ${categories.length} categories`);
      await page.close();
      return categories;

    } catch (error) {
      console.error('[Super C] Error fetching categories:', error.message);
      await page.close();
      return [];
    }
  }

  /**
   * Get products by category with pagination support
   * @param {string} category - Category slug (e.g., 'fruits-et-legumes')
   * @param {number} pageNumber - Page number (default: 1)
   * @returns {Promise<Object>} Object with products array and hasNextPage boolean
   */
  async getByCategoryPage(category, pageNumber = 1) {
    const browser = await this.initBrowser();
    const page = await browser.newPage();

    try {
      console.log(`[Super C] Fetching category: ${category}, page: ${pageNumber}`);

      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      // Build URL with pagination
      const url = pageNumber === 1
        ? `${this.baseUrl}/allees/${category}`
        : `${this.baseUrl}/allees/${category}-page-${pageNumber}`;

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Wait for products to load
      await page.waitForSelector('.default-product-tile', { timeout: 10000 }).catch(() => {});
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Extract products and check for next page
      const result = await page.evaluate((baseUrl) => {
        const items = [];
        const productElements = document.querySelectorAll('.default-product-tile');

        productElements.forEach((elem) => {
          try {
            // Get name from data attribute or .head__title
            const name = elem.getAttribute('data-product-name') ||
                        elem.querySelector('.head__title')?.textContent.trim() || '';

            // Get price from .price-update or pricing__sale-price
            const priceElem = elem.querySelector('.price-update, .pricing__sale-price');
            const priceText = priceElem ? priceElem.textContent.trim() : '';

            // Get brand from .head__brand
            const brandElem = elem.querySelector('.head__brand');
            const brand = brandElem ? brandElem.textContent.trim() : '';

            // Get image
            const imageElem = elem.querySelector('img');
            const image = imageElem ? (imageElem.src || imageElem.getAttribute('data-src')) : '';

            // Get size/format
            const sizeElem = elem.querySelector('.head__format, .format');
            const size = sizeElem ? sizeElem.textContent.trim() : '';

            // Get product code
            const productCode = elem.getAttribute('data-product-code');

            // Get product URL
            const linkElem = elem.querySelector('.product-details-link');
            const productUrl = linkElem ? linkElem.getAttribute('href') : '';

            if (!name || !priceText) return;

            // Parse price - extract first number
            const priceMatch = priceText.match(/[\d,]+/);
            if (!priceMatch) return;

            const price = parseFloat(priceMatch[0].replace(',', '.'));
            if (isNaN(price)) return;

            items.push({
              name: name,
              brand: brand || 'Unknown',
              price: price,
              size: size,
              store: 'Super C',
              productCode: productCode,
              url: productUrl ? (productUrl.startsWith('http') ? productUrl : `${baseUrl}${productUrl}`) : '',
              image: image && image.startsWith('http') ? image : (image ? `${baseUrl}${image}` : ''),
              inStock: true,
              scrapedAt: new Date().toISOString(),
            });
          } catch (e) {
            // Skip this product
          }
        });

        // Check if there's a next page link
        const nextPageLink = document.querySelector('.ppn--pagination a.ppn--element:not(.disabled):last-child');
        const hasNextPage = !!nextPageLink && !nextPageLink.classList.contains('disabled');

        return { products: items, hasNextPage };
      }, this.baseUrl);

      console.log(`[Super C] Found ${result.products.length} products in category ${category} page ${pageNumber}`);
      await page.close();
      return result;

    } catch (error) {
      console.error(`[Super C] Error fetching category "${category}":`, error.message);
      await page.close();
      return { products: [], hasNextPage: false };
    }
  }

  /**
   * Get all products from a category (all pages)
   * @param {string} category - Category slug
   * @returns {Promise<Array>} Array of all products
   */
  async getAllFromCategory(category) {
    const allProducts = [];
    let currentPage = 1;
    let hasNextPage = true;

    try {
      while (hasNextPage) {
        const result = await this.getByCategoryPage(category, currentPage);
        allProducts.push(...result.products);
        hasNextPage = result.hasNextPage;
        currentPage++;

        // Safety limit
        if (currentPage > 50) {
          console.warn(`[Super C] Reached page limit for category ${category}`);
          break;
        }

        // Small delay between pages
        if (hasNextPage) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      console.log(`[Super C] Total products from ${category}: ${allProducts.length}`);
      return allProducts;

    } catch (error) {
      console.error(`[Super C] Error fetching all from category "${category}":`, error.message);
      return allProducts;
    }
  }
}

module.exports = SuperCScraper;
