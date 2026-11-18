import React from 'react';
import { Scissors, ShieldCheck, Zap, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-extrabold text-xl mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <Scissors className="w-4 h-4 -rotate-45" />
              </div>
              Q-Through
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Modern appointment & real-time queue synchronization platform for barbershops and grooming lounges.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              IEEE SRS v1.0 Compliant
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              For Customers
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="hover:text-white transition-colors">Find Local Barbershops</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Real-time Queue Tracking</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Instant Token Booking</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Delay Alerts</a></li>
            </ul>
          </div>

          {/* For Shops */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              For Barbershop Owners
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Live Queue Dashboard</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Walk-In Management</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Service Catalog CRUD</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Barber Roster Scheduling</a></li>
            </ul>
          </div>

          {/* Compliance & Vercel */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Engineering Specs
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Built with Next.js, TypeScript, Tailwind CSS & Supabase. Deployed edge-optimized on Vercel.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Vercel Production Ready</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Q-Through Platform. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Safeguards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
