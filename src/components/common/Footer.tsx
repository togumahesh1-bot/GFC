import React, { useState } from 'react';
import {
  UtensilsCrossed,
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Mail,
  Shield,
  Heart,
  ExternalLink,
} from 'lucide-react';
import { RESTAURANT_INFO } from '../../data/initialData';
import { PolicyModal } from './PolicyModal';

interface FooterProps {
  setCurrentView: (view: string) => void;
  onOpenAuth: (tab: 'login' | 'signup') => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView, onOpenAuth }) => {
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | 'refund' | null>(null);

  const handleNav = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-[#0b0d11] border-t border-zinc-800/80 text-zinc-400 text-sm mt-16 pt-16 pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            
            {/* Column 1: Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black shadow-md">
                  <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white font-display">Gangamma</h3>
                  <p className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">Fast Food</p>
                </div>
              </div>

              <p className="text-zinc-400 text-xs leading-relaxed">
                Your neighborhood favorite for authentic street-style noodles, crispy chicken 65, sizzling rolls, and fresh Hyderabadi chai. Direct ordering with 0% extra commissions.
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs text-zinc-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="font-semibold text-emerald-400">Kitchen is Live & Taking Orders</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-display">
                Quick Navigation
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button onClick={() => handleNav('home')} className="hover:text-amber-400 transition-colors">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('menu')} className="hover:text-amber-400 transition-colors">
                    Full Digital Menu
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('offers')} className="hover:text-amber-400 transition-colors">
                    Special Offers & Coupons
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('track')} className="hover:text-amber-400 transition-colors">
                    Live Order Tracker
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('profile')} className="hover:text-amber-400 transition-colors">
                    My Account & Loyalty Points
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('admin')} className="text-amber-400/80 hover:text-amber-400 font-semibold transition-colors">
                    Restaurant Admin Portal
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Hours & Timing */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-display">
                Opening Hours
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold">Everyday (Mon – Sun)</p>
                    <p className="text-zinc-400">7:00 AM – 11:30 PM</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <p className="text-amber-300 font-bold mb-1">Peak Rush Hours</p>
                  <p className="text-zinc-400 text-[11px]">
                    Lunch: 12:30 PM - 2:30 PM<br />
                    Evening Snacks: 5:00 PM - 7:30 PM<br />
                    Dinner: 8:30 PM - 11:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Column 4: Contact & Location */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-display">
                Contact & Location
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-zinc-300 leading-snug">
                    {RESTAURANT_INFO.address}, {RESTAURANT_INFO.city}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <a href={`tel:${RESTAURANT_INFO.phone}`} className="text-white hover:text-amber-400 font-medium">
                    Call: {RESTAURANT_INFO.phone}
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a
                    href={`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=Hello%20Gangamma%20Fast%20Food%2C%20I%20want%20to%20place%20an%20order`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    WhatsApp: +91 63724 81457
                  </a>
                </div>

                <div className="pt-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=Gangamma+Fast+Food+${encodeURIComponent(RESTAURANT_INFO.city)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
                  >
                    <span>Get Google Maps Directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom copyright & legal links */}
          <div className="mt-12 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>© {new Date().getFullYear()} Gangamma Fast Food. All rights reserved.</p>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActivePolicy('privacy')}
                className="hover:text-zinc-300 transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setActivePolicy('terms')}
                className="hover:text-zinc-300 transition-colors"
              >
                Terms of Service
              </button>
              <button
                onClick={() => setActivePolicy('refund')}
                className="hover:text-zinc-300 transition-colors"
              >
                Refund & Cancellation
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Policy Modal */}
      <PolicyModal type={activePolicy} onClose={() => setActivePolicy(null)} />
    </>
  );
};
