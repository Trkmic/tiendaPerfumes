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

    // Mapear respuesta de Supabase a interfaz Perfume
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
