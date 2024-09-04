import React, { useState } from 'react'
import { Inventaire } from 'src/types/Inventaire'
import InventaireModal from 'src/modal/InventoryModal'
import InventoryList from 'src/components/inventory-list'
import Pagination from 'src/components/pagination/'
import { magasins, produits } from 'src/data/staticData'
import useLocalStorageState from 'src/hooks/use-localstorage-state'
import { exportInventairesToCSV } from 'src/utils/exportInventairesToCSV'
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

  const handleExportCSV = () => {
    exportInventairesToCSV(inventaires, produits, magasins)
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4 flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <h1 className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl md:text-4xl">
          {t('manage_inventory')}
        </h1>
        <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          <button
            onClick={() => {
              setSelectedInventaire(null)
              setIsModalOpen(true)
            }}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            {t('add_inventory')}
          </button>
          <button onClick={handleExportCSV} className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
            {t('export_to_csv')}
          </button>
        </div>
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
