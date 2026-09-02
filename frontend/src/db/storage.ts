import {
  User,
  FoodItem,
  Order,
  Coupon,
  Review,
  LoyaltyTransaction,
  OrderStatus,
  FoodCategory,
} from '../types';
import {
  INITIAL_FOOD_ITEMS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  RESTAURANT_INFO,
} from '../data/initialData';

const STORAGE_KEYS = {
  USERS: 'gff_users_v1',
  CURRENT_USER: 'gff_current_user_v1',
  FOOD_ITEMS: 'gff_food_items_v1',
  ORDERS: 'gff_orders_v1',
  COUPONS: 'gff_coupons_v1',
  REVIEWS: 'gff_reviews_v1',
  LOYALTY: 'gff_loyalty_v1',
  ACTIVE_ORDER_ID: 'gff_active_order_id_v1',
};

// Event bus for cross-component reactive updates
type Listener = () => void;
const listeners: Set<Listener> = new Set();

export const subscribeToStorageChanges = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyChange = () => {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error(e);
    }
  });
};

// Helpers for safe storage access
function getJSON<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

function setJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyChange();
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

// Simple SHA-256 equivalent hash representation for passwords
export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(password + '_gff_salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Initial default users
const DEFAULT_ADMIN: User = {
  id: 'usr-admin-1',
  name: 'Gangamma Manager',
  email: 'admin@gangamma.com',
  phone: '9876543210',
  role: 'admin',
  loyaltyPoints: 500,
  savedAddresses: [],
  favorites: ['ff-1', 'ff-8', 'ff-10'],
  createdAt: '2026-01-01T00:00:00.000Z',
};

const DEFAULT_CUSTOMER: User = {
  id: 'usr-cust-1',
  name: 'Mahesh Togu',
  email: 'togumahesh1@gmail.com',
  phone: '9123456780',
  role: 'customer',
  loyaltyPoints: 80,
  savedAddresses: [
    {
      id: 'addr-1',
      label: 'Home',
      address: 'Flat 302, Sai Residency, Road No. 4, Banjara Hills',
      landmark: 'Near Water Tank',
      pincode: '500034',
      isDefault: true,
    },
  ],
  favorites: ['ff-1', 'ff-6', 'ff-10', 'ff-22'],
  createdAt: '2026-02-01T00:00:00.000Z',
};

const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: '#GF1021',
    userId: 'usr-cust-1',
    customer: {
      name: 'Mahesh Togu',
      phone: '9123456780',
      email: 'togumahesh1@gmail.com',
      address: 'Flat 302, Sai Residency, Road No. 4, Banjara Hills',
      landmark: 'Near Water Tank',
      pincode: '500034',
    },
    items: [
      {
        foodItemId: 'ff-10',
        name: 'Gangamma Special Chicken Biryani',
        price: 190,
        quantity: 1,
        isVeg: false,
        subtotal: 190,
      },
      {
        foodItemId: 'ff-1',
        name: 'Crispy Chicken 65',
        price: 180,
        quantity: 1,
        isVeg: false,
        subtotal: 180,
      },
      {
        foodItemId: 'ff-22',
        name: 'Authentic Hyderabadi Irani Chai',
        price: 25,
        quantity: 2,
        isVeg: true,
        subtotal: 50,
      },
    ],
    orderType: 'delivery',
    subtotal: 420,
    deliveryFee: 0,
    discount: 42,
    couponCode: 'GANGAMMA10',
    totalAmount: 378,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    status: 'Delivered',
    statusTimestamps: {
      placedAt: '2026-09-01T13:10:00.000Z',
      acceptedAt: '2026-09-01T13:12:00.000Z',
      preparingAt: '2026-09-01T13:15:00.000Z',
      readyAt: '2026-09-01T13:30:00.000Z',
      outForDeliveryAt: '2026-09-01T13:35:00.000Z',
      deliveredAt: '2026-09-01T13:50:00.000Z',
    },
    estimatedDeliveryTime: '25-30 mins',
    createdAt: '2026-09-01T13:10:00.000Z',
  },
  {
    id: 'ord-1002',
    orderNumber: '#GF1024',
    userId: 'usr-cust-1',
    customer: {
      name: 'Mahesh Togu',
      phone: '9123456780',
      email: 'togumahesh1@gmail.com',
      address: 'Shop #12, Commercial Complex, Main Road',
      pincode: '500034',
    },
    items: [
      {
        foodItemId: 'ff-6',
        name: 'Hakka Chicken Noodles',
        price: 130,
        quantity: 2,
        isVeg: false,
        subtotal: 260,
      },
      {
        foodItemId: 'ff-4',
        name: 'Veg Manchurian Dry',
        price: 110,
        quantity: 1,
        isVeg: true,
        subtotal: 110,
      },
    ],
    orderType: 'takeaway',
    subtotal: 370,
    deliveryFee: 0,
    discount: 30,
    couponCode: 'COMBO30',
    totalAmount: 340,
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    status: 'Delivered',
    statusTimestamps: {
      placedAt: '2026-09-02T09:30:00.000Z',
      acceptedAt: '2026-09-02T09:32:00.000Z',
      preparingAt: '2026-09-02T09:35:00.000Z',
      readyAt: '2026-09-02T09:48:00.000Z',
      deliveredAt: '2026-09-02T09:55:00.000Z',
    },
    estimatedDeliveryTime: '15 mins',
    createdAt: '2026-09-02T09:30:00.000Z',
  },
];

// Seed storage if not present
export function initializeStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.FOOD_ITEMS)) {
    localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(INITIAL_FOOD_ITEMS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([DEFAULT_ADMIN, DEFAULT_CUSTOMER]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COUPONS)) {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_DEMO_ORDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    // Default to customer logged in for smooth instant preview
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_CUSTOMER));
  }
}

// User & Auth Operations
export const db = {
  // Users
  getUsers: (): User[] => getJSON(STORAGE_KEYS.USERS, [DEFAULT_ADMIN, DEFAULT_CUSTOMER]),
  getCurrentUser: (): User | null => getJSON(STORAGE_KEYS.CURRENT_USER, null),
  setCurrentUser: (user: User | null): void => setJSON(STORAGE_KEYS.CURRENT_USER, user),

  updateUser: (updatedUser: User): void => {
    const users = db.getUsers();
    const index = users.findIndex((u) => u.id === updatedUser.id);
    if (index >= 0) {
      users[index] = updatedUser;
    } else {
      users.push(updatedUser);
    }
    setJSON(STORAGE_KEYS.USERS, users);
    const curr = db.getCurrentUser();
    if (curr && curr.id === updatedUser.id) {
      setJSON(STORAGE_KEYS.CURRENT_USER, updatedUser);
    }
  },

  // Food items
  getFoodItems: (): FoodItem[] => getJSON(STORAGE_KEYS.FOOD_ITEMS, INITIAL_FOOD_ITEMS),
  getFoodItemById: (id: string): FoodItem | undefined => {
    return db.getFoodItems().find((item) => item.id === id);
  },
  saveFoodItem: (item: FoodItem): void => {
    const items = db.getFoodItems();
    const index = items.findIndex((i) => i.id === item.id);
    if (index >= 0) {
      items[index] = item;
    } else {
      items.unshift(item);
    }
    setJSON(STORAGE_KEYS.FOOD_ITEMS, items);
  },
  deleteFoodItem: (id: string): void => {
    const items = db.getFoodItems().filter((i) => i.id !== id);
    setJSON(STORAGE_KEYS.FOOD_ITEMS, items);
  },
  toggleFoodAvailability: (id: string): boolean => {
    const items = db.getFoodItems();
    const item = items.find((i) => i.id === id);
    if (item) {
      item.isAvailable = !item.isAvailable;
      setJSON(STORAGE_KEYS.FOOD_ITEMS, items);
      return item.isAvailable;
    }
    return false;
  },

  // Orders
  getOrders: (): Order[] => getJSON(STORAGE_KEYS.ORDERS, INITIAL_DEMO_ORDERS),
  getOrderById: (orderIdOrNumber: string): Order | undefined => {
    return db.getOrders().find(
      (o) => o.id === orderIdOrNumber || o.orderNumber.toLowerCase() === orderIdOrNumber.toLowerCase()
    );
  },
  getUserOrders: (userId: string): Order[] => {
    return db.getOrders().filter((o) => o.userId === userId || o.customer.email === userId);
  },
  getActiveOrderId: (): string | null => getJSON(STORAGE_KEYS.ACTIVE_ORDER_ID, null),
  setActiveOrderId: (id: string | null): void => setJSON(STORAGE_KEYS.ACTIVE_ORDER_ID, id),

  createOrder: (order: Order): Order => {
    const orders = db.getOrders();
    orders.unshift(order);
    setJSON(STORAGE_KEYS.ORDERS, orders);
    setJSON(STORAGE_KEYS.ACTIVE_ORDER_ID, order.id);

    // Award loyalty points to user
    if (order.userId) {
      const users = db.getUsers();
      const user = users.find((u) => u.id === order.userId);
      if (user) {
        // Calculate points earned: ₹100 = 10 points
        const pointsEarned = Math.floor(order.totalAmount / 10);
        let newPoints = user.loyaltyPoints + pointsEarned;
        if (order.loyaltyPointsUsed) {
          newPoints = Math.max(0, newPoints - order.loyaltyPointsUsed);
        }
        user.loyaltyPoints = newPoints;
        db.updateUser(user);

        // Record loyalty transaction
        const transactions = getJSON<LoyaltyTransaction[]>(STORAGE_KEYS.LOYALTY, []);
        if (pointsEarned > 0) {
          transactions.unshift({
            id: 'loy-' + Date.now(),
            userId: user.id,
            orderId: order.id,
            type: 'earned',
            points: pointsEarned,
            description: `Earned on order ${order.orderNumber}`,
            date: new Date().toISOString(),
          });
        }
        if (order.loyaltyPointsUsed) {
          transactions.unshift({
            id: 'loy-red-' + Date.now(),
            userId: user.id,
            orderId: order.id,
            type: 'redeemed',
            points: order.loyaltyPointsUsed,
            description: `Redeemed on order ${order.orderNumber}`,
            date: new Date().toISOString(),
          });
        }
        setJSON(STORAGE_KEYS.LOYALTY, transactions);
      }
    }

    return order;
  },

  updateOrderStatus: (orderId: string, status: OrderStatus): void => {
    const orders = db.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      const now = new Date().toISOString();
      if (status === 'Accepted') order.statusTimestamps.acceptedAt = now;
      if (status === 'Preparing') order.statusTimestamps.preparingAt = now;
      if (status === 'Ready') order.statusTimestamps.readyAt = now;
      if (status === 'Out for Delivery') order.statusTimestamps.outForDeliveryAt = now;
      if (status === 'Delivered') {
        order.statusTimestamps.deliveredAt = now;
        order.paymentStatus = 'paid';
      }
      if (status === 'Cancelled') order.statusTimestamps.cancelledAt = now;

      setJSON(STORAGE_KEYS.ORDERS, orders);
    }
  },

  // Coupons
  getCoupons: (): Coupon[] => getJSON(STORAGE_KEYS.COUPONS, INITIAL_COUPONS),
  saveCoupon: (coupon: Coupon): void => {
    const coupons = db.getCoupons();
    const index = coupons.findIndex((c) => c.id === coupon.id);
    if (index >= 0) coupons[index] = coupon;
    else coupons.push(coupon);
    setJSON(STORAGE_KEYS.COUPONS, coupons);
  },
  deleteCoupon: (id: string): void => {
    const coupons = db.getCoupons().filter((c) => c.id !== id);
    setJSON(STORAGE_KEYS.COUPONS, coupons);
  },

  // Reviews
  getReviews: (): Review[] => getJSON(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS),
  addReview: (review: Review): void => {
    const reviews = db.getReviews();
    reviews.unshift(review);
    setJSON(STORAGE_KEYS.REVIEWS, reviews);
  },
  approveReview: (id: string, approved: boolean): void => {
    const reviews = db.getReviews();
    const review = reviews.find((r) => r.id === id);
    if (review) {
      review.isApproved = approved;
      setJSON(STORAGE_KEYS.REVIEWS, reviews);
    }
  },
  deleteReview: (id: string): void => {
    const reviews = db.getReviews().filter((r) => r.id !== id);
    setJSON(STORAGE_KEYS.REVIEWS, reviews);
  },

  // Favorites
  toggleFavorite: (userId: string, foodItemId: string): boolean => {
    const users = db.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return false;
    const exists = user.favorites.includes(foodItemId);
    if (exists) {
      user.favorites = user.favorites.filter((id) => id !== foodItemId);
    } else {
      user.favorites.push(foodItemId);
    }
    db.updateUser(user);
    return !exists;
  },

  // Loyalty
  getLoyaltyTransactions: (userId: string): LoyaltyTransaction[] => {
    const all = getJSON<LoyaltyTransaction[]>(STORAGE_KEYS.LOYALTY, []);
    return all.filter((t) => t.userId === userId);
  },

  // Reset to demo defaults
  resetToDefaults: (): void => {
    localStorage.removeItem(STORAGE_KEYS.FOOD_ITEMS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.COUPONS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.LOYALTY);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_ORDER_ID);
    initializeStorage();
    notifyChange();
  },
};

// Initialize once upon loading
initializeStorage();
