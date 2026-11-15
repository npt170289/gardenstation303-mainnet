// 303 Garden Station - clips.js
// Chừa chỗ cho clip 5s: section #clips-5s, grid 4 video, nằm DƯỚI gallery, TRƯỚC menu.
// Vì sao cần file này: React render toàn bộ trang (gallery, video, menu) BÊN TRONG
// <div id="root">, nên một <section> viết cứng trong index.html không thể chui vào
// giữa gallery và menu được. index.html đặt sẵn <section id="clips-5s"> ngay sau
// #root; file này dời nó lên trước section MENU ("MENU 2 KHU...") ngay khi React
// render xong. Nếu React chưa render kịp, thử lại mỗi 500ms trong 10 giây.
// Không sửa gì trong js/main.js, không đổi giao diện: dùng đúng class Tailwind
// của section video sẵn có ("KHOẢNH KHẮC SÔI ĐỘNG"), chỉ khác grid 4 cột trên desktop.
// 4 video: public/videos/be-ao-den-nhay.mp4, be-dancer-ao-hong.mp4,
//          be-quan-trang.mp4, khach-vay-den-nhay.mp4
// (copy thư mục public/videos/ gốc của bạn vào đây; các file này không có trong
//  gói zip vì không nằm trong file bạn gửi lần trước.)
(function () {
  function placeClips() {
    var clips = document.getElementById("clips-5s");
    if (!clips) return true; // không có gì để dời
    var headings = document.querySelectorAll("h2");
    for (var i = 0; i < headings.length; i++) {
      if (headings[i].textContent.indexOf("MENU 2 KHU") !== -1) {
        var menuSection = headings[i].closest("section");
        if (menuSection && menuSection.previousElementSibling !== clips) {
          menuSection.parentNode.insertBefore(clips, menuSection);
        }
        return true; // đã đúng vị trí (dưới gallery, trước menu)
      }
    }
    return false; // React chưa render xong menu, thử lại sau
  }

  var tries = 0;
  var timer = setInterval(function () {
    tries++;
    if (placeClips() || tries >= 20) clearInterval(timer);
  }, 500);
  if (document.readyState !== "loading") placeClips();
  else document.addEventListener("DOMContentLoaded", placeClips);
  window.addEventListener("load", placeClips);
})();
