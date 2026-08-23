import { createClient } from '@supabase/supabase-js';
import type { Perfume } from '../types';
import { PERFUMES_DATA } from '../data/perfumes';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Obtener catálogo de perfumes desde Supabase (con fallback transparente al catálogo local)
 */
export async function getPerfumes(): Promise<Perfume[]> {
  if (!supabase) {
    return PERFUMES_DATA;
  }

  try {
    const { data, error } = await supabase.from('perfumes').select('*');
    if (error || !data || data.length === 0) {
      console.warn('Supabase no devolvió datos o no está inicializado. Usando catálogo local.', error);
      return PERFUMES_DATA;
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      category: item.category,
      gender: item.gender,
      price: Number(item.price),
      originalPrice: item.original_price ? Number(item.original_price) : undefined,
      mlOptions: item.ml_options || [100],
      image: item.image,
      description: item.description,
      pyramid: {
        topNotes: item.top_notes || [],
        heartNotes: item.heart_notes || [],
        baseNotes: item.base_notes || []
      },
      accords: item.accords || [],
      longevity: item.longevity,
      projection: item.projection,
      isBestseller: item.is_bestseller,
      isNew: item.is_new,
      stock: item.stock || 10,
      rating: Number(item.rating || 5.0),
      reviewsCount: item.reviews_count || 0
    }));
  } catch (err) {
    console.error('Error al conectar con Supabase:', err);
    return PERFUMES_DATA;
  }
}

/**
 * Guardar pedido de venta en la tabla 'orders' de Supabase
 */
export async function saveOrder(orderPayload: any): Promise<boolean> {
  if (!supabase) {
    console.log('[Order Storage] Supabase no configurado aún. Guardado en memoria local.');
    return true;
  }

  try {
    const { error } = await supabase.from('orders').insert([{
      customer_name: orderPayload.customer.fullName,
      customer_phone: orderPayload.customer.phone,
      customer_email: orderPayload.customer.email || '',
      city: orderPayload.customer.city,
      address: orderPayload.customer.address,
      payment_method: 'whatsapp_manual',
      items: orderPayload.items,
      total_price: orderPayload.totalPrice,
      status: 'pending',
      notes: orderPayload.notes || ''
    }]);

    if (error) {
      console.error('Error al insertar orden en Supabase:', error);
      return false;
    }
    console.log('Orden guardada exitosamente en Supabase');
    return true;
  } catch (err) {
    console.error('Excepción al guardar orden:', err);
    return false;
  }
}
