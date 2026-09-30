/**
 * Online Payment Checkout Helper
 * Implements:
 * 1. Dynamic SDK script verification (https://checkout.razorpay.com/v1/checkout.js)
 * 2. Backend Order Creation (POST /api/create-order)
 * 3. Payment Modal Launch & Event Handling (modal.ondismiss, payment.failed)
 * 4. Backend HMAC-SHA256 Signature Verification (POST /api/verify-payment)
 * 5. Graceful fallback for static hosts (e.g., GitHub Pages) when /api/* returns 404/405
 */

export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Initiates Online Payment Checkout flow
 */
export async function initiateRazorpayPayment({
  amountInRupees,
  receipt,
  customerName,
  customerPhone,
  description,
  onSuccess,
  onDismiss,
  onError
}) {
  try {
    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!keyId) {
      throw new Error('Online payment gateway is not configured. Please contact studio support.');
    }

    const amountInPaise = Math.round(Number(amountInRupees) * 100);
    if (!amountInPaise || amountInPaise < 100) {
      throw new Error('Minimum payable amount must be at least ₹1.00.');
    }

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded || !window.Razorpay) {
      throw new Error('Failed to load secure payment gateway. Please check your internet connection.');
    }

    // STEP 1: Call Backend to Create Order (POST /api/create-order)
    let orderData = null;
    let useBackendOrder = false;

    try {
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: receipt || `rcpt_${Date.now()}`
        })
      });

      const contentType = orderRes.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        orderData = await orderRes.json();
        if (!orderRes.ok) {
          throw new Error(orderData?.error || `Failed to initialize order (Status ${orderRes.status}).`);
        }
        if (orderData?.order_id) {
          useBackendOrder = true;
        }
      } else if (orderRes.status !== 404 && orderRes.status !== 405) {
        throw new Error(`Unable to initialize payment order (Status ${orderRes.status}).`);
      }
    } catch (fetchErr) {
      if (
        fetchErr.message &&
        !fetchErr.message.includes('Failed to fetch') &&
        !fetchErr.message.includes('NetworkError')
      ) {
        throw fetchErr;
      }
    }

    // STEP 2: Configure & Open Payment Modal
    const options = {
      key: keyId,
      amount: useBackendOrder ? orderData.amount : amountInPaise,
      currency: useBackendOrder ? (orderData.currency || 'INR') : 'INR',
      name: 'SHUBHAANGI — The Ultimate Bride',
      description: description || 'Bridal Couture Booking & Escrow Deposit',
      image: '/images/shubhaangi-official-logo.jpg',
      ...(useBackendOrder ? { order_id: orderData.order_id } : {}),
      prefill: {
        name: customerName || '',
        contact: customerPhone ? customerPhone.replace(/[^0-9+]/g, '') : ''
      },
      theme: {
        color: '#c8a951'
      },
      modal: {
        ondismiss: () => {
          if (onDismiss) {
            onDismiss('Payment was cancelled. Your outfits are still saved in your bag — you can retry anytime.');
          }
        }
      },
      // STEP 3: On Success -> Verify Signature on Backend when order_id is present
      handler: async (response) => {
        try {
          const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature
          } = response;

          if (useBackendOrder) {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.verified) {
              if (onError) {
                onError(verifyData?.error || 'Payment verification failed. Order not marked as paid.');
              }
              return;
            }
          }

          if (onSuccess) {
            onSuccess({
              paymentId: razorpay_payment_id,
              orderId: razorpay_order_id || receipt || `SHB_ONLINE_${Date.now()}`,
              signature: razorpay_signature || null
            });
          }
        } catch (verifyErr) {
          if (onError) {
            onError(verifyErr.message || 'Error verifying payment status.');
          }
        }
      }
    };

    const rzp = new window.Razorpay(options);

    // Handle payment.failed event
    rzp.on('payment.failed', (failureResponse) => {
      const errDesc =
        failureResponse?.error?.description ||
        failureResponse?.error?.reason ||
        'Payment could not be completed. Please try again with UPI, Card, or NetBanking.';
      if (onError) {
        onError(errDesc);
      }
    });

    rzp.open();
  } catch (err) {
    if (onError) {
      onError(err.message || 'Unable to start online payment.');
    }
  }
}
