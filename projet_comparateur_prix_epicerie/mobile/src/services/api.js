import axios from 'axios';

// Configuration de l'API backend
const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Services API
export const searchProducts = async (query) => {
  try {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche de produits:', error);
    throw error;
  }
};

export const getProductPrices = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}/prices`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des prix:', error);
    throw error;
  }
};

export const createBasket = async (name) => {
  try {
    const response = await api.post('/basket', { name });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du panier:', error);
    throw error;
  }
};

export const getBasket = async (basketId) => {
  try {
    const response = await api.get(`/basket/${basketId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du panier:', error);
    throw error;
  }
};

export const addItemToBasket = async (basketId, productId, quantity = 1) => {
  try {
    const response = await api.post(`/basket/${basketId}/items`, {
      product_id: productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un article:', error);
    throw error;
  }
};

export const compareBasket = async (basketId) => {
  try {
    const response = await api.get(`/basket/${basketId}/compare`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la comparaison des prix:', error);
    throw error;
  }
};

export default api;
