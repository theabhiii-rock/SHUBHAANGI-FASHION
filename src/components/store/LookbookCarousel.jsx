import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiRefreshCw } from 'react-icons/fi';
import { getStoredProducts } from '../../data/store';

export default function LookbookCarousel({ fadeUp, products: propsProducts, onSelectProduct }) {
  // Use products from props, or fallback to stored products
  const allProducts = useMemo(() => {
    if (propsProducts && propsProducts.length > 0) return propsProducts;
    return getStoredProducts();
  }, [propsProducts]);

  // Helper to map a product to a lookbook slide item
  const formatProductToSlide = (p, index) => {
    let season = 'HAUTE COUTURE EDIT';
    if (p.subCategory) {
      season = p.subCategory.toUpperCase();
    } else if (p.category === 'JEWELLERY') {
      season = 'JEWELLERY HIGH COLLECTION';
    } else if (p.category === 'MAKEUP') {
      season = 'STUDIO BRIDAL ARTISTRY';
    } else if (p.category === 'DRESS') {
      season = 'SIGNATURE BRIDAL COUTURE';
    }

    const details = [];
    if (p.fabric) details.push(p.fabric);
    if (p.color) details.push(p.color);
    if (p.rentPrice3Days) {
      details.push(`Rental from ₹${p.rentPrice3Days.toLocaleString('en-IN')}`);
    } else if (p.buyPrice) {
      details.push(`Buy ₹${p.buyPrice.toLocaleString('en-IN')}`);
    }

    const artisan = details.length > 0 
      ? details.join(' • ') 
      : (p.description?.slice(0, 85) || 'Handcrafted Bespoke Atelier Creation');

    const img = p.img || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1600';

    return {
      id: p.id || `look-${index}`,
      rawProduct: p,
      title: p.name,
      season,
      artisan,
      img
    };
  };

  const [slides, setSlides] = useState(() => {
    const valid = (allProducts || []).filter(p => p && (p.img || (p.images && p.images.length > 0)));
    const shuffled = [...valid].sort(() => Math.random() - 0.5);
    const selected = shuffled.length > 0 ? shuffled.slice(0, 8) : [];
    return selected.map(formatProductToSlide);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Re-sync and shuffle when catalog products update or user requests shuffle
  const reshuffleSlides = useCallback(() => {
    const valid = (allProducts || []).filter(p => p && (p.img || (p.images && p.images.length > 0)));
    if (valid.length === 0) return;
    const shuffled = [...valid].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 8);
    setSlides(selected.map(formatProductToSlide));
    setCurrentIndex(0);
  }, [allProducts]);

  // Update slides if products list updates (e.g. from admin)
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      reshuffleSlides();
    }
  }, [allProducts, reshuffleSlides]);

  // Automatic slideshow transition every 5.5s
  useEffect(() => {
    if (!slides || slides.length === 0 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [slides, isPaused]);

  const prevSlide = () => {
    if (!slides.length) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    if (!slides.length) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[currentIndex] || slides[0];
  if (!slide) return null;

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="flex flex-col md:flex-row md:items-end justify-between mb-12"
      >
        <div>
          <span className="text-[10px] tracking-[0.4em] uppercase text-luxury-gold font-semibold block mb-2">
            Haute Couture Lookbook
          </span>
          <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-gray-900">
            Editorial Lookbook
          </h2>
        </div>
        <p className="text-xs text-gray-500 max-w-sm mt-3 md:mt-0 tracking-wide font-light">
          A visual journey through the season’s most commanding bridal silhouettes.
        </p>
      </motion.div>

      {/* Main Showcase Banner */}
      <div 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onClick={() => slide.rawProduct && onSelectProduct && onSelectProduct(slide.rawProduct)}
        className="relative h-[520px] md:h-[680px] w-full overflow-hidden rounded-sm bg-black shadow-xl group cursor-pointer"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={String(slide.id) + '-' + slide.img}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <img
              src={slide.img}
              alt={slide.title}
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-75 transition-all duration-[2s] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Slide Metadata Overlay */}
        <div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[10px] tracking-[0.3em] uppercase bg-luxury-gold text-black font-bold px-3 py-1 mb-3 inline-block">
              {slide.season}
            </span>
            <h3 className="text-3xl md:text-5xl font-serif text-white mb-2 leading-tight group-hover:text-luxury-gold transition-colors">
              {slide.title}
            </h3>
            <p className="text-xs text-gray-300 font-light tracking-wider mb-3">
              {slide.artisan}
            </p>
            <span className="text-[10px] tracking-[0.25em] uppercase text-luxury-gold font-semibold flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
              Explore This Atelier Piece →
            </span>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                reshuffleSlides();
              }}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white/80 flex items-center justify-center hover:bg-luxury-gold hover:text-black transition-all duration-300 mr-2"
              title="Shuffle Editorial Looks"
              aria-label="Shuffle Editorial Looks"
            >
              <FiRefreshCw size={14} />
            </button>

            <div className="flex gap-2 mr-3">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`h-1.5 transition-all rounded-full ${
                    idx === currentIndex ? 'w-8 bg-luxury-gold' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md text-white flex items-center justify-center hover:bg-luxury-gold hover:text-black transition-colors"
              aria-label="Previous look"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md text-white flex items-center justify-center hover:bg-luxury-gold hover:text-black transition-colors"
              aria-label="Next look"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
