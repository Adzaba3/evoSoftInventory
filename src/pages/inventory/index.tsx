import React, { useState } from 'react'
import { Inventaire } from 'src/types/Inventaire'
import InventaireModal from 'src/modal/InventoryModal'
import InventoryList from 'src/components/inventory-list'
import Pagination from 'src/components/pagination/'
import { magasins, produits } from 'src/data/staticData'
import useLocalStorageState from 'src/hooks/use-localstorage-state'
import { useTranslation } from 'react-i18next'

const Inventory: React.FC = () => {
  const [inventaires, setInventaires] = useLocalStorageState<Inventaire[]>('inventaires', [])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedInventaire, setSelectedInventaire] = useState<Inventaire | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const inventairesPerPage = 4

  const { t } = useTranslation()

  const handleInventaireSubmit = (newInventaire: Inventaire) => {
    if (selectedInventaire) {
      setInventaires(inventaires.map((inv) => (inv.id === selectedInventaire.id ? newInventaire : inv)))
    } else {
      setInventaires([...inventaires, { ...newInventaire, id: (inventaires.length + 1).toString() }])
    }
    setIsModalOpen(false)
    setSelectedInventaire(null)
  }

  const handleEditInventaire = (inventaire: Inventaire) => {
    setSelectedInventaire(inventaire)
    setIsModalOpen(true)
  }

  const handleDeleteInventaire = (id: string) => {
    setInventaires(inventaires.filter((inv) => inv.id !== id))
  }

  // Get current inventaires
  const indexOfLastInventaire = currentPage * inventairesPerPage
  const indexOfFirstInventaire = indexOfLastInventaire - inventairesPerPage
  const currentInventaires = inventaires.slice(indexOfFirstInventaire, indexOfLastInventaire)

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text py-4 text-4xl font-extrabold text-transparent">
          {t('manage_inventory')}
        </h1>
        <button
          onClick={() => {
            setSelectedInventaire(null)
            setIsModalOpen(true)
          }}
          className="mb-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          {t('add_inventory')}
        </button>
      </div>
      <InventoryList
        inventaires={currentInventaires}
        produits={produits}
        magasins={magasins}
        onEdit={handleEditInventaire}
      />

      <Pagination
        inventairesPerPage={inventairesPerPage}
        totalInventaires={inventaires.length}
        paginate={paginate}
        currentPage={currentPage}
      />

      {isModalOpen && (
        <InventaireModal
          magasins={magasins}
          produits={produits}
          onSubmit={handleInventaireSubmit}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedInventaire(null)
          }}
          inventaire={selectedInventaire}
        />
      )}
    </div>
  )
}

export default Inventory
