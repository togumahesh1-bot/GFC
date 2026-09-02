import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  Sparkles,
  Check,
  Bike,
  Store,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { RESTAURANT_INFO } from '../../data/initialData';
import { formatCurrency, formatWhatsAppOrderMessage } from '../../utils/helpers';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onNavigateToMenu: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
  onNavigateToMenu,
}) => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    orderType,
    setOrderType,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    loyaltyPointsToRedeem,
    setLoyaltyPointsToRedeem,
    isCartOpen,
    setIsCartOpen,
    totalItemsCount,
    subtotal,
    deliveryFee,
    couponDiscount,
    loyaltyDiscount,
    totalDiscount,
    grandTotal,
    amountNeededForFreeDelivery,
  } = useCart();

  const { currentUser } = useAuth();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const handleWhatsAppOrder = () => {
    const text = formatWhatsAppOrderMessage(items, grandTotal, orderType);
    window.open(`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=${text}`, '_blank');
  };

  const maxPointsAvailable = currentUser ? currentUser.loyaltyPoints : 0;
  const maxPointsUsable = Math.min(maxPointsAvailable, Math.max(0, subtotal - couponDiscount));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-900 border-l border-zinc-800 text-zinc-100 flex flex-col shadow-2xl relative">
          
          {/* Header */}
          <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base font-display">Your Order Cart</h3>
                <p className="text-xs text-zinc-400">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-zinc-800/80 flex items-center justify-center mb-4 text-zinc-500">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              </div>
              <h4 className="text-lg font-bold text-white mb-1 font-display">Your Cart is Empty</h4>
              <p className="text-xs text-zinc-400 max-w-xs mb-6 leading-relaxed">
                Explore Gangamma Fast Food’s digital menu to add hot noodles, biryani, rolls, or snacks!
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onNavigateToMenu();
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400 transition-all"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              
              {/* Delivery / Takeaway Switch */}
              <div className="p-1.5 bg-zinc-950 rounded-2xl border border-zinc-800 grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    orderType === 'delivery'
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Bike className="w-4 h-4" />
                  <span>Home Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('takeaway')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    orderType === 'takeaway'
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Self Takeaway</span>
                </button>
              </div>

              {/* Free Delivery Bar (if delivery selected) */}
              {orderType === 'delivery' && (
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                  {amountNeededForFreeDelivery > 0 ? (
                    <div>
                      <div className="flex justify-between items-center text-zinc-300 font-semibold mb-1.5">
                        <span>Add <b>{formatCurrency(amountNeededForFreeDelivery)}</b> more for FREE delivery</span>
                        <span className="text-amber-400 font-bold">{formatCurrency(subtotal)} / {formatCurrency(RESTAURANT_INFO.minOrderForFreeDelivery)}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                          style={{
                            width: `${Math.min(100, (subtotal / RESTAURANT_INFO.minOrderForFreeDelivery) * 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Congratulations! You have unlocked FREE Delivery 🎉</span>
                    </div>
                  )}
                </div>
              )}

              {/* Cart Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
                  <span>Selected Items</span>
                  <button
                    onClick={clearCart}
                    className="text-rose-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3 h-3" /> Clear All
                  </button>
                </div>

                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-start gap-3 relative group"
                  >
                    {/* Thumbnail */}
                    <img
                      src={item.foodItem.image}
                      alt={item.foodItem.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-zinc-800"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h5 className="font-bold text-sm text-white truncate font-display">
                          {item.foodItem.name}
                        </h5>
                        <button
                          onClick={() => removeItem(item.cartItemId)}
                          className="text-zinc-500 hover:text-rose-400 p-1 transition-colors"
                          title="Remove item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Customizations tags */}
                      <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-zinc-400">
                        {item.customization.spiceLevel && (
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-amber-300">
                            {item.customization.spiceLevel}
                          </span>
                        )}
                        {item.customization.extraCheese && (
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                            +Cheese
                          </span>
                        )}
                        {item.customization.extraSauce && (
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                            +Sauce
                          </span>
                        )}
                        {item.customization.extraOnions && (
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                            +Onions
                          </span>
                        )}
                        {item.customization.extraQuantity && (
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400">
                            +Jumbo
                          </span>
                        )}
                        {item.customization.instructions && (
                          <span className="italic text-zinc-500">"{item.customization.instructions}"</span>
                        )}
                      </div>

                      {/* Price & Quantity Controls */}
                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="text-sm font-extrabold text-amber-400">
                          {formatCurrency(item.totalPrice)}
                        </span>

                        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="p-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="p-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code Section */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300 font-display">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Restaurant Promo Coupon</span>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-700/50 text-xs">
                    <div>
                      <span className="font-mono font-bold text-emerald-300">
                        {appliedCoupon.code}
                      </span>
                      <p className="text-[11px] text-emerald-400 mt-0.5">
                        {appliedCoupon.title} (-{formatCurrency(couponDiscount)})
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-semibold text-rose-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. GANGAMMA10"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponError && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{couponError}</span>
                  </p>
                )}

                {/* Quick Coupon Suggestions */}
                {!appliedCoupon && (
                  <div className="pt-1 flex flex-wrap gap-1.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => applyCoupon('GANGAMMA10')}
                      className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-amber-300 hover:border-amber-500 font-mono text-[10px]"
                    >
                      GANGAMMA10
                    </button>
                    <button
                      type="button"
                      onClick={() => applyCoupon('FIRST50')}
                      className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-amber-300 hover:border-amber-500 font-mono text-[10px]"
                    >
                      FIRST50
                    </button>
                  </div>
                )}
              </div>

              {/* Customer Loyalty Points Redemption */}
              {currentUser && maxPointsAvailable > 0 && (
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-300 flex items-center gap-1.5 font-display">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Gangamma Loyalty Points</span>
                    </span>
                    <span className="font-semibold text-amber-400">
                      Balance: {maxPointsAvailable} Pts
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Use your points to get instant cash discount on this order (1 Point = ₹1).
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="range"
                      min="0"
                      max={maxPointsUsable}
                      value={loyaltyPointsToRedeem}
                      onChange={(e) => setLoyaltyPointsToRedeem(Number(e.target.value))}
                      className="flex-1 accent-amber-500 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-amber-300 min-w-[50px] text-right">
                      {loyaltyPointsToRedeem} Pts
                    </span>
                  </div>

                  {loyaltyPointsToRedeem > 0 && (
                    <div className="text-[11px] text-emerald-400 font-medium">
                      ✓ Redeeming {loyaltyPointsToRedeem} points saves {formatCurrency(loyaltyPointsToRedeem)}
                    </div>
                  )}
                </div>
              )}

              {/* Bill Details Summary */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
                <h5 className="font-bold text-zinc-300 uppercase tracking-wider mb-2 font-display">
                  Bill Summary
                </h5>

                <div className="flex justify-between text-zinc-400">
                  <span>Item Subtotal</span>
                  <span className="text-zinc-200 font-semibold">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between text-zinc-400">
                  <span>Delivery Fee ({orderType === 'delivery' ? 'Home Delivery' : 'Pickup'})</span>
                  <span className="text-zinc-200 font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-400 uppercase font-bold">FREE</span>
                    ) : (
                      formatCurrency(deliveryFee)
                    )}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Coupon Discount ({appliedCoupon?.code})</span>
                    <span>-{formatCurrency(couponDiscount)}</span>
                  </div>
                )}

                {loyaltyDiscount > 0 && (
                  <div className="flex justify-between text-amber-400 font-medium">
                    <span>Loyalty Points Redeemed</span>
                    <span>-{formatCurrency(loyaltyDiscount)}</span>
                  </div>
                )}

                <div className="border-t border-zinc-800 pt-2 flex justify-between text-sm font-extrabold text-white">
                  <span>To Pay</span>
                  <span className="text-amber-400 text-base">{formatCurrency(grandTotal)}</span>
                </div>

                {currentUser && (
                  <div className="text-[11px] text-amber-300/80 pt-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>You will earn <b>+{Math.floor(grandTotal / 10)} Loyalty Points</b> on this order!</span>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Sticky Checkout Footer */}
          {items.length > 0 && (
            <div className="p-4 bg-zinc-950 border-t border-zinc-800 space-y-2.5">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-sm shadow-xl shadow-amber-500/25 flex items-center justify-between px-5 transition-all transform active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <span className="bg-black/25 px-2 py-0.5 rounded text-xs font-mono font-bold">
                    {totalItemsCount} items
                  </span>
                  <span>Proceed to Checkout</span>
                </div>
                <div className="flex items-center gap-1 text-base">
                  <span>{formatCurrency(grandTotal)}</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </div>
              </button>

              {/* Direct WhatsApp Ordering option */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                title="Send current cart as formatted order on WhatsApp"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Order Directly on WhatsApp</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
