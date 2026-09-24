import React, { useState, useEffect } from 'react';
import { 
  FiX as X, FiInstagram, FiYoutube, FiMessageCircle,
  FiClock, FiDollarSign, FiCalendar, FiShield, FiArrowDown,
  FiHeart, FiStar, FiChevronRight, FiCheckCircle, FiPackage, FiTag, FiPhoneCall
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from '@studio-freight/lenis';

import { 
  getStoredProducts, getVisitorCount, 
  getStoredWishlist, saveWishlist, getStoredOrders,
  getStoredOfferBanner 
} from './data/store';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import AdminDashboard from './components/AdminDashboard';
import AdminAuthModal from './components/admin/AdminAuthModal';
import StoreHeader from './components/store/StoreHeader';
import OccasionFilter from './components/store/OccasionFilter';
import FeaturedCollections from './components/store/FeaturedCollections';
import HorizontalScrollSection from './components/store/HorizontalScrollSection';
import LookbookCarousel from './components/store/LookbookCarousel';
import BrandStatement from './components/store/BrandStatement';
import ShopByCategory from './components/store/ShopByCategory';
import VideoStorySection from './components/store/VideoStorySection';
import StudioTrialSection from './components/store/StudioTrialSection';
import NewsletterSection from './components/store/NewsletterSection';
import StoreFooter from './components/store/StoreFooter';
import Luxury3DShowcase from './components/Luxury3DShowcase';

// Additional Luxury E-Commerce Modals & Bars
import SearchModal from './components/store/SearchModal';
import WishlistDrawer from './components/store/WishlistDrawer';
import AppointmentModal from './components/store/AppointmentModal';
import OrderTrackerModal from './components/store/OrderTrackerModal';
import CustomerReviewsSection from './components/store/CustomerReviewsSection';
import MobileBottomBar from './components/store/MobileBottomBar';

export default function App() {
  const [currentView, setCurrentView] = useState('store'); // 'store' | 'admin'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('DRESS');
  const [sortBy, setSortBy] = useState('FEATURED');
  const [scrolled, setScrolled] = useState(false);

  // E-Commerce, Wishlist & Rental State
  const [products, setProducts] = useState(() => getStoredProducts());
  const [wishlistIds, setWishlistIds] = useState(() => getStoredWishlist());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [offerBanner, setOfferBanner] = useState(() => getStoredOfferBanner());

  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('shubhaangi_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.warn('Cart initialization empty', e);
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);

  const handleToggleWishlist = (productId) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      saveWishlist(updated);
      return updated;
    });
  };

  // Check URL Hash on initial load & hash changes for #admin or #owner
  useEffect(() => {
    const handleHashCheck = () => {
      const h = window.location.hash.toLowerCase();
      if (h === '#/admin' || h === '#admin' || h === '#owner') {
        if (isAuthenticated) {
          setCurrentView('admin');
        } else {
          setIsAuthModalOpen(true);
        }
      } else {
        setCurrentView('store');
      }
    };

    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);

    // Discreet shortcut for studio owners (Ctrl + Shift + A)
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAuthModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleHashCheck);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAuthenticated]);

  // Track visitors once on mount
  useEffect(() => {
    getVisitorCount();
  }, []);

  // Save cart state
  const handleAddToCart = (item) => {
    const updated = [item, ...cartItems];
    setCartItems(updated);
    try {
      localStorage.setItem('shubhaangi_cart', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setIsCartOpen(true);
  };

  const handleRemoveCartItem = (cartItemId) => {
    const updated = cartItems.filter(i => i.cartItemId !== cartItemId);
    setCartItems(updated);
    try {
      localStorage.setItem('shubhaangi_cart', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem('shubhaangi_cart');
    } catch (e) {
      console.error(e);
    }
  };

  // Smooth Scroll with Lenis (Active on client storefront only)
  useEffect(() => {
    if (currentView === 'admin') return;

    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [currentView]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const handleWhatsAppQuickClick = (product) => {
    const fullImg = product.img?.startsWith('http') 
      ? product.img 
      : (typeof window !== 'undefined' ? `${window.location.origin}${product.img?.startsWith('/') ? '' : '/'}${product.img}` : product.img);
    let message = `Hello SHUBHAANGI Studio & Designer Deepak Sir! ✨\n`;
    message += `I am inquiring about:\n`;
    message += `👗 *${product.name}*\n`;
    if (product.subCategory || product.category) {
      message += `🏷️ *Category:* ${product.subCategory || product.category}\n`;
    }
    if (product.fabric) {
      message += `🧵 *Fabric:* ${product.fabric}\n`;
    }
    message += `📏 *Size:* FREE SIZE (Custom Alteration Available)\n`;
    message += `💰 *Buy:* ₹${(product.buyPrice || 0).toLocaleString('en-IN')}${product.rentPrice3Days ? ` | *Rent:* ₹${product.rentPrice3Days.toLocaleString('en-IN')} (3 Days)` : ''}\n\n`;
    if (fullImg) {
      message += `📸 *Dress Photo Reference:*\n${fullImg}\n\n`;
    }
    message += `Could you please confirm bridal availability and custom fitting schedule?`;
    window.open(`https://wa.me/916397799514?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Auth Success Handler
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    setCurrentView('admin');
    window.location.hash = '#/admin';
  };

  // If Admin View is active and authenticated, show dedicated Studio OS
  if (currentView === 'admin' && isAuthenticated) {
    return (
      <AdminDashboard 
        onBackToStore={() => {
          setProducts(getStoredProducts());
          setOfferBanner(getStoredOfferBanner());
          setCurrentView('store');
          window.location.hash = '';
        }}
        onLogout={() => {
          setIsAuthenticated(false);
          setCurrentView('store');
          window.location.hash = '';
        }}
      />
    );
  }

  // ==========================================
  // PURE CLIENT / BRIDE LUXURY STOREFRONT
  // ==========================================
  return (
    <div className="min-h-screen relative overflow-hidden bg-luxury-light selection:bg-luxury-gold selection:text-white pb-16 md:pb-0">
      {/* 1. SECURE PASSCODE MODAL (For Studio Owners) */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* 2. RENT / BUY PRODUCT DETAIL MODAL */}
      <ProductDetailModal
        product={selectedProductForModal ? (products.find(p => p.id === selectedProductForModal.id) || selectedProductForModal) : null}
        isOpen={!!selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={Boolean(selectedProductForModal && wishlistIds.includes(selectedProductForModal.id))}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* 3. LUXURY SHOPPING CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* 4. INSTANT SEARCH MODAL */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(product) => {
          setSelectedProductForModal(product);
          setIsSearchOpen(false);
        }}
      />

      {/* 5. SLIDE-OVER WISHLIST DRAWER */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlistIds}
        products={products}
        onRemoveWishlist={handleToggleWishlist}
        onSelectProduct={(product) => {
          setSelectedProductForModal(product);
          setIsWishlistOpen(false);
        }}
      />

      {/* 6. ATELIER PRIVATE FITTING APPOINTMENT MODAL */}
      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
      />

      {/* 7. REAL-TIME BRIDAL ORDER TRACKER MODAL */}
      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        orders={getStoredOrders()}
      />

      {/* 8. PURE CLIENT LUXURY HEADER */}
      <StoreHeader
        scrolled={scrolled}
        onOpenMenu={() => setSidebarOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAuthModalOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
        onOpenAppointment={() => setIsAppointmentOpen(true)}
        cartCount={cartItems.length}
        wishlistCount={wishlistIds.length}
        offerBanner={offerBanner}
      />

      {/* 5. MOBILE OVERLAY NAVIGATION MENU */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)} 
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
            className="fixed top-0 left-0 w-84 max-w-[85vw] h-full bg-[#faf9f6] z-50 flex flex-col shadow-2xl overflow-y-auto"
          >
            {/* Luxury Header Banner */}
            <div className="bg-[#121212] text-white p-6 border-b border-luxury-gold/30 relative">
              <button 
                onClick={() => setSidebarOpen(false)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <img 
                  src="/images/shubhaangi-official-logo.jpg" 
                  alt="SHUBHAANGI Official Crest" 
                  className="w-12 h-12 rounded-full object-cover border border-luxury-gold/70 shadow-md ring-1 ring-luxury-gold/30 shrink-0" 
                />
                <div>
                  <h2 className="font-serif text-lg tracking-[0.18em] uppercase font-bold text-white">
                    Shubhaangi
                  </h2>
                  <p className="text-[9px] tracking-[0.3em] uppercase text-luxury-gold font-medium">
                    The Ultimate Bride
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-[11px] text-gray-300 flex items-center justify-between">
                <span>✨ Bespoke Couture Atelier</span>
                <span className="text-[9px] bg-luxury-gold/20 text-luxury-gold font-bold px-1.5 py-0.5 rounded uppercase">
                  Delhi Flagship
                </span>
              </div>
            </div>

            {/* Main E-Commerce Content */}
            <div className="p-5 flex-1 space-y-6">
              {/* Category Links */}
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold mb-3 px-1">
                  Couture Categories
                </h3>
                <div className="space-y-1">
                  {[
                    { name: 'Bridal Lehengas', tab: 'DRESS', desc: 'Handcrafted Heritage Zardozi', badge: 'Popular' },
                    { name: 'Bridal Jewellery', tab: 'JEWELLERY', desc: 'Kundan, Polki & Emerald Chokers', badge: 'Trending' },
                    { name: 'Makeup Packages', tab: 'MAKEUP', desc: 'HD Bridal & Reception Glam', badge: null },
                    { name: 'All Collections', tab: 'ALL', desc: 'Complete 2026 Bridal Vault', badge: null }
                  ].map((item) => (
                    <button 
                      key={item.name}
                      onClick={() => {
                        setActiveTab(item.tab);
                        setSidebarOpen(false);
                        const el = document.getElementById('catalog');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-black/5 transition-all text-left group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base font-semibold text-gray-900 group-hover:text-luxury-gold transition-colors">
                            {item.name}
                          </span>
                          {item.badge && (
                            <span className="text-[8px] tracking-wider uppercase font-bold bg-luxury-gold/15 text-luxury-gold px-1.5 py-0.2 rounded">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 font-light mt-0.5">{item.desc}</p>
                      </div>
                      <FiChevronRight size={16} className="text-gray-400 group-hover:text-luxury-gold group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>

              {/* VIP Customer Services (Pro E-Commerce Concierge) */}
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold mb-3 px-1">
                  Client Concierge
                </h3>
                <div className="space-y-1.5">
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setIsAppointmentOpen(true);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-black/5 text-gray-800 text-xs font-medium transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-luxury-gold/10 text-luxury-gold flex items-center justify-center shrink-0">
                      <FiCalendar size={14} />
                    </div>
                    <div className="text-left flex-1">
                      <span className="font-semibold block">Book Studio Trial</span>
                      <span className="text-[10px] text-gray-500 font-light">Visit VIP Fitting Suite in Delhi</span>
                    </div>
                    <span className="text-[10px] text-luxury-gold font-bold">Book →</span>
                  </button>

                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setIsOrderTrackerOpen(true);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-black/5 text-gray-800 text-xs font-medium transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-black/5 text-gray-700 flex items-center justify-center shrink-0">
                      <FiPackage size={14} />
                    </div>
                    <div className="text-left flex-1">
                      <span className="font-semibold block">Track Order & Rentals</span>
                      <span className="text-[10px] text-gray-500 font-light">Live bridal delivery status</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setIsWishlistOpen(true);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-black/5 text-gray-800 text-xs font-medium transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                      <FiHeart size={14} />
                    </div>
                    <div className="text-left flex-1">
                      <span className="font-semibold block">My Bridal Wishlist</span>
                      <span className="text-[10px] text-gray-500 font-light">{wishlistIds.length} saved creations</span>
                    </div>
                  </button>

                  <a
                    href="https://wa.me/916397799514?text=Hello%20Deepak%20Sir,%20I%20need%20custom%20fitting%20assistance%20for%20a%20SHUBHAANGI%20dress."
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#25D366]/10 text-gray-800 text-xs font-medium transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center shrink-0">
                      <FiMessageCircle size={15} />
                    </div>
                    <div className="text-left flex-1">
                      <span className="font-semibold block text-[#1e7e34]">Designer Fitting WhatsApp</span>
                      <span className="text-[10px] text-gray-500 font-light">Free size alterations with Deepak Kumar</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* E-Commerce Trust Badges */}
              <div className="bg-gray-100/70 p-3.5 rounded-lg space-y-2 border border-gray-200/50">
                <div className="flex items-center gap-2 text-[11px] text-gray-700">
                  <FiCheckCircle size={13} className="text-emerald-600 shrink-0" />
                  <span>Free Custom Fitting by Designer Deepak</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-700">
                  <FiCheckCircle size={13} className="text-emerald-600 shrink-0" />
                  <span>100% Refundable Security Deposit</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-700">
                  <FiCheckCircle size={13} className="text-emerald-600 shrink-0" />
                  <span>Dry-Cleaned & Sanitized Assurance</span>
                </div>
              </div>
            </div>

            {/* Drawer Footer Contact */}
            <div className="p-5 border-t border-gray-200 bg-white">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-500 font-medium">Customer Support:</span>
                <a href="tel:+916397799514" className="font-bold text-gray-900 hover:text-luxury-gold">+91 6397 799 514</a>
              </div>
              <p className="text-[10px] text-gray-400 font-light leading-relaxed">
                B-125, First Floor, Laxmi Nagar (Near V3S Mall), Delhi - 110092
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. CINEMATIC HERO SECTION */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black pt-20 sm:pt-28">
        <motion.div 
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 4, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1622384666352-0c9f1396a575?auto=format&fit=crop&q=80&w=2000" 
            alt="Bridal Couture" 
            className="w-full h-full object-cover opacity-80" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
        </motion.div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 text-center text-white px-4 mt-8 sm:mt-12 max-w-4xl"
        >
          <motion.div variants={fadeUp} className="mb-4">
             <span className="text-[10px] md:text-xs tracking-[0.45em] uppercase text-luxury-gold border-b border-luxury-gold/50 pb-2 font-medium">
               Haute Couture • Jewellery • Atelier Services
             </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 font-sans font-medium tracking-[0.06em] uppercase drop-shadow-2xl text-white">
            Bridal Couture '26
          </motion.h1>

          <motion.p variants={fadeUp} className="text-xs sm:text-sm md:text-base tracking-[0.16em] uppercase mb-10 text-gray-200 font-light max-w-2xl mx-auto leading-relaxed">
            Experience handcrafted Indian luxury. Available for <strong className="text-luxury-gold font-normal">3-Day & 7-Day Rental</strong> or bespoke commissioning.
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="#catalog"
              className="px-10 py-4 bg-white text-black hover:bg-luxury-gold hover:text-white transition-all duration-300 tracking-[0.2em] text-xs uppercase font-semibold shadow-lg"
            >
              Explore Collection
            </a>
            <a 
              href="https://wa.me/916397799514?text=Hello%20SHUBHAANGI%20Studio,%20I%20want%20to%20consult%20regarding%20bridal%20rentals."
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 border border-white/40 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300 tracking-[0.2em] text-xs uppercase"
            >
              Direct WhatsApp Consultation
            </a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            variants={fadeUp}
            className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[10px] tracking-[0.3em] uppercase text-gray-400"
          >
            <span>Scroll</span>
            <FiArrowDown className="animate-bounce text-luxury-gold" size={14} />
          </motion.div>
        </motion.div>
      </section>

      {/* 7. CLIENT RENTAL & BUY BENEFIT BAR */}
      <div className="bg-luxury-dark text-white py-4 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around items-center gap-4 text-xs tracking-wider uppercase text-gray-300">
          <span className="flex items-center gap-2">
            <FiClock className="text-luxury-gold" /> 3-Day & 7-Day Bridal Rental
          </span>
          <span className="flex items-center gap-2">
            <FiShield className="text-luxury-gold" /> 100% Refundable Security Deposit
          </span>
          <span className="flex items-center gap-2">
            <FiCalendar className="text-luxury-gold" /> Custom Studio Fitting in Delhi
          </span>
          <span className="flex items-center gap-2">
            <FiDollarSign className="text-luxury-gold" /> Instant WhatsApp Booking
          </span>
        </div>
      </div>

      {/* 8. ASYMMETRIC FEATURED COLLECTIONS */}
      <FeaturedCollections
        fadeUp={fadeUp}
        staggerContainer={staggerContainer}
        onSelectCollection={(category) => {
          setActiveTab(category);
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 9. "THE NEW SILHOUETTE" HORIZONTAL SCROLL GALLERY */}
      <HorizontalScrollSection fadeUp={fadeUp} />

      {/* 10. EDITORIAL LOOKBOOK CAROUSEL */}
      <LookbookCarousel fadeUp={fadeUp} />

      {/* 11. BRAND STATEMENT (VOGUE TYPOGRAPHY) */}
      <BrandStatement fadeUp={fadeUp} />

      {/* 12. SHOP BY CATEGORY (6 HIGH-FASHION TAXONOMY CARDS) */}
      <ShopByCategory
        fadeUp={fadeUp}
        staggerContainer={staggerContainer}
        onSelectCategory={(category) => {
          setActiveTab(category);
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 13. MAIN BRIDAL CATALOG WITH DUAL RENT / BUY */}
      <main id="catalog" className="max-w-7xl mx-auto px-6 py-28 border-t border-gray-200">
        <div className="text-center mb-16">
          <span className="text-[10px] tracking-[0.4em] uppercase text-luxury-gold font-semibold block mb-2">
            The Atelier Wardrobe
          </span>
          <h2 className="text-4xl md:text-6xl font-serif tracking-tight text-gray-900 mb-4">
            Curated Bridal Catalog
          </h2>
          <div className="w-12 h-[1px] bg-luxury-gold mx-auto mb-4" />
          <p className="text-xs md:text-sm text-gray-500 max-w-lg mx-auto font-light tracking-wide">
            Select any piece to configure 3-day/7-day rental dates, choose custom fitting, or commission a bespoke purchase.
          </p>
        </div>
        
        {/* Occasion / Category Filter & Sorter */}
        <OccasionFilter
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          totalCount={products.filter(p => activeTab === 'ALL' || p.category === activeTab).length}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Product Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mb-28"
        >
          {products
            .filter(p => activeTab === 'ALL' || p.category === activeTab)
            .sort((a, b) => {
              if (sortBy === 'PRICE_LOW') {
                const priceA = a.rentPrice3Days || a.buyPrice;
                const priceB = b.rentPrice3Days || b.buyPrice;
                return priceA - priceB;
              }
              if (sortBy === 'PRICE_HIGH') {
                return b.buyPrice - a.buyPrice;
              }
              if (sortBy === 'RENTALS_ONLY') {
                return (b.isRentalAvailable ? 1 : 0) - (a.isRentalAvailable ? 1 : 0);
              }
              return 0; // FEATURED
            })
            .map(product => {
              const isRental = Boolean(product.isRentalAvailable && product.rentPrice3Days);
              const isWishlisted = wishlistIds.includes(product.id);

              return (
                <motion.div 
                  key={product.id} 
                  variants={fadeUp} 
                  className="group cursor-pointer bg-white p-3.5 border border-gray-100 hover:border-luxury-gold/50 transition-all duration-500 rounded-sm shadow-sm hover:shadow-xl relative"
                  onClick={() => setSelectedProductForModal(product)}
                >
                  {/* Image Container */}
                  <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-4 relative rounded-sm">
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />
                    
                    {/* Rental Available Badge & Photos Badge */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                      {isRental ? (
                        <span className="bg-black/90 backdrop-blur text-luxury-gold text-[9px] tracking-widest uppercase px-2.5 py-1 font-semibold shadow-md">
                          Rent & Buy
                        </span>
                      ) : (
                        <span className="bg-zinc-800/90 backdrop-blur text-white text-[9px] tracking-widest uppercase px-2.5 py-1 font-semibold shadow-md">
                          Buy Only
                        </span>
                      )}
                      {(product.images?.length || 1) > 1 && (
                        <span className="bg-black/75 backdrop-blur text-white/95 text-[8px] tracking-widest uppercase px-2 py-0.5 font-medium shadow-md w-fit">
                          {product.images.length} Photos
                        </span>
                      )}
                    </div>

                    {/* Wishlist Heart Icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleWishlist(product.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur hover:bg-white text-gray-700 hover:scale-110 transition-all shadow-md"
                      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                      aria-label="Toggle wishlist"
                    >
                      <FiHeart
                        size={15}
                        className={isWishlisted ? "text-rose-600 fill-rose-600" : "text-gray-700"}
                      />
                    </button>

                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProductForModal(product);
                        }}
                        className="w-full bg-white/95 text-black py-2.5 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-black hover:text-white transition-colors shadow-lg"
                      >
                        Configure Rent / Buy
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="text-center pt-2">
                    <div className="flex items-center justify-center gap-2 mb-1.5">
                      <span className="text-[9px] tracking-[0.2em] uppercase text-gray-400 font-medium">
                        {product.category}
                      </span>
                      {product.rating && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                          <FiStar size={11} className="fill-amber-400 text-amber-400" />
                          <span>{product.rating}</span>
                          <span className="text-gray-400 text-[10px]">({product.reviewsCount})</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base md:text-lg mb-2 font-serif group-hover:text-luxury-gold transition-colors truncate">
                      {product.name}
                    </h3>
                    
                    {/* Pricing Display */}
                    <div className="mb-4">
                      {isRental ? (
                        <div className="flex justify-center items-baseline gap-2 flex-wrap">
                          <span className="text-[11px] text-gray-500 uppercase tracking-wider">Rent</span>
                          <span className="text-base font-serif font-bold text-luxury-gold">
                            ₹{product.rentPrice3Days?.toLocaleString('en-IN')}
                          </span>
                          <span className="text-gray-300">|</span>
                          <span className="text-[11px] text-gray-400">Buy ₹{product.buyPrice?.toLocaleString('en-IN')}</span>
                        </div>
                      ) : (
                        <div className="text-base font-serif font-bold text-gray-900">
                          ₹{product.buyPrice?.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setSelectedProductForModal(product); 
                        }}
                        className="py-2.5 px-2 border border-black hover:bg-black hover:text-white transition-colors duration-300 text-[10px] tracking-[0.15em] uppercase font-semibold"
                      >
                        Rent / Buy
                      </button>

                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleWhatsAppQuickClick(product); 
                        }}
                        className="py-2.5 px-2 bg-[#25D366] text-white hover:bg-[#1eb855] transition-colors duration-300 text-[10px] tracking-[0.15em] uppercase font-semibold truncate flex items-center justify-center gap-1"
                      >
                        <FiMessageCircle size={13} />
                        <span>Inquire</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </motion.div>

        {/* 14. INTERACTIVE 3D LUXURY CRAFTSMANSHIP SHOWCASE */}
        <div className="mb-28">
          <Luxury3DShowcase />
        </div>

        {/* 15. ATELIER DOCUMENTARY VIDEO STORY */}
        <VideoStorySection fadeUp={fadeUp} />

        {/* 16. STUDIO PRIVATE TRIAL & GROOM SHOWCASE */}
        <div className="mt-28">
          <StudioTrialSection
            fadeUp={fadeUp}
            staggerContainer={staggerContainer}
            onSelectCategory={(cat) => {
              setActiveTab(cat);
              const el = document.getElementById('catalog');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>

        {/* 17. VERIFIED REAL BRIDE EXPERIENCES & REVIEWS */}
        <div className="mt-28">
          <CustomerReviewsSection fadeUp={fadeUp} />
        </div>

        {/* 18. VIP NEWSLETTER MEMBERSHIP */}
        <NewsletterSection fadeUp={fadeUp} />

        {/* 19. SOCIAL MEDIA SHOWCASE */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mt-28 mb-16"
        >
          <div className="flex justify-center gap-12 mb-16 border-y border-gray-200 py-10">
            <a href="https://instagram.com/shubhaangi.official" target="_blank" rel="noreferrer" className="hover:text-luxury-gold transition-colors flex flex-col items-center gap-3">
              <FiInstagram size={26} strokeWidth={1.5} />
              <span className="text-[10px] tracking-[0.2em] uppercase">Instagram</span>
            </a>
            <a href="https://wa.me/916397799514" target="_blank" rel="noreferrer" className="hover:text-luxury-gold transition-colors flex flex-col items-center gap-3">
              <FiMessageCircle size={26} strokeWidth={1.5} />
              <span className="text-[10px] tracking-[0.2em] uppercase">WhatsApp</span>
            </a>
            <a href="#" className="hover:text-luxury-gold transition-colors flex flex-col items-center gap-3">
              <FiYoutube size={26} strokeWidth={1.5} />
              <span className="text-[10px] tracking-[0.2em] uppercase">YouTube</span>
            </a>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-serif tracking-[0.1em] mb-8 text-gray-900">
            Follow The Glamour @shubhaangi.official
          </h3>
          <div className="flex justify-center gap-6 overflow-x-auto pb-4 no-scrollbar px-4">
            {[
              { img: '/images/shubhaangi-rani-pink-bridal-lehenga.jpg', title: 'Rani Pink Heritage Zardozi' },
              { img: '/images/shubhaangi-mauve-shimmer-gown.jpg', title: 'Mauve Shimmer Reception Gown' },
              { img: '/images/shubhaangi-antique-gold-tissue.jpg', title: 'Antique Gold Tissue Ensemble' },
              { img: '/images/shubhaangi-royal-plum-cape.jpg', title: 'Deep Plum Sequin Cape Set' },
            ].map((item, idx) => (
              <div key={idx} className="w-48 h-60 md:w-60 md:h-72 overflow-hidden flex-shrink-0 cursor-pointer group rounded-sm bg-gray-100 relative shadow-md">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-left">
                  <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-semibold">Couture Spotlight</span>
                  <p className="text-xs text-white font-serif font-bold">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </main>

      {/* 20. PURE CLIENT LUXURY FOOTER (With subtle staff access) */}
      <StoreFooter 
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* 21. MOBILE & TABLET LUXURY BOTTOM DOCK */}
      <MobileBottomBar
        cartCount={cartItems.length}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAppointment={() => setIsAppointmentOpen(true)}
        onScrollToCatalog={() => {
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    </div>
  );
}
