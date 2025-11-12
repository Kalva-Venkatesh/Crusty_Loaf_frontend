import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import AddressModal from '../components/profile/AddressModal';

const CheckoutPage = ({ setPage }) => {
  const { user, updateAddresses } = useAuth();
  const { cart, clearCart } = useCart();
  const { productsById } = useProducts();
  const { showError, showToast } = useToast();
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  
  const getAddrId = (addr) => addr._id;

  useEffect(() => {
    const defaultAddr = user?.addresses.find(a => a.default);
    if (defaultAddr) {
      setSelectedAddressId(getAddrId(defaultAddr));
    } else if (user?.addresses.length > 0) {
      setSelectedAddressId(getAddrId(user.addresses[0]));
    }
  }, [user]);
  
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
  
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      showError('Please select a delivery address.');
      return;
    }
    
    setIsPlacingOrder(true);
    
    try {
      const selectedAddress = user.addresses.find(a => getAddrId(a) === selectedAddressId);
      const { street, city, state, zip } = selectedAddress;

      const newOrder = await api.placeOrder(cart, { street, city, state, zip }, deliveryNotes);
      clearCart();
      setPage('orderConfirmation', { orderId: newOrder._id });
    } catch (err) {
      showError(err.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };
  
  const handleSaveAddresses = async (newAddresses) => {
    try {
      await updateAddresses(newAddresses);
      showToast("Addresses updated!");
      setIsAddressModalOpen(false);
    } catch (err) {
      showError(err.message);
    }
  };
  
  if (cart.length === 0 && !isPlacingOrder) {
    return (
       <div className="container mx-auto px-4 py-8 text-center">
         <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
         <p className="text-gray-600 mb-4">Add some items to your cart before you can check out.</p>
         <Button onClick={() => setPage('home')}>Start Shopping</Button>
       </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        
        <div className="lg:w-2/3 space-y-6">
          <Card className="p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Delivery Address</h2>
              <Button onClick={() => setIsAddressModalOpen(true)} variant="secondary">
                Manage Addresses
              </Button>
            </div>
            {user.addresses.length === 0 ? (
              <p className="text-red-600">Please add a delivery address to proceed.</p>
            ) : (
              <div className="space-y-3">
                {user.addresses.map(addr => (
                  <label
                    key={getAddrId(addr)}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${selectedAddressId === getAddrId(addr) ? 'border-amber-800 ring-2 ring-amber-800 bg-amber-50' : 'border-gray-300'}`}
                  >
                    <input
                      type="radio"
                      name="address"
                      className="form-radio h-5 w-5 text-amber-800"
                      checked={selectedAddressId === getAddrId(addr)}
                      onChange={() => setSelectedAddressId(getAddrId(addr))}
                    />
                    <div className="ml-4">
                      <p className="font-semibold">{addr.street}</p>
                      <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.zip}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </Card>
          
          <Card className="p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Delivery Notes</h2>
            <textarea
              id="deliveryNotes"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-transparent"
              placeholder="e.g. Leave at front door, call upon arrival..."
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
            ></textarea>
          </Card>
        </div>
        
        <div className="lg:w-1/3">
          <Card className="p-6 shadow-lg sticky top-24">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Order Summary</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto mb-4 pr-2">
              {cartWithDetails.map(item => (
                <div key={item.productId} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 mb-4 pt-4 border-t">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center bg-green-100 p-2 rounded-lg">
                <span className="text-green-700 font-semibold">Payment Method</span>
                <span className="text-green-800 font-bold">Cash on Delivery</span>
              </div>
            </div>
            
            <Button 
              onClick={handlePlaceOrder}
              className="w-full text-lg !py-3 mt-4"
              disabled={isPlacingOrder || !selectedAddressId}
            >
              {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
            </Button>
          </Card>
        </div>
      </div>
      
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        userAddresses={user.addresses}
        onSave={handleSaveAddresses}
      />
    </div>
  );
};

export default CheckoutPage;