import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiAward, FiScissors, FiHeart } from 'react-icons/fi';

export default function VideoStorySection({ fadeUp }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-24 px-6 bg-[#0a0a0a] text-white border-y border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Documentary Video Card */}
        <div className="lg:col-span-7 relative">
          <div className="relative aspect-video rounded-sm overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl group">
            {isPlaying ? (
              <video
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                controls
                autoPlay
                className="w-full h-full object-cover"
                onEnded={() => setIsPlaying(false)}
              />
            ) : (
              <>
                <img
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200"
                  alt="Atelier Craftsmanship"
                  className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="w-20 h-20 rounded-full bg-luxury-gold text-black flex items-center justify-center hover:scale-110 transition-transform shadow-2xl pl-1"
                    aria-label="Play documentary video"
                  >
                    <FiPlay size={28} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm p-3 rounded flex justify-between items-center text-xs">
                  <span className="text-gray-300 font-serif italic">"Every needle pass is an act of devotion."</span>
                  <span className="text-[10px] tracking-widest text-luxury-gold uppercase font-bold">Atelier Film • 4K</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Founder Narrative */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="text-[10px] tracking-[0.4em] uppercase text-luxury-gold font-semibold block mb-2">
              Delhi Atelier Heritage
            </span>
            <h2 className="text-3xl md:text-5xl font-serif tracking-tight text-white mb-4">
              The Shubhaangi Story
            </h2>
            <p className="text-xs md:text-sm text-gray-300 font-light leading-relaxed mb-6">
              Founded in Delhi by <strong>Ekta Jain</strong> and creatively spearheaded by master designer <strong>Deepak Kumar</strong>, SHUBHAANGI was conceived with a revolutionary vision: to make India’s most regal bridal couture accessible to every bride through seamless luxury rental and bespoke creation.
            </p>

            <div className="space-y-4 pt-2 border-t border-white/10">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-white/10 text-luxury-gold rounded-full shrink-0 mt-0.5">
                  <FiScissors size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-serif font-semibold text-white">Custom In-Studio Tailoring</h4>
                  <p className="text-xs text-gray-400 font-light">Every rental outfit is precision-altered to your exact measurements prior to your wedding day.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-white/10 text-luxury-gold rounded-full shrink-0 mt-0.5">
                  <FiAward size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-serif font-semibold text-white">100% Genuine Gold Zardozi</h4>
                  <p className="text-xs text-gray-400 font-light">Handcrafted by multi-generational karigars using genuine dabka, cut-dana, and sequins.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-white/10 text-luxury-gold rounded-full shrink-0 mt-0.5">
                  <FiHeart size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-serif font-semibold text-white">Transparent Escrow Security</h4>
                  <p className="text-xs text-gray-400 font-light">Zero deductions. Security deposits are transferred back the instant garments return.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
