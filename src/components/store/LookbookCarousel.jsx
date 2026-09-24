import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function LookbookCarousel({ fadeUp }) {
  const lookbookSlides = [
    {
      id: 1,
      title: 'The Imperial Noor Lehenga',
      season: 'Winter Bridal 2026',
      artisan: '380 Hours of Pure Zari Handwork',
      img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1600'
    },
    {
      id: 2,
      title: 'The Jaipur Palace Velvet',
      season: 'Royal Heritage Edit',
      artisan: 'Deep Crimson Velvet with Antique Mokaish',
      img: 'https://images.unsplash.com/photo-1583391733958-d1531118c728?auto=format&fit=crop&q=80&w=1600'
    },
    {
      id: 3,
      title: 'The Gilded Champagne Saree',
      season: 'Cocktail & Reception Edit',
      artisan: 'Tissue Metallic Drape with Micro Pearls',
      img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1600'
    },
    {
      id: 4,
      title: 'The Royal Kundan & Emerald Choker',
      season: 'Jewellery High Collection',
      artisan: 'Handset Uncut Polki Diamonds in 22K Gold Finish',
      img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1600'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % lookbookSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [lookbookSlides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + lookbookSlides.length) % lookbookSlides.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % lookbookSlides.length);
  };

  const slide = lookbookSlides[currentIndex];

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
      <div className="relative h-[520px] md:h-[680px] w-full overflow-hidden rounded-sm bg-black shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <img
              src={slide.img}
              alt={slide.title}
              className="w-full h-full object-cover opacity-85"
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
            <h3 className="text-3xl md:text-5xl font-serif text-white mb-2 leading-tight">
              {slide.title}
            </h3>
            <p className="text-xs text-gray-300 font-light tracking-wider">
              {slide.artisan}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4">
            <div className="flex gap-2 mr-4">
              {lookbookSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 transition-all rounded-full ${
                    idx === currentIndex ? 'w-8 bg-luxury-gold' : 'w-2 bg-white/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md text-white flex items-center justify-center hover:bg-luxury-gold hover:text-black transition-colors"
              aria-label="Previous look"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
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
