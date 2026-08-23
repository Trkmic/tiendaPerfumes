import React, { useState } from 'react';
import { X, Star, ShoppingBag, Sparkles, Clock, Zap, Check } from 'lucide-react';
import type { Perfume } from '../types';

interface ProductModalProps {
  perfume: Perfume | null;
  onClose: () => void;
  onAddToCart: (perfume: Perfume, selectedMl: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  perfume,
  onClose,
  onAddToCart,
}) => {
  if (!perfume) return null;

  const [selectedMl, setSelectedMl] = useState<number>(perfume.mlOptions[0] || 100);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(perfume, selectedMl);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-4xl glass-panel border border-gold-500/30 rounded-3xl overflow-hidden shadow-2xl bg-dark-900/95 max-h-[90vh] flex flex-col md:flex-row my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-dark-950/80 text-slate-400 hover:text-white border border-slate-700 hover:border-gold-500 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Image Section */}
        <div className="w-full md:w-5/12 bg-dark-950 p-6 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-slate-800">
          <div className="relative aspect-square w-full max-w-xs rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <img
              src={perfume.image}
              alt={perfume.name}
              className="w-full h-full object-cover object-center"
            />
            {perfume.category === 'arabe' && (
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-950 text-gold-400 text-xs font-bold border border-gold-500/40">
                🕌 Perfume Árabe Original
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="w-full mt-6 grid grid-cols-2 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-dark-900 border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 block font-medium">Duración</span>
              <span className="text-xs font-bold text-gold-400 flex items-center justify-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-gold-500" />
                {perfume.longevity}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-dark-900 border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 block font-medium">Proyección</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                <Zap className="w-3.5 h-3.5 text-emerald-500" />
                {perfume.projection}
              </span>
            </div>
          </div>
        </div>

        {/* Right Info & Pyramid Section */}
        <div className="w-full md:w-7/12 p-6 md:p-8 overflow-y-auto space-y-6">
          
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-gold-500 font-bold">
                {perfume.brand}
              </span>
              <span className="text-xs text-slate-400 uppercase bg-dark-950 px-2.5 py-0.5 rounded border border-slate-800">
                {perfume.gender}
              </span>
            </div>

            <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-slate-100 mt-1">
              {perfume.name}
            </h2>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-gold-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-300">{perfume.rating} / 5.0</span>
              <span className="text-xs text-slate-400">({perfume.reviewsCount} evaluaciones verificadas)</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 font-light leading-relaxed">
            {perfume.description}
          </p>

          {/* PIRÁMIDE OLFATIVA DETALLADA */}
          <div className="p-4 rounded-2xl bg-dark-950 border border-gold-500/20 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              Pirámide Olfativa Interactiva
            </h4>

            <div className="space-y-2 text-xs">
              {/* Salida */}
              <div className="p-2.5 rounded-xl bg-dark-900 border border-slate-800">
                <span className="font-bold text-gold-300 block mb-1">🍋 Notas de Salida (Primeros 15-30 min):</span>
                <p className="text-slate-300">{perfume.pyramid.topNotes.join(' • ')}</p>
              </div>

              {/* Corazón */}
              <div className="p-2.5 rounded-xl bg-dark-900 border border-slate-800">
                <span className="font-bold text-emerald-300 block mb-1">🌸 Notas de Corazón (Cuerpo del perfume 2-4 hrs):</span>
                <p className="text-slate-300">{perfume.pyramid.heartNotes.join(' • ')}</p>
              </div>

              {/* Fondo */}
              <div className="p-2.5 rounded-xl bg-dark-900 border border-slate-800">
                <span className="font-bold text-purple-300 block mb-1">🪵 Notas de Fondo (Estela duradera en piel y ropa):</span>
                <p className="text-slate-300">{perfume.pyramid.baseNotes.join(' • ')}</p>
              </div>
            </div>
          </div>

          {/* Accords Tags */}
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-2">Acordes Principales:</span>
            <div className="flex flex-wrap gap-1.5">
              {perfume.accords.map((accord, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full bg-dark-950 text-gold-300 text-xs border border-gold-500/30">
                  {accord}
                </span>
              ))}
            </div>
          </div>

          {/* Size Selector & Price */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">Seleccionar Presentación (ml):</span>
              <div className="flex gap-3">
                {perfume.mlOptions.map((ml) => (
                  <button
                    key={ml}
                    onClick={() => setSelectedMl(ml)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedMl === ml
                        ? 'bg-gold-500 text-dark-950 border-gold-400 shadow-gold-glow'
                        : 'bg-dark-950 text-slate-300 border-slate-800 hover:border-gold-500/50'
                    }`}
                  >
                    Frasco {ml} ml
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Precio Total:</span>
                <span className="font-serif font-extrabold text-3xl text-gold-400">
                  ${perfume.price.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleAdd}
                className={`px-8 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-gold-500 to-gold-600 text-dark-950 hover:shadow-gold-glow hover:scale-105'
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
    </div>
  );
};
