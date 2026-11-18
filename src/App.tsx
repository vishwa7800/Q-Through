import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/auth/AuthModal';

// Views
import { LandingPage } from './components/landing/LandingPage';
import { CustomerOnboarding } from './components/onboarding/CustomerOnboarding';
import { ShopOnboarding } from './components/onboarding/ShopOnboarding';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { MyBookings } from './components/customer/MyBookings';
import { CustomerProfileModal } from './components/customer/CustomerProfileModal';
import { ShopDashboard } from './components/shop/ShopDashboard';
import { ShopServices } from './components/shop/ShopServices';
import { ShopBarbers } from './components/shop/ShopBarbers';
import { ShopProfileModal } from './components/shop/ShopProfileModal';

export const AppContent: React.FC = () => {
  const { currentView } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'customer-onboarding':
        return <CustomerOnboarding />;
      case 'shop-onboarding':
        return <ShopOnboarding />;
      case 'customer-dashboard':
        return <CustomerDashboard />;
      case 'my-bookings':
        return <MyBookings />;
      case 'customer-profile':
        return <CustomerProfileModal />;
      case 'shop-dashboard':
        return <ShopDashboard />;
      case 'shop-services':
        return <ShopServices />;
      case 'shop-barbers':
        return <ShopBarbers />;
      case 'shop-profile':
        return <ShopProfileModal />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1">
        {renderCurrentView()}
      </main>
      <Footer />
      <AuthModal />
    </div>
  );
};
