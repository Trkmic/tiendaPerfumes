import { formatPrice } from '../utils/format';

interface OrderEmailData {
  orderId: string;
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    city: string;
    address: string;
  };
  items: Array<{
    name: string;
    brand: string;
    ml: number;
    qty: number;
    price: number;
  }>;
  totalPrice: number;
}

export const TARGET_EMAIL = 'trkmicignacio@gmail.com';

/**
 * Enviar notificación por correo electrónico directamente a trkmicignacio@gmail.com
 */
export async function sendOrderEmailNotification(data: OrderEmailData): Promise<boolean> {
  const itemsFormatted = data.items
    .map(i => `• ${i.name} (${i.brand} - ${i.ml}ml) x${i.qty} = ${formatPrice(i.price * i.qty)}`)
    .join('\n');

  const payload = {
    _subject: `🛒 Nuevo Pedido #${data.orderId} en LuxeOud - ${data.customer.fullName}`,
    _replyto: data.customer.email || 'noreply@luxeoud.com',
    _template: 'table',
    _captcha: 'false',
    Numero_Orden: data.orderId,
    Nombre_Cliente: data.customer.fullName,
    Telefono_WhatsApp: data.customer.phone,
    Email_Cliente: data.customer.email || 'No proporcionado',
    Ciudad_Entrega: data.customer.city,
    Direccion_Entrega: data.customer.address,
    Productos_Comprados: itemsFormatted,
    Total_a_Cobrar_ARS: formatPrice(data.totalPrice),
    Fecha: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }),
  };

  try {
    console.log(`[Email Dispatch] Enviando notificación de pedido #${data.orderId} a ${TARGET_EMAIL}...`);
    
    const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log('Notificación por email despachada exitosamente a', TARGET_EMAIL);
      return true;
    } else {
      console.warn('FormSubmit devolvió un status no OK:', response.status);
      return false;
    }
  } catch (err) {
    console.error('Error al enviar notificación por email:', err);
    return false;
  }
}
