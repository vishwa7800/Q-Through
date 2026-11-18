import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Store, MapPin, Phone, Clock, Users, ArrowRight, ShieldCheck, Camera, Plus, Trash2 } from 'lucide-react';

export const ShopOnboarding: React.FC = () => {
  const { saveShopProfile } = useApp();

  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [phone3, setPhone3] = useState('');
  const [openingTime, setOpeningTime] = useState('09:00');
  const [closingTime, setClosingTime] = useState('21:00');
  const [dailyCapacity, setDailyCapacity] = useState('40');
  const [emergencyAvailable, setEmergencyAvailable] = useState(true);
  const [regNumber, setRegNumber] = useState('');
  const [logoUrl, setLogoUrl] = useState(
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&h=200&fit=crop&crop=faces'
  );
  const [error, setError] = useState('');

  // Initial services to create along with shop
  const [initialServices, setInitialServices] = useState([
    { serviceName: 'Classic Haircut', serviceType: 'Haircut', durationMinutes: 30, cost: 350 },
    { serviceName: 'Beard Trim & Edge', serviceType: 'Beard Trim', durationMinutes: 20, cost: 200 }
  ]);

  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');

  const handleAddInitialService = () => {
    if (!newServiceName.trim() || !newServicePrice) return;
    setInitialServices([
      ...initialServices,
      {
        serviceName: newServiceName.trim(),
        serviceType: 'Haircut',
        durationMinutes: 30,
        cost: Number(newServicePrice) || 300
      }
    ]);
    setNewServiceName('');
    setNewServicePrice('');
  };

  const handleRemoveService = (index: number) => {
    setInitialServices(initialServices.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!shopName.trim() || !address.trim() || !city.trim() || !phone1.trim()) {
      setError('Please fill in all mandatory shop fields.');
      return;
    }

    const phoneRegex = /^[789]\d{9}$/;
    if (!phoneRegex.test(phone1.trim())) {
      setError('Primary phone number (Phone 1) must be a valid 10-digit number starting with 7, 8, or 9.');
      return;
    }

    const capacityNum = parseInt(dailyCapacity, 10);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      setError('Daily capacity must be a valid positive number.');
      return;
    }

    if (initialServices.length === 0) {
      setError('Please add at least one grooming service for your shop.');
      return;
    }

    // Save shop profile and attach all initial services to the new shop's real ID
    await saveShopProfile(
      {
        shopName: shopName.trim(),
        address: address.trim(),
        city: city.trim(),
        phone1: phone1.trim(),
        phone2: phone2.trim(),
        phone3: phone3.trim(),
        openingTime,
        closingTime,
        dailyCapacity: capacityNum,
        emergencyAvailable,
        logoUrl,
        registrationNumber: regNumber.trim() || `REG-${Date.now().toString().slice(-6)}`
      },
      initialServices.map(s => ({
        serviceName: s.serviceName,
        serviceType: s.serviceType as any,
        durationMinutes: s.durationMinutes,
        cost: s.cost
      }))
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200/80">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
            Step 2: Shop Registration & Setup
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Register Barbershop Details
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Establish your business profile, operating hours, capacity, and service catalog.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Center Logo (Wireframe Image 2: "Center Logo circle") */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <img
                src={logoUrl}
                alt="Shop Logo Preview"
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg ring-2 ring-purple-500/20"
              />
              <div className="absolute inset-0 bg-slate-900/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 mt-2">Shop Center Logo</p>
          </div>

          {/* Shop Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Shop Name *
            </label>
            <div className="relative">
              <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                placeholder="e.g. Crown & Blade Barber Lounge"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Address & City */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Street Address *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="e.g. 15 Linking Road, Bandra West"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                City *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="e.g. Mumbai"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Phone Numbers: 1, 2, 3 (Wireframe Image 2: "Phone Number: 1 [ ] 2 [ ] 3 [ ]") */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Contact Phone Numbers (Phone 1 Required, 2 & 3 Optional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-slate-500 font-medium">Phone 1 (Primary) *</span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone1}
                  onChange={e => setPhone1(e.target.value.replace(/\D/g, ''))}
                  placeholder="Primary 10-digit"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-medium">Phone 2 (Secondary)</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone2}
                  onChange={e => setPhone2(e.target.value.replace(/\D/g, ''))}
                  placeholder="Secondary (opt)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-medium">Phone 3 (Landline/Other)</span>
                <input
                  type="tel"
                  value={phone3}
                  onChange={e => setPhone3(e.target.value)}
                  placeholder="Other (opt)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>
          </div>

          {/* Operating Hours & Daily Patient/Client Capacity (Wireframe Image 2: "Opening time, closing time, Daily Patient Capacity") */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Opening Time *
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="time"
                  required
                  value={openingTime}
                  onChange={e => setOpeningTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Closing Time *
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="time"
                  required
                  value={closingTime}
                  onChange={e => setClosingTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Daily Capacity *
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  required
                  min="1"
                  max="200"
                  value={dailyCapacity}
                  onChange={e => setDailyCapacity(e.target.value)}
                  placeholder="e.g. 45"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          {/* Emergency Availability & Registration */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 gap-4">
            <div>
              <p className="text-xs font-bold text-slate-800">24/7 Emergency Service Support</p>
              <p className="text-[11px] text-slate-500">Available for urgent wedding/event groomings after hours</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emergencyAvailable}
                onChange={e => setEmergencyAvailable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Services with Prices (Wireframe Image 2: "Services with prices") */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Initial Services & Pricing
            </label>
            <div className="space-y-2 mb-3">
              {initialServices.map((srv, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <span className="font-semibold text-slate-800">{srv.serviceName}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono">₹{srv.cost}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveService(idx)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add service inline */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Service Name (e.g. Hot Towel Shave)"
                value={newServiceName}
                onChange={e => setNewServiceName(e.target.value)}
                className="flex-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <input
                type="number"
                placeholder="₹ Price"
                value={newServicePrice}
                onChange={e => setNewServicePrice(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAddInitialService}
                className="px-3 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-bold border border-purple-200 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-500/25 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <span>Complete Setup & Launch Live Queue Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
