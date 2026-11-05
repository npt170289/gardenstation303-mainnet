// Chatbot Garden 303 - Tier 1 direct chat free + Tier 2 Pi Payment
const CHATBOT_CONFIG = {
  link: 'https://onggialinhic5930.pinet.com',
  info: '17:00-03:00 • Hotline 0399 035 303 Mr Thương • Beer Garden + VIP Lounge + DJ & Dancer + PR Pro • Menu 108 món',
  floatingBtn: { size: '60px', bg: 'linear-gradient(135deg, #d4af37, #22c55e)', icon: '💬' }
};

function initChatbot() {
  // Tier 1: direct chat free - default, no Pi login
  const chatBtn = document.getElementById('chatbot-float');
  const modal = document.getElementById('chatbot-modal');
  if (chatBtn) {
    chatBtn.style.width = CHATBOT_CONFIG.floatingBtn.size;
    chatBtn.style.height = CHATBOT_CONFIG.floatingBtn.size;
    chatBtn.style.background = CHATBOT_CONFIG.floatingBtn.bg;
    chatBtn.innerHTML = CHATBOT_CONFIG.floatingBtn.icon;
  }
  // Tier 2: Pi Payment only when PAY clicked
  const payBtn = document.getElementById('chatbot-pay');
  if (payBtn) {
    payBtn.addEventListener('click', () => {
      const amount = 1;
      const uid = 'TARGET_UID'; // replace with actual TARGET_UIDS[0]
      const username = 'user';
      payGarden303(amount, uid, username);
    });
  }
  // Open modal with core info only
  if (modal) {
    const infoEl = modal.querySelector('.chatbot-info');
    if (infoEl) infoEl.textContent = CHATBOT_CONFIG.info;
  }
}
document.addEventListener('DOMContentLoaded', initChatbot);