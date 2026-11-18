import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Filter, MapPin, Clock, Star, Phone, Scissors, CalendarCheck } from 'lucide-react';
import { Badge } from '../common/Badge';
import { ShopProfile } from '../../types';
import { ShopBookingModal } from './ShopBookingModal';

export const CustomerDashboard: React.FC = () => {
  const { shops, services, selectedShopForBooking, setSelectedShopForBooking } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('All');

  // Available service categories
  const serviceCategories = [
    'All',
    'Haircut',
    'Beard Trim',
    'Shave',
    'Hair Colour',
    'Kids Cut',
    'Head Massage',
    'Facial'
  ];

  // Filter shops by search query & service type
  const filteredShops = useMemo(() => {
    return shops.filter(shop => {
      // Name & location filter
      const matchesSearch =
        shop.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.city.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedServiceType === 'All') return true;

      // Check if shop offers selected service category
      const shopServices = services.filter(s => s.shopId === shop.id && s.isActive);
      return shopServices.some(s => s.serviceType === selectedServiceType);
    });
  }, [shops, services, searchQuery, selectedServiceType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Welcome Banner */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Find & Book Barbershops
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore premier styling lounges, view real-time slot availability, and reserve your queue token.
        </p>
      </div>

      {/* Search and Service Filter Bar (Wireframe Image 4) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Text Search Bar */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by barbershop name, landmark, or city..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Quick Clear */}
          {(searchQuery || selectedServiceType !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedServiceType('All');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Filter by Service Types (Wireframe Image 4: "All Service Types") */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter by Service:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {serviceCategories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedServiceType(category)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedServiceType === category
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category === 'All' ? 'All Service Types' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Available Barbershop Section (Wireframe Image 4: "Available barbershop") */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Available Barbershops ({filteredShops.length})
          </h2>
        </div>

        {filteredShops.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80">
            <Scissors className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No barbershops found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search terms or selecting 'All Service Types'.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredShops.map(shop => {
              const shopServices = services.filter(s => s.shopId === shop.id && s.isActive);

              return (
                <div
                  key={shop.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
                >
                  {/* Shop Details */}
                  <div className="flex gap-4 items-start">
                    <img
                      src={shop.logoUrl || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=150'}
                      alt=""
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                    />

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-slate-900">{shop.shopName}</h3>
                        {shop.emergencyAvailable && <Badge status="emergency" />}
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{shop.rating}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{shop.address}, {shop.city}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{shop.openingTime} - {shop.closingTime}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{shop.phone1}</span>
                        </span>
                      </div>

                      {/* Services Tags (Wireframe Image 4: "(Services)") */}
                      <div className="flex flex-wrap gap-1.5">
                        {shopServices.slice(0, 5).map(s => (
                          <span
                            key={s.id}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700"
                          >
                            {s.serviceName} (₹{s.cost})
                          </span>
                        ))}
                        {shopServices.length > 5 && (
                          <span className="text-[11px] text-slate-400 self-center">
                            +{shopServices.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Book Now Action (Wireframe Image 4: "Book Now") */}
                  <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row md:flex-col items-end gap-2">
                    <button
                      onClick={() => setSelectedShopForBooking(shop)}
                      className="w-full md:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                    >
                      <CalendarCheck className="w-4 h-4" />
                      <span>Book Now</span>
                    </button>
                    <span className="text-[11px] text-slate-400 text-center md:text-right w-full">
                      Instant Token &amp; Live Queue
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedShopForBooking && (
        <ShopBookingModal
          shop={selectedShopForBooking}
          onClose={() => setSelectedShopForBooking(null)}
        />
      )}
    </div>
  );
};
