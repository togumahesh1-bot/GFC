import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { PolicyModal } from './components/common/PolicyModal';
import { AuthModal } from './components/customer/AuthModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { OffersModal } from './components/offers/OffersModal';
import { FoodDetailsModal } from './components/menu/FoodDetailsModal';
import { HomePage } from './components/home/HomePage';
import { MenuPage } from './components/menu/MenuPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderTrackingPage } from './components/tracking/OrderTrackingPage';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { FoodItem, FoodCategory, Order } from './types';

type ActiveView = 'home' | 'menu' | 'checkout' | 'track' | 'profile' | 'admin';
type PolicyType = 'privacy' | 'terms' | 'refund' | null;

const MainContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ActiveView>('home');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'All'>('All');
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(null);
  const [isOffersOpen, setIsOffersOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);
  const [trackedOrderId, setTrackedOrderId] = useState<string | null>(null);

  const { setIsAuthModalOpen, currentUser } = useAuth();
  const { setIsCartOpen } = useCart();

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleNavigateToMenu = (category?: FoodCategory) => {
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory('All');
    }
    setCurrentView('menu');
  };

  const handleTrackOrder = (orderId: string) => {
    setTrackedOrderId(orderId);
    setCurrentView('track');
  };

  const handleOrderSuccess = (order: Order) => {
    setTrackedOrderId(order.orderNumber);
    setCurrentView('track');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c10] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Main Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenOffers={() => setIsOffersOpen(true)}
      />

      {/* Main View Display */}
      <main className="flex-1 pb-20 md:pb-8">
        {currentView === 'home' && (
          <HomePage
            onNavigateToMenu={handleNavigateToMenu}
            onSelectItem={setSelectedFoodItem}
            onOpenOffers={() => setIsOffersOpen(true)}
          />
        )}

        {currentView === 'menu' && (
          <MenuPage
            initialCategory={selectedCategory}
            onSelectItem={setSelectedFoodItem}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onBackToMenu={() => setCurrentView('menu')}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentView === 'track' && (
          <OrderTrackingPage
            initialOrderId={trackedOrderId}
            onNavigateToMenu={() => setCurrentView('menu')}
          />
        )}

        {currentView === 'profile' && (
          currentUser ? (
            <CustomerDashboard
              onNavigateToMenu={() => setCurrentView('menu')}
              onTrackOrder={handleTrackOrder}
              onSelectFoodItem={setSelectedFoodItem}
            />
          ) : (
            <div className="max-w-md mx-auto px-4 py-24 text-center">
              <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-2 font-display">Sign In to View Profile</h3>
                <p className="text-xs text-zinc-400 mb-6">
                  Access your past food orders, earn loyalty reward points, and manage delivery addresses.
                </p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-all"
                >
                  Sign In / Register
                </button>
              </div>
            </div>
          )
        )}

        {currentView === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={setCurrentView}
        onOpenPolicy={(policy) => setActivePolicy(policy)}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => setCurrentView('checkout')}
        onNavigateToMenu={() => setCurrentView('menu')}
      />

      {/* Food Details & Customization Modal */}
      <FoodDetailsModal
        item={selectedFoodItem}
        onClose={() => setSelectedFoodItem(null)}
        onProceedToCheckout={() => {
          setSelectedFoodItem(null);
          setCurrentView('checkout');
        }}
      />

      {/* Offers & Deals Modal */}
      <OffersModal
        isOpen={isOffersOpen}
        onClose={() => setIsOffersOpen(false)}
        onNavigateToMenu={() => {
          setIsOffersOpen(false);
          setCurrentView('menu');
        }}
      />

      {/* Auth Modal (Login / Signup / Forgot) */}
      <AuthModal />

      {/* Legal Policy Modal */}
      <PolicyModal
        type={activePolicy}
        onClose={() => setActivePolicy(null)}
      />

      {/* Floating WhatsApp Chat & Order Button */}
      <FloatingWhatsApp />
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <MainContent />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
