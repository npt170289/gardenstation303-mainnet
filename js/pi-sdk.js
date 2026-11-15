// Pi SDK lazy-load CHỈ trong Pi Browser - MAINNET, sandbox: false
// Không load ở trình duyệt thường, không block trang: load bất đồng bộ sau khi trang xong.
(function () {
  var isPiBrowser = typeof navigator !== "undefined" && navigator.userAgent.indexOf("PiBrowser") !== -1;
  if (!isPiBrowser) return; // trình duyệt thường: không load Pi SDK
  function loadPiSdk() {
    if (window.Pi) return;
    var script = document.createElement("script");
    script.src = "https://sdk.minepi.com/pi-sdk.js";
    script.async = true;
    script.onload = function () {
      Pi.init({ version: "2.0", sandbox: false }); // MAINNET
      console.log("Pi SDK MAINNET initialized - App ID: garden-station-303-fdkp");
    };
    document.head.appendChild(script);
  }
  if (document.readyState !== "loading") loadPiSdk();
  else document.addEventListener("DOMContentLoaded", loadPiSdk);
})();
