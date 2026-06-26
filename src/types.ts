/**
 * TypeScript types for AxelMarket
 */

export type Category = 
  | 'Téléphones'
  | 'Électronique'
  | 'Vêtements'
  | 'Chaussures'
  | 'Maison'
  | 'Beauté'
  | 'Alimentation'
  | 'Véhicules'
  | 'Autres';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  fullName: string;
  city: string;
  avatar: string;
  isAdmin: boolean;
  isBlocked: boolean;
  createdAt: string;
  walletBalance: number;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number; // in BIF (Franc Burundais)
  category: Category;
  imageUrls: string[];
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  city: string;
  createdAt: string;
  isDeleted?: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  adId: string;
  adTitle: string;
  adImage: string;
  adPrice: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  lastMessageText: string;
  updatedAt: string;
  unreadCount?: number;
}

export interface CityOption {
  name: string;
  province: string;
}

export const BURUNDI_CITIES: CityOption[] = [
  { name: 'Bujumbura', province: 'Mairie de Bujumbura' },
  { name: 'Gitega', province: 'Gitega' },
  { name: 'Ngozi', province: 'Ngozi' },
  { name: 'Rumonge', province: 'Rumonge' },
  { name: 'Kayanza', province: 'Kayanza' },
  { name: 'Muyinga', province: 'Muyinga' },
  { name: 'Kirundo', province: 'Kirundo' },
  { name: 'Makamba', province: 'Makamba' },
  { name: 'Bubanza', province: 'Bubanza' },
  { name: 'Rutana', province: 'Rutana' },
  { name: 'Cankuzo', province: 'Cankuzo' },
  { name: 'Ruyigi', province: 'Ruyigi' },
  { name: 'Muramvya', province: 'Muramvya' },
  { name: 'Bururi', province: 'Bururi' },
  { name: 'Mwaro', province: 'Mwaro' },
  { name: 'Cibitoke', province: 'Cibitoke' },
  { name: 'Karuzi', province: 'Karuzi' }
];

export const CATEGORIES: Category[] = [
  'Téléphones',
  'Électronique',
  'Vêtements',
  'Chaussures',
  'Maison',
  'Beauté',
  'Alimentation',
  'Véhicules',
  'Autres'
];

export interface TreasuryTransaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  createdAt: string;
}

export interface TreasuryState {
  balance: number;
  passwordHash: string;
  transactions: TreasuryTransaction[];
}

export interface ActivityLog {
  id: string;
  type: 'user_register' | 'ad_publish' | 'ad_delete' | 'user_block' | 'user_unblock' | 'treasury_deposit' | 'treasury_withdraw' | 'message_send';
  description: string;
  userEmailOrPhone: string;
  timestamp: string;
  amount?: number;
}

export type TransactionType = 'depot' | 'retrait' | 'achat' | 'commission' | 'vente';
export type TransactionStatus = 'pending' | 'success' | 'failed';

export interface WalletTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  paymentNetwork: 'lumicash' | 'ecocash' | 'airtel_money' | 'card';
  refPayline: string;
  accountDetails: string;
  createdAt: string;
}



