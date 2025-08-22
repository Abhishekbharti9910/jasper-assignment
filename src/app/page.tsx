'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './components/ProductCard';
import ProductCardSkeleton from './components/ProductSkeleton';
import ThemeToggle from './components/ThemeToggle';
import { Product } from './api/products/route';
interface ApiResponse {
  success: boolean;
  data: Product[];
  total: number;
  timestamp: string;
}

interface FilterState {
  category: string;
  inStock: boolean;
  sort: string;
  search: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [notification, setNotification] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    inStock: false,
    sort: '',
    search: ''
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.inStock) params.append('inStock', 'true');
      if (filters.sort) params.append('sort', filters.sort);
      
      const response = await fetch(`/api/products?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        let filteredProducts = data.data;
        
        // Client-side search filter
        if (filters.search) {
          filteredProducts = filteredProducts.filter(product =>
            product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            product.description.toLowerCase().includes(filters.search.toLowerCase()) ||
            product.brand.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        
        setProducts(filteredProducts);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters.category, filters.inStock, filters.sort]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [filters.search]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => [...prev, product]);
    showNotification(`${product.title} added to cart!`, 'success');
  };

  const handleAddToWishlist = (product: Product) => {
    setWishlistItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        showNotification(`${product.title} removed from wishlist!`, 'info');
        return prev.filter(item => item.id !== product.id);
      } else {
        showNotification(`${product.title} added to wishlist!`, 'success');
        return [...prev, product];
      }
    });
  };

  const handleViewMore = (product: Product) => {
    showNotification(`Opening details for ${product.title}`, 'info');
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification(message);
    setTimeout(() => setNotification(''), 4000);
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      inStock: false,
      sort: '',
      search: ''
    });
  };

  const categories = ['all', 'Audio', 'Computers', 'Phones', 'Wearables', 'Tablets'];
  const sortOptions = [
    { value: '', label: 'Default' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Premium Store
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Discover amazing products
              </p>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              {/* Cart Counter */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className="w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-1H3m4 14a2 2 0 004 0m-4 0a2 2 0 00-4 0m10 0a2 2 0 004 0m-4 0a2 2 0 00-4 0" />
                  </svg>
                </div>
                {cartItems.length > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </div>
                )}
              </motion.div>

              {/* Wishlist Counter */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className="w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                {wishlistItems.length > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </div>
                )}
              </motion.div>
              
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Search Products
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search by name, brand..."
                className="w-full px-4 py-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort By
              </label>
              <select
                value={filters.sort}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                className="w-full px-4 py-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* In Stock Toggle & Clear */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filters
              </label>
              <div className="flex space-x-2">
                <label className="flex items-center space-x-2 flex-1">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">In Stock</span>
                </label>
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <main>
          {/* Results Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {loading ? 'Loading Products...' : `${products.length} Products Found`}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {loading 
                ? 'Fetching the latest products for you...'
                : 'Discover our carefully curated selection of premium products designed to enhance your lifestyle.'
              }
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-8 text-center"
            >
              <div className="text-red-600 dark:text-red-400 text-lg font-medium mb-2">
                Oops! Something went wrong
              </div>
              <p className="text-red-500 dark:text-red-300 mb-4">{error}</p>
              <button
                onClick={fetchProducts}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Products Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                // Loading Skeletons
                Array.from({ length: 6 }).map((_, index) => (
                  <motion.div
                    key={`skeleton-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ProductCardSkeleton />
                  </motion.div>
                ))
              ) : products.length > 0 ? (
                // Product Cards
                products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    layout
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onViewMore={handleViewMore}
                      onAddToWishlist={handleAddToWishlist}
                    />
                  </motion.div>
                ))
              ) : !loading && (
                // No Products Found
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-full text-center py-16"
                >
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Shopping Summary */}
          <AnimatePresence>
            {(cartItems.length > 0 || wishlistItems.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Cart Items */}
                  {cartItems.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-1H3m4 14a2 2 0 004 0m-4 0a2 2 0 00-4 0m10 0a2 2 0 004 0m-4 0a2 2 0 00-4 0" />
                        </svg>
                        Cart ({cartItems.length} items)
                      </h3>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {cartItems.map((item, index) => (
                          <div key={`cart-${item.id}-${index}`} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {item.title}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Wishlist Items */}
                  {wishlistItems.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Wishlist ({wishlistItems.length} items)
                      </h3>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {wishlistItems.map((item) => (
                          <div key={`wishlist-${item.id}`} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {item.title}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Enhanced Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 text-gray-900 dark:text-white px-6 py-4 rounded-2xl shadow-2xl max-w-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{notification}</p>
                </div>
                <button
                  onClick={() => setNotification('')}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
