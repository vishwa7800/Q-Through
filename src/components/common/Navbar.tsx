import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Scissors,
  Calendar,
  User as UserIcon,
  LogOut,
  Store,
  Layers,
  ChevronDown,
  Sparkles,
  Menu,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    customerProfile,
    shopProfile,
    currentRole,
    currentView,
    setCurrentView,
    openAuthModal,
    logout,
    demoLogin,
    bookings,
    isSyncing
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active bookings count for customer
  const activeBookingsCount = bookings.filter(
    b => b.customerId === currentUser?.id && (b.status === 'waiting' || b.status === 'in_progress')
  ).length;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (!currentUser) setCurrentView('landing');
                else if (currentUser.role === 'customer') setCurrentView('customer-dashboard');
                else setCurrentView('shop-dashboard');
              }}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-brand-700 via-brand-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Scissors className="w-5 h-5 -rotate-45" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                Q-Through
              </span>
            </button>
          </div>

          {/* Navigation Links based on role */}
          <nav className="hidden md:flex items-center gap-2">
            {!currentUser ? (
              // Landing Page Nav (Wireframe Image 3)
              <div className="flex items-center gap-6">
                <a
                  href="#about"
                  onClick={e => {
                    e.preventDefault();
                    setCurrentView('landing');
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors"
                >
                  About
                </a>
                <a
                  href="#features"
                  onClick={e => {
                    e.preventDefault();
                    setCurrentView('landing');
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#collaborations"
                  onClick={e => {
                    e.preventDefault();
                    setCurrentView('landing');
                    document.getElementById('collaborations')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors"
                >
                  Collaborations
                </a>

                {/* Quick Mentor Demo Switchers */}
                <div className="h-4 w-px bg-slate-200 mx-1"></div>
                <button
                  onClick={() => demoLogin('customer')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200/60 transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Demo as User
                </button>
                <button
                  onClick={() => demoLogin('shop')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60 transition-colors flex items-center gap-1"
                >
                  <Store className="w-3.5 h-3.5" />
                  Demo as Shop
                </button>

                <button
                  onClick={() => openAuthModal('signup', 'customer')}
                  className="text-sm font-semibold px-4 py-2 rounded-xl text-brand-600 hover:bg-brand-50 border border-brand-200 transition-all"
                >
                  Signup
                </button>
                <button
                  onClick={() => openAuthModal('login', 'customer')}
                  className="text-sm font-semibold px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/20 transition-all hover:shadow"
                >
                  Login
                </button>
              </div>
            ) : currentRole === 'customer' ? (
              // Customer Portal Nav (Wireframe Image 4)
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView('customer-dashboard')}
                  className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'customer-dashboard'
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Find Barbershops
                </button>

                <button
                  onClick={() => setCurrentView('my-bookings')}
                  className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors relative flex items-center gap-1.5 ${
                    currentView === 'my-bookings'
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  My Bookings
                  {activeBookingsCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[11px] font-bold flex items-center justify-center">
                      {activeBookingsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setCurrentView('customer-profile')}
                  className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                    currentView === 'customer-profile'
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  Profile
                </button>

                {/* User email badge */}
                <div className="ml-2 pl-3 border-l border-slate-200 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-200 overflow-hidden flex items-center justify-center text-brand-700 text-xs font-bold">
                    {customerProfile?.profilePicUrl ? (
                      <img src={customerProfile.profilePicUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      customerProfile?.fullName?.[0] || 'U'
                    )}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-semibold text-slate-800 leading-tight">
                      {customerProfile?.fullName || 'User'}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate max-w-[120px]">
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors ml-1 flex items-center gap-1.5"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              // Shop Portal Nav (Wireframe Image 5)
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView('shop-dashboard')}
                  className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'shop-dashboard'
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Live Queue
                </button>

                <button
                  onClick={() => setCurrentView('shop-services')}
                  className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                    currentView === 'shop-services'
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Services
                </button>

                <button
                  onClick={() => setCurrentView('shop-barbers')}
                  className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                    currentView === 'shop-barbers'
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Scissors className="w-4 h-4" />
                  Barbers
                </button>

                <button
                  onClick={() => setCurrentView('shop-profile')}
                  className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                    currentView === 'shop-profile'
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  Shop Profile
                </button>

                {/* Shop identifier badge */}
                <div className="ml-2 pl-3 border-l border-slate-200 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 border border-purple-200 overflow-hidden flex items-center justify-center text-purple-700 text-xs font-bold">
                    {shopProfile?.logoUrl ? (
                      <img src={shopProfile.logoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Store className="w-4 h-4" />
                    )}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-semibold text-slate-800 leading-tight truncate max-w-[130px]">
                      {shopProfile?.shopName || 'Barbershop'}
                    </p>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-1 rounded font-mono">
                      SHOP ID: {shopProfile?.id?.slice(0, 8) || '01'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors ml-1 flex items-center gap-1.5"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          {!currentUser ? (
            <div className="space-y-2">
              <button
                onClick={() => {
                  setCurrentView('landing');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 font-medium text-slate-700"
              >
                Home & About
              </button>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    demoLogin('customer');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 bg-sky-50 text-sky-700 rounded-lg font-semibold text-xs text-center"
                >
                  Demo as User
                </button>
                <button
                  onClick={() => {
                    demoLogin('shop');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 bg-purple-50 text-purple-700 rounded-lg font-semibold text-xs text-center"
                >
                  Demo as Shop
                </button>
                <button
                  onClick={() => {
                    openAuthModal('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 border border-brand-300 text-brand-600 rounded-lg font-semibold text-sm"
                >
                  Signup
                </button>
                <button
                  onClick={() => {
                    openAuthModal('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 bg-brand-600 text-white rounded-lg font-semibold text-sm"
                >
                  Login
                </button>
              </div>
            </div>
          ) : currentRole === 'customer' ? (
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-slate-50 text-xs mb-2">
                Signed in as <span className="font-semibold">{customerProfile?.fullName || currentUser.email}</span>
              </div>
              <button
                onClick={() => {
                  setCurrentView('customer-dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 font-medium text-slate-700"
              >
                Find Barbershops
              </button>
              <button
                onClick={() => {
                  setCurrentView('my-bookings');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 font-medium text-slate-700 flex justify-between items-center"
              >
                <span>My Bookings</span>
                {activeBookingsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-brand-600 text-white text-xs font-bold">
                    {activeBookingsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setCurrentView('customer-profile');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 font-medium text-slate-700"
              >
                My Profile
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 font-medium text-rose-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-purple-50 text-xs mb-2 text-purple-900">
                Shop: <span className="font-semibold">{shopProfile?.shopName}</span>
              </div>
              <button
                onClick={() => {
                  setCurrentView('shop-dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 font-medium text-slate-700"
              >
                Live Queue Dashboard
              </button>
              <button
                onClick={() => {
                  setCurrentView('shop-services');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 font-medium text-slate-700"
              >
                Manage Services
              </button>
              <button
                onClick={() => {
                  setCurrentView('shop-barbers');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 font-medium text-slate-700"
              >
                Manage Barbers
              </button>
              <button
                onClick={() => {
                  setCurrentView('shop-profile');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 font-medium text-slate-700"
              >
                Shop Profile
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 font-medium text-rose-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
