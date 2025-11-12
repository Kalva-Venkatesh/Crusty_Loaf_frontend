import React, { useState, useContext, createContext, useEffect, useReducer } from 'react';
import { api } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const cartReducer = (state, action) => {
  let newCart = [...state];

  switch (action.type) {
    case 'SET_CART':
      return action.payload;

    case 'ADD_ITEM': {
      const existingItemIndex = state.findIndex(item => item.productId === action.payload.productId);
      if (existingItemIndex > -1) {
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + 1,
        };
      } else {
        newCart.push({ productId: action.payload.productId, quantity: 1 });
      }
      return newCart;
    }

    case 'REMOVE_ITEM':
      return state.filter(item => item.productId !== action.payload.productId);

    case 'UPDATE_QUANTITY': {
      const existingItemIndex = state.findIndex(item => item.productId === action.payload.productId);
      if (existingItemIndex > -1) {
        if (action.payload.quantity <= 0) {
          return state.filter(item => item.productId !== action.payload.productId);
        }
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: action.payload.quantity,
        };
      }
      return newCart;
    }

    case 'CLEAR_CART':
      return [];
      
    default:
      return state;
  }
};


export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [lastSyncError, setLastSyncError] = useState(null);

  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        setLoading(true);
        try {
          const dbCart = await api.getCart(); 
          const clientCart = dbCart.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
          }));
          dispatch({ type: 'SET_CART', payload: clientCart });
        } catch (err) {
          console.error("Failed to load cart:", err);
          setLastSyncError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        dispatch({ type: 'SET_CART', payload: [] });
      }
    };
    loadCart();
  }, [user]);

  useEffect(() => {
    const syncCart = async () => {
        if (user) {
          setLastSyncError(null);
          try {
            await api.updateCart(cart);
          } catch (err) {
            console.error("Failed to sync cart:", err);
            setLastSyncError(err.message);
          }
        }
    };
    
    if (!loading) {
        syncCart();
    }
  }, [cart, user, loading]); 
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  }

  const value = {
    cart,
    dispatch,
    clearCart,
    loading,
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    error: lastSyncError
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);