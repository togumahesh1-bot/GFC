import React, { useState } from 'react';
import {
  User as UserIcon,
  ShoppingBag,
  Heart,
  Sparkles,
  MapPin,
  Clock,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { db } from '../../db/storage';
import { FoodItem } from '../../types';
import { formatCurrency, getStatusConfig } from '../../utils/helpers';
import { RESTAURANT_INFO } from '../../data/initialData';

interface CustomerDashboardProps {
  onNavigateToMenu: () => void;
  onTrackOrder: (orderId: string) => void;
  onSelectFoodItem: (item: FoodItem) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onNavigateToMenu,
  onTrackOrder,
  onSelectFoodItem,
}) => {
  const {
    currentUser,
    updateProfile,
    addSavedAddress,
    removeSavedAddress,
    toggleFavorite,
    logout,
    loginAsAdmin,
  } = useAuth();
  const { reorderPastOrder, addItem } = useCart();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'orders' | 'favorites' | 'loyalty' | 'addresses' | 'profile'
  >('orders');

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');

  // Add address modal state
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [addressLabel, setAddressLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressLandmark, setAddressLandmark] = useState('');
  const [addressPincode, setAddressPincode] = useState('500034');

  if (!currentUser) return null;

  const orders = db.getUserOrders(currentUser.id);
  const activeOrders = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const pastOrders = orders.filter((o) => o.status === 'Delivered' || o.status === 'Cancelled');

  const allFood = db.getFoodItems();
  const favoriteItems = allFood.filter((f) => currentUser.favorites?.includes(f.id));
  const loyaltyTransactions = db.getLoyaltyTransactions(currentUser.id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(editName, editPhone);
    setIsEditingProfile(false);
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressStreet.trim() || !addressPincode.trim()) {
      showToast('Please enter both address and pincode', 'error');
      return;
    }
    addSavedAddress({
      label: addressLabel,
      address: addressStreet.trim(),
      landmark: addressLandmark.trim() || undefined,
      pincode: addressPincode.trim(),
    });
    setAddressStreet('');
    setAddressLandmark('');
    setIsAddAddressOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Profile Overview Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-black text-2xl font-black shadow-lg">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white font-display">{currentUser.name}</h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold">
                Foodie Member
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{currentUser.phone} • {currentUser.email}</p>
          </div>
        </div>

        {/* Loyalty Points Pill & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
                Loyalty Points
              </span>
              <span className="text-base font-extrabold text-amber-400">
                {currentUser.loyaltyPoints} Pts (₹{currentUser.loyaltyPoints})
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('profile')}
            className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
            title="Edit Profile"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-zinc-800 pb-2 mb-6 scrollbar-none">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'favorites'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>My Favorites ({favoriteItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('loyalty')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'loyalty'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Loyalty Rewards ({currentUser.loyaltyPoints})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'addresses'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses ({currentUser.savedAddresses?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Active Live Orders Section */}
          {activeOrders.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 font-display">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                <span>Active Orders in Progress</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeOrders.map((ord) => {
                  const status = getStatusConfig(ord.status);
                  return (
                    <div
                      key={ord.id}
                      className="p-5 rounded-3xl bg-zinc-900 border border-amber-500/40 shadow-xl space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-amber-400 text-base">
                          {ord.orderNumber}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${status.badgeColor}`}>
                          {status.label}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-300">
                        {ord.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
                        <span className="font-extrabold text-white">
                          {formatCurrency(ord.totalAmount)}
                        </span>
                        <button
                          onClick={() => onTrackOrder(ord.orderNumber)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1 transition-colors"
                        >
                          <span>Live Track</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Past Orders Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 font-display">
              Order History
            </h3>

            {pastOrders.length === 0 && activeOrders.length === 0 ? (
              <div className="p-10 rounded-3xl bg-zinc-900 border border-zinc-800 text-center">
                <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
                <p className="text-sm text-zinc-300 font-bold font-display">No Orders Yet</p>
                <p className="text-xs text-zinc-500 mb-4">Start by ordering your favorite dishes from Gangamma Fast Food</p>
                <button
                  onClick={onNavigateToMenu}
                  className="px-5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs"
                >
                  Order Food Now
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {pastOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-white text-sm">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          {new Date(ord.createdAt).toLocaleDateString()} at{' '}
                          {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.status === 'Delivered' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400'
                        }`}>
                          {ord.status}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-400 mt-1.5 line-clamp-1">
                        {ord.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-extrabold text-amber-400">
                        {formatCurrency(ord.totalAmount)}
                      </span>

                      <button
                        onClick={() => reorderPastOrder(ord)}
                        className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                        <span>Order Again</span>
                      </button>

                      <button
                        onClick={() => onTrackOrder(ord.orderNumber)}
                        className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-white transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Favorites */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-display">My Favorite Dishes</h3>
              <p className="text-xs text-zinc-400">Quickly reorder your loved meals</p>
            </div>
          </div>

          {favoriteItems.length === 0 ? (
            <div className="p-10 rounded-3xl bg-zinc-900 border border-zinc-800 text-center">
              <Heart className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm text-zinc-300 font-bold font-display">No Favorites Saved</p>
              <p className="text-xs text-zinc-500 mb-4">Click the heart icon on any food item to save it here</p>
              <button
                onClick={onNavigateToMenu}
                className="px-5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center gap-4 group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate font-display">{item.name}</h4>
                    <p className="text-xs text-amber-400 font-bold mt-0.5">
                      {formatCurrency(item.price)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => addItem(item, 1)}
                        className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors"
                      >
                        + Add
                      </button>
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Loyalty System */}
      {activeTab === 'loyalty' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/20 via-zinc-900 to-zinc-900 border border-amber-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-display">
                  Gangamma Rewards Club
                </span>
                <h3 className="text-3xl font-black text-white mt-1 font-display">
                  {currentUser.loyaltyPoints} Points Available
                </h3>
                <p className="text-xs text-zinc-300 mt-1">
                  Worth <b>₹{currentUser.loyaltyPoints} discount</b> on your next order!
                </p>
              </div>

              <button
                onClick={onNavigateToMenu}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-colors"
              >
                Redeem on Menu
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-zinc-800 text-xs">
              <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800">
                <span className="text-amber-400 font-bold block mb-1">1. Earn Points</span>
                <p className="text-zinc-400">Earn 10 points for every ₹100 spent on any direct order.</p>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800">
                <span className="text-amber-400 font-bold block mb-1">2. 1 Pt = ₹1</span>
                <p className="text-zinc-400">Simple 1:1 redemption value with zero hidden caps or expiry.</p>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800">
                <span className="text-amber-400 font-bold block mb-1">3. Direct Savings</span>
                <p className="text-zinc-400">Apply points directly with the slider at checkout!</p>
              </div>
            </div>
          </div>

          {/* Points History */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400 font-display">
              Points History
            </h4>

            {loyaltyTransactions.length === 0 ? (
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-center text-xs text-zinc-400">
                No points transactions recorded yet. Complete your first food order to earn points!
              </div>
            ) : (
              <div className="space-y-2">
                {loyaltyTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{tx.description}</span>
                      <span className="text-[11px] text-zinc-500">
                        {new Date(tx.date).toLocaleDateString()}
                      </span>
                    </div>

                    <span
                      className={`font-black text-sm ${
                        tx.type === 'earned' ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {tx.type === 'earned' ? `+${tx.points}` : `-${tx.points}`} Pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-display">Saved Delivery Addresses</h3>
              <p className="text-xs text-zinc-400">Manage addresses for one-tap checkout</p>
            </div>
            <button
              onClick={() => setIsAddAddressOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Address</span>
            </button>
          </div>

          {currentUser.savedAddresses?.length === 0 ? (
            <div className="p-10 rounded-3xl bg-zinc-900 border border-zinc-800 text-center">
              <MapPin className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm text-zinc-300 font-bold font-display">No Saved Addresses</p>
              <p className="text-xs text-zinc-500 mb-4">Add your home or office address to save time during checkout</p>
              <button
                onClick={() => setIsAddAddressOpen(true)}
                className="px-5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs"
              >
                + Add Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentUser.savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] text-zinc-400">Default</span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-200 leading-relaxed font-medium">
                      {addr.address}
                    </p>
                    {addr.landmark && (
                      <p className="text-[11px] text-zinc-400 mt-1">
                        Landmark: {addr.landmark}
                      </p>
                    )}
                    <p className="text-[11px] text-zinc-400">Pincode: {addr.pincode}</p>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-zinc-800">
                    <button
                      onClick={() => removeSavedAddress(addr.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Address Modal */}
          {isAddAddressOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
                <h3 className="text-base font-bold text-white mb-4 font-display">Add Delivery Address</h3>
                <form onSubmit={handleAddAddressSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Address Label</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Home', 'Work', 'Other'] as const).map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setAddressLabel(l)}
                          className={`py-1.5 rounded-xl font-bold border transition-colors ${
                            addressLabel === l
                              ? 'bg-amber-500 text-black border-amber-500'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-300'
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Complete Address *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="House/Flat No., Apartment, Street"
                      value={addressStreet}
                      onChange={(e) => setAddressStreet(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Beside Temple"
                      value={addressLandmark}
                      onChange={(e) => setAddressLandmark(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 500034"
                      value={addressPincode}
                      onChange={(e) => setAddressPincode(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddAddressOpen(false)}
                      className="flex-1 py-2 rounded-xl bg-zinc-800 text-white font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-amber-500 text-black font-bold"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="max-w-xl space-y-6">
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <h3 className="text-base font-bold text-white font-display">Personal Details</h3>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Mobile Phone Number</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-3 text-zinc-500 cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Log out of your account</p>
              <p className="text-xs text-zinc-400">You can always log back in anytime</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
