import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Scissors,
  Clock,
  Users,
  ShieldCheck,
  Star,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Bell,
  Smartphone,
  CalendarCheck,
  Timer,
  Play,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Store,
  HelpCircle
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const LandingPage: React.FC = () => {
  const { openAuthModal, demoLogin, shops, setSelectedShopForBooking } = useApp();

  // Interactive Live Hero Preview Tab
  const [heroTab, setHeroTab] = useState<'customer' | 'shop'>('customer');
  const [simulatedTokenStatus, setSimulatedTokenStatus] = useState<'waiting' | 'in_progress'>('waiting');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do walk-in customers need to register an account or install an app?',
      a: 'No. The shop front desk has an instant "+ Add Walk-In" tool that inputs their name and service in 5 seconds. The system immediately assigns them the next sequential token in the queue alongside pre-booked clients.'
    },
    {
      q: 'How does Q-Through prevent double-booking the same barber or slot?',
      a: 'The scheduling engine calculates time slot availability in real time against the shop’s daily customer capacity and active barber team schedules. Once a slot is claimed, it is instantly marked as "Full" and disabled for other users.'
    },
    {
      q: 'What happens if a haircut takes longer than scheduled and causes a delay?',
      a: 'The shop operator has an always-visible "Broadcast Delay" action. Entering an estimated delay (e.g. +15 mins) immediately synchronizes high-visibility alert notices across all affected customers’ appointment cards so they don’t arrive early to wait.'
    },
    {
      q: 'Can customers reschedule or cancel without calling the shop?',
      a: 'Yes. Customers can view their digital ticket under "My Bookings" and either pick a new available time slot or cancel their token with one click, automatically freeing up the slot in the shop queue.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 1. HERO SECTION (Split Layout with Live Interactive Product Preview) */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200/80 bg-white">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left 7 Cols: Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Fill your chairs. <br className="hidden sm:inline" />
                <span className="text-brand-600">Eliminate the waiting room crowd.</span>
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Q-Through replaces chaotic paper clipboards and packed lobby sofas with an automated,
                dual-portal queue system. Customers take live digital tickets from their phone; barbers
                call clients to the chair with one tap.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => demoLogin('customer')}
                  className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  <span>Book an Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => openAuthModal('signup', 'shop')}
                  className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <Store className="w-4 h-4 text-slate-600" />
                  <span>Register Barbershop</span>
                </button>
              </div>

              {/* Social Proof / Metrics strip */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Zero app download required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Real-time cloud database sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>100% Free deployment</span>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Interactive Live Product Simulator */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-slate-900 p-1.5 shadow-2xl border border-slate-800 relative">
                {/* Simulator Header / Tab Switcher */}
                <div className="bg-slate-950/80 rounded-t-2xl px-4 py-3 flex items-center justify-between border-b border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[11px] font-mono text-slate-400 ml-2">live.qthrough.app</span>
                  </div>

                  {/* Switcher Tab */}
                  <div className="flex bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
                    <button
                      onClick={() => setHeroTab('customer')}
                      className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                        heroTab === 'customer'
                          ? 'bg-brand-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Customer View
                    </button>
                    <button
                      onClick={() => setHeroTab('shop')}
                      className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                        heroTab === 'shop'
                          ? 'bg-purple-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Shop Front Desk
                    </button>
                  </div>
                </div>

                {/* Simulator Body */}
                <div className="p-5 text-white min-h-[340px] flex flex-col justify-between">
                  {heroTab === 'customer' ? (
                    // Customer Ticket Simulation
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="flex justify-between items-start pb-3 border-b border-slate-800">
                        <div>
                          <p className="text-[10px] font-mono uppercase text-slate-400">Current Booking</p>
                          <h4 className="font-bold text-sm text-white">The Royal Fade &amp; Beard Lounge</h4>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-sky-400" /> Indiranagar, Bengaluru
                          </p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Active Ticket
                        </span>
                      </div>

                      {/* Digital Token Card */}
                      <div className="p-4 rounded-2xl bg-linear-to-br from-brand-900/60 to-slate-800/80 border border-brand-500/30 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-brand-300">
                            Queue Position
                          </span>
                          <div className="text-4xl font-black tracking-tight text-white mt-0.5">#04</div>
                          <p className="text-xs text-slate-300 mt-1">Rahul Verma • Signature Skin Fade</p>
                        </div>

                        <div className="text-right">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                              simulatedTokenStatus === 'waiting'
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-400/40 animate-pulse'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {simulatedTokenStatus === 'waiting' ? 'Waiting (Turn next)' : 'Currently In Chair!'}
                          </span>
                          <p className="text-[11px] text-slate-400 mt-2">Estimated wait: ~6 mins</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Want to test the live token?</span>
                        <button
                          onClick={() => demoLogin('customer')}
                          className="font-bold text-sky-400 hover:text-sky-300 underline"
                        >
                          Open Customer Dashboard ➔
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Shop Live Desk Simulation
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                        <div>
                          <p className="text-[10px] font-mono uppercase text-slate-400">Front Desk Command Center</p>
                          <h4 className="font-bold text-sm text-white">Live Queue Monitor</h4>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Shop ID: 01
                        </span>
                      </div>

                      {/* Mini Counters */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                          <div className="text-xl font-black text-amber-400">3</div>
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">In Queue</div>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                          <div className="text-xl font-black text-blue-400">1</div>
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">In Chair</div>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                          <div className="text-xl font-black text-emerald-400">14</div>
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">Finished</div>
                        </div>
                      </div>

                      {/* Active queue table row */}
                      <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono font-bold text-slate-300 bg-slate-700 px-1.5 py-0.5 rounded text-[11px] mr-2">
                            #04
                          </span>
                          <span className="font-bold text-white">Rahul V.</span>
                          <span className="text-[11px] text-slate-400 ml-2">Fade &amp; Beard</span>
                        </div>

                        <button
                          onClick={() =>
                            setSimulatedTokenStatus(prev => (prev === 'waiting' ? 'in_progress' : 'waiting'))
                          }
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{simulatedTokenStatus === 'waiting' ? 'Call to Chair' : 'Mark Done'}</span>
                        </button>
                      </div>

                      <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-between text-xs">
                        <span className="text-slate-300">Test queue transitions live</span>
                        <button
                          onClick={() => demoLogin('shop')}
                          className="font-bold text-purple-300 hover:text-white underline"
                        >
                          Open Shop Desk ➔
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-800 text-center text-[10px] text-slate-500 font-mono">
                    Zero-cost Standard REST Polling (IEEE SRS v1.0 COM-3)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM SOLVED: BEFORE vs. AFTER */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">
              The Reality of Barbershop Operations
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Why traditional walk-in management fails
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              Unpredictable haircut durations create bottleneck lobbies that frustrate customers and exhaust barbers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* The Old Way */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-rose-200/80 shadow-xs relative">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                The Traditional Barbershop
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-4 mb-3">Crowded Benches &amp; Lost Revenue</h4>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span><strong>Lost Walk-Ins:</strong> Potential customers walk in, see 6 people on the waiting sofa, and leave immediately.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span><strong>Zero Schedule Visibility:</strong> Customers have no way to know whether the wait is 10 minutes or 50 minutes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span><strong>Awkward Queue Disputes:</strong> Frequent arguments over "who arrived first" when both walk-ins and phone calls overlap.</span>
                </li>
              </ul>
            </div>

            {/* The Q-Through Way */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-200/80 shadow-xs relative">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                With Q-Through
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-4 mb-3">Predictable Flow &amp; Digital Transparency</h4>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Remote Token Holding:</strong> Clients claim a sequential ticket from their browser and arrive right when their chair opens.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Seamless Walk-In Integration:</strong> Front desk registers unscheduled walk-ins in 5 seconds to preserve fair queue order.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Instant Broadcast Alerts:</strong> If a complex fade runs 15 minutes long, 1 tap sends an alert to all upcoming appointments.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (3 Step Clear Flow) */}
      <section id="features" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">
              Core Workflow
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How Q-Through Works in 3 Steps
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              Designed for extreme simplicity on busy weekends for both clients and barbers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left relative">
              <span className="text-2xl font-black text-brand-600 font-mono">01</span>
              <h4 className="text-base font-bold text-slate-900 mt-2 mb-1.5">Pick Service &amp; Slot</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Customers search nearby shops, view real prices for haircuts, beard sculpting, or shaves,
                and choose a time slot backed by shop capacity limits.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left relative">
              <span className="text-2xl font-black text-brand-600 font-mono">02</span>
              <h4 className="text-base font-bold text-slate-900 mt-2 mb-1.5">Receive Sequential Token</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                The platform issues an atomic digital queue ticket (e.g. #04) that updates live from "Waiting"
                to "In Chair" as previous clients finish their grooming.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left relative">
              <span className="text-2xl font-black text-brand-600 font-mono">03</span>
              <h4 className="text-base font-bold text-slate-900 mt-2 mb-1.5">Single-Tap Barbershop Desk</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Barbers tap "Call Next" when their chair is ready, mark services as "Complete", and broadcast
                delay notices if lunch rushes run slightly over.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COLLABORATED BARBERSHOPS (Real Partner Showcase) */}
      <section id="collaborations" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-1.5">
                Collaborated Studios
              </h2>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Live Partner Barbershops
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Explore real barbershop profiles currently active on the platform.
              </p>
            </div>
            <button
              onClick={() => demoLogin('customer')}
              className="mt-4 sm:mt-0 text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>Explore All Shops</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shops.map(shop => (
              <div
                key={shop.id}
                className="group rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Shop Cover */}
                  <div className="relative h-44 w-full bg-slate-200 overflow-hidden">
                    <img
                      src={shop.coverUrl || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800'}
                      alt={shop.shopName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent"></div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-2.5">
                      <img
                        src={shop.logoUrl}
                        alt=""
                        className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow bg-white"
                      />
                      <div>
                        <h4 className="text-white font-bold text-sm leading-tight drop-shadow-xs">
                          {shop.shopName}
                        </h4>
                        <p className="text-[11px] text-slate-200 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-sky-400" />
                          {shop.city}
                        </p>
                      </div>
                    </div>

                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-white/95 text-xs font-bold text-slate-900 flex items-center gap-1 shadow-xs">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{shop.rating}</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                      {shop.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-600">
                      {shop.emergencyAvailable && <Badge status="emergency" />}
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                        Hours: {shop.openingTime} - {shop.closingTime}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-medium">
                        Cap: {shop.dailyCapacity} / day
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => {
                      demoLogin('customer');
                      setSelectedShopForBooking(shop);
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View &amp; Book Token</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. REAL TESTIMONIALS */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">
              Operator Feedback
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Real results from real barbershops
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-left">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-700 italic leading-relaxed mb-4">
                "On Saturdays, guys used to open our front door, see 6 people on the waiting sofa, and immediately turn around. With Q-Through, they take a ticket on their phone, grab coffee nearby, and walk straight into the chair when their token is called."
              </p>
              <div>
                <p className="font-bold text-xs text-slate-900">Arun K.</p>
                <p className="text-[11px] text-slate-400">Head Stylist &amp; Owner, Indiranagar Fade Co.</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-left">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-700 italic leading-relaxed mb-4">
                "Adding walk-ins takes literally 5 seconds from the dashboard. It treats pre-booked appointments and walk-in clients with 100% fair sequential numbering. It completely ended arguments over who was next in line."
              </p>
              <div>
                <p className="font-bold text-xs text-slate-900">Vikram Sharma</p>
                <p className="text-[11px] text-slate-400">Master Barber, The Royal Fade Lounge</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRACTICAL FAQ SECTION */}
      <section id="about" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">
              Common Questions
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white border border-slate-200 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex justify-between items-center gap-4 text-xs sm:text-sm font-bold text-slate-900 hover:text-brand-600"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-xs text-slate-500 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM ACTION BANNER */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to streamline your barbershop appointments?
          </h3>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Experience the dual-portal queue platform designed to eliminate waiting room chaos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => demoLogin('customer')}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Test Customer Booking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => demoLogin('shop')}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Store className="w-4 h-4" />
              <span>Test Shop Front Desk</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
