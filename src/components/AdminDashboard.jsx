import React, { useState, useEffect } from 'react';
import { 
  FiDollarSign, FiUsers, FiRepeat, 
  FiClock, FiAlertCircle, FiPhone, FiMessageCircle, 
  FiEdit2, FiSearch, FiMenu, FiX, FiPlus, FiCheck,
  FiTag, FiPercent, FiCopy, FiTrash2, FiVolume2,
  FiImage, FiUploadCloud, FiCamera, FiCheckCircle, FiLoader,
  FiBookOpen, FiClipboard, FiCreditCard, FiSend, FiScissors,
  FiCalendar, FiMapPin, FiStar, FiVideo, FiPlay
} from 'react-icons/fi';
import { 
  getStoredOrders, saveOrders, getStoredProducts, saveProducts, getVisitorCount, 
  getStoredCoupons, saveCoupons, getStoredOfferBanner, saveOfferBanner,
  getStoredOfflineOrders, saveOfflineOrders,
  getStoredStudioServices, saveStudioServices,
  getStoredStudioTopics, saveStudioTopics
} from '../data/store';
import {
  broadcastNewDressAlert,
  broadcastOfferAlert,
  getStoredSubscribers
} from '../utils/notifications';
import { compressImageFile, saveVideoFile, resolvePlayableVideoUrl } from '../utils/imageUpload';
import AdminSidebar from './admin/AdminSidebar';
import RentalTimelineCard from './admin/RentalTimelineCard';

export const STUDIO_SERVICE_TYPES = [
  { id: 'PREWEDDING', label: 'Pre-Wedding Shoots', icon: '📸', desc: 'Cinematic destination and heritage palace sessions' },
  { id: 'EVENTS', label: 'Upcoming Events', icon: '🎪', desc: 'Exhibitions, trunk show previews & masterclasses' },
  { id: 'PHOTOSHOOT', label: 'Photoshoots', icon: '📷', desc: 'Studio bridal & glamour portrait photography' },
  { id: 'PORTFOLIO', label: 'Portfolio Shoots', icon: '🌟', desc: 'Agency model books & couple bridal portfolios' },
  { id: 'BTS_VIDEOS', label: 'BTS Videos', icon: '🎬', desc: 'Behind the scenes karigar reels & trial suite stories' },
  { id: 'MAKEUP', label: 'Makeup Packages', icon: '💄', desc: 'Signature HD & Airbrush bridal makeover packages' },
  { id: 'PRE_BRIDAL', label: 'Pre-Bridals', icon: '👰', desc: 'Holistic skin prep, glow rituals & hair spa sessions' },
];

export const CATEGORY_CONFIGS = {
  PREWEDDING: {
    categoryTitle: 'Pre-Wedding Shoots',
    icon: '📸',
    tagline: 'Cinematic Heritage Palace & Destination Love Stories',
    description: 'Bespoke destination shoots with 4K drone cinematography, royal lehenga loans, and celebrity styling.',
    durationLabel: 'Shoot Duration',
    durationPlaceholder: 'e.g. 2 Days • Sunrise to Sunset',
    specialDetailLabel: 'Outfits on Loan from Vault',
    specialDetailPlaceholder: 'e.g. 3 Luxury Vault Lehengas & Sherwanis Included',
    pricePlaceholder: 'e.g. ₹45,000 or Starts at ₹35,000',
    locationPlaceholder: 'e.g. Jaipur / Udaipur Palace Sets & Delhi Atelier',
    suggestedFeatures: [
      '4K Cinematic Teaser Reel (60s)',
      'Drone 4K Aerial Stills',
      '3 Luxury Outfits Included from Vault',
      'Heritage Palace Location Access',
      'On-Set Stylist & Makeup Artist',
      '50 Magazine-Grade Skin Retouches',
      'Full Raw Footage on Hard Drive',
      'Custom Script & Mood Board'
    ],
    presets: [
      {
        title: 'Royal Heritage Palace Pre-Wedding',
        subtitle: '2-Day Cinematic Destination Shoot in Rajasthan Palaces',
        price: '₹55,000',
        badge: 'Bestseller',
        duration: '2 Days (16 Hours)',
        specialDetail: '3 Royal Outfits Included from Vault',
        location: 'Jaipur / Udaipur Heritage Palaces',
        features: [
          '4K Cinematic Teaser Reel (60s)',
          'Drone 4K Aerial Perspectives',
          '3 Luxury Outfits from Vault',
          'Celebrity Makeup Artist on Set',
          '50 High-End Magazine Retouches',
          'Full Raw High-Bitrate Footage'
        ],
        description: 'An unforgettable 2-day royal cinematic shoot crafted across historical havelis, marble courtyards, and sunset sand dunes. Includes complete styling, wardrobe, and direction.',
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1000'
      },
      {
        title: 'Delhi Heritage & Sunset Romance',
        subtitle: '1-Day Iconic Monuments & Luxury Studio Session',
        price: '₹32,000',
        badge: 'Popular',
        duration: '1 Full Day (8 Hours)',
        specialDetail: '2 Designer Outfits Included',
        location: 'Humayun Tomb, Lodhi Art District & Studio',
        features: [
          '1 Cinematic 4K Reel for Instagram',
          '35 Magazine-Grade Retouches',
          '2 Luxury Outfits from Vault',
          'Professional Hair & Makeup on Location',
          'Same-Day Raw Digital Previews'
        ],
        description: 'Capture timeless romantic moments amidst Delhi heritage monuments followed by private indoor luxury studio sets with high-fashion lighting.',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000'
      },
      {
        title: 'Goa Coastal Sunset Destination Shoot',
        subtitle: 'Golden Hour Beach, Vintage Yacht & Cliffside Romance',
        price: '₹68,000',
        badge: 'Exclusive',
        duration: '2 Days Beach & Yacht',
        specialDetail: '4 Bohemian & Indo-Western Sets',
        location: 'South Goa Private Beaches & Cabo de Rama',
        features: [
          'Private Luxury Yacht Sunset Shoot',
          '4K 60fps Drone Beach Sequences',
          '4 Designer Resort & Saree Outfits',
          'Editorial Color Grading & Sound Design',
          '65 High-Res Master Retouches'
        ],
        description: 'Dreamy coastal pre-wedding film set on secluded golden sand beaches, Portuguese heritage villas, and private ocean yacht charters.',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1000'
      }
    ]
  },

  EVENTS: {
    categoryTitle: 'Upcoming Events',
    icon: '🎪',
    tagline: 'Bridal Trunk Shows, Runway Previews & VIP Masterclasses',
    description: 'Invite brides to exclusive private viewings, designer meet-and-greets, and seasonal collection releases.',
    durationLabel: 'Event Dates & Timings',
    durationPlaceholder: 'e.g. 24–26 Oct 2026 • 11:00 AM – 8:00 PM',
    specialDetailLabel: 'Access & Pass Type',
    specialDetailPlaceholder: 'e.g. Complimentary VIP RSVP Pass (Limited 50 Brides)',
    pricePlaceholder: 'e.g. Free VIP RSVP or ₹1,500 / Seat',
    locationPlaceholder: 'e.g. Flagship Atelier • Laxmi Nagar, Delhi',
    suggestedFeatures: [
      'Complimentary VIP RSVP Pass',
      'Exclusive 2026 Vault Preview',
      '1-on-1 Consultation with Ekta Jain',
      'Champagne & High-Tea Lounge',
      'Flat 15% Spot Booking Voucher',
      'Goodie Bag with Silk Stole',
      'Live Masterclass & Draping Tips'
    ],
    presets: [
      {
        title: 'Royal Bridal Couture Trunk Show 2026',
        subtitle: 'Exclusive First Access to Unreleased Winter Bridal Vault',
        price: 'Free VIP RSVP',
        badge: 'Oct 2026',
        duration: '24–26 Oct 2026 • 11 AM - 8 PM',
        specialDetail: 'Complimentary VIP Guest Pass',
        location: 'Shubhaangi Flagship Atelier, Laxmi Nagar',
        features: [
          'First Look at 40+ Unreleased Lehengas',
          'Private Trial Suite Reservations',
          '1-on-1 Bridal Consultation with Ekta Jain',
          'Gourmet High-Tea & Macarons',
          '₹5,000 Instant Token Discount on Spot Orders'
        ],
        description: 'Step into an intimate 3-day showcase displaying handwoven raw silk, zardozi lehengas, and heritage polki jewellery before public release.',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000'
      },
      {
        title: 'Masterclass: Art of Bridal Draping & Styling',
        subtitle: 'Learn 12 Modern Saree & Dupatta Draping Techniques',
        price: '₹1,500 / Seat',
        badge: 'Limited Seats',
        duration: '15 Nov 2026 • 2:00 PM - 6:00 PM',
        specialDetail: 'Certificate + Luxury Draping Kit Included',
        location: 'Shubhaangi Studio Runway Hall',
        features: [
          'Live Demonstration on 5 Saree Fabrics',
          'Double Dupatta Pinning for Heavy Lehengas',
          'Hands-on Practical Practice on Mannequins',
          'Luxury Pin & Magnet Kit (Worth ₹1,200)',
          'High-Tea & Certificate of Participation'
        ],
        description: 'Intensive 4-hour hands-on workshop designed for brides, bridesmaids, and freelance stylists to master zero-stress dupattas and regal pleated drapes.',
        image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=1000'
      }
    ]
  },

  PHOTOSHOOT: {
    categoryTitle: 'Photoshoots',
    icon: '📷',
    tagline: 'High-Fashion Studio Bridal & Glamour Portraits',
    description: 'Magazine-quality studio portraits highlighting intricate zardozi craftsmanship, heirloom jewellery, and bridal glow.',
    durationLabel: 'Session Duration',
    durationPlaceholder: 'e.g. 4 Hours Studio Session',
    specialDetailLabel: 'Wardrobe & Vault Lehengas',
    specialDetailPlaceholder: 'e.g. 1 Royal Heavy Lehenga Loan Included',
    pricePlaceholder: 'e.g. ₹22,000 or ₹18,000',
    locationPlaceholder: 'e.g. Shubhaangi Atelier Studio • Laxmi Nagar',
    suggestedFeatures: [
      'Vogue High-Fashion Studio Lighting',
      '1 Royal Lehenga Loan from Vault',
      'Professional Makeup & Hair on Set',
      '25 Magazine-Grade Retouched Stills',
      'Jewellery Vault Props Included',
      'Same-Day Raw Digital Contact Sheet',
      'Private Trial Suite Changing Lounge'
    ],
    presets: [
      {
        title: 'Editorial Bridal Fashion Studio Shoot',
        subtitle: 'Magazine Cover Style Shoot with Custom Studio Lighting',
        price: '₹22,000',
        badge: 'Studio Special',
        duration: '4 Hours Studio',
        specialDetail: '1 Luxury Vault Outfit Included',
        location: 'Shubhaangi Flagship Studio, Delhi',
        features: [
          '1 Royal Lehenga from Vault Included',
          'Professional HD Hair & Makeup on Set',
          'Vogue-Style Multi-Light Backdrop Sets',
          '20 Magazine-Grade Skin Retouches',
          'All Unedited Raw Photos Delivered'
        ],
        description: 'Experience a celebrity-style editorial shoot inside our private Laxmi Nagar atelier. Includes mood-board planning, luxury outfit loan, and magazine retouching.',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000',
        gallery: [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000'
        ]
      },
      {
        title: 'Bridal Jewellery & Polki Glamour Portrait',
        subtitle: 'Macro Beauty Lighting Focused on Heirloom Jewellery',
        price: '₹18,000',
        badge: 'Trending',
        duration: '3 Hours Studio',
        specialDetail: 'Kundan & Polki Sets Provided',
        location: 'Shubhaangi Studio, Laxmi Nagar',
        features: [
          'Macro Beauty Ring & Softbox Lighting',
          'Choker, Mathapatti & Nath Accent Framing',
          'High-Definition Retouching for Eye & Skin',
          '15 High-Resolution Digital Master Deliverables',
          'Instant iPad Review During Shoot'
        ],
        description: 'Showcase your wedding jewels in breathtaking macro clarity. Perfect for heirloom portraits and luxury wedding announcements.',
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=1000',
        gallery: [
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000'
        ]
      }
    ]
  },

  PORTFOLIO: {
    categoryTitle: 'Portfolio Shoots',
    icon: '🌟',
    tagline: 'Agency Model Books, Couple Keepsakes & Artist Portfolios',
    description: 'Polished editorial portfolios for aspiring models, fashion creators, and couples wanting artistic keepsake books.',
    durationLabel: 'Session Duration',
    durationPlaceholder: 'e.g. 5 Hours • 4 Distinct Looks',
    specialDetailLabel: 'Look Changes & Styling',
    specialDetailPlaceholder: 'e.g. 4 Outfit Changes (Western & Couture)',
    pricePlaceholder: 'e.g. ₹19,500 or ₹26,000',
    locationPlaceholder: 'e.g. Studio & Urban Exterior Sets',
    suggestedFeatures: [
      '4 Distinct Look Changes',
      'Digital Comp Card for Agencies',
      'High-Fashion Pose Coaching',
      'Dedicated Stylist & Wardrobe Prep',
      '30 Edited Portfolio Master Frames',
      'Commercial Portfolio Rights',
      'Both Studio & Natural Light Sets'
    ],
    presets: [
      {
        title: 'Professional Agency Model Portfolio',
        subtitle: 'Industry-Standard Comp Card & High-Fashion Book',
        price: '₹19,500',
        badge: 'Agency Ready',
        duration: '5 Hours Session',
        specialDetail: '4 Full Look & Hair Changes',
        location: 'Delhi Studio & Creative Sets',
        features: [
          '4 Diverse Fashion & Beauty Looks',
          'Standard 5-Photo Agency Comp Card Design',
          'Posing & Expression Coaching',
          '30 Retouched High-Resolution Frames',
          'Full Commercial Self-Promotion Rights'
        ],
        description: 'Complete book designed to impress leading modeling agencies and casting directors. Includes beauty headshots, editorial fashion, and body lines.',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1000',
        gallery: [
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=1000',
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1000'
        ]
      }
    ]
  },

  BTS_VIDEOS: {
    categoryTitle: 'BTS Videos',
    icon: '🎬',
    tagline: 'Karigar Zari Handloom Stories & Viral Wedding Reels',
    description: 'High-energy vertical video production, behind-the-scenes karigar stories, and emotional bridal first looks.',
    durationLabel: 'Video Duration / Format',
    durationPlaceholder: 'e.g. 0:45s • 4K Reel',
    specialDetailLabel: 'Video Tag / Highlight',
    specialDetailPlaceholder: 'e.g. Shot in Laxmi Nagar Atelier',
    pricePlaceholder: '',
    locationPlaceholder: 'e.g. Shubhaangi Atelier & Trial Suite',
    suggestedFeatures: [
      '4K 60fps Vertical Reel',
      'Karigar Handloom Zari Story',
      'Bride First-Look Reveal',
      'Trial Room Transformation'
    ],
    presets: [
      {
        title: '320 Hours of Hand-Weaving: Royal Maroon Lehenga BTS',
        subtitle: 'Behind the Scenes in our Laxmi Nagar Karigar Loom Room',
        price: '',
        badge: '4K Reel',
        duration: '0:45s • 4K Reel',
        specialDetail: 'Real Gold Zari & Dabka Karigari',
        location: 'Shubhaangi Karigar Workshop, Delhi',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-in-a-luxury-dress-41645-large.mp4',
        features: [
          'Real Gold & Silver Zari Threads',
          '6 Master Karigars Working Together',
          'Final Bridal Fitting Reveal'
        ],
        description: 'Watch how our master artisans spend 320+ hours hand-embroidering intricate zardozi motifs onto pure raw silk.',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000'
      },
      {
        title: 'Bride Riya’s Emotional First Look in Her Wedding Lehenga',
        subtitle: 'Private Trial Suite Reveal with Family & Stylist Ekta Jain',
        price: '',
        badge: 'Viral Reel',
        duration: '0:38s • Trial Reel',
        specialDetail: 'Custom Crimson Trail Lehenga',
        location: 'Shubhaangi VIP Trial Lounge',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-neon-light-39877-large.mp4',
        features: [
          'Double Dupatta Royal Draping',
          'Live Custom Veil Styling',
          'Candid Family Reaction'
        ],
        description: 'Pure magic inside our VIP bridal suite as Bride Riya steps out in her customized crimson lehenga for the first time.',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000'
      }
    ]
  },

  MAKEUP: {
    categoryTitle: 'Makeup Packages',
    icon: '💄',
    tagline: 'Signature HD & 18-Hour Airbrush Bridal Makeovers',
    description: 'Luxury bridal hair, makeup, and draping using Dior, Chanel, Charlotte Tilbury, and MAC for a radiant 18-hour sweatproof finish.',
    durationLabel: 'Makeup Duration',
    durationPlaceholder: 'e.g. 3.5 Hours Private Suite Session',
    specialDetailLabel: 'Technique & Brands Used',
    specialDetailPlaceholder: 'e.g. 18-Hour HD Airbrush • Charlotte Tilbury & Dior',
    pricePlaceholder: 'e.g. ₹28,000 or ₹18,000',
    locationPlaceholder: 'e.g. Private Bridal Suite • Laxmi Nagar or Venue',
    suggestedFeatures: [
      '18-Hour Waterproof Airbrush HD Finish',
      'Luxury 3D Mink Lashes & Lens',
      'Celebrity Bridal Hair Styling & Extensions',
      'Lehenga & Double Dupatta Draping',
      'Charlotte Tilbury & Dior Cosmetic Suite',
      'Emergency Bridal Touch-Up Mini Kit',
      'Complimentary Trial Sitting Included'
    ],
    presets: [
      {
        title: 'Royal Signature Airbrush Bridal Glam',
        subtitle: '18-Hour Waterproof HD Airbrush with International Cosmetics',
        price: '₹28,000',
        badge: 'Signature',
        duration: '3.5 Hours Session',
        specialDetail: 'Dior, Chanel & Charlotte Tilbury Suite',
        location: 'Private Bridal Suite, Laxmi Nagar / On-Venue',
        features: [
          '18-Hour HD Airbrush Makeup (Tear & Sweat Proof)',
          'Luxury 3D Silk Lashes & Cosmetic Lens',
          'Intricate Hair Styling with Floral Accents & Extensions',
          'Double Dupatta & Saree Precision Draping',
          'Emergency Touch-Up Kit (Lipstick, Blotting paper, Pins)'
        ],
        description: 'The definitive bridal makeover designed to look radiant under 4K camera lenses, warm yellow mandap lights, and all-night celebrations.',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=1000'
      },
      {
        title: 'Engagement & Reception HD Glass Glow',
        subtitle: 'Dewy Natural Radiance for Sangeet & Reception Evenings',
        price: '₹16,000',
        badge: 'Trending',
        duration: '2.5 Hours Session',
        specialDetail: 'NARS, Huda Beauty & MAC Luxury Products',
        location: 'Shubhaangi Makeup Studio, Delhi',
        features: [
          'Ultra-Hydrating Glass Skin Base',
          'Smokey or Soft Glam Eye with Glitter Accents',
          'Textured Hollywood Waves or Romantic Bun',
          'Designer Dupatta / Gown Draping',
          'Pre-Makeup Hydrating Sheet Mask'
        ],
        description: 'Fresh, radiant, and contemporary glamour designed for evening cocktails, sangeet performances, and reception stage lights.',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1000'
      }
    ]
  },

  PRE_BRIDAL: {
    categoryTitle: 'Pre-Bridals',
    icon: '👰',
    tagline: 'Holistic Skin Prep, 24K Gold Rituals & Luxury Hair Detox',
    description: 'Multi-sitting skin and hair revival regimens starting 30 to 60 days before the wedding to ensure natural inner radiance.',
    durationLabel: 'Program Duration',
    durationPlaceholder: 'e.g. 30-Day Bridal Journey (5 Sittings)',
    specialDetailLabel: 'Sittings & Treatments Included',
    specialDetailPlaceholder: 'e.g. 5 Sittings • 24K Gold Facial + Full Body Polish',
    pricePlaceholder: 'e.g. ₹24,000 or ₹15,000',
    locationPlaceholder: 'e.g. Shubhaangi Skin & Spa Suite • Delhi',
    suggestedFeatures: [
      '5 Holistic In-Clinic Sittings',
      '24K Gold Radiance Facial',
      'Full Body Ubtan & Walnut Polish',
      'Moroccan Argan Hair Spa Detox',
      'Rose Petal Manicure & Pedicure',
      'Ayurvedic Full Body De-Tan Pack',
      'Pain-Free Full Body Waxing & Threading'
    ],
    presets: [
      {
        title: '30-Day Royal Bridal Radiance Journey',
        subtitle: '5 Comprehensive Sittings for Complete Skin & Hair Rejuvenation',
        price: '₹24,000',
        badge: '30-Day Ritual',
        duration: '30 Days (5 Sittings)',
        specialDetail: '5 Sittings • 24K Gold Facial & Full Body Polish',
        location: 'Shubhaangi Bridal Skin Spa, Laxmi Nagar',
        features: [
          'Sitting 1: Deep Cleansing & Moroccan Hair Spa',
          'Sitting 2: Ayurvedic Full Body Ubtan & Exfoliating Scrub',
          'Sitting 3: Medical Hydrafacial & Pigmentation Treatment',
          'Sitting 4: 24K Pure Gold Radiance Glow Facial',
          'Sitting 5: Crystal Spa Manicure, Pedicure & Full Body Wax'
        ],
        description: 'Our most comprehensive bride-to-be preparation. Every session is spaced across 4 weeks to progressively clear pores, soften skin, and create that unmatched bridal glow.',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000'
      },
      {
        title: '15-Day Express Bridal Glow Booster',
        subtitle: 'Rapid Skin Prep for Short-Notice Weddings',
        price: '₹14,500',
        badge: 'Express Glow',
        duration: '15 Days (2 Intensive Sittings)',
        specialDetail: 'Hydra-Infusion & Instant Polish',
        location: 'Shubhaangi Bridal Spa, Delhi',
        features: [
          'Medical-Grade Hydrafacial with Hyaluronic Infusion',
          'Full Body Brightening Peel & Polish',
          'Aromatherapy Scalp & Hair Detox Spa',
          'Full Arms, Legs & Back Glow Bleach',
          'Collagen Eye & Lip Plumping Masks'
        ],
        description: 'For brides short on time. High-impact clinical hydra-facials, gentle body peels, and intensive hair gloss designed to give instant radiance in just 2 sittings.',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1000'
      }
    ]
  }
};

export const getCategoryConfig = (type) => {
  return CATEGORY_CONFIGS[type] || {
    categoryTitle: 'Studio Experience',
    icon: '✨',
    tagline: 'Bespoke Luxury Bridal Services',
    description: 'Custom curated atelier experiences and shoot options.',
    durationLabel: 'Duration / Schedule',
    durationPlaceholder: 'e.g. 1 Day / By Appointment',
    specialDetailLabel: 'Special Inclusions & Highlights',
    specialDetailPlaceholder: 'e.g. Dedicated Stylist & Vault Access',
    pricePlaceholder: 'e.g. ₹20,000 or Upon Request',
    locationPlaceholder: 'e.g. Delhi Flagship Atelier',
    suggestedFeatures: [
      'Private Consultation with Lead Stylist',
      'High-Resolution Digital Delivery',
      'Custom Mood-Board Planning',
      'Priority Weekend Scheduling',
      'Complementary Trial Session',
      'Luxury Gift Voucher Included'
    ],
    presets: []
  };
};

function SmartVideoPlayer({ videoUrl, poster, className = 'w-full h-full object-cover' }) {
  const [playableUrl, setPlayableUrl] = useState('');

  useEffect(() => {
    let active = true;
    if (!videoUrl) {
      setPlayableUrl('');
      return;
    }
    resolvePlayableVideoUrl(videoUrl).then((url) => {
      if (active) setPlayableUrl(url || '');
    });
    return () => {
      active = false;
    };
  }, [videoUrl]);

  if (!playableUrl) {
    return poster ? (
      <img src={poster} alt="Video Poster" className={className} />
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-luxury-gold text-xs font-medium">
        🎬 Ready for Video
      </div>
    );
  }

  const ytMatch = playableUrl.match(/(?:youtube\.com\/(?:shorts\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  if (ytMatch) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${ytMatch[1]}`}
        title="Studio BTS Video"
        className={className}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <video
      src={playableUrl}
      poster={poster || undefined}
      controls
      playsInline
      preload="metadata"
      className={className}
    />
  );
}

export default function AdminDashboard({ 
  onBackToStore, 
  onLogout,
  products: propProducts,
  setProducts: propSetProducts,
  studioServices: propStudioServices,
  setStudioServices: propSetStudioServices,
  studioTopics: propStudioTopics,
  setStudioTopics: propSetStudioTopics
}) {
  const [orders, setOrders] = useState(() => getStoredOrders());
  const [products, setProducts] = useState(() => (Array.isArray(propProducts) && propProducts.length > 0) ? propProducts : getStoredProducts());
  const [visitors] = useState(() => getVisitorCount());
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // 'OVERVIEW' | 'OFFLINE_ORDERS' | 'STUDIO_SERVICES' | 'RENTALS' | 'ORDERS' | 'INVENTORY' | 'COUPONS' | 'NEWSLETTER'
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [photoManagerProduct, setPhotoManagerProduct] = useState(null);
  const [newPhotoUrlInput, setNewPhotoUrlInput] = useState('');
  const [notification, setNotification] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Shoots, Events & Studio Experiences State
  const [studioTopics, setStudioTopics] = useState(() => (Array.isArray(propStudioTopics) && propStudioTopics.length > 0) ? propStudioTopics : getStoredStudioTopics());
  const [studioServices, setStudioServices] = useState(() => (Array.isArray(propStudioServices) && propStudioServices.length > 0) ? propStudioServices : getStoredStudioServices());

  // Real-time synchronization with parent App state
  useEffect(() => {
    if (propProducts && Array.isArray(propProducts)) {
      setProducts(propProducts);
    }
  }, [propProducts]);

  useEffect(() => {
    if (propStudioServices && Array.isArray(propStudioServices)) {
      setStudioServices(propStudioServices);
    }
  }, [propStudioServices]);

  useEffect(() => {
    if (propStudioTopics && Array.isArray(propStudioTopics)) {
      setStudioTopics(propStudioTopics);
    }
  }, [propStudioTopics]);

  const updateProducts = (updated) => {
    setProducts(updated);
    if (typeof propSetProducts === 'function') {
      propSetProducts(updated);
    }
    saveProducts(updated);
  };

  const updateStudioServices = (updated) => {
    setStudioServices(updated);
    if (typeof propSetStudioServices === 'function') {
      propSetStudioServices(updated);
    }
    saveStudioServices(updated);
  };

  const updateStudioTopics = (updated) => {
    setStudioTopics(updated);
    if (typeof propSetStudioTopics === 'function') {
      propSetStudioTopics(updated);
    }
    saveStudioTopics(updated);
  };
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const [newTopicForm, setNewTopicForm] = useState({ id: '', label: '', icon: '📸', desc: '', badge: '' });
  const [editingService, setEditingService] = useState(null);
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState('ALL');
  const [serviceSearch, setServiceSearch] = useState('');
  const [servicePhotoTab, setServicePhotoTab] = useState('FILE'); // 'FILE' | 'VIDEO' | 'URL'
  const [isUploadingServicePhoto, setIsUploadingServicePhoto] = useState(false);
  const [isUploadingServiceVideo, setIsUploadingServiceVideo] = useState(false);
  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  const [serviceForm, setServiceForm] = useState({
    type: 'PREWEDDING',
    categoryLabel: 'Pre-Wedding Shoots',
    title: '',
    subtitle: '',
    price: '',
    date: '',
    duration: '',
    specialDetail: '',
    location: 'Delhi Atelier & Destination',
    badge: 'Popular',
    image: '',
    videoUrl: '',
    gallery: [],
    description: '',
    features: '',
    isActive: true
  });

  // Offline Studio Orders (Walk-In Desk Register)
  const [offlineOrders, setOfflineOrders] = useState(() => getStoredOfflineOrders());
  const [isAddOfflineOpen, setIsAddOfflineOpen] = useState(false);
  const [offlineSearch, setOfflineSearch] = useState('');
  const [offlineFilter, setOfflineFilter] = useState('ALL'); // 'ALL' | 'DUE' | 'IN_ALTERATION' | 'READY' | 'RENT' | 'BUY'
  const [newOfflineOrder, setNewOfflineOrder] = useState({
    customerName: '',
    customerPhone: '',
    item: '',
    category: 'DRESS',
    mode: 'RENT',
    amount: '',
    advancePaid: '',
    deposit: '',
    paymentMethod: 'UPI_QR',
    bookingDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    eventDate: '',
    returnDate: '',
    notes: '',
    status: 'CONFIRMED'
  });

  // Photo upload states for Add Product & Gallery Manager
  const [coverPhotoTab, setCoverPhotoTab] = useState('FILE'); // 'FILE' | 'URL'
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [extraPhotosList, setExtraPhotosList] = useState([]);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isUploadingManagerPhoto, setIsUploadingManagerPhoto] = useState(false);

  // Newsletter subscribers
  const [subscribers, setSubscribers] = useState(() => getStoredSubscribers());
  const [nlSearch, setNlSearch] = useState('');
  const [nlFilter, setNlFilter] = useState('ALL'); // ALL | PUSH | NO_PUSH | DRESS | OFFERS

  // Offers & Promo Vouchers state
  const [coupons, setCoupons] = useState(() => getStoredCoupons());
  const [offerBanner, setOfferBanner] = useState(() => getStoredOfferBanner());
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [couponFilter, setCouponFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'PAUSED' | 'PERCENTAGE' | 'FLAT'
  const [copiedCode, setCopiedCode] = useState(null);

  // New coupon form state
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'PERCENTAGE',
    value: '',
    minSubtotal: '',
    description: '',
    validUntil: '31 Dec 2026',
    badge: 'Seasonal Offer',
    isActive: true
  });

  // New product form state
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'DRESS',
    buyPrice: '',
    rentPrice3Days: '',
    rentPrice7Days: '',
    deposit: '',
    img: '',
    galleryUrls: '',
    isRentalAvailable: true
  });

  // Aggregate Metrics
  const totalRevenue = orders.reduce((acc, order) => acc + (order.amount || 0), 0);
  const rentalRevenue = orders
    .filter(o => o.mode === 'RENT')
    .reduce((acc, order) => acc + (order.amount || 0), 0);
  const buyRevenue = orders
    .filter(o => o.mode === 'BUY')
    .reduce((acc, order) => acc + (order.amount || 0), 0);

  // Aggregate Metrics (Offline Walk-In Studio Counter)
  const offlineGrossRevenue = offlineOrders.reduce((acc, o) => acc + (Number(o.amount) || 0), 0);
  const offlineCollectedRevenue = offlineOrders.reduce((acc, o) => acc + (Number(o.advancePaid) || 0), 0);
  const offlineBalanceDue = offlineOrders.reduce((acc, o) => acc + (Number(o.balanceDue) || 0), 0);
  const offlineDepositsHeld = offlineOrders
    .filter(o => o.mode === 'RENT' && o.status !== 'RETURNED')
    .reduce((acc, o) => acc + (Number(o.deposit) || 0), 0);
  const grandCombinedRevenue = totalRevenue + offlineGrossRevenue;

  const activeRentals = orders.filter(o => o.status === 'ACTIVE_RENTAL');
  const pendingReturns = orders.filter(o => o.status === 'RETURN_PENDING');
  const returnedRentals = orders.filter(o => o.status === 'RETURNED');
  const conversionRate = ((orders.length / Math.max(visitors, 1)) * 100).toFixed(1);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // ── Offline Studio Order Handlers ──
  const handleCreateOfflineOrder = (e) => {
    e.preventDefault();
    if (!newOfflineOrder.customerName || !newOfflineOrder.item || !newOfflineOrder.amount) {
      alert('Please fill in Customer Name, Garment Name, and Agreed Price.');
      return;
    }

    const totalAmt = Number(newOfflineOrder.amount) || 0;
    const advPaid = Number(newOfflineOrder.advancePaid) || 0;
    const balDue = Math.max(0, totalAmt - advPaid);
    const payStatus = advPaid >= totalAmt ? 'PAID' : (advPaid > 0 ? 'PARTIAL_ADVANCE' : 'PENDING');

    const createdOrder = {
      id: `OFF-${Date.now().toString().slice(-4)}`,
      customerName: newOfflineOrder.customerName.trim(),
      customerPhone: newOfflineOrder.customerPhone.trim() || '+91 99999 99999',
      item: newOfflineOrder.item.trim(),
      category: newOfflineOrder.category,
      mode: newOfflineOrder.mode,
      amount: totalAmt,
      advancePaid: advPaid,
      balanceDue: balDue,
      deposit: Number(newOfflineOrder.deposit) || 0,
      paymentMethod: newOfflineOrder.paymentMethod,
      paymentStatus: payStatus,
      bookingDate: newOfflineOrder.bookingDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      eventDate: newOfflineOrder.eventDate || 'TBD',
      returnDate: newOfflineOrder.returnDate || null,
      notes: newOfflineOrder.notes.trim() || '',
      status: newOfflineOrder.status || 'CONFIRMED'
    };

    const updated = [createdOrder, ...offlineOrders];
    setOfflineOrders(updated);
    saveOfflineOrders(updated);
    setIsAddOfflineOpen(false);
    setNewOfflineOrder({
      customerName: '',
      customerPhone: '',
      item: '',
      category: 'DRESS',
      mode: 'RENT',
      amount: '',
      advancePaid: '',
      deposit: '',
      paymentMethod: 'UPI_QR',
      bookingDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      eventDate: '',
      returnDate: '',
      notes: '',
      status: 'CONFIRMED'
    });
    showToast(`📝 Studio Walk-in order #${createdOrder.id} saved! Advance: ₹${advPaid.toLocaleString('en-IN')}`);
  };

  const handleUpdateOfflineStatus = (orderId, newStatus) => {
    const updated = offlineOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOfflineOrders(updated);
    saveOfflineOrders(updated);
    showToast(`✅ Studio order #${orderId} status set to: ${newStatus.replace(/_/g, ' ')}`);
  };

  const handleCollectOfflineBalance = (orderId) => {
    const updated = offlineOrders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          advancePaid: o.amount,
          balanceDue: 0,
          paymentStatus: 'PAID'
        };
      }
      return o;
    });
    setOfflineOrders(updated);
    saveOfflineOrders(updated);
    showToast(`💰 Balance received for #${orderId}! Marked as FULLY PAID.`);
  };

  const handleDeleteOfflineOrder = (orderId) => {
    if (!window.confirm(`Delete offline order record #${orderId}? This cannot be undone.`)) return;
    const updated = offlineOrders.filter(o => o.id !== orderId);
    setOfflineOrders(updated);
    saveOfflineOrders(updated);
    showToast(`🗑️ Order #${orderId} removed from offline register.`);
  };

  const handleSendWhatsAppReceipt = (order) => {
    const phone = (order.customerPhone || '').replace(/[^0-9]/g, '');
    const cleanPhone = phone.startsWith('91') ? phone : (phone.length === 10 ? `91${phone}` : phone);
    const balanceText = order.balanceDue > 0 ? `⚠️ Balance Due upon pickup: ₹${order.balanceDue.toLocaleString('en-IN')}` : `✅ Payment Status: FULLY PAID`;
    const rentalText = order.mode === 'RENT' ? `\n• Security Deposit: ₹${(order.deposit || 0).toLocaleString('en-IN')} (Refundable)\n• Return Date: ${order.returnDate || 'As agreed'}` : '';

    const text = `*SHUBHAANGI — THE ULTIMATE BRIDE*\n_Official Studio Booking Slip_\n\nNamaste ${order.customerName} ji! ✨\nThank you for choosing SHUBHAANGI Bridal Studio (Laxmi Nagar, Delhi).\n\n*Booking Details:*\n• Slip ID: #${order.id}\n• Outfit / Set: ${order.item}\n• Category: ${order.category === 'DRESS' ? 'Bridal Lehenga / Saree' : (order.category === 'JEWELLERY' ? 'Royal Jewellery' : 'Bridal Makeup')}\n• Order Type: ${order.mode === 'RENT' ? 'Bridal Rental' : 'Bespoke Purchase'}\n• Function Date: ${order.eventDate || 'As scheduled'}${rentalText}\n\n*Payment Summary:*\n• Total Agreed: ₹${order.amount.toLocaleString('en-IN')}\n• Advance Received: ₹${order.advancePaid.toLocaleString('en-IN')} (${order.paymentMethod})\n• ${balanceText}\n\n${order.notes ? `*Alteration / Fitting Notes:* ${order.notes}\n\n` : ''}📍 *Studio Address:* B-125, First Floor, Laxmi Nagar, Delhi (Near V3S Mall)\n📞 *Contact:* +91 6397799514\n\n_We look forward to crafting your bridal royalty!_ 👑`;

    const url = `https://wa.me/${cleanPhone || '916397799514'}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // ── Studio Services Handlers ──
  const handleToggleServiceActive = (serviceId) => {
    const updated = studioServices.map(s => {
      if (s.id === serviceId) {
        return { ...s, isActive: !s.isActive };
      }
      return s;
    });
    updateStudioServices(updated);
    const item = updated.find(s => s.id === serviceId);
    showToast(`${item.isActive ? '👁️ Activated' : '🔒 Hidden'}: "${item.title}"`);
  };

  const handleDeleteService = (serviceId) => {
    const item = studioServices.find(s => s.id === serviceId);
    if (!window.confirm(`Are you sure you want to delete "${item?.title || 'this entry'}"? This cannot be undone.`)) return;
    const updated = studioServices.filter(s => s.id !== serviceId);
    updateStudioServices(updated);
    showToast(`🗑️ Deleted: "${item?.title || 'Service entry'}"`);
  };

  const handleOpenAddService = (type = 'PREWEDDING', initialPreset = null) => {
    const matched = studioTopics.find(t => t.id === type) || studioTopics[0] || { id: 'PREWEDDING', label: 'Pre-Wedding Shoots' };
    const config = getCategoryConfig(matched.id);
    setEditingService(null);
    setServicePhotoTab('FILE');
    setGalleryUrlInput('');

    if (initialPreset) {
      const presetGallery = Array.isArray(initialPreset.gallery) && initialPreset.gallery.length > 0
        ? initialPreset.gallery
        : (initialPreset.image ? [initialPreset.image] : []);
      setServiceForm({
        type: matched.id,
        categoryLabel: matched.label || matched.name,
        title: initialPreset.title || '',
        subtitle: initialPreset.subtitle || '',
        price: initialPreset.price || '',
        date: initialPreset.duration || '',
        duration: initialPreset.duration || '',
        specialDetail: initialPreset.specialDetail || '',
        location: initialPreset.location || 'Delhi Atelier',
        badge: initialPreset.badge || 'Popular',
        image: initialPreset.image || presetGallery[0] || '',
        videoUrl: initialPreset.videoUrl || '',
        gallery: presetGallery,
        description: initialPreset.description || '',
        features: Array.isArray(initialPreset.features) ? initialPreset.features.join('\n') : (initialPreset.features || ''),
        isActive: true
      });
    } else {
      const firstPreset = config.presets?.[0];
      const defaultImg = matched.id === 'BTS_VIDEOS'
        ? ''
        : (firstPreset?.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000');
      setServiceForm({
        type: matched.id,
        categoryLabel: matched.label || matched.name,
        title: '',
        subtitle: '',
        price: '',
        date: '',
        duration: '',
        specialDetail: '',
        location: config.locationPlaceholder?.replace(/^e\.g\.\s*/, '') || 'Delhi Atelier & Destination',
        badge: matched.id === 'BTS_VIDEOS' ? '4K Reel' : (matched.id === 'PHOTOSHOOT' ? 'Studio Lookbook' : 'Popular'),
        image: defaultImg,
        videoUrl: '',
        gallery: defaultImg ? [defaultImg] : [],
        description: '',
        features: (config.suggestedFeatures?.slice(0, 4) || []).join('\n'),
        isActive: true
      });
    }
    setIsAddServiceOpen(true);
  };

  const handleApplyPreset = (preset) => {
    if (!preset) return;
    const presetGallery = Array.isArray(preset.gallery) && preset.gallery.length > 0
      ? preset.gallery
      : (preset.image ? [preset.image] : []);
    setServiceForm(prev => ({
      ...prev,
      title: preset.title || prev.title,
      subtitle: preset.subtitle || prev.subtitle,
      price: preset.price !== undefined ? preset.price : prev.price,
      date: preset.duration || prev.date,
      duration: preset.duration || prev.duration,
      specialDetail: preset.specialDetail || prev.specialDetail,
      location: preset.location || prev.location,
      badge: preset.badge || prev.badge,
      image: preset.image || prev.image,
      videoUrl: preset.videoUrl || prev.videoUrl || '',
      gallery: presetGallery.length > 0 ? presetGallery : prev.gallery,
      description: preset.description || prev.description,
      features: Array.isArray(preset.features) ? preset.features.join('\n') : (preset.features || prev.features)
    }));
    showToast(`⚡ Loaded preset: "${preset.title}"`);
  };

  const handleAddSuggestedFeature = (tag) => {
    if (!tag) return;
    setServiceForm(prev => {
      const existing = (prev.features || '')
        .split(/[\n,]/)
        .map(s => s.trim())
        .filter(Boolean);
      if (existing.includes(tag)) {
        return prev;
      }
      const updated = existing.length > 0 ? `${prev.features.trim()}\n${tag}` : tag;
      return { ...prev, features: updated };
    });
  };

  const handleOpenEditService = (service) => {
    setEditingService(service);
    setServicePhotoTab('FILE');
    setGalleryUrlInput('');
    const existingGallery = Array.isArray(service.gallery) && service.gallery.length > 0
      ? service.gallery
      : (service.image ? [service.image] : []);
    setServiceForm({
      type: service.type,
      categoryLabel: service.categoryLabel || service.type,
      title: service.title,
      subtitle: service.subtitle || '',
      price: service.price || '',
      date: service.date || service.duration || '',
      duration: service.duration || service.date || '',
      specialDetail: service.specialDetail || '',
      location: service.location || 'Delhi Atelier',
      badge: service.badge || '',
      image: service.image || existingGallery[0] || '',
      videoUrl: service.videoUrl || '',
      gallery: existingGallery,
      description: service.description || '',
      features: Array.isArray(service.features) ? service.features.join('\n') : (service.features || ''),
      isActive: service.isActive !== false
    });
    setIsAddServiceOpen(true);
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    if (!serviceForm.title.trim()) {
      alert('Please enter a title.');
      return;
    }

    if (serviceForm.type === 'BTS_VIDEOS' && !serviceForm.videoUrl.trim()) {
      alert('Please upload a BTS Video file (MP4/MOV) or paste a video link.');
      return;
    }

    const featureList = (serviceForm.features || '')
      .split(/[\n,]/)
      .map(f => f.trim())
      .filter(Boolean);

    const matchedType = studioTopics.find(t => t.id === serviceForm.type);
    const categoryLabel = matchedType ? (matchedType.label || matchedType.name) : serviceForm.categoryLabel;

    const cleanGallery = Array.isArray(serviceForm.gallery) && serviceForm.gallery.length > 0
      ? serviceForm.gallery.filter(Boolean)
      : (serviceForm.image ? [serviceForm.image] : []);
    const primaryImage = serviceForm.image || cleanGallery[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000';

    if (editingService) {
      const updated = studioServices.map(s => {
        if (s.id === editingService.id) {
          return {
            ...s,
            ...serviceForm,
            image: primaryImage,
            videoUrl: serviceForm.videoUrl || '',
            gallery: cleanGallery,
            duration: serviceForm.duration || serviceForm.date || '',
            date: serviceForm.date || serviceForm.duration || '',
            specialDetail: serviceForm.specialDetail || '',
            categoryLabel,
            features: featureList
          };
        }
        return s;
      });
      updateStudioServices(updated);
      showToast(`✨ Updated: "${serviceForm.title}"`);
    } else {
      const newEntry = {
        id: `srv-${Date.now()}`,
        ...serviceForm,
        image: primaryImage,
        videoUrl: serviceForm.videoUrl || '',
        gallery: cleanGallery,
        duration: serviceForm.duration || serviceForm.date || '',
        date: serviceForm.date || serviceForm.duration || '',
        specialDetail: serviceForm.specialDetail || '',
        categoryLabel,
        features: featureList
      };
      const updated = [newEntry, ...studioServices];
      updateStudioServices(updated);
      showToast(`🎉 Published to ${categoryLabel}: "${serviceForm.title}"`);
    }

    setIsAddServiceOpen(false);
    setEditingService(null);
  };

  const handleSaveNewTopic = (e) => {
    e.preventDefault();
    if (!newTopicForm.label.trim()) {
      alert('Please enter a category / topic name.');
      return;
    }

    const topicId = newTopicForm.id.trim()
      ? newTopicForm.id.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_')
      : newTopicForm.label.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');

    if (studioTopics.some(t => t.id === topicId)) {
      alert('A topic with this ID or name already exists!');
      return;
    }

    const newTopic = {
      id: topicId,
      label: newTopicForm.label.trim(),
      icon: newTopicForm.icon.trim() || '📸',
      desc: newTopicForm.desc.trim() || 'Exclusive Studio Category',
      badge: newTopicForm.badge.trim() || null
    };

    const updated = [...studioTopics, newTopic];
    updateStudioTopics(updated);
    setIsAddTopicOpen(false);
    setNewTopicForm({ id: '', label: '', icon: '📸', desc: '', badge: '' });
    setServiceCategoryFilter(newTopic.id);
    showToast(`🎉 New Main Topic added: "${newTopic.label}"! You can now add subtopics under it.`);
  };

  const handleDeleteTopic = (topicId) => {
    if (studioTopics.length <= 1) {
      alert('At least one topic must remain in the menu.');
      return;
    }
    const topic = studioTopics.find(t => t.id === topicId);
    if (!window.confirm(`Delete topic "${topic?.label || topicId}"? Subtopics under this topic will remain in database.`)) {
      return;
    }
    const updated = studioTopics.filter(t => t.id !== topicId);
    updateStudioTopics(updated);
    if (serviceCategoryFilter === topicId) {
      setServiceCategoryFilter('ALL');
    }
    showToast(`🗑️ Topic "${topic?.label || topicId}" removed.`);
  };

  const handleServicePhotoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingServicePhoto(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1200, 0.84);
      setServiceForm(prev => ({
        ...prev,
        image: compressedDataUrl,
        gallery: prev.gallery?.length > 0 ? [compressedDataUrl, ...prev.gallery.filter(g => g !== compressedDataUrl)] : [compressedDataUrl]
      }));
      showToast('📸 Photo uploaded & compressed!');
    } catch (err) {
      console.error(err);
      showToast('⚠️ Failed to process image file.');
    } finally {
      setIsUploadingServicePhoto(false);
      e.target.value = '';
    }
  };

  const handleServiceGalleryFilesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setIsUploadingServicePhoto(true);
    try {
      const compressedList = await Promise.all(
        files.map(f => compressImageFile(f, 1200, 0.84))
      );
      setServiceForm(prev => {
        const currentGallery = Array.isArray(prev.gallery) ? prev.gallery : [];
        const updatedGallery = [...currentGallery, ...compressedList];
        return {
          ...prev,
          image: prev.image || updatedGallery[0] || '',
          gallery: updatedGallery
        };
      });
      showToast(`📷 Added ${compressedList.length} photo(s) to gallery!`);
    } catch (err) {
      console.error(err);
      showToast('⚠️ Failed to upload one or more photos.');
    } finally {
      setIsUploadingServicePhoto(false);
      e.target.value = '';
    }
  };

  const handleRemoveServiceGalleryPhoto = (idxToRemove) => {
    setServiceForm(prev => {
      const updatedGallery = (prev.gallery || []).filter((_, i) => i !== idxToRemove);
      return {
        ...prev,
        gallery: updatedGallery,
        image: updatedGallery[0] || ''
      };
    });
  };

  const handleAddServiceGalleryUrl = () => {
    const trimmed = galleryUrlInput.trim();
    if (!trimmed) return;
    setServiceForm(prev => {
      const updatedGallery = [...(prev.gallery || []), trimmed];
      return {
        ...prev,
        image: prev.image || trimmed,
        gallery: updatedGallery
      };
    });
    setGalleryUrlInput('');
    showToast('🔗 Photo link added to gallery!');
  };

  const handleServiceVideoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingServiceVideo(true);
    try {
      const { videoUrl, poster, durationText } = await saveVideoFile(file);
      setServiceForm(prev => ({
        ...prev,
        videoUrl,
        image: poster || prev.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000',
        duration: prev.duration || durationText || 'BTS Reel',
        date: prev.date || durationText || 'BTS Reel'
      }));
      showToast('🎬 Video uploaded & saved! Ready to play.');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to upload video file.');
    } finally {
      setIsUploadingServiceVideo(false);
      e.target.value = '';
    }
  };

  const handleSendServiceWhatsApp = (service) => {
    const text = `*SHUBHAANGI — Luxury Bridal Atelier*\n\nNamaste! Inquiring regarding:\n👑 *${service.title}*\n• Category: ${service.categoryLabel || service.type}\n• Price / Details: ${service.price || service.date || 'Consultation'}\n• Location: ${service.location || 'Delhi Atelier'}\n\nPlease share booking availability. Thank you!`;
    const url = `https://wa.me/916397799514?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Actions
  const handleMarkReturned = (orderId) => {
    let returnedItemName = '';
    let returnedDeposit = 0;
    const updated = orders.map(order => {
      if (order.id === orderId) {
        returnedItemName = order.item;
        returnedDeposit = order.deposit || 0;
        return {
          ...order,
          status: 'RETURNED',
          paymentStatus: 'DEPOSIT_REFUNDED'
        };
      }
      return order;
    });
    setOrders(updated);
    saveOrders(updated);
    showToast(`✅ Garment returned: ${returnedItemName}. ₹${returnedDeposit.toLocaleString('en-IN')} security deposit released to bride!`);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          paymentStatus: newStatus === 'RETURNED' ? 'DEPOSIT_REFUNDED' : o.paymentStatus
        };
      }
      return o;
    });
    setOrders(updated);
    saveOrders(updated);
    showToast(`✅ Order #${orderId} status updated to: ${newStatus.replace('_', ' ')}`);
  };

  const handleUpdateProductPrice = (productId, newBuyPrice, newRentPrice) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          buyPrice: Number(newBuyPrice) || p.buyPrice,
          rentPrice3Days: Number(newRentPrice) || p.rentPrice3Days
        };
      }
      return p;
    });
    updateProducts(updated);
    setEditingProduct(null);
    showToast(`✅ Pricing updated and synchronized live with storefront!`);
  };

  const handleCoverFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingCover(true);
      const compressedDataUrl = await compressImageFile(file, 900, 0.76);
      setNewProd(prev => ({ ...prev, img: compressedDataUrl }));
      showToast('✅ Cover photo loaded from your device!');
    } catch (err) {
      alert('Could not process image: ' + err.message);
    } finally {
      setIsUploadingCover(false);
      e.target.value = '';
    }
  };

  const handleExtraFilesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      setIsUploadingGallery(true);
      const compressedList = await Promise.all(
        files.map(f => compressImageFile(f, 900, 0.76))
      );
      setExtraPhotosList(prev => [...prev, ...compressedList]);
      showToast(`✅ Added ${compressedList.length} angle photo(s) from your device!`);
    } catch (err) {
      alert('Could not process images: ' + err.message);
    } finally {
      setIsUploadingGallery(false);
      e.target.value = '';
    }
  };

  const handleRemoveExtraPhoto = (indexToRemove) => {
    setExtraPhotosList(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleManagerFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !photoManagerProduct) return;
    try {
      setIsUploadingManagerPhoto(true);
      const compressedDataUrl = await compressImageFile(file, 900, 0.76);
      handleAddPhotoToProduct(photoManagerProduct.id, compressedDataUrl);
      showToast('✅ New photo uploaded to gallery!');
    } catch (err) {
      alert('Could not upload image: ' + err.message);
    } finally {
      setIsUploadingManagerPhoto(false);
      e.target.value = '';
    }
  };

  const handleAddNewProduct = (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.buyPrice) {
      alert('Please provide garment name and buy price.');
      return;
    }

    const additionalFromTextarea = newProd.galleryUrls
      ? newProd.galleryUrls
          .split(/[\n,]/)
          .map(url => url.trim())
          .filter(url => url.length > 0)
      : [];
    const allExtra = [...extraPhotosList, ...additionalFromTextarea];
    const primaryImg = newProd.img.trim() || allExtra[0] || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000';
    const allImages = [primaryImg, ...allExtra.filter(url => url !== primaryImg)];

    const rawCategory = (newProd.category || 'DRESS').toUpperCase();
    const category = (rawCategory === 'JEWELLERY' || rawCategory === 'MAKEUP') ? rawCategory : 'DRESS';
    const subCategory = category === 'JEWELLERY'
      ? 'Royal Jewellery'
      : (category === 'MAKEUP' ? 'Bridal Makeup' : 'Bridal Lehenga / Saree');

    const created = {
      id: Date.now(),
      name: newProd.name.trim(),
      category,
      subCategory,
      buyPrice: Number(newProd.buyPrice),
      rentPrice3Days: newProd.rentPrice3Days ? Number(newProd.rentPrice3Days) : null,
      rentPrice7Days: newProd.rentPrice7Days ? Number(newProd.rentPrice7Days) : null,
      deposit: newProd.deposit ? Number(newProd.deposit) : 0,
      isRentalAvailable: Boolean(newProd.isRentalAvailable),
      description: newProd.description?.trim() || 'Handcrafted luxury bridal ensemble designed exclusively for the modern Indian bride.',
      fabric: newProd.fabric?.trim() || 'Pure Raw Silk & Fine Organza',
      color: newProd.color?.trim() || 'Bridal Couture',
      img: primaryImg,
      images: allImages,
      availableSizes: ['FREE SIZE'],
      isFeatured: true,
      rating: 5.0,
      reviewCount: 1,
      reviewsCount: 1,
      isNewlyAdded: true
    };

    const updated = [created, ...products];
    updateProducts(updated);
    setIsAddProductOpen(false);
    setNewProd({
      name: '',
      category: 'DRESS',
      buyPrice: '',
      rentPrice3Days: '',
      rentPrice7Days: '',
      deposit: '',
      img: '',
      galleryUrls: '',
      isRentalAvailable: true
    });
    setExtraPhotosList([]);
    setCoverPhotoTab('FILE');
    broadcastNewDressAlert(created);
    const subCount = getStoredSubscribers().length;
    showToast(`🔔 Published "${created.name}" live to Storefront!`, () => onBackToStore && onBackToStore(category));
  };

  const handleAddPhotoToProduct = (productId, photoUrl) => {
    if (!photoUrl || !photoUrl.trim()) return;
    const cleanUrl = photoUrl.trim();
    const updated = products.map(p => {
      if (p.id === productId) {
        const currentImages = (p.images && p.images.length > 0) ? p.images : [p.img].filter(Boolean);
        const nextImages = [...currentImages, cleanUrl];
        return {
          ...p,
          images: nextImages,
          img: p.img || cleanUrl
        };
      }
      return p;
    });
    updateProducts(updated);
    const updatedProd = updated.find(p => p.id === productId);
    setPhotoManagerProduct(updatedProd);
    setNewPhotoUrlInput('');
    showToast(`📸 Photo added to gallery! Total: ${updatedProd.images.length} photos.`);
  };

  const handleRemovePhotoFromProduct = (productId, photoIndex) => {
    const targetProduct = products.find(p => p.id === productId);
    const currentImages = (targetProduct?.images && targetProduct.images.length > 0) 
      ? [...targetProduct.images] 
      : [targetProduct?.img].filter(Boolean);

    if (currentImages.length <= 1) {
      alert('Every dress must keep at least one photo.');
      return;
    }

    const updated = products.map(p => {
      if (p.id === productId) {
        const imgs = [...currentImages];
        imgs.splice(photoIndex, 1);
        return {
          ...p,
          images: imgs,
          img: imgs[0]
        };
      }
      return p;
    });
    updateProducts(updated);
    const updatedProd = updated.find(p => p.id === productId);
    setPhotoManagerProduct(updatedProd);
    showToast(`🗑️ Photo removed from gallery.`);
  };

  const handleSetPrimaryPhoto = (productId, photoUrl) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        const currentImages = (p.images && p.images.length > 0) ? [...p.images] : [p.img].filter(Boolean);
        const reordered = [photoUrl, ...currentImages.filter(u => u !== photoUrl)];
        return {
          ...p,
          img: photoUrl,
          images: reordered
        };
      }
      return p;
    });
    updateProducts(updated);
    const updatedProd = updated.find(p => p.id === productId);
    setPhotoManagerProduct(updatedProd);
    showToast(`⭐ Primary cover photo updated!`);
  };

  const handleToggleRentalAvailability = (productId) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        return { ...p, isRentalAvailable: !p.isRentalAvailable };
      }
      return p;
    });
    updateProducts(updated);
    showToast(`✅ Rental availability updated.`);
  };

  // Offers & Promo Vouchers Handlers
  const handleToggleCoupon = (id) => {
    const updated = coupons.map((c) => {
      if (c.id === id) {
        const nextState = !c.isActive;
        showToast(`Voucher "${c.code}" is now ${nextState ? 'ACTIVE' : 'PAUSED'}!`);
        return { ...c, isActive: nextState };
      }
      return c;
    });
    setCoupons(updated);
    saveCoupons(updated);
  };

  const handleDeleteCoupon = (id, code) => {
    if (!window.confirm(`Are you sure you want to delete promo voucher "${code}"?`)) return;
    const updated = coupons.filter((c) => c.id !== id);
    setCoupons(updated);
    saveCoupons(updated);
    showToast(`Promo voucher "${code}" deleted successfully.`);
  };

  const handleAddNewCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;

    const created = {
      id: `cpn-${Date.now()}`,
      code: newCoupon.code.trim().toUpperCase().replace(/\s+/g, ''),
      type: newCoupon.type,
      value: Number(newCoupon.value) || 0,
      minSubtotal: Number(newCoupon.minSubtotal) || 0,
      description: newCoupon.description.trim() || `${newCoupon.type === 'PERCENTAGE' ? `${newCoupon.value}% off` : `₹${newCoupon.value} off`} bridal booking`,
      validUntil: newCoupon.validUntil.trim() || '31 Dec 2026',
      badge: newCoupon.badge.trim() || 'Seasonal Offer',
      isActive: Boolean(newCoupon.isActive),
      timesUsed: 0
    };

    const updated = [created, ...coupons];
    setCoupons(updated);
    saveCoupons(updated);
    setIsAddCouponOpen(false);
    setNewCoupon({
      code: '',
      type: 'PERCENTAGE',
      value: '',
      minSubtotal: '',
      description: '',
      validUntil: '31 Dec 2026',
      badge: 'Seasonal Offer',
      isActive: true
    });
    broadcastOfferAlert({
      title: `🎉 New Bridal Offer: ${created.badge}`,
      body: `${created.description}! Use voucher code "${created.code}" at SHUBHAANGI Studio.`,
      couponCode: created.code
    });
    showToast(`🔔 New voucher "${created.code}" live & push notification sent to VIP subscribers!`);
  };

  const handleSaveOfferBanner = (e) => {
    e.preventDefault();
    saveOfferBanner(offerBanner);
    if (offerBanner?.enabled) {
      broadcastOfferAlert({
        title: `✨ ${offerBanner.badge || 'LIMITED OFFER'} — SHUBHAANGI Studio`,
        body: `${offerBanner.text}${offerBanner.couponCode ? ` (Use Code: ${offerBanner.couponCode})` : ''}`,
        couponCode: offerBanner.couponCode
      });
    }
    showToast('🔔 Storefront Offer Banner updated & push alert sent to VIP subscribers!');
  };

  const handleQuickAddPreset = (preset) => {
    const created = {
      id: `cpn-${Date.now()}`,
      code: preset.code,
      type: preset.type,
      value: preset.value,
      minSubtotal: preset.minSubtotal,
      description: preset.description,
      validUntil: '31 Dec 2026',
      badge: preset.badge,
      isActive: true,
      timesUsed: 0
    };
    const updated = [created, ...coupons.filter(c => c.code !== preset.code)];
    setCoupons(updated);
    saveCoupons(updated);
    broadcastOfferAlert({
      title: `🎉 Flash Bridal Offer: ${preset.badge}`,
      body: `${preset.description}! Use code "${preset.code}" at checkout.`,
      couponCode: preset.code
    });
    showToast(`🔔 Quick Offer "${preset.code}" enabled & push notification broadcasted!`);
  };

  const handleCopyCode = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(code);
    showToast(`📋 Copied code "${code}" to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-900 font-sans antialiased selection:bg-luxury-gold selection:text-white">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#0d0d0d] text-white px-4 py-3 flex justify-between items-center border-b border-white/10 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2.5">
          <img 
            src="/images/shubhaangi-official-logo.jpg" 
            alt="Logo" 
            className="w-8 h-8 rounded-full object-cover border border-luxury-gold/50 shrink-0"
          />
          <div>
            <h2 className="font-serif text-sm tracking-wider text-white font-bold leading-tight">SHUBHAANGI</h2>
            <span className="text-[9px] text-luxury-gold uppercase tracking-widest block font-medium">Studio OS</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onBackToStore && (
            <button
              onClick={() => onBackToStore()}
              className="px-2.5 py-1 bg-luxury-gold text-black rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm"
              title="Go to Live Storefront"
            >
              <FiEye size={12} />
              <span>Store</span>
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-300 hover:text-white rounded-md hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Desktop & Mobile Sidebar Drawer */}
      <div 
        className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block fixed md:static inset-0 z-50 md:z-auto bg-black/80 md:bg-transparent backdrop-blur-xs transition-opacity`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div 
          className="w-64 max-w-[85vw] h-full shadow-2xl md:shadow-none"
          onClick={(e) => e.stopPropagation()}
        >
          <AdminSidebar
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              setMobileMenuOpen(false);
            }}
            onBackToStore={onBackToStore}
            onLogout={onLogout}
            pendingReturnsCount={pendingReturns.length}
            subscriberCount={subscribers.length}
            offlineOrdersCount={offlineOrders.length}
            studioServicesCount={studioServices.length}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 py-3.5 sm:py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sticky top-0 md:static z-20">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-gray-900 tracking-tight">
              {activeTab === 'OVERVIEW' && 'Executive Business Intelligence'}
              {activeTab === 'OFFLINE_ORDERS' && 'Studio Walk-In Bookings & Offline Register'}
              {activeTab === 'STUDIO_SERVICES' && 'Shoots, Events & Studio Experiences Manager'}
              {activeTab === 'RENTALS' && 'Rental Returns & Escrow Tracker'}
              {activeTab === 'ORDERS' && 'Online Client Bookings CRM'}
              {activeTab === 'INVENTORY' && 'Inventory & Live Pricing Studio'}
              {activeTab === 'COUPONS' && 'Bridal Offers, Promo Vouchers & Discounts'}
              {activeTab === 'NEWSLETTER' && 'Newsletter Users & Push Subscribers'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              B-125, First Floor, Laxmi Nagar, Delhi (Near V3S Mall) • Official Studio Portal
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onBackToStore && (
              <button
                onClick={() => onBackToStore()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-zinc-800 text-white border border-luxury-gold/70 hover:border-luxury-gold rounded-md text-xs font-bold tracking-wider uppercase transition-all shadow-md cursor-pointer hover:scale-[1.02]"
                title="Go to Live Storefront where clients view and order pieces"
              >
                <FiEye className="text-luxury-gold" size={15} />
                <span>View Storefront</span>
              </button>
            )}

            <span className="hidden sm:inline-flex text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full items-center gap-1.5 font-medium shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Storefront Connected
            </span>
          </div>
        </header>

        {/* Toast Notification */}
        {notification && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-md text-xs font-medium flex items-center justify-between gap-3 shadow-sm animate-fade-in">
            <div className="flex items-center gap-2 min-w-0">
              <FiCheck className="text-emerald-600 shrink-0" size={16} />
              <span className="truncate">{notification}</span>
            </div>
            {onBackToStore && (
              <button
                onClick={() => onBackToStore()}
                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[10px] font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer shadow-xs"
              >
                View on Storefront →
              </button>
            )}
          </div>
        )}

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6 sm:space-y-8">
              {/* Dual Business Channels: Online Storefront vs Studio Walk-In Register */}
              <div className="bg-gradient-to-r from-zinc-950 via-[#141414] to-zinc-950 text-white p-4 sm:p-5 rounded-xl border border-luxury-gold/50 shadow-lg">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-luxury-gold/20 text-luxury-gold flex items-center justify-center shrink-0 border border-luxury-gold/40 shadow-sm">
                      <FiBookOpen size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-luxury-gold">
                          Revenue Stream Comparison
                        </span>
                        <span className="text-[9px] bg-white/10 text-gray-300 px-2 py-0.5 rounded font-mono">
                          Online vs Studio Walk-In Counter
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-white mt-0.5">
                        Studio Walk-In Orders vs. Online Storefront
                      </h3>
                    </div>
                  </div>

                  {/* 3 Channel Figures */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="border-b sm:border-b-0 sm:border-r border-white/10 pb-2 sm:pb-0 sm:pr-4">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-semibold">🌐 Online Website</span>
                      <span className="text-base sm:text-lg font-bold font-mono text-emerald-400">₹{totalRevenue.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">{orders.length} digital orders</span>
                    </div>
                    <div className="border-b sm:border-b-0 sm:border-r border-white/10 pb-2 sm:pb-0 sm:pr-4">
                      <span className="text-[10px] text-amber-300 uppercase tracking-wider block font-semibold">🏢 Studio Walk-In Counter</span>
                      <span className="text-base sm:text-lg font-bold font-mono text-amber-400">₹{offlineGrossRevenue.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-gray-300 block mt-0.5">
                        ₹{offlineCollectedRevenue.toLocaleString('en-IN')} cash in-hand • ₹{offlineBalanceDue.toLocaleString('en-IN')} due
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-luxury-gold uppercase tracking-wider block font-semibold">👑 Grand Studio Total</span>
                      <span className="text-base sm:text-lg font-bold font-mono text-luxury-gold">₹{grandCombinedRevenue.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">{orders.length + offlineOrders.length} total clients</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('OFFLINE_ORDERS');
                      setIsAddOfflineOpen(true);
                    }}
                    className="px-4 py-2.5 bg-luxury-gold hover:bg-[#dfb956] text-black text-xs font-bold uppercase tracking-wider rounded-md transition-all shadow-md shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FiPlus size={15} />
                    <span>+ Walk-In Order</span>
                  </button>
                </div>
              </div>

              {/* KPI CARDS (Only visible on Overview) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* Card 1: Gross Revenue */}
                <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200 shadow-xs relative overflow-hidden flex flex-col justify-between hover:border-gray-300 transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold truncate">
                        Gross Store Revenue
                      </p>
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight mt-1 truncate">
                        ₹{totalRevenue.toLocaleString('en-IN')}
                      </h3>
                    </div>
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-full shrink-0">
                      <FiDollarSign size={20} />
                    </div>
                  </div>
                  <div className="pt-2.5 mt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                    <span>Rentals: <strong className="text-emerald-700 font-semibold">₹{rentalRevenue.toLocaleString('en-IN')}</strong></span>
                    <span>Sales: <strong className="text-blue-700 font-semibold">₹{buyRevenue.toLocaleString('en-IN')}</strong></span>
                  </div>
                </div>

                {/* Card 2: Visitors */}
                <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200 shadow-xs relative overflow-hidden flex flex-col justify-between hover:border-gray-300 transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold truncate">
                        Total Store Visitors
                      </p>
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight mt-1 truncate">
                        {visitors.toLocaleString()}
                      </h3>
                    </div>
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-full shrink-0">
                      <FiUsers size={20} />
                    </div>
                  </div>
                  <div className="pt-2.5 mt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                    <span>Active Inquiries: <strong className="font-semibold text-gray-800">{orders.length}</strong></span>
                    <span>Conv. Rate: <strong className="text-indigo-600 font-semibold">{conversionRate}%</strong></span>
                  </div>
                </div>

                {/* Card 3: Active Rentals */}
                <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200 shadow-xs relative overflow-hidden flex flex-col justify-between hover:border-gray-300 transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold truncate">
                        Active Rentals (With Clients)
                      </p>
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-600 tracking-tight mt-1 truncate">
                        {activeRentals.length} Outfits
                      </h3>
                    </div>
                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-full shrink-0">
                      <FiClock size={20} />
                    </div>
                  </div>
                  <div className="pt-2.5 mt-3 border-t border-gray-100 text-xs text-gray-500 truncate">
                    Total Deposits Held: <strong className="text-gray-900 font-semibold">₹{activeRentals.reduce((a, b) => a + (b.deposit || 0), 0).toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                {/* Card 4: Returns Due */}
                <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200 shadow-xs relative overflow-hidden flex flex-col justify-between hover:border-gray-300 transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold truncate">
                        Rental Returns Due
                      </p>
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-rose-600 tracking-tight mt-1 truncate">
                        {pendingReturns.length} Overdue/Today
                      </h3>
                    </div>
                    <div className="p-2.5 bg-rose-50 text-rose-600 rounded-full shrink-0">
                      <FiRepeat size={20} />
                    </div>
                  </div>
                  <div className="pt-2.5 mt-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
                    <span>Completed: <strong className="font-semibold text-gray-800">{returnedRentals.length}</strong></span>
                    <span className="text-rose-600 font-semibold">Returns Tracker</span>
                  </div>
                </div>
              </div>
              {pendingReturns.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 border-l-4 border-l-rose-500 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <FiAlertCircle className="text-rose-600 shrink-0" size={24} />
                    <div>
                      <h4 className="text-sm font-bold text-rose-900">
                        Immediate Attention: {pendingReturns.length} Rental Dress(es) are Due for Return!
                      </h4>
                      <p className="text-xs text-rose-700 mt-0.5">
                        Inspect returned garments and process refundable security deposit handovers.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('RENTALS')}
                    className="w-full sm:w-auto px-4 py-2 bg-rose-600 text-white text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-rose-700 transition-colors shadow-xs text-center shrink-0"
                  >
                    View Returns Due
                  </button>
                </div>
              )}

              {/* Recent Orders List */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-4 sm:p-6">
                <div className="mb-4">
                  <h3 className="text-base sm:text-lg font-serif font-bold text-gray-900">
                    Recent Client Bookings & WhatsApp Inquiries
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Real-time inquiries received from website visitors</p>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-left text-xs sm:text-sm min-w-[700px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                        <th className="px-4 py-3">Order ID</th>
                        <th className="px-4 py-3">Client</th>
                        <th className="px-4 py-3">Outfit</th>
                        <th className="px-4 py-3">Mode</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Direct Chat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="px-4 py-3.5 font-mono text-xs font-bold text-gray-700 whitespace-nowrap">{order.id}</td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div className="font-semibold text-gray-900">{order.customerName}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <FiPhone size={11} /> {order.phone}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-gray-900 font-medium max-w-[200px] truncate">{order.item}</td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 uppercase rounded ${
                                order.mode === 'RENT'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {order.mode === 'RENT' ? `RENT (${order.duration || '3 Days'})` : 'BUY'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-bold text-gray-900 whitespace-nowrap">
                            <div>₹{order.amount.toLocaleString('en-IN')}</div>
                            {(order.transactionId || order.razorpayPaymentId) && (
                              <span className="text-[9px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
                                TXN: {order.transactionId || order.razorpayPaymentId}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span
                              className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase ${
                                order.status === 'RETURN_PENDING'
                                  ? 'bg-rose-100 text-rose-800'
                                  : order.status === 'ACTIVE_RENTAL'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {order.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right whitespace-nowrap">
                            <a
                              href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(order.customerName)},%20SHUBHAANGI%20Studio%20calling%20regarding%20your%20order.`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs bg-[#25D366] text-white px-3 py-1.5 rounded-md hover:bg-[#1eb855] transition-colors shadow-2xs font-medium"
                            >
                              <FiMessageCircle size={13} /> Chat
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RENTAL RETURNS & ESCROW MANAGEMENT */}
          {activeTab === 'RENTALS' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-4 sm:p-6">
                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-serif font-bold text-gray-900">
                    Rental Outfits & Return Due Tracker
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Track all garments currently with brides, return deadlines, and security deposit releases.
                  </p>
                </div>

                <div className="space-y-4">
                  {orders.filter(o => o.mode === 'RENT').length === 0 ? (
                    <div className="text-center py-12 text-gray-400 border border-dashed border-gray-200 rounded-lg">
                      <FiRepeat size={32} className="mx-auto mb-2 opacity-40 text-luxury-gold" />
                      <p className="text-sm font-medium text-gray-600">No active rental orders found.</p>
                    </div>
                  ) : (
                    orders.filter(o => o.mode === 'RENT').map((rental) => (
                      <RentalTimelineCard
                        key={rental.id}
                        rental={rental}
                        onMarkReturned={handleMarkReturned}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ALL ORDERS */}
          {activeTab === 'ORDERS' && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 sm:mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-gray-900">All Client Orders & WhatsApp Bookings</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Update status, track fulfillment, or initiate direct client concierge chat.</p>
                </div>
                <div className="text-xs text-gray-500 font-semibold bg-gray-100 px-3 py-1 rounded-full">
                  Total: {orders.length} Records
                </div>
              </div>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-xs sm:text-sm min-w-[780px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Item</th>
                      <th className="px-4 py-3">Mode</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Concierge Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-4 py-3.5 font-mono text-xs font-bold text-gray-700 whitespace-nowrap">{o.id}</td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="font-semibold text-gray-900">{o.customerName}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <FiPhone size={11} /> {o.phone}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-medium text-gray-900 max-w-[200px] truncate">{o.item}</td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 uppercase rounded ${
                              o.mode === 'RENT'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {o.mode === 'RENT' ? `RENT (${o.duration || '3 Days'})` : 'BUY'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-bold text-gray-900 whitespace-nowrap">
                          <div>₹{o.amount.toLocaleString('en-IN')}</div>
                          {(o.transactionId || o.razorpayPaymentId) && (
                            <span className="text-[9px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
                              TXN: {o.transactionId || o.razorpayPaymentId}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                            className="text-xs font-semibold px-2.5 py-1.5 border border-gray-300 rounded-md bg-white shadow-2xs focus:border-black outline-none cursor-pointer"
                          >
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="FITTING_SCHEDULED">FITTING SCHEDULED</option>
                            <option value="DISPATCHED">DISPATCHED</option>
                            <option value="ACTIVE_RENTAL">ACTIVE RENTAL</option>
                            <option value="RETURN_PENDING">RETURN PENDING</option>
                            <option value="RETURNED">RETURNED</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <a
                            href={`https://wa.me/${(o.phone || '916397799514').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Hello ${o.customerName}, this is SHUBHAANGI Luxury Couture regarding your order #${o.id} (${o.item}). Current status: ${o.status.replace('_', ' ')}.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs bg-[#25D366] text-white px-3 py-1.5 rounded-md hover:bg-[#1eb855] transition-colors shadow-2xs font-medium"
                          >
                            <FiMessageCircle size={13} /> Chat
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: INVENTORY & PRICING EDITOR */}
          {activeTab === 'INVENTORY' && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-gray-900">
                    Catalog, Pricing & Rental Availability Manager
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Live pricing editor: changes reflect immediately on the customer storefront.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={15} />
                    <input
                      type="text"
                      placeholder="Search dresses/jewellery..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-56 pl-9 pr-3 py-2 border border-gray-300 rounded-md text-xs focus:border-black outline-none bg-white"
                    />
                  </div>
                  <button
                    onClick={() => setIsAddProductOpen(true)}
                    className="px-4 py-2 bg-black text-white hover:bg-luxury-gold text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0"
                  >
                    <FiPlus size={14} />
                    <span>Add New Dress</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {products
                  .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((product) => (
                    <div
                      key={product.id}
                      className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50/50 hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all"
                    >
                      {/* Product Thumbnail */}
                      <div className="relative w-full sm:w-28 sm:h-36 h-48 shrink-0 rounded-md overflow-hidden bg-zinc-900 border border-gray-200">
                        <img
                          src={product.img}
                          alt={product.name}
                          className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute bottom-1.5 right-1.5 bg-black/85 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-medium flex items-center gap-1 shadow-sm">
                          <FiImage size={10} className="text-luxury-gold" /> {product.images?.length || 1}
                        </span>
                      </div>

                      {/* Content block */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                            <span className="text-[10px] uppercase tracking-wider text-amber-800 font-bold bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded">
                              {product.category}
                            </span>
                            <button
                              onClick={() => handleToggleRentalAvailability(product.id)}
                              className={`text-[10px] px-2.5 py-0.5 rounded font-bold uppercase transition-colors shrink-0 ${
                                product.isRentalAvailable
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                            >
                              {product.isRentalAvailable ? 'Rental Active' : 'Buy Only'}
                            </button>
                          </div>
                          <h4 className="font-serif font-bold text-sm sm:text-base text-gray-900 leading-snug break-words line-clamp-2 mb-2">
                            {product.name}
                          </h4>
                        </div>

                        {editingProduct === product.id ? (
                          <div className="mt-2.5 p-3.5 bg-amber-50/50 border border-amber-200/80 rounded-md space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                              <span>Update Live Pricing</span>
                              <span className="text-[10px] text-gray-500 font-normal">Immediate sync</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div>
                                <label className="text-[10px] text-gray-600 uppercase block font-bold mb-1">Buy Price (₹):</label>
                                <input
                                  type="number"
                                  id={`buy-${product.id}`}
                                  defaultValue={product.buyPrice}
                                  className="w-full text-xs p-2 border border-gray-300 rounded bg-white focus:border-black outline-none font-semibold"
                                />
                              </div>
                              {product.isRentalAvailable && (
                                <div>
                                  <label className="text-[10px] text-gray-600 uppercase block font-bold mb-1">3-Day Rent Fee (₹):</label>
                                  <input
                                    type="number"
                                    id={`rent-${product.id}`}
                                    defaultValue={product.rentPrice3Days}
                                    className="w-full text-xs p-2 border border-gray-300 rounded bg-white focus:border-black outline-none font-semibold"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                onClick={() => {
                                  const newBuy = document.getElementById(`buy-${product.id}`).value;
                                  const newRent = document.getElementById(`rent-${product.id}`)?.value;
                                  handleUpdateProductPrice(product.id, newBuy, newRent);
                                }}
                                className="px-4 py-1.5 bg-black hover:bg-luxury-gold text-white text-xs font-semibold rounded shadow-xs transition-colors"
                              >
                                Save Changes
                              </button>
                              <button
                                onClick={() => setEditingProduct(null)}
                                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="space-y-1 text-xs text-gray-700 bg-gray-50/70 p-2.5 rounded-md border border-gray-100">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-500">Buy Price:</span>
                                <span className="font-bold text-gray-900">₹{product.buyPrice?.toLocaleString('en-IN')}</span>
                              </div>
                              {product.isRentalAvailable ? (
                                <div className="flex justify-between items-center text-emerald-800">
                                  <span>3-Day Rent Fee:</span>
                                  <span className="font-bold">₹{product.rentPrice3Days?.toLocaleString('en-IN')}</span>
                                </div>
                              ) : (
                                <div className="flex justify-between items-center text-gray-400 italic">
                                  <span>Rental Option:</span>
                                  <span>Disabled</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-gray-100 flex-wrap">
                              <button
                                onClick={() => setEditingProduct(product.id)}
                                className="text-xs text-gray-700 hover:text-black font-semibold flex items-center gap-1.5 py-1 px-2.5 rounded bg-white border border-gray-200 hover:bg-gray-100 transition-colors shadow-2xs"
                              >
                                <FiEdit2 size={12} /> Edit Pricing
                              </button>
                              <button
                                onClick={() => {
                                  setPhotoManagerProduct(product);
                                  setNewPhotoUrlInput('');
                                }}
                                className="text-xs text-amber-900 hover:text-black font-semibold flex items-center gap-1.5 py-1 px-2.5 rounded bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
                              >
                                <FiImage size={12} /> Manage Photos ({product.images?.length || 1})
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 5: OFFERS, PROMO VOUCHERS & DISCOUNTS */}
          {activeTab === 'COUPONS' && (
            <div className="space-y-6">
              {/* Top Banner & Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
                      Active Live Offers
                    </span>
                    <span className="text-2xl font-serif font-bold text-gray-900 mt-1 block">
                      {coupons.filter(c => c.isActive !== false).length}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium">
                      Accepted at Checkout & Studio
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                    <FiPercent size={18} />
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
                      Total Redemptions
                    </span>
                    <span className="text-2xl font-serif font-bold text-gray-900 mt-1 block">
                      {coupons.reduce((sum, c) => sum + (c.timesUsed || 0), 0)}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Brides Saved on Commissions
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold shrink-0">
                    <FiTag size={18} />
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
                      Storefront Banner
                    </span>
                    <span className={`text-xs font-semibold mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${
                      offerBanner.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${offerBanner.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                      {offerBanner.enabled ? 'LIVE ON SITE' : 'PAUSED'}
                    </span>
                    <span className="text-[10px] text-gray-500 block mt-1">
                      Top Marquee Promo Bar
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                    <FiVolume2 size={18} />
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col justify-center">
                  <button
                    onClick={() => setIsAddCouponOpen(true)}
                    className="w-full py-3 bg-black text-white hover:bg-luxury-gold uppercase text-xs font-semibold tracking-wider rounded-md transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <FiPlus size={16} />
                    <span>Create New Voucher</span>
                  </button>
                  <span className="text-[10px] text-gray-400 text-center mt-1.5">
                    Instant sync with storefront checkout
                  </span>
                </div>
              </div>

              {/* 1. STOREFRONT PROMOTIONAL ANNOUNCEMENT BANNER CONTROLLER */}
              <div className="bg-white rounded-lg border border-amber-200 shadow-xs p-4 sm:p-6 bg-gradient-to-br from-white via-amber-50/15 to-amber-100/10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-black text-luxury-gold rounded-md shrink-0">
                        <FiVolume2 size={16} />
                      </span>
                      <h3 className="text-base font-serif font-bold text-gray-900">
                        Top Storefront Promotional Banner Settings
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-900 rounded shrink-0">
                        Live Bar
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Display promotional announcement, active voucher code, and atelier perks across the very top of the website.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                      <span>Enable on Storefront:</span>
                      <input
                        type="checkbox"
                        checked={Boolean(offerBanner.enabled)}
                        onChange={(e) => {
                          const updated = { ...offerBanner, enabled: e.target.checked };
                          setOfferBanner(updated);
                          saveOfferBanner(updated);
                          showToast(`Storefront banner ${e.target.checked ? 'ENABLED' : 'DISABLED'}!`);
                        }}
                        className="w-4 h-4 text-black accent-black cursor-pointer rounded"
                      />
                    </label>
                  </div>
                </div>

                {/* Banner Live Preview */}
                <div className="my-4 p-3 bg-[#111] text-luxury-gold rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs shadow-inner">
                  <div className="flex items-center gap-2 overflow-hidden min-w-0">
                    <span className="px-2 py-0.5 bg-luxury-gold/20 text-luxury-gold text-[10px] font-bold rounded uppercase shrink-0">
                      {offerBanner.badge || 'PROMO'}
                    </span>
                    <span className="truncate text-gray-200 text-xs">
                      {offerBanner.text}
                    </span>
                  </div>
                  {offerBanner.couponCode && (
                    <span className="font-mono font-bold text-luxury-gold border-b border-luxury-gold text-xs shrink-0 self-end sm:self-auto">
                      Code: {offerBanner.couponCode}
                    </span>
                  )}
                </div>

                {/* Form to edit banner */}
                <form onSubmit={handleSaveOfferBanner} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={offerBanner.badge || ''}
                      onChange={(e) => setOfferBanner({ ...offerBanner, badge: e.target.value })}
                      placeholder="e.g. FESTIVE SPECIAL"
                      className="w-full p-2.5 border border-gray-200 rounded-md outline-none focus:border-black bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-semibold text-gray-700 block mb-1">Announcement Message</label>
                    <input
                      type="text"
                      value={offerBanner.text || ''}
                      onChange={(e) => setOfferBanner({ ...offerBanner, text: e.target.value })}
                      placeholder="e.g. Use code ROYAL10 for 10% Off | Free Bespoke Fitting by Designer Deepak Kumar"
                      className="w-full p-2.5 border border-gray-200 rounded-md outline-none focus:border-black bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Highlighted Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={offerBanner.couponCode || ''}
                        onChange={(e) => setOfferBanner({ ...offerBanner, couponCode: e.target.value.toUpperCase() })}
                        placeholder="e.g. ROYAL10"
                        className="w-full p-2.5 border border-gray-200 rounded-md uppercase font-mono outline-none focus:border-black bg-white"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-black text-white hover:bg-luxury-gold uppercase tracking-wider font-semibold rounded-md shrink-0 transition-colors shadow-xs"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* 2. PROMO VOUCHERS MANAGEMENT SUITE */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-gray-900">
                      Active Bridal Discount Vouchers & Coupons
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Clients can apply these codes in their shopping bag to unlock instant flat or percentage discounts.
                    </p>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-[11px] text-gray-400 uppercase font-semibold">Quick Add:</span>
                    <button
                      onClick={() => handleQuickAddPreset({
                        code: 'SANGEET10',
                        type: 'PERCENTAGE',
                        value: 10,
                        minSubtotal: 10000,
                        description: '10% Sangeet & Reception Celebration Discount',
                        badge: 'Sangeet Special'
                      })}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-black hover:text-white border border-gray-200 rounded-md text-[11px] font-medium transition-colors"
                    >
                      + 10% Sangeet
                    </button>
                    <button
                      onClick={() => handleQuickAddPreset({
                        code: 'BRIDAL2000',
                        type: 'FLAT',
                        value: 2000,
                        minSubtotal: 15000,
                        description: 'Flat ₹2,000 Courtesy Gift on Bridal Commissions',
                        badge: 'VIP Bridal'
                      })}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-black hover:text-white border border-gray-200 rounded-md text-[11px] font-medium transition-colors"
                    >
                      + ₹2,000 Flat
                    </button>
                    <button
                      onClick={() => handleQuickAddPreset({
                        code: 'DESTINATION20',
                        type: 'PERCENTAGE',
                        value: 20,
                        minSubtotal: 25000,
                        description: '20% Destination Bride Special on 7-Day Rentals',
                        badge: 'Destination Bride'
                      })}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-black hover:text-white border border-gray-200 rounded-md text-[11px] font-medium transition-colors"
                    >
                      + 20% Destination
                    </button>
                  </div>
                </div>

                {/* Filters and Search Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'ALL', label: `All (${coupons.length})` },
                      { id: 'ACTIVE', label: `Active (${coupons.filter(c => c.isActive !== false).length})` },
                      { id: 'PAUSED', label: `Paused (${coupons.filter(c => c.isActive === false).length})` },
                      { id: 'PERCENTAGE', label: `Percentage %` },
                      { id: 'FLAT', label: `Flat ₹` }
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => setCouponFilter(btn.id)}
                        className={`px-3 py-1.5 text-xs rounded-md transition-all font-medium ${
                          couponFilter === btn.id
                            ? 'bg-black text-white shadow-xs'
                            : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-64">
                    <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="Search voucher code or name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-md outline-none focus:border-black"
                    />
                  </div>
                </div>

                {/* Vouchers Grid */}
                {coupons
                  .filter(c => {
                    const matchesFilter = 
                      couponFilter === 'ALL' ? true :
                      couponFilter === 'ACTIVE' ? (c.isActive !== false) :
                      couponFilter === 'PAUSED' ? (c.isActive === false) :
                      couponFilter === 'PERCENTAGE' ? (c.type === 'PERCENTAGE' || c.type === 'PERCENT') :
                      couponFilter === 'FLAT' ? (c.type === 'FLAT') : true;

                    const matchesSearch = !searchQuery || 
                      c.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      c.description?.toLowerCase().includes(searchQuery.toLowerCase());

                    return matchesFilter && matchesSearch;
                  })
                  .length === 0 ? (
                  <div className="py-12 text-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <FiTag size={32} className="mx-auto mb-2 opacity-40 text-luxury-gold" />
                    <p className="text-sm font-medium text-gray-700">No vouchers found matching your filter.</p>
                    <button
                      onClick={() => setIsAddCouponOpen(true)}
                      className="mt-3 px-4 py-2 bg-black text-white text-xs uppercase tracking-wider font-semibold rounded-md hover:bg-luxury-gold transition-colors"
                    >
                      + Create New Voucher
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {coupons
                      .filter(c => {
                        const matchesFilter = 
                          couponFilter === 'ALL' ? true :
                          couponFilter === 'ACTIVE' ? (c.isActive !== false) :
                          couponFilter === 'PAUSED' ? (c.isActive === false) :
                          couponFilter === 'PERCENTAGE' ? (c.type === 'PERCENTAGE' || c.type === 'PERCENT') :
                          couponFilter === 'FLAT' ? (c.type === 'FLAT') : true;

                        const matchesSearch = !searchQuery || 
                          c.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description?.toLowerCase().includes(searchQuery.toLowerCase());

                        return matchesFilter && matchesSearch;
                      })
                      .map((coupon) => {
                        const isPercentage = coupon.type === 'PERCENTAGE' || coupon.type === 'PERCENT';
                        const isActive = coupon.isActive !== false;

                        return (
                          <div
                            key={coupon.id || coupon.code}
                            className={`p-4 sm:p-5 rounded-lg border transition-all relative overflow-hidden flex flex-col justify-between ${
                              isActive
                                ? 'border-amber-200 bg-gradient-to-b from-white to-amber-50/20 shadow-xs hover:shadow-md'
                                : 'border-gray-200 bg-gray-50/70 opacity-75'
                            }`}
                          >
                            {/* Top Row: Code + Copy + Status Toggle */}
                            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-xs sm:text-sm bg-black text-luxury-gold px-2.5 py-1 rounded-md tracking-wider shadow-xs">
                                  {coupon.code}
                                </span>
                                <button
                                  onClick={() => handleCopyCode(coupon.code)}
                                  className="p-1 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
                                  title="Copy voucher code"
                                >
                                  {copiedCode === coupon.code ? <FiCheck size={14} className="text-emerald-600" /> : <FiCopy size={14} />}
                                </button>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleToggleCoupon(coupon.id)}
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider cursor-pointer transition-colors ${
                                    isActive
                                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                  }`}
                                  title={isActive ? 'Click to Pause' : 'Click to Activate'}
                                >
                                  {isActive ? '● Active' : '○ Paused'}
                                </button>

                                <button
                                  onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                                  className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                  title="Delete Voucher"
                                >
                                  <FiTrash2 size={14} />
                                </button>
                              </div>
                            </div>

                            {/* Middle: Discount Value & Description */}
                            <div className="space-y-1.5 mb-4">
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
                                  {isPercentage ? `${coupon.value}% OFF` : `₹${Number(coupon.value).toLocaleString('en-IN')} OFF`}
                                </span>
                                {coupon.badge && (
                                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded">
                                    {coupon.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 leading-snug font-medium line-clamp-2">
                                {coupon.description}
                              </p>
                            </div>

                            {/* Bottom Row: Min Order & Usage */}
                            <div className="pt-3 border-t border-gray-200/80 flex items-center justify-between text-[11px] text-gray-500">
                              <span>
                                Min: <strong className="text-gray-700 font-semibold">₹{(coupon.minSubtotal || 0).toLocaleString('en-IN')}</strong>
                              </span>
                              <span className="font-mono text-gray-600">
                                {coupon.timesUsed || 0} used
                              </span>
                              <span className="text-[10px] text-gray-400">
                                Till: {coupon.validUntil || 'Ongoing'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* ADD PRODUCT MODAL */}
        {isAddProductOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white max-w-xl w-full p-5 sm:p-6 rounded-lg shadow-2xl relative border border-gray-200 my-auto max-h-[92vh] overflow-y-auto">
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
              <h3 className="text-base sm:text-lg font-serif font-bold text-gray-900 mb-0.5">
                Add New Couture Creation
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Will be immediately published to the live client collection with rent/buy options.
              </p>

              <form onSubmit={handleAddNewProduct} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold block mb-1 text-gray-800">Garment / Set Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Emerald Raw Silk Bridal Lehenga"
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:border-black outline-none bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-gray-800">Category</label>
                    <select
                      value={newProd.category}
                      onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:border-black outline-none bg-white cursor-pointer"
                    >
                      <option value="DRESS">Bridal Lehenga / Saree</option>
                      <option value="JEWELLERY">Bridal Jewellery</option>
                      <option value="MAKEUP">Bridal Makeup</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-gray-800">Buy Price (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 145000"
                      value={newProd.buyPrice}
                      onChange={(e) => setNewProd({ ...newProd, buyPrice: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:border-black outline-none bg-white font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-gray-800">Rent 3-Days (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 14500"
                      value={newProd.rentPrice3Days}
                      onChange={(e) => setNewProd({ ...newProd, rentPrice3Days: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:border-black outline-none bg-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-gray-800">Rent 7-Days (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 22000"
                      value={newProd.rentPrice7Days}
                      onChange={(e) => setNewProd({ ...newProd, rentPrice7Days: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:border-black outline-none bg-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-gray-800">Deposit (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 15000"
                      value={newProd.deposit}
                      onChange={(e) => setNewProd({ ...newProd, deposit: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:border-black outline-none bg-white font-semibold"
                    />
                  </div>
                </div>

                {/* ── 1. PRIMARY COVER PHOTO (DEVICE UPLOAD OR URL) ── */}
                <div className="bg-gray-50/90 p-3.5 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-bold text-gray-800 flex items-center gap-1.5">
                      <span>Primary Cover Photo *</span>
                      {newProd.img && (
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1">
                          <FiCheckCircle size={11} /> Photo Loaded
                        </span>
                      )}
                    </label>

                    {/* Switch between Device File and Web URL */}
                    <div className="flex bg-white rounded-md p-0.5 border border-gray-300 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setCoverPhotoTab('FILE')}
                        className={`px-2.5 py-1 rounded transition-colors ${
                          coverPhotoTab === 'FILE'
                            ? 'bg-black text-white shadow-xs'
                            : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        📱 Phone / PC File
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoverPhotoTab('URL')}
                        className={`px-2.5 py-1 rounded transition-colors ${
                          coverPhotoTab === 'URL'
                            ? 'bg-black text-white shadow-xs'
                            : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        🔗 Image Link
                      </button>
                    </div>
                  </div>

                  {coverPhotoTab === 'FILE' ? (
                    <div>
                      {newProd.img ? (
                        <div className="flex items-center gap-3 bg-white p-2.5 rounded-md border border-gray-200">
                          <div className="w-16 h-20 rounded bg-zinc-950 overflow-hidden relative border border-gray-200 shrink-0">
                            <img
                              src={newProd.img}
                              alt="Cover Preview"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">Cover Image Selected</p>
                            <p className="text-[10px] text-emerald-600 font-medium">✓ Compressed & ready for storefront</p>
                            <div className="flex items-center gap-2 mt-2">
                              <label className="cursor-pointer text-[10px] px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-bold border border-gray-300 transition-colors">
                                Change Photo
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleCoverFileChange}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => setNewProd(prev => ({ ...prev, img: '' }))}
                                className="text-[10px] text-rose-600 hover:underline font-bold"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-gray-300 hover:border-black rounded-lg bg-white cursor-pointer transition-colors group">
                          {isUploadingCover ? (
                            <div className="flex items-center gap-2 text-gray-600 py-3">
                              <FiLoader size={20} className="animate-spin text-luxury-gold" />
                              <span className="text-xs font-semibold">Optimizing & processing photo...</span>
                            </div>
                          ) : (
                            <>
                              <div className="w-10 h-10 rounded-full bg-luxury-gold/15 text-luxury-gold flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <FiCamera size={20} />
                              </div>
                              <span className="text-xs font-bold text-gray-900 text-center">
                                Tap to Choose Photo from Phone Gallery / PC
                              </span>
                              <span className="text-[10px] text-gray-500 text-center mt-0.5">
                                JPG, PNG, WEBP — automatically optimized for ultra-fast loading
                              </span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={isUploadingCover}
                            onChange={handleCoverFileChange}
                          />
                        </label>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... or paste image link"
                        value={newProd.img}
                        onChange={(e) => setNewProd({ ...newProd, img: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:border-black outline-none bg-white font-mono text-xs"
                      />
                      <p className="text-[10px] text-gray-400 mt-1">Direct URL to the image file</p>
                    </div>
                  )}
                </div>

                {/* ── 2. ADDITIONAL MODEL & ANGLE PHOTOS (MULTI-UPLOAD & URL) ── */}
                <div className="bg-gray-50/90 p-3.5 rounded-lg border border-gray-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-bold text-gray-800 block">
                        Additional Model & Angle Photos
                      </label>
                      <span className="text-[10px] text-gray-500">
                        Back view, close-up embroidery, dupatta drape (Optional)
                      </span>
                    </div>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-luxury-gold text-white text-[11px] font-bold rounded-md transition-colors shadow-xs">
                      {isUploadingGallery ? (
                        <>
                          <FiLoader size={12} className="animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <FiUploadCloud size={13} />
                          <span>+ Add from Device</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        disabled={isUploadingGallery}
                        onChange={handleExtraFilesChange}
                      />
                    </label>
                  </div>

                  {/* Preview of extra photos added from device */}
                  {extraPhotosList.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-1">
                      {extraPhotosList.map((photo, pIdx) => (
                        <div key={pIdx} className="relative aspect-[3/4] rounded-md overflow-hidden bg-zinc-950 border border-gray-300 group shadow-xs">
                          <img src={photo} alt="" className="w-full h-full object-contain" />
                          <button
                            type="button"
                            onClick={() => handleRemoveExtraPhoto(pIdx)}
                            className="absolute top-1 right-1 w-5 h-5 bg-black/80 hover:bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] transition-colors"
                            title="Remove"
                          >
                            <FiX size={11} />
                          </button>
                          <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[8px] px-1 py-0.2 rounded font-mono">
                            #{pIdx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Or enter URLs */}
                  <div>
                    <input
                      type="text"
                      placeholder="Or paste extra image URLs (comma-separated)..."
                      value={newProd.galleryUrls}
                      onChange={(e) => setNewProd({ ...newProd, galleryUrls: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:border-black outline-none font-mono text-[11px] bg-white"
                    />
                  </div>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-black text-white hover:bg-luxury-gold uppercase tracking-wider font-semibold rounded-md transition-colors shadow-xs"
                  >
                    Publish to Storefront
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddProductOpen(false)}
                    className="px-5 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PHOTO GALLERY MANAGER MODAL */}
        {photoManagerProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white max-w-2xl w-full p-4 sm:p-6 rounded-lg shadow-2xl relative border border-gray-200 my-auto max-h-[90vh] flex flex-col">
              <button
                onClick={() => setPhotoManagerProduct(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                title="Close"
              >
                <FiX size={20} />
              </button>

              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="p-2 bg-black text-luxury-gold rounded-md shrink-0">
                  <FiImage size={18} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-serif font-bold text-gray-900 truncate">
                    Model & Lookbook Photo Gallery Manager
                  </h3>
                  <span className="text-xs text-amber-800 font-medium block truncate">
                    {photoManagerProduct.name}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Manage all camera angles, close-ups, and lookbook photos for this garment. Clients will see all these angles with the multi-image viewer in the popup modal!
              </p>

              {/* Current Photos Grid */}
              <div className="mb-5 flex-1 min-h-0">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Garment Photos ({(photoManagerProduct.images?.length || 1)})
                  </label>
                  <span className="text-[11px] text-gray-400">
                    Cover photo is displayed on catalog cards
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3 overflow-y-auto max-h-[46vh] p-1">
                  {(photoManagerProduct.images && photoManagerProduct.images.length > 0 
                    ? photoManagerProduct.images 
                    : [photoManagerProduct.img].filter(Boolean)
                  ).map((photoUrl, idx) => {
                    const isCover = photoUrl === photoManagerProduct.img || idx === 0;
                    return (
                      <div 
                        key={idx} 
                        className={`relative rounded-md border-2 overflow-hidden group bg-zinc-900 flex flex-col justify-between ${
                          isCover ? 'border-luxury-gold shadow-sm ring-1 ring-luxury-gold' : 'border-gray-200'
                        }`}
                      >
                        <div className="aspect-[3/4] w-full overflow-hidden bg-zinc-800 relative">
                          <img 
                            src={photoUrl} 
                            alt={`Angle ${idx + 1}`} 
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform" 
                          />
                          {/* Badges */}
                          <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                            {isCover ? (
                              <span className="bg-luxury-gold text-black font-bold text-[9px] px-1.5 py-0.5 rounded shadow-sm">
                                ★ COVER
                              </span>
                            ) : (
                              <span className="bg-black/80 text-white text-[9px] px-1.5 py-0.5 rounded">
                                Angle #{idx + 1}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quick actions bar */}
                        <div className="p-2 bg-white flex items-center justify-between gap-1 border-t border-gray-100 text-xs">
                          {!isCover ? (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryPhoto(photoManagerProduct.id, photoUrl)}
                              className="text-[10px] text-amber-900 hover:text-black font-bold hover:underline truncate"
                              title="Set as main cover photo"
                            >
                              Make Cover
                            </button>
                          ) : (
                            <span className="text-[10px] text-gray-400 font-medium">Main Cover</span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemovePhotoFromProduct(photoManagerProduct.id, idx)}
                            className="text-gray-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors shrink-0"
                            title="Remove photo"
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add New Photo Form (Direct Phone/PC Upload or URL) */}
              <div className="bg-gray-50 p-3.5 border border-gray-200 rounded-md mb-4 shrink-0 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-bold text-gray-800 block">
                      Add New Photo to this Dress
                    </label>
                    <p className="text-[11px] text-gray-500">
                      Upload directly from your phone/PC gallery, or paste an image URL below:
                    </p>
                  </div>

                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-black hover:bg-luxury-gold text-white text-xs font-bold rounded-md transition-colors shadow-xs shrink-0">
                    {isUploadingManagerPhoto ? (
                      <>
                        <FiLoader size={13} className="animate-spin text-luxury-gold" />
                        <span>Optimizing & Uploading...</span>
                      </>
                    ) : (
                      <>
                        <FiCamera size={14} />
                        <span>📱 Choose Photo from Device</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploadingManagerPhoto}
                      onChange={handleManagerFileChange}
                    />
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-gray-200">
                  <input
                    type="url"
                    placeholder="Or paste high-resolution image URL (https://...)"
                    value={newPhotoUrlInput}
                    onChange={(e) => setNewPhotoUrlInput(e.target.value)}
                    className="flex-1 p-2 text-xs border border-gray-300 rounded-md focus:border-black outline-none bg-white font-mono"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddPhotoToProduct(photoManagerProduct.id, newPhotoUrlInput);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddPhotoToProduct(photoManagerProduct.id, newPhotoUrlInput)}
                    className="px-4 py-2 bg-gray-900 text-white hover:bg-luxury-gold text-xs font-semibold rounded-md shrink-0 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FiPlus size={14} />
                    <span>Add URL</span>
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-2 border-t border-gray-100 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const prodName = photoManagerProduct.name;
                    setPhotoManagerProduct(null);
                    showToast(`✅ Photo gallery saved for "${prodName}". Live on storefront!`);
                  }}
                  className="px-6 py-2.5 bg-black text-white hover:bg-luxury-gold text-xs font-semibold uppercase tracking-wider rounded-md transition-colors shadow-xs"
                >
                  Done & Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADD PROMO VOUCHER MODAL */}
        {isAddCouponOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white max-w-lg w-full p-5 sm:p-6 rounded-lg shadow-2xl relative border border-gray-200 my-auto max-h-[92vh] overflow-y-auto">
              <button
                onClick={() => setIsAddCouponOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 bg-black text-luxury-gold rounded-md shrink-0">
                  <FiTag size={16} />
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-gray-900">
                  Create New Promo Voucher
                </h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Will be immediately recognized at checkout bag and in studio rental calculations.
              </p>

              <form onSubmit={handleAddNewCoupon} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold block mb-1 text-gray-800">
                    Voucher Code * (Letters & Numbers, e.g. DIWALI20)
                  </label>
                  <input
                    type="text"
                    required
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase().replace(/\s+/g, '') })}
                    placeholder="e.g. DIWALI20, BRIDAL15, NOOR2500"
                    className="w-full p-2.5 border border-gray-300 rounded-md uppercase font-mono font-bold tracking-wider outline-none focus:border-black bg-gray-50 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-gray-800">Discount Type *</label>
                    <select
                      value={newCoupon.type}
                      onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-md outline-none focus:border-black bg-white cursor-pointer"
                    >
                      <option value="PERCENTAGE">Percentage (%) Off</option>
                      <option value="FLAT">Flat Cash (₹) Off</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-gray-800">
                      Discount Value * {newCoupon.type === 'PERCENTAGE' ? '(%)' : '(₹)'}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newCoupon.value}
                      onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })}
                      placeholder={newCoupon.type === 'PERCENTAGE' ? 'e.g. 15 (for 15%)' : 'e.g. 2000 (for ₹2,000)'}
                      className="w-full p-2.5 border border-gray-300 rounded-md outline-none focus:border-black bg-white font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-gray-800">Minimum Order Subtotal (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newCoupon.minSubtotal}
                      onChange={(e) => setNewCoupon({ ...newCoupon, minSubtotal: e.target.value })}
                      placeholder="e.g. 5000"
                      className="w-full p-2.5 border border-gray-300 rounded-md outline-none focus:border-black bg-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-gray-800">Badge / Occasion Tag</label>
                    <input
                      type="text"
                      value={newCoupon.badge}
                      onChange={(e) => setNewCoupon({ ...newCoupon, badge: e.target.value })}
                      placeholder="e.g. Festive Offer, VIP Bridal"
                      className="w-full p-2.5 border border-gray-200 rounded-md outline-none focus:border-black bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-gray-800">Offer Title / Description *</label>
                  <input
                    type="text"
                    required
                    value={newCoupon.description}
                    onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                    placeholder="e.g. 15% Festive Privilege on all Sangeet & Reception bookings"
                    className="w-full p-2.5 border border-gray-300 rounded-md outline-none focus:border-black bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-gray-800">Validity / Expiry Note</label>
                    <input
                      type="text"
                      value={newCoupon.validUntil}
                      onChange={(e) => setNewCoupon({ ...newCoupon, validUntil: e.target.value })}
                      placeholder="e.g. 31 Dec 2026"
                      className="w-full p-2.5 border border-gray-300 rounded-md outline-none focus:border-black bg-white"
                    />
                  </div>
                  <div className="flex items-center pt-2 sm:pt-6">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-800">
                      <input
                        type="checkbox"
                        checked={newCoupon.isActive}
                        onChange={(e) => setNewCoupon({ ...newCoupon, isActive: e.target.checked })}
                        className="w-4 h-4 accent-black rounded"
                      />
                      <span>Make Active Immediately</span>
                    </label>
                  </div>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-black text-white hover:bg-luxury-gold uppercase tracking-wider font-semibold rounded-md transition-colors shadow-xs"
                  >
                    Publish & Activate Voucher
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddCouponOpen(false)}
                    className="px-5 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── OFFLINE STUDIO ORDERS TAB (WALK-IN POS & DESK REGISTER) ── */}
        {activeTab === 'OFFLINE_ORDERS' && (() => {
          const filteredOffline = offlineOrders.filter(o => {
            const q = offlineSearch.toLowerCase();
            const matchesQuery = !q ||
              (o.customerName && o.customerName.toLowerCase().includes(q)) ||
              (o.customerPhone && o.customerPhone.includes(q)) ||
              (o.item && o.item.toLowerCase().includes(q)) ||
              (o.id && o.id.toLowerCase().includes(q));

            const matchesFilter = offlineFilter === 'ALL'
              || (offlineFilter === 'DUE' && o.balanceDue > 0)
              || (offlineFilter === 'IN_ALTERATION' && o.status === 'IN_ALTERATION')
              || (offlineFilter === 'READY' && o.status === 'READY_FOR_PICKUP')
              || (offlineFilter === 'RENT' && o.mode === 'RENT')
              || (offlineFilter === 'BUY' && o.mode === 'BUY');

            return matchesQuery && matchesFilter;
          });

          return (
            <div className="space-y-6">
              {/* Dedicated Offline Khata Banner */}
              <div className="bg-gradient-to-r from-stone-950 via-zinc-900 to-stone-950 text-white p-5 rounded-xl border border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40 shadow-sm text-2xl">
                    📖
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-400">
                        Studio Offline Khata Register
                      </span>
                      <span className="text-[9px] bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded font-bold">
                        दुकान का खाता बही
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-0.5">
                      Physical Walk-In Ledger & Counter Bookings
                    </h2>
                    <p className="text-xs text-gray-300 mt-0.5">
                      Pure offline walk-in orders, cash/UPI advances, pending balance dues, alteration fitting notes, and WhatsApp slips — 100% isolated from website metrics.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAddOfflineOpen(true)}
                  className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-md shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FiPlus size={16} />
                  <span>+ New Walk-In Customer</span>
                </button>
              </div>

              {/* Top Revenue & Performance Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">Total Offline Value</p>
                      <h3 className="text-2xl font-serif font-bold text-gray-900 mt-1">₹{offlineGrossRevenue.toLocaleString('en-IN')}</h3>
                    </div>
                    <div className="p-2.5 bg-amber-50 text-amber-700 rounded-full">
                      <FiDollarSign size={18} />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2 pt-2 border-t border-gray-100 flex justify-between">
                    <span>{offlineOrders.length} Walk-in Bookings</span>
                    <span className="font-semibold text-gray-800">Counter Sales</span>
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-emerald-700 font-semibold">Cash / UPI In-Hand</p>
                      <h3 className="text-2xl font-serif font-bold text-emerald-700 mt-1">₹{offlineCollectedRevenue.toLocaleString('en-IN')}</h3>
                    </div>
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-full">
                      <FiCheckCircle size={18} />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2 pt-2 border-t border-gray-100 flex justify-between">
                    <span>Advance Collected</span>
                    <span className="text-emerald-700 font-semibold">{((offlineCollectedRevenue / Math.max(1, offlineGrossRevenue)) * 100).toFixed(0)}% Paid</span>
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-rose-700 font-semibold">Pending Balance Due</p>
                      <h3 className="text-2xl font-serif font-bold text-rose-700 mt-1">₹{offlineBalanceDue.toLocaleString('en-IN')}</h3>
                    </div>
                    <div className="p-2.5 bg-rose-50 text-rose-600 rounded-full">
                      <FiAlertCircle size={18} />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2 pt-2 border-t border-gray-100 flex justify-between">
                    <span>To Collect at Delivery</span>
                    <span className="text-rose-600 font-semibold">{offlineOrders.filter(o => o.balanceDue > 0).length} Clients Pending</span>
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-indigo-700 font-semibold">Security Deposits Held</p>
                      <h3 className="text-2xl font-serif font-bold text-indigo-700 mt-1">₹{offlineDepositsHeld.toLocaleString('en-IN')}</h3>
                    </div>
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-full">
                      <FiRepeat size={18} />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2 pt-2 border-t border-gray-100 flex justify-between">
                    <span>Refundable Escrow</span>
                    <span className="text-indigo-700 font-semibold">Rental Security</span>
                  </p>
                </div>
              </div>

              {/* Action & Filter Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white p-3.5 rounded-lg border border-gray-200">
                <div className="relative flex-1 min-w-[220px]">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search bride name, phone, outfit, or slip #..."
                    value={offlineSearch}
                    onChange={(e) => setOfflineSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-md focus:border-black outline-none bg-gray-50 focus:bg-white"
                  />
                </div>

                <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {[
                    { id: 'ALL', label: 'All Orders' },
                    { id: 'DUE', label: '⚠️ Balance Due' },
                    { id: 'IN_ALTERATION', label: '✂️ In Alteration' },
                    { id: 'READY', label: '🛍️ Ready Pickup' },
                    { id: 'RENT', label: '👗 Rentals' },
                    { id: 'BUY', label: '👑 Purchases' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setOfflineFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-md text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                        offlineFilter === tab.id
                          ? 'bg-black text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsAddOfflineOpen(true)}
                  className="px-4 py-2 bg-luxury-gold hover:bg-[#dfb956] text-black text-xs font-bold uppercase tracking-wider rounded-md transition-colors shadow-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <FiPlus size={14} />
                  <span>+ Record Walk-In Order</span>
                </button>
              </div>

              {/* Offline Orders Table */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
                <div className="p-3.5 bg-gray-50 border-b border-gray-200 flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-800 uppercase tracking-wider text-[11px]">
                    Walk-In Studio Bookings ({filteredOffline.length} Records)
                  </span>
                  <span className="text-gray-500 text-[11px]">
                    Replaces paper registers • Syncs across all studio devices
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50/50 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                        <th className="p-3">Order Slip</th>
                        <th className="p-3">Bride / Client</th>
                        <th className="p-3">Outfit & Service</th>
                        <th className="p-3">Financials & Balance</th>
                        <th className="p-3">Key Dates</th>
                        <th className="p-3">Fitting / Notes</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOffline.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-gray-400">
                            No walk-in bookings found. Tap <strong>"+ Record Walk-In Order"</strong> to add an offline order!
                          </td>
                        </tr>
                      ) : (
                        filteredOffline.map((order) => {
                          const hasDue = order.balanceDue > 0;
                          return (
                            <tr key={order.id} className="hover:bg-amber-50/30 transition-colors">
                              {/* Order Slip ID */}
                              <td className="p-3 align-top">
                                <span className="font-mono font-bold text-gray-900 block">{order.id}</span>
                                <span className="text-[10px] text-gray-400 block">{order.bookingDate}</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold uppercase tracking-wider inline-block mt-1">
                                  Studio POS
                                </span>
                              </td>

                              {/* Bride details */}
                              <td className="p-3 align-top min-w-[140px]">
                                <span className="font-bold text-gray-900 block text-xs">{order.customerName}</span>
                                <div className="flex items-center gap-1 text-[11px] text-gray-600 mt-0.5">
                                  <FiPhone size={11} className="text-gray-400 shrink-0" />
                                  <span>{order.customerPhone}</span>
                                </div>
                              </td>

                              {/* Outfit & Service */}
                              <td className="p-3 align-top min-w-[180px]">
                                <span className="font-medium text-gray-900 block leading-snug">{order.item}</span>
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                                    order.mode === 'RENT' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {order.mode === 'RENT' ? 'Bridal Rental' : 'Purchase / Custom'}
                                  </span>
                                  {order.deposit > 0 && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-mono">
                                      Dep: ₹{order.deposit.toLocaleString('en-IN')}
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Financials & Balance */}
                              <td className="p-3 align-top min-w-[160px]">
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center text-[11px]">
                                    <span className="text-gray-500">Agreed Total:</span>
                                    <strong className="font-mono text-gray-900">₹{order.amount.toLocaleString('en-IN')}</strong>
                                  </div>
                                  <div className="flex justify-between items-center text-[11px]">
                                    <span className="text-gray-500">Advance Paid:</span>
                                    <span className="font-mono text-emerald-700 font-bold">₹{order.advancePaid.toLocaleString('en-IN')}</span>
                                  </div>
                                  <div className="pt-1 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Balance:</span>
                                    {hasDue ? (
                                      <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                                        ₹{order.balanceDue.toLocaleString('en-IN')} DUE
                                      </span>
                                    ) : (
                                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                                        ✓ ALL PAID
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[9px] text-gray-400 block text-right font-mono">
                                    Via: {order.paymentMethod}
                                  </span>
                                </div>
                              </td>

                              {/* Key Dates */}
                              <td className="p-3 align-top min-w-[130px] text-[11px]">
                                <div className="space-y-0.5">
                                  <div>
                                    <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-semibold">Wedding Date</span>
                                    <strong className="text-gray-800">{order.eventDate || '—'}</strong>
                                  </div>
                                  {order.returnDate && (
                                    <div className="pt-1">
                                      <span className="text-[9px] uppercase tracking-wider text-rose-500 block font-semibold">Return Due</span>
                                      <span className="text-rose-700 font-bold">{order.returnDate}</span>
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Fitting / Alteration Notes */}
                              <td className="p-3 align-top min-w-[160px] max-w-[200px]">
                                {order.notes ? (
                                  <div className="p-1.5 bg-gray-50 rounded border border-gray-200 text-[11px] text-gray-700">
                                    <div className="flex items-center gap-1 text-[9px] uppercase text-amber-800 font-bold mb-0.5">
                                      <FiScissors size={10} />
                                      <span>Measurements / Fitting</span>
                                    </div>
                                    <p className="line-clamp-3 leading-snug">{order.notes}</p>
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-[11px]">Standard Size</span>
                                )}
                              </td>

                              {/* Status Dropdown */}
                              <td className="p-3 align-top">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleUpdateOfflineStatus(order.id, e.target.value)}
                                  className="w-full text-[11px] p-1.5 border border-gray-300 rounded font-semibold focus:border-black outline-none bg-white cursor-pointer"
                                >
                                  <option value="CONFIRMED">Confirmed</option>
                                  <option value="IN_ALTERATION">In Alteration</option>
                                  <option value="READY_FOR_PICKUP">Ready for Pickup</option>
                                  <option value="COLLECTED">Collected / With Bride</option>
                                  <option value="RETURNED">Returned (Deposit Back)</option>
                                  <option value="COMPLETED">Completed</option>
                                </select>
                              </td>

                              {/* Actions */}
                              <td className="p-3 align-top text-right min-w-[130px]">
                                <div className="flex flex-col gap-1.5 items-end">
                                  {/* Send WhatsApp Slip */}
                                  <button
                                    onClick={() => handleSendWhatsAppReceipt(order)}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors shadow-xs w-full justify-center cursor-pointer"
                                    title="Send WhatsApp booking slip to bride"
                                  >
                                    <FiMessageCircle size={12} />
                                    <span>WhatsApp Slip</span>
                                  </button>

                                  {/* Collect Balance Button if Due */}
                                  {hasDue && (
                                    <button
                                      onClick={() => handleCollectOfflineBalance(order.id)}
                                      className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-black rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors shadow-xs w-full justify-center cursor-pointer"
                                      title="Mark remaining balance as paid"
                                    >
                                      <FiCreditCard size={11} />
                                      <span>Clear Balance</span>
                                    </button>
                                  )}

                                  {/* Delete */}
                                  <button
                                    onClick={() => handleDeleteOfflineOrder(order.id)}
                                    className="text-gray-400 hover:text-rose-600 text-[10px] font-medium hover:underline p-0.5 cursor-pointer"
                                  >
                                    Delete Record
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                  <span>Showing {filteredOffline.length} of {offlineOrders.length} offline bookings</span>
                  <button
                    onClick={() => setIsAddOfflineOpen(true)}
                    className="font-bold text-luxury-gold hover:underline uppercase tracking-wider text-[11px] cursor-pointer"
                  >
                    + Add Another Walk-In Client
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ADD OFFLINE STUDIO ORDER MODAL */}
        {isAddOfflineOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white max-w-xl w-full p-5 sm:p-6 rounded-lg shadow-2xl relative border border-gray-200 my-auto max-h-[92vh] overflow-y-auto">
              <button
                onClick={() => setIsAddOfflineOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <FiX size={20} />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <span className="p-2 bg-black text-luxury-gold rounded-md shrink-0">
                  <FiBookOpen size={18} />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-gray-900 leading-tight">
                    Record Studio Walk-In Order
                  </h3>
                  <p className="text-xs text-gray-500">
                    Offline studio register • Auto-calculates balance and sends WhatsApp slip
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateOfflineOrder} className="space-y-3.5 text-xs mt-3">
                {/* Client Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-gray-800">Bride / Client Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Simran Gill"
                      value={newOfflineOrder.customerName}
                      onChange={(e) => setNewOfflineOrder({ ...newOfflineOrder, customerName: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:border-black outline-none bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-gray-800">WhatsApp / Mobile Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98XXX XXXXX"
                      value={newOfflineOrder.customerPhone}
                      onChange={(e) => setNewOfflineOrder({ ...newOfflineOrder, customerPhone: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:border-black outline-none bg-white font-mono"
                    />
                  </div>
                </div>

                {/* Outfit & Category */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-semibold text-gray-800">Outfit / Bridal Set Name *</label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          const chosen = products.find(p => p.name === e.target.value);
                          if (chosen) {
                            setNewOfflineOrder(prev => ({
                              ...prev,
                              item: chosen.name,
                              category: chosen.category,
                              amount: prev.mode === 'RENT' ? (chosen.rentPrice3Days || chosen.buyPrice) : chosen.buyPrice,
                              deposit: chosen.deposit || 0
                            }));
                          }
                        }
                      }}
                      className="text-[10px] text-gray-500 bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 cursor-pointer"
                    >
                      <option value="">Quick Pick from Studio Catalog</option>
                      {products.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Maroon Velvet Zardozi Bridal Lehenga + Double Dupatta"
                    value={newOfflineOrder.item}
                    onChange={(e) => setNewOfflineOrder({ ...newOfflineOrder, item: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:border-black outline-none bg-white"
                  />
                </div>

                {/* Category & Order Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-gray-800">Category</label>
                    <select
                      value={newOfflineOrder.category}
                      onChange={(e) => setNewOfflineOrder({ ...newOfflineOrder, category: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:border-black outline-none bg-white cursor-pointer"
                    >
                      <option value="DRESS">Bridal Lehenga / Saree</option>
                      <option value="JEWELLERY">Bridal Jewellery</option>
                      <option value="MAKEUP">Bridal Makeup Package</option>
                      <option value="SHERWANI">Groom Sherwani</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-gray-800">Order Type</label>
                    <select
                      value={newOfflineOrder.mode}
                      onChange={(e) => setNewOfflineOrder({ ...newOfflineOrder, mode: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:border-black outline-none bg-white cursor-pointer"
                    >
                      <option value="RENT">Bridal Rental (3/7 Days)</option>
                      <option value="BUY">Bespoke Purchase / Stitching</option>
                    </select>
                  </div>
                </div>

                {/* Pricing & Advance */}
                <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200 space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold block mb-1 text-gray-800">Total Agreed Price (₹) *</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 18500"
                        value={newOfflineOrder.amount}
                        onChange={(e) => setNewOfflineOrder({ ...newOfflineOrder, amount: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:border-black outline-none bg-white font-mono font-bold text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1 text-emerald-700">Advance Paid (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 8500"
                        value={newOfflineOrder.advancePaid}
                        onChange={(e) => setNewOfflineOrder({ ...newOfflineOrder, advancePaid: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:border-black outline-none bg-white font-mono font-bold text-emerald-700"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1 text-gray-800">Security Deposit (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 15000"
                        value={newOfflineOrder.deposit}
                        onChange={(e) => setNewOfflineOrder({ ...newOfflineOrder, deposit: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:border-black outline-none bg-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Auto Balance calculation preview */}
                  <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">Payment Method:</span>
                    <div className="flex gap-2">
                      {['UPI_QR', 'CASH', 'CARD', 'SPLIT'].map(method => (
                        <label key={method} className="flex items-center gap-1 cursor-pointer text-[11px] font-semibold text-gray-700">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method}
                            checked={newOfflineOrder.paymentMethod === method}
                            onChange={(e) => setNewOfflineOrder({ ...newOfflineOrder, paymentMethod: e.target.value })}
                            className="accent-black"
                          />
                          <span>{method === 'UPI_QR' ? 'UPI' : method}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-2 rounded border border-gray-200 flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-700">Auto Calculated Balance Due upon delivery:</span>
                    <strong className="font-mono text-sm text-rose-600 font-bold">
                      ₹{Math.max(0, (Number(newOfflineOrder.amount) || 0) - (Number(newOfflineOrder.advancePaid) || 0)).toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                {/* Important Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-gray-800">Wedding / Function Date</label>
                    <input
                      type="text"
                      placeholder="e.g. 15 Nov 2026"
                      value={newOfflineOrder.eventDate}
                      onChange={(e) => setNewOfflineOrder({ ...newOfflineOrder, eventDate: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:border-black outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-gray-800">Rental Return Due Date</label>
                    <input
                      type="text"
                      placeholder="e.g. 18 Nov 2026 (if rental)"
                      value={newOfflineOrder.returnDate}
                      onChange={(e) => setNewOfflineOrder({ ...newOfflineOrder, returnDate: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:border-black outline-none bg-white"
                    />
                  </div>
                </div>

                {/* Custom Measurements & Fitting Notes */}
                <div>
                  <label className="font-semibold block mb-1 text-gray-800">
                    Fitting, Measurements & Blouse Alteration Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Chest 34, Waist 28, Height 5'4. Extra 2-inch sleeve margin. Double cancan flare requested."
                    value={newOfflineOrder.notes}
                    onChange={(e) => setNewOfflineOrder({ ...newOfflineOrder, notes: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:border-black outline-none bg-white text-xs"
                  />
                </div>

                {/* Submit buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-black text-white hover:bg-luxury-gold uppercase tracking-wider font-semibold rounded-md transition-colors shadow-xs cursor-pointer"
                  >
                    Save Walk-In Booking to Register
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddOfflineOpen(false)}
                    className="px-5 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── NEWSLETTER USERS TAB ─────────────────────────────────── */}
        {activeTab === 'NEWSLETTER' && (() => {
          const pushGranted = subscribers.filter(s => s.pushGranted).length;
          const whatsappSubs = subscribers.filter(s => s.contact && (s.contact.includes('+') || /^\d{10}/.test(s.contact.replace(/\s/g,'')))).length;

          const nlFiltered = subscribers.filter(sub => {
            const q = nlSearch.toLowerCase();
            const matchQ = !q || sub.name?.toLowerCase().includes(q) || sub.contact?.toLowerCase().includes(q);
            const matchF = nlFilter === 'ALL'
              || (nlFilter === 'PUSH' && sub.pushGranted)
              || (nlFilter === 'NO_PUSH' && !sub.pushGranted)
              || (nlFilter === 'DRESS' && sub.notifyNewDresses)
              || (nlFilter === 'OFFERS' && sub.notifyOffers);
            return matchQ && matchF;
          });

          const handleDeleteSub = (subId) => {
            if (!window.confirm('Remove this subscriber from the list?')) return;
            const updated = subscribers.filter(s => s.id !== subId);
            setSubscribers(updated);
            try { localStorage.setItem('shubhaangi_vip_subscribers', JSON.stringify(updated)); } catch {}
            showToast('Subscriber removed.');
          };

          const handleBroadcastToAll = async () => {
            if (!window.confirm(`Send a push notification to all ${subscribers.length} subscribers now?`)) return;
            await broadcastOfferAlert({
              title: '🌟 SHUBHAANGI — Latest Bridal Collection',
              body: 'New arrivals & exclusive offers are live now! Visit the studio or book a trial appointment.',
              couponCode: 'ROYAL10'
            });
            showToast(`✅ Broadcast sent to ${subscribers.length} subscribers!`);
          };

          return (
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: 'Total Subscribers', value: subscribers.length, color: 'text-gray-900', bg: 'bg-white' },
                  { label: 'Push Granted', value: pushGranted, color: 'text-emerald-700', bg: 'bg-emerald-50' },
                  { label: 'WhatsApp / Phone', value: whatsappSubs, color: 'text-green-700', bg: 'bg-green-50' },
                  { label: 'Email Subscribers', value: subscribers.length - whatsappSubs, color: 'text-blue-700', bg: 'bg-blue-50' },
                ].map(({ label, value, color, bg }) => (
                  <div key={label} className={`${bg} rounded-lg border border-gray-200 p-3 sm:p-4`}>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">{label}</p>
                    <p className={`text-2xl sm:text-3xl font-bold font-serif mt-1 ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="relative flex-1 max-w-xs">
                  <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search name or contact..."
                    value={nlSearch}
                    onChange={e => setNlSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {['ALL','PUSH','NO_PUSH','DRESS','OFFERS'].map(f => (
                    <button
                      key={f}
                      onClick={() => setNlFilter(f)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${nlFilter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {f === 'NO_PUSH' ? 'No Push' : f === 'DRESS' ? '👗 Dresses' : f === 'OFFERS' ? '🏷️ Offers' : f === 'PUSH' ? '🔔 Push On' : 'All'}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleBroadcastToAll}
                  className="ml-auto flex items-center gap-2 px-4 py-2 bg-luxury-gold hover:bg-[#dfb956] text-black text-xs font-bold uppercase tracking-wider rounded-md transition-colors shadow-sm"
                >
                  <FiVolume2 size={13} /> Broadcast to All
                </button>
              </div>

              {/* Subscriber table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {['#','Name','WhatsApp / Email','Joined','👗 Dresses','🏷️ Offers','🔔 Push','Action'].map(h => (
                          <th key={h} className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wider text-gray-500 font-semibold whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {nlFiltered.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-10 text-center text-gray-400">
                            No subscribers found{nlSearch ? ` for "${nlSearch}"` : ''}.
                          </td>
                        </tr>
                      ) : nlFiltered.map((sub, idx) => (
                        <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-3 text-gray-400 font-mono">{idx + 1}</td>
                          <td className="px-3 py-3 font-semibold text-gray-800 whitespace-nowrap">{sub.name || '—'}</td>
                          <td className="px-3 py-3 text-gray-600 max-w-[160px] truncate">{sub.contact || '—'}</td>
                          <td className="px-3 py-3 text-gray-500 whitespace-nowrap">{sub.joinedAt || '—'}</td>
                          <td className="px-3 py-3 text-center">
                            <span className={`inline-flex w-5 h-5 rounded-full text-white text-[10px] items-center justify-center font-bold ${sub.notifyNewDresses ? 'bg-emerald-500' : 'bg-gray-200 text-gray-400'}`}>
                              {sub.notifyNewDresses ? '✓' : '✗'}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span className={`inline-flex w-5 h-5 rounded-full text-white text-[10px] items-center justify-center font-bold ${sub.notifyOffers ? 'bg-emerald-500' : 'bg-gray-200 text-gray-400'}`}>
                              {sub.notifyOffers ? '✓' : '✗'}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${sub.pushGranted ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                              {sub.pushGranted ? 'Granted' : 'Denied'}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <button
                              onClick={() => handleDeleteSub(sub.id)}
                              className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"
                              title="Remove subscriber"
                            >
                              <FiTrash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-200 text-[10px] text-gray-500">
                  Showing {nlFiltered.length} of {subscribers.length} subscribers • Data stored in browser localStorage
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── SHOOTS, EVENTS & STUDIO SERVICES TAB ────────────────── */}
        {activeTab === 'STUDIO_SERVICES' && (() => {
          const filteredServices = studioServices.filter(service => {
            const matchesCategory = serviceCategoryFilter === 'ALL' || service.type === serviceCategoryFilter;
            const q = serviceSearch.toLowerCase().trim();
            const matchesSearch = !q ||
              service.title?.toLowerCase().includes(q) ||
              service.subtitle?.toLowerCase().includes(q) ||
              service.location?.toLowerCase().includes(q) ||
              service.price?.toLowerCase().includes(q) ||
              service.description?.toLowerCase().includes(q);
            return matchesCategory && matchesSearch;
          });

          const activeCount = studioServices.filter(s => s.isActive !== false).length;

          const getPrimaryAddLabel = (cat) => {
            if (cat === 'BTS_VIDEOS') return '🎬 Upload BTS Video';
            if (cat === 'PHOTOSHOOT') return '📷 Upload Shoot Photos';
            if (cat === 'PORTFOLIO') return '🌟 Upload Portfolio Photos';
            if (cat === 'EVENTS') return '🎪 Add Event';
            if (cat === 'PREWEDDING') return '📸 Add Pre-Wedding';
            if (cat === 'MAKEUP') return '💄 Add Makeup Look';
            if (cat === 'PRE_BRIDAL') return '👰 Add Pre-Bridal';
            return '+ Add New Entry';
          };

          return (
            <div className="p-4 sm:p-6 lg:p-8 space-y-5">
              {/* Clean Single-Row Studio Header & Category Filter */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-serif font-bold text-gray-900">
                        Studio Media, Shoots & Menus
                      </h2>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        {activeCount} Live
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Each section has its own dedicated uploader — Videos in BTS, Photo Galleries in Photoshoots, Posters in Events.
                    </p>
                  </div>

                  {/* Clean Search + Primary Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative w-full sm:w-52">
                      <FiSearch className="absolute left-3 top-2 text-gray-400" size={14} />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={serviceSearch}
                        onChange={(e) => setServiceSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:border-black outline-none bg-gray-50 focus:bg-white"
                      />
                    </div>

                    <button
                      onClick={() => setIsAddTopicOpen(true)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <FiPlus size={14} />
                      <span>Category</span>
                    </button>

                    <button
                      onClick={() => handleOpenAddService(serviceCategoryFilter === 'ALL' ? (studioTopics[0]?.id || 'PREWEDDING') : serviceCategoryFilter)}
                      className="px-4 py-1.5 bg-black hover:bg-luxury-gold hover:text-black text-white text-xs font-bold rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{getPrimaryAddLabel(serviceCategoryFilter)}</span>
                    </button>
                  </div>
                </div>

                {/* Clean Horizontal Category Tabs */}
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-3 border-t border-gray-100 items-center">
                  <button
                    onClick={() => setServiceCategoryFilter('ALL')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      serviceCategoryFilter === 'ALL'
                        ? 'bg-black text-white shadow-2xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All ({studioServices.length})
                  </button>
                  {studioTopics.map((topic) => {
                    const count = studioServices.filter(s => s.type === topic.id).length;
                    const isSelected = serviceCategoryFilter === topic.id;
                    return (
                      <button
                        key={topic.id}
                        onClick={() => setServiceCategoryFilter(topic.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-luxury-gold text-black font-bold shadow-2xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <span>{topic.icon || '✨'}</span>
                        <span>{topic.label || topic.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-black/15 text-black' : 'bg-gray-200 text-gray-600'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Compact Quick-Add Template Strip (Only when a specific category is selected) */}
                {(() => {
                  const activeTopic = studioTopics.find(t => t.id === serviceCategoryFilter);
                  if (!activeTopic) return null;
                  const config = getCategoryConfig(activeTopic.id);
                  return (
                    <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-amber-50/60 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 px-4 sm:px-5 py-3 rounded-b-xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                          <span>⚡ Quick Sample ({activeTopic.label || activeTopic.name}):</span>
                        </span>
                        {config.presets && config.presets.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleOpenAddService(activeTopic.id, preset)}
                            className="px-2.5 py-1 bg-white hover:bg-black hover:text-white text-gray-800 rounded-md border border-amber-200/80 text-[11px] font-medium flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer group"
                          >
                            <span>+ {preset.title}</span>
                            {preset.price && (
                              <span className="font-mono font-bold text-amber-700 group-hover:text-luxury-gold text-[10px]">{preset.price}</span>
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {studioTopics.length > 1 && (
                          <button
                            onClick={() => handleDeleteTopic(activeTopic.id)}
                            className="text-[11px] text-gray-400 hover:text-rose-600 px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1"
                            title={`Delete "${activeTopic.label}" category`}
                          >
                            <FiTrash2 size={13} />
                            <span>Delete Category</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Service Cards Grid */}
              {filteredServices.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
                  <p className="text-gray-400 text-sm mb-3">No items uploaded in this category yet.</p>
                  <button
                    onClick={() => handleOpenAddService(serviceCategoryFilter === 'ALL' ? 'PREWEDDING' : serviceCategoryFilter)}
                    className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-luxury-gold hover:text-black transition-colors cursor-pointer"
                  >
                    {getPrimaryAddLabel(serviceCategoryFilter)}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredServices.map((service) => {
                    const typeMeta = studioTopics.find(t => t.id === service.type) || { icon: '✨', label: service.categoryLabel || service.type };
                    const isServiceActive = service.isActive !== false;
                    const isVideoCard = service.type === 'BTS_VIDEOS' || Boolean(service.videoUrl);
                    const galleryPhotos = Array.isArray(service.gallery) && service.gallery.length > 0
                      ? service.gallery
                      : (service.image ? [service.image] : []);

                    return (
                      <div
                        key={service.id}
                        className={`bg-white rounded-xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                          isServiceActive ? 'border-gray-200' : 'border-gray-300 bg-gray-50/70 opacity-75'
                        }`}
                      >
                        <div>
                          {/* Media Banner: Video Player for BTS_VIDEOS, Photo/Gallery for others */}
                          <div className="h-52 w-full bg-zinc-950 relative overflow-hidden group">
                            {isVideoCard && service.videoUrl ? (
                              <SmartVideoPlayer
                                videoUrl={service.videoUrl}
                                poster={service.image}
                                className="w-full h-full object-cover"
                              />
                            ) : service.image ? (
                              <>
                                <img
                                  src={service.image}
                                  alt={service.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent pointer-events-none" />
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-zinc-800 to-zinc-950 text-luxury-gold">
                                {typeMeta.icon}
                              </div>
                            )}

                            {/* Top Badges */}
                            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
                              <span className="px-2.5 py-1 bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 border border-white/10">
                                <span>{typeMeta.icon}</span>
                                <span>{typeMeta.label}</span>
                              </span>

                              <div className="flex items-center gap-1">
                                {isVideoCard && (
                                  <span className="px-2 py-0.5 bg-rose-600 text-white text-[9px] font-bold uppercase tracking-wider rounded shadow-xs flex items-center gap-1">
                                    <FiPlay size={9} className="fill-current" /> VIDEO
                                  </span>
                                )}
                                {!isVideoCard && galleryPhotos.length > 1 && (
                                  <span className="px-2 py-0.5 bg-black/80 text-luxury-gold text-[9px] font-bold uppercase tracking-wider rounded border border-luxury-gold/40">
                                    📷 {galleryPhotos.length} Photos
                                  </span>
                                )}
                                {service.badge && (
                                  <span className="px-2 py-0.5 bg-luxury-gold text-black text-[9px] font-bold uppercase tracking-wider rounded shadow-xs">
                                    {service.badge}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Bottom Price / Duration inside Non-Video Image */}
                            {!isVideoCard && (
                              <div className="absolute bottom-2.5 left-3 right-3 text-white pointer-events-none flex items-center justify-between">
                                {service.price ? (
                                  <span className="text-xs font-mono font-bold text-luxury-gold bg-black/75 px-2 py-0.5 rounded">
                                    {service.price}
                                  </span>
                                ) : <span />}
                                {(service.duration || service.date) && (
                                  <span className="text-[11px] font-medium text-white bg-black/70 px-2 py-0.5 rounded">
                                    ⏱️ {service.duration || service.date}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Mini Thumbnail Strip for Multi-Photo Galleries (Photoshoot / Portfolio) */}
                          {!isVideoCard && galleryPhotos.length > 1 && (
                            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                              {galleryPhotos.map((photoUrl, gIdx) => (
                                <img
                                  key={gIdx}
                                  src={photoUrl}
                                  alt={`Shot ${gIdx + 1}`}
                                  className="w-10 h-10 rounded object-cover border border-gray-300 shrink-0"
                                />
                              ))}
                              <span className="text-[10px] text-gray-400 font-medium pl-1 whitespace-nowrap">
                                {galleryPhotos.length} photos in gallery
                              </span>
                            </div>
                          )}

                          {/* Content Body */}
                          <div className="p-4 space-y-2">
                            <div>
                              <h4 className="text-base font-serif font-bold text-gray-900 leading-snug">
                                {service.title}
                              </h4>
                              {service.subtitle && (
                                <p className="text-xs text-gray-500 font-medium mt-0.5">
                                  {service.subtitle}
                                </p>
                              )}
                            </div>

                            {/* Duration / Schedule Pill for Video or Events */}
                            {isVideoCard && (service.duration || service.date) && (
                              <div className="inline-flex items-center gap-1 text-[11px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 font-medium">
                                <span>🎬</span>
                                <span>{service.duration || service.date}</span>
                              </div>
                            )}

                            {/* Special Detail Highlight */}
                            {service.specialDetail && (
                              <div className="text-[11px] text-stone-700 bg-stone-100/80 px-2.5 py-1 rounded-md border border-stone-200 font-medium flex items-center gap-1.5">
                                <span className="text-luxury-gold">✨</span>
                                <span className="truncate">{service.specialDetail}</span>
                              </div>
                            )}

                            {service.description && (
                              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                {service.description}
                              </p>
                            )}

                            {/* Features list (hide on pure BTS video if empty) */}
                            {Array.isArray(service.features) && service.features.length > 0 && service.type !== 'BTS_VIDEOS' && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {service.features.slice(0, 4).map((feat, fIdx) => (
                                  <span
                                    key={fIdx}
                                    className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] rounded-md font-medium flex items-center gap-1"
                                  >
                                    <span className="text-emerald-600 font-bold">✓</span>
                                    <span>{feat}</span>
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Location */}
                            {service.location && (
                              <div className="text-[11px] text-gray-500 flex items-center gap-1.5 pt-1 border-t border-gray-100">
                                <FiMapPin size={12} className="text-luxury-gold shrink-0" />
                                <span className="truncate">{service.location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Card Actions Footer */}
                        <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-2 text-xs">
                          <button
                            onClick={() => handleToggleServiceActive(service.id)}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                              isServiceActive
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${isServiceActive ? 'bg-emerald-600' : 'bg-gray-400'}`}></span>
                            <span>{isServiceActive ? 'Active' : 'Hidden'}</span>
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditService(service)}
                              className="px-2.5 py-1 bg-gray-900 hover:bg-luxury-gold hover:text-black text-white rounded text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <FiEdit2 size={12} />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => handleDeleteService(service.id)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                              title="Delete entry"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* ── CATEGORY-SPECIFIC UPLOAD & ADD MODAL ──────────────────── */}
        {isAddServiceOpen && (() => {
          const activeConfig = getCategoryConfig(serviceForm.type);
          const isBtsVideo = serviceForm.type === 'BTS_VIDEOS';
          const isPhotoGalleryOnly = serviceForm.type === 'PHOTOSHOOT' || serviceForm.type === 'PORTFOLIO';
          const isEvent = serviceForm.type === 'EVENTS';
          const isPreWedding = serviceForm.type === 'PREWEDDING';

          const getModalHeaderText = () => {
            if (isBtsVideo) return {
              title: editingService ? 'Edit BTS Video / Reel' : 'Upload BTS Video / Reel',
              sub: 'Upload a behind-the-scenes MP4/MOV video from your phone/PC or paste a video link'
            };
            if (isPhotoGalleryOnly) return {
              title: editingService ? `Edit ${activeConfig.categoryTitle}` : `Upload ${activeConfig.categoryTitle} Photos`,
              sub: 'Select single or multiple shoot photos from your device to create a gallery'
            };
            if (isEvent) return {
              title: editingService ? 'Edit Upcoming Event' : 'Add Upcoming Studio Event',
              sub: 'Upload event poster banner and set event date, venue & RSVP pass details'
            };
            if (isPreWedding) return {
              title: editingService ? 'Edit Pre-Wedding Shoot' : 'Add Pre-Wedding Shoot',
              sub: 'Upload pre-wedding shoot photos or teaser video along with destination details'
            };
            return {
              title: editingService ? `Edit ${activeConfig.categoryTitle}` : `Add ${activeConfig.categoryTitle}`,
              sub: 'Upload bridal look photos and package details'
            };
          };

          const headerInfo = getModalHeaderText();

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
              <div className="bg-white max-w-lg w-full p-5 sm:p-6 rounded-2xl shadow-2xl relative border border-gray-200 my-auto max-h-[92vh] overflow-y-auto">
                <button
                  onClick={() => setIsAddServiceOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-black p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer z-10"
                  aria-label="Close"
                >
                  <FiX size={20} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-4 pr-8">
                  <span className="p-2.5 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-xl shrink-0">
                    {activeConfig.icon || '✨'}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-gray-900 leading-tight">
                      {headerInfo.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {headerInfo.sub}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveService} className="space-y-4 text-xs">
                  {/* Category Switcher */}
                  <div>
                    <label className="font-semibold block mb-1 text-gray-700">
                      Section / Category
                    </label>
                    <select
                      value={serviceForm.type}
                      onChange={(e) => {
                        const newType = e.target.value;
                        const selected = studioTopics.find(t => t.id === newType);
                        const newConfig = getCategoryConfig(newType);
                        setServicePhotoTab('FILE');
                        setServiceForm({
                          ...serviceForm,
                          type: newType,
                          categoryLabel: selected ? (selected.label || selected.name) : newType,
                          features: (newConfig.suggestedFeatures?.slice(0, 4) || []).join('\n')
                        });
                      }}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-black outline-none bg-gray-50 font-semibold text-xs cursor-pointer"
                    >
                      {studioTopics.map(topic => (
                        <option key={topic.id} value={topic.id}>
                          {topic.icon || '✨'} {topic.label || topic.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ═══════════════════════════════════════════════════════════
                      MODE 1: 🎬 BTS VIDEOS — SIRF VIDEO UPLOAD & VIDEO FIELDS!
                     ═══════════════════════════════════════════════════════════ */}
                  {isBtsVideo && (
                    <>
                      {/* Dedicated Video Upload Box */}
                      <div className="bg-zinc-950 text-white p-4 rounded-xl border border-luxury-gold/40 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-luxury-gold flex items-center gap-1.5 text-xs uppercase tracking-wider">
                            <FiVideo size={15} /> 1. Upload BTS Video / Reel *
                          </span>
                          <div className="flex gap-1 bg-zinc-800 p-0.5 rounded-lg">
                            <button
                              type="button"
                              onClick={() => setServicePhotoTab('FILE')}
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors cursor-pointer ${
                                servicePhotoTab === 'FILE' ? 'bg-luxury-gold text-black' : 'text-gray-300 hover:text-white'
                              }`}
                            >
                              📱 Phone / PC Video
                            </button>
                            <button
                              type="button"
                              onClick={() => setServicePhotoTab('URL')}
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors cursor-pointer ${
                                servicePhotoTab === 'URL' ? 'bg-luxury-gold text-black' : 'text-gray-300 hover:text-white'
                              }`}
                            >
                              🔗 Video Link
                            </button>
                          </div>
                        </div>

                        {servicePhotoTab === 'FILE' ? (
                          <label className="border-2 border-dashed border-luxury-gold/50 hover:border-luxury-gold rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 transition-colors text-center">
                            <FiVideo size={24} className="text-luxury-gold" />
                            <span className="font-bold text-white text-xs">
                              {isUploadingServiceVideo ? '⏳ Saving Video...' : 'Tap to Choose Video from Gallery / PC (MP4, MOV)'}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              Auto-generates thumbnail & plays directly on website
                            </span>
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              disabled={isUploadingServiceVideo}
                              onChange={handleServiceVideoFileChange}
                            />
                          </label>
                        ) : (
                          <input
                            type="url"
                            placeholder="Paste MP4 video link or YouTube Shorts link..."
                            value={serviceForm.videoUrl.startsWith('idb://') ? '' : serviceForm.videoUrl}
                            onChange={(e) => setServiceForm({ ...serviceForm, videoUrl: e.target.value })}
                            className="w-full p-2.5 border border-zinc-700 rounded-lg focus:border-luxury-gold outline-none bg-zinc-900 text-white text-xs"
                          />
                        )}

                        {/* Live Video Player Preview */}
                        {serviceForm.videoUrl && (
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                <FiCheckCircle size={12} /> Video Ready to Play
                              </span>
                              <button
                                type="button"
                                onClick={() => setServiceForm({ ...serviceForm, videoUrl: '' })}
                                className="text-rose-400 hover:underline text-[10px] cursor-pointer"
                              >
                                Remove Video
                              </button>
                            </div>
                            <div className="h-44 w-full rounded-lg overflow-hidden bg-black border border-zinc-800">
                              <SmartVideoPlayer
                                videoUrl={serviceForm.videoUrl}
                                poster={serviceForm.image}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Simple Video Details */}
                      <div className="space-y-3">
                        <div>
                          <label className="font-semibold block mb-1 text-gray-700">
                            Video Title / Reel Caption *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 320 Hours of Zardozi Hand-Weaving — Laxmi Nagar Atelier BTS"
                            value={serviceForm.title}
                            onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-black outline-none bg-white font-medium"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="font-semibold block mb-1 text-gray-700">
                              Short Tag / Story
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Karigar Loom Room / Trial Reveal"
                              value={serviceForm.subtitle}
                              onChange={(e) => setServiceForm({ ...serviceForm, subtitle: e.target.value })}
                              className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-black outline-none bg-white"
                            />
                          </div>
                          <div>
                            <label className="font-semibold block mb-1 text-gray-700">
                              Video Duration / Badge
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 0:45s • 4K Reel"
                              value={serviceForm.duration || serviceForm.date || ''}
                              onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value, date: e.target.value })}
                              className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-black outline-none bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ═══════════════════════════════════════════════════════════
                      MODE 2: 📷 PHOTOSHOOT & 🌟 PORTFOLIO — SIRF PHOTO GALLERY!
                     ═══════════════════════════════════════════════════════════ */}
                  {isPhotoGalleryOnly && (
                    <>
                      {/* Dedicated Multi-Photo Gallery Uploader */}
                      <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900 flex items-center gap-1.5 text-xs">
                            <FiCamera size={15} className="text-amber-700" /> 1. Upload Shoot Photos ({serviceForm.gallery?.length || 0} Selected) *
                          </span>
                          <div className="flex gap-1 bg-white p-0.5 rounded-lg border border-gray-200">
                            <button
                              type="button"
                              onClick={() => setServicePhotoTab('FILE')}
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors cursor-pointer ${
                                servicePhotoTab === 'FILE' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
                              }`}
                            >
                              📱 Phone / PC Photos
                            </button>
                            <button
                              type="button"
                              onClick={() => setServicePhotoTab('URL')}
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors cursor-pointer ${
                                servicePhotoTab === 'URL' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
                              }`}
                            >
                              🔗 Photo Link
                            </button>
                          </div>
                        </div>

                        {servicePhotoTab === 'FILE' ? (
                          <label className="border-2 border-dashed border-amber-400 hover:border-black rounded-xl p-4 flex flex-col items-center justify-center gap-1 cursor-pointer bg-white transition-colors text-center">
                            <FiUploadCloud size={22} className="text-amber-700" />
                            <span className="font-bold text-gray-900 text-xs">
                              {isUploadingServicePhoto ? '⏳ Compressing Photos...' : 'Tap to Select Single or Multiple Shoot Photos'}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              You can select multiple photos at once from your phone or computer
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              disabled={isUploadingServicePhoto}
                              onChange={handleServiceGalleryFilesChange}
                            />
                          </label>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="url"
                              placeholder="https://images.unsplash.com/..."
                              value={galleryUrlInput}
                              onChange={(e) => setGalleryUrlInput(e.target.value)}
                              className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-black outline-none bg-white text-xs"
                            />
                            <button
                              type="button"
                              onClick={handleAddServiceGalleryUrl}
                              className="px-3 py-2 bg-black text-white rounded-lg font-bold text-xs cursor-pointer"
                            >
                              + Add Photo
                            </button>
                          </div>
                        )}

                        {/* Uploaded Photos Thumbnail Grid */}
                        {Array.isArray(serviceForm.gallery) && serviceForm.gallery.length > 0 && (
                          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-1">
                            {serviceForm.gallery.map((imgUrl, idx) => {
                              const isMain = serviceForm.image === imgUrl || (idx === 0 && !serviceForm.image);
                              return (
                                <div
                                  key={idx}
                                  className={`relative h-16 rounded-lg overflow-hidden border-2 group cursor-pointer ${
                                    isMain ? 'border-black ring-2 ring-luxury-gold' : 'border-gray-200'
                                  }`}
                                  onClick={() => setServiceForm({ ...serviceForm, image: imgUrl })}
                                  title="Click to set as Main Cover"
                                >
                                  <img src={imgUrl} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                                  {isMain && (
                                    <span className="absolute bottom-0 inset-x-0 bg-black/80 text-luxury-gold text-[8px] font-bold text-center uppercase py-0.5">
                                      Cover
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveServiceGalleryPhoto(idx);
                                    }}
                                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs"
                                    title="Remove photo"
                                  >
                                    ×
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Simple Shoot Info Fields */}
                      <div className="space-y-3">
                        <div>
                          <label className="font-semibold block mb-1 text-gray-700">
                            Shoot / Lookbook Title *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder={serviceForm.type === 'PORTFOLIO' ? 'e.g. Agency Model Portfolio — 4 Bridal & Couture Looks' : 'e.g. Royal Crimson Bridal Portrait Shoot'}
                            value={serviceForm.title}
                            onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-black outline-none bg-white font-medium"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="font-semibold block mb-1 text-gray-700">
                              Shoot Concept / Looks
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Vogue Studio Lighting • 3 Looks"
                              value={serviceForm.subtitle}
                              onChange={(e) => setServiceForm({ ...serviceForm, subtitle: e.target.value })}
                              className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-black outline-none bg-white"
                            />
                          </div>
                          <div>
                            <label className="font-semibold block mb-1 text-gray-700">
                              Package Rate (Optional)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. ₹18,000 (or leave blank)"
                              value={serviceForm.price}
                              onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                              className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-black outline-none bg-white font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ═══════════════════════════════════════════════════════════
                      MODE 3: 🎪 UPCOMING EVENTS — POSTER + DATE, TIME & VENUE
                     ═══════════════════════════════════════════════════════════ */}
                  {isEvent && (
                    <>
                      {/* Event Poster Upload */}
                      <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-gray-800 flex items-center gap-1.5">
                            <FiImage size={14} className="text-amber-700" /> Event Banner / Poster Photo *
                          </label>
                          <div className="flex gap-1 bg-white p-0.5 rounded border border-gray-200">
                            <button
                              type="button"
                              onClick={() => setServicePhotoTab('FILE')}
                              className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer ${
                                servicePhotoTab === 'FILE' ? 'bg-black text-white' : 'text-gray-500'
                              }`}
                            >
                              Upload Poster
                            </button>
                            <button
                              type="button"
                              onClick={() => setServicePhotoTab('URL')}
                              className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer ${
                                servicePhotoTab === 'URL' ? 'bg-black text-white' : 'text-gray-500'
                              }`}
                            >
                              Paste Link
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {serviceForm.image && (
                            <img src={serviceForm.image} alt="Event Poster" className="w-16 h-16 object-cover rounded-lg border border-gray-300 shrink-0" />
                          )}
                          <div className="flex-1">
                            {servicePhotoTab === 'FILE' ? (
                              <label className="border border-dashed border-gray-300 hover:border-black rounded-lg p-3 flex items-center justify-center gap-2 cursor-pointer bg-white">
                                <FiUploadCloud size={16} />
                                <span className="font-medium text-gray-700">
                                  {isUploadingServicePhoto ? 'Uploading...' : 'Choose Event Poster Image'}
                                </span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleServicePhotoFileChange} />
                              </label>
                            ) : (
                              <input
                                type="url"
                                placeholder="https://images.unsplash.com/..."
                                value={serviceForm.image}
                                onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <label className="font-semibold block mb-1 text-gray-700">Event Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Royal Bridal Couture Trunk Show 2026"
                            value={serviceForm.title}
                            onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-black outline-none bg-white font-medium"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1 text-gray-700">Event Date & Time *</label>
                          <input
                            type="text"
                            placeholder="e.g. 24–26 Oct 2026 • 11 AM - 8 PM"
                            value={serviceForm.duration || serviceForm.date || ''}
                            onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value, date: e.target.value })}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-black outline-none bg-white"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1 text-gray-700">Entry / Pass Type</label>
                          <input
                            type="text"
                            placeholder="e.g. Free VIP RSVP or ₹1,500 Pass"
                            value={serviceForm.price}
                            onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-black outline-none bg-white font-mono"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="font-semibold block mb-1 text-gray-700">Event Venue / Studio Location</label>
                          <input
                            type="text"
                            placeholder="e.g. Shubhaangi Flagship Atelier, Laxmi Nagar, Delhi"
                            value={serviceForm.location}
                            onChange={(e) => setServiceForm({ ...serviceForm, location: e.target.value })}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-black outline-none bg-white"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* ═══════════════════════════════════════════════════════════
                      MODE 4: 📸 PREWEDDING, 💄 MAKEUP & 👰 PRE_BRIDAL
                     ═══════════════════════════════════════════════════════════ */}
                  {!isBtsVideo && !isPhotoGalleryOnly && !isEvent && (
                    <>
                      {/* Media Upload Box (Supports Multiple Photos + Optional Teaser Video for Pre-Wedding) */}
                      <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200 space-y-2.5">
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <label className="font-bold text-gray-800 flex items-center gap-1.5">
                            <FiCamera size={14} className="text-amber-700" />
                            <span>
                              {isPreWedding ? 'Upload Pre-Wedding Photos or Teaser Video' : `Upload ${activeConfig.categoryTitle} Photos`}
                            </span>
                          </label>
                          <div className="flex gap-1 bg-white p-0.5 rounded-lg border border-gray-200">
                            <button
                              type="button"
                              onClick={() => setServicePhotoTab('FILE')}
                              className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer ${
                                servicePhotoTab === 'FILE' ? 'bg-black text-white' : 'text-gray-500'
                              }`}
                            >
                              📷 Photos
                            </button>
                            {isPreWedding && (
                              <button
                                type="button"
                                onClick={() => setServicePhotoTab('VIDEO')}
                                className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer ${
                                  servicePhotoTab === 'VIDEO' ? 'bg-black text-white' : 'text-gray-500'
                                }`}
                              >
                                🎬 Video
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setServicePhotoTab('URL')}
                              className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer ${
                                servicePhotoTab === 'URL' ? 'bg-black text-white' : 'text-gray-500'
                              }`}
                            >
                              🔗 Link
                            </button>
                          </div>
                        </div>

                        {servicePhotoTab === 'VIDEO' ? (
                          <label className="border border-dashed border-amber-400 hover:border-black rounded-lg p-3 flex items-center justify-center gap-2 cursor-pointer bg-white">
                            <FiVideo size={16} className="text-amber-700" />
                            <span className="font-medium text-gray-800">
                              {isUploadingServiceVideo ? 'Saving Video...' : 'Choose Pre-Wedding Teaser Video (MP4/MOV)'}
                            </span>
                            <input type="file" accept="video/*" className="hidden" onChange={handleServiceVideoFileChange} />
                          </label>
                        ) : servicePhotoTab === 'FILE' ? (
                          <label className="border border-dashed border-amber-400 hover:border-black rounded-lg p-3 flex items-center justify-center gap-2 cursor-pointer bg-white">
                            <FiUploadCloud size={16} className="text-amber-700" />
                            <span className="font-medium text-gray-800">
                              {isUploadingServicePhoto ? 'Uploading...' : 'Select Photos from Phone / PC (Multiple Allowed)'}
                            </span>
                            <input type="file" accept="image/*" multiple className="hidden" onChange={handleServiceGalleryFilesChange} />
                          </label>
                        ) : (
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            value={serviceForm.image}
                            onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                          />
                        )}

                        {/* Thumbnail Previews */}
                        {Array.isArray(serviceForm.gallery) && serviceForm.gallery.length > 0 && (
                          <div className="flex gap-2 overflow-x-auto pt-1">
                            {serviceForm.gallery.map((imgUrl, idx) => (
                              <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-300 shrink-0">
                                <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveServiceGalleryPhoto(idx)}
                                  className="absolute top-0 right-0 bg-rose-600 text-white w-4 h-4 text-[10px] flex items-center justify-center"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Package Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold block mb-1 text-gray-700">
                            {isPreWedding ? 'Pre-Wedding Shoot Title *' : 'Package / Look Name *'}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder={`e.g. ${activeConfig.presets?.[0]?.title || 'Royal Bridal Package'}`}
                            value={serviceForm.title}
                            onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-black outline-none bg-white font-medium"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1 text-gray-700">
                            {isPreWedding ? 'Destination / Location' : 'Products / Special Highlight'}
                          </label>
                          <input
                            type="text"
                            placeholder={`e.g. ${activeConfig.presets?.[0]?.subtitle || 'Complete Studio Session'}`}
                            value={serviceForm.subtitle}
                            onChange={(e) => setServiceForm({ ...serviceForm, subtitle: e.target.value })}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-black outline-none bg-white"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1 text-gray-700">Price / Package Rate</label>
                          <input
                            type="text"
                            placeholder={activeConfig.pricePlaceholder || 'e.g. ₹25,000'}
                            value={serviceForm.price}
                            onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-black outline-none bg-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1 text-gray-700">
                            {activeConfig.durationLabel || 'Duration / Sittings'}
                          </label>
                          <input
                            type="text"
                            placeholder={activeConfig.durationPlaceholder || 'e.g. 3.5 Hours'}
                            value={serviceForm.duration || serviceForm.date || ''}
                            onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value, date: e.target.value })}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-black outline-none bg-white"
                          />
                        </div>
                      </div>

                      {/* Clickable Inclusions */}
                      <div>
                        <label className="font-semibold block mb-1 text-gray-700">
                          What's Included (Click tags to add)
                        </label>
                        {activeConfig.suggestedFeatures && activeConfig.suggestedFeatures.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {activeConfig.suggestedFeatures.map((feat, fIdx) => (
                              <button
                                key={fIdx}
                                type="button"
                                onClick={() => handleAddSuggestedFeature(feat)}
                                className="px-2 py-1 bg-gray-100 hover:bg-luxury-gold hover:text-black text-gray-700 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <span className="font-bold">+</span>
                                <span>{feat}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        <textarea
                          rows={2}
                          placeholder="One item per line..."
                          value={serviceForm.features}
                          onChange={(e) => setServiceForm({ ...serviceForm, features: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:border-black outline-none bg-white text-xs"
                        />
                      </div>
                    </>
                  )}

                  {/* Submit Buttons */}
                  <div className="pt-2 flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-black hover:bg-luxury-gold hover:text-black text-white font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs cursor-pointer text-xs flex items-center justify-center gap-1.5"
                    >
                      <FiCheck size={15} />
                      <span>
                        {editingService
                          ? 'Save Changes'
                          : isBtsVideo
                            ? '🎬 Publish BTS Video'
                            : isPhotoGalleryOnly
                              ? '📷 Publish Shoot Photos'
                              : isEvent
                                ? '🎪 Publish Event'
                                : 'Save & Publish'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddServiceOpen(false)}
                      className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium cursor-pointer text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          );
        })()}

        {/* ── ADD MAIN TOPIC MODAL ───────────────────────────────────── */}
        {isAddTopicOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white max-w-md w-full p-5 sm:p-6 rounded-xl shadow-2xl relative border border-gray-200 my-auto">
              <button
                onClick={() => setIsAddTopicOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <FiX size={20} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="p-2.5 bg-luxury-gold/20 text-luxury-gold rounded-lg border border-luxury-gold/40 text-xl shrink-0">
                  <FiTag size={20} />
                </span>
                <div>
                  <h3 className="text-base font-serif font-bold text-gray-900 leading-tight">
                    Add New Main Category / Topic
                  </h3>
                  <p className="text-xs text-gray-500">
                    Appears directly in the client slide-out menu drawer & studio modal
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveNewTopic} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold block mb-1 text-gray-800">
                    Category Name / Label *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bridal Jewellery Styling, Runway Shows, Masterclasses"
                    value={newTopicForm.label}
                    onChange={(e) => setNewTopicForm({ ...newTopicForm, label: e.target.value })}
                    required
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:border-black outline-none bg-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-gray-800">
                      Icon Emoji
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 📸, 💎, 👑, 👗, 💄, 🎪"
                      value={newTopicForm.icon}
                      onChange={(e) => setNewTopicForm({ ...newTopicForm, icon: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:border-black outline-none bg-white text-base text-center"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-gray-800">
                      Badge (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. New, Popular, VIP"
                      value={newTopicForm.badge}
                      onChange={(e) => setNewTopicForm({ ...newTopicForm, badge: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:border-black outline-none bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-gray-800">
                    Short Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Exclusive styling & VIP bridal consultation sessions"
                    value={newTopicForm.desc}
                    onChange={(e) => setNewTopicForm({ ...newTopicForm, desc: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:border-black outline-none bg-white"
                  />
                </div>

                <div className="pt-3 border-t border-gray-100 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAddTopicOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-luxury-gold hover:bg-[#dfb956] text-black font-bold uppercase tracking-wider rounded-md transition-colors shadow-xs cursor-pointer"
                  >
                    Create Main Topic
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
