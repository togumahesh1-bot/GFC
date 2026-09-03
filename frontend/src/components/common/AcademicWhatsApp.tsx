import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { INSTITUTION_INFO } from '../../data/mockAcademicData';

export const AcademicWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = `https://wa.me/${INSTITUTION_INFO.whatsapp}?text=Hello%20Exam%20Cell%2C%20I%20have%20an%20inquiry%20regarding%20Student%20Results%20or%20Hall%20Ticket.`;

  return (
    <div className="fixed bottom-6 right-4 z-40 flex items-center gap-2 group print:hidden">
      {/* Tooltip / Prompt bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-[#12151e] text-zinc-100 text-xs py-2 px-3.5 rounded-2xl border border-emerald-500/40 shadow-xl backdrop-blur-md">
          <div className="flex flex-col">
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Exam Cell WhatsApp Help
            </span>
            <span className="text-[11px] text-zinc-300 font-mono">+91 63724 81457</span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-zinc-500 hover:text-zinc-300 ml-1 p-0.5 rounded-full hover:bg-zinc-800 transition-colors"
            title="Dismiss tip"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        id="floating-whatsapp-btn"
        className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 text-white shadow-[0_8px_25px_rgba(16,185,129,0.45)] hover:shadow-[0_10px_30px_rgba(16,185,129,0.65)] hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-emerald-300/30"
        title="Chat with Exam Cell Support: +91 63724 81457"
        aria-label="Chat with Exam Cell on WhatsApp (+91 63724 81457)"
      >
        <MessageCircle className="w-6 h-6 fill-white/20 stroke-white stroke-[2.2]" />
        
        {/* Ping status ring */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-[#0b0c10]"></span>
        </span>
      </a>
    </div>
  );
};
