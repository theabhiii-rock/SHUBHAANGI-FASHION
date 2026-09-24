import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiCheckCircle } from 'react-icons/fi';

export default function NewsletterSection({ fadeUp }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 3000);
  };

  return (
    <section className="py-24 px-6 bg-[#0a0a0a] text-white border-t border-white/10 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-luxury-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="max-w-2xl mx-auto text-center relative z-10"
      >
        <span className="text-[10px] tracking-[0.4em] uppercase text-luxury-gold font-semibold block mb-3">
          Private Invitation
        </span>
        
        <h2 className="text-3xl md:text-5xl font-serif tracking-tight text-white mb-4">
          Join the World of Shubhaangi
        </h2>
        
        <p className="text-xs md:text-sm text-gray-300 font-light max-w-lg mx-auto mb-8 leading-relaxed">
          Receive priority invitations to private bridal preview shows, secret sample releases, and bespoke styling masterclasses at our Laxmi Nagar atelier.
        </p>

        {subscribed ? (
          <div className="p-4 bg-white/10 border border-luxury-gold/40 text-luxury-gold rounded-sm inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase animate-fade-in">
            <FiCheckCircle size={18} />
            <span>Welcome to the SHUBHAANGI Circle. We look forward to adorning your special day.</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <FiMail className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 text-white placeholder-gray-400 text-xs focus:outline-none focus:border-luxury-gold transition-colors rounded-sm"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-white text-black hover:bg-luxury-gold hover:text-white transition-all text-xs tracking-[0.2em] uppercase font-semibold rounded-sm shrink-0 shadow-lg"
            >
              Subscribe
            </button>
          </form>
        )}

        <div className="mt-8 flex items-center justify-center gap-6 text-[10px] text-gray-500 tracking-widest uppercase">
          <span>Confidentiality Guaranteed</span>
          <span>•</span>
          <span>Zero Spam Policy</span>
          <span>•</span>
          <span>Bespoke Concierge</span>
        </div>
      </motion.div>
    </section>
  );
}
