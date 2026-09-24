import React from 'react';
import { FiCheckCircle, FiShield, FiMessageCircle, FiClock, FiAlertTriangle } from 'react-icons/fi';

export default function RentalTimelineCard({ rental, onMarkReturned }) {
  const isPendingReturn = rental.status === 'RETURN_PENDING';
  const isActiveRental = rental.status === 'ACTIVE_RENTAL';
  const isReturned = rental.status === 'RETURNED';

  const handleWhatsAppReminder = () => {
    const msg = `Hello ${rental.customerName}! ✨ This is a polite courtesy reminder from *SHUBHAANGI Studio (Laxmi Nagar, Delhi)*.

👗 *Rented Outfit:* ${rental.item}
📅 *Scheduled Return Due Date:* ${rental.rentalDueDate}
🛡️ *Refundable Deposit to Release:* ₹${rental.deposit?.toLocaleString('en-IN')}

Please visit our atelier for inspection & deposit handover. If you need a return extension, kindly reply here!`;

    window.open(`https://wa.me/${rental.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div
      className={`p-5 rounded-sm border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all shadow-sm ${
        isPendingReturn
          ? 'border-rose-300 bg-rose-50/70'
          : isActiveRental
          ? 'border-amber-200 bg-amber-50/40'
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="space-y-1.5 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-mono text-xs font-bold text-gray-500 bg-black/5 px-2 py-0.5 rounded">
            {rental.id}
          </span>
          <h4 className="text-base font-serif font-bold text-gray-900 truncate">
            {rental.item}
          </h4>
          <span
            className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1 ${
              isPendingReturn
                ? 'bg-rose-600 text-white animate-pulse'
                : isActiveRental
                ? 'bg-amber-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {isPendingReturn ? <FiAlertTriangle size={10} /> : <FiClock size={10} />}
            {isPendingReturn ? 'RETURN DUE NOW' : rental.status.replace('_', ' ')}
          </span>
        </div>

        <div className="text-xs text-gray-600 flex flex-wrap gap-x-6 gap-y-1">
          <span>Client: <strong className="text-gray-900">{rental.customerName}</strong> ({rental.phone})</span>
          <span>Duration: <strong>{rental.duration}</strong></span>
          <span>
            Return Due Date: <strong className={isPendingReturn ? 'text-rose-700 underline' : 'text-gray-900'}>
              {rental.rentalDueDate || 'N/A'}
            </strong>
          </span>
        </div>

        <div className="text-xs text-gray-500 flex items-center gap-1.5 pt-1">
          <FiShield className="text-luxury-gold flex-shrink-0" size={13} />
          <span>
            Security Deposit Held: <strong className="text-gray-900">₹{rental.deposit?.toLocaleString('en-IN')}</strong>
            <span className="text-gray-400 ml-1.5">({rental.paymentStatus})</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end md:self-auto flex-shrink-0">
        {!isReturned ? (
          <button
            onClick={() => onMarkReturned(rental.id)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <FiCheckCircle size={14} /> Mark Returned & Release Deposit
          </button>
        ) : (
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3.5 py-2 rounded border border-emerald-200 flex items-center gap-1.5">
            <FiCheckCircle /> Outfit Returned & Deposit Released
          </span>
        )}

        <button
          onClick={handleWhatsAppReminder}
          className="p-2.5 bg-[#25D366] hover:bg-[#1eb855] text-white rounded transition-colors flex items-center justify-center shadow-sm"
          title="Send WhatsApp return reminder to bride"
        >
          <FiMessageCircle size={16} />
        </button>
      </div>
    </div>
  );
}
