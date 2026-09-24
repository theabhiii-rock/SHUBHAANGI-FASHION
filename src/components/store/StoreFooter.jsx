import React from 'react';
import { FiInstagram, FiMessageCircle, FiPhoneCall, FiLock } from 'react-icons/fi';

export default function StoreFooter({ onOpenAuthModal }) {
  return (
    <footer className="bg-[#0a0a0a] text-white py-24 px-6 relative overflow-hidden border-t border-white/5">
      <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        {/* Col 1: Brand Story with Official Crest */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img 
              src="/images/shubhaangi-official-logo.jpg" 
              alt="SHUBHAANGI Official Crest" 
              className="w-14 h-14 rounded-full object-cover border border-luxury-gold/50 shadow-lg ring-2 ring-luxury-gold/20 shrink-0"
            />
            <div>
              <h2 className="text-2xl font-serif tracking-[0.2em] uppercase text-white">
                Shubhaangi
              </h2>
              <span className="text-[9px] tracking-[0.3em] uppercase text-luxury-gold block font-semibold">
                The Ultimate Bride
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            Founded by Ekta Jain and designed by Deepak Kumar, SHUBHAANGI is Delhi's premier bridal couture studio offering luxury wedding lehengas on 3-day/7-day rental & bespoke custom creations.
          </p>
        </div>
        
        {/* Col 2: Atelier Address */}
        <div>
          <h3 className="text-xs tracking-[0.25em] uppercase mb-6 text-luxury-gold font-bold">
            Visit The Atelier
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed font-light mb-4">
            B-125, First Floor, Laxmi Nagar<br />
            Near V3S Mall<br />
            Delhi – 110092
          </p>
          <p className="text-[11px] text-gray-400">
            Open Monday – Sunday<br />
            11:00 AM – 8:30 PM (Private Trials by Appointment)
          </p>
        </div>

        {/* Col 3: Direct Contacts */}
        <div>
          <h3 className="text-xs tracking-[0.25em] uppercase mb-6 text-luxury-gold font-bold">
            Bridal Inquiries
          </h3>
          <ul className="space-y-3 text-xs text-gray-300 font-light">
            <li>
              <a 
                href="https://wa.me/916397799514" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-luxury-gold transition-colors flex items-center gap-2"
              >
                <FiMessageCircle className="text-[#25D366]" size={14} /> WhatsApp: +91 6397 799 514
              </a>
            </li>
            <li>
              <a 
                href="tel:+919643123253" 
                className="hover:text-luxury-gold transition-colors flex items-center gap-2"
              >
                <FiPhoneCall size={13} /> Studio Alt: +91 96431 23253
              </a>
            </li>
            <li>
              <a 
                href="https://instagram.com/shubhaangi.official" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-luxury-gold transition-colors flex items-center gap-2"
              >
                <FiInstagram className="text-pink-400" size={14} /> Instagram: @shubhaangi.official
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Client Policies */}
        <div>
          <h3 className="text-xs tracking-[0.25em] uppercase mb-6 text-luxury-gold font-bold">
            Rental & Fitting Terms
          </h3>
          <ul className="space-y-2.5 text-xs text-gray-400 font-light">
            <li>• 3-Day & 7-Day Flexible Rental Durations</li>
            <li>• 100% Refundable Security Deposit Policy</li>
            <li>• Complimentary Bridal Alterations & Finishing</li>
            <li>• Sanitized, Dry-Cleaned & Inspected Garments</li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal & Staff Link */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-center text-[10px] text-gray-500 tracking-[0.2em] uppercase relative z-10">
        <p>© 2026 SHUBHAANGI. ALL RIGHTS RESERVED.</p>
        
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Rental Terms</a>
          
          {/* Subtle Discreet Staff Login (Only accessible to studio owners) */}
          <button
            onClick={onOpenAuthModal}
            className="text-gray-600 hover:text-luxury-gold transition-colors flex items-center gap-1 font-mono tracking-wider ml-4"
            title="Studio Owner & Staff Login"
          >
            <FiLock size={10} /> Staff Atelier Access
          </button>
        </div>
      </div>
    </footer>
  );
}
