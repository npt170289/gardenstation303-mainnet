// 303 Garden Station - menu-data.js (2026 merged menu, 308 mon)
// Biến tuple 5 phần trong data/menu-items.js thành đúng hình dạng cũ:
//   { id, name, price, priceRaw, category, zone }
// để bộ lọc tab và chatbot chạy y như cũ. Load TRƯỚC js/main.js.
// Tuple 5 phan: [id, name, price, categoryIndex, zoneCode].
// window.MENU_ITEMS = window.__MENU__ (same array, no copy).
(function () {
  var tuples = window.__MENU_TUPLES__ || [];
  var cats = window.__MENU_CATEGORIES__ || [];
  var zones = window.__MENU_ZONES__ || {};
  window.__MENU__ = tuples.map(function (t) {
    // t=[id,name,price,categoryIndex,zoneCode] e.g. ["gt1","Gà Tre Hấp Lá Chanh","319K",0,"n"]
    var zoneCodes = String(t[4]).split("");
    return {
      id: t[0],
      name: t[1],
      price: t[2],
      priceRaw: t[2], // giữ lại để tương thích: priceRaw luôn bằng price
      category: cats[t[3]],
      zone: zoneCodes.map(function (c) { return zones[c]; })
    };
  });
  window.MENU_ITEMS = window.__MENU__; // alias: dữ liệu mở rộng, giống hệt __MENU__
})();
