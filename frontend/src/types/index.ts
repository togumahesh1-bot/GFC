export type FoodCategory =
  | 'Breakfast'
  | 'Snacks'
  | 'Fast Food'
  | 'Meals'
  | 'Rice Items'
  | 'Noodles'
  | 'Fried Items'
  | 'Beverages'
  | 'Special Items';

export interface FoodCustomization {
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy';
  extraCheese?: boolean;
  extraSauce?: boolean;
  extraOnions?: boolean;
  extraQuantity?: boolean;
  instructions?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  price: number;
  description: string;
  image: string;
  rating: number;
  ratingCount: number;
  isVeg: boolean;
  isAvailable: boolean;
  isPopular?: boolean;
  isSpecial?: boolean;
  prepTimeMinutes: number;
  ingredients: string[];
  calories?: number;
  discountPercent?: number;
}

export interface CartItem {
  cartItemId: string;
  foodItem: FoodItem;
  quantity: number;
  customization: FoodCustomization;
  customizationPrice: number;
  totalPrice: number;
}

export type OrderType = 'delivery' | 'takeaway';
export type PaymentMethod = 'cod' | 'upi' | 'card';
export type OrderStatus =
  | 'Placed'
  | 'Accepted'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  foodItemId: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
  customization?: FoodCustomization;
  subtotal: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  landmark?: string;
  pincode?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g., "#GF1025"
  userId?: string;
  customer: CustomerDetails;
  items: OrderItem[];
  orderType: OrderType;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  loyaltyPointsUsed?: number;
  loyaltyDiscount?: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid';
  status: OrderStatus;
  statusTimestamps: {
    placedAt: string;
    acceptedAt?: string;
    preparingAt?: string;
    readyAt?: string;
    outForDeliveryAt?: string;
    deliveredAt?: string;
    cancelledAt?: string;
  };
  estimatedDeliveryTime: string; // e.g. "25-35 mins"
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  passwordHash?: string;
  loyaltyPoints: number;
  savedAddresses: SavedAddress[];
  favorites: string[]; // food item ids
  createdAt: string;
}

export interface SavedAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  address: string;
  landmark?: string;
  pincode: string;
  isDefault?: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  validUntil: string;
  isActive: boolean;
}

export interface Review {
  id: string;
  userId?: string;
  customerName: string;
  rating: number;
  comment: string;
  foodItemId?: string;
  orderNumber?: string;
  date: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
}

export interface LoyaltyTransaction {
  id: string;
  userId: string;
  orderId?: string;
  type: 'earned' | 'redeemed';
  points: number;
  description: string;
  date: string;
}
