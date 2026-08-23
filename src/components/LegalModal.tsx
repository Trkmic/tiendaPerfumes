import React from 'react';
import { X, ShieldCheck, FileText, Lock } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-3xl glass-panel border border-gold-500/40 rounded-3xl overflow-hidden shadow-2xl bg-dark-900/95 p-6 sm:p-8 space-y-6 my-auto max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gold-500/20 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-gold-600 via-gold-400 to-emerald-800 text-dark-950 shadow-gold-glow">
              {type === 'terms' ? <FileText className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-serif font-extrabold text-xl text-slate-100 flex items-center gap-2">
                {type === 'terms' ? 'Términos y Condiciones de Uso y Venta' : 'Política de Privacidad y Protección de Datos'}
              </h3>
              <p className="text-xs text-slate-400">LuxeOud & Co. &bull; Normativa Vigente de Comercio Electrónico (Ley N° 24.240 y Ley N° 25.326)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white bg-dark-950 border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 text-xs text-slate-300 font-light leading-relaxed">
          
          {type === 'terms' ? (
            <>
              {/* TERMS & CONDITIONS CONTENT */}
              <section className="space-y-2">
                <h4 className="text-sm font-bold text-gold-400 uppercase tracking-wider">1. Aspectos Generales e Identificación del Titular</h4>
                <p>
                  El presente documento establece los Términos y Condiciones que rigen el acceso, navegación y compras realizadas a través del sitio web oficial de <strong>LuxeOud & Co.</strong>. El uso de este sitio web implica la aceptación plena e incondicional de todas y cada una de las disposiciones incluidas en este acuerdo legal.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-gold-400 uppercase tracking-wider">2. Garantía de Autenticidad y Calidad 100% Original</h4>
                <p>
                  LuxeOud & Co. garantiza solemnemente que el 100% de las fragancias comercializadas (tanto perfumería árabe de nicho como marcas internacionales de diseñador) son productos estrictamente <strong>originales, auténticos y cerrados en su empaque oficial de fábrica</strong>. No comercializamos réplicas, imitaciones ni productos adulterados.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-gold-400 uppercase tracking-wider">3. Precios, Moneda y Medios de Pago</h4>
                <p>
                  Todos los precios publicados en el sitio están expresados en <strong>Pesos Argentinos (ARS)</strong> e incluyen los impuestos aplicables. LuxeOud & Co. se reserva el derecho de modificar los precios sin previo aviso. Los pagos se procesan de manera automática y encriptada a través de la pasarela segura <strong>Mercado Pago</strong>, admitiendo tarjetas de crédito, débito y dinero en cuenta.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-gold-400 uppercase tracking-wider">4. Envíos y Logística de Entrega</h4>
                <p>
                  Realizamos envíos a todo el territorio nacional mediante operadores logísticos certificados. Los plazos de despacho estándar oscilan entre 24 a 72 horas hábiles a partir de la confirmación del pago. Cada pedido incluye embalaje de alta seguridad antichoque y código de seguimiento en tiempo real.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-gold-400 uppercase tracking-wider">5. Derecho de Arrepentimiento, Cambios y Devoluciones (Ley N° 24.240)</h4>
                <p>
                  En conformidad con el Artículo 34 de la Ley N° 24.240 de Defensa del Consumidor de la República Argentina, el comprador dispone de un plazo de <strong>diez (10) días corridos</strong> contados a partir de la recepción del producto para ejercer el derecho de arrepentimiento. Para que la devolución sea procedente, el producto debe encontrarse en su empaque original, con el celofán de protección sin abrir y en perfecto estado. Por razones de higiene y seguridad biológica, no se aceptan devoluciones de frascos que hayan sido abiertos o atomizados.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-gold-400 uppercase tracking-wider">6. Limitación de Responsabilidad y Jurisdicción</h4>
                <p>
                  LuxeOud & Co. no será responsable por demoras imputables a caso fortuito, fuerza mayor o inconsistencias en los datos consignados por el cliente al momento del checkout. Para cualquier controversia legal derivada del uso de este sitio, las partes se someten a la jurisdicción de los Tribunales Ordinarios en lo Comercial de la Ciudad Autónoma de Buenos Aires.
                </p>
              </section>
            </>
          ) : (
            <>
              {/* PRIVACY POLICY CONTENT */}
              <section className="space-y-2">
                <h4 className="text-sm font-bold text-gold-400 uppercase tracking-wider">1. Compromiso de Confidencialidad y Cumplimiento de Ley N° 25.326</h4>
                <p>
                  En <strong>LuxeOud & Co.</strong> valoramos y respetamos la privacidad de nuestros clientes. La presente Política de Privacidad describe el modo en que recopilamos, utilizamos, almacenamos y protegemos sus datos personales conforme a las exigencias de la <strong>Ley Nacional N° 25.326 de Protección de Datos Personales</strong> de la República Argentina.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-gold-400 uppercase tracking-wider">2. Información Recopilada</h4>
                <p>
                  Únicamente recopilamos los datos personales indispensables para llevar a cabo la venta y entrega de nuestros productos:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li>Nombre completo y DNI para facturación y despacho.</li>
                  <li>Número de teléfono / WhatsApp para notificaciones de envío.</li>
                  <li>Dirección de correo electrónico (Gmail/Email) para envío de comprobantes de pago.</li>
                  <li>Dirección física completa y ciudad para la logística de entrega.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-gold-400 uppercase tracking-wider">3. Seguridad del Procesamiento de Pagos</h4>
                <p>
                  LuxeOud & Co. <strong>nunca almacena ni tiene acceso a los datos de sus tarjetas de crédito o débito</strong>. Todas las transacciones financieras son procesadas directamente en los servidores seguros y encriptados con cifrado SSL de 256 bits de <strong>Mercado Pago</strong>.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-gold-400 uppercase tracking-wider">4. No Transferencia a Terceros</h4>
                <p>
                  Bajo ninguna circunstancia vendemos, alquilamos, cedemos ni compartimos sus datos personales con terceras partes con fines comerciales o publicitarios. Los datos son compartidos únicamente con las empresas de transporte postal estrictamente para la entrega física de su pedido.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-gold-400 uppercase tracking-wider">5. Derechos ARCO (Acceso, Rectificación, Actualización y Supresión)</h4>
                <p>
                  El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis meses. Asimismo, podrá solicitar en cualquier momento la actualización, rectificación o eliminación total de sus datos de nuestras bases de datos comunicándose a través de nuestros canales oficiales de contacto.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-gold-400 uppercase tracking-wider">6. Uso de Cookies Técnicas</h4>
                <p>
                  Utilizamos cookies estrictamente necesarias para recordar los productos seleccionados en su carrito de compras y garantizar una experiencia de navegación fluida y ágil.
                </p>
              </section>
            </>
          )}

        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Documento Legal Oficial Registrado - LuxeOud & Co.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gold-500 text-dark-950 font-bold text-xs hover:bg-gold-400 transition-colors shadow-gold-glow"
          >
            Entendido y Aceptar
          </button>
        </div>

      </div>
    </div>
  );
};
