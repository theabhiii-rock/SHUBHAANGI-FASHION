import React from 'react';
import { motion } from 'framer-motion';

export default function BrandStatement({ fadeUp }) {
  return (
    <section className="py-28 px-6 bg-luxury-cream text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#c8a951_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="max-w-4xl mx-auto relative z-10"
      >
        <span className="text-[10px] md:text-xs tracking-[0.5em] uppercase text-luxury-gold font-semibold block mb-6">
          The Shubhaangi Atelier Philosophy
        </span>
        
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight text-gray-950 font-normal leading-[1.15] mb-8">
          “WE CRAFT DREAMS <br className="hidden sm:inline" />
          <span className="italic font-serif text-luxury-gold font-light">WORN AS COUTURE.”</span>
        </h2>

        <div className="w-16 h-[1px] bg-luxury-gold mx-auto mb-8" />

        <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed max-w-2xl mx-auto tracking-wide mb-10">
          Every bride carries a story of transformation. At SHUBHAANGI, under the artistic direction of Ekta Jain & Deepak Kumar, we unite ancient Indian zardozi embroidery with modern architectural silhouettes — accessible through high-end bridal rental and custom bespoke commissions.
        </p>

        <div className="flex items-center justify-center gap-8 text-[11px] tracking-[0.25em] uppercase text-gray-700 font-medium">
          <span>Authentic Handloom</span>
          <span className="text-luxury-gold">•</span>
          <span>Zero Compromise Fit</span>
          <span className="text-luxury-gold">•</span>
          <span>Delhi Atelier Heritage</span>
        </div>
      </motion.div>
    </section>
  );
}
