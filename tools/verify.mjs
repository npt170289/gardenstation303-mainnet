// tools/verify.mjs — 303 Garden Station, menu 2026 hợp nhất (308 món)
// Chạy:  node tools/verify.mjs
// 21 kiểm tra, tất cả phải PASS (không cần trình duyệt, không cần file gốc).
// Menu 2026 = website 108 món cũ (production commit 075a8d9) + món mới từ 2 PDF
// menu 2026, loại trùng theo tên, giá PDF 2026 thắng khi trùng tên.
// 2 PDF là 2 khu khác nhau nên cùng tên có thể có 2 giá (giữ cả 2, không gộp).
// Combo tách 2 tab: "Combo" (món ăn, 10) và "Combo Rượu" (set rượu + set bia, 44).
// Món đặc thù không in giá trên PDF (vd Đùi Vịt Rút Xương) để giá trống "". 
// Nhóm A - nguồn duy nhất data/menu.json:
//   1. đủ 308 món, 2. đủ 14 danh mục, 3. tuple 5 phần ở MỌI file,
//   4. không trùng id trong menu.json, 5. không trùng id trong menu-items.js.
// Nhóm B - phân vùng by-zone (mỗi món chỉ lưu 1 lần):
//   6. tổng số dòng 5 file = 308 (146+26+65+54+17),
//   7. không trùng id giữa 5 file (308 id duy nhất),
//   8. filterCount mỗi khu: newspace 146, beergarden 135, drinks 65, combo 54, cocktail 17.
// Nhóm C - menu mở rộng và 108 món cũ:
//   9. menu-data.js mở rộng = 308 món,
//  10. 108 món cũ vẫn đủ (theo id) và chỉ 4 món đổi giá theo PDF 2026
//      (hs3 Ốc Hương Rang Muối 750/KG->219K, cm2 Mì Xào Hải Sản 139K->219K,
//       cl3 Lẩu Thái Hải Sản 289K->359K, d1 Nước Suối 69K->126K),
//  11. món đầu gt1 / món cuối d65, 12. priceRaw = price 307/307 món.
// Nhóm D - bộ lọc tab (logic lọc y hệt trong main.js):
//  13. ALL 308, NEWSPACE 146, 14. BEERGARDEN 135, COMBO 54, 15. COCKTAIL 17, DRINKS 65.
//  16. tab danh mục: Combo 10 món, Combo Rượu 44 set; món Đùi Vịt giá trống "".
// Nhóm E - bundle, index, clips, CSS, Pi:
//  16. main.js không còn mảng SZ, có patch window.__MENU__, còn tab jZ/DZ,
//  17. index.html load menu-items.js + menu-data.js TRƯỚC main.js; có div #clips-5s
//      với 4 video và js/clips.js,
//  18. style.css đã bỏ (không còn ở root hay css/),
//  19. Pi: api/a2u.js đọc process.env.PI_API_KEY, không có key hardcode;
//      pay.js không chứa key; pi-sdk.js có sandbox:false và chỉ load trong PiBrowser.
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";
import crypto from "node:crypto";

const root = new URL("..", import.meta.url);
const read = (p) => readFileSync(new URL(p, root), "utf-8");
const TOTAL = 308;
const MERGED_SHA256 = "a78d504b060fac4fed82e613b72af860df2aec1745ae0df4c1157d8e9c0ee590";
// 108 id món cũ (production commit 075a8d9, mảng SZ trong main.js)
const OLD_IDS = [
  "gt1","gt2","gt3","gt4","gt5",
  "lr1","lr2","lr3","lr4","lr5","lr6","lr7","lr8","lr9","lr10","lr11","lr12","lr13","lr14","lr15",
  "lm1","lm2","lm3","lm4","lm5","lm6","lm7","lm8","lm9","lm10","lm11",
  "mu1","mu2","mu3","mu4","to1","to2","to3","to4",
  "hs1","hs2","hs3","hs4","hs5","hs6","hs7","hs8",
  "dq1","dq2","dq3","dq4","dq5","dq6","dq7","ca1","ca2","ca3","ca4",
  "cm1","cm2","cm3","cm4","cm5","cm6","cm7",
  "cl1","cl2","cl3","cl4","cl5","cl6","cl7","cl8","cl9","cl10","cl11",
  "cb1","cb2","cb3","cb4",
  "ck1","ck2","ck3","ck4","ck5","ck6","ck7","ck8","ck9",
  "d1","d2","d3","d4","d5","d6","d7","d8","d9","d10","d11","d12","d13","d14","d15","d16","d17","d18","d19",
];
// 4 món cũ đổi giá theo PDF 2026 (id -> giá mới)
const PRICE_CHANGES = { hs3: "219K", cm2: "219K", cl3: "359K", d1: "126K" };
let fail = 0;
let n = 0;
const check = (label, ok, extra = "") => {
  n++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${String(n).padStart(2, "0")}. ${label} ${extra}`);
  if (!ok) fail++;
};

const menu = JSON.parse(read("data/menu.json"));
const allMenuItems = menu.categories.flatMap((c) => c.items);
const total = allMenuItems.length;
check(`data/menu.json = ${TOTAL} món`, total === TOTAL, `(${total})`);
check("data/menu.json = 14 danh mục (Combo tách thành Combo + Combo Rượu)", menu.categories.length === 14);

// 3. Tuple 5 phần ở MỌI file
const tuplesFile = read("data/menu-items.js");
const tuples = JSON.parse(tuplesFile.match(/window\.__MENU_TUPLES__\s*=\s*(\[.*?\]);/s)[1]);
const zoneFiles = ["newspace", "beergarden", "drinks", "combo", "cocktail"].map((z) =>
  JSON.parse(read(`data/menu/by-zone/${z}.json`))
);
const zoneItems = zoneFiles.flatMap((d) => d.items);
const all5 =
  allMenuItems.every((i) => i.length === 5) &&
  tuples.every((i) => i.length === 5) &&
  zoneItems.every((i) => i.length === 5);
check(
  "tuple 5 phần ở mọi file (menu.json, menu-items.js, by-zone) + alias window.MENU_TUPLES",
  all5 && /window\.MENU_TUPLES\s*=\s*window\.__MENU_TUPLES__;/.test(tuplesFile),
  `(menu.json ${allMenuItems.length}, menu-items.js ${tuples.length}, by-zone ${zoneItems.length} tuple)`
);
check("không trùng id trong data/menu.json", new Set(allMenuItems.map((i) => i[0])).size === TOTAL);
check("không trùng id trong data/menu-items.js", new Set(tuples.map((i) => i[0])).size === TOTAL);

// 6-8. By-zone phân vùng
const zoneCounts = zoneFiles.map((d) => d.count);
const zoneSum = zoneCounts.reduce((a, b) => a + b, 0);
check("by-zone tổng số dòng = 308 (không copy món 2 khu sang 2 file)", zoneSum === TOTAL, `(${zoneCounts.join("+")}=${zoneSum})`);
const zoneIds = zoneItems.map((i) => i[0]);
check("không trùng id giữa 5 file by-zone", new Set(zoneIds).size === TOTAL, `(${TOTAL} id duy nhất, 0 trùng)`);
const filterCounts = Object.fromEntries(zoneFiles.map((d) => [d.zone, d.filterCount]));
check(
  "by-zone filterCount: newspace 146, beergarden 135, drinks 65, combo 54, cocktail 17",
  filterCounts.newspace === 146 && filterCounts.beergarden === 135 && filterCounts.drinks === 65 && filterCounts.combo === 54 && filterCounts.cocktail === 17,
  `(${JSON.stringify(filterCounts)})`
);

// 9-12. Menu mở rộng và 108 món cũ
const sandbox = { window: {}, console };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(tuplesFile, sandbox);
vm.runInContext(read("js/menu-data.js"), sandbox);
const M = sandbox.window.__MENU__;
check(`menu-data.js mở rộng = ${TOTAL} món + alias window.MENU_ITEMS`,
  M.length === TOTAL && sandbox.window.MENU_ITEMS === M);
const hash = crypto.createHash("sha256").update(JSON.stringify(M)).digest("hex");
check("SHA-256 menu hợp nhất 2026 (ghi nhận, để đối chiếu lần sau)", hash === MERGED_SHA256, `(sha256 ${hash.slice(0, 12)}…)`);
const byId = new Map(M.map((x) => [x.id, x]));
const oldPresent = OLD_IDS.every((id) => byId.has(id));
const priceOk = Object.entries(PRICE_CHANGES).every(([id, p]) => byId.get(id)?.price === p);
check("108 món cũ vẫn đủ (theo id) và chỉ 4 món đổi giá theo PDF 2026",
  oldPresent && priceOk,
  `(108/108 id cũ có mặt; hs3/cm2/cl3/d1 đúng giá PDF)`);
check("món đầu = Gà Tre Hấp Lá Chanh 319K, món cuối = Thuốc Lá Gói 120K, Dom Pérignon Vintage vẫn có",
  M[0]?.name === "Gà Tre Hấp Lá Chanh" && M[0]?.price === "319K" &&
  M[TOTAL - 1]?.name === "Thuốc Lá Gói" && byId.has("d19"));
const catCount = {};
M.forEach((x) => { catCount[x.category] = (catCount[x.category] || 0) + 1; });
check("Combo tách 2 tab: Combo 10 món, Combo Rượu 44 set; Đùi Vịt Rút Xương giá trống",
  catCount["Combo"] === 10 && catCount["Combo Rượu"] === 44 &&
  byId.get("dq15")?.name === "Đùi Vịt Rút Xương Sốt Hồng Xíu" && byId.get("dq15")?.price === "",
  `(Combo ${catCount["Combo"]}, Combo Rượu ${catCount["Combo Rượu"]}, dq15 giá "${byId.get("dq15")?.price}")`);
check("priceRaw được khôi phục = price", M.every((x) => x.priceRaw === x.price), `(${TOTAL}/${TOTAL} món)`);

// 13-15. Bộ lọc tab (logic y hệt main.js: lọc theo zone, rồi theo category)
const filter = (tab) =>
  M.filter((z) => {
    if (tab === "ALL") return true;
    const map = { NEWSPACE: "newspace", BEERGARDEN: "beergarden", COMBO: "combo", COCKTAIL: "cocktail", DRINKS: "drinks" };
    return z.zone.includes(map[tab]);
  }).length;
check("tab ALL = 308, NEWSPACE = 146", filter("ALL") === TOTAL && filter("NEWSPACE") === 146, `(${filter("ALL")}, ${filter("NEWSPACE")})`);
check("tab BEERGARDEN = 135, COMBO = 54", filter("BEERGARDEN") === 135 && filter("COMBO") === 54, `(${filter("BEERGARDEN")}, ${filter("COMBO")})`);
check("tab COCKTAIL = 17, DRINKS = 65", filter("COCKTAIL") === 17 && filter("DRINKS") === 65, `(${filter("COCKTAIL")}, ${filter("DRINKS")})`);

// 16-19. Bundle, index, clips, CSS, Pi
const main = read("js/main.js");
check("main.js: không còn mảng SZ, có patch window.__MENU__, còn tab jZ/DZ; chatbot 308 món, có tab Combo Rượu",
  !main.includes("Gà Tre Hấp Lá Chanh") && main.includes("var SZ=window.__MENU__||[]") && main.includes("TẤT CẢ") && main.includes("NEWSPACE EMBER") &&
  main.includes('"Combo Rượu"') && main.includes("Tầng 2 Menu: 308 món") && main.includes("menu nhà em có 308 món") && !main.includes("108 món"));
const html = read("index.html");
const clipsVideos = (html.match(/<video[^>]*>/g) || []).length;
check("index.html: load menu-items.js + menu-data.js TRƯỚC main.js; có div #clips-5s với 4 video",
  html.indexOf("data/menu-items.js") !== -1 &&
    html.indexOf("data/menu-items.js") < html.indexOf("js/main.js") &&
    html.indexOf("js/menu-data.js") < html.indexOf("js/main.js") &&
    html.includes('id="clips-5s"') &&
    clipsVideos === 4 &&
    existsSync(new URL("js/clips.js", root)),
  `(${clipsVideos} video trong #clips-5s)`);
check("style.css đã bỏ (không còn ở root hay css/)",
  !existsSync(new URL("style.css", root)) && !existsSync(new URL("css/style.css", root)));
const a2u = read("api/a2u.js");
const pay = read("js/pay.js");
const pisdk = read("js/pi-sdk.js");
const hasHardcodedKey =
  /PI_API_KEY\s*=\s*["'][^"']{8,}["']/.test(a2u) || /["'][0-9a-f]{20,}["']/.test(a2u);
check("Pi: a2u.js đọc process.env.PI_API_KEY, không key hardcode; pay.js không chứa key; pi-sdk.js sandbox:false, chỉ PiBrowser",
  a2u.includes("process.env.PI_API_KEY") && !hasHardcodedKey &&
    !/process\.env\.PI_API_KEY\s*=/.test(pay) && !/["'][0-9a-f]{20,}["']/.test(pay) &&
    pisdk.includes("sandbox: false") && pisdk.includes("PiBrowser"));

if (fail) { console.error(`\n${fail}/${n} kiểm tra FAIL`); process.exit(1); }
console.log(`\nTất cả ${n} kiểm tra PASS.`);
