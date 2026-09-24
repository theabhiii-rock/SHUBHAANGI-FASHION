import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';

export default function HorizontalScrollSection({ fadeUp }) {
  const scrollRef = useRef(null);

  const silhouettes = [
    {
      id: 1,
      title: 'The Crimson Kalidar',
      craft: '32-Kali Hand Pleating',
      fabric: 'Pure Mulberry Silk',
      quote: 'CRAFTED FOR HER',
      img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 2,
      title: 'The Golden Marigold',
      craft: 'Zari Dabka & Kasab',
      fabric: 'Tissue Silk & Chanderi',
      quote: 'EVERY STITCH TELLS A STORY',
      img: 'https://images.unsplash.com/photo-1583391733958-d1531118c728?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 3,
      title: 'The Royal Emerald Veil',
      craft: 'Mukaish Lattice & Pearls',
      fabric: 'Gilded Organza',
      quote: 'REGAL ARCHITECTURE',
      img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 4,
      title: 'The Moonlight Ivory',
      craft: 'Swarovski & Chikankari',
      fabric: 'Georgette & Net',
      quote: 'WEIGHTLESS LUXURY',
      img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 5,
      title: 'The Noor Velvet Sherwani',
      craft: 'Tilla Ari Threadwork',
      fabric: 'Royal Micro Velvet',
      quote: 'IMPERIAL STATURE',
      img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-[#0a0a0a] text-white overflow-hidden relative border-y border-white/10">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="max-w-7xl mx-auto px-6 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 text-luxury-gold text-xs uppercase tracking-[0.4em] font-semibold mb-2">
            <FiStar /> Signature Haute Couture
          </div>
          <h2 className="text-4xl md:text-6xl font-serif tracking-tight text-white">
            The New Silhouette
          </h2>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-luxury-gold hover:text-black hover:border-luxury-gold transition-all"
            aria-label="Scroll left"
          >
            <FiChevronLeft size={22} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-luxury-gold hover:text-black hover:border-luxury-gold transition-all"
            aria-label="Scroll right"
          >
            <FiChevronRight size={22} />
          </button>
        </div>
      </motion.div>

      {/* Horizontal Scroll Gallery */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-6 max-w-7xl mx-auto no-scrollbar scroll-smooth pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {silhouettes.map((item, index) => (
          <div
            key={item.id}
            className="w-[300px] md:w-[380px] flex-shrink-0 group cursor-pointer"
          >
            <div className="h-[480px] md:h-[560px] overflow-hidden relative rounded-sm bg-neutral-900 mb-4">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />

              <div className="absolute top-4 left-4">
                <span className="text-[9px] tracking-[0.3em] uppercase bg-black/70 backdrop-blur text-luxury-gold px-3 py-1 font-bold border border-luxury-gold/30">
                  Edition 0{index + 1}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] tracking-[0.35em] uppercase text-gray-300 font-medium block mb-1">
                  {item.quote}
                </span>
                <h3 className="text-xl md:text-2xl font-serif text-white group-hover:text-luxury-gold transition-colors">
                  {item.title}
                </h3>
                <div className="mt-3 pt-3 border-t border-white/20 flex justify-between text-[11px] text-gray-400">
                  <span>{item.craft}</span>
                  <span className="text-luxury-gold font-medium">{item.fabric}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
