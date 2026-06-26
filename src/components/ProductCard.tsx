import React from 'react';
import { Ad } from '../types';
import { MapPin, Calendar } from 'lucide-react';

export interface ProductCardProps {
  key?: React.Key;
  ad: Ad;
  onClick: () => void;
}

export default function ProductCard({ ad, onClick }: ProductCardProps) {
  // Format creation date
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col group animate-in fade-in duration-200"
    >
      {/* Product Image */}
      <div className="h-32 sm:h-48 bg-slate-200 relative overflow-hidden flex-shrink-0">
        <img
          src={ad.imageUrls[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400'}
          alt={ad.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        
        {/* Category Badge */}
        <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur py-0.5 px-2 rounded-full text-[8px] sm:text-[10px] font-black text-slate-900 border border-slate-100 shadow-sm">
          {ad.category.toUpperCase()}
        </div>

        {/* City Badge */}
        <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-sm text-white text-[8px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
          <MapPin size={10} />
          <span>{ad.city}</span>
        </div>
      </div>

      {/* Info Details */}
      <div className="p-3.5 sm:p-5 flex flex-col justify-between flex-1 gap-2.5">
        <div className="space-y-1">
          <span className="text-blue-600 font-black text-base sm:text-xl block leading-tight">
            {ad.price.toLocaleString()} BIF
          </span>
          <h4 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
            {ad.title}
          </h4>
        </div>

        <p className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">
          {ad.city} • {formatDate(ad.createdAt)}
        </p>
      </div>
    </div>
  );
}
