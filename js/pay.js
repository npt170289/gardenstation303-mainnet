// Frontend pay.js - calls /api/a2u.js
async function payGarden303(amount, uid, username) {
  try {
    const res = await fetch('/api/a2u', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, uid, username })
    });
    const data = await res.json();
    if (data.success) {
      console.log('A2U Payment created:', data.paymentId);
      // Pi SDK will handle approval
      if (window.Pi) {
        const payment = await Pi.createPayment({
          amount: amount,
          memo: `Garden 303 Mainnet to @${username}`,
          metadata: { target_uid: uid, paymentId: data.paymentId }
        }, {
          onReadyForServerApproval: (paymentId) => {
            console.log('Ready for approval:', paymentId);
          },
          onReadyForServerCompletion: (paymentId, txid) => {
            console.log('Payment completed:', paymentId, txid);
          },
          onCancel: (paymentId) => console.log('Cancelled:', paymentId),
          onError: (error, payment) => console.error('Error:', error)
        });
      }
    }
    return data;
  } catch (e) {
    console.error('Pay error:', e);
    return { error: e.message };
  }
}