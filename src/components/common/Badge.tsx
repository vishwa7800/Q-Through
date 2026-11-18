import React from 'react';
import { TokenStatus } from '../../types';

interface BadgeProps {
  status: TokenStatus | 'emergency' | 'confirmed' | 'walkin';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  switch (status) {
    case 'waiting':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 ${className}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          Waiting in Queue
        </span>
      );
    case 'in_progress':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 ${className}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-blue-500 animate-ping"></span>
          In Chair / Serving
        </span>
      );
    case 'done':
    case 'confirmed':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 ${className}`}>
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500"></span>
          Completed
        </span>
      );
    case 'cancelled':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200 ${className}`}>
          Cancelled
        </span>
      );
    case 'emergency':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-rose-600 text-white uppercase tracking-wider ${className}`}>
          ⚡ 24/7 Emergency
        </span>
      );
    case 'walkin':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200 ${className}`}>
          Walk-In
        </span>
      );
    default:
      return null;
  }
};
