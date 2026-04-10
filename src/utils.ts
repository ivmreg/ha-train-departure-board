// src/utils.ts
export interface StockInfo {
  category: 'modern' | 'javelin' | 'refurb' | 'older' | 'standard';
  label: string;
}

export function getStockCategory(stock: string | null): StockInfo {
  const s = (stock || '').toLowerCase();
  if (s.includes('city beam') || s.includes('707')) {
    return { category: 'modern', label: 'CITY BEAM' };
  }
  if (s.includes('javelin') || s.includes('395')) {
    return { category: 'javelin', label: 'JAVELIN' };
  }
  if (s.includes('376')) {
    return { category: 'refurb', label: 'REFURB 376' };
  }
  if (s.includes('465') || s.includes('466') || s.includes('networker')) {
    return { category: 'older', label: 'CLASS 465' };
  }
  return { category: 'standard', label: '' };
}
