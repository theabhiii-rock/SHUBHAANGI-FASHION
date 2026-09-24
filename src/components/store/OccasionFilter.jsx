import React from 'react';
import { motion } from 'framer-motion';
import { FiSliders } from 'react-icons/fi';

export default function OccasionFilter({ activeTab, onSelectTab, totalCount, sortBy, onSortChange }) {
  const tabs = [
    { id: 'DRESS', label: 'Bridal Lehengas & Sarees' },
    { id: 'JEWELLERY', label: 'Royal Jewellery' },
    { id: 'MAKEUP', label: 'Atelier Makeup Packages' },
    { id: 'ALL', label: 'All Collections' },
  ];

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6 border-b border-gray-200 pb-4">
      {/* Horizontal Tabs */}
      <div className="flex gap-6 md:gap-8 w-full lg:w-auto overflow-x-auto no-scrollbar py-2">
        {tabs.map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => onSelectTab(tab.id)}
            className={`text-xs md:text-sm tracking-[0.2em] transition-all relative whitespace-nowrap pb-2 uppercase font-medium ${
              activeTab === tab.id 
                ? 'text-black font-semibold' 
                : 'text-gray-400 hover:text-black'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.span 
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 w-full h-[2px] bg-luxury-gold" 
              />
            )}
          </button>
        ))}
      </div>

      {/* Sort & Count Controls */}
      <div className="flex items-center justify-between w-full lg:w-auto gap-4">
        <div className="flex items-center gap-2 text-xs">
          <FiSliders className="text-gray-400" size={14} />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent border border-gray-200 text-gray-700 py-1.5 px-2.5 rounded text-[11px] uppercase tracking-wider focus:outline-none focus:border-black cursor-pointer font-medium"
          >
            <option value="FEATURED">Sort: Featured</option>
            <option value="PRICE_LOW">Price: Low to High</option>
            <option value="PRICE_HIGH">Price: High to Low</option>
            <option value="RENTALS_ONLY">Rentals Only</option>
          </select>
        </div>

        <div className="text-[11px] text-gray-500 tracking-[0.2em] uppercase shrink-0">
          <strong className="text-gray-900 font-semibold">{totalCount}</strong> Pieces
        </div>
      </div>
    </div>
  );
}
