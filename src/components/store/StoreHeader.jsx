import React from 'react';
import { 
  FiMenu as Menu, FiSearch as Search, 
  FiShoppingBag as ShoppingBag,
  FiHeart as Heart, FiPackage as Package, FiCalendar as Calendar
} from 'react-icons/fi';

export default function StoreHeader({
  scrolled,
  onOpenMenu,
  onOpenCart,
  onOpenSearch,
  onOpenWishlist,
  onOpenOrderTracker,
  onOpenAppointment,
  cartCount,
  wishlistCount,
  offerBanner
}) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 shadow-xl text-white transition-all duration-300">
      {/* Top Promotional Announcement Bar */}
      {offerBanner?.enabled && (
        <div className="bg-[#141414] text-luxury-gold text-[10.5px] py-1.5 px-4 text-center tracking-widest uppercase font-medium flex items-center justify-center gap-2 border-b border-luxury-gold/20">
          <span className="px-1.5 py-0.2 bg-luxury-gold/20 text-luxury-gold text-[9px] font-bold rounded uppercase tracking-wider shrink-0">
            {offerBanner.badge || 'OFFER'}
          </span>
          <span className="truncate max-w-xl text-gray-200 hidden sm:inline">
            {offerBanner.text}
          </span>
          <span className="truncate max-w-xs text-gray-200 sm:hidden">
            {offerBanner.text}
          </span>
          {offerBanner.couponCode && (
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(offerBanner.couponCode);
                }
                alert(`Voucher Code "${offerBanner.couponCode}" copied! Apply it in your shopping bag for discount.`);
              }}
              className="underline font-bold text-luxury-gold hover:text-white ml-1 cursor-pointer transition-colors shrink-0"
              title="Click to copy voucher code"
            >
              Use Code: {offerBanner.couponCode}
            </button>
          )}
        </div>
      )}

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between transition-all duration-300 ${
        scrolled ? 'py-2.5 sm:py-3' : 'py-3.5 sm:py-4'
      }`}>
        {/* Left: Menu & Quick Atelier Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenMenu} 
            className="p-2 -ml-2 text-white hover:text-luxury-gold transition-colors flex items-center gap-2 group"
            aria-label="Open luxury menu"
          >
            <Menu size={24} className="group-hover:scale-105 transition-transform" />
            <span className="hidden md:inline-block text-[11px] font-sans font-medium tracking-[0.2em] uppercase text-gray-300 group-hover:text-white">
              Menu
            </span>
          </button>

          {/* Book Trial Session Button */}
          <button
            onClick={onOpenAppointment}
            className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1 text-[10px] tracking-[0.2em] uppercase font-medium border border-white/20 text-gray-200 hover:border-luxury-gold hover:text-luxury-gold hover:bg-white/5 rounded-full transition-all"
          >
            <Calendar size={12} className="text-luxury-gold" />
            <span>Book Trial</span>
          </button>

          {/* Track Order Button */}
          <button
            onClick={onOpenOrderTracker}
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 text-[10px] tracking-[0.2em] uppercase text-gray-300 hover:text-white transition-colors"
          >
            <Package size={13} className="text-luxury-gold" />
            <span>Track Order</span>
          </button>
        </div>
        
        {/* Center: Brand Identity with Official Shubhaangi Crest & Clean Sans Typography */}
        <div 
          className="text-center flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group select-none" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img 
            src="/images/shubhaangi-official-logo.jpg" 
            alt="SHUBHAANGI Official Crest" 
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-luxury-gold/70 shadow-md ring-1 ring-luxury-gold/40 shrink-0 group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col items-start sm:items-center text-left sm:text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-sans font-semibold tracking-[0.22em] uppercase text-white leading-tight group-hover:text-luxury-gold transition-colors">
              Shubhaangi
            </h1>
            <span className="text-[7.5px] sm:text-[9px] md:text-[9.5px] font-sans font-normal tracking-[0.35em] uppercase mt-0.5 text-luxury-gold/90">
              The Ultimate Bride
            </span>
          </div>
        </div>

        {/* Right: Search, Wishlist & Shopping Bag */}
        <div className="flex items-center gap-1 sm:gap-2.5 text-white">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-gray-300 hover:text-luxury-gold transition-colors"
            title="Search garments, fabrics, jewellery"
            aria-label="Search catalog"
          >
            <Search size={21} />
          </button>

          {/* Wishlist */}
          <button
            onClick={onOpenWishlist}
            className="p-2 text-gray-300 hover:text-luxury-gold transition-colors relative"
            title="View Wishlist"
            aria-label="View wishlist"
          >
            <Heart size={21} className={wishlistCount > 0 ? "fill-rose-500 text-rose-500" : ""} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center font-sans">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag with dynamic item count */}
          <button 
            onClick={onOpenCart}
            className="p-2 text-white hover:text-luxury-gold transition-colors relative flex items-center"
            title="Open Shopping Bag"
            aria-label="View shopping bag"
          >
            <ShoppingBag size={22} />
            {cartCount > 0 ? (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-luxury-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-bounce font-sans">
                {cartCount}
              </span>
            ) : (
              <span className="absolute top-1 right-1 w-2 h-2 bg-luxury-gold rounded-full"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
