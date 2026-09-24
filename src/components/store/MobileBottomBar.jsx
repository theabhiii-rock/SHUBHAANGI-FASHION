import React from 'react';
import { FiHome, FiGrid, FiHeart, FiShoppingBag, FiCalendar } from 'react-icons/fi';

export default function MobileBottomBar({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAppointment,
  onScrollToCatalog,
  onScrollToTop
}) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200 py-2.5 px-4 flex items-center justify-around shadow-2xl safe-area-bottom">
      <button
        onClick={onScrollToTop}
        className="flex flex-col items-center gap-1 text-gray-700 hover:text-luxury-gold transition-colors"
      >
        <FiHome size={20} />
        <span className="text-[9px] uppercase tracking-wider font-medium">Home</span>
      </button>

      <button
        onClick={onScrollToCatalog}
        className="flex flex-col items-center gap-1 text-gray-700 hover:text-luxury-gold transition-colors"
      >
        <FiGrid size={20} />
        <span className="text-[9px] uppercase tracking-wider font-medium">Catalog</span>
      </button>

      <button
        onClick={onOpenWishlist}
        className="flex flex-col items-center gap-1 text-gray-700 hover:text-luxury-gold transition-colors relative"
      >
        <div className="relative">
          <FiHeart size={20} />
          {wishlistCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-sans shadow-sm">
              {wishlistCount}
            </span>
          )}
        </div>
        <span className="text-[9px] uppercase tracking-wider font-medium">Wishlist</span>
      </button>

      <button
        onClick={onOpenCart}
        className="flex flex-col items-center gap-1 text-gray-700 hover:text-luxury-gold transition-colors relative"
      >
        <div className="relative">
          <FiShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-luxury-gold text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-sans shadow-sm animate-pulse">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[9px] uppercase tracking-wider font-medium">Bag</span>
      </button>

      <button
        onClick={onOpenAppointment}
        className="flex flex-col items-center gap-1 text-luxury-gold font-semibold"
      >
        <FiCalendar size={20} />
        <span className="text-[9px] uppercase tracking-wider">Fitting</span>
      </button>
    </div>
  );
}
