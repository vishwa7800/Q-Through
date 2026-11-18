import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { ShopProfile, Service, Barber } from '../../types';
import { Badge } from '../common/Badge';
import {
  Clock,
  MapPin,
  Calendar,
  CheckCircle,
  Scissors,
  User,
  Phone,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface ShopBookingModalProps {
  shop: ShopProfile;
  onClose: () => void;
}

export const ShopBookingModal: React.FC<ShopBookingModalProps> = ({ shop, onClose }) => {
  const {
    services,
    barbers,
    bookings,
    currentUser,
    customerProfile,
    createBooking,
    setCurrentView
  } = useApp();

  // Active services for this shop
  const shopServices = services.filter(s => s.shopId === shop.id && s.isActive);
  const shopBarbers = barbers.filter(b => b.shopId === shop.id && b.isAvailable);

  // Today's date string YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfterStr = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];

  // Selection state
  const [selectedService, setSelectedService] = useState<Service>(shopServices[0] || null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedSlot, setSelectedSlot] = useState<string>('11:00 AM');
  const [notes, setNotes] = useState('');

  // Autofill confirmation popup state (Wireframe Image 4 right popup)
  const [confirmPopupOpen, setConfirmPopupOpen] = useState(false);
  const [bookingSuccessToken, setBookingSuccessToken] = useState<number | null>(null);

  // Time Slots Generation (e.g. 09:30 AM to 08:30 PM)
  const timeSlots = [
    '09:30 AM',
    '10:15 AM',
    '11:00 AM',
    '11:45 AM',
    '12:30 PM',
    '02:00 PM',
    '02:45 PM',
    '03:30 PM',
    '04:15 PM',
    '05:00 PM',
    '05:45 PM',
    '06:30 PM',
    '07:15 PM'
  ];

  // Capacity / Slot status helper (FR-16, FR-17: free vs full)
  const isSlotFull = (slot: string) => {
    // Check if another confirmed customer has this exact slot on this date (Anti-double-booking FR-18)
    const existing = bookings.filter(
      b =>
        b.shopId === shop.id &&
        b.appointmentDate === selectedDate &&
        b.timeSlot === slot &&
        b.status !== 'cancelled'
    );
    // If shop's active appointments on this slot >= 2 (or 1 depending on barber count)
    return existing.length >= (shopBarbers.length > 0 ? shopBarbers.length : 1);
  };

  const handleOpenConfirmPopup = () => {
    if (!selectedService || !selectedSlot) return;
    setConfirmPopupOpen(true);
  };

  const handleFinalBooking = async () => {
    if (!selectedService) return;

    const booking = await createBooking({
      shopId: shop.id,
      serviceId: selectedService.id,
      barberId: selectedBarber?.id,
      appointmentDate: selectedDate,
      timeSlot: selectedSlot,
      notes
    });

    if (booking) {
      setBookingSuccessToken(booking.tokenNumber);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} maxWidth="max-w-3xl">
      {/* If booking succeeded, show grand confirmation screen */}
      {bookingSuccessToken !== null ? (
        <div className="py-8 px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-in zoom-in-50 duration-300">
            <CheckCircle className="w-10 h-10" />
          </div>

          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Appointment Confirmed!
          </h3>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Your appointment has been booked and your digital queue token is secured.
          </p>

          {/* Token Card */}
          <div className="max-w-sm mx-auto p-6 rounded-3xl bg-linear-to-b from-brand-600 to-brand-800 text-white shadow-xl shadow-brand-500/25 mb-6 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <p className="text-xs uppercase font-bold tracking-widest text-brand-200">
              Queue Token Number
            </p>
            <div className="text-6xl font-black tracking-tight my-2">
              #{bookingSuccessToken < 10 ? `0${bookingSuccessToken}` : bookingSuccessToken}
            </div>
            <p className="text-xs text-brand-100 font-medium">
              {shop.shopName}
            </p>
            <div className="mt-4 pt-3 border-t border-brand-500/50 flex justify-between text-xs text-brand-100">
              <span>{selectedDate}</span>
              <span>{selectedSlot}</span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                onClose();
                setCurrentView('my-bookings');
              }}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>View in My Bookings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Shop Header (Wireframe Image 4) */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 mb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">{shop.shopName}</h3>
                {shop.emergencyAvailable && <Badge status="emergency" />}
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{shop.address}, {shop.city}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                Operating: {shop.openingTime} - {shop.closingTime}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Services & Slots */}
            <div className="lg:col-span-2 space-y-6">
              {/* 1. Available Services (Wireframe Image 4) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Available Services (Service Name, Duration, Price)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {shopServices.map(srv => {
                    const isSelected = selectedService?.id === srv.id;
                    return (
                      <div
                        key={srv.id}
                        onClick={() => setSelectedService(srv)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-brand-50/70 border-brand-500 shadow-xs ring-1 ring-brand-500'
                            : 'bg-white border-slate-200/90 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-xs text-slate-900 leading-tight">
                              {srv.serviceName}
                            </span>
                            <span className="text-xs font-extrabold text-brand-600 font-mono">
                              ₹{srv.cost}
                            </span>
                          </div>
                          {srv.description && (
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                              {srv.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-2">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{srv.durationMinutes} mins</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Select Preferred Barber (Optional per FR-15) */}
              {shopBarbers.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    2. Select Barber (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedBarber(null)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        selectedBarber === null
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      Any Available Barber
                    </button>
                    {shopBarbers.map(barber => (
                      <button
                        key={barber.id}
                        type="button"
                        onClick={() => setSelectedBarber(barber)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          selectedBarber?.id === barber.id
                            ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={barber.photoUrl}
                          alt=""
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span>{barber.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Select Date & Time (Wireframe Image 4: "Select Date & Time: Date, Time free/full") */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  3. Select Date &amp; Time (Real-Time Availability)
                </label>

                {/* Date Tabs */}
                <div className="flex gap-2 mb-3">
                  {[
                    { label: 'Today', date: todayStr },
                    { label: 'Tomorrow', date: tomorrowStr },
                    { label: 'Day After', date: dayAfterStr }
                  ].map(d => (
                    <button
                      key={d.date}
                      type="button"
                      onClick={() => setSelectedDate(d.date)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        selectedDate === d.date
                          ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div>{d.label}</div>
                      <div className="text-[10px] font-normal opacity-80">{d.date}</div>
                    </button>
                  ))}
                </div>

                {/* Time Slots Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots.map(slot => {
                    const full = isSlotFull(slot);
                    const isSelected = selectedSlot === slot && !full;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={full}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center border ${
                          full
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300'
                        }`}
                      >
                        <span>{slot}</span>
                        <span
                          className={`text-[9px] font-medium mt-0.5 ${
                            full ? 'text-rose-500' : isSelected ? 'text-brand-100' : 'text-emerald-600'
                          }`}
                        >
                          {full ? 'Full' : 'Free'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Col: Booking Summary Box (Wireframe Image 4) */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-200">
                  Booking Summary
                </h4>

                <div className="space-y-3 text-xs mb-6">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Service</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {selectedService?.serviceName || 'None selected'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Barber</span>
                    <span className="font-semibold text-slate-800">
                      {selectedBarber ? selectedBarber.name : 'First Available Master Barber'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Date</span>
                      <span className="font-semibold text-slate-800">{selectedDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Slot</span>
                      <span className="font-semibold text-slate-800">{selectedSlot}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="text-slate-500 font-semibold">Total Cost:</span>
                    <span className="text-xl font-black text-slate-900 font-mono">
                      ₹{selectedService?.cost || 0}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Payment directly at barbershop upon service completion.
                  </p>
                </div>
              </div>

              {/* Confirm Booking Button (Wireframe Image 4) */}
              <button
                type="button"
                onClick={handleOpenConfirmPopup}
                className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <span>Confirm Booking</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Autofill Confirmation Popup (Wireframe Image 4 Right Popup) */}
      {confirmPopupOpen && bookingSuccessToken === null && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                (Autofill Profile Verified)
              </span>
              <h4 className="text-xl font-black text-slate-900 mt-2">Confirm Your Details</h4>
              <p className="text-xs text-slate-500 mt-1">
                Review your name & phone number for your queue ticket.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  User Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    readOnly
                    value={customerProfile?.fullName || currentUser?.email || ''}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile No.
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    readOnly
                    value={customerProfile?.phone || ''}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                <span className="font-bold text-slate-800">{selectedService?.serviceName}</span> on{' '}
                <span className="font-semibold">{selectedDate}</span> at{' '}
                <span className="font-semibold">{selectedSlot}</span>.
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmPopupOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinalBooking}
                className="flex-2 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-xs font-bold text-white shadow-md shadow-brand-500/20"
              >
                Book Now ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
