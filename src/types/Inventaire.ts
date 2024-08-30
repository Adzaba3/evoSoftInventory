export interface Inventaire {
    id: string;
    date: string;
    produitId: string;
    stock: Record<string, number>; 
  }