import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiClock } from 'react-icons/fi';

export default function SearchModal({ isOpen, onClose, products, onSelectProduct }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
      const q = query.toLowerCase().trim();
      if (!q) return matchesCategory;
      const matchesQuery =
        p.name.toLowerCase().includes(q) ||
        (p.fabric && p.fabric.toLowerCase().includes(q)) ||
        (p.color && p.color.toLowerCase().includes(q)) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [products, query, selectedCategory]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          className="relative w-full max-w-3xl bg-white rounded-sm shadow-2xl overflow-hidden z-10 border border-gray-200"
        >
          {/* Search Input Header */}
          <div className="p-4 md:p-6 border-b border-gray-200 flex items-center gap-3 bg-gray-50">
            <FiSearch className="text-gray-400 shrink-0" size={22} />
            <input
              type="text"
              autoFocus
              placeholder="Search by gown, fabric (Silk, Velvet), color, or jewellery..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm md:text-base outline-none placeholder-gray-400 font-sans text-gray-900"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-xs text-gray-400 hover:text-black uppercase tracking-wider"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="px-6 py-3 border-b border-gray-100 flex gap-2 overflow-x-auto text-xs font-medium">
            {['ALL', 'DRESS', 'JEWELLERY', 'MAKEUP'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full uppercase tracking-wider text-[10px] transition-colors ${
                  selectedCategory === cat
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'DRESS' ? 'Outfits' : cat}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-4 md:p-6 divide-y divide-gray-100">
            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <p className="font-serif text-base text-gray-600 mb-1">No bridal creations match your search.</p>
                <p className="text-xs">Try searching for "Silk", "Zardozi", "Lehenga", or "Choker".</p>
              </div>
            ) : (
              filteredProducts.map((p) => {
                const isRental = Boolean(p.isRentalAvailable && p.rentPrice3Days);
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProduct(p);
                      onClose();
                    }}
                    className="py-3 flex items-center justify-between gap-4 hover:bg-gray-50 px-2 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={p.img}
                        alt={p.name}
                        className="w-14 h-16 object-cover rounded-sm bg-gray-100 shrink-0"
                      />
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-semibold block">
                          {p.subCategory || p.category}
                        </span>
                        <h4 className="text-sm font-serif font-bold text-gray-900 group-hover:text-luxury-gold transition-colors">
                          {p.name}
                        </h4>
                        <p className="text-[11px] text-gray-400 font-light truncate max-w-xs md:max-w-md">
                          {p.fabric} • {p.color}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {isRental ? (
                        <>
                          <span className="text-[10px] text-gray-400 block">Rent from</span>
                          <span className="text-xs font-serif font-bold text-luxury-gold">
                            ₹{p.rentPrice3Days?.toLocaleString('en-IN')}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-serif font-bold text-gray-900">
                          ₹{p.buyPrice?.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
