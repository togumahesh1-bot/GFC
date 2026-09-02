import React from 'react';
import { Star, Clock, Heart, Plus, Minus, Check, Flame } from 'lucide-react';
import { FoodItem } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/helpers';

interface FoodCardProps {
  item: FoodItem;
  onSelect: (item: FoodItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, onSelect }) => {
  const { items, addItem, updateQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useAuth();

  const isFav = isFavorite(item.id);

  // Find if this item is already in cart (matching base food item)
  const cartItem = items.find((ci) => ci.foodItem.id === item.id);
  const inCartQuantity = cartItem?.quantity || 0;

  const discountedPrice = item.discountPercent
    ? Math.round(item.price * (1 - item.discountPercent / 100))
    : item.price;

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.isAvailable) return;
    addItem(item, 1, { spiceLevel: 'Medium' });
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.cartItemId, cartItem.quantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.cartItemId, cartItem.quantity - 1);
    }
  };

  const handleFavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(item.id);
  };

  return (
    <div
      id={`food-card-${item.id}`}
      onClick={() => onSelect(item)}
      className={`group cursor-pointer rounded-2xl bg-[#171920] border transition-all duration-300 flex flex-col justify-between overflow-hidden relative shadow-lg ${
        item.isAvailable
          ? 'border-zinc-800/80 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1'
          : 'border-zinc-800/40 opacity-75'
      }`}
    >
      {/* Top Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-zinc-800">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            !item.isAvailable ? 'grayscale contrast-75' : ''
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Veg / Non-Veg Indicator Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <div
            className={`w-5 h-5 rounded-md border flex items-center justify-center bg-black/60 backdrop-blur-md ${
              item.isVeg ? 'border-emerald-500' : 'border-rose-500'
            }`}
            title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            ></div>
          </div>

          {item.isSpecial && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-black text-[10px] font-extrabold uppercase tracking-wider shadow">
              Chef Special
            </span>
          )}

          {item.discountPercent && (
            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-extrabold shadow">
              {item.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavClick}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
            isFav
              ? 'bg-rose-500/90 text-white'
              : 'bg-black/50 text-white/70 hover:text-white hover:bg-black/70'
          }`}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Availability Badge */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg">
              Sold Out for Today
            </span>
          </div>
        )}

        {/* Prep time & rating bottom banner */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-bold">{item.rating}</span>
            <span className="text-zinc-400 text-[10px]">({item.ratingCount})</span>
          </div>

          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md text-zinc-300">
            <Clock className="w-3 h-3 text-amber-400" />
            <span className="text-[11px]">{item.prepTimeMinutes} mins</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors line-clamp-1 font-display">
              {item.name}
            </h4>
          </div>

          <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed mb-3">
            {item.description}
          </p>
        </div>

        {/* Price & Add to Cart Controls */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-amber-400">
                {formatCurrency(discountedPrice)}
              </span>
              {item.discountPercent && (
                <span className="text-xs text-zinc-500 line-through">
                  {formatCurrency(item.price)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-zinc-500 block">Taxes included</span>
          </div>

          {/* Action button */}
          {item.isAvailable ? (
            inCartQuantity > 0 ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center bg-amber-500 text-black rounded-xl overflow-hidden font-bold shadow-md shadow-amber-500/20"
              >
                <button
                  onClick={handleDecrement}
                  className="px-2.5 py-1.5 hover:bg-amber-600 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <span className="px-2 text-xs font-black">{inCartQuantity}</span>
                <button
                  onClick={handleIncrement}
                  className="px-2.5 py-1.5 hover:bg-amber-600 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddClick}
                className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-amber-500 text-zinc-200 hover:text-black font-bold text-xs transition-all flex items-center gap-1.5 border border-zinc-700 hover:border-amber-500 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            )
          ) : (
            <span className="text-[11px] text-zinc-500 font-semibold italic">Unavailable</span>
          )}
        </div>
      </div>
    </div>
  );
};
