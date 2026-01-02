import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Package, PenTool, User, Cpu, Layers, Lightbulb } from 'lucide-react';
import { PRODUCTS, CORE_VALUES } from '../constants';
import { ProductCard } from '../components/ProductCard';

export const Home: React.FC = () => {
  const featuredProducts = PRODUCTS.slice(0, 3);

  return (
    <div className="w-full bg-warm-50">
      {/* Hero Section */}
      <section className="relative h-screen w-full bg-warm-100 flex items-center justify-center overflow-hidden z-0">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=2000&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-90 sepia-[0.3]"
          />
          <div className="absolute inset-0 bg-black/45 backdrop-contrast-[.85]" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-4 md:px-6 mt-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-9xl font-display text-white mb-6 md:mb-8 leading-[1.05] md:leading-[0.9] tracking-tight"
          >
            Memories in <br /> <span className="font-serif italic font-light opacity-80">Light & Form</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-base md:text-xl text-white/90 mb-12 md:mb-16 font-sans font-light tracking-wide max-w-sm md:max-w-xl mx-auto leading-relaxed"
          >
            Premium 3D printed gifting. Tangible, customizable, and deeply personal.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center space-x-3 bg-white text-warm-900 px-10 py-5 md:px-12 md:py-6 text-xs uppercase tracking-[0.25em] font-bold hover:bg-warm-100 transition-all transform hover:scale-105 rounded-sm font-sans shadow-lg"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 md:py-32 bg-warm-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 md:mb-24 gap-8 text-center md:text-left">
            <div className="max-w-xl">
              <span className="text-xs font-serif italic font-bold text-gray-400 mb-3 block tracking-widest uppercase">Our Selection</span>
              <h2 className="text-4xl md:text-6xl font-display text-warm-900 leading-tight">Curated Gifts</h2>
            </div>
            {/* Desktop Link Only */}
            <Link to="/shop" className="hidden md:group md:flex items-center space-x-2 text-xs font-bold uppercase tracking-[0.2em] border-b border-warm-900 pb-2 hover:text-gray-500 hover:border-gray-500 transition-all font-sans">
              <span>View Full Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-16">
            {featuredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Mobile Link - Appears AFTER products */}
          <div className="flex md:hidden justify-center mt-16">
            <Link to="/shop" className="group flex items-center space-x-2 text-xs font-bold uppercase tracking-[0.2em] border-b border-warm-900 pb-2 hover:text-gray-500 transition-all font-sans">
              <span>View Full Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 md:py-40 bg-warm-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square overflow-hidden rounded-sm"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover grayscale opacity-80"
              >
                <source src="/Post_7.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-warm-900/20 mix-blend-overlay" />
              <div className="absolute inset-0 border border-white/10 m-8 pointer-events-none" />

              <div className="absolute bottom-12 -right-6 md:-right-12 bg-white/90 backdrop-blur-sm text-warm-900 p-8 max-w-xs shadow-2xl">
                <p className="font-serif italic text-lg leading-relaxed">"The transition from a digital pixel to a physical layer is where the magic happens."</p>
              </div>
            </motion.div>

            <div className="space-y-12">
              <div>
                <span className="text-xs uppercase tracking-[0.4em] font-bold text-warm-200 block mb-4">Our Craft</span>
                <h2 className="text-4xl md:text-6xl font-display leading-tight">Precision Layered With Heart</h2>
              </div>

              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="w-12 h-12 flex-shrink-0 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-display mb-2">Computational Art</h4>
                    <p className="text-sm text-gray-400 font-light leading-relaxed">We use advanced generative algorithms to transform photos and concepts into complex, printable geometries.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 flex-shrink-0 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-display mb-2">Micro-Layering</h4>
                    <p className="text-sm text-gray-400 font-light leading-relaxed">Each piece is printed at a resolution of 100 microns, ensuring every texture and detail is captured flawlessly.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 flex-shrink-0 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-display mb-2">Internal Illumination</h4>
                    <p className="text-sm text-gray-400 font-light leading-relaxed">Our lithophanes are engineered to interact perfectly with light, revealing depth that photos alone cannot convey.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32 bg-warm-100 border-t border-warm-200">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-5xl font-display text-warm-900 mb-6">The UpaHeart Promise</h2>
            <div className="h-[2px] w-12 bg-warm-900 mx-auto opacity-20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
            {CORE_VALUES.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center space-y-5"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-white rounded-full text-warm-900 shadow-sm mb-2 transform transition-transform hover:scale-110">
                  {idx === 0 && <Star className="w-6 h-6" />}
                  {idx === 1 && <User className="w-6 h-6" />}
                  {idx === 2 && <PenTool className="w-6 h-6" />}
                  {idx === 3 && <Package className="w-6 h-6" />}
                </div>
                <h3 className="text-xl font-display font-medium text-warm-900">{val.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-sans font-light px-4 md:px-0 opacity-80">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};