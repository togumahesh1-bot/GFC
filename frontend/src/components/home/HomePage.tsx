import React from 'react';
import {
  Sparkles,
  Clock,
  Bike,
  ShieldCheck,
  Star,
  ArrowRight,
  Flame,
  Percent,
  PhoneCall,
  MessageSquare,
  Award,
  HeartHandshake,
  CheckCircle,
  MapPin,
} from 'lucide-react';
import { FoodItem, FoodCategory } from '../../types';
import { db } from '../../db/storage';
import { RESTAURANT_INFO } from '../../data/initialData';
import { formatCurrency } from '../../utils/helpers';
import { FoodCard } from '../menu/FoodCard';

interface HomePageProps {
  onNavigateToMenu: (category?: FoodCategory) => void;
  onSelectItem: (item: FoodItem) => void;
  onOpenOffers: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToMenu,
  onSelectItem,
  onOpenOffers,
}) => {
  const allFood = db.getFoodItems();
  const specialItems = allFood.filter((i) => i.isSpecial).slice(0, 4);
  const popularItems = allFood.filter((i) => i.isPopular).slice(0, 4);
  const reviews = db.getReviews().slice(0, 4);

  const categoriesShortcut: { name: FoodCategory; image: string }[] = [
    {
      name: 'Special Items',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Fast Food',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Rice Items',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Noodles',
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Breakfast',
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Fried Items',
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="space-y-16 animate-fadeIn pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-900 via-zinc-950 to-black pt-8 pb-16 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Local Favorite Since 2012 • 4.8★ Rated (1,850+ Google Reviews)</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] font-display">
                Hot, Fresh & Sizzling Fast Food in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300">Hyderabad</span>
              </h1>

              <p className="text-zinc-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Order authentic street-style noodles, fragrant biryani, crunchy chicken 65, and hot butter dosas directly from <b>Gangamma Fast Food</b>. Zero middleman markups, cooked fresh to order, and delivered piping hot to your doorstep.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigateToMenu()}
                  className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-sm shadow-xl shadow-amber-500/25 transition-all transform active:scale-95 flex items-center gap-2"
                >
                  <span>Order Online Now</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>

                <button
                  onClick={onOpenOffers}
                  className="px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-zinc-700 hover:border-amber-500 text-sm font-bold transition-all flex items-center gap-2"
                >
                  <Percent className="w-4 h-4" />
                  <span>Today's Offers & Deals</span>
                </button>

                <a
                  href={`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=Hi%20Gangamma%20Fast%20Food%2C%20I%20want%20to%20order%20food!`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3.5 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 text-sm font-bold transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Order</span>
                </a>
              </div>

              {/* Key Features Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800/80 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">20-30 Mins</span>
                    <span className="text-[11px] text-zinc-400">Express Delivery</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <Bike className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Free Delivery</span>
                    <span className="text-[11px] text-zinc-400">Orders above ₹299</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">100% Fresh</span>
                    <span className="text-[11px] text-zinc-400">Cooked to Order</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Hero Visual Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-900 group">
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
                  alt="Gangamma Special Biryani"
                  className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                {/* Floating Special Dish Tag */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-zinc-950/90 backdrop-blur-md border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider">
                      Today's Bestseller
                    </span>
                    <h4 className="font-bold text-white text-base mt-1 font-display">
                      Gangamma Spl. Chicken Biryani
                    </h4>
                    <p className="text-xs text-amber-400 font-bold">₹160 • Extra Leg Piece included</p>
                  </div>

                  <button
                    onClick={() => {
                      const item = allFood.find((i) => i.id === 'food-1');
                      if (item) onSelectItem(item);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow transition-colors"
                  >
                    Order Now
                  </button>
                </div>
              </div>

              {/* Floating Offer Badge */}
              <div className="absolute -top-4 -right-4 p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-black shadow-xl hidden sm:block rotate-6">
                <span className="block text-2xl font-black font-display">₹50 OFF</span>
                <span className="block text-[11px] font-extrabold tracking-wider uppercase">
                  Use Code: FIRST50
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Shortcut Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-white font-display">Explore by Category</h2>
            <p className="text-xs text-zinc-400">Quickly browse popular food categories</p>
          </div>

          <button
            onClick={() => onNavigateToMenu()}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
          >
            <span>View All Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoriesShortcut.map((cat) => (
            <div
              key={cat.name}
              onClick={() => onNavigateToMenu(cat.name)}
              className="cursor-pointer group rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/60 p-3 text-center transition-all hover:-translate-y-1 shadow-lg"
            >
              <div className="w-16 h-16 mx-auto rounded-full overflow-hidden mb-2 bg-zinc-800">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors font-display">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Chef's Specials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white font-display">Chef's Signature Specials</h2>
              <p className="text-xs text-zinc-400">Our highest rated customer favorites</p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToMenu('Special Items')}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
          >
            <span>More Specials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialItems.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              onSelect={onSelectItem}
            />
          ))}
        </div>
      </section>

      {/* Value Proposition: Why Order Direct from Gangamma? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900 border border-zinc-800 relative overflow-hidden">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-display">
              The Gangamma Promise
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight mt-1 font-display">
              Why Direct Ordering Beats Big Food Aggregators
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Third-party delivery apps inflate menu prices by up to 30%. When you order directly from us:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Percent className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base font-display">Zero Menu Markups</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Enjoy exact restaurant counter prices with no hidden service charges, packing fees, or surge pricing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base font-display">Gangamma Loyalty Cashback</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Earn 10 points for every ₹100 spent. 1 Point = ₹1 off on any future order with no expiry!
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base font-display">Direct Kitchen Contact</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Speak directly with the chef or manager for custom spice levels, quick updates, or dietary needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Most Popular Dishes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-white font-display">Trending This Week</h2>
            <p className="text-xs text-zinc-400">Loved by hundreds of foodies daily</p>
          </div>

          <button
            onClick={() => onNavigateToMenu()}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
          >
            <span>Browse Full Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularItems.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              onSelect={onSelectItem}
            />
          ))}
        </div>
      </section>

      {/* Customer Reviews & Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-display">
            Happy Foodies
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 font-display">
            What Our Regulars Say
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real reviews from verified Hyderabad customers who dine with Gangamma Fast Food.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white text-xs">{rev.customerName}</h4>
                  <span className="text-[10px] text-zinc-500">{rev.date}</span>
                </div>
                {rev.isVerifiedPurchase && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Restaurant Location & Hours Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Visit or Contact Gangamma Fast Food</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {RESTAURANT_INFO.address} • Open daily 7:00 AM – 11:30 PM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>Call Us</span>
            </a>
            <a
              href={`https://wa.me/${RESTAURANT_INFO.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
