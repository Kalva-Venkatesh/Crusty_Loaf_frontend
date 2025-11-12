import React from 'react';
import { Plus } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Card from '../common/Card';
import Button from '../common/Button';

const ProductCard = ({ product, setPage, setSelectedProductId }) => {
  const { dispatch } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const handleViewDetails = () => {
    setSelectedProductId(product.id);
    setPage('productDetail');
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); 
    if(!isAuthenticated) {
      setPage('login');
      return;
    }
    dispatch({ type: 'ADD_ITEM', payload: { productId: product.id } });
    showToast(`${product.name} added to cart!`);
  };

  return (
    <Card className="flex flex-col group cursor-pointer" onClick={handleViewDetails}>
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 flex-grow">{product.description.substring(0, 60)}...</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xl font-bold text-amber-900">${product.price.toFixed(2)}</span>
          <Button onClick={handleAddToCart} className="text-sm !px-3 !py-1.5">
            <Plus size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;