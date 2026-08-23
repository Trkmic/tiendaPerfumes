import React from 'react';
import { Star, Eye, ShoppingBag, Sparkles, Clock, Flame } from 'lucide-react';
import type { Perfume } from '../types';

interface ProductCardProps {
  perfume: Perfume;
  onOpenModal: (p: Perfume) => void;
  onAddToCart: (p: Perfume) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  perfume,
  onOpenModal,
  onAddToCart,
}) => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group relative border border-slate-800 hover:border-gold-500/40 transition-all duration-300">
      
      {/* Product Image Section */}
      <div className="relative aspect-square overflow-hidden bg-dark-950/80 cursor-pointer" onClick={() => onOpenModal(perfume)}>
        <img
          src={perfume.image}
          alt={perfume.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {perfume.category === 'arabe' && (
            <span className="px-2.5 py-1 rounded-md bg-emerald-950/90 text-gold-400 text-[11px] font-bold border border-gold-500/30 flex items-center gap-1 shadow-md">
              <span>🕌</span> Árabe Original
            </span>
          )}
          {perfume.category === 'disenador' && (
            <span className="px-2.5 py-1 rounded-md bg-dark-900/90 text-slate-200 text-[11px] font-bold border border-slate-700 flex items-center gap-1 shadow-md">
              <span>💎</span> Diseñador
            </span>
          )}
          {perfume.category === 'nicho' && (
            <span className="px-2.5 py-1 rounded-md bg-purple-950/90 text-purple-300 text-[11px] font-bold border border-purple-500/30 flex items-center gap-1 shadow-md">
              <span>👑</span> Nicho Exclusive
            </span>
          )}
          {perfume.isBestseller && (
            <span className="px-2.5 py-1 rounded-md bg-gold-500 text-dark-950 text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 shadow-md">
              <Flame className="w-3 h-3 text-dark-950 fill-dark-950" /> Bestseller
            </span>
          )}
        </div>

        {/* Quick View Hover Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal(perfume);
          }}
          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-dark-950/80 backdrop-blur text-gold-400 border border-gold-500/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-gold-glow hover:scale-110"
          title="Ver Pirámide Olfativa Detallada"
        >
          <Eye className="w-5 h-5" />
        </button>

        {/* Gender Badge */}
        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-dark-900/90 text-slate-300 text-[10px] font-medium uppercase tracking-wider border border-slate-800">
          {perfume.gender}
        </div>
      </div>

      {/* Product Content & Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Brand */}
          <span className="text-xs uppercase tracking-widest text-gold-500/80 font-bold block mb-1">
            {perfume.brand}
          </span>

          {/* Title */}
          <h3
            onClick={() => onOpenModal(perfume)}
            className="font-serif font-bold text-slate-100 text-lg group-hover:text-gold-400 transition-colors line-clamp-1 cursor-pointer"
          >
            {perfume.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400">
            <div className="flex items-center text-gold-400">
              <Star className="w-3.5 h-3.5 fill-gold-400" />
              <span className="ml-1 font-bold">{perfume.rating}</span>
            </div>
            <span>({perfume.reviewsCount} reseñas)</span>
          </div>

          {/* Key Accords Tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {perfume.accords.slice(0, 3).map((accord, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-dark-900 text-slate-300 text-[10px] font-medium border border-slate-800"
              >
                {accord}
              </span>
            ))}
          </div>
        </div>

        {/* Olfactory Notes Preview */}
        <div className="pt-2 border-t border-slate-800/80 text-xs space-y-1">
          <div className="flex items-center gap-1 text-slate-400">
            <Sparkles className="w-3 h-3 text-gold-400" />
            <span className="font-semibold text-slate-300">Notas de Salida:</span>
            <span className="truncate">{perfume.pyramid.topNotes.join(', ')}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span className="font-semibold text-slate-300">Fijación:</span>
            <span>{perfume.longevity}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div>
            {perfume.originalPrice && (
              <span className="text-xs text-slate-500 line-through block">
                ${perfume.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="font-serif font-extrabold text-xl text-gold-400">
              ${perfume.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => onAddToCart(perfume)}
            className="px-4 py-2.5 rounded-xl bg-gold-500 text-dark-950 font-bold hover:bg-gold-400 transition-colors flex items-center gap-2 text-xs shadow-gold-glow"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Comprar</span>
          </button>
        </div>

      </div>

    </div>
  );
};
