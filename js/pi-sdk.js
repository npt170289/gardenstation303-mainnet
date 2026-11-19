// Pi SDK lazy-load CHỈ trong Pi Browser - MAINNET, sandbox: false
// Không load ở trình duyệt thường, không block trang: load bất đồng bộ sau khi trang xong.
//
// Pi Sign-In (Phase 1): Pi CHỈ dùng để định danh khách (pi_uid -> customers)
// và tính điểm thưởng. KHÔNG có luồng U2A thanh toán ở đây.
// Thanh toán chỉ VND (terms.html §2, privacy.html §3).
//   window.GardenPiAuth() -> { user, accessToken } | null (không throw, không block trang)
//   window.GardenPiUser  -> { uid, username } | null (sau khi đăng nhập thành công)
(function () {
  // Mặc định (ngoài Pi Browser hoặc SDK chưa load): luôn resolve null, không throw.
  window.GardenPiUser = null;
  window.GardenPiAuth = async function () {
    return null;
  };

  var isPiBrowser =
    typeof navigator !== "undefined" &&
    navigator.userAgent.indexOf("PiBrowser") !== -1;
  if (!isPiBrowser) return; // trình duyệt thường: không load Pi SDK

  // Định nghĩa Pi Sign-In thật sau khi Pi SDK sẵn sàng.
  function setupPiAuth() {
    if (!window.Pi) return;
    window.GardenPiAuth = async function () {
      try {
        if (!window.Pi) return null;
        var auth = await Pi.authenticate(
          ["username", "payments"],
          function (payment) {
            // Phase 1: không xử lý thanh toán ở đây — chỉ ghi log, không block.
            console.log(
              "Pi incomplete payment found (ignored in Phase 1):",
              payment && payment.identifier
            );
          }
        );
        if (auth && auth.user) {
          window.GardenPiUser = {
            uid: auth.user.uid,
            username: auth.user.username,
          };
          return { user: auth.user, accessToken: auth.accessToken };
        }
        return null;
      } catch (e) {
        return null;
      }
    };
  }

  function loadPiSdk() {
    if (window.Pi) {
      setupPiAuth();
      return;
    }
    var script = document.createElement("script");
    script.src = "https://sdk.minepi.com/pi-sdk.js";
    script.async = true;
    script.onload = function () {
      Pi.init({ version: "2.0", sandbox: false }); // MAINNET
      console.log("Pi SDK MAINNET initialized - App ID: garden-station-303-fdkp");
      setupPiAuth();
    };
    script.onerror = function () {
      console.log("Pi SDK failed to load - GardenPiAuth stays null.");
    };
    document.head.appendChild(script);
  }
  if (document.readyState !== "loading") loadPiSdk();
  else document.addEventListener("DOMContentLoaded", loadPiSdk);
})();
