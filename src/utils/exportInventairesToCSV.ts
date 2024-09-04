import { Inventaire } from 'src/types/Inventaire'
import { Produit } from 'src/types/Produit'
import { Magasin } from 'src/types/Magasin'

export const exportInventairesToCSV = (inventaires: Inventaire[], produits: Produit[], magasins: Magasin[]) => {
  // Fonction pour obtenir le nom du produit
  const getProductName = (productId: string) => {
    const product = produits.find((p) => p.id === productId)
    return product ? product.nom : 'Produit inconnu'
  }

  // Fonction pour obtenir le stock sous forme de chaîne
  const getStockString = (stock: Record<string, number>) => {
    return Object.entries(stock)
      .map(([magasinId, quantite]) => {
        const magasin = magasins.find((m) => m.id === magasinId)
        return `${magasin ? magasin.nom : 'Magasin inconnu'}: ${quantite}`
      })
      .join('; ')
  }

  // Création de l'en-tête CSV
  const headers = ['ID', 'Date', 'Produit', 'Stock par magasin']

  // Création des lignes de données
  const csvData = inventaires.map((inv) => [inv.id, inv.date, getProductName(inv.produitId), getStockString(inv.stock)])

  // Combinaison de l'en-tête et des données
  const csvContent = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n')

  // Création et téléchargement du fichier CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'inventaires.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
