import React, { useState, useRef } from 'react';
import { Category, Ad, User, CATEGORIES, BURUNDI_CITIES } from '../types';
import { saveAd } from '../data';
import { X, Upload, Trash2, Camera, Plus, Check } from 'lucide-react';

interface PublishAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onPublishSuccess: () => void;
}

export default function PublishAdModal({ isOpen, onClose, currentUser, onPublishSuccess }: PublishAdModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category>('Téléphones');
  const [city, setCity] = useState(currentUser.city);
  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Read file as Base64 helper
  const processFiles = (files: FileList) => {
    setError('');
    const remainingSlots = 5 - images.length;
    if (remainingSlots <= 0) {
      setError('Vous pouvez ajouter au maximum 5 photos.');
      return;
    }

    const filesToLoad = Array.from(files).slice(0, remainingSlots);

    filesToLoad.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner uniquement des images.');
        return;
      }
      
      // Limit file size (approx 1.5MB for localStorage friendliness)
      if (file.size > 1.5 * 1024 * 1024) {
        setError("L'image est trop lourde (Max 1.5 Mo). Elle a été compressée ou rejetée.");
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (idxToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Veuillez saisir un titre.');
      return;
    }
    if (!description.trim()) {
      setError('Veuillez ajouter une description.');
      return;
    }
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setError('Veuillez entrer un prix valide supérieur à 0 BIF.');
      return;
    }
    if (images.length === 0) {
      setError('Veuillez ajouter au moins 1 photo de votre produit.');
      return;
    }

    // Create the Ad object
    const newAd: Ad = {
      id: `ad_${Date.now()}`,
      title,
      description,
      price: numericPrice,
      category,
      imageUrls: images,
      sellerId: currentUser.id,
      sellerName: currentUser.fullName,
      sellerPhone: currentUser.phone || '+257 79 123 456',
      city,
      createdAt: new Date().toISOString()
    };

    saveAd(newAd);
    onPublishSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold font-sans flex items-center gap-2">
              <Camera size={20} />
              Publier une annonce
            </h2>
            <p className="text-xs text-blue-100 mt-0.5">Vendez rapidement vos produits au Burundi</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Photos Upload Area */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
              Photos du produit ({images.length}/5) <span className="text-red-500">*</span>
            </label>
            
            {/* Image grids and Dropzone */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={img} alt="Aperçu" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 py-0.5 text-center text-[9px] text-white font-medium">
                    Photo {idx + 1} {idx === 0 && '(Principale)'}
                  </div>
                </div>
              ))}

              {images.length < 5 && (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer transition-all p-4 text-center ${
                    isDragging
                      ? 'border-blue-700 bg-blue-50 text-blue-700 scale-95'
                      : 'border-gray-300 bg-gray-50 text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/20'
                  }`}
                >
                  <Upload size={24} className="mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider block">Ajouter</span>
                  <span className="text-[8px] text-gray-400 mt-0.5">Glisser ou cliquer</span>
                </div>
              )}
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
            />
            <p className="text-[10px] text-gray-400">Le premier cliché sera l'image de couverture. Vous pouvez mettre jusqu'à 5 photos.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">Titre de l'annonce <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Samsung Galaxy S20 Ultra en bon état"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all"
              />
            </div>

            {/* Price */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">Prix (Francs Burundais - BIF) <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ex: 450000"
                  className="w-full pl-4 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-sm font-mono transition-all"
                />
                <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-gray-400">
                  BIF
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">Catégorie <span className="text-red-500">*</span></label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">Ville <span className="text-red-500">*</span></label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all cursor-pointer"
              >
                {BURUNDI_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.province})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">Description du produit <span className="text-red-500">*</span></label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez l'état de l'article, ses caractéristiques techniques, les accessoires fournis ou s'il y a des négociations possibles..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-gray-100 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl text-sm transition-colors active:scale-95 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-100 flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Check size={16} />
              Publier l'annonce
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
