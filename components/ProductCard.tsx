import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to details page
    addToCart(product);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative mb-4 overflow-hidden bg-warm-100 aspect-[4/5] rounded-sm">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
            <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
        </Link>
        
        {/* Desktop Quick Add (Hover) */}
        <button 
            onClick={handleAddToCart}
            className="hidden md:flex absolute bottom-0 right-0 bg-warm-900 text-white p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:bg-black items-center space-x-2"
        >
            <span className="text-xs uppercase tracking-widest font-bold font-sans">Add to Cart</span>
            <ShoppingBag className="w-4 h-4" />
        </button>
        
        {/* Mobile Quick Add - Full Width Bottom Bar for better tap target */}
        <button 
            onClick={handleAddToCart}
            className="md:hidden absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-sm text-warm-900 py-3 px-4 flex items-center justify-center space-x-2 border-t border-warm-200 active:bg-warm-100 transition-colors"
            aria-label="Add to cart"
        >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold font-sans">Add To Cart</span>
        </button>
      </div>

      <div className="flex flex-col space-y-1">
        <Link to={`/product/${product.id}`} className="block">
             <h3 className="text-lg md:text-xl font-display font-medium text-warm-900 leading-tight hover:opacity-70 transition-opacity">{product.name}</h3>
        </Link>
        <div className="flex justify-between items-baseline pt-1">
             <p className="text-xs text-gray-500 uppercase tracking-widest font-sans">{product.category}</p>
             <span className="text-lg font-serif font-medium text-warm-900 italic">${product.price}</span>
        </div>
      </div>
    </motion.div>
  );
};