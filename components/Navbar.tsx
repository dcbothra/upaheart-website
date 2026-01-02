import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <nav className={`fixed w-full top-0 left-0 z-[60] transition-all duration-500 ${isHome && !isOpen ? 'bg-gradient-to-b from-black/30 to-transparent' : 'bg-[#F9F8F6] shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            {/* Logo */}
            <Link
              to="/"
              className={`text-2xl md:text-3xl font-display font-semibold tracking-tight transition-colors duration-500 ${isHome && !isOpen ? 'text-white' : 'text-warm-900'}`}
            >
              Up<span className="text-[#E31C25]">a</span>Heart
            </Link>

            {/* Centered Logo */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:block">
              <Link to="/">
                <img src="/Logo (White).png" alt="UpaHeart Logo" className="h-16 w-auto opacity-90 hover:opacity-100 transition-opacity" />
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className={`hidden md:flex space-x-12 items-center transition-colors duration-500 ${isHome && !isOpen ? 'text-white' : 'text-warm-900'}`}>
              <Link to="/" className="text-sm font-display font-medium hover:opacity-70 transition-opacity tracking-wide">Home</Link>
              <Link to="/shop" className="text-sm font-display font-medium hover:opacity-70 transition-opacity tracking-wide">Collection</Link>
              <Link to="/cart" className="relative group p-2">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-warm-900 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-sans">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center space-x-4 md:hidden">
              <Link to="/cart" className={`relative p-2 transition-colors duration-500 ${isHome && !isOpen ? 'text-white' : 'text-warm-900'}`}>
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-warm-900 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-sans">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                className={`p-2 transition-colors duration-500 ${isHome && !isOpen ? 'text-white' : 'text-warm-900'}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-7 h-7 text-warm-900" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay - Fixed and Top-Level with Solid Background */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#F9F8F6] z-[70] flex flex-col pt-32 px-10"
          >
            {/* Header Mirror for Logo/X inside the overlay to prevent text overlap */}
            <div className="absolute top-0 left-0 w-full h-20 flex justify-between items-center px-6">
              <Link to="/" onClick={() => setIsOpen(false)} className="text-2xl font-display font-semibold text-warm-900">UpaHeart</Link>
              <button className="p-2 text-warm-900" onClick={() => setIsOpen(false)}>
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="flex flex-col space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link
                  to="/"
                  className="text-5xl font-display font-medium text-warm-900"
                >
                  Home
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  to="/shop"
                  className="text-5xl font-display font-medium text-warm-900"
                >
                  Collection
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  to="/cart"
                  className="text-5xl font-display font-medium text-warm-900 flex items-center gap-4"
                >
                  Cart
                  {cartCount > 0 && (
                    <span className="bg-warm-900 text-white text-base w-10 h-10 flex items-center justify-center rounded-full font-sans font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </motion.div>
            </div>

            <div className="mt-auto pb-16">
              <p className="font-serif text-xl text-warm-900 italic mb-3 opacity-60">Crafted with warmth.</p>
              <div className="h-[1px] w-12 bg-warm-900 mb-6" />
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-sans font-bold">UpaHeart Premium Gifting</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};