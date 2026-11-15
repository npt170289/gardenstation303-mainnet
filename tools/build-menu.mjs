// tools/build-menu.mjs — 303 Garden Station, menu 2026 hợp nhất (V4, 308 món)
// Chạy:  node tools/build-menu.mjs
// Đọc data/menu.json (NGUỒN DUY NHẤT, 308 món, 14 danh mục), rồi sinh lại:
//   - data/menu-items.js  (tuple gọn 5 phần, load trước js/main.js)
//   - data/menu/by-zone/*.json  (PHÂN VÙNG theo khu CHÍNH, mỗi món chỉ lưu 1 lần)
// Không cần cài thêm gì, chỉ cần Node 18+.
// Nếu số món khác 308, trùng id, tuple không đủ 5 phần, hoặc categoryIndex sai,
// script dừng và báo lỗi. Giá được phép trống ("") với món đặc thù không in giá
// trên PDF (vd Đùi Vịt Rút Xương Sốt Hồng Xíu, dq15) — đó không phải lỗi.
//
// TUPLE CHUẨN 5 PHẦN (mọi file đều dùng cùng 1 định dạng):
//   [id, name, price, categoryIndex, zoneCode]
//   categoryIndex (THỨ TỰ SZ GỐC + Combo Rượu tách ra, không phải thứ tự tab DZ):
//   0=Gà Tre, 1=Lai Rai, 2=Lúa Mạch, 3=Mực, 4=Tôm, 5=Hải Sản,
//   6=Đồng Quê, 7=Cá, 8=Cơm Mì Miến, 9=Cháo Lẩu, 10=Combo, 11=Combo Rượu,
//   12=Cocktail, 13=Drinks
//   zoneCode: n=newspace, b=beergarden, d=drinks, c=combo, k=cocktail,
//             nb=newspace+beergarden (món thuộc 2 khu)
//
// VÌ SAO by-zone KHÔNG CỘNG RA SỐ TAB:
//   109 món có zoneCode "nb" thuộc cả 2 khu. Nếu copy chúng vào cả 2 file,
//   tổng số dòng sẽ vượt 308 và 109 id bị trùng. Mỗi món chỉ lưu 1 lần,
//   ở file của khu CHÍNH (ký tự đầu của zoneCode).
//   newspace.json 146 món (37 món riêng + 109 món 2 khu, khu chính là newspace)
//   beergarden.json 26 món (26 món riêng beergarden)
//   drinks.json 65, combo.json 54, cocktail.json 17  -> tổng 146+26+65+54+17 = 308.
//   Số món của TAB BEERGARDEN là 135, vì lọc theo zoneCode "nb" chứ không
//   phải đếm số dòng trong file: 26 món riêng + 109 món 2 khu = 135.
//   Mỗi file by-zone đều ghi rõ cả 2 con số: count (số dòng trong file)
//   và filterCount (số món tab đó hiển thị khi lọc theo zone).
//
// 2 PDF LÀ 2 KHU KHÁC NHAU: cùng tên món có thể có 2 giá khác nhau theo khu.
// Cả 2 giá đều được giữ dưới dạng 2 dòng món riêng, không gộp, không chọn
// một giá làm chuẩn. Gói này chỉ chứa nội dung Garden Station 303.
import { readFileSync, writeFileSync } from "node:fs";

const EXPECTED_TOTAL = 308;
const EXPECTED_CATS = 14;
const ZONE_CODE = { newspace: "n", beergarden: "b", drinks: "d", combo: "c", cocktail: "k" };
const CODE_ZONE = Object.fromEntries(Object.entries(ZONE_CODE).map(([k, v]) => [v, k]));
const VALID_ZONE_CODES = new Set(["n", "b", "d", "c", "k", "nb"]);

const menu = JSON.parse(readFileSync(new URL("../data/menu.json", import.meta.url), "utf-8"));
const cats = menu.categories.map((c) => c.name);

// Tuple 5 phần: [id, name, price, categoryIndex, zoneCode]
const tuples = [];
const seen = new Set();
const emptyPrice = [];
for (const cat of menu.categories) {
  const ci = cats.indexOf(cat.name);
  for (const item of cat.items) {
    if (item.length !== 5) throw new Error(`Tuple phải có 5 phần, gặp ${item.length} phần ở id=${item[0]}`);
    const [id, name, price, catIdx, zoneCode] = item;
    if (catIdx !== ci) throw new Error(`categoryIndex sai ở ${id}: ${catIdx} != ${ci}`);
    if (seen.has(id)) throw new Error("Trùng id: " + id);
    seen.add(id);
    if (!VALID_ZONE_CODES.has(zoneCode)) throw new Error(`zoneCode sai ở ${id}: ${zoneCode}`);
    if (price === "") emptyPrice.push(id);
    tuples.push([id, name, price, catIdx, zoneCode]);
  }
}
if (tuples.length !== EXPECTED_TOTAL) throw new Error(`Số món phải là ${EXPECTED_TOTAL}, hiện có ${tuples.length}`);
if (cats.length !== EXPECTED_CATS) throw new Error(`Số danh mục phải là ${EXPECTED_CATS}, hiện có ${cats.length}`);
if (!cats.includes("Combo Rượu")) throw new Error('Thiếu danh mục "Combo Rượu" (Combo tách 2 tab)');
const comboCount = tuples.filter((t) => cats[t[3]] === "Combo").length;
const comboRuouCount = tuples.filter((t) => cats[t[3]] === "Combo Rượu").length;
if (comboCount !== 10 || comboRuouCount !== 44) {
  throw new Error(`Combo phải 10 món và Combo Rượu 44 set, hiện có ${comboCount} / ${comboRuouCount}`);
}

// Số món mỗi TAB khi lọc theo zone (kể cả món 2 khu)
const filterCount = {};
for (const zone of Object.keys(ZONE_CODE)) {
  filterCount[zone] = tuples.filter((t) => String(t[4]).split("").some((c) => CODE_ZONE[c] === zone)).length;
}

const header =
  `// 303 Garden Station - menu-items.js (2026 merged menu)\n` +
  `// Tuples 5 phan [id,name,price,categoryIndex,zoneCode]. ${tuples.length} mon, ${cats.length} danh muc. Load TRUOC js/main.js.\n`;
writeFileSync(
  new URL("../data/menu-items.js", import.meta.url),
  header +
    `window.__MENU_TUPLES__=${JSON.stringify(tuples)};\n` +
    `window.__MENU_CATEGORIES__=${JSON.stringify(cats)};\n` +
    `window.__MENU_ZONES__=${JSON.stringify(CODE_ZONE)};\n` +
    `window.MENU_TUPLES=window.__MENU_TUPLES__;\n` +
    `window.MENU_CATEGORIES=window.__MENU_CATEGORIES__;\n` +
    `window.MENU_ZONES=window.__MENU_ZONES__;\n`
);

// By-zone: PHÂN VÙNG theo khu chính (ký tự đầu của zoneCode), mỗi id chỉ xuất hiện 1 lần.
const shards = {};
for (const t of tuples) {
  const primary = CODE_ZONE[String(t[4])[0]];
  (shards[primary] ??= []).push(t);
}
for (const zone of Object.keys(ZONE_CODE)) {
  const items = shards[zone] ?? [];
  writeFileSync(
    new URL(`../data/menu/by-zone/${zone}.json`, import.meta.url),
    JSON.stringify(
      {
        zone,
        count: items.length,
        filterCount: filterCount[zone],
        items,
      },
      null,
      1
    )
  );
}
console.log(`OK: ${tuples.length} món, ${cats.length} danh mục, không trùng id -> data/menu-items.js + data/menu/by-zone/*.json`);
console.log(
  `by-zone (phân vùng, tổng ${tuples.length}): ` +
    Object.keys(ZONE_CODE)
      .map((z) => `${z}=${(shards[z] ?? []).length} (tab ${filterCount[z]})`)
      .join(", ")
);
console.log(`Combo ${comboCount} món, Combo Rượu ${comboRuouCount} set.`);
if (emptyPrice.length) console.log(`Món để giá trống (đặc thù, giá theo ngày): ${emptyPrice.join(", ")}`);
