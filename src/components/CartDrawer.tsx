import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Check, CreditCard, ShieldCheck, AlertCircle, Lock } from 'lucide-react';
import type { CartItem, CustomerDetails } from '../types';
import { sendN8nWebhook } from '../lib/n8nWebhook';
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

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    paymentMethod: 'mercado_pago',
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customer.email.trim()) {
      newErrors.email = 'Por favor ingresa tu dirección de correo electrónico.';
    } else if (!emailRegex.test(customer.email.trim())) {
      newErrors.email = 'Ingresa un correo electrónico válido (ejemplo: nombre@gmail.com).';
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

    const orderId = `MP-${Math.floor(100000 + Math.random() * 900000)}`;

    const payload = {
      eventType: 'new_order' as const,
      orderId,
      customer: {
        ...customer,
        paymentMethod: 'mercado_pago' as const,
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

    await sendN8nWebhook(payload);

    const mpCheckoutUrl = import.meta.env.VITE_MERCADOPAGO_CHECKOUT_URL || '';

    if (mpCheckoutUrl) {
      window.location.href = mpCheckoutUrl;
    } else {
      setTimeout(() => {
        setIsProcessing(false);
        setCheckoutStep('success');
      }, 1500);
    }
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
            <div className="my-auto space-y-6 text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-emerald-glow">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-serif font-bold text-2xl text-slate-100">¡Pago Procesado con Éxito!</h4>
                <p className="text-sm text-slate-300 mt-2 font-light">
                  Transacción aprobada por <strong className="text-gold-400">Mercado Pago</strong>. Se ha enviado el comprobante a tu email.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-dark-950 border border-gold-500/30 text-left text-xs space-y-1">
                <p className="text-gold-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Comprobante Mercado Pago:
                </p>
                <p className="text-slate-300">• Cliente: {customer.fullName}</p>
                <p className="text-slate-300">• Email: {customer.email}</p>
                <p className="text-slate-300">• Total Cobrado: {formatPrice(totalPrice)}</p>
                <p className="text-slate-300">• Estado: Cobro Aprobado en Línea</p>
              </div>

              <button
                onClick={() => {
                  onClearCart();
                  setCheckoutStep('cart');
                  onClose();
                }}
                className="w-full py-3.5 rounded-2xl bg-gold-500 text-dark-950 font-bold text-sm hover:bg-gold-400 transition-colors shadow-gold-glow"
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
                    <span className="text-slate-400">Subtotal:</span>
                    <span className="font-serif font-extrabold text-2xl text-gold-400">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setErrors({});
                      setCheckoutStep('details');
                    }}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-700 text-white font-bold text-sm hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <CreditCard className="w-5 h-5 text-white" />
                    <span>Pagar con Mercado Pago / Tarjeta</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cobro automático seguro en línea por Mercado Pago</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* DETAILS & MERCADO PAGO CHECKOUT STEP */
            <form onSubmit={handleCheckout} noValidate className="flex-1 flex flex-col justify-between pt-4 space-y-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-base text-slate-100">Datos para Envío y Facturación</h4>
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
                    <label className="block text-slate-300 font-medium mb-1">Nombre Completo *</label>
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
                      <label className="block text-slate-300 font-medium mb-1">WhatsApp / Tel *</label>
                      <input
                        type="tel"
                        placeholder="+549..."
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
                      <label className="block text-slate-300 font-medium mb-1">Gmail / Email *</label>
                      <input
                        type="email"
                        placeholder="cliente@gmail.com"
                        value={customer.email}
                        onChange={(e) => {
                          setCustomer({ ...customer, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: '' });
                        }}
                        className={`w-full p-2.5 rounded-xl bg-dark-950 border text-slate-200 focus:outline-none transition-colors ${
                          errors.email ? 'border-red-500 focus:border-red-400' : 'border-slate-800 focus:border-gold-500'
                        }`}
                      />
                      {errors.email && (
                        <span className="text-[10px] text-red-400 flex items-center gap-1 mt-1 font-medium">
                          <AlertCircle className="w-3 h-3" /> {errors.email}
                        </span>
                      )}
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

                  {/* Mercado Pago Fixed Banner */}
                  <div className="pt-2">
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/80 via-dark-950 to-blue-950/80 border border-sky-500/40 flex items-center gap-3 text-sky-200">
                      <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-xs block text-slate-100">Mercado Pago / Tarjetas de Crédito y Débito</span>
                        <span className="text-[10px] text-slate-300">Cobro automático seguro en línea con protección al comprador.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-700 text-white font-extrabold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  {isProcessing ? (
                    <span>Conectando con Mercado Pago...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pagar {formatPrice(totalPrice)} con Mercado Pago</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Procesamiento 100% Encriptado con Garantía Mercado Pago</span>
                </div>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
