import { useState, useEffect } from 'react';
import { User, Ad, ActivityLog } from '../types';
import { getUsers, getAds, blockUser, deleteAd, resetDatabase, getTreasury, depositToTreasury, withdrawFromTreasury, saveTreasury, getActivityLogs, getCurrentUser } from '../data';
import { Shield, Users, Package, RefreshCw, UserX, UserCheck, Trash2, Eye, Ban, Lock, Unlock, Wallet, Coins, ArrowUpRight, ArrowDownLeft, EyeOff, History, Clock, Activity } from 'lucide-react';

interface AdminTabProps {
  onAdSelected: (ad: Ad) => void;
  onRefresh: () => void;
}

export default function AdminTab({ onAdSelected, onRefresh }: AdminTabProps) {
  const currentUser = getCurrentUser();
  const isOwner = currentUser?.email?.toLowerCase() === 'kuvayojure@gmail.com' || currentUser?.email?.toLowerCase() === 'axel@market.bi';

  const [users, setUsers] = useState<User[]>(getUsers());
  const [ads, setAds] = useState<Ad[]>(getAds());
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'ads' | 'treasury' | 'history'>('users');
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => getActivityLogs());
  const [selectedLogFilter, setSelectedLogFilter] = useState<'all' | 'ads' | 'users' | 'treasury'>('all');

  // Filter logs based on selection
  const getFilteredLogs = () => {
    let logsToShow = activityLogs;
    if (!isOwner) {
      logsToShow = logsToShow.filter(
        (log) => log.type !== 'treasury_deposit' && log.type !== 'treasury_withdraw'
      );
    }
    if (selectedLogFilter === 'all') return logsToShow;
    return logsToShow.filter((log) => {
      if (selectedLogFilter === 'ads') {
        return log.type === 'ad_publish' || log.type === 'ad_delete';
      }
      if (selectedLogFilter === 'users') {
        return log.type === 'user_register' || log.type === 'user_block' || log.type === 'user_unblock';
      }
      if (selectedLogFilter === 'treasury' && isOwner) {
        return log.type === 'treasury_deposit' || log.type === 'treasury_withdraw';
      }
      return true;
    });
  };

  // Vault protection and view states
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Treasury active states
  const [treasury, setTreasury] = useState(() => getTreasury());
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDesc, setDepositDesc] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawDesc, setWithdrawDesc] = useState('');

  // Password alteration states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');

  // Payment gateway configuration status
  const [paymentGatewayStatus, setPaymentGatewayStatus] = useState<any>(null);

  useEffect(() => {
    if (activeSubTab === 'treasury') {
      fetch('/api/payment/status')
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            setPaymentGatewayStatus(data.gateways);
          }
        })
        .catch(err => console.error('Error fetching payment status:', err));
    }
  }, [activeSubTab]);

  const handleUnlockVault = () => {
    if (passwordInput === treasury.passwordHash) {
      setIsUnlocked(true);
      setPasswordError('');
    } else {
      setPasswordError('Mot de passe incorrect. Veuillez réessayer.');
    }
  };

  const handleDeposit = () => {
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Veuillez entrer un montant supérieur à 0.');
      return;
    }
    const updated = depositToTreasury(amt, depositDesc);
    setTreasury(updated);
    setActivityLogs(getActivityLogs());
    setDepositAmount('');
    setDepositDesc('');
    alert('Dépôt enregistré avec succès !');
  };

  const handleWithdraw = () => {
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Veuillez entrer un montant supérieur à 0.');
      return;
    }
    const res = withdrawFromTreasury(amt, withdrawDesc);
    if (!res.success) {
      alert(res.error || 'Erreur lors du retrait.');
      return;
    }
    if (res.treasury) {
      setTreasury(res.treasury);
    }
    setActivityLogs(getActivityLogs());
    setWithdrawAmount('');
    setWithdrawDesc('');
    alert('Retrait enregistré avec succès !');
  };

  const handleChangePassword = () => {
    setPasswordChangeSuccess('');
    setPasswordChangeError('');

    if (currentPassword !== treasury.passwordHash) {
      setPasswordChangeError('Mot de passe actuel incorrect.');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setPasswordChangeError('Le nouveau mot de passe doit comporter au moins 4 caractères.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError('La confirmation du nouveau mot de passe ne correspond pas.');
      return;
    }

    const updated = {
      ...treasury,
      passwordHash: newPassword
    };
    saveTreasury(updated);
    setTreasury(updated);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordChangeSuccess('Mot de passe mis à jour avec succès !');
  };

  const handleToggleBlock = (userId: string, currentStatus: boolean) => {
    if (userId === 'user_admin') {
      alert('Vous ne pouvez pas bloquer le compte administrateur principal !');
      return;
    }
    blockUser(userId, !currentStatus);
    setUsers(getUsers());
    setActivityLogs(getActivityLogs());
    onRefresh();
  };

  const handleDeleteAd = (adId: string) => {
    if (confirm('Voulez-vous vraiment supprimer définitivement cette annonce ?')) {
      deleteAd(adId);
      setAds(getAds());
      setActivityLogs(getActivityLogs());
      onRefresh();
    }
  };

  const handleResetDb = () => {
    if (confirm('Voulez-vous réinitialiser complètement la base de données locale aux valeurs par défaut ? Vos données actuelles seront effacées.')) {
      resetDatabase();
      setUsers(getUsers());
      setAds(getAds());
      setActivityLogs(getActivityLogs());
      onRefresh();
      alert('Base de données réinitialisée !');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Quick Stats Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Membres Inscrits</p>
            <p className="text-2xl font-black text-gray-900">{users.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl">
            <Package size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Annonces Actives</p>
            <p className="text-2xl font-black text-gray-900">{ads.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <button
            onClick={handleResetDb}
            className="w-full h-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl border border-gray-200 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
          >
            <RefreshCw size={16} className="text-blue-700" />
            Réinitialiser la Base
          </button>
        </div>
      </div>

      {/* Admin Tabs Toggle */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <button
            onClick={() => setActiveSubTab('users')}
            className={`flex-1 py-4 text-center font-bold text-xs sm:text-sm transition-all border-b-2 flex items-center justify-center gap-2 ${
              activeSubTab === 'users'
                ? 'border-blue-700 text-blue-700 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Users size={16} />
            Utilisateurs ({users.length})
          </button>
          <button
            onClick={() => setActiveSubTab('ads')}
            className={`flex-1 py-4 text-center font-bold text-xs sm:text-sm transition-all border-b-2 flex items-center justify-center gap-2 ${
              activeSubTab === 'ads'
                ? 'border-blue-700 text-blue-700 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Package size={16} />
            Annonces ({ads.length})
          </button>
          {isOwner && (
            <button
              onClick={() => setActiveSubTab('treasury')}
              className={`flex-1 py-4 text-center font-bold text-xs sm:text-sm transition-all border-b-2 flex items-center justify-center gap-2 ${
                activeSubTab === 'treasury'
                  ? 'border-blue-700 text-blue-700 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Wallet size={16} />
              Trésorerie (Vault)
            </button>
          )}
          <button
            onClick={() => setActiveSubTab('history')}
            className={`flex-1 py-4 text-center font-bold text-xs sm:text-sm transition-all border-b-2 flex items-center justify-center gap-2 ${
              activeSubTab === 'history'
                ? 'border-blue-700 text-blue-700 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <History size={16} />
            Historique ({activityLogs.length})
          </button>
        </div>

        {/* Sub-tab content */}
        <div className="p-6">
          {activeSubTab === 'users' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold">
                    <th className="py-3 px-4">Utilisateur</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Ville</th>
                    <th className="py-3 px-4">Rôle / Statut</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <img src={u.avatar} alt="" className="w-9 h-9 rounded-full object-cover bg-gray-100" />
                        <div>
                          <p className="font-extrabold text-gray-900">{u.fullName}</p>
                          <p className="text-[10px] text-gray-400">ID: {u.id}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-gray-700 text-xs">{u.phone || 'Pas de tél'}</p>
                        <p className="text-gray-400 text-xs">{u.email || 'Pas d\'email'}</p>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-600 text-xs">{u.city}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {u.isAdmin ? (
                            <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                              Admin
                            </span>
                          ) : (
                            <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              Membre
                            </span>
                          )}
                          {u.isBlocked ? (
                            <span className="bg-red-100 text-red-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <Ban size={8} />
                              Bloqué
                            </span>
                          ) : (
                            <span className="bg-green-100 text-green-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              Actif
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {u.id !== 'user_admin' && (
                          <button
                            onClick={() => handleToggleBlock(u.id, u.isBlocked)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              u.isBlocked
                                ? 'bg-green-50 hover:bg-green-100 text-green-700'
                                : 'bg-red-50 hover:bg-red-100 text-red-700'
                            }`}
                          >
                            {u.isBlocked ? 'Débloquer' : 'Bloquer'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeSubTab === 'ads' ? (
            <div className="overflow-x-auto animate-in fade-in duration-200">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold">
                    <th className="py-3 px-4">Annonce</th>
                    <th className="py-3 px-4">Catégorie</th>
                    <th className="py-3 px-4">Vendeur</th>
                    <th className="py-3 px-4">Prix (BIF)</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ads.map((ad) => (
                    <tr key={ad.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-4 flex items-center gap-3 max-w-xs">
                        <img src={ad.imageUrls[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-extrabold text-gray-900 truncate">{ad.title}</p>
                          <p className="text-[10px] text-gray-400 truncate">{ad.city}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-blue-50 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                          {ad.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-gray-800 text-xs">{ad.sellerName}</p>
                        <p className="text-[10px] text-gray-400">{ad.sellerPhone}</p>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-gray-900 font-mono text-xs">
                        {ad.price.toLocaleString()} BIF
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5 flex justify-end items-center h-16">
                        <button
                          onClick={() => onAdSelected(ad)}
                          className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors cursor-pointer"
                          title="Voir l'annonce"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteAd(ad.id)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer"
                          title="Supprimer l'annonce"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {ads.length === 0 && (
                <div className="text-center py-12 text-gray-400 font-medium">
                  Aucune annonce active sur le marché.
                </div>
              )}
            </div>
          ) : activeSubTab === 'treasury' ? (
            // Treasury Subtab guarded by password
            <div className="animate-in fade-in duration-250">
              {!isUnlocked ? (
                <div className="max-w-md mx-auto py-8 text-center space-y-6">
                  <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center border border-blue-100 shadow-sm">
                    <Lock size={26} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-gray-900">Trésorerie d'AxelMarket</h3>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
                      Ce coffre-fort contient le suivi financier de l'application. L'accès est strictement réservé au propriétaire d'AxelMarket et protégé par un mot de passe.
                    </p>
                  </div>
                  
                  <form onSubmit={(e) => { e.preventDefault(); handleUnlockVault(); }} className="space-y-3 max-w-xs mx-auto">
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Mot de passe propriétaire"
                        value={passwordInput}
                        onChange={(e) => {
                          setPasswordInput(e.target.value);
                          setPasswordError('');
                        }}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs text-center font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    
                    {passwordError && (
                      <p className="text-[10px] font-bold text-red-600 animate-shake">{passwordError}</p>
                    )}
                    
                    <button
                      type="submit"
                      className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-blue-100 active:scale-95 cursor-pointer"
                    >
                      Déverrouiller le Coffre-fort
                    </button>
                  </form>
                  
                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-amber-800 text-[10px] font-semibold leading-relaxed max-w-xs mx-auto text-left">
                    🔑 Le mot de passe par défaut est : <span className="font-extrabold underline">axelmarket</span>. Vous pouvez le modifier une fois déverrouillé.
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Balance Display with Lock Button */}
                  <div className="bg-gradient-to-br from-blue-700 to-indigo-950 text-white p-6 rounded-2xl shadow-md border border-blue-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-blue-200">
                        <Wallet size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Solde de la Trésorerie Propriétaire</span>
                      </div>
                      <p className="text-3xl sm:text-4xl font-black font-mono tracking-tight">
                        {treasury.balance.toLocaleString()} <span className="text-sm font-bold text-blue-300">BIF</span>
                      </p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setIsUnlocked(false);
                        setPasswordInput('');
                      }}
                      className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white hover:text-white rounded-xl text-[10px] font-bold transition-all flex items-center gap-1.5 backdrop-blur-sm self-end sm:self-auto cursor-pointer"
                    >
                      <Lock size={12} />
                      Verrouiller le Coffre
                    </button>
                  </div>

                  {/* Deposits & Withdrawals actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Deposit Section */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
                      <h4 className="font-black text-xs text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                        <span className="p-1.5 bg-green-50 text-green-700 rounded-lg">
                          <ArrowDownLeft size={16} />
                        </span>
                        Déposer des fonds (Put Money)
                      </h4>
                      
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Montant du Dépôt (BIF)</label>
                          <input
                            type="number"
                            placeholder="Ex: 500000"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs font-bold"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Description / Motif</label>
                          <input
                            type="text"
                            placeholder="Ex: Dépôt initial, vente hors-ligne"
                            value={depositDesc}
                            onChange={(e) => setDepositDesc(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs"
                          />
                        </div>
                        
                        <button
                          onClick={handleDeposit}
                          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                          Confirmer le Dépôt
                        </button>
                      </div>
                    </div>

                    {/* Withdrawal Section */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
                      <h4 className="font-black text-xs text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                        <span className="p-1.5 bg-red-50 text-red-700 rounded-lg">
                          <ArrowUpRight size={16} />
                        </span>
                        Retirer des fonds (Withdrawal)
                      </h4>
                      
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Montant du Retrait (BIF)</label>
                          <input
                            type="number"
                            placeholder="Ex: 250000"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs font-bold"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Description / Motif</label>
                          <input
                            type="text"
                            placeholder="Ex: Retrait de liquidités, frais techniques"
                            value={withdrawDesc}
                            onChange={(e) => setWithdrawDesc(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs"
                          />
                        </div>
                        
                        <button
                          onClick={handleWithdraw}
                          className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                          Confirmer le Retrait
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Payment Gateways Status Dashboard */}
                  <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="space-y-1">
                        <h4 className="font-black text-xs uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                          <Shield size={16} className="text-blue-500" />
                          Réseaux de Paiement Réel (Burundi)
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          AxelMarket supporte les règlements par mobile money et cartes bancaires.
                        </p>
                      </div>
                      <span className="text-[9px] font-black uppercase bg-blue-950 text-blue-400 border border-blue-800/50 px-2 py-0.5 rounded">
                        Full-Stack Securisé
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Payline Burundi */}
                      <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">Payline Burundi (Agréé BRB)</span>
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                            paymentGatewayStatus?.payline?.configured 
                              ? 'bg-green-950 text-green-400 border border-green-800' 
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {paymentGatewayStatus?.payline?.configured ? 'LIVE' : 'SÉCURISÉ'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300 leading-normal">
                          {paymentGatewayStatus?.payline?.configured 
                            ? `Passerelle principale active. Intègre Lumicash, EcoCash et Airtel Money de façon certifiée. Merchant: ${paymentGatewayStatus.payline.merchantId}.` 
                            : 'Agrégateur légal principal. Permet de collecter Lumicash, EcoCash, Airtel Money en production certifiée par la BRB.'
                          }
                        </p>
                        <div className="pt-1 text-[9px] text-slate-500 font-mono">
                          API: {paymentGatewayStatus?.payline?.endpoint || 'https://api.payline.bi/v1/payments'}
                        </div>
                      </div>

                      {/* Lumicash */}
                      <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-teal-400 tracking-wider">Lumicash Fallback Direct</span>
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                            paymentGatewayStatus?.lumicash?.configured 
                              ? 'bg-green-950 text-green-400 border border-green-800' 
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {paymentGatewayStatus?.lumicash?.configured ? 'LIVE' : 'SÉCURISÉ'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300 leading-normal">
                          {paymentGatewayStatus?.lumicash?.configured 
                            ? `Connecté en secours direct. Merchant ID: ${paymentGatewayStatus.lumicash.merchantId}.` 
                            : 'Sert de secours direct en cas de maintenance de l\'agrégateur principal. Mode simulation active.'
                          }
                        </p>
                        <div className="pt-1 text-[9px] text-slate-500 font-mono">
                          API: {paymentGatewayStatus?.lumicash?.endpoint || 'https://api.lumicash.bi/v1/payment'}
                        </div>
                      </div>

                      {/* Stripe */}
                      <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Stripe (Diaspora)</span>
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                            paymentGatewayStatus?.stripe?.configured 
                              ? 'bg-green-950 text-green-400 border border-green-800' 
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {paymentGatewayStatus?.stripe?.configured ? 'LIVE' : 'SÉCURISÉ'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300 leading-normal">
                          {paymentGatewayStatus?.stripe?.configured 
                            ? 'Intégration Stripe active pour la facturation internationale des cartes Visa/Mastercard.' 
                            : 'Permet aux acheteurs de la diaspora burundaise de régler par carte de crédit internationale. Activez avec STRIPE_SECRET_KEY.'
                          }
                        </p>
                        <div className="pt-1 text-[9px] text-slate-500 font-mono">
                          API: https://api.stripe.com
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-850 text-[10px] text-slate-400 leading-relaxed flex items-center gap-2">
                      <RefreshCw size={14} className="text-blue-500 shrink-0" />
                      <span>
                        <strong>Astuce de production :</strong> Les clés API sont chargées de manière invisible et sécurisée côté serveur (Node.js/Express) pour éviter toute fuite dans le navigateur de l'utilisateur final.
                      </span>
                    </div>
                  </div>

                  {/* Change Master Password Option */}
                  <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 space-y-3">
                    <h4 className="font-extrabold text-xs text-gray-900 flex items-center gap-1.5">
                      <Lock size={14} className="text-gray-500" />
                      Modifier le mot de passe propriétaire du Coffre
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">Mot de passe actuel</label>
                        <input
                          type="password"
                          placeholder="Actuel"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-xs"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">Nouveau mot de passe</label>
                        <input
                          type="password"
                          placeholder="Nouveau"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">Confirmer le nouveau</label>
                        <input
                          type="password"
                          placeholder="Confirmer"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-xs"
                        />
                      </div>
                    </div>

                    {passwordChangeSuccess && (
                      <p className="text-[10px] font-bold text-green-700">{passwordChangeSuccess}</p>
                    )}
                    {passwordChangeError && (
                      <p className="text-[10px] font-bold text-red-600">{passwordChangeError}</p>
                    )}

                    <button
                      onClick={handleChangePassword}
                      className="px-4 py-1.5 bg-gray-800 hover:bg-gray-900 text-white text-[11px] font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Mettre à jour le mot de passe
                    </button>
                  </div>

                  {/* Transactions Ledger */}
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-xs text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <Coins size={14} className="text-blue-700" />
                      Grand Livre des Opérations ({treasury.transactions.length})
                    </h4>
                    
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm divide-y divide-gray-50 max-h-80 overflow-y-auto">
                      {treasury.transactions.map((t) => (
                        <div key={t.id} className="p-4 flex items-center justify-between gap-3 hover:bg-gray-50/40 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className={`p-2 rounded-xl flex-shrink-0 ${
                              t.type === 'deposit' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {t.type === 'deposit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                            </span>
                            <div>
                              <p className="text-xs font-extrabold text-gray-950">{t.description}</p>
                              <p className="text-[10px] text-gray-400">
                                {new Date(t.createdAt).toLocaleString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          
                          <span className={`text-xs font-black font-mono ${
                            t.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {t.type === 'deposit' ? '+' : '-'} {t.amount.toLocaleString()} BIF
                          </span>
                        </div>
                      ))}
                      {treasury.transactions.length === 0 && (
                        <div className="text-center py-8 text-gray-400 text-xs font-medium">
                          Aucune transaction enregistrée dans le grand livre.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // History Subtab
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2">
                    <History size={16} className="text-blue-700" />
                    Historique général d'activité
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Traces d'audit de toutes les opérations importantes effectuées sur l'application.
                  </p>
                </div>

                {/* Filter pills */}
                <div className="flex flex-wrap gap-1.5">
                  {(['all', 'ads', 'users', 'treasury'] as const)
                    .filter((filter) => isOwner || filter !== 'treasury')
                    .map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setSelectedLogFilter(filter)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          selectedLogFilter === filter
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {filter === 'all' && 'Tous'}
                        {filter === 'ads' && 'Annonces'}
                        {filter === 'users' && 'Membres'}
                        {filter === 'treasury' && 'Trésorerie'}
                      </button>
                    ))}
                </div>
              </div>

              {/* Log ledger */}
              <div className="divide-y divide-gray-50 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                {getFilteredLogs().map((log) => {
                  let icon = <History size={16} />;
                  let iconBg = 'bg-gray-50 text-gray-500';
                  
                  if (log.type === 'ad_publish') {
                    icon = <Package size={16} />;
                    iconBg = 'bg-blue-50 text-blue-700';
                  } else if (log.type === 'ad_delete') {
                    icon = <Trash2 size={16} />;
                    iconBg = 'bg-red-50 text-red-600';
                  } else if (log.type === 'user_register') {
                    icon = <UserCheck size={16} />;
                    iconBg = 'bg-green-50 text-green-700';
                  } else if (log.type === 'user_block') {
                    icon = <UserX size={16} />;
                    iconBg = 'bg-red-50 text-red-600';
                  } else if (log.type === 'user_unblock') {
                    icon = <UserCheck size={16} />;
                    iconBg = 'bg-green-50 text-green-600';
                  } else if (log.type === 'treasury_deposit') {
                    icon = <ArrowDownLeft size={16} />;
                    iconBg = 'bg-emerald-50 text-emerald-700';
                  } else if (log.type === 'treasury_withdraw') {
                    icon = <ArrowUpRight size={16} />;
                    iconBg = 'bg-amber-50 text-amber-700';
                  }

                  return (
                    <div key={log.id} className="p-4 flex items-start sm:items-center justify-between gap-4 hover:bg-gray-50/40 transition-colors animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="flex items-start sm:items-center gap-3 min-w-0">
                        <span className={`p-2.5 rounded-xl flex-shrink-0 ${iconBg}`}>
                          {icon}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-gray-950 leading-snug">{log.description}</p>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-gray-400 mt-0.5">
                            <span className="font-bold text-gray-500">{log.userEmailOrPhone}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 font-medium">
                              <Clock size={10} />
                              {new Date(log.timestamp).toLocaleString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {log.amount && (
                        <span className={`text-xs font-black font-mono flex-shrink-0 ${
                          log.type === 'treasury_deposit' || log.type === 'ad_publish'
                            ? 'text-green-600'
                            : 'text-gray-900'
                        }`}>
                          {log.amount.toLocaleString()} BIF
                        </span>
                      )}
                    </div>
                  );
                })}

                {getFilteredLogs().length === 0 && (
                  <div className="text-center py-12 text-gray-400 text-xs font-semibold">
                    Aucune activité enregistrée pour cette catégorie.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
