import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { RESTAURANT_INFO } from '../../data/initialData';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = `https://wa.me/${RESTAURANT_INFO.whatsapp}?text=Hello%20Gangamma%20Fast%20Food%2C%20I%20want%20to%20order%20food!`;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40 flex items-center gap-2 group">
      {/* Tooltip / Prompt bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-[#12141a] text-zinc-100 text-xs py-2 px-3.5 rounded-2xl border border-emerald-500/40 shadow-xl backdrop-blur-md animate-fade-in">
          <div className="flex flex-col">
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Order on WhatsApp
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

      {/* Floating WhatsApp Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        id="floating-whatsapp-btn"
        className="relative flex items-center justify-center w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 text-white shadow-[0_8px_25px_rgba(16,185,129,0.45)] hover:shadow-[0_10px_30px_rgba(16,185,129,0.65)] hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-emerald-300/30"
        title="Chat & Order directly on WhatsApp: +91 63724 81457"
        aria-label="Order food on WhatsApp (+91 63724 81457)"
      >
        <MessageCircle className="w-7 h-7 fill-white/20 stroke-white stroke-[2.2]" />
        
        {/* Ping status ring */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-[#0b0c10]"></span>
        </span>
      </a>
    </div>
  );
};
