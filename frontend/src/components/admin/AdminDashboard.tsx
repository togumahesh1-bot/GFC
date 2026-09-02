import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Tag,
  Star,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Bike,
  AlertCircle,
  Search,
  DollarSign,
  TrendingUp,
  Printer,
  ChevronRight,
  Eye,
  EyeOff,
  Phone,
  Store,
  RefreshCw,
} from 'lucide-react';
import { db, subscribeToStorageChanges } from '../../db/storage';
import { Order, OrderStatus, FoodItem, FoodCategory, Coupon, Review } from '../../types';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, getStatusConfig } from '../../utils/helpers';
import { RESTAURANT_INFO } from '../../data/initialData';

const ALL_CATEGORIES: FoodCategory[] = [
  'Fast Food',
  'Rice Items',
  'Noodles',
  'Fried Items',
  'Breakfast',
  'Snacks',
  'Meals',
  'Beverages',
  'Special Items',
];

export const AdminDashboard: React.FC = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'orders' | 'menu' | 'analytics' | 'coupons' | 'reviews' | 'settings'
  >('orders');

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => db.getOrders());
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [selectedOrderForBill, setSelectedOrderForBill] = useState<Order | null>(null);

  // Menu items state
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => db.getFoodItems());
  const [menuSearch, setMenuSearch] = useState('');
  const [isAddEditFoodOpen, setIsAddEditFoodOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);

  // Food Form state
  const [foodName, setFoodName] = useState('');
  const [foodCategory, setFoodCategory] = useState<FoodCategory>('Fast Food');
  const [foodPrice, setFoodPrice] = useState<number>(100);
  const [foodIsVeg, setFoodIsVeg] = useState(true);
  const [foodDescription, setFoodDescription] = useState('');
  const [foodImage, setFoodImage] = useState('');
  const [foodPrepTime, setFoodPrepTime] = useState<number>(15);
  const [foodIsSpecial, setFoodIsSpecial] = useState(false);
  const [foodDiscount, setFoodDiscount] = useState<number>(0);

  // Coupons state
  const [coupons, setCoupons] = useState<Coupon[]>(() => db.getCoupons());
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponTitle, setNewCouponTitle] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState<number>(20);
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'flat'>('percentage');
  const [newCouponMin, setNewCouponMin] = useState<number>(199);

  // Restaurant operational settings state
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [deliveryMinOrder, setDeliveryMinOrder] = useState(RESTAURANT_INFO.minOrderForFreeDelivery);

  const refreshData = () => {
    setOrders(db.getOrders());
    setFoodItems(db.getFoodItems());
    setCoupons(db.getCoupons());
  };

  useEffect(() => {
    return subscribeToStorageChanges(() => {
      refreshData();
    });
  }, []);

  // Filtered orders
  const filteredOrders = orders
    .filter((o) => {
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        return (
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.phone.includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Analytics Computations
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);
  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  ).length;
  const completedOrdersCount = orders.filter((o) => o.status === 'Delivered').length;
  const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Order status transition handlers
  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    db.updateOrderStatus(orderId, newStatus);
    showToast(`Order status updated to "${newStatus}"`, 'success');
    refreshData();
  };

  // Menu item availability toggle
  const handleToggleFoodAvailability = (item: FoodItem) => {
    db.toggleFoodAvailability(item.id);
    showToast(`${item.name} availability toggled`, 'info');
    refreshData();
  };

  // Delete Food Item
  const handleDeleteFood = (itemId: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the menu?`)) {
      db.deleteFoodItem(itemId);
      showToast(`Removed "${name}" from menu`, 'info');
      refreshData();
    }
  };

  // Open Edit Food Modal
  const handleOpenEditFood = (item: FoodItem) => {
    setEditingFood(item);
    setFoodName(item.name);
    setFoodCategory(item.category);
    setFoodPrice(item.price);
    setFoodIsVeg(item.isVeg);
    setFoodDescription(item.description);
    setFoodImage(item.image);
    setFoodPrepTime(item.prepTimeMinutes);
    setFoodIsSpecial(item.isSpecial || false);
    setFoodDiscount(item.discountPercent || 0);
    setIsAddEditFoodOpen(true);
  };

  const handleOpenAddFood = () => {
    setEditingFood(null);
    setFoodName('');
    setFoodCategory('Fast Food');
    setFoodPrice(100);
    setFoodIsVeg(true);
    setFoodDescription('');
    setFoodImage('https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80');
    setFoodPrepTime(15);
    setFoodIsSpecial(false);
    setFoodDiscount(0);
    setIsAddEditFoodOpen(true);
  };

  const handleSaveFoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) {
      showToast('Please enter food item name', 'error');
      return;
    }

    if (editingFood) {
      db.saveFoodItem({
        ...editingFood,
        name: foodName.trim(),
        category: foodCategory,
        price: Number(foodPrice),
        isVeg: foodIsVeg,
        description: foodDescription.trim(),
        image: foodImage.trim(),
        prepTimeMinutes: Number(foodPrepTime),
        isSpecial: foodIsSpecial,
        discountPercent: Number(foodDiscount) || undefined,
      });
      showToast(`Updated "${foodName}" successfully!`, 'success');
    } else {
      db.saveFoodItem({
        id: 'food-' + Date.now(),
        name: foodName.trim(),
        category: foodCategory,
        price: Number(foodPrice),
        isVeg: foodIsVeg,
        description: foodDescription.trim(),
        image: foodImage.trim(),
        prepTimeMinutes: Number(foodPrepTime),
        ingredients: ['Fresh Vegetables', 'Secret Spices', 'Herbs'],
        rating: 4.8,
        ratingCount: 1,
        isAvailable: true,
        isPopular: false,
        isSpecial: foodIsSpecial,
        discountPercent: Number(foodDiscount) || undefined,
      });
      showToast(`Added "${foodName}" to menu!`, 'success');
    }

    setIsAddEditFoodOpen(false);
    refreshData();
  };

  // Add Coupon Submit
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    db.saveCoupon({
      id: 'cpn-' + Date.now(),
      code: newCouponCode.trim().toUpperCase(),
      title: newCouponTitle.trim() || `${newCouponDiscount}% Discount`,
      description: `Save ${newCouponType === 'flat' ? '₹' : ''}${newCouponDiscount}${newCouponType === 'percentage' ? '%' : ''} on minimum order of ₹${newCouponMin}`,
      discountType: newCouponType,
      discountValue: Number(newCouponDiscount),
      minOrderAmount: Number(newCouponMin),
      validUntil: '31 Dec 2026',
      isActive: true,
    });

    setNewCouponCode('');
    setNewCouponTitle('');
    showToast('Promo Coupon created successfully!', 'success');
    refreshData();
  };

  const handleDeleteCoupon = (id: string) => {
    db.deleteCoupon(id);
    showToast('Coupon removed', 'info');
    refreshData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Top Admin Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-black text-[11px] font-black uppercase tracking-wider">
              Manager Portal
            </span>
            <span className="text-xs text-zinc-400">Live Kitchen Display & Menu Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            Gangamma Fast Food — Operations Control
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Accept orders, manage food availability, update prices, and review sales analytics.
          </p>
        </div>

        {/* Live Store Open / Rush Hour Switch */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center gap-3">
            <span
              className={`w-3 h-3 rounded-full ${
                isStoreOpen ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'
              }`}
            ></span>
            <div>
              <span className="text-xs font-bold text-white block">
                {isStoreOpen ? 'Kitchen Accepting Orders' : 'Store Paused (Rush Hour)'}
              </span>
              <span className="text-[10px] text-zinc-400">
                {isStoreOpen ? 'Online customer checkout is active' : 'Orders paused'}
              </span>
            </div>
            <button
              onClick={() => {
                setIsStoreOpen(!isStoreOpen);
                showToast(
                  !isStoreOpen
                    ? 'Store is now LIVE and accepting orders'
                    : 'Store paused for rush hour',
                  'info'
                );
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                isStoreOpen
                  ? 'bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
              }`}
            >
              {isStoreOpen ? 'Pause Store' : 'Resume Orders'}
            </button>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-display">
            {formatCurrency(totalRevenue)}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">From {orders.length} total orders</span>
        </div>

        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active in Kitchen</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-display">
            {activeOrdersCount}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">Pending / Preparing orders</span>
        </div>

        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Orders</span>
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-display">
            {completedOrdersCount}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">Delivered successfully</span>
        </div>

        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Order Value</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-400 font-display">
            {formatCurrency(averageOrderValue)}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">Per customer ticket size</span>
        </div>
      </div>

      {/* Navigation Tabs */}
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
          <span>Live Orders ({activeOrdersCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'menu'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Menu Dishes ({foodItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'coupons'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Promo Coupons ({coupons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'reviews'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Reviews & Ratings</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Restaurant Settings</span>
        </button>
      </div>

      {/* TAB 1: LIVE ORDERS (Kitchen Display System) */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Filters and search row */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search order ID, customer name, phone..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Status pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(
                [
                  'all',
                  'Placed',
                  'Accepted',
                  'Preparing',
                  'Ready',
                  'Out for Delivery',
                  'Delivered',
                  'Cancelled',
                ] as const
              ).map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    orderStatusFilter === st
                      ? 'bg-amber-500 text-black shadow'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {st === 'all' ? 'All Orders' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Cards Grid */}
          {filteredOrders.length === 0 ? (
            <div className="p-12 rounded-3xl bg-zinc-900 border border-zinc-800 text-center text-xs text-zinc-400">
              No orders found matching the selected filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredOrders.map((ord) => {
                const statusInfo = getStatusConfig(ord.status);

                return (
                  <div
                    key={ord.id}
                    className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-4 relative"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-amber-400 text-lg">
                            {ord.orderNumber}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${statusInfo.badgeColor}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {new Date(ord.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          • {ord.orderType === 'delivery' ? '🛵 Home Delivery' : '🏪 Self Takeaway'}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-extrabold text-white font-display">
                          {formatCurrency(ord.totalAmount)}
                        </span>
                        <span className={`text-[10px] block font-bold uppercase ${ord.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {ord.paymentStatus === 'paid' ? 'PAID ONLINE' : 'CASH / COD'}
                        </span>
                      </div>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-xs space-y-1">
                      <div className="flex justify-between font-semibold text-zinc-200">
                        <span>{ord.customer.name}</span>
                        <a
                          href={`tel:${ord.customer.phone}`}
                          className="text-amber-400 hover:underline flex items-center gap-1 font-mono"
                        >
                          <Phone className="w-3 h-3" /> {ord.customer.phone}
                        </a>
                      </div>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">
                        {ord.customer.address}
                        {ord.customer.landmark && ` (Near ${ord.customer.landmark})`}
                      </p>
                      {ord.customer.notes && (
                        <p className="text-amber-300 font-semibold text-[11px] pt-1">
                          Note: "{ord.customer.notes}"
                        </p>
                      )}
                    </div>

                    {/* Food Items Ordered with Customizations */}
                    <div className="space-y-1.5 text-xs">
                      {ord.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between py-1 border-b border-zinc-800/40 last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                item.isVeg ? 'bg-emerald-400' : 'bg-rose-400'
                              }`}
                            ></span>
                            <span className="font-bold text-white">
                              {item.name}
                            </span>
                            <span className="font-black text-amber-400">x{item.quantity}</span>
                            {item.customization?.spiceLevel && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                                {item.customization.spiceLevel}
                                {item.customization.extraCheese && ', +Cheese'}
                              </span>
                            )}
                          </div>
                          <span className="text-zinc-400 font-semibold">{formatCurrency(item.subtotal)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Kitchen Action Buttons */}
                    <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center gap-2">
                      {ord.status === 'Placed' && (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'Accepted')}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-colors"
                        >
                          Accept Order
                        </button>
                      )}

                      {ord.status === 'Accepted' && (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'Preparing')}
                          className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs transition-colors"
                        >
                          Start Preparing
                        </button>
                      )}

                      {ord.status === 'Preparing' && (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'Ready')}
                          className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs transition-colors"
                        >
                          Mark Food Ready
                        </button>
                      )}

                      {ord.status === 'Ready' && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              ord.id,
                              ord.orderType === 'takeaway' ? 'Delivered' : 'Out for Delivery'
                            )
                          }
                          className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-extrabold text-xs transition-colors flex items-center gap-1.5"
                        >
                          <Bike className="w-3.5 h-3.5" />
                          <span>
                            {ord.orderType === 'takeaway'
                              ? 'Mark Picked Up'
                              : 'Send Out for Delivery'}
                          </span>
                        </button>
                      )}

                      {ord.status === 'Out for Delivery' && (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'Delivered')}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Mark Delivered</span>
                        </button>
                      )}

                      {/* Print KOT / Receipt button */}
                      <button
                        onClick={() => setSelectedOrderForBill(ord)}
                        className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="Print Kitchen Order Ticket"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>KOT / Bill</span>
                      </button>

                      {ord.status !== 'Delivered' && ord.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'Cancelled')}
                          className="text-xs text-rose-400 hover:text-rose-300 ml-auto px-2 py-1"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MENU DISHES MANAGEMENT */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search food items..."
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              onClick={handleOpenAddFood}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Food Item</span>
            </button>
          </div>

          {/* Food table */}
          <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/80 text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="p-4">Dish</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Prep Time</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {foodItems
                  .filter((f) =>
                    menuSearch.trim()
                      ? f.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
                        f.category.toLowerCase().includes(menuSearch.toLowerCase())
                      : true
                  )
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover bg-zinc-800 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                item.isVeg ? 'bg-emerald-400' : 'bg-rose-400'
                              }`}
                            ></span>
                            <span className="font-bold text-white text-sm font-display">
                              {item.name}
                            </span>
                            {item.isSpecial && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px] font-bold">
                                SPECIAL
                              </span>
                            )}
                          </div>
                          <p className="text-zinc-400 text-[11px] line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </td>

                      <td className="p-4 text-zinc-300 font-semibold">{item.category}</td>

                      <td className="p-4 font-bold text-amber-400 text-sm">
                        {formatCurrency(item.price)}
                      </td>

                      <td className="p-4 text-zinc-400">{item.prepTimeMinutes} mins</td>

                      <td className="p-4">
                        <button
                          onClick={() => handleToggleFoodAvailability(item)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            item.isAvailable
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                              : 'bg-rose-950 text-rose-300 border border-rose-700/60'
                          }`}
                        >
                          {item.isAvailable ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Available</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Sold Out</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditFood(item)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                            title="Edit dish"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteFood(item.id, item.name)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950 text-zinc-300 hover:text-rose-400 transition-colors"
                            title="Delete dish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROMO COUPONS */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Add Coupon Form */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <h3 className="text-base font-bold text-white font-display">Create Promo Coupon</h3>
            <form onSubmit={handleAddCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MONSOON20"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white uppercase focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Title / Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. 20% OFF on Weekend Biryanis"
                  value={newCouponTitle}
                  onChange={(e) => setNewCouponTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Discount Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Cash (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Value *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Minimum Order Value (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-colors shadow"
              >
                Create Promo Code
              </button>
            </form>
          </div>

          {/* Active Coupons List */}
          <div className="lg:col-span-8 space-y-3">
            <h3 className="text-base font-bold text-white font-display">Active Customer Coupons</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coupons.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-black text-amber-400 text-sm bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                        {c.code}
                      </span>
                      <h4 className="font-bold text-white text-sm mt-2 font-display">{c.title}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">{c.description}</p>
                      <p className="text-[10px] text-zinc-500 mt-1">Min. Order: ₹{c.minOrderAmount}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteCoupon(c.id)}
                      className="text-zinc-500 hover:text-rose-400 p-1"
                      title="Delete coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-display">Customer Feedback & Reviews</h3>
            <span className="text-xs text-amber-400 font-bold">Average: 4.8★ (Over 1,850 Ratings)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {db.getReviews().map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{rev.customerName}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-zinc-300 italic">"{rev.comment}"</p>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-800">
                  <span>{rev.date}</span>
                  {rev.orderNumber && (
                    <span className="font-mono text-amber-400">Order: {rev.orderNumber}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: RESTAURANT SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl space-y-6">
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white font-display">Business Information</h3>

            <div className="space-y-3 text-zinc-300">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Restaurant Name</label>
                <input
                  type="text"
                  disabled
                  value={RESTAURANT_INFO.name}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Physical Address</label>
                <input
                  type="text"
                  disabled
                  value={RESTAURANT_INFO.address}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Phone Line</label>
                  <input
                    type="text"
                    disabled
                    value={RESTAURANT_INFO.phone}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">WhatsApp Line</label>
                  <input
                    type="text"
                    disabled
                    value={RESTAURANT_INFO.whatsapp}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">
                  Min. Order for Free Delivery (₹)
                </label>
                <input
                  type="number"
                  value={deliveryMinOrder}
                  onChange={(e) => setDeliveryMinOrder(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="button"
                onClick={() => showToast('Restaurant configuration saved successfully', 'success')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Food Item Modal */}
      {isAddEditFoodOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-base font-display">
                {editingFood ? 'Edit Food Item' : 'Add New Food Item'}
              </h3>
              <button
                onClick={() => setIsAddEditFoodOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFoodSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chicken 65"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Category *</label>
                  <select
                    value={foodCategory}
                    onChange={(e) => setFoodCategory(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  >
                    {ALL_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={foodPrice}
                    onChange={(e) => setFoodPrice(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Prep Time (mins)</label>
                  <input
                    type="number"
                    min={5}
                    value={foodPrepTime}
                    onChange={(e) => setFoodPrepTime(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Discount (% optional)</label>
                  <input
                    type="number"
                    min={0}
                    max={90}
                    value={foodDiscount}
                    onChange={(e) => setFoodDiscount(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={foodImage}
                  onChange={(e) => setFoodImage(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Freshly spiced, garnished with coriander..."
                  value={foodDescription}
                  onChange={(e) => setFoodDescription(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={foodIsVeg}
                    onChange={(e) => setFoodIsVeg(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 rounded bg-zinc-900 border-zinc-700"
                  />
                  <span>Pure Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={foodIsSpecial}
                    onChange={(e) => setFoodIsSpecial(e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded bg-zinc-900 border-zinc-700"
                  />
                  <span>Chef's Special Tag</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddEditFoodOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold"
                >
                  Save Food Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print KOT / Bill Receipt Modal */}
      {selectedOrderForBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white text-black rounded-3xl max-w-sm w-full p-6 font-mono text-xs shadow-2xl relative">
            <div className="text-center border-b border-black/20 pb-3 mb-3">
              <h3 className="font-bold text-base tracking-tight font-display">GANGAMMA FAST FOOD</h3>
              <p className="text-[10px] text-zinc-600 mt-0.5">KITCHEN ORDER TICKET (KOT) & BILL</p>
              <p className="text-[10px] text-zinc-600">{RESTAURANT_INFO.address}</p>
              <p className="text-[10px] text-zinc-600">Ph: {RESTAURANT_INFO.phone}</p>
            </div>

            <div className="space-y-1 mb-3 text-[11px]">
              <div className="flex justify-between font-bold">
                <span>Order No:</span>
                <span>{selectedOrderForBill.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span>{new Date(selectedOrderForBill.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-bold uppercase">{selectedOrderForBill.orderType}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span>{selectedOrderForBill.customer.name} ({selectedOrderForBill.customer.phone})</span>
              </div>
            </div>

            <div className="border-t border-b border-dashed border-black/40 py-2 space-y-1.5 my-2">
              {selectedOrderForBill.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>
                    {it.name} x{it.quantity}
                  </span>
                  <span className="font-bold">{formatCurrency(it.subtotal)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-right text-[11px]">
              <div>Subtotal: {formatCurrency(selectedOrderForBill.subtotal)}</div>
              <div>Delivery: {formatCurrency(selectedOrderForBill.deliveryFee)}</div>
              {selectedOrderForBill.discount > 0 && (
                <div>Discount: -{formatCurrency(selectedOrderForBill.discount)}</div>
              )}
              <div className="text-sm font-bold pt-1 border-t border-black">
                TOTAL: {formatCurrency(selectedOrderForBill.totalAmount)}
              </div>
              <div className="text-[10px] font-bold uppercase pt-0.5">
                Payment: {selectedOrderForBill.paymentMethod.toUpperCase()} ({selectedOrderForBill.paymentStatus.toUpperCase()})
              </div>
            </div>

            <div className="text-center text-[10px] text-zinc-500 mt-4 pt-2 border-t border-black/20">
              Thank you for ordering at Gangamma Fast Food!
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2 bg-black text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
              <button
                onClick={() => setSelectedOrderForBill(null)}
                className="flex-1 py-2 bg-zinc-200 hover:bg-zinc-300 text-black font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
