// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsSection = document.getElementById('resultsSection');
const resultsContainer = document.getElementById('resultsContainer');
const paginationContainer = document.getElementById('paginationContainer');
const resultsCount = document.getElementById('resultsCount');
const emptyState = document.getElementById('emptyState');
const loadingState = document.getElementById('loadingState');
const noResults = document.getElementById('noResults');

// API Configuration
const API_URL = window.location.origin;

// State
let currentQuery = '';
let allProducts = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 10;
let cart = [];

// Cart Management
function loadCart() {
    const saved = localStorage.getItem('groceryCart');
    cart = saved ? JSON.parse(saved) : [];
    updateCartBadge();
}

function saveCart() {
    localStorage.setItem('groceryCart', JSON.stringify(cart));
    updateCartBadge();
}

function addToCart(product, store, price) {
    const item = {
        id: `${product.id}_${store}`,
        productId: product.id,
        name: product.name,
        brand: product.brand,
        size: product.size,
        store: store,
        price: price,
        quantity: 1
    };

    const existingIndex = cart.findIndex(i => i.id === item.id);
    if (existingIndex >= 0) {
        cart[existingIndex].quantity++;
    } else {
        cart.push(item);
    }

    saveCart();
    showCartNotification(`${product.name} ajouté au panier`);
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    renderCart();
}

function updateQuantity(itemId, quantity) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(itemId);
        } else {
            item.quantity = quantity;
            saveCart();
            renderCart();
        }
    }
}

function clearCart() {
    cart = [];
    saveCart();
    renderCart();
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
}

function toggleCart() {
    const cartPanel = document.getElementById('cartPanel');
    cartPanel.classList.toggle('open');
    if (cartPanel.classList.contains('open')) {
        renderCart();
    }
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const emptyCart = document.getElementById('emptyCart');

    if (cart.length === 0) {
        cartItems.innerHTML = '';
        emptyCart.style.display = 'block';
        cartTotal.textContent = formatPrice(0);
        return;
    }

    emptyCart.style.display = 'none';
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${escapeHtml(item.name)}</div>
                <div class="cart-item-details">
                    ${item.brand ? escapeHtml(item.brand) + ' • ' : ''}${escapeHtml(item.store)}
                    ${item.size ? ' • ' + escapeHtml(item.size) : ''}
                </div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
            </div>
            <div class="cart-item-actions">
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">🗑️</button>
            </div>
        </div>
    `).join('');

    cartTotal.textContent = formatPrice(getCartTotal());
}

function showCartNotification(message) {
    const notification = document.getElementById('cartNotification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Make cart functions globally accessible
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.toggleCart = toggleCart;
window.clearCart = clearCart;

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Search Handler
async function handleSearch() {
    const query = searchInput.value.trim();

    if (!query) {
        return;
    }

    currentQuery = query;
    currentPage = 1;

    // Show loading state
    showLoading();

    try {
        const response = await fetch(`${API_URL}/api/products/search?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error('Search failed');
        }

        const products = await response.json();
        allProducts = products;

        displayResults();
    } catch (error) {
        console.error('Search error:', error);
        showError();
    }
}

// Display Results
function displayResults() {
    hideAllStates();

    if (allProducts.length === 0) {
        noResults.classList.remove('hidden');
        return;
    }

    resultsSection.classList.remove('hidden');

    const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const productsToShow = allProducts.slice(startIndex, endIndex);

    resultsCount.textContent = `${allProducts.length} produit${allProducts.length > 1 ? 's' : ''} trouvé${allProducts.length > 1 ? 's' : ''} - Page ${currentPage}/${totalPages}`;

    resultsContainer.innerHTML = productsToShow.map(product => createProductCard(product)).join('');

    // Add pagination in separate container
    if (totalPages > 1) {
        paginationContainer.innerHTML = createPagination(totalPages);
    } else {
        paginationContainer.innerHTML = '';
    }
}

// Create Pagination HTML
function createPagination(totalPages) {
    let paginationHTML = '<div class="pagination">';

    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage - 1})">← Précédent</button>`;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="pagination-btn active">${i}</button>`;
        } else if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `<button class="pagination-btn" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
    }

    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage + 1})">Suivant →</button>`;
    }

    paginationHTML += '</div>';
    return paginationHTML;
}

// Change Page
function changePage(page) {
    currentPage = page;
    displayResults();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Make changePage available globally
window.changePage = changePage;

// Create Product Card HTML
function createProductCard(product) {
    const sortedPrices = product.prices.sort((a, b) => a.price - b.price);
    const bestPrice = sortedPrices[0];

    return `
        <div class="product-card">
            <div class="product-header">
                <h3 class="product-name">${escapeHtml(product.name)}</h3>
                <div class="product-info">
                    ${product.brand ? `<span>🏷️ ${escapeHtml(product.brand)}</span>` : ''}
                    ${product.size ? `<span>📦 ${escapeHtml(product.size)}</span>` : ''}
                    ${product.category ? `<span>📂 ${escapeHtml(product.category)}</span>` : ''}
                </div>
                <div class="best-price">
                    💰 ${formatPrice(bestPrice.price)}
                    <span style="font-size: 0.875rem; font-weight: 400;"> chez ${escapeHtml(bestPrice.store)}</span>
                </div>
            </div>

            <div class="store-prices">
                <div class="store-prices-title">Prix dans tous les magasins:</div>
                <div class="store-list">
                    ${sortedPrices.map(priceInfo => createStoreItem(priceInfo, product)).join('')}
                </div>
            </div>
        </div>
    `;
}

// Create Store Item HTML
function createStoreItem(priceInfo, product) {
    const isInStock = priceInfo.in_stock;
    const stockClass = isInStock ? '' : 'out-of-stock';

    return `
        <div class="store-item ${stockClass}">
            <div>
                <span class="store-name">${escapeHtml(priceInfo.store)}</span>
                ${isInStock
                    ? '<span class="stock-badge in-stock">En stock</span>'
                    : '<span class="stock-badge out-of-stock-badge">Rupture</span>'
                }
            </div>
            <div class="store-item-actions">
                <span class="store-price">${formatPrice(priceInfo.price)}</span>
                ${isInStock ? `<button class="add-to-cart-btn" onclick='addToCart(${JSON.stringify(product)}, "${escapeHtml(priceInfo.store)}", ${priceInfo.price})'>🛒 Ajouter</button>` : ''}
                ${priceInfo.url ? `<a href="${escapeHtml(priceInfo.url)}" target="_blank" rel="noopener noreferrer" class="store-link">Voir →</a>` : ''}
            </div>
        </div>
    `;
}

// Utility Functions
function formatPrice(price) {
    return new Intl.NumberFormat('fr-CA', {
        style: 'currency',
        currency: 'CAD'
    }).format(price);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showLoading() {
    hideAllStates();
    loadingState.classList.remove('hidden');
}

function showError() {
    hideAllStates();
    noResults.classList.remove('hidden');
}

function hideAllStates() {
    emptyState.classList.add('hidden');
    loadingState.classList.add('hidden');
    noResults.classList.add('hidden');
    resultsSection.classList.add('hidden');
}

// Initialize on load
loadCart();
searchInput.focus();