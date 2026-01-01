import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-warm-100 text-stone-600 py-16 mt-20 border-t border-warm-200">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="space-y-4">
          <h3 className="text-2xl font-display font-medium text-warm-900">UpaHeart</h3>
          <p className="text-sm leading-relaxed max-w-xs font-light">
            Premium gifting solutions. We blend technology with craftsmanship to create memories that last forever.
          </p>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-warm-900">Secure Shopping</h4>
          <div className="flex flex-col space-y-2 text-sm font-light">
             <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>256-bit SSL Encryption</span>
             </div>
             <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Privacy Guaranteed</span>
             </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-warm-900">Contact</h4>
          <a href="mailto:upaheart@gmail.com" className="text-sm block hover:text-warm-900 transition-colors">upaheart@gmail.com</a>
          <div className="pt-2 text-xs text-stone-400">
            <p>&copy; {new Date().getFullYear()} UpaHeart Inc.</p>
            <p>All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
