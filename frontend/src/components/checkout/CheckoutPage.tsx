import React, { useState } from 'react';
import {
  ArrowLeft,
  Bike,
  Store,
  MapPin,
  Phone,
  User,
  Mail,
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { db } from '../../db/storage';
import { Order, PaymentMethod } from '../../types';
import { RESTAURANT_INFO } from '../../data/initialData';
import { formatCurrency, generateOrderNumber } from '../../utils/helpers';
import { UpiPaymentModal } from '../common/UpiPaymentModal';

interface CheckoutPageProps {
  onBackToMenu: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onBackToMenu,
  onOrderSuccess,
}) => {
  const {
    items,
    orderType,
    setOrderType,
    appliedCoupon,
    loyaltyPointsToRedeem,
    subtotal,
    deliveryFee,
    couponDiscount,
    loyaltyDiscount,
    grandTotal,
    clearCart,
  } = useCart();

  const { currentUser, addSavedAddress } = useAuth();
  const { showToast } = useToast();

  // Customer details form state
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState(
    currentUser?.savedAddresses[0]?.address || ''
  );
  const [landmark, setLandmark] = useState(
    currentUser?.savedAddresses[0]?.landmark || ''
  );
  const [pincode, setPincode] = useState(
    currentUser?.savedAddresses[0]?.pincode || '500034'
  );
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(false);
  const [notes, setNotes] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, redirect
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h3 className="text-2xl font-bold text-white mb-2 font-display">No Items to Checkout</h3>
        <p className="text-sm text-zinc-400 mb-6">
          Your cart is currently empty. Please add delicious items from our menu first.
        </p>
        <button
          onClick={onBackToMenu}
          className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-all"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  const handleSavedAddressSelect = (addrId: string) => {
    const found = currentUser?.savedAddresses.find((a) => a.id === addrId);
    if (found) {
      setAddress(found.address);
      setLandmark(found.landmark || '');
      setPincode(found.pincode);
    }
  };

  const finalizeOrder = (isPaidOnline = false) => {
    const orderNumber = generateOrderNumber();
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      userId: currentUser?.id,
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        address: orderType === 'delivery' ? address.trim() : 'Self Takeaway at Counter',
        landmark: orderType === 'delivery' ? landmark.trim() : undefined,
        pincode: orderType === 'delivery' ? pincode.trim() : undefined,
        notes: notes.trim() || undefined,
      },
      items: items.map((item) => ({
        foodItemId: item.foodItem.id,
        name: item.foodItem.name,
        price: item.foodItem.price,
        quantity: item.quantity,
        isVeg: item.foodItem.isVeg,
        customization: item.customization,
        subtotal: item.totalPrice,
      })),
      orderType,
      subtotal,
      deliveryFee,
      discount: couponDiscount + loyaltyDiscount,
      couponCode: appliedCoupon?.code,
      loyaltyPointsUsed: loyaltyPointsToRedeem > 0 ? loyaltyPointsToRedeem : undefined,
      loyaltyDiscount: loyaltyDiscount > 0 ? loyaltyDiscount : undefined,
      totalAmount: grandTotal,
      paymentMethod,
      paymentStatus: isPaidOnline ? 'paid' : 'pending',
      status: 'Placed',
      statusTimestamps: {
        placedAt: now,
      },
      estimatedDeliveryTime: orderType === 'delivery' ? '25-35 mins' : '15-20 mins',
      createdAt: now,
    };

    // Save order in database
    db.createOrder(newOrder);

    // If user asked to save address
    if (saveAddressToProfile && currentUser && orderType === 'delivery' && address) {
      addSavedAddress({
        label: 'Home',
        address: address.trim(),
        landmark: landmark.trim() || undefined,
        pincode: pincode.trim(),
      });
    }

    clearCart();
    showToast(`Order ${orderNumber} placed successfully! 🎉`, 'success');
    onOrderSuccess(newOrder);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    if (orderType === 'delivery') {
      if (!address.trim()) {
        showToast('Please enter your delivery street address', 'error');
        return;
      }
      if (!pincode.trim()) {
        showToast('Please enter your 6-digit pincode', 'error');
        return;
      }
    }

    if (paymentMethod === 'upi') {
      // Open simulated UPI QR modal
      setIsUpiModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      finalizeOrder(false);
    }, 600);
  };

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
        {/* Top Back Navigation */}
        <button
          onClick={onBackToMenu}
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white font-display">Secure Checkout</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Direct ordering from Gangamma Fast Food • No third-party platform markups
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-700/50 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Guaranteed Freshness</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Customer Details & Preferences */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Order Type Toggle */}
            <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 mb-3 font-display">
                1. Select Order Type
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    orderType === 'delivery'
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Bike className={`w-5 h-5 ${orderType === 'delivery' ? 'text-amber-400' : 'text-zinc-500'}`} />
                    {orderType === 'delivery' && (
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    )}
                  </div>
                  <p className="font-bold text-sm text-white">Home Delivery</p>
                  <p className="text-xs text-zinc-400 mt-0.5">Hot delivery in 25-35 mins</p>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('takeaway')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    orderType === 'takeaway'
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Store className={`w-5 h-5 ${orderType === 'takeaway' ? 'text-amber-400' : 'text-zinc-500'}`} />
                    {orderType === 'takeaway' && (
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    )}
                  </div>
                  <p className="font-bold text-sm text-white">Self Takeaway / Pickup</p>
                  <p className="text-xs text-zinc-400 mt-0.5">Ready in 15 mins at counter</p>
                </button>
              </div>
            </div>

            {/* 2. Customer Contact Details */}
            <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 font-display">
                2. Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mahesh Togu"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Phone Number (for Delivery Updates) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Email Address (Optional receipt)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      placeholder="e.g. name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Delivery Address (Only if Delivery selected) */}
            {orderType === 'delivery' && (
              <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 font-display">
                    3. Delivery Destination
                  </h3>
                  {currentUser?.savedAddresses && currentUser.savedAddresses.length > 0 && (
                    <span className="text-xs text-amber-400 font-semibold">
                      Saved addresses available
                    </span>
                  )}
                </div>

                {/* Quick saved addresses pills */}
                {currentUser?.savedAddresses && currentUser.savedAddresses.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {currentUser.savedAddresses.map((addr) => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => handleSavedAddressSelect(addr.id)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500 text-xs text-zinc-300 font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>Use {addr.label} ({addr.pincode})</span>
                      </button>
                    ))}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    House / Flat No, Street, Colony *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="e.g. Flat 302, Sai Residency, Road No. 4, Banjara Hills"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Nearby Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Near Water Tank or Apollo Pharmacy"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 500034"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {currentUser && (
                  <label className="flex items-center gap-2.5 text-xs text-zinc-400 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={saveAddressToProfile}
                      onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-zinc-950 border-zinc-700"
                    />
                    <span>Save this address to my profile for 1-click reorders</span>
                  </label>
                )}
              </div>
            )}

            {/* 4. Payment Method Selection */}
            <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 font-display">
                {orderType === 'delivery' ? '4.' : '3.'} Payment Option
              </h3>

              <div className="space-y-2.5">
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-amber-500/10 border-amber-500 text-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="w-4 h-4 text-amber-500 focus:ring-amber-400 bg-zinc-900 border-zinc-700"
                    />
                    <div>
                      <span className="text-sm font-bold text-white block">
                        {orderType === 'delivery'
                          ? 'Cash on Delivery (COD)'
                          : 'Pay at Restaurant Counter'}
                      </span>
                      <span className="text-xs text-zinc-400">
                        Pay cash or UPI scan when your food arrives
                      </span>
                    </div>
                  </div>
                  <Banknote className="w-5 h-5 text-amber-400" />
                </label>

                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-amber-500/10 border-amber-500 text-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="w-4 h-4 text-amber-500 focus:ring-amber-400 bg-zinc-900 border-zinc-700"
                    />
                    <div>
                      <span className="text-sm font-bold text-white block flex items-center gap-2">
                        <span>Instant UPI QR Payment</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-400 text-[10px] font-bold border border-emerald-700/50">
                          Fastest
                        </span>
                      </span>
                      <span className="text-xs text-zinc-400">
                        Google Pay, PhonePe, Paytm, BHIM, CRED
                      </span>
                    </div>
                  </div>
                  <QrCode className="w-5 h-5 text-amber-400" />
                </label>

                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all opacity-75 ${
                    paymentMethod === 'card'
                      ? 'bg-amber-500/10 border-amber-500 text-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="w-4 h-4 text-amber-500 focus:ring-amber-400 bg-zinc-900 border-zinc-700"
                    />
                    <div>
                      <span className="text-sm font-bold text-white block">
                        Credit / Debit Card / NetBanking
                      </span>
                      <span className="text-xs text-zinc-400">
                        Visa, Mastercard, Rupay, NetBanking
                      </span>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-zinc-400" />
                </label>
              </div>
            </div>

            {/* Kitchen Instructions */}
            <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 font-display">
                Delivery / Cooking Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Ring doorbell, deliver on 3rd floor, keep hot..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

          </div>

          {/* Right Column: Order Items Review & Final Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 sticky top-24 space-y-5">
              <h3 className="text-base font-bold text-white font-display border-b border-zinc-800 pb-3 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                  {items.length} dishes
                </span>
              </h3>

              {/* Items list */}
              <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 text-xs">
                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-start justify-between gap-3 py-1.5 border-b border-zinc-800/50 last:border-0"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.foodItem.isVeg ? 'bg-emerald-400' : 'bg-rose-400'
                          }`}
                        ></span>
                        <span className="font-bold text-zinc-200">
                          {item.foodItem.name}
                        </span>
                        <span className="text-zinc-500 font-bold">x{item.quantity}</span>
                      </div>
                      {item.customization.spiceLevel && (
                        <p className="text-[10px] text-zinc-500 ml-3.5">
                          {item.customization.spiceLevel}
                          {item.customization.extraCheese && ', +Cheese'}
                          {item.customization.extraSauce && ', +Sauce'}
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-zinc-200 shrink-0">
                      {formatCurrency(item.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="space-y-2 text-xs border-t border-zinc-800 pt-4">
                <div className="flex justify-between text-zinc-400">
                  <span>Item Subtotal</span>
                  <span className="text-zinc-200 font-semibold">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between text-zinc-400">
                  <span>Delivery Fee</span>
                  <span className="text-zinc-200 font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
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
                    <span>Loyalty Discount</span>
                    <span>-{formatCurrency(loyaltyDiscount)}</span>
                  </div>
                )}

                <div className="border-t border-zinc-800 pt-3 flex justify-between text-base font-extrabold text-white">
                  <span>Grand Total</span>
                  <span className="text-amber-400 text-xl font-display">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Loyalty points to earn */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  You will earn <b>+{Math.floor(grandTotal / 10)} Loyalty Points</b> upon successful delivery!
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-base shadow-xl shadow-amber-500/30 transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Your Order...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                    <span>Place Order ({formatCurrency(grandTotal)})</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-zinc-500 text-center">
                By placing your order, you agree to Gangamma Fast Food terms & conditions.
              </p>
            </div>
          </div>

        </form>
      </div>

      {/* UPI QR Code Scanner Modal */}
      <UpiPaymentModal
        amount={grandTotal}
        isOpen={isUpiModalOpen}
        onClose={() => setIsUpiModalOpen(false)}
        onPaymentSuccess={() => {
          setIsUpiModalOpen(false);
          finalizeOrder(true);
        }}
      />
    </>
  );
};
