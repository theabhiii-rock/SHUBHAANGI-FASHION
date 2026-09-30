import React from 'react';
import { FiSliders, FiChevronDown } from 'react-icons/fi';

export default function OccasionFilter({
  activeTab,
  onSelectTab,
  totalCount,
  sortBy,
  onSortChange,
  categoryCounts = {}
}) {
  const tabs = [
    { id: 'DRESS', label: 'Bridal Lehengas & Sarees', icon: '✦' },
    { id: 'JEWELLERY', label: 'Royal Jewellery', icon: '💎' },
    { id: 'MAKEUP', label: 'Atelier Makeup Packages', icon: '✨' },
    { id: 'ALL', label: 'All Collections', icon: '❖' },
  ];

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-5 border-b border-gray-200/80 pb-6">
      {/* Luxury Button Pills Filter Bar */}
      <div className="flex gap-2.5 sm:gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar py-1 items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = categoryCounts[tab.id];

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group relative inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-[11.5px] uppercase tracking-[0.16em] font-bold whitespace-nowrap transition-all duration-200 select-none cursor-pointer ${
                isActive
                  ? 'bg-black text-white border border-luxury-gold shadow-[0_4px_18px_rgba(200,169,81,0.3)] ring-1 ring-luxury-gold/40 scale-[1.02]'
                  : 'bg-white hover:bg-gray-50 text-gray-700 hover:text-black border border-gray-200/90 hover:border-gray-400 shadow-xs'
              }`}
            >
              {/* Active Golden Pulsing Accent Dot */}
              {isActive ? (
                <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold shadow-[0_0_8px_#c8a951] animate-pulse shrink-0" />
              ) : (
                <span className="text-[10px] text-gray-400 group-hover:text-luxury-gold transition-colors shrink-0">
                  {tab.icon}
                </span>
              )}

              <span>{tab.label}</span>

              {/* Dynamic Piece Count Badge */}
              {typeof count === 'number' && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold transition-colors ml-0.5 ${
                    isActive
                      ? 'bg-luxury-gold text-black shadow-xs'
                      : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-black'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sort & Count Controls */}
      <div className="flex items-center justify-between w-full lg:w-auto gap-3.5 shrink-0">
        <div className="relative inline-flex items-center">
          <FiSliders className="absolute left-3.5 text-gray-400 pointer-events-none" size={13} />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-white border border-gray-200 hover:border-black text-gray-800 py-2.5 pl-9 pr-8 rounded-full text-xs uppercase tracking-wider focus:outline-none focus:border-luxury-gold shadow-xs cursor-pointer font-semibold transition-all"
          >
            <option value="FEATURED">Sort: Featured</option>
            <option value="PRICE_LOW">Price: Low to High</option>
            <option value="PRICE_HIGH">Price: High to Low</option>
            <option value="RENTALS_ONLY">Rentals Only</option>
          </select>
          <FiChevronDown className="absolute right-3 text-gray-400 pointer-events-none" size={13} />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-zinc-900 text-white text-[11px] font-mono tracking-widest uppercase border border-luxury-gold/30 shadow-xs shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-luxury-gold font-bold">{totalCount}</span>
          <span className="text-gray-400 text-[10px]">PIECES</span>
        </div>
      </div>
    </div>
  );
}
