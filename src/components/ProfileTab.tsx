import React, { useState, useRef } from 'react';
import { User, Ad, BURUNDI_CITIES } from '../types';
import { getAds, saveUser, deleteAd, depositToUserWallet, withdrawFromUserWallet, getWalletTransactions } from '../data';
import { 
  MapPin, Phone, Mail, Calendar, Edit2, Check, LogOut, Package, 
  UserX, UserCheck, Wallet, ArrowUpRight, ArrowDownLeft, Coins, 
  CreditCard, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck, HelpCircle,
  Tag, ShoppingBag, Landmark, Clock, CheckCircle, XCircle
} from 'lucide-react';

interface ProfileTabProps {
  user: User;
  onLogout: () => void;
  onAdSelected: (ad: Ad) => void;
  onWalletUpdate?: () => void;
}

export default function ProfileTab({ user, onLogout, onAdSelected, onWalletUpdate }: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);
  const [city, setCity] = useState(user.city);
  const [phone, setPhone] = useState(user.phone || '');
  const [email, setEmail] = useState(user.email || '');
  const [avatar, setAvatar] = useState(user.avatar);

  // Wallet states
  const [showWalletAction, setShowWalletAction] = useState<'none' | 'deposit' | 'withdraw'>('none');
  const [paymentNetwork, setPaymentNetwork] = useState<'lumicash' | 'ecocash' | 'airtel_money' | 'visa' | 'mastercard'>('lumicash');
  const [amount, setAmount] = useState('');
  const [phoneNum, setPhoneNum] = useState(user.phone?.replace(/[\s+]/g, '').slice(-8) || '');
  const [cardNum, setCardNum] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [bankName, setBankName] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [verificationStep, setVerificationStep] = useState(0); // 0: input, 1-4: simulation loader, 5: success
  const [verificationMessage, setVerificationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Transactions ledger state
  const [transactions, setTransactions] = useState(() => getWalletTransactions(user.id));

  React.useEffect(() => {
    setTransactions(getWalletTransactions(user.id));
  }, [user.id, user.walletBalance]);
  
  // Get ads uploaded by this user
  const allAds = getAds();
  const myAds = allAds.filter(ad => ad.sellerId === user.id);

  const resetWalletStates = () => {
    setShowWalletAction('none');
    setAmount('');
    setCardNum('');
    setCardExpiry('');
    setCardCvv('');
    setBankName('');
    setPinCode('');
    setVerificationStep(0);
    setVerificationMessage('');
    setErrorMessage('');
  };

  const handleWalletActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMessage('Veuillez entrer un montant valide supérieur à 0 FBU.');
      return;
    }
    
    if (showWalletAction === 'withdraw' && (user.walletBalance || 0) < amt) {
      setErrorMessage('Solde insuffisant pour effectuer ce retrait.');
      return;
    }

    const isMobileMoney = paymentNetwork === 'lumicash' || paymentNetwork === 'ecocash' || paymentNetwork === 'airtel_money';

    if (isMobileMoney) {
      if (!phoneNum || phoneNum.length < 8) {
        setErrorMessage('Veuillez entrer un numéro de téléphone mobile money burundais valide (8 chiffres).');
        return;
      }
      if (!pinCode || pinCode.length < 4) {
        setErrorMessage('Veuillez entrer votre code PIN de sécurité (4 chiffres minimum).');
        return;
      }
    } else {
      if (!cardNum || cardNum.replace(/\s/g, '').length < 16) {
        setErrorMessage('Veuillez entrer un numéro de carte à 16 chiffres valide.');
        return;
      }
      if (!cardExpiry || !cardExpiry.includes('/')) {
        setErrorMessage('Veuillez entrer une date d\'expiration valide (MM/AA).');
        return;
      }
      if (!cardCvv || cardCvv.length < 3) {
        setErrorMessage('Veuillez entrer le CVV à 3 chiffres.');
        return;
      }
      if (!bankName) {
        setErrorMessage('Veuillez sélectionner votre banque au Burundi.');
        return;
      }
    }

    // Begin secure verification sequence
    setVerificationStep(1);
    setVerificationMessage('Initialisation de la passerelle de transaction Payline Burundi...');

    setTimeout(() => {
      setVerificationStep(2);
      let networkStatusMessage = 'Liaison sécurisée avec le réseau national 3D-Secure...';
      if (paymentNetwork === 'lumicash') networkStatusMessage = 'Connexion sécurisée aux serveurs Lumitel Burundi (Lumicash)...';
      if (paymentNetwork === 'ecocash') networkStatusMessage = 'Connexion sécurisée aux serveurs Econet Leo Burundi (EcoCash)...';
      if (paymentNetwork === 'airtel_money') networkStatusMessage = 'Connexion sécurisée aux serveurs Airtel Burundi (Airtel Money)...';
      
      setVerificationMessage(networkStatusMessage);
    }, 1200);

    setTimeout(async () => {
      setVerificationStep(3);
      setVerificationMessage(
        isMobileMoney
          ? 'Validation du code PIN et contrôle d\'autorisation USSD/REST...'
          : 'Validation des provisions bancaires et contrôle d\'autorisation cryptographique...'
      );

      // Assemble payload
      let networkLabel = 'Lumicash';
      if (paymentNetwork === 'ecocash') networkLabel = 'EcoCash';
      if (paymentNetwork === 'airtel_money') networkLabel = 'Airtel Money';
      if (paymentNetwork === 'visa') networkLabel = `Visa (${bankName})`;
      if (paymentNetwork === 'mastercard') networkLabel = `Mastercard (${bankName})`;

      const accountDetails = isMobileMoney
        ? `+257 ${phoneNum}`
        : `Carte **** **** **** ${cardNum.replace(/\s/g, '').slice(-4)}`;

      const apiEndpoint = showWalletAction === 'deposit' ? '/api/payment/deposit' : '/api/payment/withdraw';
      
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: user.id,
            amount: amt,
            network: networkLabel,
            accountDetails: accountDetails,
            phoneNum: phoneNum,
            pinCode: pinCode,
            cardDetails: {
              number: cardNum,
              cvv: cardCvv,
              expiry: cardExpiry,
              bankName: bankName
            }
          })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          setVerificationStep(0);
          setErrorMessage(result.error || 'La transaction a été rejetée par Payline Burundi.');
          return;
        }

        // Apply local changes upon backend approval
        setVerificationStep(4);
        setVerificationMessage(
          result.isReal
            ? `[RÉSEAU LIVE] Transaction approuvée par le réseau Payline réel de ${paymentNetwork.toUpperCase()} Burundi !`
            : `[PASSAGE SÉCURISÉ] Validation approuvée par la passerelle Payline de test d'AxelMarket...`
        );

        setTimeout(() => {
          if (showWalletAction === 'deposit') {
            depositToUserWallet(user.id, amt, networkLabel, accountDetails);
          } else {
            withdrawFromUserWallet(user.id, amt, networkLabel, accountDetails);
          }

          setVerificationStep(5);
          setVerificationMessage(result.message);

          if (onWalletUpdate) {
            onWalletUpdate();
          }
        }, 1500);

      } catch (err: any) {
        setVerificationStep(0);
        setErrorMessage(`Erreur de connexion avec le réseau de paiement Payline Burundi : ${err.message || err}`);
      }
    }, 2400);
  };

  const handleSave = () => {
    const updatedUser: User = {
      ...user,
      fullName,
      city,
      phone: phone || undefined,
      email: email || undefined,
      avatar
    };
    saveUser(updatedUser);
    setIsEditing(false);
  };

  const handleAvatarChange = () => {
    // Pick a random unsplash face to simulate upload
    const avatars = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
    ];
    const nextIdx = (avatars.indexOf(avatar) + 1) % avatars.length;
    setAvatar(avatars[nextIdx]);
  };

  const handleDelete = (e: React.MouseEvent, adId: string) => {
    e.stopPropagation();
    if (confirm('Voulez-vous vraiment supprimer cette annonce ?')) {
      deleteAd(adId);
      // Force re-render would be handled by parent state
      window.location.reload(); // Quick way to sync for localStorage in this SPA setup
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-blue-600 to-blue-800" />
        
        <div className="relative pt-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="relative group">
              <img
                src={avatar}
                alt={user.fullName}
                className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md bg-gray-100"
              />
              {isEditing && (
                <button
                  type="button"
                  onClick={handleAvatarChange}
                  className="absolute inset-0 bg-black/50 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer font-medium"
                >
                  Changer
                </button>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
                {user.isAdmin && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                    Admin
                  </span>
                )}
                {user.isBlocked && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                    Bloqué
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {city}, Burundi
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  Membre depuis {new Date(user.createdAt).toLocaleDateString('fr-FR', {month: 'long', year: 'numeric'})}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl flex items-center gap-1.5 transition-all shadow-sm shadow-green-100 active:scale-95"
              >
                <Check size={16} />
                Enregistrer
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Edit2 size={16} />
                Modifier
              </button>
            )}

            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-xl flex items-center gap-1.5 transition-all active:scale-95"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase">Nom Complet</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase">Ville</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-sm"
              >
                {BURUNDI_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase">Numéro de Téléphone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+257 ...."
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-sm font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase">Adresse Email (Optionnel)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* WALLET SECTION */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Abstract background decorative blobs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-8 -mt-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl -ml-6 -mb-6" />

        <div className="relative flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Wallet size={16} />
              </div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Portefeuille AxelMarket</span>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-400">Solde disponible immédiatement</p>
              <h3 className="text-3xl font-black font-mono tracking-tight text-white flex items-baseline gap-1.5">
                {(user.walletBalance || 0).toLocaleString()}
                <span className="text-sm font-black text-blue-400 uppercase">BIF</span>
              </h3>
            </div>

            {/* Connected networks badge indicators */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Réseaux Partenaires :</span>
              <span className="text-[8px] font-black uppercase bg-teal-950/50 text-teal-400 border border-teal-800/50 px-2 py-0.5 rounded-md">Lumicash (Lumitel)</span>
              <span className="text-[8px] font-black uppercase bg-blue-950/50 text-blue-400 border border-blue-800/50 px-2 py-0.5 rounded-md">Visa Card</span>
              <span className="text-[8px] font-black uppercase bg-amber-950/50 text-amber-500 border border-amber-800/50 px-2 py-0.5 rounded-md">Mastercard</span>
            </div>
          </div>

          <div className="flex flex-row md:flex-col lg:flex-row items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                resetWalletStates();
                setShowWalletAction('deposit');
              }}
              className="flex-1 md:w-full lg:flex-1 py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-lg shadow-blue-900/30"
            >
              <ArrowUpRight size={14} className="stroke-[3]" />
              Déposer
            </button>
            <button
              onClick={() => {
                resetWalletStates();
                setShowWalletAction('withdraw');
              }}
              className="flex-1 md:w-full lg:flex-1 py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <ArrowDownLeft size={14} className="stroke-[3]" />
              Retirer
            </button>
          </div>
        </div>

        {/* INTERACTIVE ACTIONS FORMS (COLLAPSIBLE PANEL) */}
        {showWalletAction !== 'none' && (
          <div className="mt-6 pt-6 border-t border-slate-800 animate-in fade-in slide-in-from-top-4 duration-300">
            {verificationStep === 0 ? (
              <form onSubmit={handleWalletActionSubmit} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">
                    {showWalletAction === 'deposit' ? '🪙 Alimenter votre Wallet' : '💸 Retirer des fonds'}
                  </h4>
                  <button
                    type="button"
                    onClick={resetWalletStates}
                    className="text-xs font-black text-slate-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Annuler
                  </button>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-950/50 border border-red-900 rounded-xl text-red-400 text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Amount field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant en Franc Burundais (BIF)</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="500"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Ex: 50000"
                      className="w-full px-5 py-3 bg-slate-850 border border-slate-850 rounded-2xl focus:bg-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm font-black tracking-tight text-white font-mono placeholder-slate-500"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-500 font-mono">BIF</span>
                  </div>
                </div>

                {/* Network Choice */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sélectionner le réseau de paiement</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentNetwork('lumicash')}
                      className={`py-2.5 px-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider text-center flex flex-col items-center justify-center gap-1 transition-all ${
                        paymentNetwork === 'lumicash'
                          ? 'bg-teal-950/80 border-teal-500 text-teal-400 shadow-sm'
                          : 'bg-slate-850 border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Coins size={14} />
                      <span>Lumicash</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentNetwork('ecocash')}
                      className={`py-2.5 px-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider text-center flex flex-col items-center justify-center gap-1 transition-all ${
                        paymentNetwork === 'ecocash'
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-sm'
                          : 'bg-slate-850 border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Coins size={14} />
                      <span>EcoCash</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentNetwork('airtel_money')}
                      className={`py-2.5 px-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider text-center flex flex-col items-center justify-center gap-1 transition-all ${
                        paymentNetwork === 'airtel_money'
                          ? 'bg-red-950/80 border-red-500 text-red-500 shadow-sm'
                          : 'bg-slate-850 border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Coins size={14} />
                      <span>Airtel Money</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setPaymentNetwork('visa')}
                      className={`py-2.5 px-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider text-center flex flex-col items-center justify-center gap-1 transition-all ${
                        paymentNetwork === 'visa'
                          ? 'bg-blue-950/80 border-blue-500 text-blue-400 shadow-sm'
                          : 'bg-slate-850 border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <CreditCard size={14} />
                      <span>Visa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentNetwork('mastercard')}
                      className={`py-2.5 px-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider text-center flex flex-col items-center justify-center gap-1 transition-all ${
                        paymentNetwork === 'mastercard'
                          ? 'bg-amber-950/80 border-amber-500 text-amber-500 shadow-sm'
                          : 'bg-slate-850 border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <CreditCard size={14} />
                      <span>Mastercard</span>
                    </button>
                  </div>
                </div>

                {/* Network fields (Conditional) */}
                {(paymentNetwork === 'lumicash' || paymentNetwork === 'ecocash' || paymentNetwork === 'airtel_money') ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Numéro {paymentNetwork === 'lumicash' ? 'Lumitel' : paymentNetwork === 'ecocash' ? 'Econet' : 'Airtel'} (Burundi)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">+257</span>
                        <input
                          type="tel"
                          required
                          maxLength={8}
                          value={phoneNum}
                          onChange={(e) => setPhoneNum(e.target.value.replace(/\D/g, ''))}
                          placeholder="79123456"
                          className="w-full pl-14 pr-4 py-3 bg-slate-850 border border-slate-850 rounded-2xl focus:bg-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm font-mono tracking-wide text-white placeholder-slate-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Code PIN de sécurité
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={6}
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="w-full px-4 py-3 bg-slate-850 border border-slate-850 rounded-2xl focus:bg-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm font-mono text-white tracking-widest placeholder-slate-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Banque Émettrice (Burundi)</label>
                        <select
                          required
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-850 border border-slate-850 rounded-2xl focus:bg-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm font-bold text-white cursor-pointer"
                        >
                          <option value="">-- Choisir la banque --</option>
                          <option value="BANCOBU">BANCOBU (Banque Commerciale du Burundi)</option>
                          <option value="BCB">BCB (Banque de Crédit de Bujumbura)</option>
                          <option value="IBB">Interbank Burundi (IBB)</option>
                          <option value="KCB">KCB Bank Burundi</option>
                          <option value="CRDB">CRDB Bank Burundi</option>
                          <option value="BBCI">BBCI Bank</option>
                          <option value="ECOBANK">Ecobank Burundi</option>
                          <option value="BRB">BRB (Banque de la République du Burundi)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Numéro de carte</label>
                        <input
                          type="text"
                          required
                          maxLength={19}
                          value={cardNum}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                            setCardNum(v);
                          }}
                          placeholder="4000 1234 5678 9010"
                          className="w-full px-4 py-3 bg-slate-850 border border-slate-850 rounded-2xl focus:bg-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm font-mono text-white tracking-widest placeholder-slate-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date d'expiration</label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, '');
                            if (v.length > 2) {
                              v = `${v.slice(0, 2)}/${v.slice(2, 4)}`;
                            }
                            setCardExpiry(v);
                          }}
                          placeholder="MM/AA"
                          className="w-full px-4 py-3 bg-slate-850 border border-slate-850 rounded-2xl focus:bg-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm font-mono text-white tracking-wider text-center placeholder-slate-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Code de sécurité CVV</label>
                        <input
                          type="password"
                          required
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          placeholder="123"
                          className="w-full px-4 py-3 bg-slate-850 border border-slate-850 rounded-2xl focus:bg-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm font-mono text-white tracking-widest text-center placeholder-slate-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-blue-900/40"
                >
                  <ShieldCheck size={16} />
                  {showWalletAction === 'deposit' 
                    ? `Autoriser le dépôt de ${amount ? parseFloat(amount).toLocaleString() : '0'} BIF` 
                    : `Demander le retrait de ${amount ? parseFloat(amount).toLocaleString() : '0'} BIF`}
                </button>
              </form>
            ) : (
              /* SECURE STEPPER ANIMATION STAGE */
              <div className="py-6 flex flex-col items-center text-center space-y-4">
                {verificationStep < 5 ? (
                  <>
                    <RefreshCw size={36} className="text-blue-500 animate-spin stroke-[2.5]" />
                    <div className="space-y-2 max-w-sm">
                      <div className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                        Réseau de paiement sécurisé {paymentNetwork.toUpperCase()}
                      </div>
                      <h4 className="text-sm font-black text-white">{verificationMessage}</h4>
                      
                      {/* Stepper progress dots */}
                      <div className="flex items-center justify-center gap-2 pt-2">
                        {[1, 2, 3, 4].map((stepNum) => (
                          <div
                            key={stepNum}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                              verificationStep >= stepNum ? 'bg-blue-500 scale-110 shadow' : 'bg-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  /* SUCCESS STAGE */
                  <div className="space-y-4 max-w-md animate-in zoom-in-95 duration-300">
                    <div className="w-14 h-14 bg-green-950/80 border border-green-500/30 rounded-full flex items-center justify-center text-green-400 mx-auto">
                      <CheckCircle2 size={28} className="stroke-[2.5]" />
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-white">Transaction Confirmée</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{verificationMessage}</p>
                    </div>

                    <button
                      type="button"
                      onClick={resetWalletStates}
                      className="px-6 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
                    >
                      Fermer le guichet
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* TRANSACTION LEDGER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock size={18} className="text-blue-700" />
              Historique des Transactions
            </h3>
            <p className="text-xs text-gray-500">Registre en temps réel certifié par Payline Burundi (BRB)</p>
          </div>
          <span className="bg-blue-50 text-blue-700 font-extrabold text-xs px-2.5 py-1 rounded-full border border-blue-100 uppercase tracking-wider self-start sm:self-center">
            {transactions.length} Opérations
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="py-12 text-center text-gray-400 border border-dashed border-gray-100 rounded-xl space-y-2">
            <HelpCircle size={32} className="mx-auto text-gray-300" />
            <div className="text-sm font-medium">Aucun mouvement de fonds</div>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">Toutes vos opérations de dépôt, retrait et achats d'articles s'afficheront ici de façon sécurisée.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="py-3 px-4">Date & Réf</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Canal / Compte</th>
                  <th className="py-3 px-4 text-right">Montant (FBU)</th>
                  <th className="py-3 px-4 text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {transactions.map((tx) => {
                  let typeLabel = 'Dépôt';
                  let typeColor = 'text-green-600 bg-green-50 border-green-100';
                  let typeIcon = <ArrowUpRight size={12} className="text-green-600 stroke-[2.5]" />;
                  
                  if (tx.type === 'retrait') {
                    typeLabel = 'Retrait';
                    typeColor = 'text-orange-600 bg-orange-50 border-orange-100';
                    typeIcon = <ArrowDownLeft size={12} className="text-orange-600 stroke-[2.5]" />;
                  } else if (tx.type === 'achat') {
                    typeLabel = 'Achat';
                    typeColor = 'text-purple-600 bg-purple-50 border-purple-100';
                    typeIcon = <ShoppingBag size={12} className="text-purple-600 stroke-[2.5]" />;
                  } else if (tx.type === 'vente') {
                    typeLabel = 'Vente';
                    typeColor = 'text-blue-600 bg-blue-50 border-blue-100';
                    typeIcon = <Tag size={12} className="text-blue-600 stroke-[2.5]" />;
                  } else if (tx.type === 'commission') {
                    typeLabel = 'Frais';
                    typeColor = 'text-gray-600 bg-gray-50 border-gray-100';
                    typeIcon = <Coins size={12} className="text-gray-600 stroke-[2.5]" />;
                  }

                  let netLabel = 'Lumicash';
                  let netBadge = 'bg-teal-50 text-teal-700 border-teal-100';
                  if (tx.paymentNetwork === 'ecocash') {
                    netLabel = 'EcoCash';
                    netBadge = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                  } else if (tx.paymentNetwork === 'airtel_money') {
                    netLabel = 'Airtel Money';
                    netBadge = 'bg-red-50 text-red-600 border-red-100';
                  } else if (tx.paymentNetwork === 'card') {
                    netLabel = 'Carte Bancaire';
                    netBadge = 'bg-indigo-50 text-indigo-700 border-indigo-100';
                  }

                  return (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="font-semibold text-gray-900">{new Date(tx.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="font-mono text-[9px] text-gray-400 font-bold tracking-tight">{tx.refPayline}</div>
                      </td>
                      
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${typeColor}`}>
                          {typeIcon}
                          {typeLabel}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 space-y-0.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-widest ${netBadge}`}>
                          {netLabel}
                        </span>
                        <div className="text-[10px] font-mono text-gray-500 font-medium">{tx.accountDetails}</div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-bold font-mono text-gray-900">
                        {tx.type === 'retrait' || tx.type === 'achat' ? '-' : '+'}
                        {tx.amount.toLocaleString()} BIF
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center">
                          {tx.status === 'success' ? (
                            <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                              <CheckCircle size={12} className="stroke-[2.5]" />
                              SUCCÈS
                            </span>
                          ) : tx.status === 'pending' ? (
                            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm animate-pulse">
                              <Clock size={12} className="stroke-[2.5]" />
                              EN COURS
                            </span>
                          ) : (
                            <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                              <XCircle size={12} className="stroke-[2.5]" />
                              ÉCHEC
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ads Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Package size={18} className="text-blue-700" />
            Mes Annonces Publiées ({myAds.length})
          </h3>
        </div>

        {myAds.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-200 text-gray-500">
            <Package size={36} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-medium">Vous n'avez pas encore publié d'annonces.</p>
            <p className="text-xs text-gray-400 mt-1">Publiez votre premier article pour commencer à vendre au Burundi !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myAds.map((ad) => (
              <div
                key={ad.id}
                onClick={() => onAdSelected(ad)}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col group"
              >
                <div className="h-40 bg-gray-100 relative overflow-hidden">
                  <img
                    src={ad.imageUrls[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=300'}
                    alt={ad.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 bg-blue-700 text-white text-xs font-semibold px-2 py-1 rounded">
                    {ad.category}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h4 className="font-bold text-gray-900 line-clamp-1">{ad.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{ad.description}</p>
                  </div>

                  <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-blue-700 font-extrabold text-sm">
                      {ad.price.toLocaleString()} BIF
                    </span>
                    <button
                      onClick={(e) => handleDelete(e, ad.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs font-semibold"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
