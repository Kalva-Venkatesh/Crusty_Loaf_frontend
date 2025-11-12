import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { api } from '../api';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';

const ProductDetailPage = ({ setPage, productId }) => {
  const { getProductById } = useProducts();
  const { dispatch } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const p = getProductById(productId);
    if (p) {
      setProduct(p);
      setLoading(false);
    } else {
      // Fallback to fetch if not in context (e.g., direct URL)
      api.getProductById(productId)
        .then(data => setProduct({ ...data, id: data._id }))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [productId, getProductById]);

  const handleAddToCart = () => {
    if(!isAuthenticated) {
      setPage('login');
      return;
    }
    dispatch({ type: 'ADD_ITEM', payload: { productId: product.id } });
    showToast(`${product.name} added to cart!`);
  };

  if (loading) return <div className="p-8"><Spinner /></div>;
  if (error) return <div className="p-8"><Alert message={error} /></div>;
  if (!product) return <div className="p-8"><Alert message="Product not found." /></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={() => setPage('home')} variant="ghost" className="mb-4">
        &larr; Back to Products
      </Button>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <Card className="shadow-lg">
            <img
              src={product.imageUrl.replace('600x400', '800x600')} 
              alt={product.name}
              className="w-full h-auto object-cover rounded-t-lg"
            />
          </Card>
        </div>
        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold text-amber-900 font-serif mb-4">{product.name}</h1>
          <span className="text-3xl font-bold text-gray-800 mb-4 block">${product.price.toFixed(2)}</span>
          <p className="text-lg text-gray-700 mb-6">{product.description}</p>
          <span className="inline-block bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full mb-6">
            {product.category}
          </span>
          <div>
            <Button onClick={handleAddToCart} className="w-full md:w-auto text-lg !py-3 !px-8">
              <ShoppingCart size={20} className="inline mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;