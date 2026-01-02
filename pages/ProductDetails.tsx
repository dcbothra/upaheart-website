import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { useCart } from '../context/CartContext';
import { Check, Truck, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    return <div className="pt-32 text-center bg-warm-50 min-h-screen font-display">Product not found.</div>;
  }

  const handleAddToCart = () => {
    addToCart(product);
    navigate('/cart');
  };

  return (
    <div className="pt-24 md:pt-32 pb-20 min-h-screen bg-warm-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">

        {/* Gallery */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square bg-warm-100 overflow-hidden rounded-sm"
          >
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {product.images.slice(1).map((img, idx) => (
              <div key={idx} className="aspect-square bg-warm-100 overflow-hidden rounded-sm">
                <img src={img} alt="detail" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <span className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-sans">{product.category}</span>
          <h1 className="text-3xl md:text-5xl font-display font-medium text-warm-900 mb-4 leading-tight">{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-8">
            {product.originalPrice && (
              <span className="text-xl md:text-2xl font-serif text-gray-400 line-through decoration-gray-400">₹{product.originalPrice}</span>
            )}
            <p className="text-2xl md:text-3xl font-serif text-warm-900 italic">₹{product.price}</p>
          </div>

          <div className="prose prose-stone text-gray-500 mb-10 leading-relaxed font-sans font-light">
            <p>{product.longDescription}</p>
          </div>

          <div className="space-y-3 mb-10">
            {product.features.map((feature, idx) => (
              <div key={idx} className="flex items-center text-sm text-gray-600 font-sans">
                <Check className="w-4 h-4 mr-3 text-green-700" />
                {feature}
              </div>
            ))}
          </div>

          {product.isCustomizable && (
            <div className="bg-warm-100 border border-warm-200 p-4 mb-8 text-sm text-warm-900 font-sans">
              <strong>Customization:</strong> You will be asked to securely upload your image during the checkout process.
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="w-full bg-warm-900 text-white py-4 md:py-5 text-sm uppercase tracking-[0.2em] font-bold hover:bg-black transition-colors mb-8 rounded-sm font-sans"
          >
            Add to Cart
          </button>

          <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 uppercase tracking-wide font-sans">
            <div className="flex items-center justify-center border border-warm-200 py-4 rounded-sm">
              <Truck className="w-4 h-4 mr-2" />
              Free Shipping
            </div>
            <div className="flex items-center justify-center border border-warm-200 py-4 rounded-sm">
              <Shield className="w-4 h-4 mr-2" />
              Warranty
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
