import React, { useState } from 'react';
import {
  UtensilsCrossed,
  ShoppingBag,
  Heart,
  User as UserIcon,
  ShieldCheck,
  Menu as MenuIcon,
  X,
  PhoneCall,
  Sparkles,
  MapPin,
  Clock,
  LogOut,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { RESTAURANT_INFO } from '../../data/initialData';
import { formatCurrency } from '../../utils/helpers';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenAuth: (tab: 'login' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenAuth,
}) => {
  const { currentUser, isAdmin, logout, loginAsAdmin, loginAsCustomer } = useAuth();
  const { totalItemsCount, subtotal, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'offers', label: 'Offers & Deals' },
    { id: 'track', label: 'Track Order' },
  ];

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Banner Announcement */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-xs font-semibold py-1.5 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 truncate">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-200" />
              <span>Flat 10% OFF on all orders above ₹299! Code: <b className="bg-black/30 px-1.5 py-0.5 rounded text-amber-200 font-mono">GANGAMMA10</b></span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-white/90">
              <Clock className="w-3 h-3 text-amber-200" /> Open: {RESTAURANT_INFO.openingHours}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Demo Switcher to easily test Admin vs Customer */}
            <div className="flex items-center bg-black/30 rounded-full p-0.5 text-[11px]">
              <button
                onClick={loginAsCustomer}
                className={`px-2 py-0.5 rounded-full transition-colors ${
                  currentUser && !isAdmin ? 'bg-amber-400 text-black font-bold shadow' : 'text-white/80 hover:text-white'
                }`}
                title="Switch to Customer account"
              >
                Customer Mode
              </button>
              <button
                onClick={loginAsAdmin}
                className={`px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors ${
                  isAdmin ? 'bg-amber-400 text-black font-bold shadow' : 'text-white/80 hover:text-white'
                }`}
                title="Switch to Admin portal"
              >
                <ShieldCheck className="w-3 h-3" /> Admin Mode
              </button>
            </div>

            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="hidden sm:flex items-center gap-1 text-white/90 hover:text-white font-medium transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-amber-200" />
              <span>{RESTAURANT_INFO.phone}</span>
            </a>

            <a
              href={`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=Hello%20Gangamma%20Fast%20Food%2C%20I%20want%20to%20place%20an%20order`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-2.5 py-1 rounded-full shadow transition-colors"
              title="Chat & Order on WhatsApp: +91 63724 81457"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#12141a]/95 backdrop-blur-md border-b border-zinc-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
            id="brand-logo-btn"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-6 h-6 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl text-white tracking-tight font-display">
                  Gangamma
                </span>
                <span className="text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 px-1.5 py-0.5 rounded">
                  Fast Food
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block font-medium">
                Fresh • Hot • Made for You
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {isAdmin && (
              <button
                id="nav-admin-tab"
                onClick={() => handleNavClick('admin')}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 border transition-all ${
                  currentView === 'admin'
                    ? 'bg-amber-400 text-black border-amber-400 shadow-md shadow-amber-500/25'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Loyalty Points Pill (If customer logged in) */}
            {currentUser && !isAdmin && (
              <button
                onClick={() => handleNavClick('profile')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-bold transition-colors"
                title="Your Gangamma Loyalty Points"
                id="user-loyalty-pill"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentUser.loyaltyPoints} Pts</span>
              </button>
            )}

            {/* Favorites Button */}
            {currentUser && (
              <button
                onClick={() => handleNavClick('profile')}
                id="nav-favorites-btn"
                className="p-2.5 rounded-xl text-zinc-300 hover:text-rose-400 hover:bg-zinc-800/70 transition-colors relative"
                title="View Favorites"
              >
                <Heart className="w-5 h-5" />
                {currentUser.favorites && currentUser.favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {currentUser.favorites.length}
                  </span>
                )}
              </button>
            )}

            {/* Cart Trigger Button */}
            <button
              id="nav-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-md shadow-orange-600/30 transition-all transform active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4.5 h-4.5 rounded-full bg-amber-300 text-black text-[11px] font-extrabold flex items-center justify-center animate-scaleIn">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
              {subtotal > 0 && (
                <span className="border-l border-white/20 pl-2 text-xs font-semibold text-amber-200">
                  {formatCurrency(subtotal)}
                </span>
              )}
            </button>

            {/* User Dropdown / Login */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-menu-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-zinc-800 transition-colors border border-zinc-800"
                >
                  <div className="w-8 h-8 rounded-lg bg-zinc-700 flex items-center justify-center text-white text-xs font-bold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="w-4 h-4 text-zinc-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2.5 border-b border-zinc-800">
                      <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                      <p className="text-xs text-zinc-400 truncate">{currentUser.email || currentUser.phone}</p>
                      <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                        <Sparkles className="w-3 h-3" /> {currentUser.loyaltyPoints} Loyalty Points
                      </div>
                    </div>

                    <button
                      onClick={() => handleNavClick('profile')}
                      className="w-full px-4 py-2.5 text-left text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/80 flex items-center gap-2.5"
                    >
                      <UserIcon className="w-4 h-4 text-zinc-400" />
                      <span>My Profile & Orders</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('track')}
                      className="w-full px-4 py-2.5 text-left text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/80 flex items-center gap-2.5"
                    >
                      <Clock className="w-4 h-4 text-zinc-400" />
                      <span>Track Active Order</span>
                    </button>

                    {isAdmin ? (
                      <button
                        onClick={() => handleNavClick('admin')}
                        className="w-full px-4 py-2.5 text-left text-sm text-amber-400 hover:bg-amber-500/10 flex items-center gap-2.5 font-semibold"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          loginAsAdmin();
                          setUserDropdownOpen(false);
                          setCurrentView('admin');
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/80 flex items-center gap-2.5"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>Switch to Admin</span>
                      </button>
                    )}

                    <div className="border-t border-zinc-800 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="nav-login-btn"
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-2 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
                >
                  Log In
                </button>
                <button
                  id="nav-signup-btn"
                  onClick={() => onOpenAuth('signup')}
                  className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-sm font-semibold bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800 bg-zinc-900/98 px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center justify-between ${
                  currentView === link.id
                    ? 'bg-amber-500 text-black font-bold'
                    : 'text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                <span>{link.label}</span>
              </button>
            ))}

            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Management Portal</span>
              </button>
            )}

            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Hyderabad
              </span>
              <div className="flex items-center gap-3">
                <a href={`tel:${RESTAURANT_INFO.phone}`} className="text-amber-400 font-semibold flex items-center gap-1">
                  <PhoneCall className="w-3 h-3" /> Call
                </a>
                <a
                  href={`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=Hello%20Gangamma%20Fast%20Food%2C%20I%20want%20to%20place%20an%20order`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 font-semibold flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom Navigation for swift mobile access */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800/80 px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => handleNavClick('home')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
            currentView === 'home' ? 'text-amber-400' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <UtensilsCrossed className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => handleNavClick('menu')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
            currentView === 'menu' ? 'text-amber-400' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <MenuIcon className="w-5 h-5 mb-0.5" />
          <span>Menu</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative -top-4 flex flex-col items-center justify-center w-13 h-13 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 text-black shadow-lg shadow-orange-600/40 transform active:scale-95 transition-transform"
        >
          <ShoppingBag className="w-6 h-6 stroke-[2.5]" />
          {totalItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-amber-400">
              {totalItemsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => handleNavClick('track')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
            currentView === 'track' ? 'text-amber-400' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Clock className="w-5 h-5 mb-0.5" />
          <span>Track</span>
        </button>

        <button
          onClick={() => {
            if (currentUser) {
              handleNavClick('profile');
            } else {
              onOpenAuth('login');
            }
          }}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
            currentView === 'profile' ? 'text-amber-400' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <UserIcon className="w-5 h-5 mb-0.5" />
          <span>{currentUser ? 'Profile' : 'Login'}</span>
        </button>
      </div>
    </>
  );
};
