import React from 'react';
import { Sparkles, ShieldCheck, Truck, Bot, ArrowRight, Star } from 'lucide-react';

interface HeroProps {
  onOpenSommelier: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenSommelier, onExploreClick }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-gold-500/10">
      {/* Background Decorative Glowing Mists */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-gold-600/15 via-emerald-800/20 to-transparent rounded-full blur-3xl pointer-events-none animate-mist" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-emerald-950/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline and Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Luxury Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Alta Perfumería de Oriente & Occidente</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 leading-tight tracking-tight">
              El Arte de Dejar una <br className="hidden sm:inline" />
              <span className="gold-gradient-text">Huella Inolvidable</span>
            </h1>

            {/* Subtext */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
              Sumérgete en la opulencia de los <strong className="text-gold-300 font-normal">Perfumes Árabes con Oud real, Ámbar y Especias exóticas</strong>, junto a las creaciones de diseñador más icónicas del mundo. Descubre tu fragancia insignia con nuestro asesor de IA.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenSommelier}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-dark-950 font-bold text-base hover:shadow-gold-glow hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-lg"
              >
                <Bot className="w-5 h-5 text-dark-950" />
                <span>Encontrar mi Fragancia con IA</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto px-8 py-4 rounded-full glass-card text-slate-200 hover:text-gold-400 border border-slate-700 hover:border-gold-500/50 font-medium text-base transition-all flex items-center justify-center gap-2"
              >
                <span>Ver Colección Exclusive</span>
              </button>
            </div>

            {/* Social Proof / Trust Metrics */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-xl mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1 text-gold-400 font-bold text-xl">
                  <span>4.9</span>
                  <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                </div>
                <p className="text-xs text-slate-400">Reseñas de Clientes</p>
              </div>

              <div className="text-center lg:text-left border-x border-slate-800 px-2">
                <div className="text-gold-400 font-bold text-xl">+100%</div>
                <p className="text-xs text-slate-400">Autenticidad Garantizada</p>
              </div>

              <div className="text-center lg:text-left">
                <div className="text-gold-400 font-bold text-xl">24/7</div>
                <p className="text-xs text-slate-400">Atención por WhatsApp</p>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Bottle Display */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Decorative Glow Ring */}
            <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/20 via-emerald-500/10 to-transparent rounded-3xl blur-2xl transform rotate-6" />

            <div className="relative w-full max-w-md glass-panel p-6 rounded-3xl border border-gold-500/30 shadow-2xl space-y-4">
              
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-dark-900 border border-slate-800">
                <img
                  src="/images/arabic_oud.png"
                  alt="Perfume Árabe de Lujo - Oud & Gold Edition"
                  className="w-full h-full object-cover object-center transform hover:scale-110 transition-transform duration-700"
                />
                
                {/* Floating Tag */}
                <div className="absolute top-4 left-4 glass-panel px-3 py-1 rounded-full text-xs font-bold text-gold-400 flex items-center gap-1.5 border border-gold-500/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Tendencia Árabe 2026
                </div>

                <div className="absolute bottom-4 right-4 bg-dark-950/90 backdrop-blur px-3 py-1.5 rounded-xl border border-gold-500/30 text-right">
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest">Duración Extrema</div>
                  <div className="text-xs font-bold text-gold-300">12+ Horas de Fijación</div>
                </div>
              </div>

              {/* Showcase Caption */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h3 className="font-serif font-bold text-slate-100 text-lg">Club De Nuit Intense</h3>
                  <p className="text-xs text-slate-400">Armaf Dubai &bull; Extracto de Perfume</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 line-through mr-1">$95</span>
                  <span className="font-bold text-xl text-gold-400">$75</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Feature Badges Row */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">Garantía 100% Original</h4>
              <p className="text-xs text-slate-400">Importación directa desde Dubai y Europa sin intermediarios.</p>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">Despacho Inmediato 24h</h4>
              <p className="text-xs text-slate-400">Envío protegido con empaque de seguridad y seguimiento.</p>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">Asesoría de Olfato con IA</h4>
              <p className="text-xs text-slate-400">Te recomendamos el perfume idóneo para tu piel u ocasión.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
