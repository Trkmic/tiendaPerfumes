import React from 'react';
import { Star, ShoppingBag, Eye, Award } from 'lucide-react';
import type { Perfume } from '../types';
import { formatPrice } from '../utils/format';

interface ProductCardProps {
  perfume: Perfume;
  onOpenModal: (p: Perfume) => void;
  onAddToCart: (p: Perfume, ml: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  perfume,
  onOpenModal,
  onAddToCart,
}) => {
  const defaultMl = perfume.mlOptions[0] || 100;

  return (
    <div className="group relative glass-card rounded-3xl overflow-hidden border border-gold-500/20 hover:border-gold-400/60 transition-all duration-500 hover:shadow-gold-glow flex flex-col justify-between bg-dark-900/80">
      
      {/* Top Badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1.5">
          {perfume.isBestseller && (
            <span className="px-2.5 py-1 rounded-full bg-gold-500 text-dark-950 text-[10px] font-extrabold tracking-wider uppercase shadow-gold-glow flex items-center gap-1">
              <Award className="w-3 h-3 fill-dark-950" /> Bestseller
            </span>
          )}
          {perfume.isNew && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-800 text-gold-300 text-[10px] font-extrabold tracking-wider uppercase border border-gold-500/40 shadow-emerald-glow">
              ✨ Nuevo
            </span>
          )}
        </div>

        <span className="px-2.5 py-1 rounded-full bg-dark-950/80 backdrop-blur border border-slate-800 text-slate-300 text-[10px] font-bold uppercase tracking-wider">
          {perfume.gender}
        </span>
      </div>

      {/* Image Container */}
      <div
        onClick={() => onOpenModal(perfume)}
        className="relative w-full h-64 overflow-hidden cursor-pointer bg-dark-950/60 flex items-center justify-center p-4"
      >
        <img
          src={perfume.image}
          alt={perfume.name}
          className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-out border border-slate-800/40"
        />

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-dark-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(perfume);
            }}
            className="px-4 py-2.5 rounded-full bg-dark-900/90 border border-gold-500/50 text-gold-300 text-xs font-bold hover:bg-gold-500 hover:text-dark-950 transition-all flex items-center gap-1.5 shadow-lg"
          >
            <Eye className="w-4 h-4" />
            <span>Vista Rápida</span>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-gold-400/80 font-medium">
            <span className="uppercase tracking-widest text-[10px]">{perfume.brand}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
              <span className="text-slate-200 font-bold">{perfume.rating.toFixed(1)}</span>
              <span className="text-slate-500 text-[10px]">({perfume.reviewsCount})</span>
            </div>
          </div>

          <h3
            onClick={() => onOpenModal(perfume)}
            className="font-serif font-bold text-slate-100 text-base sm:text-lg line-clamp-1 group-hover:text-gold-400 transition-colors cursor-pointer"
          >
            {perfume.name}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 font-light leading-relaxed">
            {perfume.description}
          </p>
        </div>

        {/* Notes Chips */}
        <div className="flex flex-wrap gap-1">
          {perfume.accords.slice(0, 3).map((accord) => (
            <span
              key={accord}
              className="px-2 py-0.5 rounded-md bg-dark-950 text-[10px] text-slate-400 border border-slate-800/80"
            >
              {accord}
            </span>
          ))}
        </div>

        {/* Pricing & Add to Cart Button */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          
          <div>
            <div className="flex items-baseline gap-1.5">
              {perfume.originalPrice && (
                <span className="text-xs text-slate-500 line-through font-medium">
                  {formatPrice(perfume.originalPrice)}
                </span>
              )}
            </div>
            <span className="font-serif font-extrabold text-lg sm:text-xl gold-gradient-text">
              {formatPrice(perfume.price)}
            </span>
          </div>

          <button
            onClick={() => onAddToCart(perfume, defaultMl)}
            className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 font-bold text-xs hover:shadow-gold-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Agregar</span>
          </button>

        </div>

      </div>
    </div>
  );
};
