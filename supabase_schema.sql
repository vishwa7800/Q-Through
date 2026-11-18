-- ==============================================================================
-- Q-THROUGH POSTGRESQL SCHEMA (SUPABASE)
-- Uses standard PostgreSQL tables and HTTP REST queries (No WebSockets needed)
-- ==============================================================================

-- 0. APP_USERS (Unified Role-Based Accounts)
CREATE TABLE IF NOT EXISTS public.app_users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('customer', 'shop')),
    is_profile_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1. PROFILES (Customer Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    gender TEXT NOT NULL,
    dob DATE NOT NULL,
    age INT NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    emergency_contact TEXT,
    profile_pic_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SHOPS (Barbershop Profiles)
CREATE TABLE IF NOT EXISTS public.shops (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    shop_name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    phone_1 TEXT NOT NULL,
    phone_2 TEXT,
    phone_3 TEXT,
    opening_time TEXT NOT NULL DEFAULT '09:00',
    closing_time TEXT NOT NULL DEFAULT '21:00',
    daily_capacity INT NOT NULL DEFAULT 40,
    emergency_available BOOLEAN DEFAULT TRUE,
    logo_url TEXT,
    cover_url TEXT,
    rating NUMERIC(2,1) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    description TEXT,
    registration_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SERVICES (Grooming Catalog)
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    shop_id TEXT NOT NULL,
    service_name TEXT NOT NULL,
    service_type TEXT NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 30,
    cost NUMERIC(10,2) NOT NULL DEFAULT 350.00,
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BARBERS (Staff & Scheduling)
CREATE TABLE IF NOT EXISTS public.barbers (
    id TEXT PRIMARY KEY,
    shop_id TEXT NOT NULL,
    name TEXT NOT NULL,
    photo_url TEXT,
    specialization TEXT,
    experience_years INT DEFAULT 3,
    is_available BOOLEAN DEFAULT TRUE,
    working_days TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BOOKINGS (Appointments & Queue Tokens)
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    token_number INT NOT NULL,
    customer_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    shop_id TEXT NOT NULL,
    shop_name TEXT NOT NULL,
    shop_address TEXT,
    shop_phone TEXT,
    service_id TEXT NOT NULL,
    service_name TEXT NOT NULL,
    service_cost NUMERIC(10,2) NOT NULL,
    service_duration INT NOT NULL DEFAULT 30,
    barber_id TEXT,
    barber_name TEXT,
    appointment_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'waiting', -- 'waiting', 'in_progress', 'done', 'cancelled'
    is_walkin BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DELAY NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.delay_notifications (
    id TEXT PRIMARY KEY,
    shop_id TEXT NOT NULL,
    delay_date DATE NOT NULL,
    delay_minutes INT NOT NULL,
    reason TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    booking_id TEXT,
    shop_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS) & ALLOW API ACCESS
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delay_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.app_users;
DROP POLICY IF EXISTS "Allow public read access" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read access" ON public.shops;
DROP POLICY IF EXISTS "Allow public read access" ON public.services;
DROP POLICY IF EXISTS "Allow public read access" ON public.barbers;
DROP POLICY IF EXISTS "Allow public read access" ON public.bookings;
DROP POLICY IF EXISTS "Allow public read access" ON public.delay_notifications;
DROP POLICY IF EXISTS "Allow public read access" ON public.reviews;

CREATE POLICY "Allow public read access" ON public.app_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read access" ON public.shops FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read access" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read access" ON public.barbers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read access" ON public.bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read access" ON public.delay_notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read access" ON public.reviews FOR ALL USING (true) WITH CHECK (true);
