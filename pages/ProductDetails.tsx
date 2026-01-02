import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { useCart } from '../context/CartContext';
import { Check, Truck, Shield, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = PRODUCTS.find(p => p.id === id);
  const [selectedImage, setSelectedImage] = React.useState(product ? product.images[0] : '');
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);

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
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square bg-warm-100 overflow-hidden rounded-sm cursor-zoom-in"
            onClick={() => setIsLightboxOpen(true)}
          >
            <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>
          <div className="grid grid-cols-4 gap-3 md:gap-4">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`aspect-square bg-warm-100 overflow-hidden rounded-sm transition-all ${selectedImage === img ? 'ring-2 ring-warm-900 ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
              >
                <img src={img} alt="detail" className="w-full h-full object-cover" />
              </button>
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

      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="w-10 h-10" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedImage}
              alt="Zoomed Product"
              className="max-w-full max-h-full object-contain rounded-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
