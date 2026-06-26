import React, { useState } from 'react';
import { User } from '../types';
import { saveUser, setCurrentUser } from '../data';
import { Mail, Phone, Lock, User as UserIcon, MapPin, X, ArrowRight } from 'lucide-react';
import { BURUNDI_CITIES } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  
  // Form fields
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('Bujumbura');
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (isResetting) {
      if (authMethod === 'email' && !email) {
        setError('Veuillez entrer votre adresse email.');
        return;
      }
      if (authMethod === 'phone' && !phone) {
        setError('Veuillez entrer votre numéro de téléphone.');
        return;
      }
      setSuccessMsg('Un lien de réinitialisation a été envoyé !');
      setTimeout(() => {
        setIsResetting(false);
        setSuccessMsg('');
      }, 3000);
      return;
    }

    // Validation
    if (authMethod === 'email' && !email) {
      setError('L\'adresse email est requise.');
      return;
    }
    if (authMethod === 'phone' && !phone) {
      setError('Le numéro de téléphone est requis.');
      return;
    }
    if (!password) {
      setError('Le mot de passe est requis.');
      return;
    }

    if (isSignUp && !fullName) {
      setError('Le nom complet est requis.');
      return;
    }

    const allUsers = localStorage.getItem('axm_users') ? JSON.parse(localStorage.getItem('axm_users')!) : [];

    if (isSignUp) {
      // Check duplicate
      const duplicate = allUsers.find((u: any) => {
        if (authMethod === 'email') return u.email === email;
        return u.phone === phone;
      });

      if (duplicate) {
        setError(authMethod === 'email' ? 'Cet email est déjà utilisé.' : 'Ce numéro de téléphone est déjà utilisé.');
        return;
      }

      // Create user
      const newUser: User = {
        id: `user_${Date.now()}`,
        fullName,
        email: authMethod === 'email' ? email : undefined,
        phone: authMethod === 'phone' ? phone : undefined,
        city,
        avatar: `https://images.unsplash.com/photo-${['1535713875002-d1d0cf377fde', '1494790108377-be9c29b29330', '1570295999919-56ceb5ecca61', '1507003211169-0a1dd7228f2d'][Math.floor(Math.random() * 4)]}?w=150&auto=format&fit=crop&q=80`,
        isAdmin: false,
        isBlocked: false,
        createdAt: new Date().toISOString(),
        walletBalance: 500000
      };

      saveUser(newUser);
      onAuthSuccess(newUser);
      onClose();
    } else {
      // Sign In
      const foundUser = allUsers.find((u: any) => {
        if (authMethod === 'email') return u.email?.toLowerCase() === email.toLowerCase();
        // Remove spaces and country code prefix for flexible matching
        const cleanPhone = (p: string) => p.replace(/[\s+]/g, '');
        return u.phone && cleanPhone(u.phone).includes(cleanPhone(phone));
      });

      if (!foundUser) {
        setError('Compte introuvable. Veuillez vérifier vos identifiants ou vous inscrire.');
        return;
      }

      if (foundUser.isBlocked) {
        setError('Ce compte a été suspendu par l\'administrateur.');
        return;
      }

      setCurrentUser(foundUser);
      onAuthSuccess(foundUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X size={18} />
          </button>
          
          <h2 className="text-2xl font-bold font-sans">
            {isResetting 
              ? 'Mot de passe oublié' 
              : isSignUp 
                ? 'Créer un compte' 
                : 'Connexion'}
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            {isResetting 
              ? 'Récupérez l\'accès à votre compte AxelMarket' 
              : isSignUp 
                ? 'Rejoignez la plus grande communauté de vente au Burundi' 
                : 'Faites de bonnes affaires en un clic'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded text-green-700 text-sm font-medium">
              {successMsg}
            </div>
          )}

          {!isResetting && (
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                type="button"
                onClick={() => setAuthMethod('phone')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
                  authMethod === 'phone' 
                    ? 'bg-white text-blue-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Phone size={16} />
                Téléphone
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('email')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
                  authMethod === 'email' 
                    ? 'bg-white text-blue-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Mail size={16} />
                Email
              </button>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && !isResetting && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 uppercase">Nom Complet</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <UserIcon size={18} />
                  </span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Patient Ndayishimiye"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>
              </div>
            )}

            {authMethod === 'phone' ? (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 uppercase">Numéro de téléphone</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-medium text-sm border-r border-gray-200 pr-2">
                    +257
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="79 123 456"
                    className="w-full pl-16 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-mono"
                  />
                </div>
                <p className="text-[10px] text-gray-400">Entrez les 8 chiffres de votre numéro de téléphone au Burundi.</p>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 uppercase">Adresse Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>
              </div>
            )}

            {!isResetting && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-700 uppercase">Mot de passe</label>
                  <button
                    type="button"
                    onClick={() => setIsResetting(true)}
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    Oublié ?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>
              </div>
            )}

            {isSignUp && !isResetting && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 uppercase">Ville principale</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <MapPin size={18} />
                  </span>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm appearance-none cursor-pointer"
                  >
                    {BURUNDI_CITIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.province})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all flex items-center justify-center gap-2 mt-6 active:scale-95"
            >
              {isResetting 
                ? 'Réinitialiser le mot de passe' 
                : isSignUp 
                  ? 'S\'inscrire' 
                  : 'Se Connecter'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Footer toggle */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-sm text-gray-500">
            {isResetting ? (
              <button
                type="button"
                onClick={() => setIsResetting(false)}
                className="font-semibold text-blue-700 hover:underline"
              >
                Retourner à la connexion
              </button>
            ) : isSignUp ? (
              <p>
                Déjà membre ?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="font-semibold text-blue-700 hover:underline"
                >
                  Connectez-vous
                </button>
              </p>
            ) : (
              <p>
                Pas encore de compte ?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="font-semibold text-blue-700 hover:underline"
                >
                  Inscrivez-vous gratuitement
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
