// Garden Station 303 — Chat logger (fallback, Phase 1)
// Nhiệm vụ DUY NHẤT: ghi lịch sử chat vào Supabase qua /api/chats
// để huấn luyện AI. Không UI, không nút nổi, không Pi Payment,
// không gọi payGarden303, không gọi Pi SDK.
// Thông tin đúng: Hotline Mr Thành 0971363121 • Menu 270 món • Mở cửa 17:00-03:00
// (chỉ ghi trong comment — file này không có giao diện).
//
// Cách dùng (từ bất kỳ chỗ nào trong trang):
//   window.GardenChatLog(sessionId, userMessage, botReply)
//     → POST /api/chats, trả về true nếu lưu được, false nếu không.
// Chatbot chính vẫn là iframe Pi Studio:
//   https://onggialinhic5930.pinet.com (Published, Testnet, 7.5 Pi)

(function () {
  async function gardenChatLog(sessionId, userMessage, botReply) {
    try {
      if (!sessionId || !userMessage || !botReply) return false;
      var res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: String(sessionId),
          user_message: String(userMessage),
          bot_reply: String(botReply),
        }),
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  }

  window.GardenChatLog = gardenChatLog;
})();
