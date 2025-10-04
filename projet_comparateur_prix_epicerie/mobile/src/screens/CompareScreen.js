import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useBasket } from '../store/BasketContext';
import { compareBasket } from '../services/api';

export default function CompareScreen() {
  const { basketId } = useBasket();
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComparison();
  }, []);

  const loadComparison = async () => {
    if (!basketId) return;

    try {
      setLoading(true);
      const data = await compareBasket(basketId);
      setComparison(data);
    } catch (error) {
      console.error('Erreur lors de la comparaison:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStore = ({ item, index }) => (
    <View style={[
      styles.storeCard,
      index === 0 && styles.bestPriceCard
    ]}>
      <View style={styles.storeHeader}>
        <Text style={styles.storeName}>{item.store_name}</Text>
        {index === 0 && (
          <View style={styles.bestBadge}>
            <Text style={styles.bestBadgeText}>MEILLEUR PRIX</Text>
          </View>
        )}
      </View>

      <Text style={styles.totalPrice}>
        Total: {item.total_price.toFixed(2)} $
      </Text>

      {item.savings && item.savings > 0 && (
        <Text style={styles.savings}>
          Économie: {item.savings.toFixed(2)} $
        </Text>
      )}

      {item.missing_products && item.missing_products.length > 0 && (
        <View style={styles.missingContainer}>
          <Text style={styles.missingTitle}>Produits manquants:</Text>
          {item.missing_products.map((product, idx) => (
            <Text key={idx} style={styles.missingText}>
              • {product.name}
            </Text>
          ))}
        </View>
      )}

      {item.available_products && (
        <Text style={styles.availableText}>
          {item.available_products} produit(s) disponible(s)
        </Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Comparaison en cours...</Text>
      </View>
    );
  }

  if (!comparison || !comparison.stores) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          Impossible de comparer les prix
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comparaison des Prix</Text>

      {comparison.basket_summary && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>
            {comparison.basket_summary.total_items} produit(s) dans le panier
          </Text>
          {comparison.basket_summary.total_unique_products && (
            <Text style={styles.summaryText}>
              {comparison.basket_summary.total_unique_products} produit(s) unique(s)
            </Text>
          )}
        </View>
      )}

      <FlatList
        data={comparison.stores}
        renderItem={renderStore}
        keyExtractor={(item) => item.store_id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
  },
  summaryCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  storeCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bestPriceCard: {
    borderWidth: 3,
    borderColor: '#34C759',
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bestBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  bestBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  savings: {
    fontSize: 16,
    color: '#34C759',
    fontWeight: '600',
    marginBottom: 8,
  },
  missingContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FFF3CD',
    borderRadius: 4,
  },
  missingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 4,
  },
  missingText: {
    fontSize: 12,
    color: '#856404',
    marginTop: 2,
  },
  availableText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
});
