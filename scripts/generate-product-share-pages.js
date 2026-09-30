import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_PRODUCTS } from '../src/data/store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ORIGIN = 'https://shubhaangi.com';

function toAbsoluteImageUrl(imgUrl, forOg = false) {
  if (!imgUrl) return `${SITE_ORIGIN}/images/shubhaangi-official-logo.jpg`;
  if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
    if (forOg && imgUrl.includes('images.unsplash.com')) {
      // Force standard JPEG < 150KB for instant WhatsApp link preview rendering
      const baseUrl = imgUrl.split('?')[0];
      return `${baseUrl}?fm=jpg&fit=crop&q=75&w=720&h=900`;
    }
    return imgUrl;
  }
  return `${SITE_ORIGIN}${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildShareHtml({ product, primaryImgUrl, allGalleryUrls, fileName, angleIndex }) {
  const priceSummary = product.isRentalAvailable && product.rentPrice3Days
    ? `Rent: ₹${product.rentPrice3Days.toLocaleString('en-IN')} | Buy: ₹${(product.buyPrice || 0).toLocaleString('en-IN')}`
    : `Buy: ₹${(product.buyPrice || 0).toLocaleString('en-IN')}`;

  const angleSuffix = allGalleryUrls.length > 1 && angleIndex > 0
    ? ` (Lookbook Photo ${angleIndex + 1}/${allGalleryUrls.length})`
    : '';
  const title = `${product.name}${angleSuffix} — ${priceSummary} | SHUBHAANGI Studio`;
  const description = `${product.subCategory || product.category} • ${product.fabric || 'Handcrafted Bridal Couture'} (${product.color || 'Bespoke'}) • Free Custom Fitting by Designer Deepak Kumar. Tap to view all ${allGalleryUrls.length} photos!`;
  const sharePageUrl = `${SITE_ORIGIN}/p/${fileName}`;
  const redirectTarget = angleIndex > 0
    ? `/?product=${product.id}&photo=${angleIndex}`
    : `/?product=${product.id}`;

  const extraOgImages = allGalleryUrls
    .filter((u) => u !== primaryImgUrl)
    .slice(0, 3)
    .map((imgUrl) => `    <meta property="og:image" content="${escapeHtml(imgUrl)}" />`)
    .join('\n');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />

    <!-- Primary OpenGraph / WhatsApp Rich Product Photo Card -->
    <meta property="og:type" content="product" />
    <meta property="og:site_name" content="SHUBHAANGI — The Ultimate Bride" />
    <meta property="og:url" content="${escapeHtml(sharePageUrl)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(primaryImgUrl)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(primaryImgUrl)}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="720" />
    <meta property="og:image:height" content="900" />
    <meta property="og:image:alt" content="${escapeHtml(product.name)}" />
${extraOgImages ? extraOgImages + '\n' : ''}
    <!-- Twitter / Telegram Large Image Preview -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(primaryImgUrl)}" />

    <link rel="icon" type="image/jpeg" href="/images/shubhaangi-official-logo.jpg" />
    <style>
      body {
        margin: 0;
        background: #0a0a0a;
        color: #faf9f6;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 20px;
        box-sizing: border-box;
      }
      .card {
        max-width: 420px;
        width: 100%;
        background: #141414;
        border: 1px solid rgba(200, 169, 81, 0.35);
        border-radius: 8px;
        overflow: hidden;
        text-align: center;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
      }
      .img-wrap {
        width: 100%;
        height: 380px;
        background: #09090b;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .img-wrap img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
      .info {
        padding: 18px 20px 22px;
      }
      .badge {
        display: inline-block;
        font-size: 10px;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: #c8a951;
        margin-bottom: 6px;
      }
      h1 {
        font-size: 18px;
        margin: 0 0 8px;
        color: #fff;
      }
      .price {
        font-size: 14px;
        color: #c8a951;
        font-weight: 700;
        margin-bottom: 14px;
      }
      .btn {
        display: inline-block;
        background: #c8a951;
        color: #000;
        text-decoration: none;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        padding: 12px 24px;
        border-radius: 4px;
      }
    </style>
    <script>
      window.location.replace("${redirectTarget}");
    </script>
  </head>
  <body>
    <div class="card">
      <div class="img-wrap">
        <img src="${escapeHtml(primaryImgUrl)}" alt="${escapeHtml(product.name)}" />
      </div>
      <div class="info">
        <span class="badge">SHUBHAANGI COUTURE</span>
        <h1>${escapeHtml(product.name)}</h1>
        <div class="price">${escapeHtml(priceSummary)}</div>
        <a class="btn" href="${redirectTarget}">View Full Outfit &amp; All Photos</a>
      </div>
    </div>
  </body>
</html>
`;
}

const outDir = path.resolve(__dirname, '../public/p');
fs.mkdirSync(outDir, { recursive: true });

let totalGenerated = 0;
for (const product of INITIAL_PRODUCTS) {
  const defaultOgImg = toAbsoluteImageUrl(product.img, true);
  const galleryImgs = Array.isArray(product.images) && product.images.length > 0
    ? product.images.map((u) => toAbsoluteImageUrl(u, true))
    : [defaultOgImg];

  // Main product share page: /p/<id>.html
  const mainHtml = buildShareHtml({
    product,
    primaryImgUrl: galleryImgs[0] || defaultOgImg,
    allGalleryUrls: galleryImgs,
    fileName: `${product.id}.html`,
    angleIndex: 0
  });
  fs.writeFileSync(path.join(outDir, `${product.id}.html`), mainHtml, 'utf8');
  totalGenerated++;

  // Per-angle share pages: /p/<id>-1.html, /p/<id>-2.html, ...
  galleryImgs.forEach((angleImgUrl, idx) => {
    const angleFileName = `${product.id}-${idx + 1}.html`;
    const angleHtml = buildShareHtml({
      product,
      primaryImgUrl: angleImgUrl,
      allGalleryUrls: galleryImgs,
      fileName: angleFileName,
      angleIndex: idx
    });
    fs.writeFileSync(path.join(outDir, angleFileName), angleHtml, 'utf8');
    totalGenerated++;
  });
}

console.log(`Generated ${totalGenerated} WhatsApp OpenGraph product & angle share pages in public/p/`);
