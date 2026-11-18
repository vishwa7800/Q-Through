export type UserRole = 'customer' | 'shop';

export type TokenStatus = 'waiting' | 'in_progress' | 'done' | 'cancelled';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isProfileComplete: boolean;
  createdAt: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Others';
  dob: string;
  age: number;
  city: string;
  state: string;
  emergencyContact?: string;
  profilePicUrl?: string;
}

export interface ShopProfile {
  id: string;
  userId: string;
  shopName: string;
  address: string;
  city: string;
  phone1: string;
  phone2?: string;
  phone3?: string;
  openingTime: string; // e.g. "09:00"
  closingTime: string; // e.g. "21:00"
  dailyCapacity: number;
  emergencyAvailable: boolean;
  logoUrl?: string;
  coverUrl?: string;
  rating: number;
  reviewCount: number;
  description: string;
  registrationNumber?: string;
}

export interface Barber {
  id: string;
  shopId: string;
  name: string;
  photoUrl: string;
  specialization: string;
  experienceYears: number;
  isAvailable: boolean;
  workingDays?: string[];
}

export interface Service {
  id: string;
  shopId: string;
  serviceName: string;
  serviceType: 'Haircut' | 'Beard Trim' | 'Shave' | 'Hair Colour' | 'Kids Cut' | 'Head Massage' | 'Facial' | 'Package';
  durationMinutes: number;
  cost: number;
  isActive: boolean;
  description?: string;
}

export interface Booking {
  id: string;
  tokenNumber: number;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shopId: string;
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  serviceId: string;
  serviceName: string;
  serviceCost: number;
  serviceDuration: number;
  barberId?: string;
  barberName?: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM"
  status: TokenStatus;
  isWalkin: boolean;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

export interface DelayNotification {
  id: string;
  shopId: string;
  delayDate: string; // YYYY-MM-DD
  delayMinutes: number;
  reason: string;
  createdAt: string;
  isActive: boolean;
}

export interface Review {
  id: string;
  bookingId: string;
  shopId: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}
