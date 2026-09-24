import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHeart, FiShoppingBag, FiTrash2, FiMessageCircle } from 'react-icons/fi';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistIds,
  products,
  onRemoveWishlist,
  onSelectProduct
}) {
  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-luxury-light">
                <div className="flex items-center gap-2">
                  <FiHeart className="text-rose-500 fill-rose-500" size={20} />
                  <h3 className="font-serif text-xl tracking-wider text-black uppercase">
                    Your Wishlist
                  </h3>
                  <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full font-sans">
                    {wishlistedProducts.length}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-700"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {wishlistedProducts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-16">
                    <FiHeart size={48} strokeWidth={1} className="mb-4 text-gray-300" />
                    <p className="font-serif text-lg text-gray-700 mb-2">Your Wishlist is Empty</p>
                    <p className="text-xs text-gray-400 max-w-xs mb-8">
                      Tap the heart icon on any bridal outfit or jewellery piece to save it for your wedding day fitting.
                    </p>
                    <button
                      onClick={onClose}
                      className="px-8 py-3 bg-black text-white text-xs tracking-widest uppercase hover:bg-luxury-gold transition-colors"
                    >
                      Explore Creations
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {wishlistedProducts.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-3 bg-gray-50 border border-gray-100 rounded-sm relative group"
                      >
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-20 h-24 object-cover rounded-sm flex-shrink-0 bg-gray-200 cursor-pointer"
                          onClick={() => {
                            onSelectProduct(item);
                            onClose();
                          }}
                        />
                        <div className="flex-1 min-w-0 pr-6">
                          <span className="text-[9px] uppercase tracking-wider text-luxury-gold font-bold block mb-1">
                            {item.subCategory || item.category}
                          </span>
                          <h4
                            onClick={() => {
                              onSelectProduct(item);
                              onClose();
                            }}
                            className="text-xs font-serif font-semibold text-gray-900 truncate hover:text-luxury-gold cursor-pointer"
                          >
                            {item.name}
                          </h4>

                          <div className="mt-1 text-xs">
                            {item.isRentalAvailable ? (
                              <span className="text-luxury-gold font-bold font-serif">
                                Rent: ₹{item.rentPrice3Days?.toLocaleString('en-IN')}
                                <span className="text-gray-400 font-sans font-normal ml-2">
                                  Buy: ₹{item.buyPrice?.toLocaleString('en-IN')}
                                </span>
                              </span>
                            ) : (
                              <span className="text-gray-900 font-bold font-serif">
                                ₹{item.buyPrice?.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-3">
                            <button
                              onClick={() => {
                                onSelectProduct(item);
                                onClose();
                              }}
                              className="px-3 py-1.5 bg-black text-white hover:bg-luxury-gold text-[10px] uppercase tracking-wider rounded font-medium flex items-center gap-1 transition-colors"
                            >
                              <FiShoppingBag size={11} /> Rent / Buy
                            </button>

                            <a
                              href={`https://wa.me/916397799514?text=${encodeURIComponent(
                                `✨ *WISHLIST INQUIRY — SHUBHAANGI STUDIO* ✨\n👤 To: Designer Deepak Kumar & Team\n\n👗 *Outfit:* ${item.name}\n📏 *Size:* FREE SIZE (Custom Alteration Available)\n💰 *Price:* ₹${(item.buyPrice || 0).toLocaleString('en-IN')}${item.rentPrice3Days ? ` | Rent: ₹${item.rentPrice3Days.toLocaleString('en-IN')}` : ''}\n\n📸 *Dress Photo Reference:*\n${item.img?.startsWith('http') ? item.img : (typeof window !== 'undefined' ? `${window.location.origin}${item.img?.startsWith('/') ? '' : '/'}${item.img}` : item.img)}\n\nHello Deepak Sir! I saved this piece in my wishlist and would like to ask about availability and custom fitting.`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 bg-[#25D366] text-white hover:bg-[#1eb855] rounded"
                              title="Ask on WhatsApp"
                            >
                              <FiMessageCircle size={13} />
                            </a>
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveWishlist(item.id)}
                          className="absolute top-3 right-3 text-gray-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove from wishlist"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
