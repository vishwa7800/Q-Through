import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import {
  User,
  UserRole,
  CustomerProfile,
  ShopProfile,
  Barber,
  Service,
  Booking,
  TokenStatus,
  DelayNotification,
  Review
} from '../types';
import {
  INITIAL_SHOPS,
  INITIAL_SERVICES,
  INITIAL_BARBERS,
  INITIAL_BOOKINGS,
  DEMO_CUSTOMER_PROFILE
} from '../data/mockData';

export type AppView =
  | 'landing'
  | 'customer-onboarding'
  | 'customer-dashboard'
  | 'my-bookings'
  | 'customer-profile'
  | 'shop-onboarding'
  | 'shop-dashboard'
  | 'shop-services'
  | 'shop-barbers'
  | 'shop-profile';

interface StoredAccount {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isProfileComplete: boolean;
  createdAt: string;
}

// Hash password using Web Crypto SHA-256 (never store plain-text passwords)
async function hashPassword(password: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback for non-secure contexts
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      hash = (hash << 5) - hash + password.charCodeAt(i);
      hash |= 0;
    }
    return `fallback_${Math.abs(hash).toString(16)}`;
  }
}

// Merge cloud rows with local/seed rows by ID (cloud rows override duplicates)
function mergeById<T extends { id: string }>(existing: T[], incoming: T[]): T[] {
  const map = new Map<string, T>();
  existing.forEach(item => map.set(item.id, item));
  incoming.forEach(item => map.set(item.id, item));
  return Array.from(map.values());
}

interface AppContextType {
  currentUser: User | null;
  customerProfile: CustomerProfile | null;
  shopProfile: ShopProfile | null;
  currentRole: UserRole | null;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // Auth Modal State
  authModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  authModalRole: UserRole;
  openAuthModal: (mode?: 'login' | 'signup', role?: UserRole) => void;
  closeAuthModal: () => void;

  // Auth Functions
  login: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  demoLogin: (role: UserRole) => void;

  // Profile Management
  saveCustomerProfile: (profile: Partial<CustomerProfile>) => Promise<CustomerProfile | null>;
  saveShopProfile: (
    profile: Partial<ShopProfile>,
    initialServices?: Array<{
      serviceName: string;
      serviceType: Service['serviceType'];
      durationMinutes: number;
      cost: number;
    }>
  ) => Promise<ShopProfile | null>;

  // Data
  shops: ShopProfile[];
  services: Service[];
  barbers: Barber[];
  bookings: Booking[];
  delays: DelayNotification[];
  reviews: Review[];

  // Customer Operations
  selectedShopForBooking: ShopProfile | null;
  setSelectedShopForBooking: (shop: ShopProfile | null) => void;
  createBooking: (data: {
    shopId: string;
    serviceId: string;
    barberId?: string;
    appointmentDate: string;
    timeSlot: string;
    notes?: string;
  }) => Promise<Booking | null>;
  cancelBooking: (bookingId: string) => Promise<void>;
  rescheduleBooking: (bookingId: string, newDate: string, newSlot: string) => Promise<void>;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;

  // Shop Operations
  updateTokenStatus: (bookingId: string, status: TokenStatus) => Promise<void>;
  addWalkinCustomer: (data: {
    name: string;
    phone: string;
    serviceId: string;
    barberId?: string;
  }) => Promise<Booking | null>;
  broadcastDelay: (shopId: string, minutes: number, reason: string) => Promise<void>;
  clearDelay: (shopId: string) => Promise<void>;

  // Services & Barbers CRUD
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  addBarber: (barber: Omit<Barber, 'id'>) => Promise<void>;
  toggleBarberAvailability: (barberId: string) => Promise<void>;

  // REST Sync indicator
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence Helpers
  const getStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`qthrough_v2_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const setStored = <T,>(key: string, value: T) => {
    try {
      localStorage.setItem(`qthrough_v2_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error', e);
    }
  };

  // Registered user accounts & profiles cache
  const [registeredUsers, setRegisteredUsers] = useState<StoredAccount[]>(() => getStored('registeredUsers', []));
  const [customerProfiles, setCustomerProfiles] = useState<CustomerProfile[]>(() =>
    getStored('customerProfiles', [DEMO_CUSTOMER_PROFILE])
  );

  // Active session state
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStored('currentUser', null));
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(() => getStored('customerProfile', null));
  const [shopProfile, setShopProfile] = useState<ShopProfile | null>(() => getStored('shopProfile', null));
  const [currentRole, setCurrentRole] = useState<UserRole | null>(() => getStored('currentRole', null));
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const user = getStored<User | null>('currentUser', null);
    if (!user) return 'landing';
    if (!user.isProfileComplete) {
      return user.role === 'customer' ? 'customer-onboarding' : 'shop-onboarding';
    }
    return user.role === 'customer' ? 'customer-dashboard' : 'shop-dashboard';
  });

  // Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [authModalRole, setAuthModalRole] = useState<UserRole>('customer');
  const [selectedShopForBooking, setSelectedShopForBooking] = useState<ShopProfile | null>(null);

  // Entities
  const [shops, setShops] = useState<ShopProfile[]>(() => getStored('shops', INITIAL_SHOPS));
  const [services, setServices] = useState<Service[]>(() => getStored('services', INITIAL_SERVICES));
  const [barbers, setBarbers] = useState<Barber[]>(() => getStored('barbers', INITIAL_BARBERS));
  const [bookings, setBookings] = useState<Booking[]>(() => getStored('bookings', INITIAL_BOOKINGS));
  const [delays, setDelays] = useState<DelayNotification[]>(() => getStored('delays', []));
  const [reviews, setReviews] = useState<Review[]>(() => getStored('reviews', []));

  // REST Polling state
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Sync state to LocalStorage
  useEffect(() => setStored('registeredUsers', registeredUsers), [registeredUsers]);
  useEffect(() => setStored('customerProfiles', customerProfiles), [customerProfiles]);
  useEffect(() => setStored('currentUser', currentUser), [currentUser]);
  useEffect(() => setStored('customerProfile', customerProfile), [customerProfile]);
  useEffect(() => setStored('shopProfile', shopProfile), [shopProfile]);
  useEffect(() => setStored('currentRole', currentRole), [currentRole]);
  useEffect(() => setStored('shops', shops), [shops]);
  useEffect(() => setStored('services', services), [services]);
  useEffect(() => setStored('barbers', barbers), [barbers]);
  useEffect(() => setStored('bookings', bookings), [bookings]);
  useEffect(() => setStored('delays', delays), [delays]);
  useEffect(() => setStored('reviews', reviews), [reviews]);

  // =========================================================================
  // STANDARD HTTP REST POLLING (HTTP GET) - 100% Free, Zero WebSockets Needed
  // Syncs Shops, Services, Barbers, Bookings, Delays & Reviews across accounts
  // =========================================================================
  const fetchCloudDataViaRest = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      setIsSyncing(true);

      const [shopsRes, servicesRes, barbersRes, bookingsRes, delaysRes, reviewsRes] = await Promise.all([
        supabase.from('shops').select('*').order('created_at', { ascending: false }),
        supabase.from('services').select('*').order('created_at', { ascending: true }),
        supabase.from('barbers').select('*').order('created_at', { ascending: true }),
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('delay_notifications').select('*').eq('is_active', true),
        supabase.from('reviews').select('*').order('created_at', { ascending: false })
      ]);

      // 1. Shops
      if (!shopsRes.error && shopsRes.data && shopsRes.data.length > 0) {
        const mappedShops: ShopProfile[] = shopsRes.data.map((s: any) => ({
          id: s.id,
          userId: s.user_id,
          shopName: s.shop_name,
          address: s.address,
          city: s.city,
          phone1: s.phone_1,
          phone2: s.phone_2 || '',
          phone3: s.phone_3 || '',
          openingTime: s.opening_time || '09:00',
          closingTime: s.closing_time || '21:00',
          dailyCapacity: Number(s.daily_capacity) || 40,
          emergencyAvailable: Boolean(s.emergency_available),
          logoUrl: s.logo_url || INITIAL_SHOPS[0].logoUrl,
          coverUrl: s.cover_url || INITIAL_SHOPS[0].coverUrl,
          rating: Number(s.rating) || 5.0,
          reviewCount: Number(s.review_count) || 0,
          description: s.description || 'Quality grooming and modern hair styling.',
          registrationNumber: s.registration_number || ''
        }));
        setShops(prev => mergeById(prev, mappedShops));
      }

      // 2. Services
      if (!servicesRes.error && servicesRes.data && servicesRes.data.length > 0) {
        const mappedServices: Service[] = servicesRes.data.map((s: any) => ({
          id: s.id,
          shopId: s.shop_id,
          serviceName: s.service_name,
          serviceType: s.service_type as Service['serviceType'],
          durationMinutes: Number(s.duration_minutes) || 30,
          cost: Number(s.cost) || 300,
          isActive: s.is_active !== false,
          description: s.description || ''
        }));
        setServices(prev => mergeById(prev, mappedServices));
      }

      // 3. Barbers
      if (!barbersRes.error && barbersRes.data && barbersRes.data.length > 0) {
        const mappedBarbers: Barber[] = barbersRes.data.map((b: any) => ({
          id: b.id,
          shopId: b.shop_id,
          name: b.name,
          photoUrl: b.photo_url || INITIAL_BARBERS[0].photoUrl,
          specialization: b.specialization || 'Stylist',
          experienceYears: Number(b.experience_years) || 3,
          isAvailable: b.is_available !== false,
          workingDays: b.working_days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        }));
        setBarbers(prev => mergeById(prev, mappedBarbers));
      }

      // 4. Bookings
      if (!bookingsRes.error && bookingsRes.data && bookingsRes.data.length > 0) {
        const mappedBookings: Booking[] = bookingsRes.data.map((b: any) => ({
          id: b.id,
          tokenNumber: Number(b.token_number),
          customerId: b.customer_id,
          customerName: b.customer_name,
          customerPhone: b.customer_phone,
          customerEmail: b.customer_email,
          shopId: b.shop_id,
          shopName: b.shop_name,
          shopAddress: b.shop_address || '',
          shopPhone: b.shop_phone || '',
          serviceId: b.service_id,
          serviceName: b.service_name,
          serviceCost: Number(b.service_cost),
          serviceDuration: Number(b.service_duration) || 30,
          barberId: b.barber_id || undefined,
          barberName: b.barber_name || undefined,
          appointmentDate: b.appointment_date,
          timeSlot: b.time_slot,
          status: b.status as TokenStatus,
          isWalkin: Boolean(b.is_walkin),
          createdAt: b.created_at,
          notes: b.notes
        }));
        setBookings(prev => mergeById(prev, mappedBookings));
      }

      // 5. Delays
      if (!delaysRes.error && delaysRes.data && delaysRes.data.length > 0) {
        const mappedDelays: DelayNotification[] = delaysRes.data.map((d: any) => ({
          id: d.id,
          shopId: d.shop_id,
          delayDate: d.delay_date,
          delayMinutes: Number(d.delay_minutes),
          reason: d.reason || '',
          createdAt: d.created_at,
          isActive: Boolean(d.is_active)
        }));
        setDelays(prev => mergeById(prev, mappedDelays));
      }

      // 6. Reviews
      if (!reviewsRes.error && reviewsRes.data && reviewsRes.data.length > 0) {
        const mappedReviews: Review[] = reviewsRes.data.map((r: any) => ({
          id: r.id,
          bookingId: r.booking_id,
          shopId: r.shop_id,
          customerName: r.customer_name,
          rating: Number(r.rating),
          comment: r.comment || '',
          createdAt: r.created_at
        }));
        setReviews(prev => mergeById(prev, mappedReviews));
      }

      setLastSyncedAt(new Date());
    } catch {
      // Graceful offline fallback
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Run initial fetch and recurring 8-second HTTP REST polling
  useEffect(() => {
    fetchCloudDataViaRest();
    const interval = setInterval(() => {
      fetchCloudDataViaRest();
    }, 8000);
    return () => clearInterval(interval);
  }, [fetchCloudDataViaRest]);

  // Auth Modal Controls
  const openAuthModal = (mode: 'login' | 'signup' = 'login', role: UserRole = 'customer') => {
    setAuthModalMode(mode);
    setAuthModalRole(role);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => setAuthModalOpen(false);

  // =========================================================================
  // REAL AUTHENTICATION (Sign Up & Login with Role Verification & Isolation)
  // =========================================================================
  const signup = async (
    email: string,
    password: string,
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await hashPassword(password);

    // Check if email already exists in cloud DB
    if (isSupabaseConfigured) {
      try {
        const { data: existingCloud } = await supabase
          .from('app_users')
          .select('id, role')
          .eq('email', normalizedEmail)
          .maybeSingle();

        if (existingCloud) {
          return {
            success: false,
            error: 'An account with this email already exists. Please login instead.'
          };
        }
      } catch {
        // fallback to local check
      }
    }

    // Check local registry
    if (registeredUsers.some(u => u.email === normalizedEmail)) {
      return {
        success: false,
        error: 'An account with this email already exists. Please login instead.'
      };
    }

    const newUserId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const createdAt = new Date().toISOString();

    const newAccount: StoredAccount = {
      id: newUserId,
      email: normalizedEmail,
      passwordHash,
      role,
      isProfileComplete: false,
      createdAt
    };

    // Persist in Supabase app_users
    if (isSupabaseConfigured) {
      try {
        await supabase.from('app_users').insert({
          id: newAccount.id,
          email: newAccount.email,
          password_hash: newAccount.passwordHash,
          role: newAccount.role,
          is_profile_complete: false
        });
      } catch {
        // fallback to local storage
      }
    }

    setRegisteredUsers(prev => [...prev, newAccount]);

    // Clean session state — NEVER inherit previous or demo profiles
    setCustomerProfile(null);
    setShopProfile(null);
    setSelectedShopForBooking(null);

    const user: User = {
      id: newAccount.id,
      email: newAccount.email,
      role,
      isProfileComplete: false,
      createdAt
    };

    setCurrentUser(user);
    setCurrentRole(role);
    setAuthModalOpen(false);
    setCurrentView(role === 'customer' ? 'customer-onboarding' : 'shop-onboarding');

    return { success: true };
  };

  const login = async (
    email: string,
    password: string,
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await hashPassword(password);

    let matchedAccount: StoredAccount | null = null;

    // 1. Check Supabase app_users first (enables logging in across different browsers/devices)
    if (isSupabaseConfigured) {
      try {
        const { data: cloudUser } = await supabase
          .from('app_users')
          .select('*')
          .eq('email', normalizedEmail)
          .maybeSingle();

        if (cloudUser) {
          matchedAccount = {
            id: cloudUser.id,
            email: cloudUser.email,
            passwordHash: cloudUser.password_hash,
            role: cloudUser.role as UserRole,
            isProfileComplete: Boolean(cloudUser.is_profile_complete),
            createdAt: cloudUser.created_at
          };
        }
      } catch {
        // fallback to local registry
      }
    }

    // 2. Fallback to local registeredUsers
    if (!matchedAccount) {
      matchedAccount = registeredUsers.find(u => u.email === normalizedEmail) || null;
    }

    if (!matchedAccount) {
      return {
        success: false,
        error: 'No account found with this email. Please Sign Up to create an account.'
      };
    }

    if (matchedAccount.role !== role) {
      return {
        success: false,
        error: `This email is registered as a ${
          matchedAccount.role === 'customer' ? 'Customer' : 'Barbershop'
        }. Please switch the role tab above to login.`
      };
    }

    if (matchedAccount.passwordHash !== passwordHash) {
      return {
        success: false,
        error: 'Incorrect password. Please try again.'
      };
    }

    // Clear previous session profiles before loading THIS user's real profile
    setCustomerProfile(null);
    setShopProfile(null);
    setSelectedShopForBooking(null);

    if (role === 'customer') {
      let foundProfile: CustomerProfile | null =
        customerProfiles.find(p => p.userId === matchedAccount!.id) || null;

      if (!foundProfile && isSupabaseConfigured) {
        try {
          const { data: cloudProf } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', matchedAccount.id)
            .maybeSingle();

          if (cloudProf) {
            foundProfile = {
              id: cloudProf.id,
              userId: cloudProf.user_id,
              fullName: cloudProf.full_name,
              phone: cloudProf.phone,
              gender: cloudProf.gender,
              dob: cloudProf.dob,
              age: Number(cloudProf.age),
              city: cloudProf.city,
              state: cloudProf.state || '',
              emergencyContact: cloudProf.emergency_contact || '',
              profilePicUrl: cloudProf.profile_pic_url || DEMO_CUSTOMER_PROFILE.profilePicUrl
            };
          }
        } catch {}
      }

      const user: User = {
        id: matchedAccount.id,
        email: matchedAccount.email,
        role: 'customer',
        isProfileComplete: Boolean(foundProfile),
        createdAt: matchedAccount.createdAt
      };

      setCurrentUser(user);
      setCurrentRole('customer');
      setAuthModalOpen(false);

      if (foundProfile) {
        setCustomerProfile(foundProfile);
        setCurrentView('customer-dashboard');
      } else {
        setCurrentView('customer-onboarding');
      }
    } else {
      let foundShop: ShopProfile | null = shops.find(s => s.userId === matchedAccount!.id) || null;

      if (!foundShop && isSupabaseConfigured) {
        try {
          const { data: cloudShop } = await supabase
            .from('shops')
            .select('*')
            .eq('user_id', matchedAccount.id)
            .maybeSingle();

          if (cloudShop) {
            foundShop = {
              id: cloudShop.id,
              userId: cloudShop.user_id,
              shopName: cloudShop.shop_name,
              address: cloudShop.address,
              city: cloudShop.city,
              phone1: cloudShop.phone_1,
              phone2: cloudShop.phone_2 || '',
              phone3: cloudShop.phone_3 || '',
              openingTime: cloudShop.opening_time || '09:00',
              closingTime: cloudShop.closing_time || '21:00',
              dailyCapacity: Number(cloudShop.daily_capacity) || 40,
              emergencyAvailable: Boolean(cloudShop.emergency_available),
              logoUrl: cloudShop.logo_url || INITIAL_SHOPS[0].logoUrl,
              coverUrl: cloudShop.cover_url || INITIAL_SHOPS[0].coverUrl,
              rating: Number(cloudShop.rating) || 5.0,
              reviewCount: Number(cloudShop.review_count) || 0,
              description: cloudShop.description || 'Quality grooming and modern hair styling.',
              registrationNumber: cloudShop.registration_number || ''
            };
            setShops(prev => mergeById(prev, [foundShop!]));
          }
        } catch {}
      }

      const user: User = {
        id: matchedAccount.id,
        email: matchedAccount.email,
        role: 'shop',
        isProfileComplete: Boolean(foundShop),
        createdAt: matchedAccount.createdAt
      };

      setCurrentUser(user);
      setCurrentRole('shop');
      setAuthModalOpen(false);

      if (foundShop) {
        setShopProfile(foundShop);
        setCurrentView('shop-dashboard');
      } else {
        setCurrentView('shop-onboarding');
      }
    }

    fetchCloudDataViaRest();
    return { success: true };
  };

  // Demo Preview Login (available ONLY from Landing Page / Auth Modal)
  const demoLogin = (role: UserRole) => {
    setSelectedShopForBooking(null);
    if (role === 'customer') {
      const user: User = {
        id: 'cust-user-demo',
        email: 'rahul.verma@example.com',
        role: 'customer',
        isProfileComplete: true,
        createdAt: new Date().toISOString()
      };
      setCurrentUser(user);
      setCurrentRole('customer');
      setShopProfile(null);
      setCustomerProfile(DEMO_CUSTOMER_PROFILE);
      setCurrentView('customer-dashboard');
    } else {
      const user: User = {
        id: 'shop-user-1',
        email: 'royal.fade@barbers.com',
        role: 'shop',
        isProfileComplete: true,
        createdAt: new Date().toISOString()
      };
      const demoShop = shops.find(s => s.id === 'shop-1') || INITIAL_SHOPS[0];
      setCurrentUser(user);
      setCurrentRole('shop');
      setCustomerProfile(null);
      setShopProfile(demoShop);
      setCurrentView('shop-dashboard');
    }
    setAuthModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
    setCustomerProfile(null);
    setShopProfile(null);
    setSelectedShopForBooking(null);
    setCurrentView('landing');
  };

  // =========================================================================
  // PROFILE SETUP & UPDATES
  // =========================================================================
  const saveCustomerProfile = async (
    profileData: Partial<CustomerProfile>
  ): Promise<CustomerProfile | null> => {
    if (!currentUser) return null;

    // Only reuse existing profile ID if it actually belongs to currentUser
    const existingOwnProfile =
      customerProfile && customerProfile.userId === currentUser.id ? customerProfile : null;

    const newProfile: CustomerProfile = {
      id: existingOwnProfile?.id || `cust-${currentUser.id}`,
      userId: currentUser.id,
      fullName: profileData.fullName || existingOwnProfile?.fullName || 'Customer',
      phone: profileData.phone || existingOwnProfile?.phone || '',
      gender: profileData.gender || existingOwnProfile?.gender || 'Male',
      dob: profileData.dob || existingOwnProfile?.dob || '2000-01-01',
      age: profileData.age ?? existingOwnProfile?.age ?? 25,
      city: profileData.city || existingOwnProfile?.city || '',
      state: profileData.state ?? existingOwnProfile?.state ?? '',
      emergencyContact: profileData.emergencyContact ?? existingOwnProfile?.emergencyContact ?? '',
      profilePicUrl:
        profileData.profilePicUrl || existingOwnProfile?.profilePicUrl || DEMO_CUSTOMER_PROFILE.profilePicUrl
    };

    setCustomerProfile(newProfile);
    setCustomerProfiles(prev => mergeById(prev, [newProfile]));
    setCurrentUser({ ...currentUser, isProfileComplete: true });
    setRegisteredUsers(prev =>
      prev.map(u => (u.id === currentUser.id ? { ...u, isProfileComplete: true } : u))
    );
    setCurrentView('customer-dashboard');

    if (isSupabaseConfigured) {
      try {
        await Promise.all([
          supabase.from('profiles').upsert({
            id: newProfile.id,
            user_id: newProfile.userId,
            full_name: newProfile.fullName,
            phone: newProfile.phone,
            gender: newProfile.gender,
            dob: newProfile.dob,
            age: newProfile.age,
            city: newProfile.city,
            state: newProfile.state,
            emergency_contact: newProfile.emergencyContact,
            profile_pic_url: newProfile.profilePicUrl
          }),
          supabase.from('app_users').update({ is_profile_complete: true }).eq('id', currentUser.id)
        ]);
      } catch {}
    }

    return newProfile;
  };

  const saveShopProfile = async (
    profileData: Partial<ShopProfile>,
    initialServices?: Array<{
      serviceName: string;
      serviceType: Service['serviceType'];
      durationMinutes: number;
      cost: number;
    }>
  ): Promise<ShopProfile | null> => {
    if (!currentUser) return null;

    // CRITICAL: Only reuse existing shop ID if it actually belongs to currentUser!
    const existingOwnShop = shopProfile && shopProfile.userId === currentUser.id ? shopProfile : null;
    const shopId = existingOwnShop?.id || `shop-${currentUser.id}`;

    const newProfile: ShopProfile = {
      id: shopId,
      userId: currentUser.id,
      shopName: profileData.shopName || existingOwnShop?.shopName || 'My Barbershop',
      address: profileData.address || existingOwnShop?.address || '',
      city: profileData.city || existingOwnShop?.city || '',
      phone1: profileData.phone1 || existingOwnShop?.phone1 || '',
      phone2: profileData.phone2 ?? existingOwnShop?.phone2 ?? '',
      phone3: profileData.phone3 ?? existingOwnShop?.phone3 ?? '',
      openingTime: profileData.openingTime || existingOwnShop?.openingTime || '09:00',
      closingTime: profileData.closingTime || existingOwnShop?.closingTime || '21:00',
      dailyCapacity: profileData.dailyCapacity ?? existingOwnShop?.dailyCapacity ?? 40,
      emergencyAvailable: profileData.emergencyAvailable ?? existingOwnShop?.emergencyAvailable ?? false,
      logoUrl: profileData.logoUrl || existingOwnShop?.logoUrl || INITIAL_SHOPS[0].logoUrl,
      coverUrl: profileData.coverUrl || existingOwnShop?.coverUrl || INITIAL_SHOPS[0].coverUrl,
      rating: existingOwnShop?.rating ?? 5.0,
      reviewCount: existingOwnShop?.reviewCount ?? 0,
      description:
        profileData.description ??
        existingOwnShop?.description ??
        `${profileData.shopName || 'Our barbershop'} offers professional haircuts and grooming services.`,
      registrationNumber: profileData.registrationNumber ?? existingOwnShop?.registrationNumber ?? ''
    };

    setShopProfile(newProfile);
    setShops(prev => {
      const idx = prev.findIndex(s => s.id === newProfile.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newProfile;
        return copy;
      }
      return [newProfile, ...prev];
    });

    setCurrentUser({ ...currentUser, isProfileComplete: true });
    setRegisteredUsers(prev =>
      prev.map(u => (u.id === currentUser.id ? { ...u, isProfileComplete: true } : u))
    );

    // Save initial services tied specifically to THIS new shop's real ID
    const createdServices: Service[] = [];
    if (initialServices && initialServices.length > 0) {
      initialServices.forEach((s, idx) => {
        createdServices.push({
          id: `srv-${shopId}-${Date.now()}-${idx}`,
          shopId: newProfile.id,
          serviceName: s.serviceName,
          serviceType: s.serviceType,
          durationMinutes: s.durationMinutes,
          cost: s.cost,
          isActive: true,
          description: ''
        });
      });
      setServices(prev => [...prev, ...createdServices]);
    }

    setCurrentView('shop-dashboard');

    if (isSupabaseConfigured) {
      try {
        await supabase.from('shops').upsert({
          id: newProfile.id,
          user_id: newProfile.userId,
          shop_name: newProfile.shopName,
          address: newProfile.address,
          city: newProfile.city,
          phone_1: newProfile.phone1,
          phone_2: newProfile.phone2,
          phone_3: newProfile.phone3,
          opening_time: newProfile.openingTime,
          closing_time: newProfile.closingTime,
          daily_capacity: newProfile.dailyCapacity,
          emergency_available: newProfile.emergencyAvailable,
          logo_url: newProfile.logoUrl,
          cover_url: newProfile.coverUrl,
          rating: newProfile.rating,
          review_count: newProfile.reviewCount,
          description: newProfile.description,
          registration_number: newProfile.registrationNumber
        });

        await supabase.from('app_users').update({ is_profile_complete: true }).eq('id', currentUser.id);

        if (createdServices.length > 0) {
          await supabase.from('services').insert(
            createdServices.map(srv => ({
              id: srv.id,
              shop_id: srv.shopId,
              service_name: srv.serviceName,
              service_type: srv.serviceType,
              duration_minutes: srv.durationMinutes,
              cost: srv.cost,
              is_active: true,
              description: srv.description || ''
            }))
          );
        }
      } catch {}
    }

    return newProfile;
  };

  // =========================================================================
  // BOOKING & QUEUE OPERATIONS
  // =========================================================================
  const createBooking = async (data: {
    shopId: string;
    serviceId: string;
    barberId?: string;
    appointmentDate: string;
    timeSlot: string;
    notes?: string;
  }): Promise<Booking | null> => {
    const shop = shops.find(s => s.id === data.shopId);
    const service = services.find(s => s.id === data.serviceId);
    const barber = barbers.find(b => b.id === data.barberId);

    if (!shop || !service || !currentUser) return null;

    const dayBookings = bookings.filter(
      b => b.shopId === data.shopId && b.appointmentDate === data.appointmentDate
    );
    const nextTokenNumber =
      dayBookings.length > 0 ? Math.max(...dayBookings.map(b => b.tokenNumber)) + 1 : 1;

    const newBooking: Booking = {
      id: `book-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      tokenNumber: nextTokenNumber,
      customerId: currentUser.id,
      customerName: customerProfile?.fullName || currentUser.email.split('@')[0],
      customerPhone: customerProfile?.phone || '',
      customerEmail: currentUser.email,
      shopId: shop.id,
      shopName: shop.shopName,
      shopAddress: `${shop.address}${shop.city ? `, ${shop.city}` : ''}`,
      shopPhone: shop.phone1,
      serviceId: service.id,
      serviceName: service.serviceName,
      serviceCost: service.cost,
      serviceDuration: service.durationMinutes,
      barberId: barber?.id,
      barberName: barber?.name,
      appointmentDate: data.appointmentDate,
      timeSlot: data.timeSlot,
      status: 'waiting',
      isWalkin: false,
      createdAt: new Date().toISOString(),
      notes: data.notes
    };

    setBookings(prev => [newBooking, ...prev]);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('bookings').insert({
          id: newBooking.id,
          token_number: newBooking.tokenNumber,
          customer_id: newBooking.customerId,
          customer_name: newBooking.customerName,
          customer_phone: newBooking.customerPhone,
          customer_email: newBooking.customerEmail,
          shop_id: newBooking.shopId,
          shop_name: newBooking.shopName,
          shop_address: newBooking.shopAddress,
          shop_phone: newBooking.shopPhone,
          service_id: newBooking.serviceId,
          service_name: newBooking.serviceName,
          service_cost: newBooking.serviceCost,
          service_duration: newBooking.serviceDuration,
          barber_id: newBooking.barberId || null,
          barber_name: newBooking.barberName || null,
          appointment_date: newBooking.appointmentDate,
          time_slot: newBooking.timeSlot,
          status: newBooking.status,
          is_walkin: newBooking.isWalkin,
          notes: newBooking.notes || null
        });
      } catch {}
    }

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {}

    return newBooking;
  };

  const cancelBooking = async (bookingId: string) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId ? { ...b, status: 'cancelled', updatedAt: new Date().toISOString() } : b
      )
    );
    if (isSupabaseConfigured) {
      try {
        await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);
      } catch {}
    }
  };

  const rescheduleBooking = async (bookingId: string, newDate: string, newSlot: string) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId
          ? { ...b, appointmentDate: newDate, timeSlot: newSlot, updatedAt: new Date().toISOString() }
          : b
      )
    );
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('bookings')
          .update({ appointment_date: newDate, time_slot: newSlot })
          .eq('id', bookingId);
      } catch {}
    }
  };

  const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setReviews(prev => [newRev, ...prev]);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('reviews').insert({
          id: newRev.id,
          booking_id: newRev.bookingId,
          shop_id: newRev.shopId,
          customer_name: newRev.customerName,
          rating: newRev.rating,
          comment: newRev.comment
        });
      } catch {}
    }
  };

  const updateTokenStatus = async (bookingId: string, status: TokenStatus) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status, updatedAt: new Date().toISOString() } : b))
    );
    if (isSupabaseConfigured) {
      try {
        await supabase.from('bookings').update({ status }).eq('id', bookingId);
      } catch {}
    }
  };

  const addWalkinCustomer = async (data: {
    name: string;
    phone: string;
    serviceId: string;
    barberId?: string;
  }): Promise<Booking | null> => {
    if (!shopProfile) return null;
    const service = services.find(s => s.id === data.serviceId);
    const barber = barbers.find(b => b.id === data.barberId);
    if (!service) return null;

    const today = new Date().toISOString().split('T')[0];
    const dayBookings = bookings.filter(b => b.shopId === shopProfile.id && b.appointmentDate === today);
    const nextTokenNumber =
      dayBookings.length > 0 ? Math.max(...dayBookings.map(b => b.tokenNumber)) + 1 : 1;

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 ? hours % 12 : 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const timeSlot = `${formattedHours}:${formattedMinutes} ${ampm} (Walk-in)`;

    const newBooking: Booking = {
      id: `walkin-${Date.now()}`,
      tokenNumber: nextTokenNumber,
      customerId: `walkin-${Date.now()}`,
      customerName: data.name,
      customerPhone: data.phone,
      shopId: shopProfile.id,
      shopName: shopProfile.shopName,
      shopAddress: shopProfile.address,
      shopPhone: shopProfile.phone1,
      serviceId: service.id,
      serviceName: service.serviceName,
      serviceCost: service.cost,
      serviceDuration: service.durationMinutes,
      barberId: barber?.id,
      barberName: barber?.name,
      appointmentDate: today,
      timeSlot,
      status: 'waiting',
      isWalkin: true,
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('bookings').insert({
          id: newBooking.id,
          token_number: newBooking.tokenNumber,
          customer_id: newBooking.customerId,
          customer_name: newBooking.customerName,
          customer_phone: newBooking.customerPhone,
          shop_id: newBooking.shopId,
          shop_name: newBooking.shopName,
          shop_address: newBooking.shopAddress,
          shop_phone: newBooking.shopPhone,
          service_id: newBooking.serviceId,
          service_name: newBooking.serviceName,
          service_cost: newBooking.serviceCost,
          service_duration: newBooking.serviceDuration,
          barber_id: newBooking.barberId || null,
          barber_name: newBooking.barberName || null,
          appointment_date: newBooking.appointmentDate,
          time_slot: newBooking.timeSlot,
          status: newBooking.status,
          is_walkin: true
        });
      } catch {}
    }

    return newBooking;
  };

  const broadcastDelay = async (shopId: string, minutes: number, reason: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newDelay: DelayNotification = {
      id: `delay-${Date.now()}`,
      shopId,
      delayDate: today,
      delayMinutes: minutes,
      reason,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    setDelays(prev => [newDelay, ...prev.filter(d => d.shopId !== shopId || d.delayDate !== today)]);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('delay_notifications').insert({
          id: newDelay.id,
          shop_id: newDelay.shopId,
          delay_date: newDelay.delayDate,
          delay_minutes: newDelay.delayMinutes,
          reason: newDelay.reason,
          is_active: true
        });
      } catch {}
    }
  };

  const clearDelay = async (shopId: string) => {
    setDelays(prev => prev.map(d => (d.shopId === shopId ? { ...d, isActive: false } : d)));
    if (isSupabaseConfigured) {
      try {
        await supabase.from('delay_notifications').update({ is_active: false }).eq('shop_id', shopId);
      } catch {}
    }
  };

  // =========================================================================
  // SERVICES & BARBERS CRUD (Properly synced to Supabase snake_case columns)
  // =========================================================================
  const addService = async (srvData: Omit<Service, 'id'>) => {
    const newSrv: Service = {
      ...srvData,
      id: `srv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    };
    setServices(prev => [...prev, newSrv]);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('services').insert({
          id: newSrv.id,
          shop_id: newSrv.shopId,
          service_name: newSrv.serviceName,
          service_type: newSrv.serviceType,
          duration_minutes: newSrv.durationMinutes,
          cost: newSrv.cost,
          is_active: newSrv.isActive,
          description: newSrv.description || ''
        });
      } catch {}
    }
  };

  const updateService = async (id: string, srvData: Partial<Service>) => {
    setServices(prev => prev.map(s => (s.id === id ? { ...s, ...srvData } : s)));
    if (isSupabaseConfigured) {
      const dbPatch: Record<string, any> = {};
      if (srvData.serviceName !== undefined) dbPatch.service_name = srvData.serviceName;
      if (srvData.serviceType !== undefined) dbPatch.service_type = srvData.serviceType;
      if (srvData.durationMinutes !== undefined) dbPatch.duration_minutes = srvData.durationMinutes;
      if (srvData.cost !== undefined) dbPatch.cost = srvData.cost;
      if (srvData.isActive !== undefined) dbPatch.is_active = srvData.isActive;
      if (srvData.description !== undefined) dbPatch.description = srvData.description;
      try {
        await supabase.from('services').update(dbPatch).eq('id', id);
      } catch {}
    }
  };

  const deleteService = async (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    if (isSupabaseConfigured) {
      try {
        await supabase.from('services').delete().eq('id', id);
      } catch {}
    }
  };

  const addBarber = async (barberData: Omit<Barber, 'id'>) => {
    const newBarber: Barber = {
      ...barberData,
      id: `barber-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    };
    setBarbers(prev => [...prev, newBarber]);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('barbers').insert({
          id: newBarber.id,
          shop_id: newBarber.shopId,
          name: newBarber.name,
          photo_url: newBarber.photoUrl,
          specialization: newBarber.specialization,
          experience_years: newBarber.experienceYears,
          is_available: newBarber.isAvailable,
          working_days: newBarber.workingDays || []
        });
      } catch {}
    }
  };

  const toggleBarberAvailability = async (barberId: string) => {
    let nextAvail = true;
    setBarbers(prev =>
      prev.map(b => {
        if (b.id === barberId) {
          nextAvail = !b.isAvailable;
          return { ...b, isAvailable: nextAvail };
        }
        return b;
      })
    );
    if (isSupabaseConfigured) {
      try {
        await supabase.from('barbers').update({ is_available: nextAvail }).eq('id', barberId);
      } catch {}
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        customerProfile,
        shopProfile,
        currentRole,
        currentView,
        setCurrentView,
        authModalOpen,
        authModalMode,
        authModalRole,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
        demoLogin,
        saveCustomerProfile,
        saveShopProfile,
        shops,
        services,
        barbers,
        bookings,
        delays,
        reviews,
        selectedShopForBooking,
        setSelectedShopForBooking,
        createBooking,
        cancelBooking,
        rescheduleBooking,
        addReview,
        updateTokenStatus,
        addWalkinCustomer,
        broadcastDelay,
        clearDelay,
        addService,
        updateService,
        deleteService,
        addBarber,
        toggleBarberAvailability,
        isSyncing,
        lastSyncedAt,
        refreshData: fetchCloudDataViaRest
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
