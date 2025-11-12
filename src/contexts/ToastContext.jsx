import React, { useContext, createContext } from 'react';
import { toast } from 'react-hot-toast';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const showToast = (message, options = {}) => toast.success(message, options);
  const showError = (message, options = {}) => toast.error(message, options);
  
  const value = { showToast, showError };
  
  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);