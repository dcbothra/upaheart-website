import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ArrowRight } from 'lucide-react';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-20 min-h-screen bg-warm-50 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-display mb-4 text-warm-900">Your cart is empty</h2>
        <Link to="/shop" className="text-sm border-b border-warm-900 pb-1 hover:opacity-60 transition-opacity uppercase tracking-widest font-sans font-bold">
            Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-32 pb-20 min-h-screen bg-warm-50">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-display text-warm-900 mb-8 md:mb-12 text-center md:text-left">Shopping Cart</h1>
        
        <div className="bg-white border border-warm-200 mb-8 md:mb-12 rounded-sm overflow-hidden">
            {cart.map((item) => (
                <div key={item.cartItemId} className="p-4 md:p-6 border-b border-warm-100 flex items-center gap-4 md:gap-6 last:border-b-0">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-warm-100 flex-shrink-0 rounded-sm overflow-hidden">
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                        <h3 className="font-display text-base md:text-lg text-warm-900 truncate">{item.name}</h3>
                        <p className="text-xs md:text-sm text-gray-500 font-sans font-light">{item.category}</p>
                        {item.isCustomizable && (
                            <span className="inline-block mt-2 text-[10px] uppercase tracking-wider bg-warm-100 text-warm-900 px-2 py-1 rounded-sm">Customizable</span>
                        )}
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="font-serif font-medium mb-2 text-base md:text-lg italic">${item.price.toFixed(2)}</p>
                        <button 
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                            aria-label="Remove item"
                        >
                            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>

        <div className="flex flex-col items-end">
            <div className="bg-white p-6 md:p-8 border border-warm-200 w-full md:w-96 mb-6 md:mb-8 rounded-sm">
                <div className="flex justify-between mb-4">
                    <span className="text-gray-600 font-sans font-light text-sm">Subtotal</span>
                    <span className="font-serif font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-6 text-sm text-gray-500 font-sans font-light">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-warm-100 pt-6 flex justify-between">
                    <span className="font-display text-lg">Total</span>
                    <span className="font-serif text-2xl italic">${cartTotal.toFixed(2)}</span>
                </div>
            </div>
            
            <Link 
                to="/checkout"
                className="w-full md:w-auto text-center inline-flex items-center justify-center bg-warm-900 text-white px-10 py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-black transition-colors rounded-sm"
            >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4 ml-3" />
            </Link>
        </div>
      </div>
    </div>
  );
};
