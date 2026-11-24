// MAINNET A2U - Vercel Serverless Function
// Key Pi KHONG hardcode trong file này nữa.
// Đặt trong Vercel: Project Settings -> Environment Variables -> PI_API_KEY
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // --- KHOA ADMIN (2026-11-24) ---
  // Chi admin moi duoc pay A2U. Verify accessToken qua Pi /v2/me, UID phai == ADMIN_UID.
  // Khong co token -> 401; token khong hop le -> 401; UID khong phai admin -> 403.
  // ADMIN_UID lay tu bien moi truong Vercel, fallback UID admin cua app Garden Mainnet.
  // Admin UID: thuongsheva trong app Garden Mainnet (lay qua uid.html 2026-11-25).
  const ADMIN_UID = process.env.ADMIN_UID || '78ea2ff5-caef-4dd2-a934-d8c73e288686';
  const _accessToken = (req.body || {}).accessToken;
  if (!_accessToken) {
    return res.status(401).json({ error: 'Thieu accessToken — dang nhap Pi truoc khi pay.' });
  }
  try {
    const _meRes = await fetch('https://api.minepi.com/v2/me', { headers: { Authorization: `Bearer ${_accessToken}` } });
    const _meData = await _meRes.json().catch(() => ({}));
    if (!_meRes.ok || !_meData.uid) {
      return res.status(401).json({ error: 'accessToken khong hop le.' });
    }
    if (_meData.uid !== ADMIN_UID) {
      return res.status(403).json({ error: '403 Forbidden — Chi chinh chu (admin) moi duoc pay A2U.' });
    }
  } catch (e) {
    return res.status(401).json({ error: 'accessToken khong hop le.' });
  }

  const { uid, username, amount } = req.body;
  const PI_API_KEY = process.env.PI_API_KEY;
  if (!PI_API_KEY) return res.status(500).json({ error: 'Missing PI_API_KEY env var' });
  try {
    const response = await fetch('https://api.minepi.com/v2/payments', {
      method: 'POST',
      headers: { 'Authorization': `Key ${PI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amount || 1,
        memo: `Garden 303 Mainnet to @${username}`,
        metadata: { target_uid: uid },
        uid: uid
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));
    return res.status(200).json({ success: true, paymentId: data.identifier, data });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
