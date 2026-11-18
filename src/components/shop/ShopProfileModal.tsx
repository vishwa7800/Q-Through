import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Store, MapPin, Phone, Clock, Users, Check, ArrowLeft } from 'lucide-react';

export const ShopProfileModal: React.FC = () => {
  const { shopProfile, saveShopProfile, setCurrentView } = useApp();

  const [shopName, setShopName] = useState(shopProfile?.shopName || '');
  const [address, setAddress] = useState(shopProfile?.address || '');
  const [city, setCity] = useState(shopProfile?.city || '');
  const [phone1, setPhone1] = useState(shopProfile?.phone1 || '');
  const [phone2, setPhone2] = useState(shopProfile?.phone2 || '');
  const [phone3, setPhone3] = useState(shopProfile?.phone3 || '');
  const [openingTime, setOpeningTime] = useState(shopProfile?.openingTime || '09:00');
  const [closingTime, setClosingTime] = useState(shopProfile?.closingTime || '21:00');
  const [dailyCapacity, setDailyCapacity] = useState(shopProfile?.dailyCapacity?.toString() || '45');
  const [emergencyAvailable, setEmergencyAvailable] = useState(shopProfile?.emergencyAvailable ?? true);
  const [description, setDescription] = useState(shopProfile?.description || '');
  const [logoUrl, setLogoUrl] = useState(shopProfile?.logoUrl || '');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!shopName.trim() || !address.trim() || !city.trim() || !phone1.trim()) {
      setError('Please fill in mandatory shop fields.');
      return;
    }

    saveShopProfile({
      shopName: shopName.trim(),
      address: address.trim(),
      city: city.trim(),
      phone1: phone1.trim(),
      phone2: phone2.trim(),
      phone3: phone3.trim(),
      openingTime,
      closingTime,
      dailyCapacity: parseInt(dailyCapacity, 10) || 40,
      emergencyAvailable,
      description: description.trim(),
      logoUrl
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => setCurrentView('shop-dashboard')}
        className="text-xs font-bold text-slate-500 hover:text-purple-600 flex items-center gap-1.5 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Queue Dashboard</span>
      </button>

      {/* Wireframe Image 5 note: "Opens a window to edit center name, address, phone, operating hours, upload pics and save/ update button" */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Barbershop Profile</h1>
            <p className="text-xs text-slate-500 mt-1">
              Edit shop branding, contact numbers, hours, and daily client capacity.
            </p>
          </div>
          {success && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>Updated Successfully!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <img
              src={logoUrl || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=150'}
              alt="Logo"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500 shadow-sm"
            />
            <div>
              <p className="text-xs font-bold text-slate-800">Shop Logo</p>
              <p className="text-[11px] text-slate-400">Displayed on customer booking cards</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Center / Shop Name *
            </label>
            <input
              type="text"
              required
              value={shopName}
              onChange={e => setShopName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Full Street Address *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          {/* Phone Numbers (1, 2, 3) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Phone Numbers
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-slate-500">Phone 1 (Primary) *</span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone1}
                  onChange={e => setPhone1(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500">Phone 2 (Secondary)</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone2}
                  onChange={e => setPhone2(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500">Phone 3 (Landline)</span>
                <input
                  type="tel"
                  value={phone3}
                  onChange={e => setPhone3(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* Operating Hours & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Opening Time *
              </label>
              <input
                type="time"
                required
                value={openingTime}
                onChange={e => setOpeningTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Closing Time *
              </label>
              <input
                type="time"
                required
                value={closingTime}
                onChange={e => setClosingTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Daily Capacity *
              </label>
              <input
                type="number"
                required
                min="1"
                max="200"
                value={dailyCapacity}
                onChange={e => setDailyCapacity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          {/* Emergency support */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-xs font-bold text-slate-800">24/7 Emergency Grooming Service</p>
              <p className="text-[11px] text-slate-500">Indicates urgent night/weekend slot capability</p>
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

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Shop Description &amp; Highlights
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentView('shop-dashboard')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20"
            >
              Save / Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
