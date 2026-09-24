import React from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiMessageCircle } from 'react-icons/fi';

export default function StudioTrialSection({ fadeUp, staggerContainer, onSelectCategory }) {
  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-40"
    >
      {/* Groom's Wardrobe Banner */}
      <motion.div 
        variants={fadeUp} 
        className="relative h-[420px] md:h-[500px] bg-black group cursor-pointer overflow-hidden rounded-sm"
        onClick={() => onSelectCategory('DRESS')}
      >
        <img 
          src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1000" 
          alt="Groom Outfits" 
          className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:scale-110 group-hover:opacity-45 transition-all duration-[2s] ease-out" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
          <span className="text-luxury-gold text-[10px] tracking-[0.4em] uppercase mb-2 font-medium">
            Royal Heritage
          </span>
          <h2 className="text-white text-3xl md:text-5xl font-serif tracking-widest uppercase mb-3 drop-shadow-md">
            Groom's Wardrobe
          </h2>
          <p className="text-xs text-gray-300 mb-6 max-w-xs font-light">
            Handcrafted royal sherwanis & bandhgalas available for 3-day rental & bespoke custom tailoring.
          </p>
          <span className="text-white text-xs tracking-[0.3em] uppercase border-b border-white/50 pb-1 group-hover:border-luxury-gold group-hover:text-luxury-gold transition-colors">
            Explore Collection →
          </span>
        </div>
      </motion.div>
      
      {/* Studio Trial Appointment Card */}
      <motion.div 
        variants={fadeUp} 
        className="relative h-[420px] md:h-[500px] bg-black group cursor-pointer overflow-hidden rounded-sm"
      >
        <img 
          src="https://images.unsplash.com/photo-1583391733958-d1531118c728?auto=format&fit=crop&q=80&w=1000" 
          alt="Delhi Atelier Fitting" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-40 transition-all duration-[2s] ease-out" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
          <div className="flex items-center gap-1.5 text-luxury-gold text-[10px] tracking-[0.3em] uppercase mb-2 font-medium">
            <FiMapPin /> Laxmi Nagar, Delhi
          </div>
          <h2 className="text-white text-3xl md:text-5xl font-serif tracking-widest uppercase mb-3 drop-shadow-md">
            Private Atelier Fitting
          </h2>
          <p className="text-xs text-gray-300 mb-6 max-w-xs font-light">
            Book a one-on-one bridal trial session with designer Deepak Kumar & owner Ekta Jain for custom sizing.
          </p>
          <a 
            href="https://wa.me/916397799514?text=Hello%20SHUBHAANGI%20Studio!%20✨%20I%20would%20like%20to%20schedule%20a%20private%20bridal%20trial%20appointment%20at%20your%20Laxmi%20Nagar%20studio."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#1eb855] text-white text-xs tracking-[0.2em] uppercase font-semibold transition-all shadow-lg rounded-sm"
          >
            <FiMessageCircle size={15} /> Book Studio Appointment
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
