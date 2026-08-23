import React, { useState } from 'react';
import { X, Layers, Send, Check, Mail, MessageSquare, Terminal, RefreshCw } from 'lucide-react';
import { getN8nWebhookUrl, setN8nWebhookUrl, sendN8nWebhook } from '../lib/n8nWebhook';

interface N8nAutomationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const N8nAutomationsModal: React.FC<N8nAutomationsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [url, setUrl] = useState<string>(getN8nWebhookUrl());
  const [saved, setSaved] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setN8nWebhookUrl(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTestWebhook = async () => {
    setIsSending(true);
    setTestResult(null);

    const result = await sendN8nWebhook({
      eventType: 'new_order',
      orderId: `TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: {
        fullName: 'Pedro (Prueba Emprendedor)',
        phone: '+5491112345678',
        email: 'pedro.emprendimiento@gmail.com',
        city: 'Buenos Aires',
        address: 'Av. Corrientes 1234',
        paymentMethod: 'whatsapp_direct',
        notes: 'Prueba de automatización con n8n'
      },
      items: [
        {
          name: 'Khamrah Eau de Parfum',
          brand: 'Lattafa Perfumes',
          ml: 100,
          qty: 1,
          price: 68.00
        }
      ],
      totalPrice: 68.00,
      timestamp: new Date().toISOString(),
    });

    setIsSending(false);
    setTestResult(JSON.stringify(result.payloadSent, null, 2));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-3xl glass-panel border border-emerald-500/40 rounded-3xl overflow-hidden shadow-2xl bg-dark-900/95 p-6 sm:p-8 space-y-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-slate-100 flex items-center gap-2">
                Centro de Automatización <span className="text-emerald-400">n8n</span>
              </h3>
              <p className="text-xs text-slate-400">Sincronización 24/7 con WhatsApp, Gmail y Base de Datos</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white bg-dark-950 border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Diagram */}
        <div className="p-4 rounded-2xl bg-dark-950 border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            ⚡ Flujo de Trabajo Configurado (Workflow Concept):
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3 rounded-xl bg-dark-900 border border-gold-500/20 flex flex-col items-center gap-1">
              <span className="font-bold text-gold-400">1. E-Commerce Trigger</span>
              <span className="text-slate-400">Compra o Lead en Tienda</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex flex-col items-center gap-1">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-emerald-300">2. n8n Engine</span>
              <span className="text-slate-400">Procesa datos & IA</span>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/30 flex flex-col items-center gap-1">
              <div className="flex gap-2 text-purple-300">
                <MessageSquare className="w-4 h-4" />
                <Mail className="w-4 h-4" />
              </div>
              <span className="font-bold text-purple-300">3. WhatsApp + Gmail</span>
              <span className="text-slate-400">Notificación Instantánea</span>
            </div>
          </div>
        </div>

        {/* URL Configuration Form */}
        <form onSubmit={handleSaveUrl} className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">URL del Webhook de tu n8n (Production / Test):</label>
          <div className="flex gap-2">
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 p-3 rounded-xl bg-dark-950 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              placeholder="https://tu-instancia-n8n.com/webhook/luxe-perfumes"
            />
            <button
              type="submit"
              className={`px-5 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                saved ? 'bg-emerald-600 text-white' : 'bg-emerald-800 text-gold-300 border border-gold-500/30 hover:bg-emerald-700'
              }`}
            >
              {saved ? <Check className="w-4 h-4" /> : null}
              <span>{saved ? 'Guardado' : 'Guardar URL'}</span>
            </button>
          </div>
        </form>

        {/* Test Trigger Section */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">Prueba de Integración en Tiempo Real:</span>
            <button
              onClick={handleTestWebhook}
              disabled={isSending}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-emerald-700 text-dark-950 font-bold text-xs hover:scale-105 transition-all flex items-center gap-1.5 shadow-md"
            >
              {isSending ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-dark-950" /> : <Send className="w-3.5 h-3.5 text-dark-950" />}
              <span>{isSending ? 'Enviando a n8n...' : 'Disparar Webhook de Prueba'}</span>
            </button>
          </div>

          {testResult && (
            <div className="space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
                <span className="flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5" /> Payload JSON Enviado Exitosamente:
                </span>
              </div>
              <pre className="p-4 rounded-xl bg-dark-950 border border-slate-800 text-[11px] text-emerald-300 font-mono overflow-x-auto max-h-44">
                {testResult}
              </pre>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
