import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Flame,
  Star,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  Utensils,
} from 'lucide-react';
import { FoodItem, FoodCategory } from '../../types';
import { db, subscribeToStorageChanges } from '../../db/storage';
import { FoodCard } from './FoodCard';

interface MenuPageProps {
  onSelectItem: (item: FoodItem) => void;
  initialCategory?: FoodCategory | 'All';
}

const CATEGORIES: (FoodCategory | 'All')[] = [
  'All',
  'Special Items',
  'Fast Food',
  'Rice Items',
  'Noodles',
  'Fried Items',
  'Breakfast',
  'Snacks',
  'Meals',
  'Beverages',
];

export const MenuPage: React.FC<MenuPageProps> = ({
  onSelectItem,
  initialCategory = 'All',
}) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => db.getFoodItems());
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'All'>(
    initialCategory
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlyPopular, setOnlyPopular] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<
    'popular' | 'rating' | 'price-low' | 'price-high'
  >('popular');

  // Keep synced with storage if admin adds/updates items
  useEffect(() => {
    return subscribeToStorageChanges(() => {
      setFoodItems(db.getFoodItems());
    });
  }, []);

  // Filter and sort computation
  const filteredItems = useMemo(() => {
    return foodItems
      .filter((item) => {
        // Category
        if (selectedCategory !== 'All' && item.category !== selectedCategory) {
          return false;
        }

        // Veg / Non-Veg
        if (vegFilter === 'veg' && !item.isVeg) return false;
        if (vegFilter === 'non-veg' && item.isVeg) return false;

        // Availability
        if (onlyAvailable && !item.isAvailable) return false;

        // Popular
        if (onlyPopular && !item.isPopular) return false;

        // Rating
        if (minRating > 0 && item.rating < minRating) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = item.name.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchIngredients = item.ingredients?.some((ing) =>
            ing.toLowerCase().includes(q)
          );
          if (!matchName && !matchDesc && !matchIngredients) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') {
          return a.price - b.price;
        }
        if (sortBy === 'price-high') {
          return b.price - a.price;
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        // default 'popular'
        return (b.ratingCount || 0) - (a.ratingCount || 0);
      });
  }, [
    foodItems,
    selectedCategory,
    vegFilter,
    onlyAvailable,
    onlyPopular,
    minRating,
    searchQuery,
    sortBy,
  ]);

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setVegFilter('all');
    setOnlyAvailable(false);
    setOnlyPopular(false);
    setMinRating(0);
    setSortBy('popular');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    searchQuery !== '' ||
    vegFilter !== 'all' ||
    onlyAvailable ||
    onlyPopular ||
    minRating > 0 ||
    sortBy !== 'popular';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Menu Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Freshly Prepared to Order</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
          Gangamma Food Menu
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed">
          Explore delicious Hyderabadi fast food dishes, street-style noodles, crispy snacks, and sizzling rolls.
        </p>
      </div>

      {/* Search & Main Filter Controls */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search chicken 65, noodles, biryani, dosa, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-11 pr-10 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Veg / Non-Veg Toggle & Sorting */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Veg / Non-Veg Pills */}
            <div className="bg-zinc-900 border border-zinc-800 p-1 rounded-2xl flex items-center gap-1">
              <button
                onClick={() => setVegFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  vegFilter === 'all'
                    ? 'bg-zinc-800 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setVegFilter('veg')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  vegFilter === 'veg'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60 shadow'
                    : 'text-zinc-400 hover:text-emerald-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Pure Veg</span>
              </button>
              <button
                onClick={() => setVegFilter('non-veg')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  vegFilter === 'non-veg'
                    ? 'bg-rose-950 text-rose-300 border border-rose-700/60 shadow'
                    : 'text-zinc-400 hover:text-rose-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Non-Veg</span>
              </button>
            </div>

            {/* Sorting Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-bold rounded-2xl px-4 py-2.5 appearance-none pr-8 focus:outline-none focus:border-amber-400 cursor-pointer shadow"
              >
                <option value="popular">🔥 Most Popular</option>
                <option value="rating">⭐ Highest Rated</option>
                <option value="price-low">₹ Price: Low to High</option>
                <option value="price-high">₹ Price: High to Low</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-3 pointer-events-none" />
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-xs text-amber-400 hover:underline font-bold px-2 py-1"
              >
                Reset All
              </button>
            )}
          </div>
        </div>

        {/* Category Horizontal Scroll Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 scale-102'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
              }`}
            >
              {cat === 'Special Items' && <Flame className="w-3.5 h-3.5 text-orange-600" />}
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Extra Filters Pill Row */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-500 font-semibold text-[11px] uppercase tracking-wider mr-1">
            Quick Filter:
          </span>

          <button
            onClick={() => setOnlyPopular(!onlyPopular)}
            className={`px-3 py-1.5 rounded-xl border transition-colors flex items-center gap-1.5 ${
              onlyPopular
                ? 'bg-amber-500/15 text-amber-300 border-amber-500'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Best Sellers</span>
          </button>

          <button
            onClick={() => setMinRating(minRating === 4.7 ? 0 : 4.7)}
            className={`px-3 py-1.5 rounded-xl border transition-colors flex items-center gap-1.5 ${
              minRating === 4.7
                ? 'bg-amber-500/15 text-amber-300 border-amber-500'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Rated 4.7+</span>
          </button>

          <button
            onClick={() => setOnlyAvailable(!onlyAvailable)}
            className={`px-3 py-1.5 rounded-xl border transition-colors ${
              onlyAvailable
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Available Now Only
          </button>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-zinc-400 mb-6 border-b border-zinc-800 pb-3">
        <span>
          Showing <b className="text-white">{filteredItems.length}</b> dishes in {selectedCategory}
        </span>
        <span className="text-zinc-500 text-[11px]">Click any dish to customize addons & spice</span>
      </div>

      {/* Food Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-16 rounded-3xl bg-zinc-900 border border-zinc-800 text-center max-w-md mx-auto my-8">
          <Utensils className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white font-display">No Dishes Found</h3>
          <p className="text-xs text-zinc-400 mt-1 mb-6">
            We couldn’t find any items matching your selected filters or search terms.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              onSelect={onSelectItem}
            />
          ))}
        </div>
      )}

    </div>
  );
};
