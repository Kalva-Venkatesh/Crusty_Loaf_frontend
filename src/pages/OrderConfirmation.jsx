import React from 'react';
import { CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';

const OrderConfirmationPage = ({ setPage, context }) => {
  const { orderId } = context || {};
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <CheckCircle size={64} className="mx-auto text-green-600 mb-6" />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
      <p className="text-lg text-gray-600 mb-8">
        Thank you for your purchase. Your order ID is: <br /> <strong className="text-gray-700">{orderId}</strong>
      </p>
      <div className="flex justify-center gap-4">
        <Button onClick={() => setPage('orders')} variant="primary">
          View My Orders
        </Button>
        <Button onClick={() => setPage('home')} variant="secondary">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;