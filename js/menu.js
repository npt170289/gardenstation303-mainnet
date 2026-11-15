// Menu Garden 303 - render từ data/menu.json (định dạng tuple 5 phần, đủ 108 món)
// Tuple 5 phần: [id, name, price, categoryIndex, zoneCode]
//   ví dụ: ["gt1", "Gà Tre Hấp Lá Chanh", "319K", 0, "n"]
// Giữ nguyên class Tailwind / màu như bản cũ: caption xám, hotline vàng #d4af37,
// tiêu đề danh mục vàng, card nền #0f172a, viền trắng mờ, tên trắng, giá vàng.
// Sửa 2 lỗi của bản cũ: (1) fetch './data/menu.json' nhưng file thật nằm sai chỗ,
// (2) class 'rounded-' bị gãy -> 'rounded-lg'. Không đổi bố cục, không bỏ món.
async function loadMenu() {
  try {
    const res = await fetch("./data/menu.json");
    const data = await res.json();
    const container = document.getElementById("menu-container");
    if (!container) return;

    const zoneName = { n: "newspace", b: "beergarden", d: "drinks", c: "combo", k: "cocktail" };
    let html = `<p class="text-[#9ca3af] text-[0.75rem] italic p-2">${data.caption}</p>`;
    html += `<p class="text-[#d4af37] text-[0.8rem] p-2">Hotline: ${data.hotline}</p>`;

    // data.categories[].items[] = [id, name, price, categoryIndex, zoneCode] (tuple 5 phần)
    data.categories.forEach((cat) => {
      html += `<h3 class="text-[#d4af37] text-[1.15rem] font-bold mt-4 p-2">${cat.name}</h3>`;
      html += `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">`;
      cat.items.forEach((item) => {
        const [id, name, price] = item; // phần 4 (categoryIndex) và 5 (zoneCode) không cần render ở đây
        html += `
          <div class="bg-[#0f172a] border border-white/10 rounded-lg p-3" data-id="${id}">
            <p class="text-white text-[0.9rem]">${name}</p>
            <p class="text-[#d4af37] text-[0.85rem]">${price} <span class="text-[#6b7280] text-[0.65rem]">${data.vat}</span></p>
          </div>
        `;
      });
      html += `</div>`;
    });
    container.innerHTML = html;
  } catch (e) {
    console.error("Menu load error:", e);
  }
}
document.addEventListener("DOMContentLoaded", loadMenu);
