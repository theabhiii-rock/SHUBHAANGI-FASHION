import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiCheckCircle } from 'react-icons/fi';
import { CUSTOMER_REVIEWS } from '../../data/store';

export default function CustomerReviewsSection({ fadeUp, staggerContainer }) {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto border-t border-gray-200">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="text-center mb-16"
      >
        <span className="text-[10px] tracking-[0.4em] uppercase text-luxury-gold font-semibold block mb-2">
          Real Bride Testimonials
        </span>
        <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-gray-900 mb-4">
          Worn & Cherished
        </h2>
        <div className="w-12 h-[1px] bg-luxury-gold mx-auto mb-4" />
        <p className="text-xs text-gray-500 max-w-md mx-auto font-light tracking-wide">
          Read candid experiences from brides across Delhi NCR and destination weddings who entrusted their bridal commissions to SHUBHAANGI.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {CUSTOMER_REVIEWS.map((review) => (
          <motion.div
            key={review.id}
            variants={fadeUp}
            className="p-8 bg-white border border-gray-200/80 rounded-sm shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative"
          >
            <div>
              <div className="flex items-center gap-1 text-luxury-gold mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <FiStar key={i} className="fill-luxury-gold" size={14} />
                ))}
              </div>

              <p className="text-xs text-gray-700 font-light leading-relaxed mb-6 italic font-serif">
                "{review.review}"
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              <img
                src={review.img}
                alt={review.clientName}
                className="w-12 h-12 rounded-full object-cover bg-gray-100 shrink-0 border border-luxury-gold/40"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-serif font-bold text-gray-900 truncate">
                    {review.clientName}
                  </h4>
                  <FiCheckCircle className="text-emerald-600 shrink-0" size={13} title="Verified Bride" />
                </div>
                <p className="text-[10px] text-gray-500 tracking-wider">
                  {review.location} • {review.weddingDate}
                </p>
                <p className="text-[10px] text-luxury-gold font-medium truncate mt-0.5">
                  {review.outfit}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
