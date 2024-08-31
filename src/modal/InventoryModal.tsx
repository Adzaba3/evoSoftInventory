import React, { useState } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Produit} from 'src/types/Produit';
import { Magasin} from 'src/types/Magasin';
import { Inventaire} from 'src/types/Inventaire';

interface InventaireModalProps {
  magasins: Magasin[];
  produits: Produit[];
  onSubmit: (inventaire: Inventaire) => void;
  onClose: () => void;
  inventaire?: Inventaire | null;
}

const InventaireSchema = Yup.object().shape({
  date: Yup.date().required('La date est requise'),
  produitId: Yup.string().required('Le produit est requis'),
  stocks: Yup.array().of(
    Yup.object().shape({
      magasinId: Yup.string().required('Le magasin est requis'),
      quantite: Yup.number().min(0, 'La quantité doit être positive ou nulle').required('La quantité est requise')
    })
  ).min(1, 'Au moins un stock doit être saisi')
});

const InventaireModal: React.FC<InventaireModalProps> = ({ magasins, produits, onSubmit, onClose, inventaire }) => {
  const [selectedMagasins, setSelectedMagasins] = useState<string[]>(
    inventaire ? Object.keys(inventaire.stock) : []
  );

  const initialValues: Inventaire & { stocks: { magasinId: string; quantite: number }[] } = {
    id: inventaire?.id || '',
    date: inventaire?.date || '',
    produitId: inventaire?.produitId || '',
    stock: inventaire?.stock || {},
    stocks: inventaire
      ? Object.entries(inventaire.stock).map(([magasinId, quantite]) => ({
          magasinId,
          quantite,
        }))
      : [],
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-[32rem] shadow-lg rounded-md bg-gray-50">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          {inventaire ? 'Modifier l\'inventaire' : 'Ajouter un inventaire'}
        </h3>
        <Formik
          initialValues={initialValues}
          validationSchema={InventaireSchema}
          onSubmit={(values) => {
            const stockObject = values.stocks.reduce((acc, { magasinId, quantite }) => {
              acc[magasinId] = quantite;
              return acc;
            }, {} as Record<string, number>);

            onSubmit({
              id: values.id,
              date: values.date,
              produitId: values.produitId,
              stock: stockObject,
            });
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="date" className="block mb-2 text-gray-700">Date</label>
                <Field name="date" type="date" className="w-full p-2 border rounded text-gray-800 bg-white" />
                {errors.date && touched.date && <div className="text-red-600">{errors.date}</div>}
              </div>

              <div className="mb-4">
                <label htmlFor="produitId" className="block mb-2 text-gray-700">Produit</label>
                <Field as="select" name="produitId" className="w-full p-2 border rounded text-gray-800 bg-white">
                  <option value="">Sélectionnez un produit</option>
                  {produits.map((produit) => (
                    <option key={produit.id} value={produit.id}>{produit.nom}</option>
                  ))}
                </Field>
                {errors.produitId && touched.produitId && <div className="text-red-600">{errors.produitId}</div>}
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-gray-700">Magasins et Stocks</label>
                <FieldArray name="stocks">
                  {({ push, remove }) => (
                    <div>
                      {values.stocks.map((_, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <Field
                            as="select"
                            name={`stocks.${index}.magasinId`}
                            className="flex-grow p-2 border rounded text-gray-800 bg-white mr-2"
                          >
                            <option value="">Sélectionnez un magasin</option>
                            {magasins
                              .filter((m) => !selectedMagasins.includes(m.id) || m.id === values.stocks[index].magasinId)
                              .map((magasin) => (
                                <option key={magasin.id} value={magasin.id}>
                                  {magasin.nom}
                                </option>
                              ))}
                          </Field>
                          <Field
                            name={`stocks.${index}.quantite`}
                            type="number"
                            className="w-24 p-2 border rounded text-gray-800 bg-white mr-2"
                            placeholder="Quantité"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedMagasins(selectedMagasins.filter(id => id !== values.stocks[index].magasinId));
                              remove(index);
                            }}
                            className="bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                          >
                            Supprimer
                          </button>
                        </div>
                      ))}
                      {errors.stocks && typeof errors.stocks === 'string' && (
                        <div className="text-red-600 mb-2">{errors.stocks}</div>
                      )}
                      <button
                        type="button"
                        onClick={() => push({ magasinId: '', quantite: 0 })}
                        className="bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                      >
                        Ajouter un magasin
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>

              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 mr-2"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {inventaire ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default InventaireModal;

