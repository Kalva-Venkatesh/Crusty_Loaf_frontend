import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/products/ProductCard';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import Input from '../components/common/Input';

const HomePage = ({ setPage, setSelectedProductId }) => {
  const { products, loading, error, categories } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-amber-100 rounded-lg p-8 md:p-12 mb-8 text-center shadow-inner-lg">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-900 font-serif mb-4">
          Freshly Baked Goodness
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          From rustic sourdough to delicate pastries, discover your new favorite treat. 
          All baked fresh daily with love and the finest ingredients.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Input
            id="search"
            type="text"
            placeholder="Search for bread, pastries, cakes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-transparent"
        >
          <option value="All">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert message={`Error loading products: ${error}`} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              setPage={setPage}
              setSelectedProductId={setSelectedProductId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;