import { useState, useEffect } from 'react';
import { Category, Ad, User, CATEGORIES, BURUNDI_CITIES } from './types';
import { getAds, getCurrentUser, setCurrentUser, startChat } from './data';
import AuthModal from './components/AuthModal';
import PublishAdModal from './components/PublishAdModal';
import ProfileTab from './components/ProfileTab';
import ProductDetails from './components/ProductDetails';
import ChatTab from './components/ChatTab';
import AdminTab from './components/AdminTab';
import ProductCard from './components/ProductCard';
import { 
  Search, Plus, MessageSquare, User as UserIcon, Shield, Filter, 
  ShoppingBag, HelpCircle, Coins, MapPin, AlertCircle, RefreshCw,
  Smartphone, Laptop, Globe, ChevronDown
} from 'lucide-react';
import { Language, LANGUAGES, TRANSLATIONS } from './utils/translations';

export default function App() {
  const [currentUser, setLocalCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'browse' | 'chats' | 'profile' | 'admin'>('browse');
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  
  // Language states & helpers
  const [lang, setLang] = useState<Language>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('axelmarket_lang') as Language : null;
    return saved && ['fr', 'rn', 'en', 'sw'].includes(saved) ? saved : 'fr';
  });
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('axelmarket_lang', newLang);
    }
    setShowLangDropdown(false);
  };

  const t = (key: keyof typeof TRANSLATIONS['fr']) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['fr'][key];
  };

  const translateCategory = (cat: string) => {
    if (cat === 'Tous') return t('cat_Tous');
    const translateKey = `cat_${cat}` as keyof typeof TRANSLATIONS['fr'];
    return TRANSLATIONS[lang]?.[translateKey] || cat;
  };
  
  // Listings state
  const [ads, setAds] = useState<Ad[]>([]);
  
  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Tous'>('Tous');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('Tous');
  const [showFilters, setShowFilters] = useState(false);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Mode d'affichage : 'mobile' (Android/iOS) ou 'desktop' (PC)
  const [layoutMode, setLayoutMode] = useState<'mobile' | 'desktop'>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('axelmarket_layout_mode') : null;
    if (saved === 'mobile' || saved === 'desktop') return saved;
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024 ? 'mobile' : 'desktop';
    }
    return 'mobile';
  });

  const toggleLayoutMode = (mode: 'mobile' | 'desktop') => {
    setLayoutMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('axelmarket_layout_mode', mode);
    }
  };

  // Load user and ads
  const loadData = () => {
    setLocalCurrentUser(getCurrentUser());
    setAds(getAds());
  };

  useEffect(() => {
    loadData();
    // Periodically update list (for live deletion/blocking synchronization)
    const timer = setInterval(() => {
      setAds(getAds());
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setLocalCurrentUser(null);
    setActiveTab('browse');
    setSelectedAd(null);
  };

  const handleAuthSuccess = (user: User) => {
    setLocalCurrentUser(user);
    loadData();
  };

  const handlePublishSuccess = () => {
    loadData();
    setActiveTab('browse');
    setSelectedAd(null);
  };

  const handleContactSeller = (ad: Ad) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    // Create or locate chat thread
    const chat = startChat(ad, currentUser);
    setActiveTab('chats');
  };

  const handlePublishClick = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
    } else {
      setIsPublishModalOpen(false); // Reset/close first
      setTimeout(() => setIsPublishModalOpen(true), 50);
    }
  };

  // Filter ads based on search controls
  const filteredAds = ads.filter((ad) => {
    // Title/Description match
    const matchesSearch = 
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ad.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category match
    const matchesCategory = selectedCategory === 'Tous' || ad.category === selectedCategory;
    
    // Price match
    const priceNum = parseFloat(maxPrice);
    const matchesPrice = isNaN(priceNum) || ad.price <= priceNum;

    // City match
    const matchesCity = selectedCity === 'Tous' || ad.city === selectedCity;

    return matchesSearch && matchesCategory && matchesPrice && matchesCity;
  });

  if (layoutMode === 'mobile') {
    return (
      <div className="min-h-screen w-full bg-slate-900 md:bg-slate-950 flex flex-col items-center justify-center p-0 md:p-6 selection:bg-blue-600 selection:text-white relative">
        
        {/* Layout Switcher on top for PC view mode */}
        <div className="hidden md:flex items-center gap-3 mb-4 text-white text-xs z-50">
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-2xl border border-slate-850 shadow-xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mode d'affichage :</span>
            <button 
              onClick={() => toggleLayoutMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                layoutMode === 'mobile' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone size={10} className="stroke-[2.5]" />
              <span>📱 Smartphone (Burundi)</span>
            </button>
            <button 
              onClick={() => toggleLayoutMode('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                layoutMode === 'desktop' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Laptop size={10} className="stroke-[2.5]" />
              <span>🖥️ Ordinateur / PC</span>
            </button>
          </div>
        </div>

        {/* Smartphone mockup layout (full width/height on mobile, restricted on PC) */}
        <div className="w-full min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col relative md:max-w-[420px] md:h-[840px] md:min-h-0 md:rounded-[40px] md:border-[10px] md:border-slate-950 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] md:overflow-hidden select-none">
          
          {/* Simulated Mobile Status Bar (PC View Mockup only) */}
          <div className="hidden md:flex items-center justify-between px-6 py-2.5 bg-white text-slate-900 text-[10px] font-black tracking-tighter select-none border-b border-slate-100 shrink-0 relative">
            <span>09:41 🕒</span>
            <div className="w-24 h-4 bg-slate-950 rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center">
              <div className="w-12 h-1 bg-slate-800 rounded-full" />
            </div>
            <div className="flex items-center gap-1.5">
              <span>📶 5G</span>
              <span>🔋 100%</span>
            </div>
          </div>

          {/* Compact Mobile Header */}
          <header className="bg-white border-b border-slate-100 sticky top-0 z-40 px-4 py-3.5 shadow-sm shrink-0 flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedAd(null);
                setActiveTab('browse');
              }}
              className="flex items-center gap-1.5 focus:outline-none"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-3.5 h-3.5 border-2 border-white rounded-xs rotate-45"></div>
              </div>
              <span className="text-lg font-black tracking-tighter text-slate-900">
                AXEL<span className="text-blue-600">MARKET</span>
              </span>
            </button>

            {/* Quick Layout Mode switcher button & Language & Profile */}
            <div className="flex items-center gap-2">
              
              {/* Language Selector Dropdown (Mobile) */}
              <div className="relative">
                <button
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  title="Changer de langue / Change language"
                >
                  <Globe size={13} className="stroke-[2.5] text-slate-600" />
                  <span className="text-[9px] font-black uppercase text-slate-600">
                    {LANGUAGES.find(l => l.code === lang)?.short}
                  </span>
                </button>
                {showLangDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 bg-transparent" 
                      onClick={() => setShowLangDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                      {LANGUAGES.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => changeLanguage(l.code)}
                          className={`w-full px-3 py-2 text-left text-[10px] font-bold hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer ${
                            lang === l.code ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span>{l.flag}</span>
                            <span>{l.name}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => toggleLayoutMode('desktop')}
                className="lg:hidden p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors cursor-pointer"
                title="Passer en version Ordinateur"
              >
                <Laptop size={14} className="stroke-[2.5]" />
              </button>

              {currentUser ? (
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-[10px]" title={currentUser.fullName}>
                  {currentUser.fullName.charAt(0).toUpperCase()}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-2.5 py-1.5 bg-blue-600 text-white font-black text-[9px] uppercase tracking-wider rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('login')}
                </button>
              )}
            </div>
          </header>

          {/* Scrolling Content Container */}
          <div className="flex-1 overflow-y-auto scrollbar-none pb-2 bg-slate-50 flex flex-col">
            
            {/* Page content */}
            <div className="p-4 flex-1 flex flex-col gap-4">
              {selectedAd ? (
                <ProductDetails 
                  ad={selectedAd} 
                  currentUser={currentUser}
                  onBack={() => setSelectedAd(null)}
                  onContactSeller={handleContactSeller}
                  onPurchaseSuccess={loadData}
                />
              ) : (
                <>
                  {activeTab === 'browse' && (
                    <div className="flex flex-col gap-4 flex-1">
                      
                      {/* Mobile Header Title */}
                      <div className="space-y-1">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                          {lang === 'fr' && <>TOUT LE <span className="text-blue-600 underline decoration-3 underline-offset-2">BURUNDI</span> <br />AUJOURD'HUI</>}
                          {lang === 'rn' && <>UBURUNDI <span className="text-blue-600 underline decoration-3 underline-offset-2">BWELAGURA</span> <br />UYUMUSI</>}
                          {lang === 'en' && <>ALL OF <span className="text-blue-600 underline decoration-3 underline-offset-2">BURUNDI</span> <br />TODAY</>}
                          {lang === 'sw' && <><span className="text-blue-600 underline decoration-3 underline-offset-2">BURUNDI</span> NZIMA <br />LEO</>}
                        </h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {t('heroSubtitle')}
                        </p>
                      </div>

                      {/* Mobile horizontal category tabs list */}
                      <div className="flex gap-1.5 overflow-x-auto pb-1 shrink-0 scrollbar-none">
                        <button
                          onClick={() => setSelectedCategory('Tous')}
                          className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all shrink-0 ${
                            selectedCategory === 'Tous'
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {t('cat_Tous')}
                        </button>
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all shrink-0 ${
                              selectedCategory === cat
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            {translateCategory(cat)}
                          </button>
                        ))}
                      </div>

                      {/* Search & Location Bar for Mobile */}
                      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex flex-col gap-2 shrink-0">
                        <div className="relative flex items-center bg-slate-50 rounded-xl px-3 py-2">
                          <Search size={14} className="text-slate-400 mr-2 shrink-0 stroke-[2.5]" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('searchPlaceholder')}
                            className="bg-transparent text-slate-900 font-bold placeholder-slate-400 focus:outline-none text-xs w-full"
                          />
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          {/* Location Dropdown */}
                          <div className="relative flex-1 flex items-center bg-slate-50 rounded-xl px-3 py-2">
                            <MapPin size={12} className="text-blue-600 mr-1.5 shrink-0 stroke-[2.5]" />
                            <select
                              value={selectedCity}
                              onChange={(e) => setSelectedCity(e.target.value)}
                              className="appearance-none bg-transparent text-slate-900 font-black text-[10px] outline-none cursor-pointer pr-4 w-full uppercase tracking-wider"
                            >
                              <option value="Tous">{t('cityAll')}</option>
                              {BURUNDI_CITIES.map((c) => (
                                <option key={c.name} value={c.name}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                            <span className="pointer-events-none absolute right-3 text-blue-600 text-[8px]">▼</span>
                          </div>

                          {/* Budget toggle */}
                          <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                              showFilters || maxPrice
                                ? 'bg-blue-50 border border-blue-600 text-blue-600'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            <Filter size={12} className="stroke-[2.5]" />
                            <span>{maxPrice ? `${maxPrice} BIF` : t('filters')}</span>
                          </button>
                        </div>
                      </div>

                      {/* Expandable budget slider */}
                      {showFilters && (
                        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                          <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">{t('priceMax')}</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={maxPrice}
                              onChange={(e) => setMaxPrice(e.target.value)}
                              placeholder={t('priceMax')}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none text-xs font-bold"
                            />
                            {maxPrice && (
                              <button 
                                onClick={() => setMaxPrice('')} 
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[8px]"
                              >
                                EFFACER
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Listings Header */}
                      <div className="flex justify-between items-baseline shrink-0">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {selectedCategory === 'Tous' ? t('categoryAll') : translateCategory(selectedCategory)} ({filteredAds.length})
                        </span>
                      </div>

                      {/* Listings Grid (Double column is gold standard for mobile view!) */}
                      {filteredAds.length === 0 ? (
                        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm text-slate-400 space-y-2 flex-1 flex flex-col justify-center items-center">
                          <ShoppingBag size={36} className="text-slate-300 stroke-[1.5] animate-bounce" />
                          <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">{t('noProducts')}</h4>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {filteredAds.map((ad) => (
                            <ProductCard
                              key={ad.id}
                              ad={ad}
                              onClick={() => setSelectedAd(ad)}
                            />
                          ))}
                        </div>
                      )}

                      {/* Secured payment mini promotional banner */}
                      <div className="bg-blue-600 rounded-3xl p-5 mt-2 text-white flex flex-col gap-2 relative overflow-hidden shrink-0 shadow-lg shadow-blue-100">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl -mr-8 -mt-8" />
                        <h3 className="text-sm font-black tracking-tighter uppercase">PAIEMENT SÉCURISÉ</h3>
                        <p className="text-blue-100 font-bold opacity-90 text-[10px]">
                          Lumicash, EcoCash & Visa prochainement.
                        </p>
                        <div className="flex gap-2 mt-1">
                          <div className="px-2 py-1 bg-white/20 rounded-md font-black text-[8px] tracking-wider uppercase">LUMI</div>
                          <div className="px-2 py-1 bg-white/20 rounded-md font-black text-[8px] tracking-wider uppercase">ECO</div>
                          <div className="px-2 py-1 bg-white/20 rounded-md font-black text-[8px] tracking-wider uppercase">VISA</div>
                        </div>
                      </div>

                    </div>
                  )}

                  {activeTab === 'chats' && currentUser && (
                    <div className="flex-1 flex flex-col">
                      <ChatTab 
                        currentUser={currentUser} 
                        onAdSelectedById={(adId) => {
                          const ad = ads.find(a => a.id === adId);
                          if (ad) setSelectedAd(ad);
                        }}
                      />
                    </div>
                  )}

                  {activeTab === 'profile' && currentUser && (
                    <div className="flex-1 flex flex-col">
                      <ProfileTab
                        user={currentUser}
                        onLogout={handleLogout}
                        onAdSelected={(ad) => setSelectedAd(ad)}
                        onWalletUpdate={loadData}
                      />
                    </div>
                  )}

                  {activeTab === 'admin' && currentUser?.isAdmin && (
                    <div className="flex-1 flex flex-col">
                      <AdminTab
                        onAdSelected={(ad) => setSelectedAd(ad)}
                        onRefresh={loadData}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sticky Tab Bar for Mobile Navigation */}
          <nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] shrink-0">
            
            {/* Tab: Acheter */}
            <button
              onClick={() => {
                setSelectedAd(null);
                setActiveTab('browse');
              }}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 transition-colors focus:outline-none cursor-pointer ${
                activeTab === 'browse' && !selectedAd
                  ? 'text-blue-600 font-black'
                  : 'text-slate-400 hover:text-blue-600'
              }`}
            >
              <ShoppingBag size={18} className={activeTab === 'browse' && !selectedAd ? "stroke-[2.5]" : "stroke-[1.5]"} />
              <span className="text-[8px] font-black uppercase tracking-wider">{t('buy')}</span>
            </button>

            {/* Tab: Discussions */}
            <button
              onClick={() => {
                if (!currentUser) {
                  setIsAuthModalOpen(true);
                } else {
                  setSelectedAd(null);
                  setActiveTab('chats');
                }
              }}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 transition-colors focus:outline-none cursor-pointer ${
                activeTab === 'chats'
                  ? 'text-blue-600 font-black'
                  : 'text-slate-400 hover:text-blue-600'
              }`}
            >
              <div className="relative">
                <MessageSquare size={18} className={activeTab === 'chats' ? "stroke-[2.5]" : "stroke-[1.5]"} />
                {currentUser && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500" />}
              </div>
              <span className="text-[8px] font-black uppercase tracking-wider">{t('messages')}</span>
            </button>

            {/* Tab Center: Floating action button style for publishing */}
            <button
              onClick={handlePublishClick}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-full shadow-md shadow-blue-200 transition-all active:scale-90 focus:outline-none cursor-pointer"
              title={t('publish')}
            >
              <Plus size={20} className="stroke-[3]" />
            </button>

            {/* Tab: Profil */}
            <button
              onClick={() => {
                if (!currentUser) {
                  setIsAuthModalOpen(true);
                } else {
                  setSelectedAd(null);
                  setActiveTab('profile');
                }
              }}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 transition-colors focus:outline-none cursor-pointer ${
                activeTab === 'profile'
                  ? 'text-blue-600 font-black'
                  : 'text-slate-400 hover:text-blue-600'
              }`}
            >
              <UserIcon size={18} className={activeTab === 'profile' ? "stroke-[2.5]" : "stroke-[1.5]"} />
              <span className="text-[8px] font-black uppercase tracking-wider">{t('profile')}</span>
            </button>

            {/* Tab: Admin (Conditional) */}
            {currentUser?.isAdmin && (
              <button
                onClick={() => {
                  setSelectedAd(null);
                  setActiveTab('admin');
                }}
                className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 transition-colors focus:outline-none cursor-pointer ${
                  activeTab === 'admin'
                    ? 'text-indigo-600 font-black'
                    : 'text-slate-400 hover:text-indigo-600'
                }`}
              >
                <Shield size={18} className={activeTab === 'admin' ? "stroke-[2.5]" : "stroke-[1.5]"} />
                <span className="text-[8px] font-black uppercase tracking-wider">{t('admin')}</span>
              </button>
            )}

          </nav>

        </div>

        {/* Modals Mounting */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />

        {currentUser && (
          <PublishAdModal
            isOpen={isPublishModalOpen}
            onClose={() => setIsPublishModalOpen(false)}
            currentUser={currentUser}
            onPublishSuccess={handlePublishSuccess}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Top Warning/Mode bar */}
      <div className="bg-gray-900 text-white py-2 px-4 text-xs font-semibold flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>AxelMarket Burundi MVP — Mode Client & Hors-ligne fonctionnel</span>
        </div>

        {/* Switch View Mode Controls */}
        <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button 
            onClick={() => toggleLayoutMode('mobile')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <Smartphone size={10} className="stroke-[2.5]" />
            <span>📱 Mode Mobile</span>
          </button>
          <div className="w-px h-3 bg-slate-700" />
          <button 
            onClick={() => toggleLayoutMode('desktop')}
            className="flex items-center gap-1 px-2.5 py-1 bg-blue-650 text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-default"
          >
            <Laptop size={10} className="stroke-[2.5]" />
            <span>🖥️ Mode PC (Actif)</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <span className="text-gray-400">
              Connecté en tant que : <strong className="text-white font-black">{currentUser.fullName}</strong>
            </span>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="text-blue-400 hover:underline font-bold"
            >
              Se Connecter
            </button>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <button
              onClick={() => {
                setSelectedAd(null);
                setActiveTab('browse');
              }}
              className="flex items-center gap-3 group cursor-pointer text-left focus:outline-none"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
                <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45"></div>
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">
                AXEL<span className="text-blue-600">MARKET</span>
              </span>
            </button>

            {/* Quick Actions / Desktop Nav */}
            <div className="flex items-center gap-4">
              
              <button
                onClick={() => {
                  setSelectedAd(null);
                  setActiveTab('browse');
                }}
                className={`px-3 py-2 text-xs font-black uppercase tracking-widest transition-colors cursor-pointer ${
                  activeTab === 'browse' && !selectedAd
                    ? 'text-blue-600' 
                    : 'text-slate-400 hover:text-blue-600'
                }`}
              >
                {t('buy')}
              </button>

              <button
                onClick={() => {
                  if (!currentUser) {
                    setIsAuthModalOpen(true);
                  } else {
                    setSelectedAd(null);
                    setActiveTab('chats');
                  }
                }}
                className={`px-3 py-2 text-xs font-black uppercase tracking-widest transition-colors cursor-pointer relative ${
                  activeTab === 'chats'
                    ? 'text-blue-600' 
                    : 'text-slate-400 hover:text-blue-600'
                }`}
              >
                {t('messages')}
              </button>

              <button
                onClick={() => {
                  if (!currentUser) {
                    setIsAuthModalOpen(true);
                  } else {
                    setSelectedAd(null);
                    setActiveTab('profile');
                  }
                }}
                className={`px-3 py-2 text-xs font-black uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'profile'
                    ? 'text-blue-600' 
                    : 'text-slate-400 hover:text-blue-600'
                }`}
              >
                <UserIcon size={14} className="stroke-[2.5]" />
                <span>{t('profile')}</span>
              </button>

              {/* Admin Button */}
              {currentUser && currentUser.isAdmin && (
                <button
                  onClick={() => {
                    setSelectedAd(null);
                    setActiveTab('admin');
                  }}
                  className={`px-3 py-2 text-xs font-black uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'admin'
                      ? 'text-indigo-600' 
                      : 'text-slate-400 hover:text-indigo-600'
                  }`}
                >
                  <Shield size={14} className="stroke-[2.5]" />
                  <span>{t('admin')}</span>
                </button>
              )}

              {/* Language Selector Dropdown (Desktop) */}
              <div className="relative">
                <button
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Changer de langue / Change language"
                >
                  <Globe size={14} className="stroke-[2.5]" />
                  <span>{LANGUAGES.find(l => l.code === lang)?.name}</span>
                  <ChevronDown size={11} className={`transition-transform duration-200 ${showLangDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showLangDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 bg-transparent" 
                      onClick={() => setShowLangDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {LANGUAGES.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => changeLanguage(l.code)}
                          className={`w-full px-4 py-2 text-left text-xs font-bold hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer ${
                            lang === l.code ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-sm leading-none">{l.flag}</span>
                            <span>{l.name}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Publish Button */}
              <button
                onClick={handlePublishClick}
                className="ml-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-blue-200 flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Plus size={14} className="stroke-[3]" />
                <span className="hidden sm:inline">{t('publish')}</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Render Tab Contents */}
        {selectedAd ? (
          <ProductDetails 
            ad={selectedAd} 
            currentUser={currentUser}
            onBack={() => setSelectedAd(null)}
            onContactSeller={handleContactSeller}
            onPurchaseSuccess={loadData}
          />
        ) : (
          <>
            {activeTab === 'browse' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Left Column (Desktop Sidebar / Mobile Header) */}
                <div className="col-span-12 md:col-span-3 flex flex-col gap-6">
                  <h2 className="text-4xl font-black leading-none text-slate-900 tracking-tighter">
                    {lang === 'fr' && <>TOUT LE <br/><span className="text-blue-600 underline decoration-4 underline-offset-4">BURUNDI</span> <br/>AUJOURD'HUI</>}
                    {lang === 'rn' && <>UBURUNDI <br/><span className="text-blue-600 underline decoration-4 underline-offset-4">BWELAGURA</span> <br/>UYUMUSI</>}
                    {lang === 'en' && <>ALL OF <br/><span className="text-blue-600 underline decoration-4 underline-offset-4">BURUNDI</span> <br/>TODAY</>}
                    {lang === 'sw' && <><span className="text-blue-600 underline decoration-4 underline-offset-4">BURUNDI</span> <br/>NZIMA LEO</>}
                  </h2>
                  
                  <button 
                    onClick={handlePublishClick}
                    className="w-full py-4 px-6 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-200 text-left flex justify-between items-center hover:bg-blue-700 transition-all cursor-pointer active:scale-95 group"
                  >
                    <span className="text-xs uppercase tracking-widest">{t('publish')}</span>
                    <span className="text-xl font-black group-hover:translate-x-1 transition-transform">+</span>
                  </button>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Catégories</h3>
                    <ul className="space-y-4 font-bold text-sm">
                      <li 
                        onClick={() => setSelectedCategory('Tous')}
                        className={`flex items-center gap-3 cursor-pointer transition-colors ${selectedCategory === 'Tous' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
                      >
                        <div className={`w-2.5 h-2.5 rounded-full ${selectedCategory === 'Tous' ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                        <span>{t('categoryAll')}</span>
                      </li>
                      {CATEGORIES.map((cat) => {
                        const isSelected = selectedCategory === cat;
                        return (
                          <li 
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`flex items-center gap-3 cursor-pointer transition-colors ${isSelected ? 'text-blue-600 font-black' : 'text-slate-500 hover:text-blue-600'}`}
                          >
                            <div className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                            <span>{translateCategory(cat)}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* Right Column (Search + Filters + Product Grid + Secured Payment) */}
                <div className="col-span-12 md:col-span-9 flex flex-col gap-6">
                  
                  {/* Search and Filters row */}
                  <div className="bg-white rounded-3xl p-3 border border-slate-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                    
                    {/* Search Field */}
                    <div className="relative flex-1 flex items-center">
                      <span className="absolute left-4 text-slate-400">
                        <Search size={18} className="stroke-[2.5]" />
                      </span>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('searchPlaceholder')}
                        className="w-full pl-12 pr-4 py-3 bg-transparent text-slate-900 font-bold placeholder-slate-400 focus:outline-none text-sm"
                      />
                    </div>
                    
                    <div className="hidden lg:block h-8 w-px bg-slate-200"></div>

                    {/* City Location Select styled natively */}
                    <div className="relative min-w-[200px] flex items-center bg-slate-50 lg:bg-transparent rounded-2xl px-4 lg:px-0 py-3 lg:py-0">
                      <MapPin size={16} className="text-blue-600 mr-2 shrink-0 stroke-[2.5]" />
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="appearance-none bg-transparent text-slate-900 font-black text-sm outline-none cursor-pointer pr-8 w-full"
                      >
                        <option value="Tous">{t('cityAll')}</option>
                        {BURUNDI_CITIES.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-4 lg:right-2 flex items-center text-blue-600 font-black">
                        ▼
                      </div>
                    </div>

                    <div className="hidden lg:block h-8 w-px bg-slate-200"></div>

                    {/* Collapsible advanced filter trigger */}
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`h-12 px-5 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        showFilters || maxPrice
                          ? 'bg-blue-50 border border-blue-600 text-blue-600'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Filter size={16} className="stroke-[2.5]" />
                      <span>{showFilters ? 'Fermer Filtre' : t('filters')}</span>
                      {maxPrice && <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />}
                    </button>

                  </div>

                  {/* Advanced budget slider/input */}
                  {showFilters && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t('priceMax')}</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          placeholder={t('priceMax')}
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-sm font-bold transition-all"
                        />
                        {maxPrice && (
                          <button 
                            onClick={() => setMaxPrice('')} 
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-black text-xs"
                          >
                            EFFACER
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Mobile category tags - scrollable list shown only on mobile */}
                  <div className="md:hidden bg-white rounded-3xl p-3 border border-slate-200 shadow-sm flex gap-2 overflow-x-auto scrollbar-none">
                    <button
                      onClick={() => setSelectedCategory('Tous')}
                      className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
                        selectedCategory === 'Tous'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      Tous
                    </button>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
                          selectedCategory === cat
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Listings section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-black text-slate-900 text-lg uppercase tracking-wider">
                        {selectedCategory === 'Tous' ? t('categoryAll') : translateCategory(selectedCategory)} ({filteredAds.length})
                      </h3>
                    </div>

                    {filteredAds.length === 0 ? (
                      <div className="bg-white rounded-[40px] p-16 text-center border border-slate-200 shadow-sm text-slate-400 space-y-4">
                        <ShoppingBag size={54} className="mx-auto text-slate-300 stroke-[1.5]" />
                        <h4 className="font-black text-slate-900 text-lg uppercase tracking-widest">{t('noProducts')}</h4>
                        <p className="text-xs text-slate-400 max-w-md mx-auto font-medium">{t('noProductsSub')}</p>
                        
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('Tous');
                            setMaxPrice('');
                            setSelectedCity('Tous');
                          }}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all"
                        >
                          {t('resetFilters')}
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAds.map((ad) => (
                          <ProductCard
                            key={ad.id}
                            ad={ad}
                            onClick={() => setSelectedAd(ad)}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Secured Payment Banner Promo */}
                  <div className="bg-blue-600 rounded-[40px] p-8 mt-4 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-100/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                    <div className="relative z-10 text-center md:text-left">
                      <h3 className="text-3xl font-black tracking-tighter">PAIEMENT SÉCURISÉ</h3>
                      <p className="text-blue-100 font-bold mt-2 opacity-95 text-sm">
                        Bientôt disponible : Lumicash, EcoCash & Visa
                      </p>
                    </div>
                    <div className="flex gap-4 relative z-10">
                      <div className="w-16 h-10 bg-white/20 rounded-xl flex items-center justify-center font-black text-[10px] tracking-widest">LUMI</div>
                      <div className="w-16 h-10 bg-white/20 rounded-xl flex items-center justify-center font-black text-[10px] tracking-widest">ECO</div>
                      <div className="w-16 h-10 bg-white/20 rounded-xl flex items-center justify-center font-black text-[10px] tracking-widest">VISA</div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {activeTab === 'chats' && currentUser && (
              <ChatTab 
                currentUser={currentUser} 
                onAdSelectedById={(adId) => {
                  const ad = ads.find(a => a.id === adId);
                  if (ad) setSelectedAd(ad);
                }}
              />
            )}

            {activeTab === 'profile' && currentUser && (
              <ProfileTab
                user={currentUser}
                onLogout={handleLogout}
                onAdSelected={(ad) => setSelectedAd(ad)}
                onWalletUpdate={loadData}
              />
            )}

            {activeTab === 'admin' && currentUser?.isAdmin && (
              <AdminTab
                onAdSelected={(ad) => setSelectedAd(ad)}
                onRefresh={loadData}
              />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 mt-12 text-center text-xs text-gray-400 shrink-0">
        <p className="font-semibold text-gray-500">© 2026 AxelMarket Burundi. Tous droits réservés.</p>
        <p className="mt-1">Application optimisée pour les connexions lentes au Burundi. Réalisée avec ❤️.</p>
      </footer>

      {/* Modals Mounting */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {currentUser && (
        <PublishAdModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          currentUser={currentUser}
          onPublishSuccess={handlePublishSuccess}
        />
      )}

    </div>
  );
}
