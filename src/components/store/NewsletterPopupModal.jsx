import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiBell,
  FiCheckCircle,
  FiGift,
  FiPhone,
  FiArrowRight
} from 'react-icons/fi';
import {
  isUserSubscribedToAlerts,
  subscribeUserToAlerts,
  registerNotificationServiceWorker,
  checkUnseenBroadcastAlerts
} from '../../utils/notifications';

const SESSION_DISMISSED_KEY = 'shubhaangi_newsletter_popup_dismissed_session';

export default function NewsletterPopupModal({
  isOpenExternal,
  onCloseExternal,
  onSelectProductById
}) {
  const [autoOpen, setAutoOpen] = useState(false);
  const [contact, setContact] = useState('');
  const [name, setName] = useState('');
  const [notifyNewDresses, setNotifyNewDresses] = useState(true);
  const [notifyOffers, setNotifyOffers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);
  const [liveToast, setLiveToast] = useState(null);

  const isVisible = Boolean(isOpenExternal || autoOpen);

  useEffect(() => {
    registerNotificationServiceWorker();

    // Check if already subscribed: if so, check for unseen new dress/offer alerts
    if (isUserSubscribedToAlerts()) {
      const timer = setTimeout(() => {
        checkUnseenBroadcastAlerts();
      }, 1800);
      return () => clearTimeout(timer);
    }

    // If not subscribed and not dismissed in this session, auto-show popup on website open
    const dismissed = sessionStorage.getItem(SESSION_DISMISSED_KEY);
    if (!dismissed) {
      const openTimer = setTimeout(() => {
        setAutoOpen(true);
      }, 2200);
      return () => clearTimeout(openTimer);
    }
  }, []);

  // Listen for live notifications (new dress upload, new offer, or welcome alert)
  useEffect(() => {
    const handleLiveAlert = (e) => {
      if (e.detail) {
        setLiveToast(e.detail);
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === 'shubhaangi_broadcast_alerts') {
        checkUnseenBroadcastAlerts();
      }
    };

    window.addEventListener('shubhaangi-live-alert', handleLiveAlert);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('shubhaangi-live-alert', handleLiveAlert);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(SESSION_DISMISSED_KEY, '1');
    setAutoOpen(false);
    if (onCloseExternal) onCloseExternal();
  };

  const handleAllowAndSubscribe = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    await subscribeUserToAlerts({
      contact,
      name,
      notifyNewDresses,
      notifyOffers
    });

    setIsSubmitting(false);
    setSubscribedSuccess(true);
    sessionStorage.setItem(SESSION_DISMISSED_KEY, '1');

    setTimeout(() => {
      setAutoOpen(false);
      if (onCloseExternal) onCloseExternal();
      setSubscribedSuccess(false);
    }, 2800);
  };

  return (
    <>
      {/* 1. VIP NEWSLETTER & INSTANT PUSH ALERT MODAL ON WEBSITE OPEN */}
      <AnimatePresence>
        {isVisible && (
          <div
            data-lenis-prevent
            className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-5"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              data-lenis-prevent
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="relative z-10 w-full max-w-3xl bg-[#0e0e0e] text-white border border-luxury-gold/40 rounded-md overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col md:flex-row max-h-[92vh] overflow-y-auto md:overflow-hidden overscroll-contain"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close Newsletter Popup"
                className="absolute top-3.5 right-3.5 z-30 w-9 h-9 rounded-full bg-black/70 hover:bg-luxury-gold text-gray-200 hover:text-black flex items-center justify-center border border-white/15 transition-all cursor-pointer"
              >
                <FiX size={18} />
              </button>

              {/* Left Visual Column — Shubhaangi Logo */}
              <div className="relative w-full md:w-5/12 h-56 sm:h-64 md:h-auto bg-zinc-950 flex items-center justify-center overflow-hidden shrink-0 border-b md:border-b-0 md:border-r border-white/10">
                <img
                  src="/images/shubhaangi-official-logo.jpg"
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-125 pointer-events-none"
                />
                <img
                  src="/images/shubhaangi-official-logo.jpg"
                  alt="SHUBHAANGI Official Logo"
                  className="relative z-10 w-4/5 h-4/5 object-contain drop-shadow-[0_0_28px_rgba(200,169,81,0.35)] p-4"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-20 flex flex-col justify-end p-5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-luxury-gold text-black text-[9px] font-extrabold uppercase tracking-[0.2em] rounded-sm w-fit mb-2 shadow-md">
                    <FiBell size={11} /> Instant Bridal Alerts
                  </span>
                  <p className="font-serif text-base sm:text-lg text-white leading-snug">
                    Never Miss a New Bridal Lehenga or Secret Offer
                  </p>
                  <p className="text-[11px] text-luxury-gold mt-0.5">
                    SHUBHAANGI — Laxmi Nagar, Delhi
                  </p>
                </div>
              </div>

              {/* Right Content Column */}
              <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#141414] via-[#101010] to-[#191306]">
                {subscribedSuccess ? (
                  <div className="py-10 text-center space-y-4 my-auto">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                      <FiCheckCircle size={34} />
                    </div>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-luxury-gold font-bold block">
                      VIP Alerts Activated
                    </span>
                    <h3 className="text-2xl font-serif text-white">
                      You’re on the Priority List! ✨
                    </h3>
                    <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
                      Whenever a <strong className="text-white">new bridal dress is uploaded</strong> or a <strong className="text-luxury-gold">special festival offer</strong> is launched, you’ll receive an automatic notification directly on your device.
                    </p>
                    <div className="p-3 bg-luxury-gold/15 border border-luxury-gold/40 rounded-sm inline-block">
                      <span className="text-[10px] uppercase tracking-widest text-gray-300 block">
                        Your VIP Welcome Code:
                      </span>
                      <span className="text-base font-mono font-extrabold text-luxury-gold tracking-widest">
                        ROYAL10 (10% OFF + ₹500 Prepaid Bonus)
                      </span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleAllowAndSubscribe} className="space-y-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.28em] uppercase text-luxury-gold font-bold mb-1.5">
                        <FiGift size={13} /> VIP Bridal Newsletter &amp; Push Alerts
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-serif text-white leading-tight">
                        Get Notified Automatically on New Dress Drops &amp; Offers
                      </h2>
                      <p className="text-xs text-gray-300 font-light mt-2 leading-relaxed">
                        Allow instant notifications so whenever Designer Deepak Kumar uploads a <strong className="text-white font-medium">new bridal lehenga, gown, jewellery set</strong> or launches a <strong className="text-luxury-gold font-medium">flash discount</strong>, you get alerted first!
                      </p>
                    </div>

                    {/* Alert Preferences */}
                    <div className="bg-white/5 border border-white/10 rounded-sm p-3 space-y-2">
                      <label className="flex items-center gap-2.5 text-xs text-gray-200 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={notifyNewDresses}
                          onChange={(e) => setNotifyNewDresses(e.target.checked)}
                          className="accent-[#c8a951] w-4 h-4 rounded cursor-pointer"
                        />
                        <span>
                          👗 <strong className="text-white">New Dress &amp; Collection Uploads</strong> (Instant Photo Alert)
                        </span>
                      </label>
                      <label className="flex items-center gap-2.5 text-xs text-gray-200 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={notifyOffers}
                          onChange={(e) => setNotifyOffers(e.target.checked)}
                          className="accent-[#c8a951] w-4 h-4 rounded cursor-pointer"
                        />
                        <span>
                          🏷️ <strong className="text-luxury-gold">Exclusive Offers, Rental Discounts &amp; Voucher Codes</strong>
                        </span>
                      </label>
                    </div>

                    {/* Optional Contact Input (WhatsApp or Email) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">
                          Your Name (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Neha Sharma"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white/5 border border-white/15 rounded-sm text-xs text-white placeholder-gray-500 focus:outline-none focus:border-luxury-gold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">
                          WhatsApp Number or Email
                        </label>
                        <div className="relative">
                          <FiPhone className="absolute left-3 top-3 text-gray-400" size={13} />
                          <input
                            type="text"
                            placeholder="+91 98XXX XXXXX or Email"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="w-full pl-8 pr-3 py-2.5 bg-white/5 border border-white/15 rounded-sm text-xs text-white placeholder-gray-500 focus:outline-none focus:border-luxury-gold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Primary Allow Button */}
                    <div className="pt-1 space-y-2.5">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-5 bg-luxury-gold hover:bg-[#dfb956] text-black font-extrabold text-xs tracking-[0.18em] uppercase rounded-sm shadow-[0_0_25px_rgba(200,169,81,0.4)] hover:shadow-[0_0_35px_rgba(200,169,81,0.65)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FiBell size={16} className="animate-bounce" />
                        <span>
                          {isSubmitting
                            ? 'Activating Instant Alerts...'
                            : 'Allow Notifications & Unlock 10% OFF'}
                        </span>
                      </button>

                      <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                        <span>🔒 1-Click Browser Push • Zero Spam</span>
                        <button
                          type="button"
                          onClick={handleClose}
                          className="text-gray-400 hover:text-white underline cursor-pointer"
                        >
                          Maybe Later
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. LIVE REAL-TIME NOTIFICATION TOAST (When New Dress or Offer Drops) */}
      <AnimatePresence>
        {liveToast && (
          <motion.div
            initial={{ opacity: 0, x: 60, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 60 }}
            className="fixed bottom-20 md:bottom-6 right-4 z-[120] max-w-sm w-[calc(100vw-2rem)] bg-[#111111] text-white border border-luxury-gold/60 rounded-md shadow-[0_15px_40px_rgba(0,0,0,0.8)] p-3.5 flex gap-3.5 items-center"
          >
            {liveToast.image && (
              <div className="w-16 h-20 rounded-sm overflow-hidden bg-zinc-950 border border-luxury-gold/30 shrink-0">
                <img
                  src={liveToast.image}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div className="flex-1 min-w-0 pr-4">
              <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-luxury-gold font-extrabold mb-0.5">
                <FiBell size={10} /> Live Studio Alert
              </span>
              <h4 className="text-xs font-serif font-bold text-white line-clamp-1">
                {liveToast.title}
              </h4>
              <p className="text-[11px] text-gray-300 line-clamp-2 mt-0.5 leading-snug">
                {liveToast.body}
              </p>
              {liveToast.url && liveToast.url.includes('product=') && onSelectProductById && (
                <button
                  type="button"
                  onClick={() => {
                    const pid = new URLSearchParams(liveToast.url.split('?')[1]).get('product');
                    if (pid) onSelectProductById(pid);
                    setLiveToast(null);
                  }}
                  className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-luxury-gold hover:underline cursor-pointer"
                >
                  <span>View Dress Now</span>
                  <FiArrowRight size={11} />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setLiveToast(null)}
              className="absolute top-2.5 right-2.5 text-gray-400 hover:text-white p-1 cursor-pointer"
            >
              <FiX size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
