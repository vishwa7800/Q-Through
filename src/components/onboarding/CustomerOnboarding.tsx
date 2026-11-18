import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Phone, MapPin, Calendar, Camera, ArrowRight, ShieldAlert } from 'lucide-react';

export const CustomerOnboarding: React.FC = () => {
  const { currentUser, saveCustomerProfile } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Others'>('Male');
  const [dob, setDob] = useState('2000-01-01');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=faces'
  );
  const [error, setError] = useState('');

  // Auto-calculate age from DOB (CON-2 / FR-7 requirement)
  const calculateAge = (birthDateString: string) => {
    if (!birthDateString) return 0;
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return Math.max(0, age);
  };

  const calculatedAge = calculateAge(dob);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }

    // 10-digit Indian phone validation (7, 8, 9 start)
    const phoneRegex = /^[789]\d{9}$/;
    if (!phoneRegex.test(phone.trim())) {
      setError('Please enter a valid 10-digit phone number starting with 7, 8, or 9.');
      return;
    }

    if (!city.trim()) {
      setError('City is required to find local barbershops.');
      return;
    }

    saveCustomerProfile({
      fullName: fullName.trim(),
      phone: phone.trim(),
      gender,
      dob,
      age: calculatedAge,
      city: city.trim(),
      state: state.trim() || 'State',
      emergencyContact: emergencyContact.trim(),
      profilePicUrl: avatarUrl
    });
  };

  // Avatar presets
  const avatarPresets = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces'
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200/80">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            Step 2: Onboarding Setup
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Complete Customer Profile
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Fill in your details to book appointments and track live queue tokens.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar / Profile Pic (Wireframe Image 2: "Profile Pic circle") */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <img
                src={avatarUrl}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-brand-500/20"
              />
              <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 mt-2 mb-2">Choose Avatar:</p>
            <div className="flex gap-2">
              {avatarPresets.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatarUrl(url)}
                  className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                    avatarUrl === url ? 'border-brand-600 scale-110 shadow-xs' : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Rahul Verma"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Email (Readonly per wireframe) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email ID <span className="text-slate-400 font-normal lowercase">(read-only)</span>
            </label>
            <input
              type="email"
              readOnly
              value={currentUser?.email || 'user@example.com'}
              className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mobile Number * (10 Digits)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Must start with 7, 8, or 9 for Indian mobile format.
            </p>
          </div>

          {/* Sex & Age Grid (Wireframe Image 2: "Sex: Male/Female/Others, Age") */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Sex *
              </label>
              <div className="flex gap-4">
                {(['Male', 'Female', 'Others'] as const).map(option => (
                  <label key={option} className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      checked={gender === option}
                      onChange={() => setGender(option)}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* DOB & Auto-calculated Age */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Date of Birth * (Age: {calculatedAge} yrs)
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="date"
                  required
                  value={dob}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={e => setDob(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Age is auto-calculated per SRS constraint.
              </p>
            </div>
          </div>

          {/* City & State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                City *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="e.g. Bengaluru"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={e => setState(e.target.value)}
                placeholder="e.g. Karnataka"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Emergency Contact Number (Optional)
            </label>
            <input
              type="tel"
              value={emergencyContact}
              onChange={e => setEmergencyContact(e.target.value)}
              placeholder="e.g. 9876543211"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <span>Complete Setup & Explore Barbershops</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
