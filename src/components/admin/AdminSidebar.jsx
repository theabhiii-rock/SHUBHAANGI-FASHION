import React from 'react';
import { 
  FiGrid, FiRepeat, FiShoppingBag, FiTag, 
  FiEye, FiLogOut, FiPercent
} from 'react-icons/fi';

export default function AdminSidebar({ activeTab, onSelectTab, onBackToStore, onLogout, pendingReturnsCount }) {
  const menuItems = [
    { id: 'OVERVIEW', label: 'Executive Overview', icon: FiGrid },
    { 
      id: 'RENTALS', 
      label: 'Rental Returns Tracker', 
      icon: FiRepeat,
      badge: pendingReturnsCount > 0 ? pendingReturnsCount : null
    },
    { id: 'ORDERS', label: 'Client Bookings CRM', icon: FiShoppingBag },
    { id: 'INVENTORY', label: 'Inventory & Prices', icon: FiTag },
    { id: 'COUPONS', label: 'Offers & Discounts', icon: FiPercent },
  ];

  return (
    <aside className="w-64 max-w-full bg-[#0d0d0d] text-white flex flex-col justify-between border-r border-white/10 flex-shrink-0 min-h-screen md:h-screen md:sticky md:top-0 overflow-y-auto">
      <div>
        {/* Brand Header with Official Logo */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center gap-3">
          <img 
            src="/images/shubhaangi-official-logo.jpg" 
            alt="SHUBHAANGI Logo" 
            className="w-11 h-11 rounded-full object-cover border border-luxury-gold/60 shadow-md ring-1 ring-luxury-gold/30 shrink-0"
          />
          <div className="min-w-0">
            <span className="text-[9px] text-luxury-gold tracking-[0.22em] uppercase block font-semibold truncate">
              Studio Operating System
            </span>
            <h2 className="text-base font-serif tracking-widest text-white truncate">
              SHUBHAANGI
            </h2>
            <p className="text-[10px] text-gray-400 truncate">
              Ekta Jain & Deepak Kumar
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 sm:p-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-md text-xs tracking-wider uppercase font-medium transition-all ${
                  isActive
                    ? 'bg-luxury-gold text-black font-bold shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon size={16} className="shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ml-1">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/10 space-y-2 bg-black/40 mt-auto">
        <button
          onClick={onBackToStore}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-white/10 hover:bg-white hover:text-black text-white text-xs tracking-wider uppercase rounded-md transition-all font-medium"
        >
          <FiEye size={15} /> View Storefront
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-gray-400 hover:text-rose-400 text-xs tracking-wider uppercase transition-colors"
        >
          <FiLogOut size={14} /> Exit Studio Hub
        </button>

        {/* Tech Partner Branding & Link */}
        <div className="pt-3 text-center text-[10px] text-gray-500 border-t border-white/5">
          <p className="tracking-wider uppercase text-[9px] text-gray-400">Engineering & AI Partner</p>
          <a 
            href="https://rockautomations.in" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-luxury-gold hover:text-white font-semibold tracking-widest uppercase block mt-0.5 transition-colors"
          >
            Rock Automations ↗
          </a>
        </div>
      </div>
    </aside>
  );
}
