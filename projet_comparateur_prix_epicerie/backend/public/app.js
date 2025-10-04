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
                    ${sortedPrices.map(priceInfo => createStoreItem(priceInfo)).join('')}
                </div>
            </div>
        </div>
    `;
}

// Create Store Item HTML
function createStoreItem(priceInfo) {
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
            <div>
                <span class="store-price">${formatPrice(priceInfo.price)}</span>
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

// Focus on search input on load
searchInput.focus();