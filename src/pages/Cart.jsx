import React, { useMemo, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';

const CartPage = ({ setPage }) => {
  const { cart, dispatch, loading, error: cartError } = useCart();
  const { productsById, loading: productsLoading } = useProducts();
  const { isAuthenticated } = useAuth();
  const { showError } = useToast();

  useEffect(() => {
    if (cartError) {
      showError(`Cart sync error: ${cartError}`);
    }
  }, [cartError, showError]);
  
  const cartWithDetails = useMemo(() => {
    return cart.map(item => {
      const product = productsById[item.productId];
      return {
        ...item,
        product: product,
        subtotal: product ? product.price * item.quantity : 0,
      };
    }).filter(item => item.product); 
  }, [cart, productsById]);
  
  const totalPrice = useMemo(() => {
    return cartWithDetails.reduce((sum, item) => sum + item.subtotal, 0);
  }, [cartWithDetails]);
  
  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };
  
  const removeItem = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };
  
  if (!isAuthenticated) {
     return (
       <div className="container mx-auto px-4 py-8 text-center">
         <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
         <h2 className="text-2xl font-semibold mb-2">Your cart is waiting</h2>
         <p className="text-gray-600 mb-4">Please log in to view or modify your cart.</p>
         <Button onClick={() => setPage('login')}>Login</Button>
       </div>
     );
  }
  
  if (loading || productsLoading) {
    return <div className="p-8"><Spinner /></div>;
  }
  
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-4">Looks like you haven't added anything yet. Let's fix that!</p>
        <Button onClick={() => setPage('home')}>Start Shopping</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8 mt-4">
        <div className="lg:w-2/3">
          <div className="space-y-4">
            {cartWithDetails.map(item => (
              <Card key={item.productId} className="flex flex-col sm:flex-row items-center p-4 gap-4">
                <img 
                  src={item.product.imageUrl.replace('600x400', '400x400')}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">${item.product.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button onClick={() => updateQuantity(item.productId, item.quantity - 1)} variant="secondary" className="!p-2">
                    <Minus size={16} />
                  </Button>
                  <span className="w-10 text-center font-semibold">{item.quantity}</span>
                  <Button onClick={() => updateQuantity(item.productId, item.quantity + 1)} variant="secondary" className="!p-2">
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="text-lg font-bold w-20 text-right">
                  ${item.subtotal.toFixed(2)}
                </div>
                <Button onClick={() => removeItem(item.productId)} variant="ghost" className="text-red-500 !p-2">
                  <Trash2 size={20} />
                </Button>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <Card className="p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="font-semibold">Free</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t mt-2">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <Button onClick={() => setPage('checkout')} className="w-full text-lg !py-3">
              Proceed to Checkout
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;