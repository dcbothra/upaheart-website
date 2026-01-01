import React, { useState } from 'react';
import { PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'framer-motion';

export const Shop: React.FC = () => {
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

  const filteredProducts = filter === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === filter);

  return (
    <div className="pt-28 md:pt-32 pb-20 min-h-screen bg-warm-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-12 md:mb-20 text-center">
          <span className="text-xs font-serif italic font-bold text-gray-400 mb-4 block">Shop</span>
          <h1 className="text-4xl md:text-6xl font-display text-warm-900 mb-6">The Collection</h1>
          <p className="text-gray-500 max-w-xl mx-auto font-sans font-light leading-relaxed text-sm md:text-base">
            Explore our range of premium 3D printed artifacts. Designed for aesthetics, engineered for durability, and crafted with warmth.
          </p>
        </div>

        {/* Filter Tab - Scrollable on mobile */}
        <div className="flex justify-start md:justify-center mb-10 md:mb-16 gap-3 overflow-x-auto pb-4 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`whitespace-nowrap text-xs uppercase tracking-[0.15em] px-6 py-3 rounded-sm transition-all duration-300 border flex-shrink-0 ${
                filter === cat 
                ? 'bg-warm-900 text-white border-warm-900' 
                : 'bg-transparent text-gray-500 border-warm-200 hover:border-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
        >
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        {filteredProducts.length === 0 && (
            <div className="text-center py-20 text-gray-400 font-serif italic">
                No products found in this category.
            </div>
        )}
      </div>
    </div>
  );
};
