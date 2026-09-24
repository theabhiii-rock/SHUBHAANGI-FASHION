import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

export default function ShopByCategory({ onSelectCategory, fadeUp, staggerContainer }) {
  const categories = [
    {
      id: 'lehengas',
      title: 'Bridal Lehengas',
      tabKey: 'DRESS',
      count: '38 Designs Available',
      img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'sarees',
      title: 'Bridal Sarees & Drapes',
      tabKey: 'DRESS',
      count: '24 Heirloom Weaves',
      img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'jewellery',
      title: 'Royal Polki Jewellery',
      tabKey: 'JEWELLERY',
      count: '16 Bridal Sets',
      img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'makeup',
      title: 'Bridal Makeup Services',
      tabKey: 'MAKEUP',
      count: 'By Senior Artists',
      img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'sherwanis',
      title: 'Groom Sherwanis',
      tabKey: 'DRESS',
      count: '18 Royal Outfits',
      img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'accessories',
      title: 'Dupattas & Accessories',
      tabKey: 'JEWELLERY',
      count: 'Potlis & Matha Pattis',
      img: 'https://images.unsplash.com/photo-1583391733958-d1531118c728?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="text-center mb-16"
      >
        <span className="text-[10px] tracking-[0.4em] uppercase text-luxury-gold font-semibold block mb-2">
          Atelier Taxonomy
        </span>
        <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-gray-900 mb-4">
          Shop by Category
        </h2>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mb-4" />
        <p className="text-xs text-gray-500 max-w-md mx-auto font-light tracking-wide">
          Select a category to view rental pricing, purchase options, and bridal trial availability.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            variants={fadeUp}
            onClick={() => onSelectCategory(cat.tabKey)}
            className="group cursor-pointer relative h-80 overflow-hidden rounded-sm shadow-sm bg-black"
          >
            <img
              src={cat.img}
              alt={cat.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-60 group-hover:scale-105 transition-all duration-[1.5s] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <span className="text-[10px] tracking-[0.3em] uppercase text-luxury-gold font-semibold mb-1">
                {cat.count}
              </span>
              <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-luxury-gold transition-colors">
                {cat.title}
              </h3>
              <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-white/90 group-hover:text-luxury-gold font-medium">
                <span>View Pieces</span>
                <FiArrowRight className="transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
