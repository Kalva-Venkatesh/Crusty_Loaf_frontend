import React from 'react';
import { AuthProvider } from './AuthContext';
import { ProductProvider } from './ProductContext';
import { CartProvider } from './CartContext';
import { ToastProvider } from './ToastContext';

/**
 * A wrapper component that combines all application-level
 * context providers into one.
 */
export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}