import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../../store/slices/modalSlice';
import ProductForm from '../admin/forms/ProductForm';
import CategoryForm from '../admin/forms/CategoryForm';
import BrandForm from '../admin/forms/BrandForm';
import CurrencyForm from '../admin/forms/CurrencyForm';
import UnitForm from '../admin/forms/UnitForm';
import TaxForm from '../admin/forms/TaxForm';
import DeliveryZoneForm from '../admin/forms/DeliveryZoneForm';
import { IoClose } from 'react-icons/io5';

const formComponents = {
  product: ProductForm,
  category: CategoryForm,
  brand:BrandForm,
  currency:CurrencyForm,
  unit: UnitForm,
  tax:TaxForm,
  deliveryZone:DeliveryZoneForm,
};

const CrudModal = () => {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  if (!modal.isOpen || !modal.entity) {
    return null;
  }

  const FormComponent = formComponents[modal.entity];
  if (!FormComponent) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {modal.mode === 'edit' ? `Edit ${modal.entity}` : `Add ${modal.entity}`}
          </h3>
          <button
            onClick={() => {
              dispatch(closeModal());
            }}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <IoClose size={24} />
          </button>
        </div>
        <FormComponent initialData={modal.initialData} mode={modal.mode} />
      </div>
    </div>
  );
};

export default CrudModal;