const SUBSCRIBERS_KEY = 'shubhaangi_vip_subscribers';
const USER_SUB_KEY = 'shubhaangi_user_alert_sub';
const ALERTS_KEY = 'shubhaangi_broadcast_alerts';
const SEEN_ALERTS_KEY = 'shubhaangi_seen_alert_ids';

const DEFAULT_SUBSCRIBERS = [
  {
    id: 'sub-101',
    contact: 'priya.kapoor@gmail.com',
    name: 'Priya Kapoor',
    notifyNewDresses: true,
    notifyOffers: true,
    pushGranted: true,
    joinedAt: '28 Sep 2026'
  },
  {
    id: 'sub-102',
    contact: '+91 98114 77210',
    name: 'Aarti Malhotra',
    notifyNewDresses: true,
    notifyOffers: true,
    pushGranted: true,
    joinedAt: '29 Sep 2026'
  }
];

export function registerNotificationServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}

export function getStoredSubscribers() {
  try {
    const raw = localStorage.getItem(SUBSCRIBERS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_SUBSCRIBERS;
  } catch {
    return DEFAULT_SUBSCRIBERS;
  }
}

export function getUserAlertSubscription() {
  try {
    const raw = localStorage.getItem(USER_SUB_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isUserSubscribedToAlerts() {
  const sub = getUserAlertSubscription();
  if (sub && sub.subscribed) return true;
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted' && sub) {
    return true;
  }
  return false;
}

export async function triggerNativeNotification({
  title,
  body,
  image = '/images/shubhaangi-rani-pink-bridal-lehenga.jpg',
  url = '/',
  tag = `shubhaangi-${Date.now()}`
}) {
  // Also fire an in-app live alert toast so visitors ALWAYS see the notification even if OS DND is on
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('shubhaangi-live-alert', {
        detail: { id: tag, title, body, image, url, timestamp: Date.now() }
      })
    );
  }

  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission !== 'granted') return false;

  const options = {
    body,
    icon: '/images/shubhaangi-official-logo.jpg',
    badge: '/images/shubhaangi-official-logo.jpg',
    image,
    tag,
    renotify: true,
    data: { url }
  };

  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.showNotification) {
        await reg.showNotification(title, options);
        return true;
      }
    }
    const n = new Notification(title, options);
    n.onclick = () => {
      window.focus();
      if (url) window.location.href = url;
      n.close();
    };
    return true;
  } catch {
    return false;
  }
}

export async function subscribeUserToAlerts({
  contact = '',
  name = '',
  notifyNewDresses = true,
  notifyOffers = true
}) {
  registerNotificationServiceWorker();

  let permission = 'default';
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      permission = await Notification.requestPermission();
    } catch {
      permission = Notification.permission || 'default';
    }
  }

  const cleanContact = contact.trim() || 'Instant Browser Push Subscriber';
  const cleanName = name.trim() || 'VIP Bride';

  const newSub = {
    id: `sub-${Date.now()}`,
    contact: cleanContact,
    name: cleanName,
    notifyNewDresses,
    notifyOffers,
    pushGranted: permission === 'granted',
    subscribed: true,
    joinedAt: new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  };

  try {
    localStorage.setItem(USER_SUB_KEY, JSON.stringify(newSub));
    const current = getStoredSubscribers();
    const deduped = current.filter(
      (s) => s.contact.toLowerCase() !== cleanContact.toLowerCase()
    );
    localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify([newSub, ...deduped]));
  } catch (e) {
    console.warn(e);
  }

  // Send immediate welcome notification
  await triggerNativeNotification({
    title: '✨ SHUBHAANGI VIP Alerts Activated!',
    body: 'You will now get instant notifications whenever a new bridal dress is uploaded or a special offer goes live. Use code ROYAL10 for 10% OFF!',
    image: '/images/shubhaangi-rani-pink-bridal-lehenga.jpg',
    url: '/#catalog',
    tag: 'shubhaangi-welcome'
  });

  return { subscriber: newSub, permission };
}

export function getStoredBroadcastAlerts() {
  try {
    const raw = localStorage.getItem(ALERTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function markAlertSeen(alertId) {
  try {
    const raw = localStorage.getItem(SEEN_ALERTS_KEY);
    const seen = raw ? JSON.parse(raw) : [];
    if (!seen.includes(alertId)) {
      localStorage.setItem(SEEN_ALERTS_KEY, JSON.stringify([alertId, ...seen].slice(0, 50)));
    }
  } catch {}
}

export async function broadcastNewDressAlert(product) {
  if (!product) return;
  const priceSummary =
    product.isRentalAvailable && product.rentPrice3Days
      ? `Rent ₹${Number(product.rentPrice3Days).toLocaleString('en-IN')} | Buy ₹${Number(product.buyPrice || 0).toLocaleString('en-IN')}`
      : `Buy ₹${Number(product.buyPrice || 0).toLocaleString('en-IN')}`;

  const alertItem = {
    id: `alert-dress-${product.id || Date.now()}`,
    type: 'NEW_DRESS',
    title: `👗 New Bridal Drop: ${product.name}`,
    body: `Just uploaded at SHUBHAANGI Studio! ${priceSummary}. Tap to view full lookbook & book trial.`,
    image: product.img || '/images/shubhaangi-rani-pink-bridal-lehenga.jpg',
    url: `/?product=${product.id}`,
    productId: product.id,
    createdAt: Date.now()
  };

  try {
    const existing = getStoredBroadcastAlerts();
    localStorage.setItem(ALERTS_KEY, JSON.stringify([alertItem, ...existing].slice(0, 20)));
  } catch {}

  markAlertSeen(alertItem.id);
  await triggerNativeNotification({
    title: alertItem.title,
    body: alertItem.body,
    image: alertItem.image,
    url: alertItem.url,
    tag: alertItem.id
  });
}

export async function broadcastOfferAlert({ title, body, couponCode }) {
  const alertItem = {
    id: `alert-offer-${Date.now()}`,
    type: 'NEW_OFFER',
    title: title || `🎉 New Bridal Offer at SHUBHAANGI!`,
    body:
      body ||
      `Special bridal discount unlocked!${couponCode ? ` Use code ${couponCode} at checkout.` : ''}`,
    image: '/images/shubhaangi-antique-gold-tissue.jpg',
    url: '/#catalog',
    couponCode: couponCode || null,
    createdAt: Date.now()
  };

  try {
    const existing = getStoredBroadcastAlerts();
    localStorage.setItem(ALERTS_KEY, JSON.stringify([alertItem, ...existing].slice(0, 20)));
  } catch {}

  markAlertSeen(alertItem.id);
  await triggerNativeNotification({
    title: alertItem.title,
    body: alertItem.body,
    image: alertItem.image,
    url: alertItem.url,
    tag: alertItem.id
  });
}

export function checkUnseenBroadcastAlerts() {
  if (!isUserSubscribedToAlerts()) return;
  try {
    const alerts = getStoredBroadcastAlerts();
    if (!alerts.length) return;
    const rawSeen = localStorage.getItem(SEEN_ALERTS_KEY);
    const seen = rawSeen ? JSON.parse(rawSeen) : [];
    const unseen = alerts.find((a) => !seen.includes(a.id));
    if (unseen) {
      markAlertSeen(unseen.id);
      triggerNativeNotification({
        title: unseen.title,
        body: unseen.body,
        image: unseen.image,
        url: unseen.url,
        tag: unseen.id
      });
    }
  } catch {}
}
