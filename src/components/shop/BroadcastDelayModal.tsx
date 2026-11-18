import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { AlertTriangle, Clock, Send, CheckCircle } from 'lucide-react';

interface BroadcastDelayModalProps {
  shopId: string;
  onClose: () => void;
}

export const BroadcastDelayModal: React.FC<BroadcastDelayModalProps> = ({ shopId, onClose }) => {
  const { broadcastDelay, clearDelay, delays } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const existingDelay = delays.find(d => d.shopId === shopId && d.delayDate === todayStr && d.isActive);

  const [minutes, setMinutes] = useState(existingDelay?.delayMinutes?.toString() || '15');
  const [reason, setReason] = useState(existingDelay?.reason || '');
  const [success, setSuccess] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    const delayMins = parseInt(minutes, 10);
    if (isNaN(delayMins) || delayMins <= 0) return;

    broadcastDelay(shopId, delayMins, reason.trim());
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    clearDelay(shopId);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Broadcast Delay Notice" maxWidth="max-w-md">
      {success ? (
        <div className="py-6 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3 animate-in zoom-in-50" />
          <h4 className="text-lg font-bold text-slate-900">Delay Broadcasted!</h4>
          <p className="text-xs text-slate-500 mt-1">
            All customers with appointments today can now see this delay on their cards.
          </p>
        </div>
      ) : (
        <form onSubmit={handleBroadcast} className="space-y-4 py-2">
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Notify all booked customers in advance so they do not arrive early to wait in the lobby.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Estimated Delay Duration (Minutes) *
            </label>
            <div className="flex gap-2">
              {['15', '20', '30', '45', '60'].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMinutes(m)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    minutes === m
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  +{m}m
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Reason Message (Optional)
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Unscheduled equipment sanitization or high walk-in influx."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex gap-2 pt-2">
            {existingDelay && (
              <button
                type="button"
                onClick={handleClear}
                className="flex-1 py-2.5 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50"
              >
                Clear Delay
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Alert</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
