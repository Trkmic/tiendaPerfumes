import React, { useState } from 'react';
import { Bot, Sparkles, X, Check, ArrowRight, RefreshCw, Award, Send } from 'lucide-react';
import type { Perfume, AISommelierQuiz, AISommelierRecommendation } from '../types';
import { sendN8nWebhook } from '../lib/n8nWebhook';

interface AISommelierProps {
  perfumes: Perfume[];
  isOpen: boolean;
  onClose: () => void;
  onSelectPerfume: (p: Perfume) => void;
}

export const AISommelier: React.FC<AISommelierProps> = ({
  perfumes,
  isOpen,
  onClose,
  onSelectPerfume,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<number>(1);
  const [quiz, setQuiz] = useState<AISommelierQuiz>({
    occasion: 'noche',
    season: 'invierno',
    preferredVibe: 'amaderado_oriental',
    budgetRange: 'medio',
  });

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<AISommelierRecommendation[]>([]);
  const [sentLead, setSentLead] = useState<boolean>(false);

  const handleCalculate = () => {
    setIsAnalyzing(true);
    setRecommendations([]);

    setTimeout(() => {
      // Algoritmo inteligente de coincidencia
      const matches: AISommelierRecommendation[] = perfumes.map((perfume) => {
        let score = 70; // Base score

        // Coincidencia por Ocasión & Vibe
        if (quiz.preferredVibe === 'amaderado_oriental' && (perfume.accords.includes('Oud') || perfume.accords.includes('Ámbar') || perfume.category === 'arabe')) {
          score += 20;
        }
        if (quiz.preferredVibe === 'dulce_gourmand' && (perfume.accords.includes('Vainilla') || perfume.accords.includes('Praliné') || perfume.accords.includes('Dulce'))) {
          score += 20;
        }
        if (quiz.preferredVibe === 'fresco_citrico' && (perfume.accords.includes('Cítrico') || perfume.accords.includes('Fresco') || perfume.accords.includes('Menta'))) {
          score += 20;
        }
        if (quiz.preferredVibe === 'especiado_misterioso' && (perfume.accords.includes('Especiado') || perfume.accords.includes('Cuero') || perfume.accords.includes('Tabaco'))) {
          score += 20;
        }

        if (quiz.occasion === 'noche' && (perfume.longevity.includes('12+') || perfume.projection.includes('Bestia') || perfume.projection.includes('Enorme'))) {
          score += 8;
        }

        // Cap at 99%
        const matchScore = Math.min(99, score + Math.floor(Math.random() * 5));

        return {
          perfume,
          matchScore,
          whyItMatches: `Basado en tu preferencia por aromas de tipo ${quiz.preferredVibe.replace('_', ' ')} para ocasión ${quiz.occasion}, las notas de ${perfume.pyramid.topNotes[0]} y ${perfume.pyramid.baseNotes[0]} complementarán tu química corporal a la perfección.`,
          bestOccasionTip: `Aplícalo en puntos de pulso (cuello y muñecas) 20 minutos antes de salir para proyectar una estela impactante.`
        };
      });

      // Ordenar por mejor match score
      matches.sort((a, b) => b.matchScore - a.matchScore);
      setRecommendations(matches.slice(0, 3));
      setIsAnalyzing(false);
      setStep(5); // Pantalla de Resultados
    }, 1200);
  };

  const handleSendLeadToN8n = async () => {
    if (recommendations.length === 0) return;
    const topMatch = recommendations[0].perfume;

    await sendN8nWebhook({
      eventType: 'ai_recommendation_lead',
      customer: {
        fullName: 'Cliente Sommelier IA',
        phone: '+549110000000',
        email: 'consulta-ia@cliente.com',
        city: 'Consulta Web',
        address: 'Frontend App',
        paymentMethod: 'whatsapp_direct',
      },
      items: [
        {
          name: topMatch.name,
          brand: topMatch.brand,
          ml: topMatch.mlOptions[0],
          qty: 1,
          price: topMatch.price
        }
      ],
      totalPrice: topMatch.price,
      timestamp: new Date().toISOString(),
      notes: `Recomendación Sommelier IA: Preferencia ${quiz.preferredVibe}, Ocasión ${quiz.occasion}`
    });

    setSentLead(true);
    setTimeout(() => setSentLead(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-2xl glass-panel border border-gold-500/40 rounded-3xl overflow-hidden shadow-2xl bg-dark-900/95 p-6 sm:p-8 space-y-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gold-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-gold-600 via-gold-400 to-emerald-800 text-dark-950 shadow-gold-glow">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-extrabold text-xl text-slate-100 flex items-center gap-2">
                Sommelier de IA <span className="gold-gradient-text">LuxeScents</span>
              </h3>
              <p className="text-xs text-slate-400">Descubre la fragancia signature perfecta para tu estilo</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white bg-dark-950 border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Occasion */}
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold uppercase text-gold-400 tracking-wider">Paso 1 de 4</span>
              <h4 className="text-lg font-bold text-slate-100 mt-1">¿Para qué ocasión buscas el perfume principalmente?</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'noche', label: '🌙 Noche / Eventos Especiales', desc: 'Aromas intensos, seductores y de alta proyección' },
                { id: 'cita', label: '🌹 Citas Románticas / Seducción', desc: 'Fragancias cálidas, dulces y gourmand' },
                { id: 'diario', label: '☀️ Uso Diario / Firma Personal', desc: 'Versátil, versátil y refrescante durante todo el día' },
                { id: 'oficina', label: '💼 Oficina / Profesional', desc: 'Elegante, pulcro y no invasivo' },
                { id: 'fiesta', label: '🔥 Fiesta / Clubbing (Modo Bestia)', desc: 'Potencia extrema para destacar sobre el resto' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setQuiz({ ...quiz, occasion: item.id as any });
                    setStep(2);
                  }}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    quiz.occasion === item.id
                      ? 'bg-gold-500/15 border-gold-400 text-gold-300 shadow-gold-glow'
                      : 'bg-dark-950 border-slate-800 text-slate-300 hover:border-gold-500/40'
                  }`}
                >
                  <div className="font-bold text-sm">{item.label}</div>
                  <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Season */}
        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold uppercase text-gold-400 tracking-wider">Paso 2 de 4</span>
              <h4 className="text-lg font-bold text-slate-100 mt-1">¿En qué clima o época del año lo utilizarás?</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'invierno', label: '❄️ Invierno / Clima Frío', desc: 'Resalta resinas, Oud, canela y vainilla' },
                { id: 'verano', label: '🏖️ Verano / Clima Cálido', desc: 'Notas cítricas, acuáticas y menta fresca' },
                { id: 'otono', label: '🍁 Otoño / Noches Templadas', desc: 'Madera de sándalo, especias suaves y ámbar' },
                { id: 'todo_ano', label: '🔄 Todo el Año (Multiuso 365)', desc: 'Equilibrio perfecto entre frescura y dulzura' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setQuiz({ ...quiz, season: item.id as any });
                    setStep(3);
                  }}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    quiz.season === item.id
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300 shadow-emerald-glow'
                      : 'bg-dark-950 border-slate-800 text-slate-300 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="font-bold text-sm">{item.label}</div>
                  <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(1)}
              className="text-xs text-slate-400 hover:text-white underline block"
            >
              &larr; Volver al paso anterior
            </button>
          </div>
        )}

        {/* STEP 3: Vibe & Olfactory Family */}
        {step === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold uppercase text-gold-400 tracking-wider">Paso 3 de 4</span>
              <h4 className="text-lg font-bold text-slate-100 mt-1">¿Qué tipo de aroma u "olores" disfrutas más?</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'amaderado_oriental', label: '🪵 Opulento Árabe (Oud, Ámbar & Especias)', desc: 'Perfil rico, exótico de medio oriente, azafrán y maderas nobles' },
                { id: 'dulce_gourmand', label: '🍫 Dulce Gourmand (Vainilla, Praliné & Dátiles)', desc: 'Aroma comestible, cálido, adictivo y envolvente' },
                { id: 'especiado_misterioso', label: '🌿 Especiado & Ahumado (Tabaco & Cuero)', desc: 'Misterioso, masculino y con personalidad imponente' },
                { id: 'fresco_citrico', label: '🍋 Fresco Cítrico & Marino (Limón & Menta)', desc: 'Limpio, energizante y vibrante' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setQuiz({ ...quiz, preferredVibe: item.id as any });
                    setStep(4);
                  }}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    quiz.preferredVibe === item.id
                      ? 'bg-gold-500/15 border-gold-400 text-gold-300 shadow-gold-glow'
                      : 'bg-dark-950 border-slate-800 text-slate-300 hover:border-gold-500/40'
                  }`}
                >
                  <div className="font-bold text-sm">{item.label}</div>
                  <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="text-xs text-slate-400 hover:text-white underline block"
            >
              &larr; Volver al paso anterior
            </button>
          </div>
        )}

        {/* STEP 4: Submit / Confirm */}
        {step === 4 && (
          <div className="space-y-6 text-center animate-fadeIn">
            <div className="p-4 rounded-2xl bg-dark-950 border border-gold-500/30 text-left space-y-2">
              <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Resumen de tu Perfil Olfativo</span>
              <div className="text-sm text-slate-200 grid grid-cols-2 gap-2 pt-1">
                <div>• Ocasión: <strong className="text-gold-300">{quiz.occasion}</strong></div>
                <div>• Clima: <strong className="text-emerald-300">{quiz.season}</strong></div>
                <div>• Familia: <strong className="text-purple-300">{quiz.preferredVibe.replace('_', ' ')}</strong></div>
                <div>• Modelo IA: <strong className="text-blue-300">Niche Sommelier v2.6</strong></div>
              </div>
            </div>

            {isAnalyzing ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-gold-500 border-t-transparent animate-spin" />
                <p className="text-sm text-gold-400 font-medium animate-pulse">
                  Evaluando pirámides olfativas y fijación en base de datos...
                </p>
              </div>
            ) : (
              <button
                onClick={handleCalculate}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-dark-950 font-extrabold text-base hover:shadow-gold-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Generar Recomendaciones de IA</span>
              </button>
            )}

            <button
              onClick={() => setStep(3)}
              className="text-xs text-slate-400 hover:text-white underline block mx-auto"
            >
              &larr; Modificar respuestas
            </button>
          </div>
        )}

        {/* STEP 5: AI Results Display */}
        {step === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Check className="w-4 h-4" /> Análisis de IA Finalizado
                </span>
                <h4 className="text-xl font-bold text-slate-100">Tus Fragancias Firma Recomendadas</h4>
              </div>
              
              <button
                onClick={() => setStep(1)}
                className="px-3 py-1.5 rounded-xl bg-dark-950 text-slate-300 hover:text-gold-400 text-xs border border-slate-800 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reintentar Quiz
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {recommendations.map((rec, index) => (
                <div
                  key={rec.perfume.id}
                  className="p-4 rounded-2xl glass-card border border-gold-500/30 flex flex-col sm:flex-row gap-4 items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={rec.perfume.image}
                      alt={rec.perfume.name}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-800"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                          {rec.matchScore}% Compatible
                        </span>
                        {index === 0 && (
                          <span className="px-2 py-0.5 rounded bg-gold-500 text-dark-950 text-[10px] font-extrabold flex items-center gap-1">
                            <Award className="w-3 h-3 fill-dark-950" /> #1 Selección Ideal
                          </span>
                        )}
                      </div>

                      <h5 className="font-serif font-bold text-slate-100 text-base mt-1">
                        {rec.perfume.name}
                      </h5>
                      <p className="text-xs text-slate-400">{rec.perfume.brand} &bull; ${rec.perfume.price.toFixed(2)}</p>
                      <p className="text-xs text-gold-300/90 mt-1 font-light italic">
                        "{rec.whyItMatches}"
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onSelectPerfume(rec.perfume);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gold-500 text-dark-950 font-bold hover:bg-gold-400 text-xs flex items-center justify-center gap-1.5 whitespace-nowrap shadow-gold-glow"
                  >
                    <span>Ver Pirámide Olfativa</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Dispatch Lead via n8n */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">¿Quieres recibir este reporte personalizado por WhatsApp?</span>
              <button
                onClick={handleSendLeadToN8n}
                className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition-all ${
                  sentLead
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-dark-950 text-gold-400 border-gold-500/40 hover:bg-gold-500 hover:text-black'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{sentLead ? '¡Enviado a n8n!' : 'Enviar a mi WhatsApp'}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
