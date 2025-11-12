import React, { useState } from 'react';

// Import all the new pages
import AppProviders from './contexts';
import Header from './components/layout/Header';
import MobileMenu from './components/layout/MobileMenu';
import Footer from './components/layout/Footer';
import HomePage from './pages/Home';
import ProductDetailPage from './pages/ProductDetail';
import CartPage from './pages/Cart';
import CheckoutPage from './pages/Checkout';
import OrderConfirmationPage from './pages/OrderConfirmation';
import OrderHistoryPage from './pages/OrderHistory';
import ProfilePage from './pages/Profile';
import AdminPanelPage from './pages/Admin';
import AuthPage from './pages/Auth';
import AboutPage from './pages/About'; // <-- New Page
import { useAuth } from './contexts/AuthContext';

/**
 * The AppContent component contains your routing logic.
 * It's wrapped by useAuth to access authentication state for protected routes.
 */
const AppContent = () => {
  const [page, setPage] = useState('home');
  const [context, setContext] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // We get auth status here for route protection
  const { isAuthenticated, isAdmin } = useAuth();

  const navigate = (pageName, newContext = null) => {
    setPage(pageName);
    setContext(newContext);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    // Protected Routes
    if (page === 'checkout' && !isAuthenticated) return <AuthPage setPage={navigate} />;
    if (page === 'orders' && !isAuthenticated) return <AuthPage setPage={navigate} />;
    if (page === 'profile' && !isAuthenticated) return <AuthPage setPage={navigate} />;
    
    // Admin Route
    if (page === 'admin' && !isAdmin) {
        // Silently redirect to home if not admin
        return <HomePage setPage={navigate} setSelectedProductId={setSelectedProductId} />;
    }

    switch (page) {
      case 'home':
        return <HomePage setPage={navigate} setSelectedProductId={setSelectedProductId} />;
      case 'productDetail':
        return <ProductDetailPage setPage={navigate} productId={selectedProductId} />;
      case 'cart':
        return <CartPage setPage={navigate} />;
      case 'checkout':
        return <CheckoutPage setPage={navigate} />;
      case 'orderConfirmation':
        return <OrderConfirmationPage setPage={navigate} context={context} />;
      case 'orders':
        return <OrderHistoryPage setPage={navigate} />;
      case 'profile':
        return <ProfilePage setPage={navigate} />;
      case 'admin':
        return <AdminPanelPage setPage={navigate} />;
      case 'login':
        return <AuthPage setPage={navigate} />;
      case 'about': // <-- New Page Route
        return <AboutPage setPage={navigate} />;
      default:
        return <HomePage setPage={navigate} setSelectedProductId={setSelectedProductId} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-amber-50 font-sans">
      <Header setPage={navigate} setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu isOpen={mobileMenuOpen} setOpen={setMobileMenuOpen} setPage={navigate} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer setPage={navigate} />
    </div>
  );
};

/**
 * The main App component wraps the content in all the necessary Context Providers.
 */
export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}