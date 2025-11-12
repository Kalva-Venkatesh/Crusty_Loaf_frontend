import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../api';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';

const AdminPanelPage = ({ setPage }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { showToast, showError } = useToast();
  
  const orderStatuses = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];
  
  useEffect(() => {
    setLoading(true);
    api.getAllOrders()
      .then(data => setOrders(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  
  const filteredOrders = useMemo(() => {
    return orders.filter(o => filterStatus === 'All' || o.status === filterStatus);
  }, [orders, filterStatus]);
  
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const updatedOrder = await api.updateOrderStatus(orderId, newStatus);
      setOrders(prevOrders => 
        prevOrders.map(o => o._id === orderId ? { ...o, status: updatedOrder.status } : o)
      );
      if(selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => ({...prev, status: updatedOrder.status}));
      }
      showToast(`Order updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status:", err);
      showError(err.message);
    }
  };
  
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard - All Orders</h1>
      
      <div className="mb-4">
        <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
          Filter by Status
        </label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-transparent"
        >
          <option value="All">All Statuses</option>
          {orderStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
      
      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert message={error} />
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{order.user.name}</div>
                    <div className="text-xs text-gray-400">{order.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                     <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusChip(order.status)}`}>
                       {order.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button onClick={() => setSelectedOrder(order)} variant="ghost" className="text-amber-700 !p-1 text-xs">
                      View / Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order Details #${selectedOrder?._id}`}>
        {selectedOrder && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Customer</h4>
              <p>{selectedOrder.user.name} ({selectedOrder.user.email})</p>
            </div>
            <div>
              <h4 className="font-semibold">Shipping Address</h4>
              <p>{selectedOrder.address.street}, {selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.zip}</p>
            </div>
             {selectedOrder.deliveryNotes && (
             <div>
               <h4 className="font-semibold">Delivery Notes</h4>
               <p><em>{selectedOrder.deliveryNotes}</em></p>
             </div>
            )}
            <div>
              <h4 className="font-semibold">Items</h4>
              <ul className="space-y-1 text-sm list-disc list-inside">
                {selectedOrder.items.map(item => (
                  <li key={item.productId}>
                    {item.name} (x {item.quantity}) @ ${item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>${selectedOrder.total.toFixed(2)}</span>
            </div>
            
            <hr />
            
            <div>
              <label htmlFor="updateStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Update Order Status
              </label>
              <div className="flex gap-2">
                <select
                  id="updateStatus"
                  value={selectedOrder.status}
                  onChange={e => {
                    handleUpdateStatus(selectedOrder._id, e.target.value);
                    setSelectedOrder(prev => ({...prev, status: e.target.value}));
                  }}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-transparent"
                >
                  {orderStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminPanelPage;