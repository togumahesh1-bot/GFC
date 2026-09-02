import React, { useState } from 'react';
import {
  X,
  Star,
  Clock,
  Flame,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  Check,
  Zap,
} from 'lucide-react';
import { FoodItem, FoodCustomization } from '../../types';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/helpers';

interface FoodDetailsModalProps {
  item: FoodItem | null;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const FoodDetailsModal: React.FC<FoodDetailsModalProps> = ({
  item,
  onClose,
  onProceedToCheckout,
}) => {
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState<'Mild' | 'Medium' | 'Spicy'>('Medium');
  const [extraCheese, setExtraCheese] = useState(false);
  const [extraSauce, setExtraSauce] = useState(false);
  const [extraOnions, setExtraOnions] = useState(false);
  const [extraQuantity, setExtraQuantity] = useState(false);
  const [instructions, setInstructions] = useState('');

  if (!item) return null;

  const basePrice = item.discountPercent
    ? Math.round(item.price * (1 - item.discountPercent / 100))
    : item.price;

  let extraCost = 0;
  if (extraCheese) extraCost += 25;
  if (extraSauce) extraCost += 10;
  if (extraOnions) extraCost += 10;
  if (extraQuantity) extraCost += 40;

  const unitTotal = basePrice + extraCost;
  const grandTotal = unitTotal * quantity;

  const getCustomization = (): FoodCustomization => ({
    spiceLevel,
    extraCheese,
    extraSauce,
    extraOnions,
    extraQuantity,
    instructions: instructions.trim() || undefined,
  });

  const handleAddToCart = () => {
    addItem(item, quantity, getCustomization());
    onClose();
  };

  const handleBuyNow = () => {
    addItem(item, quantity, getCustomization());
    onClose();
    onProceedToCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/90 transition-colors backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1">
          {/* Hero Food Image */}
          <div className="relative h-64 sm:h-72 w-full bg-zinc-800">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/40"></div>

            {/* Veg / Non-Veg badge */}
            <div className="absolute bottom-4 left-6 flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-md border flex items-center justify-center bg-black/60 backdrop-blur-md ${
                  item.isVeg ? 'border-emerald-500' : 'border-rose-500'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                ></div>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-zinc-900/90 text-zinc-200 text-xs font-bold border border-zinc-700">
                {item.category}
              </span>
              {item.isSpecial && (
                <span className="px-2.5 py-1 rounded-md bg-amber-500 text-black text-xs font-black uppercase">
                  Chef's Special
                </span>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Title & Pricing */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-bold text-white font-display">{item.name}</h2>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-black text-amber-400">
                    {formatCurrency(basePrice)}
                  </div>
                  {item.discountPercent && (
                    <span className="text-xs text-zinc-500 line-through">
                      {formatCurrency(item.price)}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-zinc-300 text-sm mt-2 leading-relaxed">
                {item.description}
              </p>

              {/* Stats badges */}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-white">{item.rating}</span>
                  <span>({item.ratingCount} reviews)</span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-white font-semibold">{item.prepTimeMinutes} mins</span>
                  <span>prep time</span>
                </div>

                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-emerald-400 font-bold">Cooked Fresh on Order</span>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-display">
                  Key Fresh Ingredients
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {item.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800/80 text-zinc-300 text-xs font-medium border border-zinc-700/60"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Customization 1: Spice Level */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-display flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>Choose Spice Level</span>
                </h4>
                <span className="text-[11px] text-amber-400">Required</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['Mild', 'Medium', 'Spicy'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSpiceLevel(level)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      spiceLevel === level
                        ? 'bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-500/20'
                        : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {spiceLevel === level && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    <span>{level}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Customization 2: Add-on Extras */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2 font-display">
                Add-on Extras & Toppings (Optional)
              </h4>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={extraCheese}
                      onChange={(e) => setExtraCheese(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-zinc-900 border-zinc-700"
                    />
                    <span className="text-sm text-zinc-200 font-medium">Extra Mozzarella & Cheddar Cheese</span>
                  </div>
                  <span className="text-xs font-bold text-amber-400">+₹25</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={extraSauce}
                      onChange={(e) => setExtraSauce(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-zinc-900 border-zinc-700"
                    />
                    <span className="text-sm text-zinc-200 font-medium">Extra Mint Chutney & Garlic Dip</span>
                  </div>
                  <span className="text-xs font-bold text-amber-400">+₹10</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={extraOnions}
                      onChange={(e) => setExtraOnions(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-zinc-900 border-zinc-700"
                    />
                    <span className="text-sm text-zinc-200 font-medium">Extra Crunchy Sliced Onions & Lemon</span>
                  </div>
                  <span className="text-xs font-bold text-amber-400">+₹10</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={extraQuantity}
                      onChange={(e) => setExtraQuantity(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-zinc-900 border-zinc-700"
                    />
                    <span className="text-sm text-zinc-200 font-medium">Jumbo Portion (+40% Extra Quantity)</span>
                  </div>
                  <span className="text-xs font-bold text-amber-400">+₹40</span>
                </label>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5 font-display">
                Special Kitchen Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Less oil, separate gravy, no coriander..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Bottom Sticky Action Footer */}
        <div className="p-4 sm:p-5 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quantity selector */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs font-semibold text-zinc-400">Quantity:</span>
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-white">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="sm:hidden text-lg font-black text-amber-400">
              {formatCurrency(grandTotal)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border border-zinc-700"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart ({formatCurrency(grandTotal)})</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
