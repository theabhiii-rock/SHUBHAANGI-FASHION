import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, FiCalendar, FiCheck, FiMessageCircle, 
  FiCamera, FiVideo, FiMapPin, FiStar, FiPlay, FiChevronDown
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
  services = [],
  topics = []
}) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const activeTabsList = (topics && topics.length > 0) ? topics : SERVICE_TABS;

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  if (!isOpen) return null;

  const currentTab = activeTabsList.find(t => t.id === activeCategory) || activeTabsList[0];
  const items = services.filter(s => s.type === activeCategory && s.isActive !== false);

  const handleInquireWhatsApp = (item) => {
    const text = `*SHUBHAANGI — Luxury Bridal Atelier*\n\nNamaste! I would like to inquire about:\n👑 *${item.title}*\n• Category: ${item.categoryLabel || currentTab.label}\n• Price / Details: ${item.price || item.date || 'Consultation'}\n\nPlease share booking dates and further details. Thank you!`;
    const url = `https://wa.me/916397799514?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      <div 
        data-lenis-prevent
        className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-hidden select-none"
      >
        {/* Dark Blurred Backdrop — Click to Close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window Container */}
        <motion.div
          data-lenis-prevent
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative z-10 bg-white max-w-4xl w-full rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.65)] overflow-hidden border border-luxury-gold/50 flex flex-col max-h-[92vh] h-auto my-auto overscroll-contain select-text"
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-zinc-950 via-[#131313] to-zinc-950 text-white p-4 sm:p-5 border-b border-luxury-gold/40 relative shrink-0">
            {/* Prominent Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 text-gray-300 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-30 flex items-center justify-center shadow-md ring-1 ring-white/10"
              aria-label="Close modal"
              title="Close (Esc)"
            >
              <FiX size={20} />
            </button>

            <div className="flex items-center gap-3 pr-12">
              <span className="p-2 sm:p-2.5 bg-luxury-gold/20 text-luxury-gold rounded-xl border border-luxury-gold/40 text-lg sm:text-xl shrink-0 shadow-xs">
                {currentTab.icon}
              </span>
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-luxury-gold font-bold block truncate">
                  Studio Experiences & Services
                </span>
                <h2 className="text-lg sm:text-2xl font-serif font-bold text-white tracking-tight leading-tight truncate">
                  {currentTab.label}
                </h2>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate">
                  Bespoke bridal styling, photography & couture sessions at Shubhaangi Delhi Atelier
                </p>
              </div>
            </div>

            {/* Horizontal 7-Category Tab Switcher */}
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pt-3 mt-2.5 border-t border-white/10">
              {activeTabsList.map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? 'bg-luxury-gold text-black shadow-md font-bold ring-1 ring-luxury-gold/80'
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

          {/* Smooth Scrollable Body Content */}
          <div 
            data-lenis-prevent
            className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1 bg-[#fbfaf8] space-y-4"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {items.length === 0 ? (
              <div className="text-center py-14 bg-white rounded-xl border border-gray-200 p-8 shadow-xs">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-gray-200/90 shadow-xs hover:shadow-md hover:border-luxury-gold/60 transition-all overflow-hidden flex flex-col justify-between group"
                  >
                    {/* Top Image with Badge and Subtitle */}
                    <div className="relative h-44 sm:h-48 w-full bg-zinc-950 overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

                      {/* Badge */}
                      {item.badge && (
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/80 text-luxury-gold border border-luxury-gold/50 shadow-sm backdrop-blur-xs">
                          ★ {item.badge}
                        </span>
                      )}

                      {/* Price / Date Overlay */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex justify-between items-end gap-2">
                        <span className="text-white text-xs font-semibold drop-shadow-md truncate">
                          {item.subtitle}
                        </span>
                        {item.price && (
                          <span className="px-2.5 py-0.5 rounded-md bg-luxury-gold text-black font-mono font-bold text-xs shadow-md shrink-0">
                            {item.price}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        {item.date && (
                          <div className="inline-flex items-center gap-1.5 text-[11px] text-amber-800 font-bold mb-1.5 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
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

                      {/* Feature Inclusions */}
                      {item.features && item.features.length > 0 && (
                        <div className="space-y-1 pt-2 border-t border-gray-100">
                          {item.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-2 text-[11px] text-gray-700">
                              <span className="w-3.5 h-3.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 text-[9px] font-bold">
                                ✓
                              </span>
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* CTA WhatsApp Button */}
                      <div className="pt-2">
                        {item.type === 'BTS_VIDEOS' ? (
                          <button
                            onClick={() => handleInquireWhatsApp(item)}
                            className="w-full py-2.5 bg-black hover:bg-luxury-gold text-white hover:text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                          >
                            <FiPlay size={13} className="fill-current" />
                            <span>Watch Reel & Inquire</span>
                          </button>
                        ) : item.type === 'EVENTS' ? (
                          <button
                            onClick={() => handleInquireWhatsApp(item)}
                            className="w-full py-2.5 bg-black hover:bg-luxury-gold text-white hover:text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                          >
                            <FiStar size={13} />
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

          {/* Modal Bottom Footer */}
          <div className="p-3 sm:p-3.5 bg-gray-100 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-500 gap-1.5 shrink-0">
            <span className="flex items-center gap-1.5 text-center sm:text-left">
              <FiMapPin size={12} className="text-luxury-gold shrink-0" />
              <span>Studio: B-125, 1st Floor, Laxmi Nagar, Delhi (Near V3S Mall)</span>
            </span>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-800">
                Direct Designer Line: +91 6397799514
              </span>
              <button
                onClick={onClose}
                className="text-[10px] uppercase font-bold text-gray-600 hover:text-black hover:underline cursor-pointer ml-1"
              >
                Close ✕
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
