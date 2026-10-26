import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';

export default function FeaturedCollections({ onSelectCollection, fadeUp, staggerContainer }) {
  const collections = [
    {
      id: 'bridal-couture',
      title: 'Bridal Couture',
      subtitle: 'Haute Couture',
      category: 'BRIDAL_COUTURE',
      span: 'md:col-span-6 lg:col-span-7',
      height: 'h-[440px] lg:h-[520px]',
      img: '/images/shubhaangi-rani-pink-bridal-lehenga.jpg'
    },
    {
      id: 'groom-collection',
      title: 'Groom Collection',
      subtitle: "Men's Luxury",
      category: 'GROOM_COLLECTION',
      span: 'md:col-span-6 lg:col-span-5',
      height: 'h-[440px] lg:h-[520px]',
      img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 'modern-bride',
      title: 'The Modern Bride',
      subtitle: 'Contemporary',
      category: 'MODERN_BRIDE',
      span: 'md:col-span-6 lg:col-span-3',
      height: 'h-[380px] lg:h-[400px]',
      img: '/images/shubhaangi-mauve-shimmer-gown.jpg'
    },
    {
      id: 'festive-party',
      title: 'Festive & Party',
      subtitle: 'Celebration',
      category: 'FESTIVE_PARTY',
      span: 'md:col-span-6 lg:col-span-3',
      height: 'h-[380px] lg:h-[400px]',
      img: '/images/shubhaangi-royal-plum-cape.jpg'
    },
    {
      id: 'makeup-beauty',
      title: 'Makeup & Beauty',
      subtitle: 'Studio Artistry',
      category: 'MAKEUP_BEAUTY',
      span: 'md:col-span-6 lg:col-span-3',
      height: 'h-[380px] lg:h-[400px]',
      img: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 'jewellery-accessories',
      title: 'Jewellery & Accessories',
      subtitle: 'Fine Jewels',
      category: 'JEWELLERY_ACCESSORIES',
      span: 'md:col-span-6 lg:col-span-3',
      height: 'h-[380px] lg:h-[400px]',
      img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="text-center mb-16"
      >
        <span className="text-[10px] tracking-[0.4em] uppercase text-luxury-gold font-semibold block mb-2">
          Curated Editorial
        </span>
        <h2 className="text-4xl md:text-6xl font-serif tracking-tight text-gray-900 mb-4">
          The Collections
        </h2>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mb-4" />
        <p className="text-xs md:text-sm text-gray-500 max-w-xl mx-auto font-light tracking-wide">
          Each bespoke edition is conceptualized by Deepak Kumar and brought to life in our Laxmi Nagar atelier. Available for 3-day/7-day rental or bespoke commissioning.
        </p>
      </motion.div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {collections.map((item) => (
          <motion.div
            key={item.id}
            variants={fadeUp}
            onClick={() => onSelectCollection(item.category)}
            className={`${item.span} ${item.height} relative overflow-hidden group cursor-pointer rounded-sm shadow-sm bg-black`}
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-60 group-hover:scale-105 transition-all duration-[1.8s] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
              <div className="flex justify-between items-start">
                <span className="text-[9px] tracking-[0.3em] uppercase bg-white/15 backdrop-blur-md text-white px-3 py-1 font-semibold rounded-full">
                  {item.subtitle}
                </span>
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-luxury-gold group-hover:text-black transition-all duration-300">
                  <FiArrowUpRight size={18} />
                </div>
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-serif text-white mb-3 group-hover:text-luxury-gold transition-colors">
                  {item.title}
                </h3>
                <span className="text-[10px] tracking-[0.25em] uppercase text-luxury-gold font-semibold flex items-center gap-1">
                  Discover Collection →
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
