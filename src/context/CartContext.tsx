import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { FoodItem, FoodCustomization, CartItem, Coupon, OrderType, Order } from '../types';
import { db } from '../db/storage';
import { RESTAURANT_INFO } from '../data/initialData';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  addItem: (foodItem: FoodItem, quantity?: number, customization?: FoodCustomization) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  reorderPastOrder: (order: Order) => void;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  loyaltyPointsToRedeem: number;
  setLoyaltyPointsToRedeem: (points: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  // Financial computations
  totalItemsCount: number;
  subtotal: number;
  deliveryFee: number;
  couponDiscount: number;
  loyaltyDiscount: number;
  totalDiscount: number;
  grandTotal: number;
  amountNeededForFreeDelivery: number;
}

const CART_STORAGE_KEY = 'gff_active_cart_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [loyaltyPointsToRedeem, setLoyaltyPointsToRedeem] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // If user changes or logs out, adjust loyalty points to redeem if exceeding balance
  useEffect(() => {
    if (!currentUser) {
      setLoyaltyPointsToRedeem(0);
    } else if (loyaltyPointsToRedeem > currentUser.loyaltyPoints) {
      setLoyaltyPointsToRedeem(currentUser.loyaltyPoints);
    }
  }, [currentUser, loyaltyPointsToRedeem]);

  // Calculate customization price adder
  const calculateCustomizationCost = (customization?: FoodCustomization): number => {
    if (!customization) return 0;
    let extra = 0;
    if (customization.extraCheese) extra += 25;
    if (customization.extraSauce) extra += 10;
    if (customization.extraOnions) extra += 10;
    if (customization.extraQuantity) extra += 40;
    return extra;
  };

  const addItem = (
    foodItem: FoodItem,
    quantity = 1,
    customization: FoodCustomization = { spiceLevel: 'Medium' }
  ) => {
    if (!foodItem.isAvailable) {
      showToast(`${foodItem.name} is currently Sold Out`, 'error');
      return;
    }

    const customizationPrice = calculateCustomizationCost(customization);
    const unitPrice = (foodItem.price - (foodItem.discountPercent ? Math.round(foodItem.price * (foodItem.discountPercent / 100)) : 0)) + customizationPrice;

    // Generate unique ID based on item ID and custom options
    const customKey = `${foodItem.id}-${customization.spiceLevel || 'Med'}-${customization.extraCheese ? 'ch' : ''}-${customization.extraSauce ? 'sc' : ''}-${customization.extraOnions ? 'on' : ''}-${customization.extraQuantity ? 'qt' : ''}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.cartItemId === customKey);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: newQty * unitPrice,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId: customKey,
          foodItem,
          quantity,
          customization,
          customizationPrice,
          totalPrice: unitPrice * quantity,
        };
        return [...prevItems, newItem];
      }
    });

    showToast(`Added "${foodItem.name}" to cart!`, 'success');
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(cartItemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.cartItemId === cartItemId) {
          const unitPrice =
            (item.foodItem.price -
              (item.foodItem.discountPercent
                ? Math.round(item.foodItem.price * (item.foodItem.discountPercent / 100))
                : 0)) +
            item.customizationPrice;
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: unitPrice * newQuantity,
          };
        }
        return item;
      })
    );
  };

  const removeItem = (cartItemId: string) => {
    setItems((prevItems) => {
      const item = prevItems.find((i) => i.cartItemId === cartItemId);
      if (item) {
        showToast(`Removed "${item.foodItem.name}" from cart`, 'info');
      }
      return prevItems.filter((i) => i.cartItemId !== cartItemId);
    });
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setLoyaltyPointsToRedeem(0);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const reorderPastOrder = (pastOrder: Order) => {
    const allItems = db.getFoodItems();
    let addedCount = 0;

    pastOrder.items.forEach((orderItem) => {
      const foodItem = allItems.find((f) => f.id === orderItem.foodItemId);
      if (foodItem && foodItem.isAvailable) {
        addItem(foodItem, orderItem.quantity, orderItem.customization);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      showToast(`Added ${addedCount} items from previous order to cart!`, 'success');
      setIsCartOpen(true);
    } else {
      showToast('Items from this order are currently unavailable', 'error');
    }
  };

  // Subtotals and totals calculation
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.totalPrice, 0);
  }, [items]);

  const totalItemsCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const deliveryFee = useMemo(() => {
    if (orderType === 'takeaway' || items.length === 0) return 0;
    if (subtotal >= RESTAURANT_INFO.minOrderForFreeDelivery) return 0;
    return RESTAURANT_INFO.standardDeliveryFee;
  }, [orderType, subtotal, items.length]);

  const amountNeededForFreeDelivery = Math.max(0, RESTAURANT_INFO.minOrderForFreeDelivery - subtotal);

  // Coupon discount calculation
  const couponDiscount = useMemo(() => {
    if (!appliedCoupon || subtotal === 0) return 0;
    if (subtotal < appliedCoupon.minOrderAmount) return 0;

    let discount = 0;
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
        discount = appliedCoupon.maxDiscount;
      }
    } else {
      discount = appliedCoupon.discountValue;
    }
    return Math.min(discount, subtotal);
  }, [appliedCoupon, subtotal]);

  // Loyalty points discount calculation (₹1 per point)
  const loyaltyDiscount = useMemo(() => {
    if (!currentUser || loyaltyPointsToRedeem <= 0) return 0;
    const maxRedeemable = Math.max(0, subtotal - couponDiscount);
    const requestedDiscount = loyaltyPointsToRedeem * RESTAURANT_INFO.pointValueInRupees;
    return Math.min(requestedDiscount, maxRedeemable);
  }, [currentUser, loyaltyPointsToRedeem, subtotal, couponDiscount]);

  const totalDiscount = couponDiscount + loyaltyDiscount;

  const grandTotal = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.max(0, subtotal + deliveryFee - totalDiscount);
  }, [items.length, subtotal, deliveryFee, totalDiscount]);

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const coupons = db.getCoupons();
    const clean = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code === clean && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }

    if (subtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Minimum order amount of ₹${found.minOrderAmount} required for coupon ${clean}`,
      };
    }

    setAppliedCoupon(found);
    showToast(`Coupon "${clean}" applied successfully!`, 'success');
    return { success: true, message: `Coupon applied: ${found.title}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        reorderPastOrder,
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
