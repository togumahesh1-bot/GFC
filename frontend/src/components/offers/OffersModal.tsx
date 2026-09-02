import React from 'react';
import { X, Tag, Copy, Check, Sparkles, Percent, Gift } from 'lucide-react';
import { db } from '../../db/storage';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Coupon } from '../../types';

interface OffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMenu: () => void;
}

export const OffersModal: React.FC<OffersModalProps> = ({
  isOpen,
  onClose,
  onNavigateToMenu,
}) => {
  const { applyCoupon, appliedCoupon, setIsCartOpen } = useCart();
  const { showToast } = useToast();
  const coupons = db.getCoupons();

  if (!isOpen) return null;

  const handleApply = (coupon: Coupon) => {
    const res = applyCoupon(coupon.code);
    if (res.success) {
      onClose();
      setIsCartOpen(true);
    } else {
      showToast(res.message, 'info');
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Coupon code ${code} copied to clipboard!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg font-display">Special Offers & Deals</h3>
              <p className="text-xs text-zinc-400">Exclusive discounts from Gangamma Fast Food</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Coupons List */}
        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          {coupons.map((coupon) => {
            const isApplied = appliedCoupon?.code === coupon.code;

            return (
              <div
                key={coupon.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isApplied
                    ? 'bg-emerald-950/40 border-emerald-600 shadow-md'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs">
                        {coupon.code}
                      </span>
                      {isApplied && (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Active on Cart
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-white text-sm mt-2 font-display">{coupon.title}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">{coupon.description}</p>
                    <p className="text-[10px] text-zinc-500 mt-1.5">
                      Min. Order: ₹{coupon.minOrderAmount} • Expires: {coupon.validUntil}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleApply(coupon)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        isApplied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 hover:bg-amber-400 text-black shadow'
                      }`}
                    >
                      {isApplied ? 'Applied' : 'Apply'}
                    </button>

                    <button
                      onClick={() => handleCopy(coupon.code)}
                      className="px-2.5 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors"
                      title="Copy code"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Daily Specials Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-transparent border border-amber-500/30 text-xs text-zinc-300 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold font-display">
              <Sparkles className="w-4 h-4" />
              <span>Student & Office Saver Combos</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Get an extra 5% cashback on all takeaway orders during lunch hours (12:00 PM - 3:00 PM).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs">
          <span className="text-zinc-500 text-[11px]">Coupons apply at checkout</span>
          <button
            onClick={() => {
              onClose();
              onNavigateToMenu();
            }}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-colors"
          >
            Browse Menu Dishes
          </button>
        </div>
      </div>
    </div>
  );
};
