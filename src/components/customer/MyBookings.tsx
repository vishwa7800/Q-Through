import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  AlertTriangle,
  RotateCcw,
  XCircle,
  Star,
  Scissors,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Booking } from '../../types';

export const MyBookings: React.FC = () => {
  const {
    currentUser,
    bookings,
    delays,
    cancelBooking,
    rescheduleBooking,
    addReview,
    setCurrentView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Modals state
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<Booking | null>(null);
  const [selectedBookingForReschedule, setSelectedBookingForReschedule] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState(new Date().toISOString().split('T')[0]);
  const [rescheduleSlot, setRescheduleSlot] = useState('02:00 PM');

  // Review modal state
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // User's bookings
  const userBookings = bookings.filter(b => b.customerId === currentUser?.id);

  const upcomingBookings = userBookings.filter(
    b => b.status === 'waiting' || b.status === 'in_progress'
  );

  const pastBookings = userBookings.filter(
    b => b.status === 'done' || b.status === 'cancelled'
  );

  // Check active delay for any of customer's upcoming shops (FR-25)
  const activeUpcomingShopIds = Array.from(new Set(upcomingBookings.map(b => b.shopId)));
  const relevantDelays = delays.filter(
    d => activeUpcomingShopIds.includes(d.shopId) && d.isActive
  );

  const handleConfirmCancel = () => {
    if (selectedBookingForCancel) {
      cancelBooking(selectedBookingForCancel.id);
      setSelectedBookingForCancel(null);
    }
  };

  const handleConfirmReschedule = () => {
    if (selectedBookingForReschedule) {
      rescheduleBooking(selectedBookingForReschedule.id, rescheduleDate, rescheduleSlot);
      setSelectedBookingForReschedule(null);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking) return;

    addReview({
      bookingId: reviewBooking.id,
      shopId: reviewBooking.shopId,
      customerName: reviewBooking.customerName,
      rating: reviewRating,
      comment: reviewComment
    });

    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewBooking(null);
      setReviewSubmitted(false);
      setReviewComment('');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header & "Find New Shop" Button (Wireframe Image 4) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-200/80 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Bookings &amp; Queue Tokens
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track real-time queue progress, view tokens, and manage appointments.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('customer-dashboard')}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
        >
          <Scissors className="w-4 h-4" />
          <span>Find New Shop</span>
        </button>
      </div>

      {/* Broadcast Delay Alert Banner (SRS FR-25) */}
      {relevantDelays.length > 0 && (
        <div className="mb-6 space-y-3">
          {relevantDelays.map(delay => (
            <div
              key={delay.id}
              className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3 shadow-xs animate-in slide-in-from-top-2"
            >
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-bounce" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs uppercase tracking-wide bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-md">
                    Shop Delay Notice
                  </span>
                  <span className="font-bold text-sm text-amber-950">
                    Estimated Delay: +{delay.delayMinutes} Minutes
                  </span>
                </div>
                <p className="text-xs text-amber-800 mt-1">
                  {delay.reason
                    ? `Message from Shop: "${delay.reason}"`
                    : 'The barbershop is currently running slightly behind schedule. Thank you for your patience.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs: Upcoming vs Past (Wireframe Image 4) */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`py-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'upcoming'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Upcoming Appointments</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'upcoming' ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {upcomingBookings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`py-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'past'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Past Service History</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'past' ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {pastBookings.length}
          </span>
        </button>
      </div>

      {/* Content for Upcoming */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {upcomingBookings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No upcoming appointments</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                You have no active queue bookings right now.
              </p>
              <button
                onClick={() => setCurrentView('customer-dashboard')}
                className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
              >
                Browse Barbershops
              </button>
            </div>
          ) : (
            upcomingBookings.map(booking => (
              <div
                key={booking.id}
                className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                {/* Left: Token & Shop Details (Wireframe Image 4) */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-b from-brand-600 to-brand-800 text-white flex flex-col items-center justify-center font-black shadow-md shrink-0">
                    <span className="text-[10px] uppercase font-bold text-brand-200">Token</span>
                    <span className="text-2xl leading-none">
                      #{booking.tokenNumber < 10 ? `0${booking.tokenNumber}` : booking.tokenNumber}
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-slate-900">{booking.shopName}</h3>
                      <Badge status={booking.status} />
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{booking.shopAddress}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Scissors className="w-3.5 h-3.5 text-brand-600" />
                        <span>{booking.serviceName} (₹{booking.serviceCost})</span>
                      </span>

                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{booking.appointmentDate} at {booking.timeSlot}</span>
                      </span>

                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{booking.shopPhone}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Reschedule and Cancel buttons (Wireframe Image 4) */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedBookingForReschedule(booking);
                      setRescheduleDate(booking.appointmentDate);
                      setRescheduleSlot(booking.timeSlot);
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reschedule</span>
                  </button>

                  <button
                    onClick={() => setSelectedBookingForCancel(booking)}
                    className="px-4 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Booking</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Content for Past History */}
      {activeTab === 'past' && (
        <div className="space-y-4">
          {pastBookings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No past bookings yet</h3>
              <p className="text-xs text-slate-400 mt-1">
                Completed grooming appointments will appear here with review options.
              </p>
            </div>
          ) : (
            pastBookings.map(booking => (
              <div
                key={booking.id}
                className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                {/* Left: Past Details (Wireframe Image 4: "Shop Name, Location, Phone, Service & Time, Status: Completed") */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex flex-col items-center justify-center font-bold text-sm shrink-0">
                    #{booking.tokenNumber}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-slate-900">{booking.shopName}</h3>
                      <Badge status={booking.status} />
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{booking.shopAddress}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">
                        {booking.serviceName} (₹{booking.serviceCost})
                      </span>
                      <span>Served on {booking.appointmentDate}</span>
                      <span>Phone: {booking.shopPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Leave Review button (Wireframe Image 4: "Leave Review") */}
                {booking.status === 'done' && (
                  <button
                    onClick={() => {
                      setReviewBooking(booking);
                      setReviewRating(5);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>Leave Review</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {selectedBookingForCancel && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBookingForCancel(null)}
          title="Cancel Appointment"
          maxWidth="max-w-md"
        >
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">
              Cancel Token #{selectedBookingForCancel.tokenNumber}?
            </h4>
            <p className="text-xs text-slate-500 mb-6">
              Cancelling your booking will permanently remove you from the live queue for{' '}
              <span className="font-semibold">{selectedBookingForCancel.shopName}</span>.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedBookingForCancel(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20"
              >
                Yes, Cancel Token
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reschedule Modal */}
      {selectedBookingForReschedule && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBookingForReschedule(null)}
          title="Reschedule Appointment"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 py-2">
            <p className="text-xs text-slate-500">
              Select a new date and time slot for your appointment at{' '}
              <span className="font-bold">{selectedBookingForReschedule.shopName}</span>.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                New Date
              </label>
              <input
                type="date"
                value={rescheduleDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setRescheduleDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                New Time Slot
              </label>
              <select
                value={rescheduleSlot}
                onChange={e => setRescheduleSlot(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              >
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="05:00 PM">05:00 PM</option>
                <option value="06:30 PM">06:30 PM</option>
              </select>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setSelectedBookingForReschedule(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Close
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold"
              >
                Save New Time
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Review Modal */}
      {reviewBooking && (
        <Modal
          isOpen={true}
          onClose={() => setReviewBooking(null)}
          title="Leave a Review"
          maxWidth="max-w-md"
        >
          {reviewSubmitted ? (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2 animate-in zoom-in-50" />
              <h4 className="text-lg font-bold text-slate-900">Thank you for your review!</h4>
              <p className="text-xs text-slate-500 mt-1">Your feedback helps improve our barbershops.</p>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4 py-2">
              <p className="text-xs text-slate-500">
                Rate your experience at <span className="font-bold">{reviewBooking.shopName}</span>.
              </p>

              <div className="flex justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Comments (Optional)
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="How was the haircut, wait time, and staff behavior?"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReviewBooking(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold"
                >
                  Submit Review
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
