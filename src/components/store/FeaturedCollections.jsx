import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';

export default function FeaturedCollections({ onSelectCollection, fadeUp, staggerContainer }) {
  const collections = [
    {
      id: 'bridal-2026',
      title: 'Bridal Couture 2026',
      subtitle: 'The Headline Suite',
      category: 'DRESS',
      span: 'lg:col-span-7',
      height: 'h-[480px] lg:h-[560px]',
      img: '/images/shubhaangi-rani-pink-bridal-lehenga.jpg',
      description: 'Signature Rani Pink raw silk lehenga adorned with handcrafted antique zardozi and emerald choker set.'
    },
    {
      id: 'royal-heritage',
      title: 'Royal Heritage',
      subtitle: 'Antique Craftsmanship',
      category: 'DRESS',
      span: 'lg:col-span-5',
      height: 'h-[480px] lg:h-[560px]',
      img: '/images/shubhaangi-antique-gold-tissue.jpg',
      description: 'Zar-e-Khaas luminous antique gold tissue silk with chevron cutwork and kundan accents.'
    },
    {
      id: 'modern-bride',
      title: 'The Modern Bride',
      subtitle: 'Contemporary Elegance',
      category: 'DRESS',
      span: 'lg:col-span-4',
      height: 'h-[420px]',
      img: '/images/shubhaangi-mauve-shimmer-gown.jpg',
      description: 'Fairy-tale mauve shimmer gown with thousands of light-catching crystal sequins.'
    },
    {
      id: 'festive-edit',
      title: 'Festive & Sangeet Edit',
      subtitle: 'Celebration Ensembles',
      category: 'DRESS',
      span: 'lg:col-span-4',
      height: 'h-[420px]',
      img: '/images/shubhaangi-royal-plum-cape.jpg',
      description: 'Royal Baingani deep plum pleated skirt paired with an opulent sequinned jacket cape.'
    },
    {
      id: 'royal-jewellery',
      title: 'Polki & Kundan Suites',
      subtitle: 'Crown Jewels',
      category: 'JEWELLERY',
      span: 'lg:col-span-4',
      height: 'h-[420px]',
      img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
      description: 'Museum-grade bridal chokers and matha pattis encrusted with uncut gems.'
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
                <h3 className="text-2xl md:text-3xl font-serif text-white mb-2 group-hover:text-luxury-gold transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-300 line-clamp-2 max-w-md font-light mb-4">
                  {item.description}
                </p>
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
