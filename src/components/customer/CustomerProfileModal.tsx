import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Phone, MapPin, Calendar, Camera, Check, ArrowLeft } from 'lucide-react';

export const CustomerProfileModal: React.FC = () => {
  const { customerProfile, currentUser, saveCustomerProfile, setCurrentView } = useApp();

  const [fullName, setFullName] = useState(customerProfile?.fullName || '');
  const [phone, setPhone] = useState(customerProfile?.phone || '');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Others'>(customerProfile?.gender || 'Male');
  const [dob, setDob] = useState(customerProfile?.dob || '1998-05-14');
  const [city, setCity] = useState(customerProfile?.city || '');
  const [state, setState] = useState(customerProfile?.state || '');
  const [emergencyContact, setEmergencyContact] = useState(customerProfile?.emergencyContact || '');
  const [avatarUrl, setAvatarUrl] = useState(customerProfile?.profilePicUrl || '');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const calculateAge = (birthDateString: string) => {
    if (!birthDateString) return 0;
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return Math.max(0, age);
  };

  const calculatedAge = calculateAge(dob);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !phone.trim() || !city.trim()) {
      setError('Please fill in required profile fields.');
      return;
    }

    saveCustomerProfile({
      fullName: fullName.trim(),
      phone: phone.trim(),
      gender,
      dob,
      age: calculatedAge,
      city: city.trim(),
      state: state.trim(),
      emergencyContact: emergencyContact.trim(),
      profilePicUrl: avatarUrl
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => setCurrentView('customer-dashboard')}
        className="text-xs font-bold text-slate-500 hover:text-brand-600 flex items-center gap-1.5 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Barbershops</span>
      </button>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Profile</h1>
            <p className="text-xs text-slate-500 mt-1">
              View and edit your personal details used for appointments.
            </p>
          </div>
          {success && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>Saved!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <img
              src={avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-brand-500 shadow-sm"
            />
            <div>
              <p className="text-xs font-bold text-slate-800">Profile Picture</p>
              <p className="text-[11px] text-slate-400">Synced with your appointment tokens</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Email Address (read-only)
              </label>
              <input
                type="email"
                readOnly
                value={currentUser?.email || ''}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Date of Birth (Age: {calculatedAge} yrs)
              </label>
              <input
                type="date"
                required
                value={dob}
                onChange={e => setDob(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Gender
            </label>
            <div className="flex gap-4">
              {(['Male', 'Female', 'Others'] as const).map(option => (
                <label key={option} className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                  <input
                    type="radio"
                    name="profile_gender"
                    value={option}
                    checked={gender === option}
                    onChange={() => setGender(option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={e => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Emergency Contact (Optional)
            </label>
            <input
              type="tel"
              value={emergencyContact}
              onChange={e => setEmergencyContact(e.target.value)}
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
              onClick={() => setCurrentView('customer-dashboard')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
