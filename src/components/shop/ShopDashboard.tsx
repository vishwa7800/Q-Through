import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Clock,
  CheckCircle,
  Plus,
  AlertTriangle,
  Play,
  XCircle,
  Search,
  Store,
  Sparkles,
  Phone,
  Timer
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { AddWalkinModal } from './AddWalkinModal';
import { BroadcastDelayModal } from './BroadcastDelayModal';
import { Booking } from '../../types';

export const ShopDashboard: React.FC = () => {
  const {
    shopProfile,
    bookings,
    delays,
    updateTokenStatus,
    clearDelay
  } = useApp();

  const [walkinModalOpen, setWalkinModalOpen] = useState(false);
  const [delayModalOpen, setDelayModalOpen] = useState(false);
  const [queueSearch, setQueueSearch] = useState('');
  const [skipConfirmBooking, setSkipConfirmBooking] = useState<Booking | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const activeShopId = shopProfile?.id || '';

  // Filter today's bookings for this shop
  const todayBookings = bookings.filter(
    b => b.shopId === activeShopId && b.appointmentDate === todayStr
  );

  // Active Delay check
  const activeDelay = delays.find(d => d.shopId === activeShopId && d.delayDate === todayStr && d.isActive);

  // 4 Live KPI Counters (Wireframe Image 5: "In Queue, In Progress, Done Today, Total Today")
  const inQueueCount = todayBookings.filter(b => b.status === 'waiting').length;
  const inProgressCount = todayBookings.filter(b => b.status === 'in_progress').length;
  const doneTodayCount = todayBookings.filter(b => b.status === 'done').length;
  const totalTodayCount = todayBookings.length;

  // Ordered Active Queue list (waiting + in_progress first, sorted by tokenNumber)
  const activeQueueList = todayBookings
    .filter(b => b.status === 'waiting' || b.status === 'in_progress')
    .sort((a, b) => {
      // In progress always at top
      if (a.status === 'in_progress' && b.status !== 'in_progress') return -1;
      if (b.status === 'in_progress' && a.status !== 'in_progress') return 1;
      return a.tokenNumber - b.tokenNumber;
    })
    .filter(b =>
      b.customerName.toLowerCase().includes(queueSearch.toLowerCase()) ||
      b.tokenNumber.toString().includes(queueSearch) ||
      b.serviceName.toLowerCase().includes(queueSearch.toLowerCase())
    );

  const handleConfirmSkip = () => {
    if (skipConfirmBooking) {
      updateTokenStatus(skipConfirmBooking.id, 'cancelled');
      setSkipConfirmBooking(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 mb-8 border-b border-slate-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {shopProfile?.shopName || 'Barbershop'}
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-mono">
              LIVE QUEUE DESK
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time customer flow control, sequential token calls, and walk-in intake.
          </p>
        </div>

        {/* Action Buttons: Add Walk-in & Mark Delay (Wireframe Image 5) */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setDelayModalOpen(true)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              activeDelay
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <AlertTriangle className={`w-4 h-4 ${activeDelay ? 'text-amber-600 animate-pulse' : 'text-slate-400'}`} />
            <span>{activeDelay ? `Delay Active (+${activeDelay.delayMinutes}m)` : 'Broadcast Delay'}</span>
          </button>

          <button
            onClick={() => setWalkinModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all flex items-center gap-1.5 hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Walk-In</span>
          </button>
        </div>
      </div>

      {/* Active Delay Alert Banner if Broadcasted */}
      {activeDelay && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 animate-bounce" />
            <div>
              <p className="text-xs font-bold">
                Active Delay Broadcasted: +{activeDelay.delayMinutes} Minutes
              </p>
              <p className="text-[11px] text-amber-800">
                {activeDelay.reason || 'Customers can see this delay on their upcoming appointment cards.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => clearDelay(activeShopId)}
            className="text-xs font-bold text-amber-900 hover:text-amber-950 underline px-2 py-1"
          >
            Resolve & Clear Delay
          </button>
        </div>
      )}

      {/* 4 Stat Metric Cards (Wireframe Image 5: "In Queue, In Progress, Done Today, Total Today") */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* 1. In Queue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-3xl font-black text-amber-600 tracking-tight">
              {inQueueCount}
            </div>
            <div className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-wider">
              In Queue
            </div>
            <span className="text-[10px] text-slate-400">Waiting for turn</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* 2. In Progress */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-3xl font-black text-blue-600 tracking-tight">
              {inProgressCount}
            </div>
            <div className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-wider">
              In Progress
            </div>
            <span className="text-[10px] text-slate-400">Currently in chair</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Timer className="w-6 h-6" />
          </div>
        </div>

        {/* 3. Done Today */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-3xl font-black text-emerald-600 tracking-tight">
              {doneTodayCount}
            </div>
            <div className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-wider">
              Done Today
            </div>
            <span className="text-[10px] text-slate-400">Services finished</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* 4. Total Today */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-3xl font-black text-purple-600 tracking-tight">
              {totalTodayCount}
            </div>
            <div className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-wider">
              Total Today
            </div>
            <span className="text-[10px] text-slate-400">Max cap: {shopProfile?.dailyCapacity || 40}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Current Queue Table Section (Wireframe Image 5) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Search & Title */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Current Live Queue</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </h2>
            <p className="text-xs text-slate-400">
              Active clients currently waiting or being served today.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={queueSearch}
              onChange={e => setQueueSearch(e.target.value)}
              placeholder="Filter queue by client or token..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Table (Wireframe Image 5: "Queue No, user/client Name, Service, Actions") */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-5">Queue No</th>
                <th className="py-3.5 px-5">User / Client Name</th>
                <th className="py-3.5 px-5">Service &amp; Price</th>
                <th className="py-3.5 px-5">Time Slot</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeQueueList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600">No customers currently in the active queue.</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      New pre-booked appointments or walk-ins will appear here immediately.
                    </p>
                  </td>
                </tr>
              ) : (
                activeQueueList.map(booking => {
                  const isInProgress = booking.status === 'in_progress';

                  return (
                    <tr
                      key={booking.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isInProgress ? 'bg-blue-50/40 font-medium' : ''
                      }`}
                    >
                      {/* Queue No (Wireframe Image 5: "Queue No") */}
                      <td className="py-4 px-5">
                        <span className="font-black text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                          #{booking.tokenNumber < 10 ? `0${booking.tokenNumber}` : booking.tokenNumber}
                        </span>
                      </td>

                      {/* User/Client Name (Wireframe Image 5: "user/client Name") */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{booking.customerName}</span>
                          {booking.isWalkin && <Badge status="walkin" />}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />
                          <span>{booking.customerPhone}</span>
                        </div>
                      </td>

                      {/* Service (Wireframe Image 5: "Service") */}
                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-800">{booking.serviceName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          ₹{booking.serviceCost} • {booking.serviceDuration}m
                        </div>
                      </td>

                      {/* Time Slot */}
                      <td className="py-4 px-5">
                        <span className="text-slate-600 font-medium">{booking.timeSlot}</span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <Badge status={booking.status} />
                      </td>

                      {/* Actions Column (Wireframe Image 5: "Call Next -> In Progress, Complete -> Mark Done, Skip/Remove") */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {booking.status === 'waiting' && (
                            <button
                              onClick={() => updateTokenStatus(booking.id, 'in_progress')}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1"
                              title="Seat customer in chair"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Call Next</span>
                            </button>
                          )}

                          {booking.status === 'in_progress' && (
                            <button
                              onClick={() => updateTokenStatus(booking.id, 'done')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1"
                              title="Finish grooming service"
                            >
                              <CheckCircle className="w-3 h-3" />
                              <span>Complete</span>
                            </button>
                          )}

                          <button
                            onClick={() => setSkipConfirmBooking(booking)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Skip or Remove No-show"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Walk-In Modal (Wireframe Image 5 Popup) */}
      {walkinModalOpen && (
        <AddWalkinModal onClose={() => setWalkinModalOpen(false)} />
      )}

      {/* Broadcast Delay Modal */}
      {delayModalOpen && (
        <BroadcastDelayModal
          shopId={activeShopId}
          onClose={() => setDelayModalOpen(false)}
        />
      )}

      {/* Skip/Remove Confirmation Modal */}
      {skipConfirmBooking && (
        <Modal
          isOpen={true}
          onClose={() => setSkipConfirmBooking(null)}
          title="Remove from Queue?"
          maxWidth="max-w-md"
        >
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <XCircle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">
              Remove Token #{skipConfirmBooking.tokenNumber}?
            </h4>
            <p className="text-xs text-slate-500 mb-6">
              Are you sure you want to remove <span className="font-semibold">{skipConfirmBooking.customerName}</span> from
              the queue? Mark as no-show or customer cancellation.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setSkipConfirmBooking(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Keep in Queue
              </button>
              <button
                onClick={handleConfirmSkip}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Yes, Remove Customer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
