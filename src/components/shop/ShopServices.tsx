import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, Plus, Edit2, Trash2, Clock, CheckCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Service } from '../../types';

export const ShopServices: React.FC = () => {
  const { shopProfile, services, addService, updateService, deleteService } = useApp();

  const activeShopId = shopProfile?.id || '';
  const shopServices = services.filter(s => s.shopId === activeShopId);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form fields
  const [serviceName, setServiceName] = useState('');
  const [serviceType, setServiceType] = useState<Service['serviceType']>('Haircut');
  const [durationMinutes, setDurationMinutes] = useState('30');
  const [cost, setCost] = useState('350');
  const [description, setDescription] = useState('');

  const openAddModal = () => {
    setEditingService(null);
    setServiceName('');
    setServiceType('Haircut');
    setDurationMinutes('30');
    setCost('350');
    setDescription('');
    setModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setServiceName(service.serviceName);
    setServiceType(service.serviceType);
    setDurationMinutes(service.durationMinutes.toString());
    setCost(service.cost.toString());
    setDescription(service.description || '');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim()) return;

    if (editingService) {
      updateService(editingService.id, {
        serviceName: serviceName.trim(),
        serviceType,
        durationMinutes: parseInt(durationMinutes, 10) || 30,
        cost: parseInt(cost, 10) || 300,
        description: description.trim()
      });
    } else {
      addService({
        shopId: activeShopId,
        serviceName: serviceName.trim(),
        serviceType,
        durationMinutes: parseInt(durationMinutes, 10) || 30,
        cost: parseInt(cost, 10) || 300,
        isActive: true,
        description: description.trim()
      });
    }

    setModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header (Wireframe Image 5: "Shop Name, Add Service button") */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 mb-8 border-b border-slate-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Manage Services
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-mono">
              {shopProfile?.shopName}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure grooming offerings, service durations, and pricing displayed to clients.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-1.5 hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Services Grid (Wireframe Image 5: "Service Name, Duration, Price, Edit, Delete") */}
      {shopServices.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/90">
          <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No services configured yet</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Add your grooming services and prices so customers can discover and book them.
          </p>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Service</span>
          </button>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shopServices.map(service => (
          <div
            key={service.id}
            className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase tracking-wider">
                  {service.serviceType}
                </span>
                <span className="text-lg font-black text-slate-900 font-mono">
                  ₹{service.cost}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
                {service.serviceName}
              </h3>

              {service.description && (
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                  {service.description}
                </p>
              )}

              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Duration: {service.durationMinutes} mins</span>
              </div>
            </div>

            {/* Action Buttons (Wireframe Image 5: "Edit", "Delete") */}
            <div className="flex gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => openEditModal(service)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => deleteService(service.id)}
                className="py-2 px-3 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                title="Delete Service"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Add / Edit Service Modal */}
      {modalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setModalOpen(false)}
          title={editingService ? 'Edit Service' : 'Add New Service'}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Service Name *
              </label>
              <input
                type="text"
                required
                value={serviceName}
                onChange={e => setServiceName(e.target.value)}
                placeholder="e.g. Skin Fade & Beard Trim"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={serviceType}
                  onChange={e => setServiceType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="Haircut">Haircut</option>
                  <option value="Beard Trim">Beard Trim</option>
                  <option value="Shave">Shave</option>
                  <option value="Hair Colour">Hair Colour</option>
                  <option value="Kids Cut">Kids Cut</option>
                  <option value="Head Massage">Head Massage</option>
                  <option value="Facial">Facial</option>
                  <option value="Package">Package</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Price (₹ INR) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={cost}
                  onChange={e => setCost(e.target.value)}
                  placeholder="350"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Duration (Minutes) *
              </label>
              <input
                type="number"
                required
                min="5"
                max="240"
                value={durationMinutes}
                onChange={e => setDurationMinutes(e.target.value)}
                placeholder="30"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Short Description (Optional)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Details of the grooming package or techniques used..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20"
              >
                {editingService ? 'Save Changes' : 'Create Service'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
