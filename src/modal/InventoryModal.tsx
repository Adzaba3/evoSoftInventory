import React, { useState } from 'react'
import { Formik, Form, Field, FieldArray } from 'formik'
import * as Yup from 'yup'
import { Produit } from 'src/types/Produit'
import { Magasin } from 'src/types/Magasin'
import { Inventaire } from 'src/types/Inventaire'
import { useTranslation } from 'react-i18next'

interface InventaireModalProps {
  magasins: Magasin[]
  produits: Produit[]
  onSubmit: (inventaire: Inventaire) => void
  onClose: () => void
  inventaire?: Inventaire | null
}

const InventaireModal: React.FC<InventaireModalProps> = ({ magasins, produits, onSubmit, onClose, inventaire }) => {
  const [selectedMagasins, setSelectedMagasins] = useState<string[]>(inventaire ? Object.keys(inventaire.stock) : [])
  const { t } = useTranslation()

  const InventaireSchema = Yup.object().shape({
    date: Yup.date().required(t('date_required')),
    produitId: Yup.string().required(t('product_required')),
    stocks: Yup.array()
      .of(
        Yup.object().shape({
          magasinId: Yup.string().required(t('store_required')),
          quantite: Yup.number().min(0, t('quantity_check')).required(t('qty_required')),
        }),
      )
      .min(1, t('stock_min')),
  })

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
  }

  return (
    <div className="fixed inset-0 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50">
      <div className="relative top-20 mx-auto w-[32rem] rounded-md border bg-gray-50 p-5 shadow-lg">
        <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">
          {inventaire ? t('update_inventory') : t('add_inventory')}
        </h3>
        <Formik
          initialValues={initialValues}
          validationSchema={InventaireSchema}
          onSubmit={(values) => {
            const stockObject = values.stocks.reduce((acc, { magasinId, quantite }) => {
              acc[magasinId] = quantite
              return acc
            }, {} as Record<string, number>)

            onSubmit({
              id: values.id,
              date: values.date,
              produitId: values.produitId,
              stock: stockObject,
            })
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="date" className="mb-2 block text-gray-700">
                  {t('date')}
                </label>
                <Field name="date" type="date" className="w-full rounded border bg-white p-2 text-gray-800" />
                {errors.date && touched.date && <div className="text-red-600">{errors.date}</div>}
              </div>

              <div className="mb-4">
                <label htmlFor="produitId" className="mb-2 block text-gray-700">
                  {t('product')}
                </label>
                <Field as="select" name="produitId" className="w-full rounded border bg-white p-2 text-gray-800">
                  <option value="">{t('select_product')}</option>
                  {produits.map((produit) => (
                    <option key={produit.id} value={produit.id}>
                      {produit.nom}
                    </option>
                  ))}
                </Field>
                {errors.produitId && touched.produitId && <div className="text-red-600">{errors.produitId}</div>}
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-gray-700">{t('stock')}</label>
                <FieldArray name="stocks">
                  {({ push, remove }) => (
                    <div>
                      {values.stocks.map((_, index) => (
                        <div key={index} className="mb-2 flex items-center">
                          <Field
                            as="select"
                            name={`stocks.${index}.magasinId`}
                            className="mr-2 flex-grow rounded border bg-white p-2 text-gray-800"
                          >
                            <option value="">{t('select_stock')}</option>
                            {magasins
                              .filter(
                                (m) => !selectedMagasins.includes(m.id) || m.id === values.stocks[index].magasinId,
                              )
                              .map((magasin) => (
                                <option key={magasin.id} value={magasin.id}>
                                  {magasin.nom}
                                </option>
                              ))}
                          </Field>
                          <Field
                            name={`stocks.${index}.quantite`}
                            type="number"
                            className="mr-2 w-24 rounded border bg-white p-2 text-gray-800"
                            placeholder={t('quantity')}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedMagasins(
                                selectedMagasins.filter((id) => id !== values.stocks[index].magasinId),
                              )
                              remove(index)
                            }}
                            className="rounded bg-red-100 px-2 py-1 text-red-700 hover:bg-red-200"
                          >
                            {t('delete')}
                          </button>
                        </div>
                      ))}
                      {errors.stocks && typeof errors.stocks === 'string' && (
                        <div className="mb-2 text-red-600">{errors.stocks}</div>
                      )}
                      <button
                        type="button"
                        onClick={() => push({ magasinId: '', quantite: 0 })}
                        className="rounded bg-green-100 px-2 py-1 text-green-700 hover:bg-green-200"
                      >
                        {t('add_stock')}
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-2 rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
                >
                  {t('cancel')}
                </button>
                <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                  {inventaire ? t('update') : t('add')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default InventaireModal
