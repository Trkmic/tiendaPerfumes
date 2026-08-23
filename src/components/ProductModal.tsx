import React, { useState } from 'react';
import { X, Star, ShoppingBag, Clock, Wind, Check, ShieldCheck, Heart } from 'lucide-react';
import type { Perfume } from '../types';
import { formatPrice } from '../utils/format';

interface ProductModalProps {
  perfume: Perfume | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (p: Perfume, ml: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  perfume,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !perfume) return null;

  const [selectedMl, setSelectedMl] = useState<number>(perfume.mlOptions[0] || 100);
  const [added, setAdded] = useState<boolean>(false);

  const handleAdd = () => {
    onAddToCart(perfume, selectedMl);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-4xl glass-panel border border-gold-500/30 rounded-3xl overflow-hidden shadow-2xl bg-dark-900/95 flex flex-col md:flex-row my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-dark-950/80 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Column */}
        <div className="w-full md:w-1/2 relative bg-dark-950/90 p-6 sm:p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-800">
          <img
            src={perfume.image}
            alt={perfume.name}
            className="w-full max-h-80 md:max-h-96 object-cover rounded-2xl border border-slate-800/80 shadow-2xl"
          />

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400 bg-dark-950/80 backdrop-blur p-2.5 rounded-xl border border-slate-800">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Original Garantizado
            </span>
            <span className="text-gold-400 font-medium">Envío Inmediato Protegido</span>
          </div>
        </div>

        {/* Details Column */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            {/* Header info */}
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
                {perfume.brand} &bull; {perfume.category.toUpperCase()}
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-slate-100 mt-1">
                {perfume.name}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-gold-400">
                  <Star className="w-4 h-4 fill-gold-400" />
                  <span className="text-sm font-bold ml-1 text-slate-200">{perfume.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-slate-500">({perfume.reviewsCount} opiniones verificadas)</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              {perfume.description}
            </p>

            {/* Olfactory Pyramid Tabs / Details */}
            <div className="p-4 rounded-2xl bg-dark-950/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400">
                Pirámide Olfativa
              </h4>
              <div className="text-xs space-y-1.5">
                <div>
                  <span className="text-slate-400 font-medium">Notas de Salida: </span>
                  <span className="text-slate-200">{perfume.pyramid.topNotes.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Corazón: </span>
                  <span className="text-slate-200">{perfume.pyramid.heartNotes.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Base: </span>
                  <span className="text-slate-200">{perfume.pyramid.baseNotes.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Performance Badges */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-dark-950/60 border border-slate-800/80 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-400" />
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase">Duración</span>
                  <span className="font-bold text-slate-200">{perfume.longevity}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-dark-950/60 border border-slate-800/80 flex items-center gap-2">
                <Wind className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase">Proyección</span>
                  <span className="font-bold text-slate-200">{perfume.projection}</span>
                </div>
              </div>
            </div>

            {/* ML Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Selecciona la Presentación (Frasco Original):
              </label>
              <div className="flex gap-2">
                {perfume.mlOptions.map((ml) => (
                  <button
                    key={ml}
                    onClick={() => setSelectedMl(ml)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedMl === ml
                        ? 'bg-gold-500 text-dark-950 border-gold-400 shadow-gold-glow'
                        : 'bg-dark-950 text-slate-400 border-slate-800 hover:border-gold-500/40'
                    }`}
                  >
                    {ml} ml
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing & Add Button */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
            <div>
              <span className="block text-[10px] text-slate-400 uppercase">Precio Total</span>
              <span className="font-serif font-extrabold text-2xl text-gold-400">
                {formatPrice(perfume.price)}
              </span>
            </div>

            <button
              onClick={handleAdd}
              className={`px-6 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-dark-950 hover:shadow-gold-glow hover:scale-105'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>¡Agregado al Carrito!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Agregar al Carrito</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
