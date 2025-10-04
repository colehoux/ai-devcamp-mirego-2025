import React, { createContext, useContext, useState, useEffect } from 'react';
import { createBasket, addItemToBasket, getBasket } from '../services/api';

const BasketContext = createContext();

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
};

export const BasketProvider = ({ children }) => {
  const [basketId, setBasketId] = useState(null);
  const [basketItems, setBasketItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Créer un nouveau panier au démarrage
  useEffect(() => {
    initializeBasket();
  }, []);

  const initializeBasket = async () => {
    try {
      setLoading(true);
      const basket = await createBasket('Mon Panier');
      setBasketId(basket.id);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du panier:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToBasket = async (product, quantity = 1) => {
    try {
      if (!basketId) {
        await initializeBasket();
      }
      setLoading(true);
      await addItemToBasket(basketId, product.id, quantity);

      // Mettre à jour la liste locale
      const existingItemIndex = basketItems.findIndex(item => item.id === product.id);
      if (existingItemIndex !== -1) {
        const updatedItems = [...basketItems];
        updatedItems[existingItemIndex].quantity += quantity;
        setBasketItems(updatedItems);
      } else {
        setBasketItems([...basketItems, { ...product, quantity }]);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromBasket = (productId) => {
    setBasketItems(basketItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    const updatedItems = basketItems.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    setBasketItems(updatedItems);
  };

  const clearBasket = async () => {
    setBasketItems([]);
    await initializeBasket();
  };

  const refreshBasket = async () => {
    if (!basketId) return;
    try {
      setLoading(true);
      const basket = await getBasket(basketId);
      setBasketItems(basket.items || []);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du panier:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    basketId,
    basketItems,
    loading,
    addToBasket,
    removeFromBasket,
    updateQuantity,
    clearBasket,
    refreshBasket,
  };

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
};
