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
        className="relative min-h-[580px] md:h-[660px] w-full overflow-hidden rounded-md bg-zinc-950 border border-luxury-gold/30 shadow-2xl group cursor-pointer"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={String(slide.id) + '-' + slide.img}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            {/* Ambient Blurred Background (Gives the atmosphere & color of the piece without cropping the foreground) */}
            <img
              src={slide.img}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-25 scale-110 pointer-events-none"
            />
            {/* Cinematic Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40 md:bg-gradient-to-r md:from-black/95 md:via-black/75 md:to-black/35" />

            {/* Split Content: Left Editorial Typography & Right Uncropped Original Picture */}
            <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 pb-20 md:pb-16">
              
              {/* Left Column: Story, Title, Fabric, Price & Action */}
              <div className="w-full md:w-1/2 flex flex-col justify-center text-left order-2 md:order-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] tracking-[0.3em] uppercase bg-luxury-gold text-black font-bold px-3 py-1 inline-block shadow-xs">
                    {slide.season}
                  </span>
                  <span className="text-[10px] tracking-widest uppercase text-emerald-400 font-mono flex items-center gap-1 bg-black/60 border border-emerald-400/30 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Atelier Original
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl md:text-5xl font-serif text-white mb-3 leading-tight group-hover:text-luxury-gold transition-colors drop-shadow-md">
                  {slide.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-300 font-light tracking-wide mb-5 line-clamp-2 md:line-clamp-3">
                  {slide.artisan}
                </p>

                <div className="flex items-center gap-4 pt-1">
                  <button className="px-5 py-2.5 bg-luxury-gold text-black hover:bg-white text-[11px] tracking-[0.2em] uppercase font-bold transition-all shadow-md flex items-center gap-2">
                    <span>Explore Look</span>
                    <span>→</span>
                  </button>
                  <span className="text-[11px] text-gray-400 tracking-wider hidden sm:inline">
                    Click to view 360° & details
                  </span>
                </div>
              </div>

              {/* Right Column: Original 100% Uncropped Portrait Picture */}
              <div className="w-full md:w-1/2 h-[340px] sm:h-[400px] md:h-[500px] flex items-center justify-center order-1 md:order-2">
                <div className="relative h-full w-auto max-w-full flex items-center justify-center">
                  <img
                    src={slide.img}
                    alt={slide.title}
                    className="h-full w-auto max-h-full max-w-full object-contain rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.9)] border border-white/15 group-hover:scale-[1.02] transition-transform duration-700"
                  />
                  <span className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md text-[9px] text-white/90 font-mono tracking-widest uppercase px-2 py-0.5 rounded border border-white/10 shadow-xs">
                    Original Frame
                  </span>
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls Bar at the Bottom */}
        <div className="absolute bottom-3 left-6 right-6 md:left-12 md:right-12 z-20 flex items-center justify-between border-t border-white/10 pt-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                reshuffleSlides();
              }}
              className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md text-white/80 flex items-center justify-center hover:bg-luxury-gold hover:text-black transition-all duration-300 mr-2"
              title="Shuffle Editorial Looks"
              aria-label="Shuffle Editorial Looks"
            >
              <FiRefreshCw size={12} />
            </button>
            <span className="text-[10px] tracking-widest uppercase text-gray-400 font-mono hidden sm:inline">
              Look {currentIndex + 1} of {slides.length}
            </span>
          </div>

          <div className="flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 transition-all rounded-full ${
                  idx === currentIndex ? 'w-8 bg-luxury-gold' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-luxury-gold hover:text-black transition-colors"
              aria-label="Previous look"
            >
              <FiChevronLeft size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-luxury-gold hover:text-black transition-colors"
              aria-label="Next look"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
