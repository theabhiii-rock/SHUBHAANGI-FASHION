import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, FiCheck, FiShield, FiCalendar, FiClock, 
  FiShoppingBag, FiMessageCircle, FiHeart, 
  FiChevronLeft, FiChevronRight, FiImage 
} from 'react-icons/fi';

export default function ProductDetailModal({ product, isOpen, onClose, onAddToCart, isWishlisted, onToggleWishlist }) {
  // Always declare all hooks at the very top (Rules of Hooks)
  const isRentalSupported = Boolean(product?.isRentalAvailable && product?.rentPrice3Days);
  const [selectedMode, setSelectedMode] = useState(isRentalSupported ? 'RENT' : 'BUY');
  const [rentalDuration, setRentalDuration] = useState('3_DAYS'); // '3_DAYS' | '7_DAYS'
  const [selectedSize, setSelectedSize] = useState('FREE SIZE');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [prevProductId, setPrevProductId] = useState(product?.id);

  if (product && product.id !== prevProductId) {
    setPrevProductId(product.id);
    const canRent = Boolean(product.isRentalAvailable && product.rentPrice3Days);
    setSelectedMode(canRent ? 'RENT' : 'BUY');
    setRentalDuration('3_DAYS');
    setSelectedSize('FREE SIZE');
    setActiveImgIndex(0);
  }

  if (!product || !isOpen) return null;

  // Price calculations
  const rentalPrice = rentalDuration === '3_DAYS' ? product.rentPrice3Days : product.rentPrice7Days;
  const activePrice = selectedMode === 'RENT' ? (rentalPrice || 0) : (product.buyPrice || 0);
  const securityDeposit = selectedMode === 'RENT' ? (product.deposit || 0) : 0;
  const totalPayable = activePrice + securityDeposit;

  const handleAdd = () => {
    const cartItem = {
      ...product,
      cartItemId: `${product.id}-${selectedMode}-${selectedMode === 'RENT' ? rentalDuration : 'buy'}-${selectedSize}-${Date.now()}`,
      orderMode: selectedMode,
      duration: selectedMode === 'RENT' ? (rentalDuration === '3_DAYS' ? '3 Days' : '7 Days') : 'Permanent Purchase',
      selectedSize,
      itemPrice: activePrice,
      securityDeposit,
      totalItemPrice: totalPayable
    };

    onAddToCart(cartItem);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 500);
  };

  const getFullImageUrl = (img) => {
    if (!img) return '';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${img.startsWith('/') ? '' : '/'}${img}`;
    }
    return img;
  };

  const galleryImages = (product.images && product.images.length > 0)
    ? product.images
    : [product.img].filter(Boolean);
  const currentImage = galleryImages[activeImgIndex] || product.img || '';

  const handlePrevImage = (e) => {
    e?.stopPropagation();
    setActiveImgIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e?.stopPropagation();
    setActiveImgIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleDeepakFittingInquiry = () => {
    const fullImg = getFullImageUrl(currentImage);
    const modeText = selectedMode === 'RENT' 
      ? `RENTAL (${rentalDuration === '3_DAYS' ? '3 Days' : '7 Days'})` 
      : 'PURCHASE (Buy to Own)';

    let fitMsg = `✨ *CUSTOM FITTING COMMISSION — SHUBHAANGI COUTURE* ✨\n`;
    fitMsg += `👤 *Designer:* Deepak Kumar (Lead Designer)\n\n`;
    fitMsg += `👗 *Dress / Outfit:* ${product.name}\n`;
    if (product.subCategory || product.category) {
      fitMsg += `🏷️ *Category:* ${product.subCategory || product.category}\n`;
    }
    if (product.color) {
      fitMsg += `🎨 *Color:* ${product.color}\n`;
    }
    if (product.fabric) {
      fitMsg += `🧵 *Fabric & Needlework:* ${product.fabric}\n`;
    }
    fitMsg += `📏 *Size:* FREE SIZE (Custom Bespoke Alteration Requested)\n`;
    fitMsg += `💰 *Option:* ${modeText} — ₹${activePrice.toLocaleString('en-IN')}\n\n`;
    if (fullImg) {
      fitMsg += `📸 *Dress Photo Reference (Click to View):*\n${fullImg}\n`;
      if (galleryImages.length > 1) {
        fitMsg += `🖼️ *Lookbook Angle:* Photo ${activeImgIndex + 1} of ${galleryImages.length}\n\n`;
      } else {
        fitMsg += `\n`;
      }
    }
    fitMsg += `✂️ *Client Message:* "Hello Deepak Sir! Mujhe is dress ka custom fitting / alteration karana hai. Kripya mujhe measurements share karne ka tareeka aur fitting schedule guide karein."`;

    window.open(`https://wa.me/916397799514?text=${encodeURIComponent(fitMsg)}`, '_blank');
  };

  const handleWhatsAppQuickInquiry = () => {
    const fullImg = getFullImageUrl(currentImage);
    const modeText = selectedMode === 'RENT' 
      ? `RENT (${rentalDuration === '3_DAYS' ? '3 Days' : '7 Days'}, Size: FREE SIZE)`
      : `BUY (Size: FREE SIZE)`;
    
    let msg = `✨ *BRIDAL INQUIRY — SHUBHAANGI STUDIO* ✨\n\n`;
    msg += `👗 *Dress / Outfit:* ${product.name}\n`;
    if (product.subCategory || product.category) {
      msg += `🏷️ *Category:* ${product.subCategory || product.category}\n`;
    }
    if (product.color) {
      msg += `🎨 *Color:* ${product.color}\n`;
    }
    if (product.fabric) {
      msg += `🧵 *Fabric:* ${product.fabric}\n`;
    }
    msg += `✨ *Mode:* ${modeText}\n`;
    msg += `💰 *Price:* ₹${activePrice.toLocaleString('en-IN')}${selectedMode === 'RENT' ? ` + ₹${securityDeposit.toLocaleString('en-IN')} (Refundable Deposit)` : ''}\n\n`;
    if (fullImg) {
      msg += `📸 *Dress Photo Reference:*\n${fullImg}\n`;
      if (galleryImages.length > 1) {
        msg += `🖼️ *Angle:* Photo ${activeImgIndex + 1} of ${galleryImages.length}\n\n`;
      } else {
        msg += `\n`;
      }
    }
    msg += `Hello Deepak Sir & Shubhaangi Team! I would like to discuss custom fitting / alterations and confirm bridal trial slots.`;

    window.open(`https://wa.me/916397799514?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal Window: Fixed height on desktop with internal scrolling only on the right panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-5xl bg-white max-h-[92vh] md:h-[88vh] overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row rounded-sm"
        >
          {/* Top Actions: Wishlist & Close buttons */}
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
            {onToggleWishlist && (
              <button
                onClick={() => onToggleWishlist(product.id)}
                className="p-2 bg-white/80 hover:bg-white rounded-full transition-colors shadow-sm text-gray-700"
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <FiHeart size={18} className={isWishlisted ? 'fill-rose-500 text-rose-500' : ''} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 bg-white/80 hover:bg-black hover:text-white rounded-full transition-colors shadow-sm"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Left Column: Fixed / Sticky Multi-Photo Model Gallery */}
          <div className="w-full md:w-1/2 h-[380px] sm:h-[450px] md:h-full relative bg-zinc-950 flex flex-col justify-between shrink-0 overflow-hidden select-none">
            {/* Main Active Image Viewport */}
            <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden bg-zinc-900 group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={currentImage}
                  alt={`${product.name} - View ${activeImgIndex + 1}`}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="w-full h-full object-cover object-top"
                />
              </AnimatePresence>

              {/* Top Left Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
                <span className="bg-luxury-dark/90 backdrop-blur text-white text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 font-medium shadow-md">
                  {product.category}
                </span>
                {isRentalSupported && (
                  <span className="bg-luxury-gold text-white text-[10px] tracking-[0.2em] uppercase px-3 py-1 font-semibold flex items-center gap-1.5 shadow-md">
                    <FiClock size={12} /> Available for Rent
                  </span>
                )}
              </div>

              {/* Photo Counter Badge */}
              {galleryImages.length > 1 && (
                <div className="absolute top-4 right-4 z-10 bg-black/75 backdrop-blur text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-white/10">
                  <FiImage size={11} className="text-luxury-gold" />
                  <span>{activeImgIndex + 1} / {galleryImages.length} Photos</span>
                </div>
              )}

              {/* Prev / Next Navigation Arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    aria-label="Previous Photo"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/20 hover:scale-110 shadow-lg"
                  >
                    <FiChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Next Photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/20 hover:scale-110 shadow-lg"
                  >
                    <FiChevronRight size={22} />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Horizontal Thumbnail Strip (Click to Switch Photo) */}
            {galleryImages.length > 1 && (
              <div className="shrink-0 bg-black/95 border-t border-white/10 p-2.5 px-3 flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-700">
                <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-semibold shrink-0 mr-1 hidden sm:inline">
                  Angles:
                </span>
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImgIndex(idx);
                    }}
                    className={`relative w-12 h-14 rounded-sm overflow-hidden shrink-0 transition-all border-2 ${
                      activeImgIndex === idx
                        ? 'border-luxury-gold ring-2 ring-luxury-gold/50 scale-105 opacity-100 shadow-md'
                        : 'border-transparent opacity-60 hover:opacity-90'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {activeImgIndex === idx && (
                      <div className="absolute bottom-0 inset-x-0 bg-luxury-gold h-1"></div>
                    )}
                  </button>
                ))}
                <span className="text-[10px] text-zinc-400 ml-auto shrink-0 pl-2">
                  Tap to switch
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Independent Scrolling Customizer & Cart Actions */}
          <div className="w-full md:w-1/2 h-auto md:h-full p-6 md:p-8 flex flex-col justify-between overflow-y-auto overscroll-contain">
            <div>
              {/* Header */}
              <div className="border-b border-gray-100 pb-4 mb-5">
                <span className="text-[10px] tracking-[0.3em] uppercase text-luxury-gold font-medium block mb-1">
                  SHUBHAANGI COUTURE
                </span>
                <h2 className="text-2xl md:text-3xl font-serif text-black leading-snug mb-2">
                  {product.name}
                </h2>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  {product.description}
                </p>
                {product.fabric && (
                  <p className="text-[11px] text-gray-400 mt-2">
                    <span className="font-medium text-gray-700">Fabric & Craft:</span> {product.fabric}
                  </p>
                )}
              </div>

              {/* RENT vs BUY Option Selector */}
              {isRentalSupported ? (
                <div className="mb-6">
                  <label className="text-[10px] tracking-[0.25em] text-gray-400 uppercase font-semibold block mb-2.5">
                    Select Acquisition Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Rent Button */}
                    <button
                      onClick={() => setSelectedMode('RENT')}
                      className={`p-3.5 text-left border transition-all relative ${
                        selectedMode === 'RENT'
                          ? 'border-black bg-black text-white shadow-md'
                          : 'border-gray-200 hover:border-gray-400 text-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold tracking-wider uppercase">Rent Outfit</span>
                        {selectedMode === 'RENT' && <FiCheck className="text-luxury-gold" size={16} />}
                      </div>
                      <span className="text-xs font-serif text-luxury-gold font-bold">
                        From ₹{product.rentPrice3Days?.toLocaleString('en-IN')}
                      </span>
                      <p className={`text-[9px] mt-1 ${selectedMode === 'RENT' ? 'text-gray-300' : 'text-gray-400'}`}>
                        For wedding events & shoots
                      </p>
                    </button>

                    {/* Buy Button */}
                    <button
                      onClick={() => setSelectedMode('BUY')}
                      className={`p-3.5 text-left border transition-all relative ${
                        selectedMode === 'BUY'
                          ? 'border-black bg-black text-white shadow-md'
                          : 'border-gray-200 hover:border-gray-400 text-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold tracking-wider uppercase">Buy to Own</span>
                        {selectedMode === 'BUY' && <FiCheck className="text-luxury-gold" size={16} />}
                      </div>
                      <span className="text-xs font-serif text-luxury-gold font-bold">
                        ₹{product.buyPrice?.toLocaleString('en-IN')}
                      </span>
                      <p className={`text-[9px] mt-1 ${selectedMode === 'BUY' ? 'text-gray-300' : 'text-gray-400'}`}>
                        Permanent bespoke couture
                      </p>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-5 bg-amber-50/70 border border-amber-200/60 p-3 text-xs text-amber-800">
                  ✨ <strong>Service / Studio Experience:</strong> Direct booking only.
                </div>
              )}

              {/* Rental Duration Options (Only if RENT is active) */}
              {selectedMode === 'RENT' && (
                <div className="mb-5 bg-gray-50 p-4 border border-gray-100 rounded-sm">
                  <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium mb-3">
                    <FiCalendar className="text-luxury-gold" />
                    <span>Choose Rental Duration:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => setRentalDuration('3_DAYS')}
                      className={`py-2 px-3 text-xs border text-center transition-all ${
                        rentalDuration === '3_DAYS'
                          ? 'border-black bg-white font-semibold text-black shadow-sm ring-1 ring-black'
                          : 'border-gray-200 bg-gray-100 text-gray-600 hover:bg-white'
                      }`}
                    >
                      3 Days (Event Special)
                      <span className="block text-[11px] text-luxury-gold font-bold mt-0.5">
                        ₹{product.rentPrice3Days?.toLocaleString('en-IN')}
                      </span>
                    </button>

                    <button
                      onClick={() => setRentalDuration('7_DAYS')}
                      className={`py-2 px-3 text-xs border text-center transition-all ${
                        rentalDuration === '7_DAYS'
                          ? 'border-black bg-white font-semibold text-black shadow-sm ring-1 ring-black'
                          : 'border-gray-200 bg-gray-100 text-gray-600 hover:bg-white'
                      }`}
                    >
                      7 Days (Full Wedding Week)
                      <span className="block text-[11px] text-luxury-gold font-bold mt-0.5">
                        ₹{product.rentPrice7Days?.toLocaleString('en-IN')}
                      </span>
                    </button>
                  </div>

                  {/* Security Deposit Note */}
                  <div className="mt-3 flex items-start gap-2 text-[10px] text-gray-500 bg-white p-2.5 border border-gray-200/70">
                    <FiShield className="text-luxury-gold mt-0.5 flex-shrink-0" size={14} />
                    <span>
                      Refundable Security Deposit: <strong className="text-gray-800">₹{securityDeposit.toLocaleString('en-IN')}</strong>. 
                      100% refunded immediately after garment returns in safe condition.
                    </span>
                  </div>
                </div>
              )}

              {/* Size & Custom Fitting Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] tracking-[0.25em] text-gray-400 uppercase font-semibold">
                    Garment Size & Fit
                  </label>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-full">
                    <FiCheck size={10} className="text-emerald-600" />
                    Bespoke Alteration Available
                  </span>
                </div>

                {/* Free Size Highlight Card */}
                <div className="p-3.5 bg-luxury-cream/40 border border-amber-200/70 rounded-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1.5 bg-black text-white text-xs tracking-widest font-semibold uppercase shadow-sm">
                        FREE SIZE
                      </span>
                      <span className="text-xs text-gray-800 font-medium">
                        Standard Luxury Silhouette (4" Inner Margins)
                      </span>
                    </div>
                    <span className="text-[11px] text-luxury-gold font-serif font-semibold hidden sm:inline">
                      Fits Bust 32" – 42"
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">
                    All our boutique bridal lehengas, gowns & couture dresses are crafted in universal Free Size with generous inner margins for seamless drape and comfort.
                  </p>
                </div>

                {/* Custom Fitting with Designer Deepak Kumar Card */}
                <div className="mt-3 p-3.5 bg-gradient-to-r from-amber-50/80 via-white to-rose-50/50 border border-amber-200/90 rounded-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-black text-luxury-gold flex items-center justify-center font-serif text-xs font-bold flex-shrink-0 shadow-sm border border-luxury-gold/40">
                        DK
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-gray-900">
                            Custom Fitting with Designer Deepak Kumar
                          </span>
                          <span className="px-1.5 py-0.5 text-[9px] bg-luxury-gold/20 text-yellow-900 font-bold uppercase tracking-wider rounded">
                            Lead Designer
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                          Need custom alterations tailored to your exact measurements? Connect directly with Deepak sir on WhatsApp — our studio master artisans will alter and deliver your perfect fit!
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleDeepakFittingInquiry}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#25D366] hover:bg-[#1eb855] text-white text-[11px] font-medium tracking-wider uppercase rounded-sm transition-all shadow-sm hover:shadow flex-shrink-0"
                    >
                      <FiMessageCircle size={14} />
                      <span>WhatsApp Deepak Sir</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Breakdown Preview */}
              <div className="bg-gray-50 p-3.5 mb-6 border border-gray-100 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block">
                    {selectedMode === 'RENT' ? 'Rental Fee + Security Deposit' : 'Outright Purchase Price'}
                  </span>
                  <div className="text-xl font-serif font-semibold text-black mt-0.5">
                    ₹{totalPayable.toLocaleString('en-IN')}
                    {selectedMode === 'RENT' && (
                      <span className="text-xs font-sans text-gray-500 font-normal ml-2">
                        (Fee: ₹{activePrice.toLocaleString('en-IN')} + Dep: ₹{securityDeposit.toLocaleString('en-IN')})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAdd}
                className="flex-1 bg-black text-white py-4 px-6 text-xs tracking-[0.2em] uppercase font-medium hover:bg-luxury-gold transition-colors flex items-center justify-center gap-2"
              >
                <FiShoppingBag size={16} />
                {addedAnimation ? 'Added to Bag! ✓' : 'Add to Shopping Bag'}
              </button>

              <button
                onClick={handleWhatsAppQuickInquiry}
                className="bg-[#25D366] text-white py-4 px-6 text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#1eb855] transition-colors flex items-center justify-center gap-2"
                title="Instant WhatsApp inquiry for fitting & availability"
              >
                <FiMessageCircle size={17} />
                WhatsApp Fit Inquiry
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
