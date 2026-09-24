import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock, FiX, FiCheck, FiKey } from 'react-icons/fi';

export default function AdminAuthModal({ isOpen, onClose, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    // Default studio owner PIN is 2026 (or demo master '1234')
    if (pin === '2026' || pin === '1234') {
      setError(false);
      onSuccess();
      setPin('');
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  const handleQuickDemoUnlock = () => {
    onSuccess();
    setPin('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-sm bg-[#121212] border border-white/10 text-white p-8 rounded-sm shadow-2xl z-10 text-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <FiX size={18} />
          </button>

          {/* Official Logo Crest */}
          <div className="mx-auto mb-4 w-16 h-16 rounded-full overflow-hidden border border-luxury-gold/60 shadow-lg ring-2 ring-luxury-gold/30">
            <img 
              src="/images/shubhaangi-official-logo.jpg" 
              alt="SHUBHAANGI Official Crest" 
              className="w-full h-full object-cover"
            />
          </div>

          <h3 className="font-serif text-xl tracking-wider uppercase text-white mb-1">
            Studio Staff Access
          </h3>
          <p className="text-[11px] text-gray-400 mb-6 font-light">
            Authorized portal for Ekta Jain & Deepak Kumar
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-2 font-medium">
                Enter Studio Security PIN
              </label>
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className={`w-full text-center text-2xl tracking-[0.6em] py-3 bg-black/50 border rounded-sm outline-none transition-colors ${
                  error ? 'border-red-500 text-red-400 animate-shake' : 'border-white/20 focus:border-luxury-gold text-white'
                }`}
              />
              {error && (
                <span className="text-[10px] text-red-400 mt-1 block">
                  Incorrect PIN. Please try again.
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-luxury-gold hover:bg-white hover:text-black text-black py-3 text-xs tracking-[0.2em] uppercase font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <FiCheck size={16} /> Enter Studio Hub
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-gray-500">
            <span>Studio Passcode: <strong className="text-gray-300">2026</strong></span>
            <button
              onClick={handleQuickDemoUnlock}
              className="text-luxury-gold hover:underline flex items-center gap-1"
            >
              <FiKey size={11} /> 1-Click Unlock
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
