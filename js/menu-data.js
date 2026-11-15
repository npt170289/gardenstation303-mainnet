(function() {
  if (!window.__MENU_ITEMS__) window.__MENU_ITEMS__ = [];
  
  // Chuyển đổi tuple 5 phần thành object đầy đủ cho React
  var categories = [
    "Gà Tre", "Lai Rai", "Lúa Mạch", "Mực", "Tôm", "Hải Sản", 
    "Đồng Quê", "Cá", "Cơm Mì Miến", "Cháo Lẩu", "Combo", "Cocktail", "Drinks"
  ];

  window.__MENU__ = window.__MENU_ITEMS__.map(function(item) {
    return {
      id: item[0],
      name: item[1],
      price: item[2],
      priceRaw: item[2],
      category: categories[item[3]] || "Khác",
      zone: item[4]
    };
  });
})();