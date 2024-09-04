import React, { useState } from 'react'
import { Magasin } from 'src/types/Magasin'
import { Produit } from 'src/types/Produit'
import { Inventaire } from 'src/types/Inventaire'
import { useTranslation } from 'react-i18next'

interface InventaireListProps {
  inventaires: Inventaire[]
  produits: Produit[]
  magasins: Magasin[]
  onEdit: (inventaire: Inventaire) => void
}

const InventaireList: React.FC<InventaireListProps> = ({ inventaires, produits, magasins, onEdit }) => {
  const [expandedInventaire, setExpandedInventaire] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedInventaire(expandedInventaire === id ? null : id)
  }

  const { t } = useTranslation()

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      <h2 className="bg-gray-100 p-4 text-2xl font-bold text-gray-800">{t('inventory_list')}</h2>
      {inventaires.length === 0 ? (
        <p className="p-4 text-gray-600">{t('no_stock')}</p>
      ) : (
        <div>
          {inventaires.map((inventaire) => (
            <div key={inventaire.id} className="border-b">
              <div
                className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50"
                onClick={() => toggleExpand(inventaire.id)}
              >
                <div className="flex-grow">
                  <span className="font-medium text-gray-800">
                    {produits.find((p) => p.id === inventaire.produitId)?.nom}
                  </span>
                  <span className="ml-4 text-gray-600">{inventaire.date}</span>
                </div>
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(inventaire)
                    }}
                    className="mr-2 rounded bg-blue-100 px-2 py-1 text-blue-700 hover:bg-blue-200"
                  >
                    {t('update')}
                  </button>
                </div>
              </div>
              {expandedInventaire === inventaire.id && (
                <div className="bg-gray-50 p-4">
                  <h3 className="mb-2 font-medium text-gray-700">{t('stock_by_store')}</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {magasins.map((magasin) => (
                      <div key={magasin.id} className="rounded bg-white p-2 shadow-sm">
                        <span className="font-medium text-gray-700">{magasin.nom}:</span>
                        <span className="ml-2 text-gray-800">{inventaire.stock[magasin.id] || '-'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default InventaireList
