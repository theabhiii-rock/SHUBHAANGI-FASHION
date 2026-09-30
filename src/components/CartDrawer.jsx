import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, FiTrash2, FiShoppingBag, FiMessageCircle, 
  FiShield, FiTag, FiTruck, FiMapPin, FiCheckCircle,
  FiCreditCard, FiAlertCircle, FiLock, FiZap
} from 'react-icons/fi';
import { saveOrders, getStoredOrders, validateCouponCode, getStoredCoupons } from '../data/store';
import { initiateRazorpayPayment } from '../utils/razorpay';

export default function CartDrawer({ isOpen, onClose, cartItems, onRemoveItem, onClearCart }) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [deliveryType, setDeliveryType] = useState('Studio Alteration & Pick-up (Delhi)');

  // Payment Mode Selector (Flipkart / Meesho / Myntra Prepaid vs Token vs COD style)
  // 'ONLINE_FULL' | 'ONLINE_TOKEN' | 'STUDIO_COD'
  const [paymentMethod, setPaymentMethod] = useState('ONLINE_FULL');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Online payment state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentNotice, setPaymentNotice] = useState('');

  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Price & Prepaid Discount Calculations
  const subtotalFees = cartItems.reduce((acc, item) => acc + item.itemPrice, 0);
  const totalSecurityDeposit = cartItems.reduce((acc, item) => acc + item.securityDeposit, 0);
  const couponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;

  // Meesho / Flipkart style Instant Prepaid Incentive
  const fullPrepaidBonus = subtotalFees >= 5000 ? 500 : (subtotalFees > 0 ? 250 : 0);
  const tokenPrepaidBonus = subtotalFees >= 3000 ? 200 : 0;

  const prepaidDiscount =
    paymentMethod === 'ONLINE_FULL'
      ? fullPrepaidBonus
      : paymentMethod === 'ONLINE_TOKEN'
      ? tokenPrepaidBonus
      : 0;

  const totalSavings = couponDiscount + prepaidDiscount;
  const netGarmentFee = Math.max(0, subtotalFees - couponDiscount - prepaidDiscount);
  const grandTotal = netGarmentFee + totalSecurityDeposit;

  // Token advance amount (₹1,000 or grandTotal if smaller)
  const tokenAdvanceAmount = Math.min(1000, grandTotal);
  const balanceDueAtStudio = Math.max(0, grandTotal - tokenAdvanceAmount);

  const payableOnlineNow =
    paymentMethod === 'ONLINE_FULL'
      ? grandTotal
      : paymentMethod === 'ONLINE_TOKEN'
      ? tokenAdvanceAmount
      : 0;

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

  const processOrderCreation = React.useCallback((paymentDetails = {}) => {
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
      discountApplied: appliedCoupon?.coupon?.code || (prepaidDiscount > 0 ? 'PREPAID_BONUS' : null),
      status: item.orderMode === 'RENT' ? 'ACTIVE_RENTAL' : 'COMPLETED',
      paymentStatus: paymentDetails.paymentStatus || 'PAY_AT_STUDIO',
      paidOnlineAmount: paymentDetails.paidOnlineAmount || 0,
      balanceDueAmount: paymentDetails.balanceDueAmount ?? grandTotal,
      transactionId: paymentDetails.paymentId || null,
      gatewayOrderId: paymentDetails.orderId || null
    }));

    saveOrders([...newOrders, ...currentOrders]);
    return { orderNumber, newOrders };
  }, [cartItems, customerName, customerPhone, eventDate, deliveryType, appliedCoupon, prepaidDiscount, grandTotal]);

  const handlePrimaryCheckout = async () => {
    if (cartItems.length === 0 || isProcessingPayment) return;
    setPaymentError('');
    setPaymentNotice('');

    // Mode 3: Pay at Studio / Cash on Trial (COD)
    if (paymentMethod === 'STUDIO_COD') {
      const { orderNumber } = processOrderCreation({
        paymentStatus: 'PAY_AT_STUDIO',
        paidOnlineAmount: 0,
        balanceDueAmount: grandTotal
      });
      setConfirmedBooking({
        orderNumber,
        clientName: customerName || 'Valued Client',
        itemsCount: cartItems.length,
        total: grandTotal,
        paidNow: 0,
        balanceDue: grandTotal,
        deposit: totalSecurityDeposit,
        totalSavings,
        deliveryType,
        paymentModeLabel: 'Pay at Studio / Cash on Trial'
      });
      return;
    }

    // Mode 1 & Mode 2: Online Payment (Full Prepaid or ₹1,000 Token Advance)
    setIsProcessingPayment(true);
    const isTokenMode = paymentMethod === 'ONLINE_TOKEN';
    const receiptId = `SHB_${isTokenMode ? 'TOKEN' : 'PREPAID'}_${Date.now()}`;

    await initiateRazorpayPayment({
      amountInRupees: payableOnlineNow,
      receipt: receiptId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      description: isTokenMode
        ? `₹${tokenAdvanceAmount.toLocaleString('en-IN')} Date-Lock Token (${cartItems.length} Bridal Piece${cartItems.length > 1 ? 's' : ''})`
        : `Prepaid Online Order (${cartItems.length} Bridal Piece${cartItems.length > 1 ? 's' : ''}) — Saved ₹${totalSavings}`,
      onSuccess: ({ paymentId, orderId }) => {
        setIsProcessingPayment(false);
        const { orderNumber } = processOrderCreation({
          paymentStatus: isTokenMode ? `TOKEN_PAID_₹${tokenAdvanceAmount}` : 'ONLINE_PREPAID',
          paidOnlineAmount: payableOnlineNow,
          balanceDueAmount: isTokenMode ? balanceDueAtStudio : 0,
          paymentId,
          orderId
        });
        setConfirmedBooking({
          orderNumber,
          clientName: customerName || 'Valued Client',
          itemsCount: cartItems.length,
          total: grandTotal,
          paidNow: payableOnlineNow,
          balanceDue: isTokenMode ? balanceDueAtStudio : 0,
          deposit: totalSecurityDeposit,
          totalSavings,
          deliveryType,
          transactionId: paymentId,
          gatewayOrderId: orderId,
          paymentModeLabel: isTokenMode
            ? `Token Reserved (₹${tokenAdvanceAmount.toLocaleString('en-IN')} Paid Online)`
            : '100% Online Prepaid (UPI / Card)'
        });
      },
      onDismiss: (noticeMsg) => {
        setIsProcessingPayment(false);
        setPaymentNotice(noticeMsg);
      },
      onError: (errMsg) => {
        setIsProcessingPayment(false);
        setPaymentError(errMsg);
      }
    });
  };

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;
    const { orderNumber } = processOrderCreation({
      paymentStatus: 'WHATSAPP_INQUIRY',
      paidOnlineAmount: 0,
      balanceDueAmount: grandTotal
    });

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
    if (couponDiscount > 0) {
      message += `🎟️ *Voucher Applied (${appliedCoupon?.coupon?.code}):* -₹${couponDiscount.toLocaleString('en-IN')}\n`;
    }
    if (prepaidDiscount > 0) {
      message += `⚡ *Prepaid Online Bonus:* -₹${prepaidDiscount.toLocaleString('en-IN')}\n`;
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
      paidNow: 0,
      balanceDue: grandTotal,
      deposit: totalSecurityDeposit,
      totalSavings,
      deliveryType,
      paymentModeLabel: 'WhatsApp Concierge Booking'
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

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-luxury-light">
                <div className="flex items-center gap-2">
                  <FiShoppingBag className="text-luxury-gold" size={20} />
                  <h3 className="font-serif text-lg tracking-wider text-black uppercase font-bold">
                    Shopping Bag
                  </h3>
                  <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full font-sans font-semibold">
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
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
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
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div
                          key={item.cartItemId}
                          className="flex gap-3.5 p-3 bg-gray-50 border border-gray-100 rounded-md relative group"
                        >
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-18 h-22 object-cover rounded-sm flex-shrink-0 bg-gray-200"
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
                            <div className="mt-1.5 text-xs">
                              <span className="font-bold text-black">
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
                    <div className="p-3.5 bg-gray-50 border border-gray-200/70 rounded-md space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] tracking-wider uppercase font-bold text-gray-700 flex items-center gap-1.5">
                          <FiTag className="text-luxury-gold" /> Apply Promo Voucher
                        </span>
                        <span className="text-[9px] text-gray-400 font-mono">Extra savings</span>
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
                              className="flex-1 p-2 text-xs border border-gray-200 rounded uppercase font-mono focus:border-black outline-none bg-white"
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
                            <span className="text-[9px] uppercase font-semibold text-gray-400">Tap to apply:</span>
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

                    {/* PAYMENT METHOD SELECTOR (Flipkart / Meesho / Myntra Prepaid Offer System) */}
                    <div className="p-3.5 bg-gradient-to-b from-emerald-50/40 to-gray-50 border border-emerald-200/80 rounded-md space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] tracking-wider uppercase font-bold text-gray-800 flex items-center gap-1.5">
                          <FiCreditCard className="text-emerald-700" size={13} />
                          Select Payment Method
                        </span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">
                          Prepaid Offers Active
                        </span>
                      </div>

                      <div className="space-y-2">
                        {/* Option 1: Pay Full Online (Extra Instant Discount like Meesho/Flipkart) */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('ONLINE_FULL')}
                          className={`w-full p-3 text-left border rounded-md transition-all flex items-start gap-2.5 cursor-pointer ${
                            paymentMethod === 'ONLINE_FULL'
                              ? 'border-emerald-600 bg-white ring-1 ring-emerald-600 shadow-xs'
                              : 'border-gray-200 bg-white/70 hover:bg-white'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                            paymentMethod === 'ONLINE_FULL' ? 'border-emerald-600 bg-emerald-600' : 'border-gray-400'
                          }`}>
                            {paymentMethod === 'ONLINE_FULL' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1 flex-wrap">
                              <span className="text-xs font-bold text-gray-900">
                                Pay Online (UPI / Cards / NetBanking)
                              </span>
                              <span className="text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5">
                                <FiZap size={9} /> Save ₹{fullPrepaidBonus} Extra
                              </span>
                            </div>
                            <p className="text-[10px] text-emerald-700 font-medium mt-0.5">
                              Instant ₹{fullPrepaidBonus} OFF + Priority Alteration & Free Insured Dispatch
                            </p>
                            <div className="flex flex-wrap items-center gap-1 mt-1.5">
                              {['UPI', 'GPay', 'PhonePe', 'Paytm', 'Cards', 'NetBanking'].map((tag) => (
                                <span key={tag} className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium border border-gray-200/70">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </button>

                        {/* Option 2: Reserve with ₹1,000 Token Advance (Bridal Date Lock) */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('ONLINE_TOKEN')}
                          className={`w-full p-3 text-left border rounded-md transition-all flex items-start gap-2.5 cursor-pointer ${
                            paymentMethod === 'ONLINE_TOKEN'
                              ? 'border-black bg-white ring-1 ring-black shadow-xs'
                              : 'border-gray-200 bg-white/70 hover:bg-white'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                            paymentMethod === 'ONLINE_TOKEN' ? 'border-black bg-black' : 'border-gray-400'
                          }`}>
                            {paymentMethod === 'ONLINE_TOKEN' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1 flex-wrap">
                              <span className="text-xs font-bold text-gray-900">
                                Pay ₹{tokenAdvanceAmount.toLocaleString('en-IN')} Token Now (Lock Outfit)
                              </span>
                              <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded uppercase">
                                {tokenPrepaidBonus > 0 ? `Save ₹${tokenPrepaidBonus} + Lock Date` : 'Bridal Favorite'}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-600 mt-0.5 leading-snug">
                              Block outfit for your wedding date now. Pay remaining{' '}
                              <strong className="text-gray-900">₹{balanceDueAtStudio.toLocaleString('en-IN')}</strong> at studio trial/pickup.
                            </p>
                          </div>
                        </button>

                        {/* Option 3: Pay at Studio / Cash on Trial (COD) */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('STUDIO_COD')}
                          className={`w-full p-2.5 text-left border rounded-md transition-all flex items-start gap-2.5 cursor-pointer ${
                            paymentMethod === 'STUDIO_COD'
                              ? 'border-black bg-white ring-1 ring-black shadow-xs'
                              : 'border-gray-200 bg-white/70 hover:bg-white'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                            paymentMethod === 'STUDIO_COD' ? 'border-black bg-black' : 'border-gray-400'
                          }`}>
                            {paymentMethod === 'STUDIO_COD' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-semibold text-gray-800">
                                Pay at Studio / Cash on Trial (COD)
                              </span>
                              <span className="text-[9px] text-gray-400 font-medium">No extra discount</span>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              Reserve trial appointment now and pay full amount at studio.
                            </p>
                          </div>
                        </button>
                      </div>

                      {/* Meesho / Flipkart Nudge when COD is selected */}
                      {paymentMethod === 'STUDIO_COD' && fullPrepaidBonus > 0 && (
                        <div
                          onClick={() => setPaymentMethod('ONLINE_FULL')}
                          className="p-2 bg-emerald-50 border border-emerald-200 rounded text-[11px] text-emerald-800 font-medium flex items-center justify-between cursor-pointer hover:bg-emerald-100/70 transition-colors"
                        >
                          <span>💡 Switch to <strong>Pay Online</strong> & save <strong>₹{fullPrepaidBonus} extra</strong>!</span>
                          <span className="text-[10px] font-bold uppercase underline shrink-0 ml-2">Apply ₹{fullPrepaidBonus} Off</span>
                        </div>
                      )}
                    </div>

                    {/* Delivery / Fulfillment Method */}
                    <div className="p-3.5 bg-gray-50 border border-gray-200/70 rounded-md space-y-2">
                      <span className="text-[10px] tracking-wider uppercase font-bold text-gray-700 block">
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
                              className={`w-full p-2.5 text-left border rounded-md transition-all flex items-start gap-2.5 ${
                                isSelected
                                  ? 'border-black bg-white ring-1 ring-black shadow-2xs'
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
                    <div className="bg-gray-50 p-3.5 border border-gray-200/70 rounded-md space-y-2.5">
                      <span className="text-[10px] tracking-widest text-gray-600 uppercase font-bold block">
                        Client Fitting Details
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-gray-200 rounded focus:border-black outline-none"
                        />
                        <input
                          type="tel"
                          placeholder="WhatsApp Mobile No."
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-gray-200 rounded focus:border-black outline-none"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Wedding / Event Date (e.g. 24 Nov 2026)"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-gray-200 rounded focus:border-black outline-none"
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
                <div className="p-5 border-t border-gray-200 bg-luxury-light space-y-3">
                  {/* Flipkart / Meesho Green Total Savings Strip */}
                  {totalSavings > 0 && (
                    <div className="px-3 py-1.5 bg-emerald-600 text-white rounded-md text-[11px] font-semibold flex items-center justify-between shadow-2xs">
                      <span>🎉 Yay! Total Instant Savings on this Order:</span>
                      <span className="font-bold text-xs">₹{totalSavings.toLocaleString('en-IN')} OFF</span>
                    </div>
                  )}

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Garments / Services MRP:</span>
                      <span className="font-medium text-black">₹{subtotalFees.toLocaleString('en-IN')}</span>
                    </div>

                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Promo Voucher Discount:</span>
                        <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    {prepaidDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Instant Online Prepaid Discount:</span>
                        <span>-₹{prepaidDiscount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    {totalSecurityDeposit > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span className="flex items-center gap-1">
                          <FiShield className="text-luxury-gold" size={13} />
                          Refundable Security Deposit:
                        </span>
                        <span className="font-medium text-black">₹{totalSecurityDeposit.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm font-serif font-bold text-black pt-1.5 border-t border-gray-200">
                      <span>Net Order Total:</span>
                      <span className="text-gray-900 text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>

                    {paymentMethod === 'ONLINE_TOKEN' && (
                      <div className="flex justify-between items-center bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded text-xs mt-1">
                        <span className="font-bold text-amber-950">Payable Online Now (Token):</span>
                        <span className="font-bold text-amber-900 text-sm">₹{tokenAdvanceAmount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>

                  {/* Error / Cancellation Notice */}
                  {paymentError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-start gap-2">
                      <FiAlertCircle className="shrink-0 mt-0.5 text-rose-600" size={14} />
                      <span>{paymentError}</span>
                    </div>
                  )}

                  {paymentNotice && !paymentError && (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 flex items-start gap-2">
                      <FiAlertCircle className="shrink-0 mt-0.5 text-amber-600" size={14} />
                      <span>{paymentNotice}</span>
                    </div>
                  )}

                  {/* Primary E-Commerce Action Buttons (Clean, No gateway brand name) */}
                  <div className="space-y-2 pt-0.5">
                    <button
                      onClick={handlePrimaryCheckout}
                      disabled={isProcessingPayment}
                      className="w-full bg-black hover:bg-luxury-gold hover:text-black disabled:opacity-60 text-white py-3.5 px-5 text-xs tracking-[0.14em] uppercase font-bold transition-all shadow-md flex items-center justify-center gap-2 rounded-md cursor-pointer"
                    >
                      <FiLock size={15} className="text-luxury-gold shrink-0" />
                      {isProcessingPayment
                        ? 'Opening Secure Payment...'
                        : paymentMethod === 'ONLINE_FULL'
                        ? `Place Order & Pay ₹${grandTotal.toLocaleString('en-IN')}`
                        : paymentMethod === 'ONLINE_TOKEN'
                        ? `Pay ₹${tokenAdvanceAmount.toLocaleString('en-IN')} Token & Reserve Outfit`
                        : `Confirm Booking (Pay ₹${grandTotal.toLocaleString('en-IN')} at Studio)`}
                    </button>

                    <button
                      onClick={handleWhatsAppCheckout}
                      className="w-full bg-[#25D366] hover:bg-[#1eb855] text-white py-2.5 px-5 text-[11px] tracking-[0.15em] uppercase font-semibold transition-all shadow-xs flex items-center justify-center gap-2 rounded-md"
                    >
                      <FiMessageCircle size={15} />
                      Confirm & Discuss on WhatsApp
                    </button>

                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 pt-0.5">
                      <FiShield className="text-emerald-600" size={12} />
                      <span>100% Safe & Secured • UPI, GPay, PhonePe, Cards & NetBanking</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Confirmation Receipt Modal */}
              {confirmedBooking && (
                <div className="absolute inset-0 bg-white z-50 p-6 flex flex-col justify-between overflow-y-auto">
                  <div className="text-center pt-4">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-200">
                      <FiCheckCircle size={28} />
                    </div>
                    <span className="text-[10px] tracking-[0.25em] uppercase text-emerald-700 font-bold block mb-1">
                      {confirmedBooking.transactionId ? 'Online Payment Verified & Confirmed' : 'Booking Confirmed'}
                    </span>
                    <h3 className="font-serif text-2xl text-gray-900 font-bold mb-2">
                      Thank You, {confirmedBooking.clientName}!
                    </h3>
                    <p className="font-mono text-sm bg-gray-100 py-1 px-3 rounded inline-block text-gray-800 font-bold mb-3">
                      Order #{confirmedBooking.orderNumber}
                    </p>

                    {confirmedBooking.totalSavings > 0 && (
                      <div className="mb-4">
                        <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold px-3 py-1 rounded-full">
                          🎉 You saved ₹{confirmedBooking.totalSavings.toLocaleString('en-IN')} on this order!
                        </span>
                      </div>
                    )}

                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-md text-xs text-left space-y-2 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Payment Mode:</span>
                        <span className="font-bold text-gray-900">{confirmedBooking.paymentModeLabel}</span>
                      </div>
                      {confirmedBooking.transactionId && (
                        <div className="flex justify-between text-emerald-800">
                          <span>Transaction ID:</span>
                          <span className="font-mono font-bold">{confirmedBooking.transactionId}</span>
                        </div>
                      )}
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
                          <span>Refundable Security Deposit:</span>
                          <span className="font-bold">₹{confirmedBooking.deposit.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 pt-2 flex justify-between font-serif font-bold text-sm">
                        <span>Total Order Value:</span>
                        <span className="text-gray-900">₹{confirmedBooking.total.toLocaleString('en-IN')}</span>
                      </div>
                      {confirmedBooking.paidNow > 0 && (
                        <div className="flex justify-between text-emerald-700 font-bold">
                          <span>Paid Online Now:</span>
                          <span>₹{confirmedBooking.paidNow.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      {confirmedBooking.balanceDue > 0 && (
                        <div className="flex justify-between text-amber-800 font-semibold">
                          <span>Balance Payable at Studio:</span>
                          <span>₹{confirmedBooking.balanceDue.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 pb-4">
                    <a
                      href={`https://wa.me/916397799514?text=${encodeURIComponent(`Hello SHUBHAANGI Studio, I just placed Order #${confirmedBooking.orderNumber} (${confirmedBooking.paymentModeLabel}${confirmedBooking.transactionId ? `, Txn: ${confirmedBooking.transactionId}` : ''}). Kindly share my fitting time slot.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-[#25D366] text-white py-3 px-4 text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2 rounded-md"
                    >
                      <FiMessageCircle size={16} />
                      Share Receipt on WhatsApp
                    </a>
                    <button
                      onClick={() => {
                        setConfirmedBooking(null);
                        onClearCart();
                        onClose();
                      }}
                      className="w-full bg-black text-white py-2.5 text-xs tracking-wider uppercase font-semibold rounded-md hover:bg-gray-800"
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
