export type PerfumeCategory = 'arabe' | 'disenador' | 'nicho';

export type PerfumeGender = 'hombre' | 'mujer' | 'unisex';

export interface OlfactoryPyramid {
  topNotes: string[];    // Notas de Salida
  heartNotes: string[];  // Notas de Corazón
  baseNotes: string[];   // Notas de Fondo
}

export interface Perfume {
  id: string;
  name: string;
  brand: string;
  category: PerfumeCategory;
  gender: PerfumeGender;
  price: number;
  originalPrice?: number;
  mlOptions: number[];   // p.ej. [50, 100]
  selectedMl?: number;
  image: string;
  description: string;
  pyramid: OlfactoryPyramid;
  accords: string[];     // p.ej. ["Oud", "Vainilla", "Ámbar", "Especias"]
  longevity: string;     // p.ej. "Más de 10-12 Horas"
  projection: string;    // p.ej. "Enorme / Modo Bestia"
  isBestseller?: boolean;
  isNew?: boolean;
  stock: number;
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  perfume: Perfume;
  selectedMl: number;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  paymentMethod: 'mercado_pago' | 'whatsapp_direct' | 'transferencia';
  notes?: string;
}

export interface AISommelierQuiz {
  occasion: 'diario' | 'noche' | 'cita' | 'fiesta' | 'oficina';
  season: 'invierno' | 'verano' | 'primavera' | 'otono' | 'todo_ano';
  preferredVibe: 'amaderado_oriental' | 'dulce_gourmand' | 'fresco_citrico' | 'especiado_misterioso' | 'floral_elegante';
  budgetRange: 'economico' | 'medio' | 'lujo';
}

export interface AISommelierRecommendation {
  perfume: Perfume;
  matchScore: number;
  whyItMatches: string;
  bestOccasionTip: string;
}

export interface N8nWebhookPayload {
  eventType: 'new_order' | 'ai_recommendation_lead' | 'contact_inquiry';
  orderId?: string;
  customer: CustomerDetails;
  items?: {
    name: string;
    brand: string;
    ml: number;
    qty: number;
    price: number;
  }[];
  totalPrice?: number;
  timestamp: string;
  notes?: string;
}
