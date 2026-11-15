# 303 Garden Station — Gói website menu 2026 hợp nhất (nhánh `update-menu-2026`)

Gói này cập nhật website theo 2 file PDF menu 2026 đã nén:
`303_MENU_NEW_2026_compressed.pdf` (20 trang) và `MENU_NEWSPACE_EMBER_2026_compressed.pdf` (14 trang).

## Kết quả chính

- **Tổng menu mới: 308 món** (không phải ~133 như ước tính ban đầu — xem "Vì sao 308 món").
- **108 món cũ giữ nguyên** (production commit 075a8d9). Chỉ **4 món đổi giá theo PDF 2026**:
  - Ốc Hương Rang Muối: 750/KG → **219K** (đổi mô hình giá: từ tính theo KG sang giá theo đĩa)
  - Mì Xào Hải Sản: 139K → **219K**
  - Lẩu Thái Hải Sản: 289K → **359K**
  - Nước Suối: 69K → **126K**
- **200 món mới** thêm từ 2 PDF (OCR tiếng Việt toàn bộ 34 trang), gồm 1 món để giá trống
  (xem "Món để giá trống").
- **14 danh mục** (thêm "Combo Rượu" tách từ "Combo" — xem bên dưới).
- Giao diện giữ nguyên 100%: logo 303 đỏ 3D viền xanh neon, 3 bé áo trắng lấp lánh,
  OPEN 17:00–03:00, hotline 0399 035 303, gallery 14 ảnh, 4 video, div `#clips-5s`.
- Chatbot AI đã cập nhật: ghi **308 món** và số món đúng theo từng danh mục.
- `js/main.js` **162.024 byte** (tăng 61 byte so với bản v3 161.963 byte — chỉ do thêm
  tab "Combo Rượu" và cập nhật chuỗi chatbot sang 308 món; phần còn lại giữ nguyên).
- Kiểm tra: `node tools/verify.mjs` → **21/21 PASS**.

## Vì sao 308 món, không phải ~133

Con số ~133 dựa trên mẫu OCR 9 trang trước đây (64 món mới, giả định ~39 món trùng).
OCR toàn bộ 34 trang cho thấy 2 PDF là **menu khác hẳn** menu website: chỉ **6 món trùng tên**.
2 PDF chứa **205 món riêng biệt**, nên hợp nhất = 108 + 205 − 6 = 307, cộng 1 món
Đùi Vịt Rút Xương Sốt Hồng Xíu (không in giá trên PDF, để giá trống) = **308 món**.
Không cắt món nào theo yêu cầu "giữ đủ món".

- Món mới theo danh mục: Gà Tre +4, Lai Rai +21, Lúa Mạch +14, Mực +8, Tôm +6,
  Hải Sản +15, Đồng Quê +8, Cá +5, Cơm Mì Miến +7, Cháo Lẩu +8, Combo +6, Combo Rượu +44,
  Cocktail +8, Drinks +46.

## 2 PDF là 2 khu khác nhau — cùng tên có thể khác giá

Theo xác nhận của chủ quán: 2 PDF là menu của **2 khu vực khác nhau trong cùng 1 quán**
(PDF chính và PDF Newspace Ember), nên **cùng một tên món có thể có 2 mức giá khác nhau
theo khu**. Gói này **giữ cả 2 giá dưới dạng 2 dòng món riêng** (không gộp, không chọn
một giá làm chuẩn). Ví dụ đồ uống: Heineken/Tiger/Coca/Nước Suối có giá khác nhau
giữa 2 PDF và cả 2 đều có trong menu. Nếu thấy cùng tên xuất hiện 2 lần với 2 giá,
đó là đúng theo giá từng khu, không phải lỗi trùng.

## Combo tách 2 tab

- **Combo** (10 món): combo món ăn — 4 combo cũ (Combo Beer Garden 01, Ember VIP 02,
  DJ Night 03, Pi Pioneers 04) + 6 combo mới từ PDF (Combo Vui Vẻ, Đảo Hải Sản Kiểu Thái,
  Combo Steak, Combo Nướng, Combo Khô Lai Rai, Combo Khoai 303).
- **Combo Rượu** (44 set): set rượu SL1/SL2/SL3 (41 set: Chivas, Royal Salute, Jameson,
  Glenlivet, Luc Belaire, Martell, Champagne G.H Mumm, The Deacon, Bumbu...) + 3 set bia
  (Combo Beer Heineken Silver). Tab này nằm ngay sau tab Combo.

## Món để giá trống

- **Đùi Vịt Rút Xương Sốt Hồng Xíu** (Đồng Quê): PDF không in giá vì là món đặc thù,
  giá nguyên liệu thay đổi mạnh tùy ngày nên **để trống giá** theo đúng ý chủ quán.
  Trên web món này hiển thị không có giá (không phải lỗi thiếu dữ liệu).

## Cấu trúc gói (giữ nguyên kiến trúc v3)

| File | Nội dung | Dung lượng |
|---|---|---|
| `data/menu.json` | Nguồn duy nhất, 308 món, 14 danh mục, tuple 5 phần | 29.230 byte |
| `data/menu-items.js` | `window.__MENU_TUPLES__` + `window.MENU_TUPLES` (cùng 1 đối tượng) | **16.170 byte** |
| `js/menu-data.js` | Loader: tuple → `{id,name,price,priceRaw,category,zone}`, load TRƯỚC `js/main.js` | 1.100 byte |
| `data/menu/by-zone/` | 5 file: newspace 146, beergarden 26, drinks 65, combo 54, cocktail 17 (mỗi món lưu 1 lần, 0 trùng id) | — |
| `tools/verify.mjs` | 21 kiểm tra, tất cả PASS | — |
| `js/main.js` | Thêm tab "Combo Rượu", chatbot cập nhật 308 món, **162.024 byte** | 162.024 byte |
| `index.html` | 16 dòng, có div `#clips-5s` grid 4 video dưới gallery, trước menu | — |
| `css/main.css` | CSS duy nhất (đã bỏ `style.css` vì copy y hệt) | 23.536 byte |

**Về `data/menu-items.js` 16.170 byte (không phải 6.145 byte):** 6.145 byte là cho 108 món
(~57 byte/món). Định dạng tuple gọn 5 phần giữ nguyên, chi phí mỗi món không đổi;
308 món thì file ~16KB là đúng tỉ lệ. Không thể nhét 308 món vào 6.145 byte
(vì tên món trung bình đã ~20 ký tự). Payload menu (menu-items.js + menu-data.js)
là 17.270 byte cho 308 món — vẫn gọn hơn nhiều so với mảng SZ cứng 174.341 byte ban đầu.

## Bộ lọc tab (số món mỗi tab)

Khu: ALL **308**, NEWSPACE **146**, BEERGARDEN **135**, COMBO **54**, COCKTAIL **17**, DRINKS **65**.
Danh mục: Gà Tre 9, Lai Rai 36, Lúa Mạch 25, Mực 12, Tôm 10, Hải Sản 23, Đồng Quê 15,
Cá 9, Cơm Mì Miến 14, Cháo Lẩu 19, Combo 10, Combo Rượu 44, Cocktail 17, Drinks 65.
Món ăn (danh mục 0–9) được gán khu `nb` (cả 2 khu); món cũ giữ nguyên khu cũ
(newspace-only 37, beergarden-only 26, dual 13). Nếu muốn món ăn mới chỉ hiện ở
khu Beergarden (vì PDF chính là menu khu đó), báo lại để đổi `nb` → `b`
(khi đó tab NEWSPACE còn 50 món, BEERGARDEN vẫn 135).

## Giá cần xác nhận lại (OCR chưa đọc chắc 100%)

Các giá này đã được sửa theo logic (chữ số đầu bị OCR làm rơi), nhưng nên đối chiếu với PDF gốc:

- Tôm Tam Vị **199K** (OCR đọc "19ổK")
- Lẩu Tôm Nấu Bầu **489K** (OCR đọc "89K")
- Cháo Bồ Câu **149K** (OCR đọc "49K")
- Ngao 2 Còi Hấp Thái Xả **239K** (OCR đọc "39K")
- Soju (Truyền Thống / Đào / Việt Quất) **199K** (giá không đọc được, ước theo món tương tự)
- Chivas 12 SL1 **3.190.000VND** (lấy từ bảng giá lẻ NS p-08; giá trên trang rượu full p-20 không đọc rõ)

## Món chưa trích được (không có trong gói này)

- NS p-06 (ảnh, không có món), NS p-11, p-12 (set bia — chưa đọc được tên),
  NS p-13 (rượu — tên không đọc được). Nếu cần, gửi ảnh chụp rõ các trang này, mình bổ sung sau.

## Hướng dẫn deploy (nhánh `update-menu-2026`)

```bash
git checkout -b update-menu-2026
# copy toàn bộ nội dung gói này vào repo (ghi đè các file cùng tên)
# KHÔNG đụng nhánh main và test-menu-clips
node tools/build-menu.mjs        # sinh lại menu-items.js + by-zone từ data/menu.json (nguồn duy nhất)
node tools/verify.mjs            # phải ra 21/21 PASS
git add -A && git commit -m "Menu 2026: hop nhat 308 mon tu 2 PDF, tach Combo Ruou"
git push -u origin update-menu-2026
```

**Bắt buộc trước khi deploy lên Vercel:** vào Vercel Dashboard → Project → Settings →
Environment Variables, thêm biến **`PI_API_KEY`** (key Pi Network). Nếu không set,
API thanh toán `api/a2u.js` sẽ không chạy. Key chỉ đọc server-side trong `api/a2u.js`
qua `process.env.PI_API_KEY`; `js/pay.js` và `js/pi-sdk.js` không chứa key.

**File không có trong gói (copy từ production `public/`):**
`public/images/logo/logo-xanh-vang.jpg`, `public/videos/*.mp4` (4 video).
3 ảnh gallery sau không có trong file upload nên cũng cần copy từ production:
`2be-dancer-ao-hong.jpg`, `khach-vay-den-nhay.jpg`, `be-ao-den-nhay.jpg`.
