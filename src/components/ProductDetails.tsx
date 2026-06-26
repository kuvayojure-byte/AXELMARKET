import { useState } from 'react';
import { Ad, User } from '../types';
import { 
  MapPin, Phone, MessageSquare, ShieldCheck, ChevronLeft, ChevronRight, 
  CreditCard, Wallet, HelpCircle, ArrowLeft, CheckCircle2, RefreshCw, Sparkles
} from 'lucide-react';
import { purchaseProductWithWallet } from '../data';

interface ProductDetailsProps {
  ad: Ad;
  currentUser: User | null;
  onBack: () => void;
  onContactSeller: (ad: Ad) => void;
  onPurchaseSuccess?: () => void;
}

export default function ProductDetails({ ad, currentUser, onBack, onContactSeller, onPurchaseSuccess }: ProductDetailsProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  // Purchase states
  const [showConfirmPurchase, setShowConfirmPurchase] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState(0); // 0: summary, 1-4: simulation, 5: success
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const [purchaseError, setPurchaseError] = useState('');

  const handlePurchaseSubmit = () => {
    if (!currentUser) return;
    setPurchaseError('');

    const userBalance = currentUser.walletBalance || 0;
    if (userBalance < ad.price) {
      setPurchaseError(`Solde insuffisant dans votre portefeuille. Solde actuel : ${userBalance.toLocaleString()} BIF. Prix de l'article : ${ad.price.toLocaleString()} BIF. Veuillez recharger votre portefeuille dans l'onglet Profil.`);
      return;
    }

    // Begin animated checkout sequence
    setPurchaseStep(1);
    setPurchaseMessage("Réservation sécurisée de l'article...");

    setTimeout(() => {
      setPurchaseStep(2);
      setPurchaseMessage("Prélèvement de la commission d'AxelMarket (4%)...");
    }, 1200);

    setTimeout(() => {
      setPurchaseStep(3);
      setPurchaseMessage("Crédit sécurisé du portefeuille électronique du vendeur...");
    }, 2400);

    setTimeout(() => {
      setPurchaseStep(4);
      setPurchaseMessage("Enregistrement de la transaction cryptographique dans le Coffre AxelMarket...");
    }, 3600);

    setTimeout(() => {
      try {
        const res = purchaseProductWithWallet(ad.id, currentUser.id, 4);
        if (res.success) {
          setPurchaseStep(5);
          setPurchaseMessage(`Félicitations ! Votre achat pour '${ad.title}' a été vérifié et approuvé avec succès.`);
          if (onPurchaseSuccess) {
            onPurchaseSuccess();
          }
        } else {
          setPurchaseStep(0);
          setPurchaseError(res.error || "Une erreur s'est produite durant l'achat.");
        }
      } catch (err: any) {
        setPurchaseStep(0);
        setPurchaseError(err.message || "Erreur critique de communication.");
      }
    }, 4800);
  };

  const images = ad.imageUrls.length > 0 ? ad.imageUrls : ['https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600'];

  const nextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-sm active:scale-95"
      >
        <ArrowLeft size={16} className="stroke-[2.5]" />
        Retour aux annonces
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image Slider */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm relative aspect-[4/3] group">
            <img
              src={images[activeImageIdx]}
              alt={ad.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Slider Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Counter Badge */}
            <div className="absolute bottom-4 right-4 px-2.5 py-1 bg-black/60 text-white text-[10px] font-black uppercase tracking-wider rounded-full">
              {activeImageIdx + 1} / {images.length}
            </div>

            {/* Category tag */}
            <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur text-slate-900 text-[10px] font-black rounded-full uppercase tracking-wider border border-slate-100 shadow-md">
              {ad.category.toUpperCase()}
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImageIdx === idx ? 'border-blue-600 scale-95 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product and Seller info */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Info Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                <MapPin size={14} className="text-blue-600 stroke-[2.5]" />
                <span>{ad.city}, Burundi</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 leading-none tracking-tighter">{ad.title}</h1>
            </div>

            <div className="text-3xl font-black text-blue-600 font-sans tracking-tighter">
              {ad.price.toLocaleString()} BIF
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Description</h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">{ad.description}</p>
            </div>
          </div>

          {/* Contact Seller Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Vendeur</h3>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-black text-blue-800 text-lg border border-blue-50">
                {ad.sellerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm">{ad.sellerName}</h4>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Particulier sur AxelMarket</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {currentUser?.id === ad.sellerId ? (
                <div className="text-xs bg-slate-50 border border-slate-200 text-slate-500 rounded-2xl p-4 font-black uppercase tracking-wide text-center">
                  C'est votre propre annonce !
                </div>
              ) : (
                <>
                  <button
                    onClick={() => onContactSeller(ad)}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <MessageSquare size={18} className="stroke-[2.5]" />
                    Contacter par Message
                  </button>

                  <a
                    href={`tel:${ad.sellerPhone}`}
                    className="w-full py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <Phone size={16} className="stroke-[2.5]" />
                    Appeler ({ad.sellerPhone})
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Payment Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <CreditCard size={16} className="text-blue-600" />
                Options de Règlement
              </h3>
              <button
                onClick={() => setShowPaymentInfo(!showPaymentInfo)}
                className="text-slate-400 hover:text-blue-600 transition-colors"
                title="À propos du système de paiement"
              >
                <HelpCircle size={16} />
              </button>
            </div>

            {showPaymentInfo && (
              <p className="text-xs text-slate-500 leading-relaxed bg-blue-50/50 p-3 rounded-2xl border border-blue-50">
                AxelMarket protège vos échanges. Vous pouvez régler immédiatement en utilisant votre portefeuille interne AxelMarket, ou choisir une remise en main propre (gré à gré).
              </p>
            )}

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Sécurité d'échange</span>
                <span className="text-[9px] bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck size={11} className="stroke-[2.5]" />
                  Sécurisé
                </span>
              </div>

              {currentUser ? (
                currentUser.id === ad.sellerId ? (
                  <div className="text-xs bg-slate-50 text-slate-400 p-3 rounded-xl text-center font-bold">
                    Vous êtes le vendeur de cet article.
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setShowConfirmPurchase(!showConfirmPurchase);
                        setPurchaseStep(0);
                        setPurchaseError('');
                      }}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-blue-200 cursor-pointer"
                    >
                      <Wallet size={16} />
                      Acheter avec mon Wallet
                    </button>

                    {/* Collapsible Purchase summary and checkout animations */}
                    {showConfirmPurchase && (
                      <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        {purchaseStep === 0 ? (
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reçu Provisoire d'Achat</h4>
                            
                            {purchaseError && (
                              <div className="p-2 bg-red-950 border border-red-900 rounded-xl text-red-400 text-xs font-bold leading-normal">
                                {purchaseError}
                              </div>
                            )}

                            <div className="space-y-1.5 text-xs font-medium text-slate-300">
                              <div className="flex justify-between">
                                <span>Prix de l'article :</span>
                                <span className="font-black text-white">{ad.price.toLocaleString()} BIF</span>
                              </div>
                              <div className="flex justify-between text-[10px] text-slate-400">
                                <span>Commission (4% déduite du vendeur) :</span>
                                <span className="font-mono">{(ad.price * 0.04).toLocaleString()} BIF</span>
                              </div>
                              <div className="flex justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1.5">
                                <span>Payout Vendeur net :</span>
                                <span className="font-mono">{(ad.price * 0.96).toLocaleString()} BIF</span>
                              </div>
                              <div className="flex justify-between pt-1 font-bold text-white">
                                <span>Total débité de votre Wallet :</span>
                                <span className="text-blue-400">{ad.price.toLocaleString()} BIF</span>
                              </div>
                              <div className="flex justify-between text-[10px] text-slate-400">
                                <span>Votre solde actuel :</span>
                                <span className="font-mono">{(currentUser.walletBalance || 0).toLocaleString()} BIF</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={handlePurchaseSubmit}
                              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                            >
                              <ShieldCheck size={14} />
                              Valider l'achat sécurisé
                            </button>
                          </div>
                        ) : purchaseStep < 5 ? (
                          <div className="py-4 flex flex-col items-center text-center space-y-3">
                            <RefreshCw size={28} className="text-blue-400 animate-spin stroke-[2.5]" />
                            <div className="space-y-1">
                              <span className="text-[8px] font-black uppercase text-blue-400 tracking-widest">Réseau AxelMarket Burundi</span>
                              <p className="text-xs font-black text-white leading-tight">{purchaseMessage}</p>
                            </div>
                            
                            {/* Dots bar */}
                            <div className="flex justify-center gap-1 pt-1">
                              {[1, 2, 3, 4].map((dot) => (
                                <div
                                  key={dot}
                                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    purchaseStep >= dot ? 'bg-blue-500 scale-110' : 'bg-slate-850'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="py-4 text-center space-y-3 animate-in zoom-in-95 duration-200">
                            <div className="w-10 h-10 bg-green-950/80 border border-green-500/30 rounded-full flex items-center justify-center text-green-400 mx-auto">
                              <CheckCircle2 size={20} className="stroke-[2.5]" />
                            </div>
                            <div className="space-y-1">
                              <h5 className="text-sm font-black text-white">Achat validé !</h5>
                              <p className="text-[11px] text-slate-300 leading-normal px-2">{purchaseMessage}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setShowConfirmPurchase(false);
                                onBack();
                              }}
                              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-black uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
                            >
                              Fermer
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )
              ) : (
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-50 text-center text-xs font-medium text-slate-500">
                  Veuillez vous connecter pour acheter avec votre Wallet AxelMarket.
                </div>
              )}

              <button
                type="button"
                className="w-full py-4 border border-slate-200 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all cursor-default"
              >
                <Sparkles size={14} className="text-amber-500 stroke-[2.5]" />
                Remise en main propre (gré à gré)
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
