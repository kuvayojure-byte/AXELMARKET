export type Language = 'rn' | 'fr' | 'en' | 'sw';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
  short: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷', short: 'FR' },
  { code: 'rn', name: 'Kirundi', flag: '🇧🇮', short: 'RN' },
  { code: 'en', name: 'English', flag: '🇬🇧', short: 'EN' },
  { code: 'sw', name: 'Kiswahili', flag: '🇹🇿', short: 'SW' },
];

export const TRANSLATIONS = {
  fr: {
    // Navigation
    buy: "Acheter",
    messages: "Messages",
    profile: "Profil",
    admin: "Administration",
    login: "Connexion",
    logout: "Déconnexion",
    publish: "Vendre",
    publishAd: "Publier une annonce",
    displayMode: "Mode d'affichage",
    smartphone: "Smartphone",
    computer: "Ordinateur",
    
    // Browse page
    heroTitle: "TOUT LE BURUNDI AUJOURD'HUI",
    heroSubtitle: "Petites annonces locales rapides 🇧🇮",
    searchPlaceholder: "Rechercher un produit, un service...",
    priceMax: "Prix max (BIF)",
    cityAll: "Toutes les villes",
    categoryAll: "Toutes les catégories",
    filters: "Filtres",
    applyFilters: "Filtrer",
    noProducts: "Aucune annonce ne correspond à vos critères.",
    noProductsSub: "Nous n'avons trouvé aucun résultat avec vos critères. Modifiez vos filtres.",
    resetFilters: "Réinitialiser tous les filtres",
    location: "Lieu",
    price: "Prix",
    date: "Date",
    contactSeller: "Contacter le vendeur",
    description: "Description de l'article",
    seller: "Vendeur",
    back: "Retour",
    city: "Ville",
    category: "Catégorie",
    search: "Rechercher",
    
    // Profile
    myAds: "Mes Annonces",
    noAdsYet: "Vous n'avez pas encore publié d'annonces.",
    joined: "Membre depuis",
    
    // Auth
    authTitle: "Bienvenue sur AxelMarket",
    authSubtitle: "Connectez-vous pour publier des annonces et discuter avec les acheteurs",
    
    // Categories
    cat_Tous: "Tous",
    cat_Téléphones: "Téléphones",
    cat_Électronique: "Électronique",
    cat_Vêtements: "Vêtements",
    cat_Chaussures: "Chaussures",
    cat_Maison: "Maison",
    cat_Beauté: "Beauté",
    cat_Alimentation: "Alimentation",
    cat_Véhicules: "Véhicules",
    cat_Autres: "Autres",
  },
  rn: {
    // Navigation
    buy: "Kugura",
    messages: "Ubutumwa",
    profile: "Ibiranga",
    admin: "Ubuyobozi",
    login: "Kwinjira",
    logout: "Gusohoka",
    publish: "Kugurisha",
    publishAd: "Shira hanze itangazo",
    displayMode: "Uburyo bwo kwerekana",
    smartphone: "Terefoni",
    computer: "Imashini",
    
    // Browse page
    heroTitle: "UBURUNDI BWELAGURA UYUMUSI",
    heroSubtitle: "Amatangazo y'isoko rya hafi mu Burundi 🇧🇮",
    searchPlaceholder: "Rondera igikoresho, igikorwa...",
    priceMax: "Igiciro ntarengwa (BIF)",
    cityAll: "Igisagara cose",
    categoryAll: "Imice yose",
    filters: "Kuyungurura",
    applyFilters: "Muyungurure",
    noProducts: "Nta tangazo rihuye n'ivyo muriko murerondera.",
    noProductsSub: "Ntitwatoye ico muriko murarondera. Guhindura akayunguruzo.",
    resetFilters: "Siba akayunguruzo kose",
    location: "Ikibanza",
    price: "Igiciro",
    date: "Igihe",
    contactSeller: "Vugana n'uwugurisha",
    description: "Ibisobanuro ku gikoresho",
    seller: "Uwuriko agurisha",
    back: "Gusubira inyuma",
    city: "Igisagara",
    category: "Umuce",
    search: "Rondera",
    
    // Profile
    myAds: "Amatangazo yanje",
    noAdsYet: "Ntaratambuko ushira hanze.",
    joined: "Yiyandikishije kuva",
    
    // Auth
    authTitle: "Kaze kuri AxelMarket",
    authSubtitle: "Yinjira ubashe gushira hanze amatangazo no kuyaga n'abaguzi",
    
    // Categories
    cat_Tous: "Vyose",
    cat_Téléphones: "Terefoni",
    cat_Électronique: "Ivyuma n'Imiyaga",
    cat_Vêtements: "Imyambaro",
    cat_Chaussures: "Inkweto",
    cat_Maison: "Ibikoresho vyo mu nzu",
    cat_Beauté: "Ubwiza n'Ibisuko",
    cat_Alimentation: "Ibifungurwa",
    cat_Véhicules: "Imiduga n'Ikinga",
    cat_Autres: "Ibindi",
  },
  en: {
    // Navigation
    buy: "Buy",
    messages: "Messages",
    profile: "Profile",
    admin: "Admin Dashboard",
    login: "Log In",
    logout: "Log Out",
    publish: "Sell",
    publishAd: "Publish an Ad",
    displayMode: "Display Mode",
    smartphone: "Smartphone",
    computer: "Computer",
    
    // Browse page
    heroTitle: "ALL OF BURUNDI TODAY",
    heroSubtitle: "Fast local classified ads 🇧🇮",
    searchPlaceholder: "Search for a product, service...",
    priceMax: "Max price (BIF)",
    cityAll: "All cities",
    categoryAll: "All categories",
    filters: "Filters",
    applyFilters: "Filter",
    noProducts: "No products match your criteria.",
    noProductsSub: "We couldn't find any results with your criteria. Try changing your filters.",
    resetFilters: "Reset all filters",
    location: "Location",
    price: "Price",
    date: "Date",
    contactSeller: "Contact Seller",
    description: "Item Description",
    seller: "Seller",
    back: "Back",
    city: "City",
    category: "Category",
    search: "Search",
    
    // Profile
    myAds: "My Ads",
    noAdsYet: "You haven't published any ads yet.",
    joined: "Member since",
    
    // Auth
    authTitle: "Welcome to AxelMarket",
    authSubtitle: "Log in to post ads and chat with buyers",
    
    // Categories
    cat_Tous: "All",
    cat_Téléphones: "Phones",
    cat_Électronique: "Electronics",
    cat_Vêtements: "Clothing",
    cat_Chaussures: "Shoes",
    cat_Maison: "Home",
    cat_Beauté: "Beauty",
    cat_Alimentation: "Food",
    cat_Véhicules: "Vehicles",
    cat_Autres: "Others",
  },
  sw: {
    // Navigation
    buy: "Nunua",
    messages: "Ujumbe",
    profile: "Wasifu",
    admin: "Usimamizi",
    login: "Ingia",
    logout: "Ondoka",
    publish: "Uza",
    publishAd: "Chapisha Tangazo",
    displayMode: "Hali ya Kuonyesha",
    smartphone: "Simu",
    computer: "Kompyuta",
    
    // Browse page
    heroTitle: "BURUNDI NZIMA LEO",
    heroSubtitle: "Matangazo ya haraka ya biashara nchini Burundi 🇧🇮",
    searchPlaceholder: "Tafuta bidhaa, huduma...",
    priceMax: "Bei ya juu (BIF)",
    cityAll: "Miji yote",
    categoryAll: "Kategoria zote",
    filters: "Vichungi",
    applyFilters: "Chuja",
    noProducts: "Hakuna bidhaa inayolingana na vigezo vyako.",
    noProductsSub: "Hatukupata matokeo yoyote na vigezo vyako. Badilisha vichungi vyako.",
    resetFilters: "Rudisha vichungi vyote",
    location: "Mahali",
    price: "Bei",
    date: "Tarehe",
    contactSeller: "Wasiliana na Muuzaji",
    description: "Maelezo ya Bidhaa",
    seller: "Muuzaji",
    back: "Rudi",
    city: "Mji",
    category: "Jamii",
    search: "Tafuta",
    
    // Profile
    myAds: "Matangazo Yangu",
    noAdsYet: "Bado haujachapisha matangazo yoyote.",
    joined: "Mwanachama tangu",
    
    // Auth
    authTitle: "Karibu AxelMarket",
    authSubtitle: "Ingia ili uweze kuchapisha matangazo na kuongea na wanunuzi",
    
    // Categories
    cat_Tous: "Zote",
    cat_Téléphones: "Simu",
    cat_Électronique: "Elektroniki",
    cat_Vêtements: "Mavazi",
    cat_Chaussures: "Viatu",
    cat_Maison: "Vyombo vya Nyumbani",
    cat_Beauté: "Urembo",
    cat_Alimentation: "Vyakula",
    cat_Véhicules: "Magari & Vyombo",
    cat_Autres: "Mengineyo",
  }
};
