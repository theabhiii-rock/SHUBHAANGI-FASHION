import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, FiTrash2, FiShoppingBag, FiMessageCircle, 
  FiShield, FiTag, FiTruck, FiMapPin, FiCheckCircle 
} from 'react-icons/fi';
import { saveOrders, getStoredOrders, validateCouponCode, getStoredCoupons } from '../data/store';

export default function CartDrawer({ isOpen, onClose, cartItems, onRemoveItem, onClearCart }) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [deliveryType, setDeliveryType] = useState('Studio Alteration & Pick-up (Delhi)');
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Calculations
  const subtotalFees = cartItems.reduce((acc, item) => acc + item.itemPrice, 0);
  const totalSecurityDeposit = cartItems.reduce((acc, item) => acc + item.securityDeposit, 0);
  
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const netGarmentFee = Math.max(0, subtotalFees - discountAmount);
  const grandTotal = netGarmentFee + totalSecurityDeposit;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const res = validateCouponCode(couponCode, subtotalFees);
    if (!res.valid) {
      setCouponError(res.message);
      setAppliedCoupon(null);
    } else {
      setAppliedCoupon(res);
      setCouponError('');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const processOrderCreation = React.useCallback(() => {
    const orderNumber = `SHB-${Date.now().toString().slice(-4)}`;
    const currentOrders = getStoredOrders();
    const newOrders = cartItems.map((item) => ({
      id: orderNumber,
      customerName: customerName.trim() || 'Valued Bridal Client',
      phone: customerPhone.trim() || '+91 63977 99514',
      date: eventDate.trim() || 'Immediate Trial',
      item: item.name,
      mode: item.orderMode,
      duration: item.duration,
      rentalDueDate: item.orderMode === 'RENT' ? '4 Days Post-Event' : null,
      amount: item.itemPrice,
      deposit: item.securityDeposit,
      deliveryType,
      discountApplied: discountAmount > 0 ? appliedCoupon?.coupon?.code : null,
      status: item.orderMode === 'RENT' ? 'ACTIVE_RENTAL' : 'COMPLETED',
      paymentStatus: 'PAID'
    }));

    saveOrders([...newOrders, ...currentOrders]);
    return { orderNumber, newOrders };
  }, [cartItems, customerName, customerPhone, eventDate, deliveryType, discountAmount, appliedCoupon]);

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;
    const { orderNumber } = processOrderCreation();

    let message = `✨ *NEW BRIDAL COMMISSION — SHUBHAANGI COUTURE* ✨\n`;
    message += `📋 *Booking Reference:* #${orderNumber}\n\n`;
    if (customerName) message += `👤 *Client Name:* ${customerName}\n`;
    if (customerPhone) message += `📞 *Contact Phone:* ${customerPhone}\n`;
    if (eventDate) message += `📅 *Wedding / Event Date:* ${eventDate}\n`;
    message += `🚚 *Fulfillment Preference:* ${deliveryType}\n`;
    message += `──────────────────────\n`;
    message += `🛍️ *SELECTED PIECES:*\n`;

    cartItems.forEach((item, index) => {
      const itemImgUrl = item.img?.startsWith('http') 
        ? item.img 
        : (typeof window !== 'undefined' ? `${window.location.origin}${item.img?.startsWith('/') ? '' : '/'}${item.img}` : item.img);
      message += `\n${index + 1}. *${item.name}*\n`;
      message += `   • *Type:* ${item.orderMode === 'RENT' ? `RENTAL (${item.duration})` : 'PURCHASE'}\n`;
      message += `   • *Size/Fit:* ${item.selectedSize}\n`;
      message += `   • *Price/Fee:* ₹${item.itemPrice.toLocaleString('en-IN')}\n`;
      if (item.securityDeposit > 0) {
        message += `   • *Refundable Deposit:* ₹${item.securityDeposit.toLocaleString('en-IN')}\n`;
      }
      if (itemImgUrl) {
        message += `   • *Design Photo:* ${itemImgUrl}\n`;
      }
    });

    message += `\n──────────────────────\n`;
    message += `💰 *Subtotal:* ₹${subtotalFees.toLocaleString('en-IN')}\n`;
    if (discountAmount > 0) {
      message += `🎟️ *Voucher Applied (${appliedCoupon?.coupon?.code}):* -₹${discountAmount.toLocaleString('en-IN')}\n`;
    }
    if (totalSecurityDeposit > 0) {
      message += `🛡️ *Refundable Security Deposit:* ₹${totalSecurityDeposit.toLocaleString('en-IN')}\n`;
    }
    message += `💎 *TOTAL ESTIMATED BOOKING:* ₹${grandTotal.toLocaleString('en-IN')}\n\n`;
    message += `📍 *Studio Address:* B-125, First Floor, Laxmi Nagar, Delhi (Near V3S Mall)\n`;
    message += `✂️ *Custom Alterations:* In-studio bespoke tailoring by Designer Deepak Kumar\n`;
    message += `Please confirm bridal trial schedule, fitting details & outfit availability!`;

    window.open(`https://wa.me/916397799514?text=${encodeURIComponent(message)}`, '_blank');

    setConfirmedBooking({
      orderNumber,
      clientName: customerName || 'Valued Client',
      itemsCount: cartItems.length,
      total: grandTotal,
      deposit: totalSecurityDeposit,
      discount: discountAmount,
      deliveryType
    });
  };

  const handleInstantConfirm = () => {
    if (cartItems.length === 0) return;
    const { orderNumber } = processOrderCreation();
    setConfirmedBooking({
      orderNumber,
      clientName: customerName || 'Valued Client',
      itemsCount: cartItems.length,
      total: grandTotal,
      deposit: totalSecurityDeposit,
      discount: discountAmount,
      deliveryType
    });
  };

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

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-luxury-light">
                <div className="flex items-center gap-2">
                  <FiShoppingBag className="text-luxury-gold" size={20} />
                  <h3 className="font-serif text-xl tracking-wider text-black uppercase">
                    Shopping Bag
                  </h3>
                  <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full font-sans">
                    {cartItems.length}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-700"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-16">
                    <FiShoppingBag size={48} strokeWidth={1} className="mb-4 text-gray-300" />
                    <p className="font-serif text-lg text-gray-700 mb-2">Your Bag is Empty</p>
                    <p className="text-xs text-gray-400 max-w-xs mb-8">
                      Explore handcrafted bridal lehengas, jewellery, and sarees available to Rent or Buy.
                    </p>
                    <button
                      onClick={onClose}
                      className="px-8 py-3 bg-black text-white text-xs tracking-widest uppercase hover:bg-luxury-gold transition-colors"
                    >
                      Browse Collection
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Item List */}
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div
                          key={item.cartItemId}
                          className="flex gap-4 p-3 bg-gray-50 border border-gray-100 rounded-sm relative group"
                        >
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-20 h-24 object-cover rounded-sm flex-shrink-0 bg-gray-200"
                          />
                          <div className="flex-1 min-w-0 pr-6">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`text-[9px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-sm ${
                                  item.orderMode === 'RENT'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-zinc-800 text-white'
                                }`}
                              >
                                {item.orderMode === 'RENT' ? `RENT (${item.duration})` : 'BUY TO OWN'}
                              </span>
                              <span className="text-[10px] text-gray-500">Fit: {item.selectedSize}</span>
                            </div>
                            <h4 className="text-xs font-serif font-semibold text-gray-900 truncate">
                              {item.name}
                            </h4>
                            <div className="mt-2 text-xs">
                              <span className="font-medium text-black">
                                ₹{item.itemPrice.toLocaleString('en-IN')}
                              </span>
                              {item.securityDeposit > 0 && (
                                <span className="text-[10px] text-gray-500 block">
                                  + ₹{item.securityDeposit.toLocaleString('en-IN')} (Refundable Deposit)
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.cartItemId)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Remove item"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Promo Code Input */}
                    <div className="p-4 bg-gray-50 border border-gray-200/70 rounded-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] tracking-wider uppercase font-semibold text-gray-700 flex items-center gap-1.5">
                          <FiTag className="text-luxury-gold" /> Atelier Promo Voucher
                        </span>
                        <span className="text-[9px] text-gray-400 font-mono">e.g. ROYAL10, DELHIBEST</span>
                      </div>

                      {appliedCoupon ? (
                        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 p-2.5 rounded text-xs">
                          <div>
                            <span className="font-mono font-bold text-emerald-900">{appliedCoupon.coupon.code}</span>
                            <p className="text-[10px] text-emerald-700 mt-0.5">{appliedCoupon.message}</p>
                          </div>
                          <button
                            onClick={handleRemoveCoupon}
                            className="text-[10px] uppercase font-bold text-rose-600 hover:underline ml-2"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <form onSubmit={handleApplyCoupon} className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Enter voucher code"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              className="flex-1 p-2 text-xs border border-gray-200 uppercase font-mono focus:border-black outline-none bg-white"
                            />
                            <button
                              type="submit"
                              className="px-4 py-2 bg-black text-white hover:bg-luxury-gold text-xs uppercase tracking-wider font-semibold rounded shrink-0 transition-colors"
                            >
                              Apply
                            </button>
                          </form>

                          {/* Quick Active Voucher Pills */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            <span className="text-[9px] uppercase font-semibold text-gray-400">Available:</span>
                            {getStoredCoupons().filter(c => c.isActive !== false).slice(0, 3).map((c) => (
                              <button
                                key={c.id || c.code}
                                type="button"
                                onClick={() => {
                                  setCouponCode(c.code);
                                  const res = validateCouponCode(c.code, subtotalFees);
                                  if (res.valid) {
                                    setAppliedCoupon(res);
                                    setCouponError('');
                                  } else {
                                    setCouponError(res.message);
                                  }
                                }}
                                className="text-[10px] bg-white hover:bg-black hover:text-white border border-gray-200 hover:border-black px-2 py-0.5 rounded font-mono font-medium text-gray-700 transition-colors shadow-2xs"
                                title={c.description}
                              >
                                {c.code} ({c.type === 'PERCENTAGE' || c.type === 'PERCENT' ? `${c.value}%` : `₹${c.value}`})
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {couponError && <p className="text-[10px] text-rose-600">{couponError}</p>}
                    </div>

                    {/* Delivery / Fulfillment Method */}
                    <div className="p-4 bg-gray-50 border border-gray-200/70 rounded-sm space-y-2.5">
                      <span className="text-[10px] tracking-wider uppercase font-semibold text-gray-700 block">
                        Fulfillment / Trial Preference
                      </span>
                      <div className="space-y-2">
                        {[
                          {
                            id: 'Studio Alteration & Pick-up (Delhi)',
                            title: 'Studio Trial & Pick-up (Laxmi Nagar, Delhi)',
                            subtitle: 'Includes custom bridal alterations & fitting with Deepak Kumar',
                            icon: FiMapPin
                          },
                          {
                            id: 'Insured Pan-India Express Courier',
                            title: 'Pan-India Insured Express Courier',
                            subtitle: 'Direct doorstep sanitized delivery with return dispatch bag',
                            icon: FiTruck
                          }
                        ].map((option) => {
                          const Icon = option.icon;
                          const isSelected = deliveryType === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => setDeliveryType(option.id)}
                              className={`w-full p-2.5 text-left border rounded transition-all flex items-start gap-2.5 ${
                                isSelected
                                  ? 'border-black bg-white ring-1 ring-black shadow-sm'
                                  : 'border-gray-200 bg-gray-100 text-gray-600 hover:bg-white'
                              }`}
                            >
                              <Icon className="text-luxury-gold mt-0.5 shrink-0" size={15} />
                              <div className="min-w-0 flex-1">
                                <span className="text-xs font-semibold text-gray-900 block">{option.title}</span>
                                <span className="text-[10px] text-gray-500 block leading-tight">{option.subtitle}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Client Fitting Details */}
                    <div className="bg-gray-50 p-4 border border-gray-200/70 rounded-sm space-y-3">
                      <span className="text-[10px] tracking-widest text-gray-500 uppercase font-semibold block">
                        Client Fitting Details
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-gray-200 focus:border-black outline-none"
                        />
                        <input
                          type="tel"
                          placeholder="WhatsApp No."
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-gray-200 focus:border-black outline-none"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Wedding / Event Date (e.g. 24 Nov 2026)"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-gray-200 focus:border-black outline-none"
                      />
                    </div>

                    {/* Clear bag link */}
                    <div className="text-right">
                      <button
                        onClick={onClearCart}
                        className="text-[11px] text-gray-400 hover:text-red-500 underline"
                      >
                        Clear shopping bag
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Drawer Footer */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-gray-200 bg-luxury-light space-y-4">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Garments / Services Subtotal:</span>
                      <span className="font-medium text-black">₹{subtotalFees.toLocaleString('en-IN')}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-800 font-medium">
                        <span>Voucher Discount:</span>
                        <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    {totalSecurityDeposit > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span className="flex items-center gap-1">
                          <FiShield className="text-luxury-gold" size={13} />
                          Refundable Escrow Deposit:
                        </span>
                        <span className="font-medium text-black">₹{totalSecurityDeposit.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm font-serif font-bold text-black pt-2 border-t border-gray-200">
                      <span>Total Estimated Booking:</span>
                      <span className="text-luxury-gold text-lg">₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {totalSecurityDeposit > 0 && (
                    <p className="text-[10px] text-gray-500 font-light leading-snug bg-white p-2 border border-gray-200">
                      ✨ <em>100% Security Deposit (₹{totalSecurityDeposit.toLocaleString('en-IN')}) is refunded immediately upon safe return of the rental outfits.</em>
                    </p>
                  )}

                  {/* Dual Checkout Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={handleWhatsAppCheckout}
                      className="w-full bg-[#25D366] hover:bg-[#1eb855] text-white py-3.5 px-6 text-xs tracking-[0.18em] uppercase font-semibold transition-all shadow-md flex items-center justify-center gap-2 rounded-sm"
                    >
                      <FiMessageCircle size={17} />
                      Confirm & Send via WhatsApp
                    </button>

                    <button
                      onClick={handleInstantConfirm}
                      className="w-full bg-black hover:bg-luxury-gold hover:text-black text-white py-3 px-6 text-xs tracking-[0.18em] uppercase font-semibold transition-all shadow-sm flex items-center justify-center gap-2 rounded-sm"
                    >
                      Instant Order & Get Receipt
                    </button>
                  </div>
                </div>
              )}

              {/* Order Confirmation Receipt Modal */}
              {confirmedBooking && (
                <div className="absolute inset-0 bg-white z-50 p-6 flex flex-col justify-between overflow-y-auto">
                  <div className="text-center pt-6">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-200">
                      <FiCheckCircle size={28} />
                    </div>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold block mb-1">
                      Order Booked & Confirmed
                    </span>
                    <h3 className="font-serif text-2xl text-gray-900 font-bold mb-2">
                      Thank You, {confirmedBooking.clientName}!
                    </h3>
                    <p className="font-mono text-sm bg-gray-100 py-1 px-3 rounded inline-block text-gray-800 font-bold mb-4">
                      #{confirmedBooking.orderNumber}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto mb-6">
                      Your bridal commission has been recorded in the atelier database. You can track this order anytime with your reference number.
                    </p>

                    <div className="bg-gray-50 border border-gray-200 p-4 rounded text-xs text-left space-y-2 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Selected Garments:</span>
                        <span className="font-bold">{confirmedBooking.itemsCount} piece(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fulfillment:</span>
                        <span className="font-medium text-gray-900">{confirmedBooking.deliveryType}</span>
                      </div>
                      {confirmedBooking.deposit > 0 && (
                        <div className="flex justify-between text-amber-800">
                          <span>Refundable Deposit:</span>
                          <span className="font-bold">₹{confirmedBooking.deposit.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 pt-2 flex justify-between font-serif font-bold text-sm">
                        <span>Total Investment:</span>
                        <span className="text-luxury-gold">₹{confirmedBooking.total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pb-4">
                    <a
                      href={`https://wa.me/916397799514?text=${encodeURIComponent(`Hello SHUBHAANGI Studio, I just booked Order #${confirmedBooking.orderNumber}. Kindly share fitting time slot.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-[#25D366] text-white py-3 px-4 text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2 rounded"
                    >
                      <FiMessageCircle size={16} />
                      Chat on WhatsApp (+91 6397 799 514)
                    </a>
                    <button
                      onClick={() => {
                        setConfirmedBooking(null);
                        onClearCart();
                        onClose();
                      }}
                      className="w-full bg-black text-white py-2.5 text-xs tracking-wider uppercase font-semibold rounded hover:bg-gray-800"
                    >
                      Close & Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
