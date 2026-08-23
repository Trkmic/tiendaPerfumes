import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Check, Send, ShieldCheck, AlertCircle, PhoneCall, CheckCircle2, Mail } from 'lucide-react';
import type { CartItem, CustomerDetails } from '../types';
import { sendN8nWebhook } from '../lib/n8nWebhook';
import { saveOrder } from '../lib/supabase';
import { sendOrderEmailNotification, TARGET_EMAIL } from '../lib/emailNotifier';
import { formatPrice } from '../utils/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, ml: number, delta: number) => void;
  onRemoveItem: (id: string, ml: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'success'>('cart');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>('');
  const [activeWhatsappUrl, setActiveWhatsappUrl] = useState<string>('');

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    paymentMethod: 'whatsapp_direct',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!customer.fullName.trim()) {
      newErrors.fullName = 'Por favor ingresa tu nombre y apellido completo.';
    } else if (customer.fullName.trim().length < 3) {
      newErrors.fullName = 'El nombre completo debe tener al menos 3 caracteres.';
    }

    if (!customer.phone.trim()) {
      newErrors.phone = 'Por favor ingresa tu número de WhatsApp / teléfono.';
    } else if (customer.phone.trim().length < 6) {
      newErrors.phone = 'Ingresa un número telefónico válido (mínimo 6 dígitos).';
    }

    if (!customer.city.trim()) {
      newErrors.city = 'Por favor indica la ciudad de entrega.';
    }

    if (!customer.address.trim()) {
      newErrors.address = 'Por favor indica la dirección exacta de entrega.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const totalPrice = items.reduce((sum, item) => sum + item.perfume.price * item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    const orderId = `LUXE-${Math.floor(100000 + Math.random() * 900000)}`;
    setCreatedOrderId(orderId);

    const payload = {
      eventType: 'new_order' as const,
      orderId,
      customer: {
        ...customer,
        paymentMethod: 'whatsapp_direct' as const,
      },
      items: items.map(item => ({
        name: item.perfume.name,
        brand: item.perfume.brand,
        ml: item.selectedMl,
        qty: item.quantity,
        price: item.perfume.price
      })),
      totalPrice,
      timestamp: new Date().toISOString(),
      notes: customer.notes
    };

    // 1. Guardar orden en la base de datos Supabase
    await saveOrder(payload);

    // 2. Enviar notificación directa por email a trkmicignacio@gmail.com
    await sendOrderEmailNotification(payload);

    // 3. Disparar Webhook n8n para notificaciones adicionales
    sendN8nWebhook(payload).catch(() => {});

    // 4. Formatear mensaje para opción de notificar por WhatsApp al vendedor (+54 9 11 2716-1063)
    const orderLines = items.map(
      i => `• *${i.perfume.name}* (${i.selectedMl}ml) x${i.quantity} -> ${formatPrice(i.perfume.price * i.quantity)}`
    ).join('\n');

    const rawMessage = `Hola *LuxeOud* 🕌✨! Realicé el pedido #${orderId} en la web:

${orderLines}

💰 *Total a Abonar:* ${formatPrice(totalPrice)}
👤 *Cliente:* ${customer.fullName}
📱 *Teléfono:* ${customer.phone}
📍 *Ciudad y Dirección:* ${customer.city}, ${customer.address}

Quedo a la espera de sus datos bancarios (CBU / Alias / Mercado Pago) para realizar el pago. ¡Gracias!`;

    const whatsappPhone = '5491127161063';
    const waUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(rawMessage)}`;
    setActiveWhatsappUrl(waUrl);

    setIsProcessing(false);
    setCheckoutStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-dark-950/80 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel bg-dark-900/95 border-l border-gold-500/30 shadow-2xl flex flex-col justify-between p-6 overflow-y-auto relative">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gold-500/20 pb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold-400" />
              <h3 className="font-serif font-bold text-lg text-slate-100">
                Tu Carrito <span className="gold-gradient-text">Luxe</span>
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white bg-dark-950 border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SUCCESS STEP */}
          {checkoutStep === 'success' ? (
            <div className="my-auto space-y-6 text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-emerald-glow">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-gold-500/10 text-gold-400 text-xs font-bold border border-gold-500/30">
                  Orden #{createdOrderId}
                </span>
                <h4 className="font-serif font-bold text-2xl text-slate-100">¡Pedido Registrado con Éxito!</h4>
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed px-2">
                  Hemos recibido tu solicitud de compra. Notificación enviada a <strong className="text-gold-300 font-semibold">{TARGET_EMAIL}</strong>. El vendedor te contactará a la brevedad al número <strong className="text-emerald-400">{customer.phone}</strong> para enviarte el CBU / Alias y coordinar el envío.
                </p>
              </div>

              {/* DETAILS CARD FOR SELLER & BUYER */}
              <div className="p-4 rounded-2xl bg-dark-950 border border-gold-500/30 text-left text-xs space-y-2">
                <p className="text-gold-400 font-bold flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Resumen de la Solicitud:
                </p>
                <p className="text-slate-300">• <strong>Comprador:</strong> {customer.fullName}</p>
                <p className="text-slate-300">• <strong>WhatsApp:</strong> {customer.phone}</p>
                <p className="text-slate-300">• <strong>Destino:</strong> {customer.city}, {customer.address}</p>
                <p className="text-slate-300">• <strong>Monto Total a Transferir:</strong> <span className="text-gold-400 font-bold">{formatPrice(totalPrice)}</span></p>
                <div className="pt-2 border-t border-slate-900 text-[11px] text-emerald-400 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> Email enviado a {TARGET_EMAIL}
                </div>
              </div>

              {/* OPTIONAL DIRECT WHATSAPP ACTION BUTTON */}
              <div className="space-y-2 pt-2">
                <a
                  href={activeWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-700 text-white font-extrabold text-xs hover:shadow-emerald-glow transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>Notificar al Vendedor por WhatsApp (+54 9 11 2716-1063)</span>
                </a>
              </div>

              <button
                onClick={() => {
                  onClearCart();
                  setCheckoutStep('cart');
                  onClose();
                }}
                className="w-full py-3 rounded-2xl bg-dark-950 border border-slate-800 text-slate-400 font-medium text-xs hover:text-white transition-colors"
              >
                Volver a la Tienda
              </button>
            </div>
          ) : checkoutStep === 'cart' ? (
            /* CART STEP */
            <>
              <div className="flex-1 overflow-y-auto py-4 space-y-4 my-2">
                {items.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
                    <p className="text-slate-400 text-sm">Tu carrito de fragancias está vacío.</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={`${item.perfume.id}-${item.selectedMl}`}
                      className="p-3.5 rounded-2xl glass-card border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <img
                        src={item.perfume.image}
                        alt={item.perfume.name}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-800"
                      />

                      <div className="flex-1">
                        <h4 className="font-serif font-bold text-slate-100 text-sm line-clamp-1">
                          {item.perfume.name}
                        </h4>
                        <p className="text-[11px] text-slate-400">{item.perfume.brand} &bull; {item.selectedMl}ml</p>
                        <span className="text-xs font-bold text-gold-400">
                          {formatPrice(item.perfume.price * item.quantity)}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 bg-dark-950 px-2 py-1 rounded-lg border border-slate-800">
                        <button
                          onClick={() => onUpdateQuantity(item.perfume.id, item.selectedMl, -1)}
                          className="text-slate-400 hover:text-white px-1 text-sm font-bold"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-slate-200 px-1">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.perfume.id, item.selectedMl, 1)}
                          className="text-slate-400 hover:text-white px-1 text-sm font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.perfume.id, item.selectedMl)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {items.length > 0 && (
                <div className="border-t border-slate-800 pt-4 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Total del Pedido:</span>
                    <span className="font-serif font-extrabold text-2xl text-gold-400">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setErrors({});
                      setCheckoutStep('details');
                    }}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-dark-950 font-bold text-sm hover:shadow-gold-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Completar Datos y Realizar Pedido</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                    <PhoneCall className="w-3.5 h-3.5 text-gold-400" />
                    <span>El vendedor te contactará para coordinar el pago por CBU / Alias</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* DETAILS & CUSTOMER CONTACT FORM */
            <form onSubmit={handleCheckout} noValidate className="flex-1 flex flex-col justify-between pt-4 space-y-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-base text-slate-100">Datos del Comprador</h4>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="text-xs text-gold-400 hover:underline"
                  >
                    &larr; Volver al carrito
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Full Name */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Nombre y Apellido Completo *</label>
                    <input
                      type="text"
                      placeholder="Ej: Sofía Benítez"
                      value={customer.fullName}
                      onChange={(e) => {
                        setCustomer({ ...customer, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: '' });
                      }}
                      className={`w-full p-2.5 rounded-xl bg-dark-950 border text-slate-200 focus:outline-none transition-colors ${
                        errors.fullName ? 'border-red-500 focus:border-red-400' : 'border-slate-800 focus:border-gold-500'
                      }`}
                    />
                    {errors.fullName && (
                      <span className="text-[11px] text-red-400 flex items-center gap-1 mt-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> {errors.fullName}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Phone */}
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Teléfono / WhatsApp *</label>
                      <input
                        type="tel"
                        placeholder="Ej: +54 9 11..."
                        value={customer.phone}
                        onChange={(e) => {
                          setCustomer({ ...customer, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: '' });
                        }}
                        className={`w-full p-2.5 rounded-xl bg-dark-950 border text-slate-200 focus:outline-none transition-colors ${
                          errors.phone ? 'border-red-500 focus:border-red-400' : 'border-slate-800 focus:border-gold-500'
                        }`}
                      />
                      {errors.phone && (
                        <span className="text-[10px] text-red-400 flex items-center gap-1 mt-1 font-medium">
                          <AlertCircle className="w-3 h-3" /> {errors.phone}
                        </span>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Email / Gmail (Opcional)</label>
                      <input
                        type="email"
                        placeholder="cliente@gmail.com"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-dark-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* City */}
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Ciudad *</label>
                      <input
                        type="text"
                        placeholder="Buenos Aires"
                        value={customer.city}
                        onChange={(e) => {
                          setCustomer({ ...customer, city: e.target.value });
                          if (errors.city) setErrors({ ...errors, city: '' });
                        }}
                        className={`w-full p-2.5 rounded-xl bg-dark-950 border text-slate-200 focus:outline-none transition-colors ${
                          errors.city ? 'border-red-500 focus:border-red-400' : 'border-slate-800 focus:border-gold-500'
                        }`}
                      />
                      {errors.city && (
                        <span className="text-[10px] text-red-400 flex items-center gap-1 mt-1 font-medium">
                          <AlertCircle className="w-3 h-3" /> {errors.city}
                        </span>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Dirección de Entrega *</label>
                      <input
                        type="text"
                        placeholder="Av. Alvear 1850 4B"
                        value={customer.address}
                        onChange={(e) => {
                          setCustomer({ ...customer, address: e.target.value });
                          if (errors.address) setErrors({ ...errors, address: '' });
                        }}
                        className={`w-full p-2.5 rounded-xl bg-dark-950 border text-slate-200 focus:outline-none transition-colors ${
                          errors.address ? 'border-red-500 focus:border-red-400' : 'border-slate-800 focus:border-gold-500'
                        }`}
                      />
                      {errors.address && (
                        <span className="text-[10px] text-red-400 flex items-center gap-1 mt-1 font-medium">
                          <AlertCircle className="w-3 h-3" /> {errors.address}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Seller Contact Info Banner */}
                  <div className="pt-2">
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-gold-950/40 via-dark-950 to-gold-950/40 border border-gold-500/30 flex items-center gap-3 text-gold-200">
                      <div className="p-2 rounded-lg bg-gold-500/20 text-gold-400 border border-gold-500/30">
                        <PhoneCall className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-xs block text-slate-100">Notificación Directa a {TARGET_EMAIL}</span>
                        <span className="text-[10px] text-slate-300">Te contactaremos para enviarte el CBU / Alias / Mercado Pago y coordinar el envío.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-dark-950 font-extrabold text-sm hover:shadow-gold-glow transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  {isProcessing ? (
                    <span>Enviando Pedido y Notificando por Mail...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Confirmar Pedido ({formatPrice(totalPrice)})</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Se enviará un mail instantáneo a {TARGET_EMAIL}</span>
                </div>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
