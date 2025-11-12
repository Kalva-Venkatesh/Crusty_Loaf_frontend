import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';

const OrderHistoryPage = ({ setPage }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      api.getOrderHistory()
        .then(data => setOrders(data))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const getStatusChip = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Preparing':
        return 'bg-blue-100 text-blue-800';
      case 'Out for Delivery':
        return 'bg-indigo-100 text-indigo-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) return <div className="p-8"><Spinner /></div>;
  if (error) return <div className="p-8"><Alert message={error} /></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-4">You haven't placed any orders. Let's change that!</p>
          <Button onClick={() => setPage('home')}>Start Shopping</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <Card key={order._id} className="p-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 border-b pb-4">
                <div>
                  <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
                  <p className="text-sm text-gray-500">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusChip(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-2xl font-bold text-gray-800">${order.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Items:</h4>
                <ul className="space-y-2">
                  {order.items.map(item => (
                    <li key={item.productId} className="flex justify-between items-center text-sm">
                      <span>{item.name} <span className="text-gray-500">x {item.quantity}</span></span>
                      <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                 <h4 className="font-semibold mb-1">Delivering to:</h4>
                 <p className="text-sm text-gray-600">{order.address.street}, {order.address.city}, {order.address.state} {order.address.zip}</p>
                 {order.deliveryNotes && (
                   <p className="text-sm text-gray-500 mt-1"><em>Notes: {order.deliveryNotes}</em></p>
                 )}
               </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;