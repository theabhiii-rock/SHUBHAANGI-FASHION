import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock, FiX, FiCheck, FiShield } from 'react-icons/fi';

export default function AdminAuthModal({ isOpen, onClose, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);

  if (!isOpen) return null;

  const isLocked = lockedUntil && Date.now() < lockedUntil;

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    // Check lockout
    if (isLocked) {
      const waitSecs = Math.ceil((lockedUntil - Date.now()) / 1000);
      alert(`Too many failed attempts. Security lock active. Please wait ${waitSecs} seconds.`);
      return;
    }

    // Confidential Owner PIN
    const storedPin = localStorage.getItem('shubhaangi_custom_pin') || '9643';

    if (pin === storedPin) {
      setError(false);
      setFailedAttempts(0);
      onSuccess();
      setPin('');
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      setError(true);
      if (newAttempts >= 5) {
        setLockedUntil(Date.now() + 180000); // 3 minutes lockout
      }
      setTimeout(() => setError(false), 1500);
    }
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
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
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
            Authorized private portal for Ekta Jain & Deepak Kumar
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-2 font-medium flex items-center justify-center gap-1.5">
                <FiLock size={11} className="text-luxury-gold" />
                <span>Enter Studio Security PIN</span>
              </label>
              <input
                type="password"
                maxLength={6}
                autoFocus
                disabled={isLocked}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className={`w-full text-center text-2xl tracking-[0.6em] py-3 bg-black/50 border rounded-sm outline-none transition-colors ${
                  isLocked ? 'border-red-900 bg-red-950/20 text-gray-500 cursor-not-allowed' :
                  error ? 'border-red-500 text-red-400 animate-shake' : 'border-white/20 focus:border-luxury-gold text-white'
                }`}
              />
              {isLocked ? (
                <span className="text-[10px] text-red-400 mt-2 block font-medium">
                  🔒 Locked due to multiple invalid entries. Try later.
                </span>
              ) : error ? (
                <span className="text-[10px] text-red-400 mt-1 block">
                  Access denied. Incorrect security code.
                </span>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isLocked}
              className={`w-full py-3 text-xs tracking-[0.2em] uppercase font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                isLocked 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-luxury-gold hover:bg-white hover:text-black text-black'
              }`}
            >
              <FiCheck size={16} /> Authenticate Access
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-1 text-[10px] text-gray-600">
            <FiShield size={11} className="text-luxury-gold/50" />
            <span>256-bit encrypted studio session</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
