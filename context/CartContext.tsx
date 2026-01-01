import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCustomizationFile: (cartItemId: string, file: File) => void;
  updateCartItem: (cartItemId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Hydrate from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('upaheart_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('upaheart_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    const newItem: CartItem = {
      ...product,
      cartItemId: Math.random().toString(36).substring(7),
      quantity: 1,
      customizationFile: null // Files cannot be stored in localstorage easily, handled in session usually
    };
    setCart(prev => [...prev, newItem]);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateCustomizationFile = (cartItemId: string, file: File) => {
    setCart(prev => prev.map(item =>
      item.cartItemId === cartItemId ? { ...item, customizationFile: file } : item
    ));
  };

  const updateCartItem = (cartItemId: string, updates: Partial<CartItem>) => {
    setCart(prev => prev.map(item =>
      item.cartItemId === cartItemId ? { ...item, ...updates } : item
    ));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, item) => acc + item.price, 0);
  const cartCount = cart.length;

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCustomizationFile, updateCartItem, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
