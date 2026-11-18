import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Scissors, Plus, Star, CheckCircle, XCircle } from 'lucide-react';
import { Modal } from '../common/Modal';

export const ShopBarbers: React.FC = () => {
  const { shopProfile, barbers, addBarber, toggleBarberAvailability } = useApp();

  const activeShopId = shopProfile?.id || '';
  const shopBarbers = barbers.filter(b => b.shopId === activeShopId);

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('5');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addBarber({
      shopId: activeShopId,
      name: name.trim(),
      specialization: specialization.trim() || 'Master Stylist',
      experienceYears: parseInt(experience, 10) || 3,
      photoUrl,
      isAvailable: true,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    });

    setModalOpen(false);
    setName('');
    setSpecialization('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 mb-8 border-b border-slate-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Manage Barbers &amp; Staff
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-mono">
              TEAM ROSTER
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Maintain barber profiles, specializations, and daily chair availability.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-1.5 hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Barber</span>
        </button>
      </div>

      {shopBarbers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/90">
          <Scissors className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No barbers added yet</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Add your barbers so customers can optionally choose their preferred stylist when booking.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Barber</span>
          </button>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shopBarbers.map(barber => (
          <div
            key={barber.id}
            className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-start gap-4 mb-4">
              <img
                src={barber.photoUrl}
                alt={barber.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs"
              />
              <div>
                <h3 className="font-bold text-base text-slate-900">{barber.name}</h3>
                <p className="text-xs text-purple-700 font-semibold">{barber.specialization}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {barber.experienceYears} Years Experience
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold ${
                  barber.isAvailable ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                {barber.isAvailable ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>On Duty / Available</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Off Duty</span>
                  </>
                )}
              </span>

              <button
                onClick={() => toggleBarberAvailability(barber.id)}
                className="text-xs font-semibold px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Toggle Status
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {modalOpen && (
        <Modal isOpen={true} onClose={() => setModalOpen(false)} title="Add New Barber" maxWidth="max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Barber Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Vikram Sharma"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Specialization *
              </label>
              <input
                type="text"
                required
                value={specialization}
                onChange={e => setSpecialization(e.target.value)}
                placeholder="e.g. Skin Fade & Beard Sculpting"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Experience (Years)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={experience}
                onChange={e => setExperience(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold"
              >
                Add to Roster
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
