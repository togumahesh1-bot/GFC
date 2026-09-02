import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  PhoneCall,
  MessageSquare,
  Bike,
  UtensilsCrossed,
  Sparkles,
  Star,
  ChevronRight,
  RotateCcw,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { db, subscribeToStorageChanges } from '../../db/storage';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { RESTAURANT_INFO } from '../../data/initialData';
import { formatCurrency, getStatusConfig } from '../../utils/helpers';

interface OrderTrackingPageProps {
  initialOrderId?: string | null;
  onNavigateToMenu: () => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrderId,
  onNavigateToMenu,
}) => {
  const { reorderPastOrder } = useCart();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [searchInput, setSearchInput] = useState(initialOrderId || '');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Load active or requested order
  const loadOrder = () => {
    const activeId = initialOrderId || db.getActiveOrderId();
    if (searchInput.trim()) {
      const found = db.getOrderById(searchInput.trim());
      setCurrentOrder(found || null);
    } else if (activeId) {
      const found = db.getOrderById(activeId);
      setCurrentOrder(found || null);
    } else {
      // Pick latest order by user if available
      const all = db.getOrders();
      if (currentUser) {
        const userOrders = db.getUserOrders(currentUser.id);
        setCurrentOrder(userOrders[0] || all[0] || null);
      } else {
        setCurrentOrder(all[0] || null);
      }
    }
  };

  useEffect(() => {
    loadOrder();
  }, [initialOrderId]);

  // Subscribe to real-time storage changes (e.g. when admin changes order status)
  useEffect(() => {
    const unsubscribe = subscribeToStorageChanges(() => {
      if (currentOrder) {
        const fresh = db.getOrderById(currentOrder.id);
        if (fresh) setCurrentOrder(fresh);
      } else {
        loadOrder();
      }
    });
    return unsubscribe;
  }, [currentOrder?.id]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const found = db.getOrderById(searchInput.trim());
    if (found) {
      setCurrentOrder(found);
    } else {
      showToast(`No order found matching "${searchInput}"`, 'error');
    }
  };

  const handleCancelOrder = () => {
    if (!currentOrder) return;
    if (currentOrder.status !== 'Placed') {
      showToast('Order cannot be cancelled because kitchen preparation has already begun', 'error');
      return;
    }
    db.updateOrderStatus(currentOrder.id, 'Cancelled');
    showToast('Order has been cancelled', 'info');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrder) return;

    db.addReview({
      id: 'rev-' + Date.now(),
      userId: currentUser?.id,
      customerName: currentOrder.customer.name || 'Happy Customer',
      rating: reviewRating,
      comment: reviewComment.trim() || 'Food was delicious and delivered hot!',
      orderNumber: currentOrder.orderNumber,
      date: 'Just now',
      isVerifiedPurchase: true,
      isApproved: true,
    });

    setIsReviewModalOpen(false);
    setReviewComment('');
    showToast('Thank you for rating your food experience! ⭐', 'success');
  };

  const timelineSteps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'Placed', label: 'Order Placed', desc: 'Received at restaurant' },
    { key: 'Accepted', label: 'Order Accepted', desc: 'Confirmed by kitchen' },
    { key: 'Preparing', label: 'Preparing', desc: 'Chef cooking fresh' },
    { key: 'Ready', label: 'Food Ready', desc: 'Packed & ready' },
    { key: 'Out for Delivery', label: currentOrder?.orderType === 'takeaway' ? 'Ready for Pickup' : 'Out for Delivery', desc: currentOrder?.orderType === 'takeaway' ? 'Awaiting pickup' : 'On the way to you' },
    { key: 'Delivered', label: currentOrder?.orderType === 'takeaway' ? 'Picked Up' : 'Delivered', desc: 'Enjoy your delicious meal!' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Placed': return 0;
      case 'Accepted': return 1;
      case 'Preparing': return 2;
      case 'Ready': return 3;
      case 'Out for Delivery': return 4;
      case 'Delivered': return 5;
      case 'Cancelled': return -1;
    }
  };

  const currentStepIndex = currentOrder ? getStepIndex(currentOrder.status) : 0;
  const statusInfo = currentOrder ? getStatusConfig(currentOrder.status) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-display">Live Order Tracker</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time kitchen updates & delivery status for Gangamma Fast Food
          </p>
        </div>

        {/* Order Lookup Search */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-sm w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search Order ID (e.g. #GF1025)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3 py-2 text-xs text-white uppercase placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors shrink-0"
          >
            Track
          </button>
        </form>
      </div>

      {!currentOrder ? (
        <div className="p-12 rounded-3xl bg-zinc-900 border border-zinc-800 text-center">
          <Clock className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white font-display">No Active Orders Found</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 mb-6">
            Enter an Order ID above or place your favorite order from Gangamma Fast Food to start live tracking!
          </p>
          <button
            onClick={onNavigateToMenu}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all"
          >
            Explore Food Menu
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Main Status Hero Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl relative overflow-hidden">
            {/* Background ambient gradient */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-2xl font-black text-amber-400 tracking-tight">
                    {currentOrder.orderNumber}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${statusInfo?.badgeColor}`}>
                    {statusInfo?.label}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Placed on {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {currentOrder.orderType === 'delivery' ? 'Home Delivery' : 'Takeaway Pickup'}
                </p>
              </div>

              {/* Estimated Countdown Timer */}
              {currentOrder.status !== 'Delivered' && currentOrder.status !== 'Cancelled' && (
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center animate-pulse">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
                      Estimated Time
                    </span>
                    <span className="text-sm font-extrabold text-white">
                      {currentOrder.estimatedDeliveryTime}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Step-by-Step Status Timeline */}
            {currentOrder.status === 'Cancelled' ? (
              <div className="py-8 text-center text-rose-400">
                <XCircle className="w-12 h-12 mx-auto mb-2 text-rose-500" />
                <h4 className="text-lg font-bold">This order was cancelled</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  If this was a mistake or you have questions, please reach out to our team.
                </p>
              </div>
            ) : (
              <div className="py-8">
                {/* Progress bar container */}
                <div className="relative">
                  {/* Desktop line */}
                  <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-zinc-800 -z-0">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700"
                      style={{
                        width: `${(currentStepIndex / (timelineSteps.length - 1)) * 100}%`,
                      }}
                    ></div>
                  </div>

                  {/* Steps Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative z-10">
                    {timelineSteps.map((step, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;

                      return (
                        <div
                          key={step.key}
                          className={`flex flex-col items-center text-center ${
                            isCompleted ? 'text-white' : 'text-zinc-600'
                          }`}
                        >
                          {/* Dot / Icon */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                              isCompleted
                                ? isCurrent
                                  ? 'bg-amber-400 text-black ring-4 ring-amber-400/30 shadow-lg shadow-amber-400/30'
                                  : 'bg-emerald-500 text-white'
                                : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                            }`}
                          >
                            {isCompleted && !isCurrent ? (
                              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>

                          <p className={`text-xs font-bold mt-2.5 ${isCurrent ? 'text-amber-400' : ''}`}>
                            {step.label}
                          </p>
                          <p className="text-[10px] text-zinc-400 hidden sm:block mt-0.5">
                            {step.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status Message Highlight */}
                <div className="mt-8 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                    <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                      {statusInfo?.desc}
                    </p>
                  </div>

                  {currentOrder.status === 'Placed' && (
                    <button
                      onClick={handleCancelOrder}
                      className="text-xs text-rose-400 hover:text-rose-300 font-bold px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 shrink-0"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Delivery Details & Contact Options */}
            <div className="pt-6 border-t border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Delivery info */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-zinc-300">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Delivery Address</span>
                </div>
                <p className="text-zinc-300 pl-6 leading-relaxed">
                  <b>{currentOrder.customer.name}</b> ({currentOrder.customer.phone})<br />
                  {currentOrder.customer.address}
                  {currentOrder.customer.landmark && `, Near ${currentOrder.customer.landmark}`}
                  {currentOrder.customer.pincode && ` - ${currentOrder.customer.pincode}`}
                </p>
              </div>

              {/* Action Buttons: Call & WhatsApp */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-zinc-300 mb-0.5">Need immediate assistance?</p>
                  <p className="text-zinc-400 text-[11px]">
                    Direct line to Gangamma Fast Food kitchen manager
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${RESTAURANT_INFO.phone}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                    <span>Call Kitchen</span>
                  </a>

                  <a
                    href={`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=Hi%20Gangamma%20Fast%20Food%2C%20checking%20status%20for%20Order%20${encodeURIComponent(currentOrder.orderNumber)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-950 border border-emerald-700/60 hover:bg-emerald-900 text-emerald-300 font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Ordered Food Items List & Reorder Button */}
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white font-display">Items in this Order</h3>
              <button
                onClick={() => reorderPastOrder(currentOrder)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Order Again</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {currentOrder.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.isVeg ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    ></span>
                    <div>
                      <span className="font-bold text-zinc-200">{item.name}</span>
                      <span className="text-zinc-500 font-bold ml-2">x{item.quantity}</span>
                      {item.customization?.spiceLevel && (
                        <p className="text-[10px] text-zinc-500">
                          {item.customization.spiceLevel}
                          {item.customization.extraCheese && ', Extra Cheese'}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-zinc-200">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="pt-3 border-t border-zinc-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span>{formatCurrency(currentOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Delivery Fee</span>
                <span>{currentOrder.deliveryFee === 0 ? 'FREE' : formatCurrency(currentOrder.deliveryFee)}</span>
              </div>
              {currentOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-{formatCurrency(currentOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-sm text-white pt-2 border-t border-zinc-800/80">
                <span>Total Paid / Payable</span>
                <span className="text-amber-400 text-base">{formatCurrency(currentOrder.totalAmount)}</span>
              </div>
            </div>

            {/* Rate & Review Trigger if Delivered */}
            {currentOrder.status === 'Delivered' && (
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">How was your food?</p>
                  <p className="text-[11px] text-zinc-400">Share a quick review for our chef</p>
                </div>
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Star className="w-3.5 h-3.5 fill-black" />
                  <span>Rate Order</span>
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Rating & Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1 font-display">Rate Your Food</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Your feedback helps Gangamma Fast Food maintain quality and taste.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Star selector */}
              <div className="flex justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1.5 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= reviewRating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-zinc-700'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Write a review
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell others what you loved about the food, packing, or delivery speed..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
