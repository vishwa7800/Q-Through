import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { User, Mail, Phone, Scissors, Plus, CheckCircle } from 'lucide-react';

interface AddWalkinModalProps {
  onClose: () => void;
}

export const AddWalkinModal: React.FC<AddWalkinModalProps> = ({ onClose }) => {
  const { shopProfile, services, barbers, addWalkinCustomer } = useApp();

  const activeShopId = shopProfile?.id || '';
  const shopServices = services.filter(s => s.shopId === activeShopId && s.isActive);
  const shopBarbers = barbers.filter(b => b.shopId === activeShopId && b.isAvailable);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceId, setServiceId] = useState(shopServices[0]?.id || '');
  const [barberId, setBarberId] = useState(shopBarbers[0]?.id || '');
  const [error, setError] = useState('');
  const [createdToken, setCreatedToken] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError("Please enter client's name.");
      return;
    }

    if (!serviceId) {
      setError('Please select a grooming service.');
      return;
    }

    const booking = await addWalkinCustomer({
      name: name.trim(),
      phone: phone.trim() || 'Walk-in Guest',
      serviceId,
      barberId: barberId || undefined
    });

    if (booking) {
      setCreatedToken(booking.tokenNumber);
      setTimeout(() => {
        onClose();
      }, 1400);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Add Walk-In Customer" maxWidth="max-w-md">
      {createdToken !== null ? (
        <div className="py-8 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3 animate-in zoom-in-50" />
          <h4 className="text-xl font-black text-slate-900">Walk-In Added to Queue!</h4>
          <p className="text-xs text-slate-500 mt-1">
            Issued Token <span className="font-bold text-slate-800">#{createdToken}</span>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <p className="text-xs text-slate-500">
            Register a walk-in client on the spot to issue the next queue token.
          </p>

          {/* User/Client's Name (Wireframe Image 5) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              User / Client's Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Sameer Joshi"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Email (Wireframe Image 5) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email (Optional)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="client@example.com (optional)"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Mobile No. (Wireframe Image 5) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mobile No. (Optional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit mobile number"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Service Required (Wireframe Image 5) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Service Required *
            </label>
            <div className="relative">
              <Scissors className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <select
                required
                value={serviceId}
                onChange={e => setServiceId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                {shopServices.map(srv => (
                  <option key={srv.id} value={srv.id}>
                    {srv.serviceName} (₹{srv.cost} • {srv.durationMinutes}m)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Add to Queue Button (Wireframe Image 5: "Add to Queue") */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Queue</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
