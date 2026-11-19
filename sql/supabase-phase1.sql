-- ============================================================
-- GARDEN STATION 303 — PHASE 1: SUPABASE SCHEMA
-- Chạy file này trong Supabase Dashboard → SQL Editor → Run.
-- KHÔNG hardcode key trong code. Supabase URL + SERVICE_ROLE_KEY
-- đặt trong Vercel: Project Settings → Environment Variables
--   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
-- (dùng SERVICE_ROLE_KEY vì các API route chạy phía server, bypass RLS)
-- ============================================================

-- 1. bookings — đặt bàn (Mr Thành xem lại + forward Zalo/Call)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  time TIMESTAMPTZ NOT NULL,
  party_size INT NOT NULL,
  note TEXT,
  pi_points_used INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. chats — lịch sử chat để huấn luyện AI (không để trong RAM)
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  bot_reply TEXT NOT NULL,
  booking_id UUID NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. customers — khách hàng, định danh bằng SĐT (pi_uid khi đăng nhập Pi)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  pi_uid TEXT,
  total_points INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. points_log — nhật ký cộng/trừ điểm (kiểm toán điểm thưởng)
CREATE TABLE IF NOT EXISTS points_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  points_change INT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('dat_ban', 'ghe_quan', 'doi_mon')),
  booking_id UUID NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings (phone);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chats_session_id ON chats (session_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers (phone);
CREATE INDEX IF NOT EXISTS idx_points_log_customer_id ON points_log (customer_id);

-- Quy tắc điểm Phase 1: mỗi lần đặt bàn thành công = +10 điểm Pi
-- (cộng trong api/bookings.js, ghi vào points_log với reason = 'dat_ban')
