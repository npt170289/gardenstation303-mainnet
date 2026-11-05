// Pi SDK lazy-load only in Pi Browser - MAINNET
if (navigator.userAgent.includes('PiBrowser') || window.Pi) {
  const script = document.createElement('script');
  script.src = 'https://sdk.minepi.com/pi-sdk.js';
  script.onload = () => {
    Pi.init({ version: "2.0", sandbox: false });
    console.log('Pi SDK MAINNET initialized - App ID: garden-station-303-fdkp');
  };
  document.head.appendChild(script);
}