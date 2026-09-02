import { CartItem, Order, OrderStatus } from '../types';
import { RESTAURANT_INFO } from '../data/initialData';

export const formatCurrency = (amount: number): string => {
  return `₹${Math.round(amount)}`;
};

export const generateOrderNumber = (): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `#GF${randomNum}`;
};

export const formatWhatsAppOrderMessage = (items: CartItem[], total: number, orderType: string): string => {
  const itemLines = items
    .map((item, idx) => {
      const customs: string[] = [];
      if (item.customization.spiceLevel) customs.push(item.customization.spiceLevel);
      if (item.customization.extraCheese) customs.push('Extra Cheese');
      if (item.customization.extraSauce) customs.push('Extra Sauce');
      if (item.customization.extraOnions) customs.push('Extra Onions');
      if (item.customization.extraQuantity) customs.push('Extra Qty');

      const customStr = customs.length > 0 ? ` (${customs.join(', ')})` : '';
      return `${idx + 1}. *${item.foodItem.name}* x ${item.quantity}${customStr} - ₹${item.totalPrice}`;
    })
    .join('\n');

  const text = `*New Order Request - Gangamma Fast Food*\n` +
    `--------------------------------\n` +
    `*Order Type:* ${orderType === 'delivery' ? 'Home Delivery' : 'Takeaway / Pickup'}\n\n` +
    `*Items:*\n${itemLines}\n\n` +
    `*Total Estimated Amount:* ₹${total}\n` +
    `--------------------------------\n` +
    `Please confirm preparation time and payment. Thank you!`;

  return encodeURIComponent(text);
};

export const getStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case 'Placed':
      return {
        label: 'Order Placed',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        badgeColor: 'bg-amber-500 text-black',
        step: 1,
        desc: 'We have received your order and sent it to the kitchen.',
      };
    case 'Accepted':
      return {
        label: 'Order Accepted',
        color: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
        badgeColor: 'bg-sky-500 text-white',
        step: 2,
        desc: 'Restaurant confirmed your order. Fresh preparation starts now!',
      };
    case 'Preparing':
      return {
        label: 'Preparing Food',
        color: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
        badgeColor: 'bg-orange-500 text-white',
        step: 3,
        desc: 'Chef is preparing your fresh, sizzling hot dishes with love.',
      };
    case 'Ready':
      return {
        label: 'Food is Ready',
        color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
        badgeColor: 'bg-indigo-500 text-white',
        step: 4,
        desc: 'Packaging complete! Waiting for pickup or dispatch.',
      };
    case 'Out for Delivery':
      return {
        label: 'Out for Delivery',
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
        badgeColor: 'bg-purple-500 text-white',
        step: 5,
        desc: 'Delivery partner is on the way to your address.',
      };
    case 'Delivered':
      return {
        label: 'Delivered',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        badgeColor: 'bg-emerald-500 text-white',
        step: 6,
        desc: 'Order successfully delivered. Enjoy your meal!',
      };
    case 'Cancelled':
      return {
        label: 'Cancelled',
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        badgeColor: 'bg-rose-500 text-white',
        step: 0,
        desc: 'This order was cancelled.',
      };
  }
};
