import React, { useState } from 'react';
import { 
  FiDollarSign, FiUsers, FiRepeat, 
  FiClock, FiAlertCircle, FiPhone, FiMessageCircle, 
  FiEdit2, FiSearch, FiMenu, FiX, FiPlus, FiCheck,
  FiTag, FiPercent, FiCopy, FiTrash2, FiVolume2,
  FiImage
} from 'react-icons/fi';
import { 
  getStoredOrders, saveOrders, getStoredProducts, saveProducts, getVisitorCount, 
  getStoredCoupons, saveCoupons, getStoredOfferBanner, saveOfferBanner
} from '../data/store';
import AdminSidebar from './admin/AdminSidebar';
import RentalTimelineCard from './admin/RentalTimelineCard';

export default function AdminDashboard({ onBackToStore, onLogout }) {
  const [orders, setOrders] = useState(() => getStoredOrders());
  const [products, setProducts] = useState(() => getStoredProducts());
  const [visitors] = useState(() => getVisitorCount());
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // 'OVERVIEW' | 'RENTALS' | 'ORDERS' | 'INVENTORY' | 'COUPONS'
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [photoManagerProduct, setPhotoManagerProduct] = useState(null);
  const [newPhotoUrlInput, setNewPhotoUrlInput] = useState('');
  const [notification, setNotification] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const activeRentals = orders.filter(o => o.status === 'ACTIVE_RENTAL');
  const pendingReturns = orders.filter(o => o.status === 'RETURN_PENDING');
  const returnedRentals = orders.filter(o => o.status === 'RETURNED');
  const conversionRate = ((orders.length / Math.max(visitors, 1)) * 100).toFixed(1);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
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
    setProducts(updated);
    saveProducts(updated);
    setEditingProduct(null);
    showToast(`✅ Pricing updated and synchronized live with storefront!`);
  };

  const handleAddNewProduct = (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.buyPrice) {
      alert('Please provide garment name and buy price.');
      return;
    }

    const additionalImages = newProd.galleryUrls
      ? newProd.galleryUrls
          .split(/[\n,]/)
          .map(url => url.trim())
          .filter(url => url.length > 0)
      : [];
    const primaryImg = newProd.img.trim() || additionalImages[0] || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000';
    const allImages = [primaryImg, ...additionalImages.filter(url => url !== primaryImg)];

    const created = {
      id: Date.now(),
      name: newProd.name.trim(),
      category: newProd.category,
      buyPrice: Number(newProd.buyPrice),
      rentPrice3Days: newProd.rentPrice3Days ? Number(newProd.rentPrice3Days) : null,
      rentPrice7Days: newProd.rentPrice7Days ? Number(newProd.rentPrice7Days) : null,
      deposit: newProd.deposit ? Number(newProd.deposit) : 0,
      isRentalAvailable: newProd.isRentalAvailable,
      description: 'Handcrafted luxury bridal ensemble designed exclusively for the modern Indian bride.',
      fabric: 'Pure Raw Silk & Fine Organza',
      img: primaryImg,
      images: allImages,
      availableSizes: ['FREE SIZE'],
      isFeatured: true
    };

    const updated = [created, ...products];
    setProducts(updated);
    saveProducts(updated);
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
    showToast(`✨ Added "${created.name}" with ${allImages.length} photos to live bridal catalog!`);
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
    setProducts(updated);
    saveProducts(updated);
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
    setProducts(updated);
    saveProducts(updated);
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
    setProducts(updated);
    saveProducts(updated);
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
    setProducts(updated);
    saveProducts(updated);
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
    showToast(`✨ New promo voucher "${created.code}" created and live!`);
  };

  const handleSaveOfferBanner = (e) => {
    e.preventDefault();
    saveOfferBanner(offerBanner);
    showToast('✨ Storefront Promotional Announcement Banner updated live!');
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
    showToast(`✨ Quick Offer "${preset.code}" enabled and live!`);
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
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-300 hover:text-white rounded-md hover:bg-white/10 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
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
              {activeTab === 'RENTALS' && 'Rental Returns & Escrow Tracker'}
              {activeTab === 'ORDERS' && 'Client Bookings & Orders CRM'}
              {activeTab === 'INVENTORY' && 'Inventory & Live Pricing Studio'}
              {activeTab === 'COUPONS' && 'Bridal Offers, Promo Vouchers & Discounts'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              B-125, First Floor, Laxmi Nagar, Delhi (Near V3S Mall) • Official Studio Portal
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 font-medium shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Storefront Connected
            </span>
          </div>
        </header>

        {/* Toast Notification */}
        {notification && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-md text-xs font-medium flex items-center gap-2 shadow-sm animate-fade-in">
            <FiCheck className="text-emerald-600 shrink-0" size={16} />
            <span className="flex-1">{notification}</span>
          </div>
        )}

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
          {/* KPI CARDS (Always visible on Overview) */}
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

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
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
                            ₹{order.amount.toLocaleString('en-IN')}
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
                          ₹{o.amount.toLocaleString('en-IN')}
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

                <div>
                  <label className="font-semibold block mb-1 text-gray-800">Primary Cover Photo URL *</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or image link"
                    value={newProd.img}
                    onChange={(e) => setNewProd({ ...newProd, img: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:border-black outline-none bg-white font-mono text-xs"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">Primary thumbnail shown on the storefront catalog</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-semibold text-gray-800">Additional Model & Angle Photo URLs</label>
                    <span className="text-[10px] text-amber-800 font-semibold">
                      {newProd.galleryUrls ? `${newProd.galleryUrls.split(/[\n,]/).filter(s => s.trim()).length} extra photos` : 'Optional'}
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Enter additional photo URLs (one per line or comma separated)&#10;e.g.&#10;https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
                    value={newProd.galleryUrls}
                    onChange={(e) => setNewProd({ ...newProd, galleryUrls: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:border-black outline-none font-mono text-[11px] bg-white"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Customers can browse all these angles in the interactive dress popup modal!
                  </p>
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

              {/* Add New Photo URL Form */}
              <div className="bg-gray-50 p-3.5 border border-gray-200 rounded-md mb-4 shrink-0">
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Add New Photo URL to this Dress
                </label>
                <p className="text-[11px] text-gray-500 mb-2">
                  Paste high-resolution image URL (e.g. from Google Drive direct image URL, Unsplash, Cloudinary, etc.)
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or image URL"
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
                    className="px-4 py-2 bg-black text-white hover:bg-luxury-gold text-xs font-semibold rounded-md shrink-0 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FiPlus size={14} />
                    <span>Add Photo</span>
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
      </div>
    </div>
  );
}
