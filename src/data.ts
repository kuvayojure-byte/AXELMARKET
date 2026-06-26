import { Ad, User, Chat, Message, Category, TreasuryState, TreasuryTransaction, ActivityLog, WalletTransaction } from './types';

// Initial Mock Wallet Transactions
export const INITIAL_WALLET_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx_p1',
    userId: 'user_admin',
    type: 'depot',
    amount: 12500000,
    status: 'success',
    paymentNetwork: 'lumicash',
    refPayline: 'PAYLINE-LUMI-983172',
    accountDetails: '+257 79 123 456',
    createdAt: new Date(2026, 5, 20, 10, 0).toISOString()
  },
  {
    id: 'tx_p2',
    userId: 'user_1',
    type: 'depot',
    amount: 3100000,
    status: 'success',
    paymentNetwork: 'ecocash',
    refPayline: 'PAYLINE-ECO-554129',
    accountDetails: '+257 61 234 567',
    createdAt: new Date(2026, 5, 21, 11, 0).toISOString()
  }
];

// Initial Mock Users
export const INITIAL_USERS: User[] = [
  {
    id: 'user_admin',
    fullName: 'Axel Niyonzima',
    email: 'axel@market.bi',
    phone: '+257 79 123 456',
    city: 'Bujumbura',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isAdmin: true,
    isBlocked: false,
    createdAt: new Date(2026, 1, 15).toISOString(),
    walletBalance: 12500000
  },
  {
    id: 'user_1',
    fullName: 'Fabiola Kaneza',
    email: 'fabiola@gmail.com',
    phone: '+257 61 234 567',
    city: 'Gitega',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    isAdmin: false,
    isBlocked: false,
    createdAt: new Date(2026, 2, 10).toISOString(),
    walletBalance: 3100000
  },
  {
    id: 'user_2',
    fullName: 'Jean-Marie Bukuru',
    email: 'jm.bukuru@yahoo.fr',
    phone: '+257 75 876 543',
    city: 'Ngozi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isAdmin: false,
    isBlocked: false,
    createdAt: new Date(2026, 3, 1).toISOString(),
    walletBalance: 1500000
  },
  {
    id: 'user_3',
    fullName: 'Clara Irakiza',
    email: 'clara@outlook.com',
    phone: '+257 68 555 444',
    city: 'Rumonge',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    isAdmin: false,
    isBlocked: false,
    createdAt: new Date(2026, 3, 18).toISOString(),
    walletBalance: 650000
  }
];

// Initial Mock Ads
export const INITIAL_ADS: Ad[] = [
  {
    id: 'ad_1',
    title: 'iPhone 13 Pro Max - 256GB',
    description: 'iPhone 13 Pro Max en excellent état, batterie à 88%. Livré avec chargeur rapide d\'origine et une coque de protection offerte. Aucun rayure, état comme neuf.',
    price: 1850000,
    category: 'Téléphones',
    imageUrls: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80'
    ],
    sellerId: 'user_admin',
    sellerName: 'Axel Niyonzima',
    sellerPhone: '+257 79 123 456',
    city: 'Bujumbura',
    createdAt: new Date(2026, 5, 20, 10, 30).toISOString()
  },
  {
    id: 'ad_2',
    title: 'Ordinateur Portable HP ProBook',
    description: 'HP ProBook Intel Core i5, 8GB de RAM, 256GB SSD. Idéal pour étudiants ou professionnels. Batterie tenant plus de 4 heures. Vente urgente pour cause de voyage.',
    price: 950000,
    category: 'Électronique',
    imageUrls: [
      'https://images.unsplash.com/photo-1496181130204-755241524eab?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80'
    ],
    sellerId: 'user_1',
    sellerName: 'Fabiola Kaneza',
    sellerPhone: '+257 61 234 567',
    city: 'Gitega',
    createdAt: new Date(2026, 5, 21, 14, 15).toISOString()
  },
  {
    id: 'ad_3',
    title: 'Chaussures Nike Air Force 1',
    description: 'Baskets Nike Air Force 1 Originales, pointure 42. Très peu portées, semelle impeccable. Couleur blanche classique. Importées d\'Europe.',
    price: 140000,
    category: 'Chaussures',
    imageUrls: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'
    ],
    sellerId: 'user_2',
    sellerName: 'Jean-Marie Bukuru',
    sellerPhone: '+257 75 876 543',
    city: 'Ngozi',
    createdAt: new Date(2026, 5, 22, 9, 0).toISOString()
  },
  {
    id: 'ad_4',
    title: 'Robe de mariée élégante',
    description: 'Magnifique robe de soirée / mariage, portée une seule fois. Taille M/L ajustable à l\'arrière. Tissu de qualité supérieure avec broderies délicates.',
    price: 250000,
    category: 'Vêtements',
    imageUrls: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&auto=format&fit=crop&q=80'
    ],
    sellerId: 'user_3',
    sellerName: 'Clara Irakiza',
    sellerPhone: '+257 68 555 444',
    city: 'Rumonge',
    createdAt: new Date(2026, 5, 23, 16, 45).toISOString()
  },
  {
    id: 'ad_5',
    title: 'Sac de Riz Supérieur de Rugombo - 25kg',
    description: 'Riz blanc de qualité supérieure cultivé localement à Rugombo (Cibitoke). Grains entiers, parfum délicat, excellente cuisson. Sac scellé de 25 kg.',
    price: 85000,
    category: 'Alimentation',
    imageUrls: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80'
    ],
    sellerId: 'user_2',
    sellerName: 'Jean-Marie Bukuru',
    sellerPhone: '+257 75 876 543',
    city: 'Bujumbura',
    createdAt: new Date(2026, 5, 24, 11, 20).toISOString()
  },
  {
    id: 'ad_6',
    title: 'Toyota RAV4 Essence - Année 2008',
    description: 'Toyota RAV4 en excellent état mécanique. Boîte automatique, climatisation d\'origine fonctionnelle, vitres électriques. Kilométrage : 145 000 km. Papiers en règle (contrôle technique et assurance valides).',
    price: 19500000,
    category: 'Véhicules',
    imageUrls: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80'
    ],
    sellerId: 'user_1',
    sellerName: 'Fabiola Kaneza',
    sellerPhone: '+257 61 234 567',
    city: 'Bujumbura',
    createdAt: new Date(2026, 5, 25, 8, 10).toISOString()
  },
  {
    id: 'ad_7',
    title: 'Kit Maquillage Complet Huda Beauty',
    description: 'Palette de fards à paupières, fonds de teint, rouges à lèvres mats et pinceaux professionnels inclus. Idéal pour un salon de coiffure ou usage personnel de qualité.',
    price: 110000,
    category: 'Beauté',
    imageUrls: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80'
    ],
    sellerId: 'user_3',
    sellerName: 'Clara Irakiza',
    sellerPhone: '+257 68 555 444',
    city: 'Rumonge',
    createdAt: new Date(2026, 5, 25, 15, 30).toISOString()
  },
  {
    id: 'ad_8',
    title: 'Salon Complet en Bois d\'Eucalyptus',
    description: 'Ensemble de canapés fabriqués localement avec du bois d\'eucalyptus traité : un canapé 3 places, deux fauteuils individuels et une table basse assortie. Coussins confortables déhoussables.',
    price: 1250000,
    category: 'Maison',
    imageUrls: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80'
    ],
    sellerId: 'user_admin',
    sellerName: 'Axel Niyonzima',
    sellerPhone: '+257 79 123 456',
    city: 'Bujumbura',
    createdAt: new Date(2026, 5, 25, 17, 0).toISOString()
  }
];

// Initial Mock Chats & Messages
export const INITIAL_CHATS: Chat[] = [
  {
    id: 'chat_1',
    adId: 'ad_2',
    adTitle: 'Ordinateur Portable HP ProBook',
    adImage: 'https://images.unsplash.com/photo-1496181130204-755241524eab?w=150&auto=format&fit=crop&q=80',
    adPrice: 950000,
    buyerId: 'user_admin',
    buyerName: 'Axel Niyonzima',
    sellerId: 'user_1',
    sellerName: 'Fabiola Kaneza',
    lastMessageText: 'Le prix est-il légèrement négociable ?',
    updatedAt: new Date(2026, 5, 25, 16, 20).toISOString(),
    unreadCount: 1
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg_1_1',
    chatId: 'chat_1',
    senderId: 'user_admin',
    text: 'Bonjour Fabiola, je suis très intéressé par votre HP ProBook.',
    createdAt: new Date(2026, 5, 25, 16, 10).toISOString()
  },
  {
    id: 'msg_1_2',
    chatId: 'chat_1',
    senderId: 'user_1',
    text: 'Bonjour Axel ! Oui, il est disponible et en très bon état.',
    createdAt: new Date(2026, 5, 25, 16, 15).toISOString()
  },
  {
    id: 'msg_1_3',
    chatId: 'chat_1',
    senderId: 'user_admin',
    text: 'Le prix est-il légèrement négociable ?',
    createdAt: new Date(2026, 5, 25, 16, 20).toISOString()
  }
];

// Initial Mock Activity Logs for AxelMarket
export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act_1',
    type: 'treasury_deposit',
    description: 'Dépôt initial de lancement d\'AxelMarket dans le coffre-fort',
    userEmailOrPhone: 'axel@market.bi',
    timestamp: new Date(2026, 5, 1, 12, 0).toISOString(),
    amount: 5000000
  },
  {
    id: 'act_2',
    type: 'user_register',
    description: 'Nouveau membre enregistré : Fabiola Kaneza',
    userEmailOrPhone: '+257 61 234 567',
    timestamp: new Date(2026, 5, 10, 8, 30).toISOString()
  },
  {
    id: 'act_3',
    type: 'user_register',
    description: 'Nouveau membre enregistré : Jean-Marie Bukuru',
    userEmailOrPhone: '+257 75 876 543',
    timestamp: new Date(2026, 5, 11, 10, 15).toISOString()
  },
  {
    id: 'act_4',
    type: 'ad_publish',
    description: 'Nouvelle annonce publiée : iPhone 13 Pro Max - 256GB',
    userEmailOrPhone: '+257 79 123 456',
    timestamp: new Date(2026, 5, 20, 10, 30).toISOString(),
    amount: 1850000
  },
  {
    id: 'act_5',
    type: 'ad_publish',
    description: 'Nouvelle annonce publiée : Ordinateur Portable HP ProBook',
    userEmailOrPhone: '+257 61 234 567',
    timestamp: new Date(2026, 5, 21, 14, 15).toISOString(),
    amount: 950000
  },
  {
    id: 'act_6',
    type: 'ad_publish',
    description: 'Nouvelle annonce publiée : Chaussures Nike Air Force 1',
    userEmailOrPhone: '+257 75 876 543',
    timestamp: new Date(2026, 5, 22, 9, 0).toISOString(),
    amount: 140000
  }
];

// Helper to initialize LocalStorage database
export function initializeDatabase() {
  if (!localStorage.getItem('axm_initialized')) {
    localStorage.setItem('axm_users', JSON.stringify(INITIAL_USERS));
    localStorage.setItem('axm_ads', JSON.stringify(INITIAL_ADS));
    localStorage.setItem('axm_chats', JSON.stringify(INITIAL_CHATS));
    localStorage.setItem('axm_messages', JSON.stringify(INITIAL_MESSAGES));
    localStorage.setItem('axm_activity_logs', JSON.stringify(INITIAL_ACTIVITY_LOGS));
    localStorage.setItem('axm_wallet_transactions', JSON.stringify(INITIAL_WALLET_TRANSACTIONS));
    localStorage.setItem('axm_current_user', JSON.stringify(INITIAL_USERS[0])); // Axel admin by default for preview
    localStorage.setItem('axm_initialized', 'true');
  }
}

// Reset Database function
export function resetDatabase() {
  localStorage.removeItem('axm_users');
  localStorage.removeItem('axm_ads');
  localStorage.removeItem('axm_chats');
  localStorage.removeItem('axm_messages');
  localStorage.removeItem('axm_activity_logs');
  localStorage.removeItem('axm_wallet_transactions');
  localStorage.removeItem('axm_current_user');
  localStorage.removeItem('axm_initialized');
  initializeDatabase();
}

// Database Getters & Setters
export function getAds(): Ad[] {
  initializeDatabase();
  const ads = localStorage.getItem('axm_ads');
  return ads ? JSON.parse(ads).filter((ad: Ad) => !ad.isDeleted) : [];
}

export function saveAd(ad: Ad): void {
  const ads = getAds();
  const index = ads.findIndex(a => a.id === ad.id);
  if (index >= 0) {
    ads[index] = ad;
  } else {
    ads.unshift(ad); // New ads go first
    logActivity('ad_publish', `Nouvelle annonce publiée : ${ad.title}`, ad.sellerPhone || ad.sellerName || 'Membre', ad.price);
  }
  localStorage.setItem('axm_ads', JSON.stringify(ads));
}

export function deleteAd(adId: string): void {
  const ads = getAds();
  const index = ads.findIndex(a => a.id === adId);
  if (index >= 0) {
    const deletedAdTitle = ads[index].title;
    const deletedAdPrice = ads[index].price;
    ads[index].isDeleted = true;
    localStorage.setItem('axm_ads', JSON.stringify(ads));
    logActivity('ad_delete', `Annonce supprimée : ${deletedAdTitle}`, 'Admin', deletedAdPrice);
  }
}

export function getUsers(): User[] {
  initializeDatabase();
  const users = localStorage.getItem('axm_users');
  return users ? JSON.parse(users) : [];
}

export function saveUser(user: User): void {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem('axm_users', JSON.stringify(users));

  // If this user is currently logged in, update their session too
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === user.id) {
    setCurrentUser(user);
  }
}

export function blockUser(userId: string, isBlocked: boolean = true): void {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index >= 0) {
    users[index].isBlocked = isBlocked;
    localStorage.setItem('axm_users', JSON.stringify(users));

    // Log the user block/unblock action
    logActivity(
      isBlocked ? 'user_block' : 'user_unblock',
      `${isBlocked ? 'Membre bloqué' : 'Membre débloqué'} : ${users[index].fullName}`,
      users[index].phone || users[index].email || 'Admin'
    );

    // Update active user state if same
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      currentUser.isBlocked = isBlocked;
      setCurrentUser(currentUser);
    }
  }
}

export function getCurrentUser(): User | null {
  initializeDatabase();
  const user = localStorage.getItem('axm_current_user');
  return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem('axm_current_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('axm_current_user');
  }
}

export function getChats(): Chat[] {
  initializeDatabase();
  const chats = localStorage.getItem('axm_chats');
  return chats ? JSON.parse(chats) : [];
}

export function getMessages(chatId: string): Message[] {
  initializeDatabase();
  const messages = localStorage.getItem('axm_messages');
  if (!messages) return [];
  return JSON.parse(messages).filter((m: Message) => m.chatId === chatId);
}

export function sendMessage(chatId: string, senderId: string, text: string): Message {
  const messages = localStorage.getItem('axm_messages') ? JSON.parse(localStorage.getItem('axm_messages')!) : [];
  
  const newMessage: Message = {
    id: `msg_${Date.now()}`,
    chatId,
    senderId,
    text,
    createdAt: new Date().toISOString()
  };

  messages.push(newMessage);
  localStorage.setItem('axm_messages', JSON.stringify(messages));

  // Update chat last message
  const chats = getChats();
  const chatIndex = chats.findIndex(c => c.id === chatId);
  if (chatIndex >= 0) {
    chats[chatIndex].lastMessageText = text;
    chats[chatIndex].updatedAt = newMessage.createdAt;
    // Increment unread count if recipient is not sender
    if (chats[chatIndex].sellerId === senderId) {
      // Buyer receives
      chats[chatIndex].unreadCount = (chats[chatIndex].unreadCount || 0) + 1;
    } else {
      // Seller receives
      chats[chatIndex].unreadCount = (chats[chatIndex].unreadCount || 0) + 1;
    }
    localStorage.setItem('axm_chats', JSON.stringify(chats));
  }

  return newMessage;
}

export function startChat(ad: Ad, buyer: User): Chat {
  const chats = getChats();
  
  // Check if chat already exists
  const existingChat = chats.find(c => c.adId === ad.id && c.buyerId === buyer.id);
  if (existingChat) {
    return existingChat;
  }

  const newChat: Chat = {
    id: `chat_${Date.now()}`,
    adId: ad.id,
    adTitle: ad.title,
    adImage: ad.imageUrls[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=150',
    adPrice: ad.price,
    buyerId: buyer.id,
    buyerName: buyer.fullName,
    sellerId: ad.sellerId,
    sellerName: ad.sellerName,
    lastMessageText: `Intéressé par l'annonce : ${ad.title}`,
    updatedAt: new Date().toISOString(),
    unreadCount: 0
  };

  chats.unshift(newChat);
  localStorage.setItem('axm_chats', JSON.stringify(chats));

  // Create initial automated buyer message
  const messages = localStorage.getItem('axm_messages') ? JSON.parse(localStorage.getItem('axm_messages')!) : [];
  const initMessage: Message = {
    id: `msg_init_${Date.now()}`,
    chatId: newChat.id,
    senderId: buyer.id,
    text: `Bonjour ${ad.sellerName}, je suis intéressé par votre annonce "${ad.title}" affichée à ${ad.price.toLocaleString()} BIF. Est-elle toujours disponible ?`,
    createdAt: new Date().toISOString()
  };
  messages.push(initMessage);
  localStorage.setItem('axm_messages', JSON.stringify(messages));

  return newChat;
}

export function markChatAsRead(chatId: string): void {
  const chats = getChats();
  const chatIndex = chats.findIndex(c => c.id === chatId);
  if (chatIndex >= 0) {
    chats[chatIndex].unreadCount = 0;
    localStorage.setItem('axm_chats', JSON.stringify(chats));
  }
}

export function getTreasury(): TreasuryState {
  const data = localStorage.getItem('axm_treasury');
  if (data) {
    return JSON.parse(data);
  }
  // Initialize default treasury
  const defaultTreasury: TreasuryState = {
    balance: 5000000, // 5,000,000 BIF initial balance for demonstration
    passwordHash: 'axelmarket', // default owner password
    transactions: [
      {
        id: 'tx_init',
        type: 'deposit',
        amount: 5000000,
        description: 'Solde initial de la trésorerie de lancement d\'AxelMarket',
        createdAt: new Date(2026, 5, 1).toISOString()
      }
    ]
  };
  localStorage.setItem('axm_treasury', JSON.stringify(defaultTreasury));
  return defaultTreasury;
}

export function saveTreasury(state: TreasuryState): void {
  localStorage.setItem('axm_treasury', JSON.stringify(state));
}

export function depositToTreasury(amount: number, description: string): TreasuryState {
  const treasury = getTreasury();
  const transaction: TreasuryTransaction = {
    id: `tx_${Date.now()}`,
    type: 'deposit',
    amount,
    description: description || 'Dépôt manuel propriétaire',
    createdAt: new Date().toISOString()
  };
  treasury.balance += amount;
  treasury.transactions.unshift(transaction);
  saveTreasury(treasury);

  // Log the treasury deposit activity
  logActivity('treasury_deposit', `Dépôt dans le Coffre-fort : ${transaction.description}`, 'Propriétaire', amount);

  return treasury;
}

export function withdrawFromTreasury(amount: number, description: string): { success: boolean; treasury?: TreasuryState; error?: string } {
  const treasury = getTreasury();
  if (treasury.balance < amount) {
    return { success: false, error: 'Solde de la trésorerie insuffisant pour effectuer ce retrait.' };
  }
  const transaction: TreasuryTransaction = {
    id: `tx_${Date.now()}`,
    type: 'withdrawal',
    amount,
    description: description || 'Retrait manuel propriétaire',
    createdAt: new Date().toISOString()
  };
  treasury.balance -= amount;
  treasury.transactions.unshift(transaction);
  saveTreasury(treasury);

  // Log the treasury withdrawal activity
  logActivity('treasury_withdraw', `Retrait depuis le Coffre-fort : ${transaction.description}`, 'Propriétaire', amount);

  return { success: true, treasury };
}

// Activity Logging getters and triggers
export function getActivityLogs(): ActivityLog[] {
  initializeDatabase();
  const logs = localStorage.getItem('axm_activity_logs');
  return logs ? JSON.parse(logs) : [];
}

export function logActivity(type: ActivityLog['type'], description: string, userEmailOrPhone: string, amount?: number): void {
  const logs = getActivityLogs();
  const newLog: ActivityLog = {
    id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    type,
    description,
    userEmailOrPhone,
    timestamp: new Date().toISOString(),
    amount
  };
  logs.unshift(newLog); // Newest first
  localStorage.setItem('axm_activity_logs', JSON.stringify(logs));
}

export function getWalletTransactions(userId?: string): WalletTransaction[] {
  initializeDatabase();
  const txs = localStorage.getItem('axm_wallet_transactions');
  if (!txs) return [];
  const parsed: WalletTransaction[] = JSON.parse(txs);
  if (userId) {
    return parsed.filter(t => t.userId === userId);
  }
  return parsed;
}

export function addWalletTransaction(tx: WalletTransaction): void {
  initializeDatabase();
  const txs = getWalletTransactions();
  txs.unshift(tx);
  localStorage.setItem('axm_wallet_transactions', JSON.stringify(txs));
}

export function depositToUserWallet(userId: string, amount: number, network: string, accountDetails: string, refPayline?: string, status: 'pending' | 'success' | 'failed' = 'success'): User | null {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index >= 0) {
    if (status === 'success') {
      users[index].walletBalance = (users[index].walletBalance || 0) + amount;
      localStorage.setItem('axm_users', JSON.stringify(users));
      
      // Update active user state if it's the current user
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        currentUser.walletBalance = users[index].walletBalance;
        setCurrentUser(currentUser);
      }
      
      // Also, deposit to Treasury Vault:
      depositToTreasury(amount, `Dépôt Wallet de ${users[index].fullName} via ${network}`);
    }
    
    // Log activity
    logActivity('user_register', `Dépôt Wallet via ${network} : +${amount.toLocaleString()} BIF (${accountDetails}) [${status}]`, users[index].phone || users[index].email || users[index].fullName, amount);
    
    // Determine paymentNetwork type
    let netType: 'lumicash' | 'ecocash' | 'airtel_money' | 'card' = 'lumicash';
    const netLower = network.toLowerCase();
    if (netLower.includes('ecocash')) netType = 'ecocash';
    else if (netLower.includes('airtel')) netType = 'airtel_money';
    else if (netLower.includes('visa') || netLower.includes('mastercard') || netLower.includes('carte')) netType = 'card';

    // Log WalletTransaction
    addWalletTransaction({
      id: `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId,
      type: 'depot',
      amount,
      status,
      paymentNetwork: netType,
      refPayline: refPayline || `PAYLINE-DEP-${Math.floor(Math.random() * 900000 + 100000)}`,
      accountDetails,
      createdAt: new Date().toISOString()
    });
    
    return users[index];
  }
  return null;
}

export function withdrawFromUserWallet(userId: string, amount: number, network: string, accountDetails: string, refPayline?: string, status: 'pending' | 'success' | 'failed' = 'success'): { success: boolean; user?: User; error?: string } {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index >= 0) {
    const currentBalance = users[index].walletBalance || 0;
    if (status === 'success') {
      if (currentBalance < amount) {
        return { success: false, error: 'Solde du Wallet insuffisant pour effectuer ce retrait.' };
      }
      users[index].walletBalance = currentBalance - amount;
      localStorage.setItem('axm_users', JSON.stringify(users));
      
      // Update active user state if it's the current user
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        currentUser.walletBalance = users[index].walletBalance;
        setCurrentUser(currentUser);
      }
      
      // Cash physically leaves Axelmarket's possession to go back to the user!
      withdrawFromTreasury(amount, `Retrait Wallet de ${users[index].fullName} via ${network}`);
    }
    
    // Log activity
    logActivity('user_register', `Retrait Wallet via ${network} : -${amount.toLocaleString()} BIF (${accountDetails}) [${status}]`, users[index].phone || users[index].email || users[index].fullName, amount);
    
    // Determine paymentNetwork type
    let netType: 'lumicash' | 'ecocash' | 'airtel_money' | 'card' = 'lumicash';
    const netLower = network.toLowerCase();
    if (netLower.includes('ecocash')) netType = 'ecocash';
    else if (netLower.includes('airtel')) netType = 'airtel_money';
    else if (netLower.includes('visa') || netLower.includes('mastercard') || netLower.includes('carte')) netType = 'card';

    // Log WalletTransaction
    addWalletTransaction({
      id: `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId,
      type: 'retrait',
      amount,
      status,
      paymentNetwork: netType,
      refPayline: refPayline || `PAYLINE-WIT-${Math.floor(Math.random() * 900000 + 100000)}`,
      accountDetails,
      createdAt: new Date().toISOString()
    });
    
    return { success: true, user: users[index] };
  }
  return { success: false, error: 'Utilisateur introuvable.' };
}

export function purchaseProductWithWallet(productId: string, buyerId: string, commissionPercent: number = 4): { success: boolean; error?: string; ad?: Ad } {
  const ads = getAds();
  const adIndex = ads.findIndex(a => a.id === productId);
  if (adIndex < 0) {
    return { success: false, error: 'Annonce introuvable.' };
  }
  const ad = ads[adIndex];
  if (ad.sellerId === buyerId) {
    return { success: false, error: 'Vous ne pouvez pas acheter votre propre produit.' };
  }
  
  const users = getUsers();
  const buyerIndex = users.findIndex(u => u.id === buyerId);
  if (buyerIndex < 0) {
    return { success: false, error: 'Acheteur introuvable.' };
  }
  const buyer = users[buyerIndex];
  const buyerBalance = buyer.walletBalance || 0;
  
  if (buyerBalance < ad.price) {
    return { success: false, error: `Solde insuffisant. Il vous manque ${(ad.price - buyerBalance).toLocaleString()} BIF pour acheter ce produit.` };
  }
  
  const sellerIndex = users.findIndex(u => u.id === ad.sellerId);
  if (sellerIndex < 0) {
    return { success: false, error: 'Vendeur introuvable.' };
  }
  const seller = users[sellerIndex];
  
  // Calculate commission (e.g. 4%)
  const commissionAmount = Math.round(ad.price * (commissionPercent / 100));
  const sellerReceives = ad.price - commissionAmount;
  
  // Deduct from buyer
  buyer.walletBalance = buyerBalance - ad.price;
  // Add to seller
  seller.walletBalance = (seller.walletBalance || 0) + sellerReceives;
  
  // Save updated users
  localStorage.setItem('axm_users', JSON.stringify(users));
  
  // Mark ad as deleted or sold (let's set isDeleted to true to hide from listing)
  ad.isDeleted = true;
  localStorage.setItem('axm_ads', JSON.stringify(ads));
  
  // Update active buyer state if currently logged in
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === buyerId) {
    currentUser.walletBalance = buyer.walletBalance;
    setCurrentUser(currentUser);
  }
  
  // Log the activity
  logActivity(
    'treasury_deposit',
    `Commission Axelmarket (${commissionPercent}%) prélevée sur la vente de "${ad.title}" de ${seller.fullName}`,
    buyer.phone || buyer.email || buyer.fullName,
    commissionAmount
  );
  
  logActivity(
    'ad_delete',
    `Achat sécurisé : "${ad.title}" acheté par ${buyer.fullName}. Comm: ${commissionAmount.toLocaleString()} BIF.`,
    buyer.phone || buyer.email || buyer.fullName,
    ad.price
  );
  
  // Put the commission directly into the Treasury Vault!
  depositToTreasury(commissionAmount, `Commission de service ${commissionPercent}% - Vente "${ad.title}" de ${seller.fullName} à ${buyer.fullName}`);
  
  // Create wallet transaction records for the purchase and sale inside the ledger
  const refPayline = `PAYLINE-BUY-${Math.floor(Math.random() * 900000 + 100000)}`;
  
  // 1. Buyer Debit Record
  addWalletTransaction({
    id: `txn_${Date.now()}_buy`,
    userId: buyerId,
    type: 'achat',
    amount: ad.price,
    status: 'success',
    paymentNetwork: 'lumicash', // processed inside our ledger
    refPayline,
    accountDetails: `Achat "${ad.title}"`,
    createdAt: new Date().toISOString()
  });

  // 2. Seller Credit Record
  addWalletTransaction({
    id: `txn_${Date.now()}_sell`,
    userId: ad.sellerId,
    type: 'vente',
    amount: sellerReceives,
    status: 'success',
    paymentNetwork: 'lumicash',
    refPayline,
    accountDetails: `Vente "${ad.title}" (Net après commission)`,
    createdAt: new Date().toISOString()
  });

  // 3. Commission Record
  addWalletTransaction({
    id: `txn_${Date.now()}_comm`,
    userId: 'user_admin', // credited to treasury / admin view
    type: 'commission',
    amount: commissionAmount,
    status: 'success',
    paymentNetwork: 'lumicash',
    refPayline,
    accountDetails: `Commission ${commissionPercent}% sur "${ad.title}"`,
    createdAt: new Date().toISOString()
  });
  
  return { success: true, ad };
}

