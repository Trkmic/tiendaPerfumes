import React from 'react';
import { Sparkles } from 'lucide-react';
import type { PerfumeCategory } from '../types';

interface FooterProps {
  onSelectCategory: (cat: PerfumeCategory | 'todos') => void;
  onOpenSommelier: () => void;
  onOpenLegal: (type: 'terms' | 'privacy') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenSommelier, onOpenLegal }) => {

  const handleCollectionClick = (cat: PerfumeCategory | 'todos') => {
    onSelectCategory(cat);
    const element = document.getElementById('catalog-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-dark-950 border-t border-gold-500/20 text-slate-400 text-xs pt-16 pb-12 relative overflow-hidden">
      
      {/* Glow effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold-500 text-dark-950 font-serif font-black text-lg flex items-center justify-center">
                L
              </div>
              <span className="font-serif font-bold text-xl text-slate-100">
                LUXE<span className="gold-gradient-text">OUD</span>
              </span>
            </div>

            <p className="text-slate-400 font-light leading-relaxed">
              Especialistas en perfumería árabe de nicho (Oud, Ámbar, Azafrán) y fragancias internacionales de diseñador. Calidad garantizada 100% original.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-slate-100 text-sm uppercase tracking-wider text-gold-400">
              Colecciones
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleCollectionClick('arabe')} className="hover:text-gold-400 transition-colors text-left">
                  🕌 Perfumes Árabes (Oud & Spices)
                </button>
              </li>
              <li>
                <button onClick={() => handleCollectionClick('disenador')} className="hover:text-gold-400 transition-colors text-left">
                  💎 Perfumes de Diseñador
                </button>
              </li>
              <li>
                <button onClick={() => handleCollectionClick('nicho')} className="hover:text-gold-400 transition-colors text-left">
                  👑 Perfumería de Nicho
                </button>
              </li>
              <li>
                <button onClick={onOpenSommelier} className="text-gold-300 font-bold flex items-center gap-1 hover:underline">
                  <Sparkles className="w-3 h-3 text-gold-400" />
                  <span>Sommelier IA Recomendador</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Garantía & Envíos */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-slate-100 text-sm uppercase tracking-wider text-gold-400">
              Garantía & Envíos
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>• Garantía de autenticidad 100% original en cada fragancia</li>
              <li>• Envíos protegidos y seguros a todo el país</li>
              <li>• Métodos de pago 100% seguros y protegidos</li>
            </ul>
          </div>

        </div>

        {/* Bottom Rights */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>&copy; 2026 LuxeOud & Co. Todos los derechos reservados. Perfumería Árabe & Diseñador.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-gold-400 transition-colors underline font-medium"
            >
              Términos & Condiciones
            </button>
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-gold-400 transition-colors underline font-medium"
            >
              Política de Privacidad
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
