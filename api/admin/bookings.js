// GET /api/admin/bookings — dashboard nội bộ cho Mr Thành xem lại đặt bàn.
// Query: ?phone= (tìm gần đúng theo SĐT, không bắt buộc), ?limit= (mặc định 50, tối đa 200).
// LƯU Ý BẢO MẬT (Phase 1): route này CHƯA có đăng nhập.
// Phải thêm auth (ví dụ: kiểm tra token/mật khẩu) TRƯỚC KHI công khai /admin.
// Hiện chỉ dùng nội bộ.
import { supaSelect } from '../_supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
  let limit = parseInt(req.query.limit, 10);
  if (!Number.isInteger(limit) || limit < 1) limit = 50;
  if (limit > 200) limit = 200;

  const phone =
    typeof req.query.phone === 'string' ? req.query.phone.trim() : '';
  // PostgREST ilike: tìm gần đúng, escape % và _ trong input
  const safePhone = phone.replace(/[%_\\]/g, (c) => '\\' + c);
  const filter = safePhone
    ? 'phone=ilike.*' + encodeURIComponent(safePhone) + '*'
    : '';
  const query =
    'select=id,name,phone,time,party_size,note,pi_points_used,created_at' +
    '&order=created_at.desc&limit=' +
    limit +
    (filter ? '&' + filter : '');

  try {
    const bookings = await supaSelect('bookings', query);
    return res.status(200).json({ success: true, bookings: bookings || [] });
  } catch (e) {
    console.error('admin/bookings error:', e.message);
    return res.status(500).json({ success: false, error: 'Lỗi máy chủ, chưa tải được đặt bàn' });
  }
}
