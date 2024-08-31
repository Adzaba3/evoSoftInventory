import React, { useState } from 'react';
import { Magasin} from 'src/types/Magasin';
import { Produit} from 'src/types/Produit';
import { Inventaire} from 'src/types/Inventaire';



interface InventaireListProps {
    inventaires: Inventaire[];
    produits: Produit[];
    magasins: Magasin[];
    onEdit: (inventaire: Inventaire) => void;
  }
  
  const InventaireList: React.FC<InventaireListProps> = ({ inventaires, produits, magasins, onEdit}) => {
    const [expandedInventaire, setExpandedInventaire] = useState<string | null>(null);
  
    const toggleExpand = (id: string) => {
      setExpandedInventaire(expandedInventaire === id ? null : id);
    };
  
    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <h2 className="text-2xl font-bold p-4 bg-gray-100 text-gray-800">Liste des inventaires</h2>
        {inventaires.length === 0 ? (
          <p className="p-4 text-gray-600">Aucun inventaire saisi.</p>
        ) : (
          <div>
            {inventaires.map((inventaire) => (
              <div key={inventaire.id} className="border-b last:border-b-0">
                <div 
                  className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
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
                        e.stopPropagation();
                        onEdit(inventaire);
                      }}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 mr-2"
                    >
                      Modifier
                    </button>

                  </div>
                </div>
                {expandedInventaire === inventaire.id && (
                  <div className="p-4 bg-gray-50">
                    <h3 className="font-medium text-gray-700 mb-2">Stocks par magasin:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {magasins.map((magasin) => (
                        <div key={magasin.id} className="bg-white p-2 rounded shadow-sm">
                          <span className="font-medium text-gray-700">{magasin.nom}:</span>
                          <span className="ml-2 text-gray-800">
                            {inventaire.stock[magasin.id] || '-'}
                          </span>
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
    );
  };
  
  export default InventaireList;

  