import React, { useState, useContext, createContext, useEffect, useMemo } from 'react';
import { api } from '../api';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getProducts();
        const formattedProducts = data.map(p => ({ ...p, id: p._id }));
        setProducts(formattedProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  
  const productsById = useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {});
  }, [products]);
  
  const getProductById = (id) => {
    return productsById[id];
  };

  const value = {
    products,
    productsById,
    getProductById,
    loading,
    error,
    categories: [...new Set(products.map(p => p.category))]
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export const useProducts = () => useContext(ProductContext);