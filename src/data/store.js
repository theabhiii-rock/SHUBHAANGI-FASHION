import { saveToVault, getFromVault } from '../utils/imageUpload.js';

// Initial catalog with Buy and Rent pricing
export const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Gulabi Noor — Rani Pink Heritage Zardozi Lehenga',
    category: 'DRESS',
    subCategory: 'Bridal Lehenga',
    buyPrice: 185000,
    rentPrice3Days: 18500,
    rentPrice7Days: 28000,
    deposit: 20000,
    isRentalAvailable: true,
    description: 'Signature SHUBHAANGI bridal lehenga in rich rani pink raw silk featuring intricate antique gold zardozi, kundan needlework, and paired with an emerald green statement necklace set.',
    fabric: 'Pure Raw Silk & Antique Zari with Handcrafted Emerald Choker',
    color: 'Rani Pink & Emerald Green',
    img: '/images/shubhaangi-rani-pink-bridal-lehenga.jpg',
    images: [
      '/images/shubhaangi-rani-pink-bridal-lehenga.jpg',
      'https://images.unsplash.com/photo-1583391733958-d1531118c728?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1200'
    ],
    availableSizes: ['FREE SIZE'],
    isFeatured: true,
    rating: 5.0,
    reviewCount: 48,
    reviewsCount: 48
  },
  {
    id: 2,
    name: 'Zar-e-Khaas — Antique Gold Tissue Couture Set',
    category: 'DRESS',
    subCategory: 'Reception & Sangeet',
    buyPrice: 145000,
    rentPrice3Days: 14500,
    rentPrice7Days: 22000,
    deposit: 15000,
    isRentalAvailable: true,
    description: 'Exclusive couture ensemble in luminous antique gold tissue silk with chevron cutwork, metallic sequin sleeves, and traditional kundan earrings.',
    fabric: 'Tissue Silk & Fine Zardozi Needlework',
    color: 'Antique Gold & Champagne',
    img: '/images/shubhaangi-antique-gold-tissue.jpg',
    images: [
      '/images/shubhaangi-antique-gold-tissue.jpg',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200'
    ],
    availableSizes: ['FREE SIZE'],
    isFeatured: true,
    rating: 4.9,
    reviewCount: 36,
    reviewsCount: 36
  },
  {
    id: 3,
    name: 'Rose Quartz — Mauve Shimmer Flared Reception Gown',
    category: 'DRESS',
    subCategory: 'Cocktail & Reception',
    buyPrice: 125000,
    rentPrice3Days: 12500,
    rentPrice7Days: 19000,
    deposit: 15000,
    isRentalAvailable: true,
    description: 'Contemporary fairy-tale flared bridal gown in soft mauve-lilac adorned with thousands of light-catching crystal sequins and diamond jewellery accents.',
    fabric: 'Metallic Shimmer Tulle & Crystal Organza',
    color: 'Lilac Mauve & Rose Quartz',
    img: '/images/shubhaangi-mauve-shimmer-gown.jpg',
    images: [
      '/images/shubhaangi-mauve-shimmer-gown.jpg',
      'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200'
    ],
    availableSizes: ['FREE SIZE'],
    isFeatured: true,
    rating: 5.0,
    reviewCount: 42,
    reviewsCount: 42
  },
  {
    id: 4,
    name: 'Royal Baingani — Deep Plum Sequin Cape & Flared Set',
    category: 'DRESS',
    subCategory: 'Indo-Western & Sangeet',
    buyPrice: 95000,
    rentPrice3Days: 9500,
    rentPrice7Days: 15000,
    deposit: 10000,
    isRentalAvailable: true,
    description: 'Vibrant deep royal plum pleated skirt paired with an opulent longline embroidered sequin jacket cape. Ideal for Sangeet night and festive celebrations.',
    fabric: 'Silk Georgette, Velvet Accents & Dual-Tone Micro Sequins',
    color: 'Deep Plum & Radiant Violet',
    img: '/images/shubhaangi-royal-plum-cape.jpg',
    images: [
      '/images/shubhaangi-royal-plum-cape.jpg',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200'
    ],
    availableSizes: ['FREE SIZE'],
    isFeatured: true,
    rating: 4.9,
    reviewCount: 31,
    reviewsCount: 31
  },
  {
    id: 5,
    name: 'Royal Jadau Polki Bridal Set',
    category: 'JEWELLERY',
    subCategory: 'Polki Masterpiece',
    buyPrice: 125000,
    rentPrice3Days: 12500,
    rentPrice7Days: 19000,
    deposit: 15000,
    isRentalAvailable: true,
    description: 'Traditional Bikaneri Jadau Polki masterpiece set. Includes grand necklace, mathapatti, nath, and haathphool.',
    fabric: 'Fine Polki & Natural Pearls',
    color: 'Antique Polki & Gold',
    img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000'
    ],
    availableSizes: ['Free Size'],
    isFeatured: false,
    rating: 5.0,
    reviewCount: 29
  },
  {
    id: 6,
    name: 'Champagne Tissue Saree with Zari',
    category: 'DRESS',
    subCategory: 'Reception Drape',
    buyPrice: 65000,
    rentPrice3Days: 7500,
    rentPrice7Days: 12000,
    deposit: 8000,
    isRentalAvailable: true,
    description: 'Sheer champagne tissue silk saree with woven silver zari and embroidered scalloped cutwork borders.',
    fabric: 'Pure Tissue Silk',
    color: 'Champagne Metallic',
    img: 'https://images.unsplash.com/photo-1583391733958-d1531118c728?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1583391733958-d1531118c728?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000'
    ],
    availableSizes: ['FREE SIZE'],
    isFeatured: true,
    rating: 4.7,
    reviewCount: 22
  },
  {
    id: 7,
    name: 'Maharaja Embroidered Ivory Sherwani',
    category: 'DRESS',
    subCategory: 'Groom Couture',
    buyPrice: 95000,
    rentPrice3Days: 11000,
    rentPrice7Days: 17000,
    deposit: 12000,
    isRentalAvailable: true,
    description: 'Regal groom sherwani with intricate hand thread embroidery, matching stole, safa, and churidar.',
    fabric: 'Raw Silk Blend',
    color: 'Royal Ivory & Gold',
    img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000'
    ],
    availableSizes: ['FREE SIZE'],
    isFeatured: false,
    rating: 4.9,
    reviewCount: 31
  },
  {
    id: 8,
    name: 'Destination Reception Glam Session',
    category: 'MAKEUP',
    subCategory: 'Evening Glam',
    buyPrice: 18000,
    rentPrice3Days: null,
    rentPrice7Days: null,
    deposit: 0,
    isRentalAvailable: false,
    description: 'Contemporary glowy reception look with customized glitter cut-crease eye makeup and Hollywood wave hairstyling.',
    fabric: 'Airbrush & HD Finish',
    color: 'Glow Bronze & Rose',
    img: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1000'
    ],
    availableSizes: ['Single Bride Package'],
    isFeatured: false,
    rating: 4.8,
    reviewCount: 19
  },
  {
    id: 9,
    name: 'Royal Emerald Velvet Kalidar',
    category: 'DRESS',
    subCategory: 'Winter Wedding',
    buyPrice: 175000,
    rentPrice3Days: 17500,
    rentPrice7Days: 26000,
    deposit: 18000,
    isRentalAvailable: true,
    description: 'Deep royal emerald green micro velvet lehenga hand-embroidered with tilla ari, sitara, and cutwork borders.',
    fabric: 'Micro Velvet & Organza',
    color: 'Emerald Green & Gold',
    img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1583391733958-d1531118c728?auto=format&fit=crop&q=80&w=1000'
    ],
    availableSizes: ['FREE SIZE'],
    isFeatured: true,
    rating: 5.0,
    reviewCount: 27
  },
  {
    id: 10,
    name: 'Imperial Matha Patti & Nath Suite',
    category: 'JEWELLERY',
    subCategory: 'Bridal Headpiece',
    buyPrice: 48000,
    rentPrice3Days: 5500,
    rentPrice7Days: 8500,
    deposit: 6000,
    isRentalAvailable: true,
    description: 'Traditional multi-layered royal matha patti with pearls, polki motifs, and an antique rajasthani bridal nath.',
    fabric: 'Brass & Fine Pearl Beads',
    color: 'Antique Gold',
    img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000'
    ],
    availableSizes: ['FREE SIZE'],
    isFeatured: false,
    rating: 4.9,
    reviewCount: 34
  },
  {
    id: 11,
    name: 'Rose Gold Metallic Drape Saree',
    category: 'DRESS',
    subCategory: 'Cocktail Edit',
    buyPrice: 72000,
    rentPrice3Days: 8000,
    rentPrice7Days: 12500,
    deposit: 8000,
    isRentalAvailable: true,
    description: 'Sculpted pre-stitched cocktail saree with crystalline pallu embellishments and a structured corseted blouse.',
    fabric: 'Crepe & Metallic Tissue',
    color: 'Rose Gold',
    img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&q=80&w=1000'
    ],
    availableSizes: ['FREE SIZE'],
    isFeatured: false,
    rating: 4.8,
    reviewCount: 16
  },
  {
    id: 12,
    name: 'Nawabi Velvet Bandhgala Suit',
    category: 'DRESS',
    subCategory: 'Groom Reception',
    buyPrice: 82000,
    rentPrice3Days: 9500,
    rentPrice7Days: 15000,
    deposit: 10000,
    isRentalAvailable: true,
    description: 'Midnight navy velvet royal bandhgala jacket with monogrammed brass buttons and slim-fit trousers.',
    fabric: 'Pure Italian Velvet',
    color: 'Midnight Navy',
    img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1000'
    ],
    availableSizes: ['FREE SIZE'],
    isFeatured: false,
    rating: 4.9,
    reviewCount: 18
  }
];

// Initial mock orders & rental tracking records
export const INITIAL_ORDERS = [
  {
    id: 'SHB-8091',
    customerName: 'Pooja Sharma',
    phone: '+91 98112 34567',
    date: '17 Sep 2026',
    item: 'Regal Ivory Zardozi Lehenga',
    mode: 'RENT',
    duration: '3 Days',
    rentalDueDate: '20 Sep 2026',
    amount: 14500,
    deposit: 15000,
    status: 'ACTIVE_RENTAL', // PLACED | FITTING_SCHEDULED | DISPATCHED | ACTIVE_RENTAL | RETURN_PENDING | RETURNED | COMPLETED
    deliveryType: 'Studio Trial & Pick-up',
    paymentStatus: 'PAID'
  },
  {
    id: 'SHB-8092',
    customerName: 'Ananya Verma',
    phone: '+91 99580 88210',
    date: '16 Sep 2026',
    item: 'Heritage Kundan Choker Set',
    mode: 'RENT',
    duration: '7 Days',
    rentalDueDate: '23 Sep 2026',
    amount: 13000,
    deposit: 10000,
    status: 'ACTIVE_RENTAL',
    deliveryType: 'Insured Pan-India Courier',
    paymentStatus: 'PAID'
  },
  {
    id: 'SHB-8093',
    customerName: 'Megha Singhal',
    phone: '+91 98104 55421',
    date: '15 Sep 2026',
    item: 'Crimson Scarlet Heritage Lehenga',
    mode: 'RENT',
    duration: '3 Days',
    rentalDueDate: '18 Sep 2026',
    amount: 18000,
    deposit: 20000,
    status: 'RETURN_PENDING',
    deliveryType: 'Studio Trial & Pick-up',
    paymentStatus: 'PAID'
  },
  {
    id: 'SHB-8094',
    customerName: 'Rohan Malhotra',
    phone: '+91 98711 00293',
    date: '14 Sep 2026',
    item: 'Maharaja Embroidered Ivory Sherwani',
    mode: 'BUY',
    duration: 'Permanent',
    rentalDueDate: null,
    amount: 95000,
    deposit: 0,
    status: 'COMPLETED',
    deliveryType: 'Insured Pan-India Courier',
    paymentStatus: 'PAID'
  },
  {
    id: 'SHB-8095',
    customerName: 'Simran Kaur',
    phone: '+91 99100 44321',
    date: '12 Sep 2026',
    item: 'Champagne Tissue Saree with Zari',
    mode: 'RENT',
    duration: '3 Days',
    rentalDueDate: '15 Sep 2026',
    amount: 7500,
    deposit: 8000,
    status: 'RETURNED',
    deliveryType: 'Studio Trial & Pick-up',
    paymentStatus: 'DEPOSIT_REFUNDED'
  }
];

// Valid Promotional Coupons & Discount Offers
export const INITIAL_COUPONS = [
  {
    id: 'cpn-1',
    code: 'ROYAL10',
    type: 'PERCENTAGE',
    value: 10, // 10% off
    description: '10% Privilege Discount on Bridal Commissions',
    minSubtotal: 5000,
    isActive: true,
    validUntil: '31 Dec 2026',
    timesUsed: 42,
    badge: 'Trending'
  },
  {
    id: 'cpn-2',
    code: 'DELHIBEST',
    type: 'FLAT',
    value: 1500, // ₹1,500 off
    description: 'Flat ₹1,500 Courtesy Voucher for Delhi Brides',
    minSubtotal: 8000,
    isActive: true,
    validUntil: '30 Nov 2026',
    timesUsed: 28,
    badge: 'Delhi Special'
  },
  {
    id: 'cpn-3',
    code: 'SHUBHAANGI',
    type: 'FLAT',
    value: 2500,
    description: 'Flat ₹2,500 Atelier Welcome Gift on Orders Above ₹20,000',
    minSubtotal: 20000,
    isActive: true,
    validUntil: '31 Dec 2026',
    timesUsed: 65,
    badge: 'VIP Bridal'
  },
  {
    id: 'cpn-4',
    code: 'FESTIVE15',
    type: 'PERCENTAGE',
    value: 15,
    description: '15% Seasonal Festive Discount on Sangeet & Reception Gowns',
    minSubtotal: 15000,
    isActive: true,
    validUntil: '15 Nov 2026',
    timesUsed: 19,
    badge: 'Festive Special'
  }
];

export const PROMO_COUPONS = INITIAL_COUPONS;

export const INITIAL_OFFER_BANNER = {
  enabled: true,
  headline: '✨ FESTIVE BRIDAL EXCLUSIVE',
  text: 'Use code ROYAL10 for 10% Off on all bridal commissions | Complimentary Bespoke Fitting by Designer Deepak Kumar',
  badge: 'Limited Period',
  couponCode: 'ROYAL10'
};

export const getStoredCoupons = () => {
  try {
    const data = localStorage.getItem('shubhaangi_coupons_v1');
    return data ? JSON.parse(data) : INITIAL_COUPONS;
  } catch (e) {
    console.warn(e);
    return INITIAL_COUPONS;
  }
};

export const saveCoupons = (coupons) => {
  try {
    localStorage.setItem('shubhaangi_coupons_v1', JSON.stringify(coupons));
  } catch (e) {
    console.error(e);
  }
};

export const getStoredOfferBanner = () => {
  try {
    const data = localStorage.getItem('shubhaangi_offer_banner_v1');
    return data ? JSON.parse(data) : INITIAL_OFFER_BANNER;
  } catch (e) {
    console.warn(e);
    return INITIAL_OFFER_BANNER;
  }
};

export const saveOfferBanner = (banner) => {
  try {
    localStorage.setItem('shubhaangi_offer_banner_v1', JSON.stringify(banner));
  } catch (e) {
    console.error(e);
  }
};

// Verified Customer Reviews & Testimonials
export const CUSTOMER_REVIEWS = [
  {
    id: 1,
    clientName: 'Priyanka Sen',
    location: 'Laxmi Nagar, Delhi',
    weddingDate: 'Nov 2025',
    outfit: 'Gulabi Noor — Rani Pink Heritage Zardozi Lehenga',
    rating: 5,
    review: 'Renting my wedding lehenga from SHUBHAANGI was the best decision. The 3-day rental gave me complete peace of mind, and the in-studio alteration by Deepak Kumar gave a tailored 100% custom fit. My security deposit was refunded the very day I returned the outfit!',
    img: '/images/shubhaangi-rani-pink-bridal-lehenga.jpg'
  },
  {
    id: 2,
    clientName: 'Dr. Radhika Nair',
    location: 'Destination Wedding, Jaipur',
    weddingDate: 'Jan 2026',
    outfit: 'Rose Quartz — Mauve Shimmer Flared Reception Gown',
    rating: 5,
    review: 'The 7-day wedding rental option is a blessing for destination brides! The outfit arrived sanitized, pristine, and ready to wear. All my guests thought I spent 6 lakhs buying it. Truly unmatched Indian couture.',
    img: '/images/shubhaangi-mauve-shimmer-gown.jpg'
  },
  {
    id: 3,
    clientName: 'Kavita & Aditya Mehra',
    location: 'Chanakyapuri, Delhi',
    weddingDate: 'Feb 2026',
    outfit: 'Zar-e-Khaas — Antique Gold Tissue Couture Set',
    rating: 5,
    review: 'Ekta and Deepak helped us coordinate bride and groom looks together at their Laxmi Nagar studio. Direct WhatsApp ordering was smooth and effortless. 10/10 recommend to every couple!',
    img: '/images/shubhaangi-antique-gold-tissue.jpg'
  }
];

// Products persistence
export const getStoredProducts = () => {
  try {
    const data = localStorage.getItem('shubhaangi_products_v4');
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure all items have valid fields and images array
      return parsed.map(p => {
        const init = INITIAL_PRODUCTS.find(ip => ip.id === p.id);
        const category = (p.category || 'DRESS').toUpperCase();
        return {
          ...p,
          category,
          subCategory: p.subCategory || (category === 'JEWELLERY' ? 'Royal Jewellery' : (category === 'MAKEUP' ? 'Bridal Makeup' : 'Bridal Lehenga / Saree')),
          isRentalAvailable: p.isRentalAvailable ?? true,
          images: (p.images && p.images.length > 0) ? p.images : (init?.images || [p.img].filter(Boolean))
        };
      });
    }
    
    // Check v3 migration
    const oldData = localStorage.getItem('shubhaangi_products_v3');
    if (oldData) {
      const parsed = JSON.parse(oldData);
      const migrated = parsed.map(p => {
        const init = INITIAL_PRODUCTS.find(ip => ip.id === p.id);
        const category = (p.category || 'DRESS').toUpperCase();
        return {
          ...p,
          category,
          subCategory: p.subCategory || (category === 'JEWELLERY' ? 'Royal Jewellery' : (category === 'MAKEUP' ? 'Bridal Makeup' : 'Bridal Lehenga / Saree')),
          isRentalAvailable: p.isRentalAvailable ?? true,
          images: (p.images && p.images.length > 0) ? p.images : (init?.images || [p.img].filter(Boolean))
        };
      });
      try {
        localStorage.setItem('shubhaangi_products_v4', JSON.stringify(migrated));
        localStorage.removeItem('shubhaangi_products_v3');
      } catch {}
      return migrated;
    }

    return INITIAL_PRODUCTS;
  } catch (e) {
    console.warn('Error reading stored products:', e);
    return INITIAL_PRODUCTS;
  }
};

/**
 * Hydrates products from high-capacity IndexedDB vault in background
 */
export async function hydrateProductsFromVault(onHydrated) {
  try {
    const vaultProducts = await getFromVault('products');
    if (Array.isArray(vaultProducts) && vaultProducts.length > 0) {
      const current = getStoredProducts();
      // If vault has more products or newer products, sync and notify
      if (vaultProducts.length >= current.length) {
        try {
          localStorage.setItem('shubhaangi_products_v4', JSON.stringify(vaultProducts));
        } catch {}
        if (typeof onHydrated === 'function') {
          onHydrated(vaultProducts);
        }
      }
    }
  } catch (err) {
    console.warn('Vault hydration skipped:', err);
  }
}

export const saveProducts = (products) => {
  if (!Array.isArray(products)) return;
  try {
    // 1. Clean legacy keys to free browser storage
    try {
      localStorage.removeItem('shubhaangi_products_v3');
      localStorage.removeItem('shubhaangi_products_v2');
      localStorage.removeItem('shubhaangi_products');
    } catch {}

    // 2. Save to localStorage with graceful quota fallback
    try {
      localStorage.setItem('shubhaangi_products_v4', JSON.stringify(products));
    } catch (quotaErr) {
      console.warn('LocalStorage quota limit reached, saving optimized version...', quotaErr);
      // If quota exceeded, create an optimized version for localStorage
      const optimized = products.map(p => {
        const isBigImg = typeof p.img === 'string' && p.img.length > 200000;
        return {
          ...p,
          img: isBigImg ? p.img.slice(0, 80000) : p.img,
          images: (p.images || []).map(img => (typeof img === 'string' && img.length > 200000 ? img.slice(0, 80000) : img))
        };
      });
      try {
        localStorage.setItem('shubhaangi_products_v4', JSON.stringify(optimized));
      } catch (innerErr) {
        console.warn('Emergency storage compression applied:', innerErr);
      }
    }

    // 3. Save full uncompromised catalog to IndexedDB vault
    saveToVault('products', products).catch(err => console.warn('IDB products vault save skipped:', err));

    // 4. Dispatch real-time window & broadcast events for instant zero-refresh UI sync
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('shubhaangi_products_updated', { detail: products }));
      try {
        const bc = new BroadcastChannel('shubhaangi_sync');
        bc.postMessage({ type: 'PRODUCTS_UPDATED', products });
        bc.close();
      } catch {}
    }
  } catch (e) {
    console.error('Failed to save products:', e);
  }
};

// Orders persistence
export const getStoredOrders = () => {
  try {
    const data = localStorage.getItem('shubhaangi_orders');
    return data ? JSON.parse(data) : INITIAL_ORDERS;
  } catch (e) {
    console.warn(e);
    return INITIAL_ORDERS;
  }
};

export const saveOrders = (orders) => {
  try {
    localStorage.setItem('shubhaangi_orders', JSON.stringify(orders));
  } catch (e) {
    console.error(e);
  }
};

// Wishlist persistence
export const getStoredWishlist = () => {
  try {
    const data = localStorage.getItem('shubhaangi_wishlist');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn(e);
    return [];
  }
};

export const saveWishlist = (wishlistIds) => {
  try {
    localStorage.setItem('shubhaangi_wishlist', JSON.stringify(wishlistIds));
  } catch (e) {
    console.error(e);
  }
};

// Visitors count
export const getVisitorCount = () => {
  try {
    const current = localStorage.getItem('shubhaangi_visitors');
    if (!current) {
      localStorage.setItem('shubhaangi_visitors', '3428');
      return 3428;
    }
    const newCount = parseInt(current, 10) + 1;
    localStorage.setItem('shubhaangi_visitors', newCount.toString());
    return newCount;
  } catch (e) {
    console.warn(e);
    return 3429;
  }
};

// Coupon validator
export const validateCouponCode = (code, subtotal) => {
  if (!code) return { valid: false, message: 'Please enter a coupon code' };
  const cleanCode = code.trim().toUpperCase();
  const coupons = getStoredCoupons();
  const found = coupons.find(c => c.code.toUpperCase() === cleanCode);
  if (!found) {
    return { valid: false, message: `Coupon code "${cleanCode}" is invalid` };
  }
  if (found.isActive === false) {
    return { valid: false, message: `Coupon "${cleanCode}" is currently paused or expired` };
  }
  if (subtotal < found.minSubtotal) {
    return { 
      valid: false, 
      message: `Requires minimum bag subtotal of ₹${found.minSubtotal.toLocaleString('en-IN')} (Current: ₹${subtotal.toLocaleString('en-IN')})` 
    };
  }

  let discount = 0;
  if (found.type === 'PERCENTAGE' || found.type === 'PERCENT') {
    discount = Math.round((subtotal * found.value) / 100);
  } else {
    discount = found.value;
  }

  // Increment usage count safely
  try {
    const updated = coupons.map(c => c.id === found.id ? { ...c, timesUsed: (c.timesUsed || 0) + 1 } : c);
    saveCoupons(updated);
  } catch (e) {
    console.warn(e);
  }

  return {
    valid: true,
    coupon: found,
    discountAmount: Math.min(discount, subtotal),
    message: `Applied: ${found.description} (-₹${discount.toLocaleString('en-IN')})`
  };
};

// ── OFFLINE STUDIO ORDERS PERSISTENCE (WALK-IN POS & BOOKINGS) ──
export const INITIAL_OFFLINE_ORDERS = [
  {
    id: 'OFF-101',
    customerName: 'Megha Singhania',
    customerPhone: '+91 98112 34567',
    item: 'Rani Pink Zardozi Velvet Bridal Lehenga',
    category: 'DRESS',
    mode: 'RENT',
    amount: 18500,
    advancePaid: 8500,
    balanceDue: 10000,
    deposit: 15000,
    paymentMethod: 'UPI_QR',
    paymentStatus: 'PARTIAL_ADVANCE',
    bookingDate: '28 Sep 2026',
    eventDate: '12 Nov 2026',
    returnDate: '15 Nov 2026',
    notes: 'Blouse alteration: chest 34, waist 28. Extra latkans requested.',
    status: 'IN_ALTERATION'
  },
  {
    id: 'OFF-102',
    customerName: 'Ananya Verma',
    customerPhone: '+91 98731 88921',
    item: 'Royal Polki & Emerald Bridal Choker Set',
    category: 'JEWELLERY',
    mode: 'RENT',
    amount: 8500,
    advancePaid: 8500,
    balanceDue: 0,
    deposit: 8000,
    paymentMethod: 'CASH',
    paymentStatus: 'PAID',
    bookingDate: '29 Sep 2026',
    eventDate: '05 Oct 2026',
    returnDate: '08 Oct 2026',
    notes: 'Matching earrings & maang tikka packed in studio velvet box.',
    status: 'READY_FOR_PICKUP'
  },
  {
    id: 'OFF-103',
    customerName: 'Ritika Malhotra',
    customerPhone: '+91 96540 12890',
    item: 'Bespoke Antique Gold Tissue Silk Bridal Saree',
    category: 'DRESS',
    mode: 'BUY',
    amount: 125000,
    advancePaid: 50000,
    balanceDue: 75000,
    deposit: 0,
    paymentMethod: 'CARD',
    paymentStatus: 'PARTIAL_ADVANCE',
    bookingDate: '25 Sep 2026',
    eventDate: '20 Dec 2026',
    returnDate: null,
    notes: 'Custom hand embroidery on pallu with bride & groom initials.',
    status: 'CONFIRMED'
  }
];

export const getStoredOfflineOrders = () => {
  try {
    const data = localStorage.getItem('shubhaangi_offline_orders');
    return data ? JSON.parse(data) : INITIAL_OFFLINE_ORDERS;
  } catch (e) {
    console.warn(e);
    return INITIAL_OFFLINE_ORDERS;
  }
};

export const saveOfflineOrders = (orders) => {
  try {
    localStorage.setItem('shubhaangi_offline_orders', JSON.stringify(orders));
  } catch (e) {
    console.error(e);
  }
};

// ── STUDIO SERVICES, SHOOTS & EVENTS PERSISTENCE ──
export const INITIAL_STUDIO_SERVICES = [
  // 1. Pre-Wedding Shoots
  {
    id: 'srv-prewed-1',
    type: 'PREWEDDING',
    categoryLabel: 'Pre-Wedding Shoots',
    title: 'Royal Heritage Pre-Wedding Shoot',
    subtitle: '2 Bridal Couture Outfits + Studio & Delhi NCR Sets',
    price: '₹35,000',
    badge: 'Popular',
    description: 'Cinematic pre-wedding shoot with handcrafted Shubhaangi lehengas, royal jewellery sets, drone coverage, and high-fashion reel edits.',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1000',
    features: ['2 Shubhaangi Lehengas Included', 'Royal Polki Jewellery Sets', 'Drone & 4K Cinema Reels', '25 Retouched High-Res Photos'],
    isActive: true
  },
  {
    id: 'srv-prewed-2',
    type: 'PREWEDDING',
    categoryLabel: 'Pre-Wedding Shoots',
    title: 'Vintage Fort & Palace Pre-Wedding Edit',
    subtitle: 'Regal Destination Pre-Wedding Shoot',
    price: '₹65,000',
    badge: 'Luxury',
    description: 'Complete bridal styling, two premium bespoke lehengas, royal jewellery, full photography & 4K cinematic film.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000',
    features: ['Destination Palace Sets', 'Full Stylist & Makeup Artist on Set', 'Cinematic Wedding Teaser Video', 'Designer Outfits on Loan'],
    isActive: true
  },

  // 2. Upcoming Events
  {
    id: 'srv-event-1',
    type: 'EVENTS',
    categoryLabel: 'Upcoming Events',
    title: 'Shubhaangi Bridal Couture 2026 Showcase',
    subtitle: 'Delhi Flagship Atelier • Laxmi Nagar (Near V3S Mall)',
    price: 'Free VIP Entry (RSVP)',
    badge: 'Oct 2026',
    date: '24–26 Oct 2026',
    description: 'Exclusive private preview of the 2026 Raw Silk & Zardozi Bridal Vault with Lead Designer Deepak Kumar and Brand Owner Ekta Jain.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1000',
    features: ['Private Atelier Tour', 'Exclusive 15% Pre-Booking Discount', 'One-on-One Custom Design Session', 'Complimentary Champagne & Hi-Tea'],
    isActive: true
  },
  {
    id: 'srv-event-2',
    type: 'EVENTS',
    categoryLabel: 'Upcoming Events',
    title: 'Bridal Trousseau & Styling Masterclass',
    subtitle: 'Live Draping, Jewelry Matching & Trial Experience',
    price: 'Free by Registration',
    badge: 'Upcoming',
    date: '08 Nov 2026',
    description: 'Interactive bridal trousseau planning session with Ekta Jain & Deepak Kumar. One-on-one styling consultations for winter brides.',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000',
    features: ['Live Saree & Dupatta Draping', 'Jewellery Color Contrast Secrets', 'Bridal Skin Glow Consultation', 'Fitting Session Walkthrough'],
    isActive: true
  },

  // 3. Photoshoots
  {
    id: 'srv-photo-1',
    type: 'PHOTOSHOOT',
    categoryLabel: 'Photoshoots',
    title: 'Editorial Bridal Fashion Studio Shoot',
    subtitle: 'Magazine Style Shoot at Shubhaangi Studio',
    price: '₹22,000',
    badge: 'Studio Special',
    description: 'High-end studio photography in our Laxmi Nagar bridal suites. Includes 1 royal lehenga from our vault, makeup artist, and 20 retouched high-res photos.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['1 Luxury Outfit Included', 'Professional Makeup & Hair', 'Vogue-Style Studio Lighting', '20 Magazine-Grade Retouches'],
    isActive: true
  },
  {
    id: 'srv-photo-2',
    type: 'PHOTOSHOOT',
    categoryLabel: 'Photoshoots',
    title: 'Bridal Jewellery & Glamour Portrait Shoot',
    subtitle: 'Heirloom Polki & Kundan Glamour Portraits',
    price: '₹18,000',
    badge: 'Trending',
    description: 'Macro and portrait lighting designed to accentuate intricate jewellery, eye makeup, and traditional bridal heritage.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Choker & Mathapatti Highlight Shots', 'Cinematic Macro Beauty Lighting', 'High-Definition Skin Touch-ups', 'Same-Day Digital Previews'],
    isActive: true
  },

  // 4. Portfolio Shoots
  {
    id: 'srv-port-1',
    type: 'PORTFOLIO',
    categoryLabel: 'Portfolio Shoots',
    title: 'Model & Influencer Fashion Portfolio Shoot',
    subtitle: 'Professional Fashion Agency Book',
    price: '₹28,000',
    badge: 'Agency Ready',
    description: 'Full day portfolio session with 3 distinct luxury looks (Traditional Bridal, Indo-Western, Contemporary Saree). Directed by lead fashion stylists.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['3 Wardrobe Changes', 'High-Fashion Creative Direction', 'Digital Comp Card & Agency Portfolio', 'Insta-Ready Reel Edits'],
    isActive: true
  },
  {
    id: 'srv-port-2',
    type: 'PORTFOLIO',
    categoryLabel: 'Portfolio Shoots',
    title: 'Bride & Groom Royal Couple Portfolio',
    subtitle: 'Curated Romance & Editorial Posing',
    price: '₹32,000',
    badge: 'Couples',
    description: 'Couples looking for bespoke visual keepsakes before the wedding rituals. Coordinated outfits and tailored studio backgrounds.',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Couples Coordinated Wardrobe', 'Pose Coaching by Fashion Director', 'Framed 16x24 Canvas Print Included', 'Social Media Teaser Reel'],
    isActive: true
  },

  // 5. BTS Videos
  {
    id: 'srv-bts-1',
    type: 'BTS_VIDEOS',
    categoryLabel: 'BTS Videos',
    title: 'The Art of Zardozi — Behind the Loom',
    subtitle: '400 Hours of Pure Hand Embroidery Documentary',
    duration: '0:45s • 4K Reel',
    badge: 'Craft Story',
    description: 'Watch our master karigars in Old Delhi and Laxmi Nagar hand-embroider real dabka, sequins and golden threads onto pure raw silk fabrics.',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1000',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    features: ['Raw Karigar Craftsmanship', 'Close-up Thread & Pearl Work'],
    isActive: true
  },
  {
    id: 'srv-bts-2',
    type: 'BTS_VIDEOS',
    categoryLabel: 'BTS Videos',
    title: 'Bridal Transformation & Trial Suite BTS',
    subtitle: 'Bride Simran’s Complete Fitting Journey',
    duration: '0:30s • Studio Reel',
    badge: 'Reel',
    description: 'Step inside our Laxmi Nagar trial suite and experience how a bride finds her dream lehenga with lead designer Deepak Kumar.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    features: ['Real Bride Experience', 'Final Look Reveal Reaction'],
    isActive: true
  },

  // 6. Makeup Packages
  {
    id: 'srv-mu-1',
    type: 'MAKEUP',
    categoryLabel: 'Makeup Packages',
    title: 'Shubhaangi Signature HD Bridal Makeup',
    subtitle: 'HD Makeup + Hair Artistry + Draping + Lashes',
    price: '₹21,000',
    badge: 'Signature',
    description: 'Signature bridal look using luxury international cosmetics (Charlotte Tilbury, Dior, MAC, Huda Beauty). Includes dupatta draping, floral hair styling, and touch-up kit.',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=1000',
    features: ['International Luxury Products', 'Mink Lashes & Contact Lenses', 'Fresh Floral Hair Artistry', 'Complimentary Touch-Up Kit'],
    isActive: true
  },
  {
    id: 'srv-mu-2',
    type: 'MAKEUP',
    categoryLabel: 'Makeup Packages',
    title: 'Airbrush Bridal & Reception Glam',
    subtitle: '18-Hour Waterproof Flawless Finish',
    price: '₹28,000',
    badge: 'Airbrush',
    description: 'High-definition silicon-based airbrush makeup for high-stress wedding rituals and humidity. Looks weightless in real life and ultra-sharp in 4K photography.',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=1000',
    features: ['18-Hour Waterproof Seal', 'No-Flashback 4K Camera Finish', 'Custom Color Palette Matching', 'Includes Cocktail / Reception Look'],
    isActive: true
  },

  // 7. Pre-Bridals
  {
    id: 'srv-pb-1',
    type: 'PRE_BRIDAL',
    categoryLabel: 'Pre-Bridals',
    title: 'The Empress 30-Day Pre-Bridal Glow Ritual',
    subtitle: 'Complete Skin, Hair & Body Indulgence',
    price: '₹18,500',
    badge: '30-Day Ritual',
    description: 'Gold collagen facial, Ayurvedic ubtan body polishing, Moroccan hair spa, deluxe manicure-pedicure, and herbal back polishing sessions across 4 sittings.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000',
    features: ['4 Comprehensive Sessions', 'Gold Collagen Facial & Peel', 'Full Body Ayurvedic Polishing', 'Moroccan Argan Hair Ritual'],
    isActive: true
  },
  {
    id: 'srv-pb-2',
    type: 'PRE_BRIDAL',
    categoryLabel: 'Pre-Bridals',
    title: 'Express 7-Day Bridal Radiance Package',
    subtitle: 'Immediate Hydration & Glass Skin Therapy',
    price: '₹12,000',
    badge: 'Express Glow',
    description: 'For brides short on time. Hydrafacial, brightening peel, body glow polish, and relaxing scalp therapy designed for instant bridal glow.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1000',
    features: ['2 Intensive Sitting Sessions', 'Medical-Grade Hydrafacial', 'Full Arms & Back Glow Bleach', 'Aromatherapy De-stress Massage'],
    isActive: true
  }
];

export const INITIAL_STUDIO_TOPICS = [
  { id: 'PREWEDDING', label: 'Pre-Wedding Shoots', icon: '📸', desc: 'Cinematic Heritage & Destination Shoots', badge: 'Popular' },
  { id: 'EVENTS', label: 'Upcoming Events', icon: '🎪', desc: 'Exhibitions & Trunk Show Previews', badge: 'Oct 2026' },
  { id: 'PHOTOSHOOT', label: 'Photoshoots', icon: '📷', desc: 'High-Fashion & Studio Bridal Shoots', badge: null },
  { id: 'PORTFOLIO', label: 'Portfolio Shoots', icon: '🌟', desc: 'Model & Artist Editorial Portfolios', badge: null },
  { id: 'BTS_VIDEOS', label: 'BTS Videos', icon: '🎬', desc: 'Behind the Scenes & Reel Production', badge: 'Watch' },
  { id: 'MAKEUP', label: 'Makeup Packages', icon: '💄', desc: 'HD Bridal, Airbrush & Reception Glam', badge: 'Trending' },
  { id: 'PRE_BRIDAL', label: 'Pre-Bridals', icon: '👰', desc: 'Skin Prep, Glow Rituals & Hair Spa', badge: '30-Day' },
];

export const getStoredStudioTopics = () => {
  try {
    const data = localStorage.getItem('shubhaangi_studio_topics_v1');
    return data ? JSON.parse(data) : INITIAL_STUDIO_TOPICS;
  } catch (e) {
    console.warn(e);
    return INITIAL_STUDIO_TOPICS;
  }
};

export const saveStudioTopics = (topics) => {
  if (!Array.isArray(topics)) return;
  try {
    localStorage.setItem('shubhaangi_studio_topics_v1', JSON.stringify(topics));
    saveToVault('studio_topics', topics).catch(err => console.warn('IDB topics vault save skipped:', err));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('shubhaangi_topics_updated', { detail: topics }));
      try {
        const bc = new BroadcastChannel('shubhaangi_sync');
        bc.postMessage({ type: 'TOPICS_UPDATED', topics });
        bc.close();
      } catch {}
    }
  } catch (e) {
    console.error(e);
  }
};

export const getStoredStudioServices = () => {
  try {
    const data = localStorage.getItem('shubhaangi_studio_services_v1');
    if (!data) return INITIAL_STUDIO_SERVICES;
    const parsed = JSON.parse(data);
    return parsed.map(item => {
      if (item.type === 'BTS_VIDEOS' && !item.videoUrl) {
        return {
          ...item,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
        };
      }
      if ((item.type === 'PHOTOSHOOT' || item.type === 'PORTFOLIO') && (!item.gallery || item.gallery.length === 0)) {
        return {
          ...item,
          gallery: item.image ? [item.image] : []
        };
      }
      return item;
    });
  } catch (e) {
    console.warn(e);
    return INITIAL_STUDIO_SERVICES;
  }
};

export const saveStudioServices = (services) => {
  if (!Array.isArray(services)) return;
  try {
    try {
      localStorage.setItem('shubhaangi_studio_services_v1', JSON.stringify(services));
    } catch (quotaErr) {
      console.warn('LocalStorage quota in services, using compact storage:', quotaErr);
    }
    saveToVault('studio_services', services).catch(err => console.warn('IDB services vault save skipped:', err));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('shubhaangi_services_updated', { detail: services }));
      try {
        const bc = new BroadcastChannel('shubhaangi_sync');
        bc.postMessage({ type: 'SERVICES_UPDATED', services });
        bc.close();
      } catch {}
    }
  } catch (e) {
    console.error(e);
  }
};


