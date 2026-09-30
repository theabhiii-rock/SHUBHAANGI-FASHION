const PUBLIC_SITE_ORIGIN = 'https://shubhaangi.com';
export const STUDIO_WHATSAPP_NUMBER = '916397799514';

/**
 * Returns a publicly reachable absolute URL for any product image
 * so WhatsApp servers can always fetch & display the photo.
 */
export function getPublicImageUrl(imgUrl) {
  if (!imgUrl) return '';
  if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
    return imgUrl;
  }
  return `${PUBLIC_SITE_ORIGIN}${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
}

/**
 * Returns the dedicated OpenGraph HTML share URL for a product (and specific lookbook angle).
 * IMPORTANT: Placing this URL as the FIRST link in a WhatsApp message makes WhatsApp
 * automatically display the large Product Photo Card preview at the top of the chat bubble.
 */
export function getProductRichShareUrl(product, activeAngleIndex = 0) {
  if (!product?.id) return PUBLIC_SITE_ORIGIN;
  const numericId = Number(product.id);
  // Pre-rendered static OpenGraph pages exist for catalog products 1..12
  if (numericId >= 1 && numericId <= 12) {
    if (activeAngleIndex > 0) {
      return `${PUBLIC_SITE_ORIGIN}/p/${numericId}-${activeAngleIndex + 1}.html`;
    }
    return `${PUBLIC_SITE_ORIGIN}/p/${numericId}.html`;
  }
  return `${PUBLIC_SITE_ORIGIN}/?product=${encodeURIComponent(product.id)}`;
}

/**
 * Returns all unique public image URLs for a product's gallery.
 */
export function getProductGalleryUrls(product) {
  if (!product) return [];
  const rawList =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.img].filter(Boolean);
  return Array.from(new Set(rawList.map(getPublicImageUrl).filter(Boolean)));
}

/**
 * Builds a rich WhatsApp inquiry message where:
 * 1. The OpenGraph Product Share URL is the FIRST URL in the text -> triggers WhatsApp's Large Photo Card Preview!
 * 2. All individual product photo links (Selected Photo + All Lookbook Angles) are also included below.
 */
export function buildProductWhatsAppMessage({
  product,
  activeAngleIndex = 0,
  modeText = '',
  priceText = '',
  isFitting = false,
  customNote = ''
}) {
  const shareUrl = getProductRichShareUrl(product, activeAngleIndex);
  const galleryUrls = getProductGalleryUrls(product);
  const selectedPhotoUrl = galleryUrls[activeAngleIndex] || galleryUrls[0] || getPublicImageUrl(product?.img);

  const defaultPriceText =
    priceText ||
    `Buy: ₹${(product?.buyPrice || 0).toLocaleString('en-IN')}${
      product?.rentPrice3Days ? ` | Rent: ₹${product.rentPrice3Days.toLocaleString('en-IN')} (3 Days)` : ''
    }`;

  let msg = '';
  // 1. Put the Rich Photo Preview Link FIRST so WhatsApp attaches the product photo card
  msg += `🔗 *Product Preview & Photo Card:*\n${shareUrl}\n\n`;

  if (isFitting) {
    msg += `✨ *CUSTOM FITTING COMMISSION — SHUBHAANGI COUTURE* ✨\n`;
    msg += `👤 *Designer:* Deepak Kumar (Lead Designer)\n\n`;
  } else {
    msg += `✨ *BRIDAL INQUIRY — SHUBHAANGI STUDIO* ✨\n\n`;
  }

  msg += `👗 *Dress / Outfit:* ${product?.name || 'Bridal Creation'}\n`;
  if (product?.subCategory || product?.category) {
    msg += `🏷️ *Category:* ${product.subCategory || product.category}\n`;
  }
  if (product?.color) {
    msg += `🎨 *Color:* ${product.color}\n`;
  }
  if (product?.fabric) {
    msg += `🧵 *Fabric & Craft:* ${product.fabric}\n`;
  }
  msg += `📏 *Size:* FREE SIZE (Custom Alteration Available)\n`;
  if (modeText) {
    msg += `✨ *Option:* ${modeText}\n`;
  }
  msg += `💰 *Pricing:* ${defaultPriceText}\n\n`;

  // 2. Include Direct Photo Links for Selected Angle + Full Gallery
  if (selectedPhotoUrl) {
    msg += `📸 *Selected Product Photo${galleryUrls.length > 1 ? ` (Angle ${activeAngleIndex + 1}/${galleryUrls.length})` : ''}:*\n${selectedPhotoUrl}\n`;
  }
  if (galleryUrls.length > 1) {
    msg += `\n🖼️ *All Product Photos (${galleryUrls.length} Angles):*\n`;
    galleryUrls.forEach((url, idx) => {
      msg += `• Photo ${idx + 1}: ${url}\n`;
    });
  }

  msg += `\n${
    customNote ||
    (isFitting
      ? `✂️ *Client Message:* "Hello Deepak Sir! Mujhe is dress ka custom fitting / alteration karana hai. Kripya measurements aur fitting schedule guide karein."`
      : `Hello Deepak Sir & Shubhaangi Team! I would like to discuss this outfit, custom fitting, and confirm bridal trial availability.`)
  }`;

  return msg;
}

export function openProductWhatsAppChat(options) {
  const msg = buildProductWhatsAppMessage(options);
  window.open(
    `https://wa.me/${STUDIO_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
    '_blank'
  );
}
