'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../api/products/route';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewMore?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
}

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onViewMore,
  onAddToWishlist 
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setImageLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleAddToCart = async () => {
    if (!product.inStock) return;
    
    setAddingToCart(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onAddToCart?.(product);
    setAddingToCart(false);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    onAddToWishlist?.(product);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const renderStars = (rating: number, reviewCount: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center gap-1" aria-label={`Rating: ${rating} out of 5 stars`}>
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              className={`w-4 h-4 transition-all duration-300 hover:scale-110 ${
                index < fullStars
                  ? 'text-yellow-400 fill-current drop-shadow-sm'
                  : index === fullStars && hasHalfStar
                  ? 'text-yellow-400 fill-current opacity-50'
                  : 'text-gray-300 dark:text-gray-600 hover:text-yellow-200'
              }`}
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L0 6.91l6.564-.955L10 0l3.436 5.955L20 6.91l-5.245 4.635L15.878 18z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200 group-hover:text-gray-700 dark:group-hover:text-gray-300">
          ({reviewCount.toLocaleString()})
        </span>
      </div>
    );
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -12, 
        scale: 1.03,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`group relative overflow-hidden max-w-sm mx-auto cursor-pointer
        ${product.inStock 
          ? 'bg-white/80 dark:bg-gray-800/80 hover:bg-white/95 dark:hover:bg-gray-800/95' 
          : 'bg-gray-100/80 dark:bg-gray-700/80'
        }
        backdrop-blur-xl border border-white/30 dark:border-gray-700/50 
        rounded-2xl shadow hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-blue-400/20 
        transition-all duration-500 transform-gpu
        ${!product.inStock && 'opacity-75 saturate-50'}
      `}
      role="article"
      aria-labelledby={`product-title-${product.id}`}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* Enhanced Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent dark:from-gray-800/20 dark:via-gray-800/10 pointer-events-none rounded-2xl"></div>
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out"></div>
      
      {/* Product Image Container with enhanced hover effects */}
      <div className="relative w-full h-72 overflow-hidden group-hover:h-64 transition-all duration-500">
        {/* Enhanced Sale/Discount Badge */}
        <AnimatePresence>
          {product.saleTag && product.discount && (
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -180 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                rotate: 0,
                transition: { 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 10, 
                  delay: 0.2 
                }
              }}
              exit={{ scale: 0, opacity: 0, rotate: 180 }}
              whileHover={{ 
                scale: 1.1, 
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.3 }
              }}
              className="absolute top-4 left-4 z-20"
            >
              <div className="bg-gradient-to-r from-red-500 via-red-600 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-red-400">
                -{product.discount}% OFF
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Wishlist Button */}
        <motion.button
          whileHover={{ 
            scale: 1.15,
            rotate: [0, -10, 10, 0],
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWishlist}
          className={`absolute top-4 right-4 z-20 w-11 h-11 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30
            ${isWishlisted 
              ? 'bg-red-500/90 text-white hover:bg-red-600/90' 
              : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 hover:text-red-500 hover:bg-white dark:hover:bg-gray-700'
            }
          `}
          aria-label={`${isWishlisted ? 'Remove from' : 'Add to'} wishlist`}
        >
          <motion.svg
            animate={isWishlisted ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
            className="w-5 h-5"
            fill={isWishlisted ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </motion.svg>
        </motion.button>

        {/* Enhanced Stock Status */}
        {!product.inStock ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="bg-gray-900/95 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-xl border border-gray-600"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Out of Stock
              </div>
            </motion.div>
          </motion.div>
        ) : product.stockCount <= 10 && (
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-4 left-4 z-10"
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 border border-orange-400">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                Only {product.stockCount} left!
              </div>
            </div>
          </motion.div>
        )}

        {/* Enhanced Image Gallery with better hover effects */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 1.1, rotateY: -90 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="relative w-full h-full"
          >
            <Image
              src={product.images[currentImageIndex]}
              alt={`${product.title} - Product image ${currentImageIndex + 1}`}
              fill
              className={`object-cover transition-all duration-700 group-hover:scale-110 hover:scale-115 ${
                isImageLoading ? 'blur-sm scale-110' : 'blur-0 scale-100'
              } ${!product.inStock && 'grayscale-50'}`}
              onLoad={() => setImageLoading(false)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={product.id <= 3}
            />
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Image Navigation */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 right-4 z-10 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              onClick={prevImage}
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl border border-white/30"
              aria-label="Previous image"
            >
              <svg className="w-4 h-4 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button
              onClick={nextImage}
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl border border-white/30"
              aria-label="Next image"
            >
              <svg className="w-4 h-4 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        )}

        {/* Enhanced Image Dots Indicator */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
            {product.images.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? 'bg-white shadow-lg scale-110'
                    : 'bg-white/60 hover:bg-white/80 hover:scale-105'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Product Content */}
      <div className="p-6 space-y-4 relative z-10">
        {/* Brand with hover effect */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
        >
          {product.brand}
        </motion.div>

        {/* Enhanced Title */}
        <motion.h3 
          id={`product-title-${product.id}`}
          whileHover={{ scale: 1.02 }}
          className="text-lg font-bold text-center text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 hover:tracking-wide"
        >
          {product.title}
        </motion.h3>

        {/* Enhanced Rating */}
        <div className="flex justify-center">
          {renderStars(product.rating, product.reviewCount)}
        </div>

        {/* Enhanced Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center line-clamp-3 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
          {product.description}
        </p>

        {/* Enhanced Price Section */}
        <div className="text-center space-y-1">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center space-x-3"
          >
            <span className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
              {product.price}
            </span>
            {product.originalPrice && product.originalPrice !== product.price && (
              <span className="text-lg text-gray-500 dark:text-gray-400 line-through hover:text-red-500 transition-colors duration-200">
                {product.originalPrice}
              </span>
            )}
          </motion.div>
          {product.discount && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-green-600 dark:text-green-400 font-medium"
            >
              💰 Save ${(parseFloat(product.originalPrice?.replace('$', '').replace(',', '') || '0') - 
                         parseFloat(product.price.replace('$', '').replace(',', ''))).toFixed(2)}
            </motion.div>
          )}
        </div>

        {/* Enhanced Features (Show on Hover) */}
        <AnimatePresence>
          {showDetails && product.features && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ 
                opacity: 1, 
                height: 'auto', 
                y: 0,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
              exit={{ 
                opacity: 0, 
                height: 0, 
                y: -20,
                transition: { duration: 0.3 }
              }}
              className="overflow-hidden"
            >
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-lg p-3 space-y-2 border border-gray-200/50 dark:border-gray-600/50">
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center">
                  ✨ Key Features
                </h4>
                <div className="grid grid-cols-2 gap-1">
                  {product.features.slice(0, 4).map((feature, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        transition: { delay: index * 0.1 }
                      }}
                      className="text-xs text-gray-600 dark:text-gray-400 flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      <motion.svg 
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.3 }}
                        className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </motion.svg>
                      <span className="truncate">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* Enhanced View More Button */}
          <motion.button
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onViewMore?.(product)}
            className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transform hover:-translate-y-0.5"
            aria-describedby={`product-title-${product.id}`}
          >
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center justify-center space-x-2"
            >
              <span>View Details</span>
              <motion.svg 
                whileHover={{ x: 3, scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </motion.svg>
            </motion.div>
          </motion.button>

          {/* Enhanced Add to Cart Button */}
          <motion.button
            whileHover={product.inStock && !addingToCart ? { 
              scale: 1.02,
              boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)",
              transition: { duration: 0.2 }
            } : {}}
            whileTap={product.inStock ? { scale: 0.98 } : {}}
            onClick={handleAddToCart}
            disabled={!product.inStock || addingToCart}
            className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 relative overflow-hidden transform ${
              product.inStock && !addingToCart
                ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 text-white shadow-lg hover:shadow-2xl hover:shadow-green-500/40 focus:ring-green-500 hover:-translate-y-0.5'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
            aria-label={`Add ${product.title} to cart`}
          >
            <AnimatePresence mode="wait">
              {addingToCart ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center justify-center space-x-2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  ></motion.div>
                  <span>Adding to Cart...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center justify-center space-x-2"
                >
                  <motion.svg 
                    whileHover={product.inStock ? { scale: 1.1 } : {}}
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-1H3m4 14a2 2 0 004 0m-4 0a2 2 0 00-4 0m10 0a2 2 0 004 0m-4 0a2 2 0 00-4 0" />
                  </motion.svg>
                  <span>
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
