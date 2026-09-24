import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSearch, FiCheckCircle, FiClock, FiShield, FiMessageCircle, FiPackage } from 'react-icons/fi';

export default function OrderTrackerModal({ isOpen, onClose, orders }) {
  const [searchId, setSearchId] = useState('');
  const [foundOrder, setFoundOrder] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleTrack = (e) => {
    e.preventDefault();
    if (!searchId) return;
    const clean = searchId.trim().toUpperCase().replace('#', '');
    const match = orders.find(
      (o) => o.id.toUpperCase().replace('#', '') === clean || o.phone.includes(clean)
    );
    setFoundOrder(match || null);
    setHasSearched(true);
  };

  const getStepStatus = (order, stepIndex) => {
    // 0: Order Placed, 1: Fitting/Prep, 2: Dispatched, 3: Active/With Bride, 4: Returned/Completed
    const s = order.status;
    if (s === 'RETURNED' || s === 'COMPLETED') return 4;
    if (s === 'RETURN_PENDING') return 3;
    if (s === 'ACTIVE_RENTAL') return 3;
    if (s === 'DISPATCHED') return 2;
    if (s === 'FITTING_SCHEDULED') return 1;
    return 0;
  };

  const steps = [
    'Order Confirmed',
    'Custom Alteration',
    'Dispatched / Trial',
    'With Client (Active)',
    'Returned / Done'
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-sm shadow-2xl overflow-hidden z-10 border border-gray-200"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 transition-colors"
          >
            <FiX size={20} />
          </button>

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase text-luxury-gold font-bold mb-1">
              <FiPackage /> Live Concierge Tracking
            </div>
            <h3 className="text-2xl font-serif text-gray-900 mb-2">Track Your Bridal Commission</h3>
            <p className="text-xs text-gray-500 font-light mb-6">
              Enter your Order Reference Number (e.g. <strong>#SHB-8091</strong>) or phone number to view real-time atelier status.
            </p>

            {/* Search Input */}
            <form onSubmit={handleTrack} className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3.5 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="e.g. SHB-8091"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded text-xs focus:border-black outline-none font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-black text-white hover:bg-luxury-gold text-xs uppercase tracking-wider font-semibold rounded transition-colors shrink-0"
              >
                Track Order
              </button>
            </form>

            {/* Result Area */}
            {hasSearched && !foundOrder && (
              <div className="p-6 bg-gray-50 border border-gray-200 rounded text-center text-xs text-gray-600">
                <p className="font-semibold text-gray-900 mb-1">No active record found for "{searchId}"</p>
                <p className="text-gray-500 mb-3">
                  Please verify your order ID or contact our atelier directly on WhatsApp.
                </p>
                <a
                  href={`https://wa.me/916397799514?text=${encodeURIComponent(`Hello SHUBHAANGI Studio! I would like to check the status of my order.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#25D366] font-semibold"
                >
                  <FiMessageCircle /> Inquire with Studio Concierge
                </a>
              </div>
            )}

            {foundOrder && (
              <div className="space-y-6 animate-fade-in border-t border-gray-100 pt-6">
                {/* Order Meta Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] tracking-widest text-gray-400 uppercase font-mono">
                      Order Reference
                    </span>
                    <h4 className="font-mono text-lg font-bold text-gray-900">#{foundOrder.id}</h4>
                    <p className="text-xs text-gray-600 font-medium">{foundOrder.customerName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded bg-black text-white inline-block">
                      {foundOrder.status.replace('_', ' ')}
                    </span>
                    <p className="text-[11px] text-gray-400 mt-1">{foundOrder.date}</p>
                  </div>
                </div>

                {/* Progress Stepper */}
                <div className="py-3">
                  <div className="flex justify-between mb-2">
                    {steps.map((step, idx) => {
                      const activeStep = getStepStatus(foundOrder);
                      const isComplete = idx <= activeStep;
                      return (
                        <div key={step} className="flex flex-col items-center text-center flex-1">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isComplete
                                ? 'bg-luxury-gold text-black shadow-md'
                                : 'bg-gray-200 text-gray-400'
                            }`}
                          >
                            {isComplete ? '✓' : idx + 1}
                          </div>
                          <span className="text-[9px] mt-1.5 text-gray-600 font-medium max-w-[60px] leading-tight">
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Details Card */}
                <div className="p-4 bg-gray-50 border border-gray-200/70 rounded text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Selected Piece:</span>
                    <strong className="text-gray-900">{foundOrder.item}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Acquisition Mode:</span>
                    <strong>{foundOrder.mode === 'RENT' ? `RENTAL (${foundOrder.duration})` : 'PURCHASE'}</strong>
                  </div>
                  {foundOrder.rentalDueDate && (
                    <div className="flex justify-between text-rose-700">
                      <span>Scheduled Return Due Date:</span>
                      <strong>{foundOrder.rentalDueDate}</strong>
                    </div>
                  )}
                  {foundOrder.deposit > 0 && (
                    <div className="flex justify-between text-emerald-800">
                      <span className="flex items-center gap-1">
                        <FiShield size={12} /> Security Deposit Status:
                      </span>
                      <strong>{foundOrder.paymentStatus} (₹{foundOrder.deposit.toLocaleString('en-IN')})</strong>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-sm">
                    <span>Total Amount:</span>
                    <span className="text-luxury-gold">₹{foundOrder.amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/916397799514?text=${encodeURIComponent(`Hello SHUBHAANGI Studio! Tracking Order #${foundOrder.id}. Need assistance.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-[#25D366] hover:bg-[#1eb855] text-white text-xs uppercase tracking-wider font-semibold rounded flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <FiMessageCircle size={16} /> Chat with Studio Team on WhatsApp
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
