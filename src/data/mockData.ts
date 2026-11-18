import { ShopProfile, Barber, Service, Booking, CustomerProfile } from '../types';

export const INITIAL_SHOPS: ShopProfile[] = [
  {
    id: 'shop-1',
    userId: 'shop-user-1',
    shopName: 'The Royal Fade & Beard Lounge',
    address: '42 MG Road, Brigade Junction, Indiranagar',
    city: 'Bengaluru',
    phone1: '9845012345',
    phone2: '9845012346',
    phone3: '0802521199',
    openingTime: '09:00',
    closingTime: '21:00',
    dailyCapacity: 45,
    emergencyAvailable: true,
    logoUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&h=200&fit=crop&crop=faces',
    coverUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&h=400&fit=crop',
    rating: 4.9,
    reviewCount: 128,
    description: 'Premier grooming sanctuary specializing in modern fades, luxury beard styling, and traditional hot towel shaves.',
    registrationNumber: 'KA-BLR-2023-8891'
  },
  {
    id: 'shop-2',
    userId: 'shop-user-2',
    shopName: 'Crown & Blade Gentlemen Barbers',
    address: '15 Bandra West, Linking Road, Near Hill Road',
    city: 'Mumbai',
    phone1: '9820011223',
    phone2: '9820011224',
    openingTime: '10:00',
    closingTime: '21:30',
    dailyCapacity: 35,
    emergencyAvailable: false,
    logoUrl: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=200&h=200&fit=crop&crop=faces',
    coverUrl: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?w=800&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 94,
    description: 'Classic bespoke grooming and bespoke hair styling with expert master barbers.',
    registrationNumber: 'MH-MUM-2022-4412'
  },
  {
    id: 'shop-3',
    userId: 'shop-user-3',
    shopName: 'Urban Scissors & Spa Studio',
    address: '88 Sector 18, Commercial Belt, Noida',
    city: 'Delhi NCR',
    phone1: '9910044556',
    phone3: '0120422119',
    openingTime: '08:30',
    closingTime: '20:30',
    dailyCapacity: 50,
    emergencyAvailable: true,
    logoUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=200&h=200&fit=crop&crop=faces',
    coverUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 81,
    description: 'Modern styling and rapid express cuts with 24/7 weekend grooming availability.',
    registrationNumber: 'UP-NOI-2024-1102'
  }
];

export const INITIAL_SERVICES: Service[] = [
  // Shop 1 Services
  {
    id: 'srv-1',
    shopId: 'shop-1',
    serviceName: 'Signature Skin Fade & Styling',
    serviceType: 'Haircut',
    durationMinutes: 30,
    cost: 450,
    isActive: true,
    description: 'Precision scissor cut & skin fade finished with premium pomade.'
  },
  {
    id: 'srv-2',
    shopId: 'shop-1',
    serviceName: 'Luxury Beard Sculpting & Oil',
    serviceType: 'Beard Trim',
    durationMinutes: 20,
    cost: 300,
    isActive: true,
    description: 'Detailed beard line-up, trimmer taper, and organic argan oil application.'
  },
  {
    id: 'srv-3',
    shopId: 'shop-1',
    serviceName: 'Royal Hot Towel Straight Shave',
    serviceType: 'Shave',
    durationMinutes: 25,
    cost: 350,
    isActive: true,
    description: 'Steamed towel prep, rich lather straight razor shave, and cooling aftershave balm.'
  },
  {
    id: 'srv-4',
    shopId: 'shop-1',
    serviceName: 'Stress Relief Head Massage',
    serviceType: 'Head Massage',
    durationMinutes: 20,
    cost: 350,
    isActive: true,
    description: 'Relaxing herbal oil acupressure scalp massage.'
  },
  {
    id: 'srv-5',
    shopId: 'shop-1',
    serviceName: 'Charcoal Deep Cleanse Facial',
    serviceType: 'Facial',
    durationMinutes: 35,
    cost: 650,
    isActive: true,
    description: 'Pore clearing, exfoliating scrub, and black mask treatment.'
  },
  {
    id: 'srv-6',
    shopId: 'shop-1',
    serviceName: 'The Complete Executive Package',
    serviceType: 'Package',
    durationMinutes: 60,
    cost: 1100,
    isActive: true,
    description: 'Signature Haircut + Beard Sculpting + Head Massage combo.'
  },

  // Shop 2 Services
  {
    id: 'srv-7',
    shopId: 'shop-2',
    serviceName: 'Classic Gentleman Haircut',
    serviceType: 'Haircut',
    durationMinutes: 30,
    cost: 500,
    isActive: true,
    description: 'Traditional shear cut tailored to your facial structure.'
  },
  {
    id: 'srv-8',
    shopId: 'shop-2',
    serviceName: 'Beard Trim & Razor Sharp Edge',
    serviceType: 'Beard Trim',
    durationMinutes: 20,
    cost: 350,
    isActive: true,
    description: 'Shape-up with neck razor finish.'
  },
  {
    id: 'srv-9',
    shopId: 'shop-2',
    serviceName: 'Kids Master Cut (Under 12)',
    serviceType: 'Kids Cut',
    durationMinutes: 25,
    cost: 350,
    isActive: true,
    description: 'Friendly, patient haircut designed for children.'
  },

  // Shop 3 Services
  {
    id: 'srv-10',
    shopId: 'shop-3',
    serviceName: 'Quick Express Buzz & Trim',
    serviceType: 'Haircut',
    durationMinutes: 20,
    cost: 300,
    isActive: true,
    description: 'Fast, efficient clipper cut for busy professionals.'
  },
  {
    id: 'srv-11',
    shopId: 'shop-3',
    serviceName: 'Grey Blending & Hair Colour',
    serviceType: 'Hair Colour',
    durationMinutes: 40,
    cost: 700,
    isActive: true,
    description: 'Natural ammonia-free tone balancing for hair and beard.'
  }
];

export const INITIAL_BARBERS: Barber[] = [
  {
    id: 'barber-1',
    shopId: 'shop-1',
    name: 'Vikram "Vicky" Sharma',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
    specialization: 'Master Fade & Scissor Specialist',
    experienceYears: 8,
    isAvailable: true,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  {
    id: 'barber-2',
    shopId: 'shop-1',
    name: 'Arjun Das',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
    specialization: 'Beard Architect & Traditional Shaves',
    experienceYears: 6,
    isAvailable: true,
    workingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  {
    id: 'barber-3',
    shopId: 'shop-1',
    name: 'Kabir Khan',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
    specialization: 'Modern Texturing & Hair Colourist',
    experienceYears: 4,
    isAvailable: true,
    workingDays: ['Monday', 'Wednesday', 'Friday', 'Saturday', 'Sunday']
  },
  {
    id: 'barber-4',
    shopId: 'shop-2',
    name: 'Farhan Shaikh',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=faces',
    specialization: 'Senior Stylist & Vintage Cuts',
    experienceYears: 10,
    isAvailable: true,
    workingDays: ['All Days']
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book-1',
    tokenNumber: 1,
    customerId: 'cust-user-demo',
    customerName: 'Rahul Verma',
    customerPhone: '9876543210',
    customerEmail: 'rahul.verma@example.com',
    shopId: 'shop-1',
    shopName: 'The Royal Fade & Beard Lounge',
    shopAddress: '42 MG Road, Indiranagar, Bengaluru',
    shopPhone: '9845012345',
    serviceId: 'srv-1',
    serviceName: 'Signature Skin Fade & Styling',
    serviceCost: 450,
    serviceDuration: 30,
    barberId: 'barber-1',
    barberName: 'Vikram Sharma',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '10:00 AM',
    status: 'done',
    isWalkin: false,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'book-2',
    tokenNumber: 2,
    customerId: 'cust-2',
    customerName: 'Kunal Kapoor',
    customerPhone: '9812345678',
    shopId: 'shop-1',
    shopName: 'The Royal Fade & Beard Lounge',
    shopAddress: '42 MG Road, Indiranagar, Bengaluru',
    shopPhone: '9845012345',
    serviceId: 'srv-2',
    serviceName: 'Luxury Beard Sculpting & Oil',
    serviceCost: 300,
    serviceDuration: 20,
    barberId: 'barber-2',
    barberName: 'Arjun Das',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '10:45 AM',
    status: 'in_progress',
    isWalkin: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'book-3',
    tokenNumber: 3,
    customerId: 'cust-user-demo',
    customerName: 'Rahul Verma',
    customerPhone: '9876543210',
    customerEmail: 'rahul.verma@example.com',
    shopId: 'shop-1',
    shopName: 'The Royal Fade & Beard Lounge',
    shopAddress: '42 MG Road, Indiranagar, Bengaluru',
    shopPhone: '9845012345',
    serviceId: 'srv-4',
    serviceName: 'Stress Relief Head Massage',
    serviceCost: 350,
    serviceDuration: 20,
    barberId: 'barber-1',
    barberName: 'Vikram Sharma',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '11:30 AM',
    status: 'waiting',
    isWalkin: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'book-4',
    tokenNumber: 4,
    customerId: 'walkin-1',
    customerName: 'Sameer Joshi',
    customerPhone: '9765432109',
    shopId: 'shop-1',
    shopName: 'The Royal Fade & Beard Lounge',
    shopAddress: '42 MG Road, Indiranagar, Bengaluru',
    shopPhone: '9845012345',
    serviceId: 'srv-3',
    serviceName: 'Royal Hot Towel Straight Shave',
    serviceCost: 350,
    serviceDuration: 25,
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '12:00 PM',
    status: 'waiting',
    isWalkin: true,
    createdAt: new Date(Date.now() - 1800000).toISOString()
  }
];

export const DEMO_CUSTOMER_PROFILE: CustomerProfile = {
  id: 'profile-cust-demo',
  userId: 'cust-user-demo',
  fullName: 'Rahul Verma',
  phone: '9876543210',
  gender: 'Male',
  dob: '1998-05-14',
  age: 28,
  city: 'Bengaluru',
  state: 'Karnataka',
  emergencyContact: '9876543211',
  profilePicUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=faces'
};
