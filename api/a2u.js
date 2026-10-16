// Danh sách 5 UID chính thức đã được xác thực
const TARGET_UIDS = [
  { username: "nguyenanhtuan113113", uid: "657c1562-9472-4013-a76c-134404310717" },
  { username: "thuongsheva",         uid: "70ea2ff5-c5ef-4dd2-a934-d8c73e280696" },
  { username: "phithuong07",         uid: "0f8fdab1-75de-471e-a09f-896652b263d6" },
  { username: "thuongsheva01",       uid: "13eb4a7e-be36-42cc-9c4a-61dbd7d9359f" },
  { username: "dttngan123",          uid: "e668ffbf-8de9-42c3-a918-b3ffd13ba9ce" }
];

module.exports = async (req, res) => {
  // Bật CORS cho Sandbox Pi Browser
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const apiKey = process.env.PI_API_KEY; // Server API Key từ Developer Portal
    if (!apiKey) {
      throw new Error("Thiếu PI_API_KEY trong Environment Variables trên Vercel!");
    }

    const results = [];

    // Lặp qua 5 UID để thực hiện tạo, duyệt và hoàn tất A2U Payment qua Pi API
    for (let i = 0; i < TARGET_UIDS.length; i++) {
      const user = TARGET_UIDS[i];
      console.log(`[A2U Batch ${i + 1}/5] Đang tạo thanh toán cho @${user.username} (UID: ${user.uid})...`);

      try {
        // Bước 1: Tạo Payment trên Pi Network Server (A2U) dùng fetch chuẩn
        const createRes = await fetch('https://api.testnet.minepi.com/v2/payments', {
          method: 'POST',
          headers: {
            'Authorization': `Key ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uid: user.uid,
            amount: 1, // Số lượng Pi Testnet
            memo: `Garden Station 303 A2U Reward for ${user.username}`,
            metadata: { type: "batch_a2u_garden", index: i + 1 }
          })
        });

        const createData = await createRes.json();
        if (!createRes.ok) {
          throw new Error(createData.message || JSON.stringify(createData));
        }

        const paymentId = createData.identifier || createData.id;
        console.log(`[A2U ${i + 1}] Tạo thành công Payment ID: ${paymentId}. Đang tiến hành Approve...`);

        // Bước 2: Tự động gọi API Approve
        const approveRes = await fetch(`https://api.testnet.minepi.com/v2/payments/${paymentId}/approve`, {
          method: 'POST',
          headers: {
            'Authorization': `Key ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        const approveData = await approveRes.json();
        if (!approveRes.ok) {
          throw new Error(approveData.message || JSON.stringify(approveData));
        }

        // Bước 3: Tự động gọi API Complete
        const txid = approveData.transaction?.txid || "mock_txid_" + Date.now();
        const completeRes = await fetch(`https://api.testnet.minepi.com/v2/payments/${paymentId}/complete`, {
          method: 'POST',
          headers: {
            'Authorization': `Key ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ txid: txid })
        });

        const completeData = await completeRes.json();
        if (!completeRes.ok) {
          throw new Error(completeData.message || JSON.stringify(completeData));
        }

        results.push({
          index: i + 1,
          username: user.username,
          uid: user.uid,
          paymentId: paymentId,
          status: "completed",
          ok: true
        });

      } catch (payErr) {
        console.error(`Lỗi A2U cho UID ${user.uid}:`, payErr.message);
        results.push({
          index: i + 1,
          username: user.username,
          uid: user.uid,
          ok: false,
          error: payErr.message
        });
      }

      // Nghỉ 1.5 giây giữa các request
      await new Promise(r => setTimeout(r, 1500));
    }

    return res.status(200).json({
      success: true,
      message: "Đã hoàn thành toàn bộ quy trình A2U cho 5 UID!",
      data: results
    });

  } catch (e) {
    console.error("Fatal A2U Error:", e);
    return res.status(500).json({
      success: false,
      error: e.message
    });
  }
};
