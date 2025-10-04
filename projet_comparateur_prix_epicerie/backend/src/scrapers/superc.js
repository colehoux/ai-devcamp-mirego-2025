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
   * Get products by category
   * @param {string} category - Category slug (e.g., 'fruits-et-legumes')
   * @param {number} limit - Maximum number of results
   * @returns {Promise<Array>}
   */
  async getByCategory(category, limit = 50) {
    const browser = await this.initBrowser();
    const page = await browser.newPage();

    try {
      console.log(`[Super C] Fetching category: ${category}`);

      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      const url = `${this.baseUrl}/allees/${category}`;
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Wait for products to load
      await page.waitForSelector('.default-product-tile', { timeout: 10000 }).catch(() => {});

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

      console.log(`[Super C] Found ${products.length} products in category ${category}`);
      await page.close();
      return products;

    } catch (error) {
      console.error(`[Super C] Error fetching category "${category}":`, error.message);
      await page.close();
      return [];
    }
  }
}

module.exports = SuperCScraper;
