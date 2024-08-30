import { Magasin} from 'src/types/Magasin';
import { Produit} from 'src/types/Produit';
import { Inventaire} from 'src/types/Inventaire';

export const magasins: Magasin[] = [
  { id: '1', nom: 'Magasin Centre-Ville', adresse: '123 Rue Principale, 75001 Paris' },
  { id: '2', nom: 'Magasin Banlieue Est', adresse: '456 Avenue des Fleurs, 93100 Montreuil' },
  { id: '3', nom: 'Magasin Quartier Sud', adresse: '789 Boulevard du Soleil, 13001 Marseille' },
  { id: '4', nom: 'Magasin Zone Commerciale', adresse: '101 Rue du Commerce, 69001 Lyon' },
];

export const produits: Produit[] = [
  { id: '1', nom: 'Smartphone XYZ', prix: 599.99 },
  { id: '2', nom: 'Ordinateur Portable ABC', prix: 899.99 },
  { id: '3', nom: 'Tablette 123', prix: 299.99 },
  { id: '4', nom: 'Casque Audio Premium', prix: 149.99 },
  { id: '5', nom: 'Enceinte Bluetooth', prix: 79.99 },
  { id: '6', nom: 'Montre Connectée', prix: 199.99 },
  { id: '7', nom: 'Caméra de Surveillance', prix: 129.99 },
  { id: '8', nom: 'Imprimante Multifonction', prix: 159.99 },
  { id: '9', nom: 'Clé USB 128Go', prix: 29.99 },
  { id: '10', nom: 'Batterie Externe', prix: 39.99 },
];

const generateRandomStock = (): Record<string, number> => {
  return magasins.reduce((acc, magasin) => {
    acc[magasin.id] = Math.floor(Math.random() * 100);
    return acc;
  }, {} as Record<string, number>);
};

export const inventaires: Inventaire[] = Array.from({ length: 50 }, (_, index) => ({
  id: (index + 1).toString(),
  date: new Date(2024, 0, index + 1).toISOString().split('T')[0],
  produitId: produits[Math.floor(Math.random() * produits.length)].id,
  stock: generateRandomStock(),
}));
