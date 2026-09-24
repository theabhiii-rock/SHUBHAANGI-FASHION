import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiClock, FiMapPin, FiCheckCircle, FiMessageCircle } from 'react-icons/fi';

export default function AppointmentModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('11:30 AM - 1:00 PM');
  const [service, setService] = useState('Bridal Lehenga Fitting & Trial');
  const [booked, setBooked] = useState(false);

  if (!isOpen) return null;

  const timeSlots = [
    '11:30 AM - 1:00 PM (Morning Special)',
    '2:00 PM - 3:30 PM (Afternoon Session)',
    '4:30 PM - 6:00 PM (Evening Consultation)',
    '6:30 PM - 8:00 PM (Sunset VIP Slot)'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !date) return;

    const message = `✨ *PRIVATE ATELIER FITTING APPOINTMENT* ✨
📍 *Studio:* B-125, First Floor, Laxmi Nagar, Delhi
👤 *Client Name:* ${name}
📞 *Contact:* ${phone}
📅 *Requested Date:* ${date}
⏰ *Time Slot:* ${timeSlot}
👗 *Service Requested:* ${service}

Kindly confirm my private bridal trial slot with designer Deepak Kumar.`;

    window.open(`https://wa.me/916397799514?text=${encodeURIComponent(message)}`, '_blank');
    setBooked(true);
  };

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
          className="relative w-full max-w-lg bg-white rounded-sm shadow-2xl overflow-hidden z-10 border border-gray-200"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 transition-colors"
          >
            <FiX size={20} />
          </button>

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase text-luxury-gold font-bold mb-1">
              <FiMapPin /> Laxmi Nagar, Delhi Studio
            </div>
            <h3 className="text-2xl font-serif text-gray-900 mb-2">
              Book Private Atelier Fitting
            </h3>
            <p className="text-xs text-gray-500 font-light mb-6">
              Experience one-on-one bridal styling with Ekta Jain & Deepak Kumar. Includes complimentary alteration sizing.
            </p>

            {booked ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <FiCheckCircle size={28} />
                </div>
                <h4 className="font-serif text-xl font-bold text-gray-900">
                  Appointment Request Dispatched!
                </h4>
                <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">
                  Thank you, <strong>{name}</strong>. Our bridal coordinator will confirm your session for <strong>{date}</strong> at <strong>{timeSlot}</strong>.
                </p>
                <button
                  onClick={() => {
                    setBooked(false);
                    onClose();
                  }}
                  className="px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest hover:bg-luxury-gold transition-colors font-medium rounded"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                    Bride / Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Meera Rajput"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded focus:border-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98112 34567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded focus:border-black outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                      Fitting Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded focus:border-black outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                      Styling Focus
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded focus:border-black outline-none bg-white"
                    >
                      <option value="Bridal Lehenga Fitting & Trial">Bridal Lehenga Fitting</option>
                      <option value="Royal Jewellery Matching">Jewellery Matching</option>
                      <option value="Groom Sherwani Sizing">Groom Sherwani Trial</option>
                      <option value="Complete Couple Styling">Complete Couple Look</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                    Preferred Studio Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded focus:border-black outline-none bg-white"
                  >
                    {timeSlots.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#25D366] hover:bg-[#1eb855] text-white text-xs tracking-[0.2em] uppercase font-semibold transition-all rounded shadow-md flex items-center justify-center gap-2 mt-4"
                >
                  <FiMessageCircle size={16} /> Confirm & Reserve via WhatsApp
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
