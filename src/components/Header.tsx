import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Search, Bot, Layers, Menu, X, PhoneCall } from 'lucide-react';
import type { PerfumeCategory } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSommelier: () => void;
  onOpenN8nModal: () => void;
  selectedCategory: PerfumeCategory | 'todos';
  onSelectCategory: (cat: PerfumeCategory | 'todos') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenSommelier,
  onOpenN8nModal,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-gold-500/20 backdrop-blur-md bg-dark-950/80">
      {/* Top Banner Announcement */}
      <div className="bg-gradient-to-r from-emerald-950 via-dark-900 to-emerald-950 text-gold-400 text-xs py-1.5 px-4 text-center border-b border-gold-500/10 font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
        <span>Envío gratis a todo el país en compras superiores a $100 &bull; 100% Perfumes Originales &bull; Pago con MercadoPago y WhatsApp</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-emerald-800 p-0.5 shadow-gold-glow">
                <div className="w-full h-full bg-dark-950 rounded-full flex items-center justify-center">
                  <span className="font-serif font-black text-xl gold-gradient-text">L</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl sm:text-2xl tracking-wider text-slate-100 group-hover:text-gold-400 transition-colors">
                  LUXE<span className="gold-gradient-text">OUD</span>
                </span>
                <span className="text-[10px] tracking-[0.25em] text-gold-500/80 uppercase font-medium">
                  Arabian & Designer Niche
                </span>
              </div>
            </a>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500/60" />
              <input
                type="text"
                placeholder="Buscar por marca, nota (Oud, Vainilla, Ámbar) o perfume..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-900/90 border border-slate-800 focus:border-gold-500/60 rounded-full text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* AI Sommelier Button */}
            <button
              onClick={onOpenSommelier}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-gold-500/10 via-emerald-900/30 to-gold-500/20 border border-gold-500/40 text-gold-300 hover:text-white hover:border-gold-400 transition-all text-xs sm:text-sm font-medium shadow-sm hover:shadow-gold-glow"
            >
              <Bot className="w-4 h-4 text-gold-400 animate-bounce" />
              <span className="hidden sm:inline">Sommelier IA</span>
            </button>

            {/* n8n Automation Button */}
            <button
              onClick={onOpenN8nModal}
              title="Configuración de Automatizaciones n8n"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-full bg-dark-900 border border-slate-800 text-slate-400 hover:text-gold-400 hover:border-slate-700 transition-all text-xs font-medium"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span>n8n Webhook</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center justify-center p-2.5 rounded-full bg-gold-500 text-dark-950 font-bold hover:bg-gold-400 transition-all shadow-gold-glow group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center border-2 border-dark-950 shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-gold-400 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="border-t border-slate-800/60 bg-dark-950/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto no-scrollbar py-2.5">
          <div className="flex items-center gap-2 sm:gap-6 min-w-max">
            <button
              onClick={() => onSelectCategory('todos')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === 'todos'
                  ? 'bg-gold-500 text-dark-950 font-bold shadow'
                  : 'text-slate-400 hover:text-gold-400 hover:bg-dark-900'
              }`}
            >
              ✨ Todos los Perfumes
            </button>
            <button
              onClick={() => onSelectCategory('arabe')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === 'arabe'
                  ? 'bg-emerald-800 text-gold-300 border border-gold-500/40 font-bold shadow'
                  : 'text-slate-400 hover:text-gold-400 hover:bg-dark-900'
              }`}
            >
              🕌 Perfumes Árabes (Oud & Ámbar)
            </button>
            <button
              onClick={() => onSelectCategory('disenador')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === 'disenador'
                  ? 'bg-gold-500 text-dark-950 font-bold shadow'
                  : 'text-slate-400 hover:text-gold-400 hover:bg-dark-900'
              }`}
            >
              💎 Perfumes de Diseñador
            </button>
            <button
              onClick={() => onSelectCategory('nicho')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === 'nicho'
                  ? 'bg-gradient-to-r from-purple-900 to-dark-900 text-gold-300 border border-purple-500/40 font-bold shadow'
                  : 'text-slate-400 hover:text-gold-400 hover:bg-dark-900'
              }`}
            >
              👑 Perfumería de Nicho
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 pl-4 border-l border-slate-800">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>Asesoría Directa por WhatsApp</span>
          </div>
        </div>
      </div>

      {/* Mobile Search & Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-900/95 border-t border-slate-800 p-4 space-y-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500/60" />
            <input
              type="text"
              placeholder="Buscar perfume o notas..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-gold-500"
            />
          </div>
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => { onOpenSommelier(); setMobileMenuOpen(false); }}
              className="flex items-center justify-between p-3 rounded-lg bg-gold-500/10 text-gold-300 font-medium text-sm"
            >
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-gold-400" />
                <span>Asistente Sommelier IA</span>
              </div>
              <span className="text-xs bg-gold-500 text-black font-bold px-2 py-0.5 rounded">IA Active</span>
            </button>

            <button
              onClick={() => { onOpenN8nModal(); setMobileMenuOpen(false); }}
              className="flex items-center justify-between p-3 rounded-lg bg-dark-950 text-slate-300 text-sm"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Webhook n8n (WhatsApp / Gmail)</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
