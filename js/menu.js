// Menu Garden 303 - fetch data/menu.json render dark cards
async function loadMenu() {
  try {
    const res = await fetch('./data/menu.json');
    const data = await res.json();
    const container = document.getElementById('menu-container');
    if (!container) return;
    
    let html = `<p class="text-[#9ca3af] text-[0.75rem] italic p-2">${data.caption}</p>`;
    html += `<p class="text-[#d4af37] text-[0.8rem] p-2">Hotline: ${data.hotline}</p>`;
    
    data.categories.forEach(cat => {
      html += `<h3 class="text-[#d4af37] text-[1.15rem] font-bold mt-4 p-2">${cat.name}</h3>`;
      html += `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">`;
      cat.items.forEach(item => {
        html += `
          <div class="bg-[#0f172a] border border-white/10 rounded- p-3">
            <p class="text-white text-[0.9rem]">${item.name}</p>
            <p class="text-[#d4af37] text-[0.85rem]">${item.price} <span class="text-[#6b7280] text-[0.65rem]">${item.vat}</span></p>
          </div>
        `;
      });
      html += `</div>`;
    });
    container.innerHTML = html;
  } catch (e) {
    console.error('Menu load error:', e);
  }
}
document.addEventListener('DOMContentLoaded', loadMenu);