import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, FiCalendar, FiCheck, FiMessageCircle, 
  FiCamera, FiVideo, FiMapPin, FiStar, FiPlay 
} from 'react-icons/fi';

const SERVICE_TABS = [
  { id: 'PREWEDDING', label: 'Pre-Wedding Shoots', icon: '📸' },
  { id: 'EVENTS', label: 'Upcoming Events', icon: '🎪' },
  { id: 'PHOTOSHOOT', label: 'Photoshoots', icon: '📷' },
  { id: 'PORTFOLIO', label: 'Portfolio Shoots', icon: '🌟' },
  { id: 'BTS_VIDEOS', label: 'BTS Videos', icon: '🎬' },
  { id: 'MAKEUP', label: 'Makeup Packages', icon: '💄' },
  { id: 'PRE_BRIDAL', label: 'Pre-Bridals', icon: '👰' },
];

export default function StudioServiceModal({
  isOpen,
  onClose,
  initialCategory = 'PREWEDDING',
  services = []
}) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  if (!isOpen) return null;

  const currentTab = SERVICE_TABS.find(t => t.id === activeCategory) || SERVICE_TABS[0];
  const items = services.filter(s => s.type === activeCategory && s.isActive !== false);

  const handleInquireWhatsApp = (item) => {
    const text = `*SHUBHAANGI — Luxury Bridal Atelier*\n\nNamaste! I would like to inquire about:\n👑 *${item.title}*\n• Category: ${item.categoryLabel || currentTab.label}\n• Price / Details: ${item.price || item.date || 'Consultation'}\n\nPlease share booking dates and further details. Thank you!`;
    const url = `https://wa.me/916397799514?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25 }}
          className="bg-white max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden relative border border-luxury-gold/30 flex flex-col max-h-[92vh] my-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-zinc-950 via-[#141414] to-zinc-950 text-white p-5 sm:p-6 border-b border-luxury-gold/40 relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <FiX size={22} />
            </button>

            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-luxury-gold/20 text-luxury-gold rounded-xl border border-luxury-gold/40 text-xl shrink-0">
                {currentTab.icon}
              </span>
              <div>
                <span className="text-[10px] tracking-[0.28em] uppercase text-luxury-gold font-bold block">
                  Studio Experiences & Services
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                  {currentTab.label}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Bespoke bridal styling, photography & couture sessions at Shubhaangi Delhi Atelier
                </p>
              </div>
            </div>

            {/* Horizontal Category Switcher */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pt-4 mt-2 border-t border-white/10">
              {SERVICE_TABS.map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-luxury-gold text-black shadow-md font-bold'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body Content / Service Cards Grid */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-zinc-50 space-y-5">
            {items.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200 p-8">
                <span className="text-4xl block mb-2">{currentTab.icon}</span>
                <h3 className="text-base font-serif font-bold text-gray-900">
                  New {currentTab.label} Coming Soon!
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-4">
                  We are currently scheduling fresh dates and bespoke packages. You can reach out directly to our lead designer on WhatsApp.
                </p>
                <button
                  onClick={() => handleInquireWhatsApp({ title: currentTab.label })}
                  className="px-5 py-2.5 bg-black text-luxury-gold hover:bg-luxury-gold hover:text-black font-bold uppercase tracking-wider text-xs rounded-full transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <FiMessageCircle size={14} />
                  <span>Inquire on WhatsApp</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-gray-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:border-luxury-gold/60 hover:shadow-md transition-all group"
                  >
                    {/* Image Header with Badge */}
                    <div className="relative aspect-[16/10] w-full bg-zinc-950 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

                      {item.badge && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/80 text-luxury-gold border border-luxury-gold/40 shadow-sm backdrop-blur-xs">
                          ★ {item.badge}
                        </span>
                      )}

                      {/* Price / Date Banner overlay */}
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                        <span className="text-white text-xs font-semibold drop-shadow-md truncate pr-2">
                          {item.subtitle}
                        </span>
                        {item.price && (
                          <span className="px-2.5 py-1 rounded-md bg-luxury-gold text-black font-mono font-bold text-xs shadow-md shrink-0">
                            {item.price}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        {item.date && (
                          <div className="inline-flex items-center gap-1.5 text-xs text-amber-800 font-bold mb-1 bg-amber-50 px-2 py-0.5 rounded">
                            <FiCalendar size={12} />
                            <span>{item.date}</span>
                          </div>
                        )}
                        <h3 className="text-base font-serif font-bold text-gray-900 group-hover:text-amber-900 transition-colors leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Feature Highlights */}
                      {item.features && item.features.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-gray-100">
                          {item.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-2 text-[11px] text-gray-700">
                              <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 text-[10px] font-bold">
                                ✓
                              </span>
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action CTA */}
                      <div className="pt-2">
                        {item.type === 'BTS_VIDEOS' ? (
                          <button
                            onClick={() => handleInquireWhatsApp(item)}
                            className="w-full py-2.5 bg-black hover:bg-luxury-gold text-white hover:text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                          >
                            <FiPlay size={14} className="fill-current" />
                            <span>Watch Reel & Inquire</span>
                          </button>
                        ) : item.type === 'EVENTS' ? (
                          <button
                            onClick={() => handleInquireWhatsApp(item)}
                            className="w-full py-2.5 bg-black hover:bg-luxury-gold text-white hover:text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                          >
                            <FiStar size={14} />
                            <span>RSVP for VIP Pass</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleInquireWhatsApp(item)}
                            className="w-full py-2.5 bg-black hover:bg-luxury-gold text-white hover:text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                          >
                            <FiMessageCircle size={14} />
                            <span>Book / Inquire on WhatsApp</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3.5 bg-gray-100 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-2 shrink-0">
            <span className="text-[11px] flex items-center gap-1.5">
              <FiMapPin size={12} className="text-luxury-gold shrink-0" />
              <span>Studio: B-125, 1st Floor, Laxmi Nagar, Delhi (Near V3S Mall)</span>
            </span>
            <span className="text-[11px] font-semibold text-gray-800">
              Direct Designer Line: +91 6397799514
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
