/**
 * Formatea un número como Pesos Argentinos (ARS)
 * Ejemplo: 68000 -> "$ 68.000"
 */
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);
};
