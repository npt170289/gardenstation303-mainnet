// Mảnh ghép — hiệu ứng ráp ảnh gallery từ nhiều mảnh nhỏ bay vào.
// Chỉ áp cho ẢNH gallery (img public/images/gallery/*). Video gallery (#5) không chạm.
// Không sửa js/main.js, không chạm Pi SDK / chatbot / booking / A2U / menu.
// Cách chạy: React render gallery bên trong #root sau khi tải trang, nên file này
// theo dõi DOM bằng MutationObserver (cùng mẫu với js/clips.js) rồi ráp từng ảnh.
// - Desktop: 5 cột × 4 hàng = 20 mảnh; mobile (<640px): 4 × 3 = 12 mảnh.
// - Mỗi mảnh là div dùng chung ảnh gốc làm background, background-position theo ô,
//   tính theo đúng kiểu object-fit: cover (ảnh gallery đang dùng object-cover,
//   cao cố định 320px) nên không méo hình, không lệch khung.
// - Vào viewport (IntersectionObserver, rootMargin 80px) mới chạy, chỉ 1 lần.
//   Ảnh đã trong viewport lúc tải trang thì chạy ngay lúc tải.
// - Không có IntersectionObserver hoặc prefers-reduced-motion: hiện ảnh đủ, không hiệu ứng.
// - Ảnh lỗi tải: giữ nguyên ảnh gốc, không ráp.
(function () {
  var GALLERY_SRC = "public/images/gallery/";
  var DESKTOP_COLS = 5, DESKTOP_ROWS = 4;
  var MOBILE_COLS = 4, MOBILE_ROWS = 3;
  var MOBILE_MAX_W = 640;
  var STAGGER_MS = 38;      // lệch nhau giữa các mảnh
  var built = [];           // { wrap, img, tiles, cols, rows }

  function reducedMotion() {
    return window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function gridSize() {
    return window.innerWidth < MOBILE_MAX_W
      ? { cols: MOBILE_COLS, rows: MOBILE_ROWS }
      : { cols: DESKTOP_COLS, rows: DESKTOP_ROWS };
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  // Tính lại vị trí/kích thước các mảnh theo khung hiện tại (đúng object-cover).
  function layout(item) {
    if (item.done) return false;
    var wrap = item.wrap, img = item.img;
    var W = wrap.clientWidth, H = wrap.clientHeight;
    if (!W || !H || !img.naturalWidth || !img.naturalHeight) return false;
    // object-fit: cover — ảnh phủ kín khung, cắt phần thừa ở giữa.
    var scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    var bgW = img.naturalWidth * scale, bgH = img.naturalHeight * scale;
    var offX = (bgW - W) / 2, offY = (bgH - H) / 2;
    var tileW = W / item.cols, tileH = H / item.rows;
    for (var i = 0; i < item.tiles.length; i++) {
      var t = item.tiles[i];
      var c = i % item.cols, r = Math.floor(i / item.cols);
      t.style.width = tileW + "px";
      t.style.height = tileH + "px";
      t.style.left = c * tileW + "px";
      t.style.top = r * tileH + "px";
      t.style.backgroundSize = bgW + "px " + bgH + "px";
      t.style.backgroundPosition =
        (-(c * tileW - offX)) + "px " + (-(r * tileH - offY)) + "px";
    }
    return true;
  }

  // Ráp xong: gỡ các mảnh, hiện lại ảnh gốc (ảnh thật, không còn đường kẻ nối).
  function finish(item) {
    if (item.done) return;
    item.done = true;
    for (var i = 0; i < item.tiles.length; i++) {
      var t = item.tiles[i];
      if (t.parentNode) t.parentNode.removeChild(t);
    }
    item.tiles = [];
    item.wrap.classList.add("mg-done");
    item.wrap.classList.remove("mg-play", "mg-show");
  }

  function play(item) {
    if (item.played) return;
    item.played = true;
    if (reducedMotion() || !("IntersectionObserver" in window)) {
      finish(item);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.disconnect();
        item.wrap.classList.add("mg-play");
        setTimeout(function () { finish(item); }, item.maxDelay + 650);
      });
    }, { rootMargin: "80px 0px", threshold: 0.01 });
    io.observe(item.wrap);
  }

  function build(img) {
    if (!img || img.dataset.mgBuilt) return;
    if (!img.complete || !img.naturalWidth) {
      // Ảnh chưa tải xong: đợi load rồi ráp; lỗi thì giữ nguyên ảnh gốc.
      img.addEventListener("load", function onLoad() {
        img.removeEventListener("load", onLoad);
        build(img);
      });
      img.addEventListener("error", function onErr() {
        img.removeEventListener("error", onErr);
      });
      return;
    }
    img.dataset.mgBuilt = "1";
    var size = gridSize();
    var wrap = document.createElement("div");
    wrap.className = img.className + " mg-wrap";
    wrap.setAttribute("role", "img");
    if (img.alt) wrap.setAttribute("aria-label", img.alt);
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
    img.classList.add("mg-src");
    // Giữ đúng filter của ảnh gốc (brightness/contrast) trên từng mảnh.
    var filter = img.style.filter || "";
    var tiles = [];
    var total = size.cols * size.rows;
    var maxDelay = 0;
    for (var i = 0; i < total; i++) {
      var t = document.createElement("div");
      t.className = "mg-tile";
      t.setAttribute("aria-hidden", "true");
      t.style.backgroundImage = 'url("' + img.currentSrc + '")';
      if (filter) t.style.filter = filter;
      t.style.setProperty("--mg-dx", rand(-14, 14).toFixed(1) + "px");
      t.style.setProperty("--mg-dy", rand(-10, 10).toFixed(1) + "px");
      var delay = Math.round(i * STAGGER_MS + rand(0, 10));
      if (delay > maxDelay) maxDelay = delay;
      t.style.setProperty("--mg-delay", delay + "ms");
      wrap.appendChild(t);
      tiles.push(t);
    }
    var item = { wrap: wrap, img: img, tiles: tiles, cols: size.cols, rows: size.rows, played: false, maxDelay: maxDelay };
    built.push(item);
    if (!layout(item)) {
      // Khung chưa đo được (React vừa render): thử lại khung hình sau.
      requestAnimationFrame(function () { layout(item); });
    }
    play(item);
  }

  function galleryImages() {
    var heads = document.querySelectorAll("h2");
    for (var i = 0; i < heads.length; i++) {
      if (heads[i].textContent.indexOf("GALLERY") !== -1) {
        var sec = heads[i].closest("section");
        if (sec) return sec.querySelectorAll('img[src*="' + GALLERY_SRC + '"]');
      }
    }
    return document.querySelectorAll('img[src*="' + GALLERY_SRC + '"]');
  }

  var EXPECTED = 11; // GZ có 12 mục: 11 ảnh + 1 video (video không ráp)
  var observer = null;

  function scan() {
    var imgs = galleryImages();
    for (var i = 0; i < imgs.length; i++) build(imgs[i]);
    if (built.length >= EXPECTED && observer) {
      observer.disconnect();
      observer = null;
    }
  }

  // Đổi kích thước màn hình: tính lại vị trí mảnh cho khớp khung mới.
  var resizeTimer = null;
  window.addEventListener("resize", function () {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      for (var i = 0; i < built.length; i++) layout(built[i]);
    }, 150);
  });

  if ("MutationObserver" in window) {
    observer = new MutationObserver(scan);
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
  if (document.readyState !== "loading") scan();
  else document.addEventListener("DOMContentLoaded", scan);
  window.addEventListener("load", scan);
})();
