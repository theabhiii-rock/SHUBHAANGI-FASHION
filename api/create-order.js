import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    return;
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    res.status(401).json({
      error: 'Razorpay authentication credentials are not configured on the server.'
    });
    return;
  }

  try {
    const { amount, currency = 'INR', receipt, notes } = req.body || {};
    const amountInPaise = Math.round(Number(amount));

    // Validate minimum amount >= 100 paise (₹1.00)
    if (!amountInPaise || Number.isNaN(amountInPaise) || amountInPaise < 100) {
      res.status(400).json({
        error: 'Invalid amount. Minimum order amount must be at least 100 paise (₹1.00).'
      });
      return;
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    const options = {
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {}
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt
    });
  } catch (err) {
    console.error('[Razorpay Create Order Error]:', err);

    if (err.statusCode === 401) {
      res.status(401).json({
        error: err.error?.description || 'Razorpay authentication failed. Invalid API credentials.'
      });
      return;
    }

    res.status(500).json({
      error: err.error?.description || err.message || 'Failed to create Razorpay order.'
    });
  }
}
