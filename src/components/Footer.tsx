import React from 'react';
import { Sparkles, Phone, Mail, MapPin, Globe, Share2, Send } from 'lucide-react';
import type { PerfumeCategory } from '../types';

interface FooterProps {
  onSelectCategory: (cat: PerfumeCategory | 'todos') => void;
  onOpenSommelier: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenSommelier }) => {
  return (
    <footer className="bg-dark-950 border-t border-gold-500/20 text-slate-400 text-xs pt-16 pb-12 relative overflow-hidden">
      
      {/* Glow effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
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

            <div className="flex items-center gap-3 pt-1">
              <a href="#" className="p-2 rounded-lg bg-dark-900 text-gold-400 border border-slate-800 hover:border-gold-500 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-dark-900 text-gold-400 border border-slate-800 hover:border-gold-500 transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-dark-900 text-emerald-400 border border-slate-800 hover:border-emerald-500 transition-colors">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-slate-100 text-sm uppercase tracking-wider text-gold-400">
              Colecciones
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onSelectCategory('arabe')} className="hover:text-gold-400 transition-colors">
                  🕌 Perfumes Árabes (Oud & Spices)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('disenador')} className="hover:text-gold-400 transition-colors">
                  💎 Perfumes de Diseñador
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('nicho')} className="hover:text-gold-400 transition-colors">
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

          {/* Col 3: Customer Care & FAQ */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-slate-100 text-sm uppercase tracking-wider text-gold-400">
              Garantía & FAQ
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>• ¿Cómo sé si el perfume es original? (Sello lote de autenticidad)</li>
              <li>• Envíos protegidos 24/48 hs a todo el país</li>
              <li>• Decants y frascos de muestra disponibles</li>
              <li>• Pago seguro con MercadoPago y WhatsApp</li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-slate-100 text-sm uppercase tracking-wider text-gold-400">
              Atención al Cliente
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: +54 9 11 0000-0000</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-gold-400" />
                <span>ventas@luxeoud-perfumes.com</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span>Boutique Central & Envíos Globales</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Rights */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>&copy; 2026 LuxeOud & Co. Todos los derechos reservados. Perfumería Árabe & Diseñador.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-400">Términos & Condiciones</a>
            <a href="#" className="hover:text-slate-400">Política de Privacidad</a>
            <a href="#" className="hover:text-slate-400">Integración n8n Webhook</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
