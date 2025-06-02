import React, { useEffect, useState, useCallback } from 'react';
import { IoClose } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../../store/slices/categorySlice';
import { fetchBrands } from '../../../store/slices/brandSlice';
import { fetchUnits } from '../../../store/slices/unitSlice';
import { fetchTaxes } from '../../../store/slices/taxSlice';

const Form = ({ isOpen, onClose, onSubmit, initialData = {}, mode = 'add' }) => {
  const dispatch = useDispatch();
  const { categories, loading: categoriesLoading } = useSelector(state => state.productCategory);
  const { brands, loading: brandsLoading } = useSelector(state => state.productBrand);
  const { units, loading: unitsLoading } = useSelector(state => state.unit);
  const { taxes, loading: taxesLoading } = useSelector(state => state.tax);

  const initialFormData = {
    name: '',
    description: '',
    slug: '',
    image: '',
    isActive: true,
    sku: '',
    category_id: '',
    barcode: '',
    price: '',
    salePrice: '',
    tax_id: '',
    brand_id: '',
    can_purchasable: true,
    show_stock_out: true,
    refundable: true,
    file_attachment: false,
    unit_id: '',
    weight: '',
    tags: '',
    sell_by_fraction: false, // New field
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
    dispatch(fetchUnits());
    dispatch(fetchTaxes());

    const {
      sku = '',
      name = '',
      description = '',
      slug = '',
      image = '',
      isActive = true,
      category_id = '',
      barcode = '',
      price = '',
      salePrice = '',
      tax_id = '',
      brand_id = '',
      can_purchasable = true,
      show_stock_out = true,
      refundable = true,
      file_attachment = false,
      unit_id = '',
      weight = '',
      tags = '',
      sell_by_fraction = false, // New field
    } = initialData || {};

    setFormData({
      sku,
      name,
      description,
      slug,
      image,
      isActive,
      category_id: typeof category_id === 'object' ? category_id?._id || '' : category_id,
      barcode,
      price,
      salePrice,
      tax_id: typeof tax_id === 'object' ? tax_id?._id || '' : tax_id,
      brand_id: typeof brand_id === 'object' ? brand_id?._id || '' : brand_id,
      can_purchasable,
      show_stock_out,
      refundable,
      file_attachment,
      unit_id: typeof unit_id === 'object' ? unit_id?._id || '' : unit_id,
      weight,
      tags,
      sell_by_fraction,
    });
  }, [initialData, dispatch]);

  const handleClose = useCallback(() => {
    setFormData(initialFormData);
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (Number(formData.price) < 0 || Number(formData.salePrice) < 0) {
      alert('Price and Sale Price must be non-negative.');
      return;
    }
    onSubmit(formData);
    handleClose();
  }, [formData, onSubmit, handleClose]);

  if (!isOpen) return null;
  if (categoriesLoading || brandsLoading || unitsLoading || taxesLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div>Loading...</div>
      </div>
    );
  }

  const inputFields = [
    { label: 'SKU *', type: 'text', key: 'sku', required: true },
    { label: 'Name *', type: 'text', key: 'name', required: true },
    { label: 'URL Key', type: 'text', key: 'slug' },
    { label: 'Image', type: 'text', key: 'image' },
    { label: 'Buying Price *', type: 'number', key: 'price', required: true },
    { label: 'Selling Price *', type: 'number', key: 'salePrice', required: true },
    { label: 'Weight', type: 'number', key: 'weight' },
    { label: 'Tags', type: 'text', key: 'tags', placeholder: 'e.g., electronics, gadgets' },
  ];

  const selectFields = [
    { label: 'Category *', key: 'category_id', options: categories, required: true, placeholder: 'Select Category' },
    { label: 'Tax *', key: 'tax_id', options: taxes, required: true, placeholder: 'Select Tax' },
    { label: 'Brand *', key: 'brand_id', options: brands, required: true, placeholder: 'Select Brand' },
    { label: 'Unit *', key: 'unit_id', options: units, required: true, placeholder: 'Select Unit' },
    {
      label: 'Barcode', key: 'barcode', options: [
        { value: 'EAN-13', label: 'EAN-13' },
        { value: 'UPC', label: 'UPC' },
      ], placeholder: 'Select Barcode',
    },
  ];

  const ToggleField = ({ label, name, value, onChange, yesLabel = 'Yes', noLabel = 'No' }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">{label}</label>
      <div className="flex gap-4">
        <label>
          <input type="radio" name={name} checked={value} onChange={() => onChange(true)} /> {yesLabel}
        </label>
        <label>
          <input type="radio" name={name} checked={!value} onChange={() => onChange(false)} /> {noLabel}
        </label>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-5xl h-[90vh] shadow-lg relative overflow-hidden">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">{mode === 'edit' ? 'Edit Product' : 'Add Product'}</h2>
            <button type="button" onClick={handleClose} className="text-gray-500 hover:text-gray-700">
              <IoClose size={24} />
            </button>
          </div>
          <div className="overflow-y-auto px-6 py-4 space-y-6 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inputFields.map(({ label, type, key, required, placeholder }) => (
                <div key={key}>
                  <label htmlFor={key} className="block text-xs font-medium text-gray-600 mb-1 uppercase">
                    {label}
                  </label>
                  <input
                    id={key}
                    type={type}
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required={required}
                    placeholder={placeholder}
                    aria-required={required}
                  />
                </div>
              ))}
              {selectFields.map(({ label, key, options, required, placeholder }) => (
                <div key={key}>
                  <label htmlFor={key} className="block text-xs font-medium text-gray-600 mb-1 uppercase">
                    {label}
                  </label>
                  <select
                    id={key}
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required={required}
                    aria-required={required}
                  >
                    {placeholder && <option value="">{placeholder}</option>}
                    {options.map(opt => (
                      <option key={opt._id || opt.value} value={opt._id || opt.value}>
                        {opt.name || opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-xs font-medium text-gray-600 mb-1 uppercase">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              {[
                { key: 'can_purchasable', label: 'Can Purchasable' },
                { key: 'show_stock_out', label: 'Show Stock Out', yesLabel: 'Enabled', noLabel: 'Disabled' },
                { key: 'refundable', label: 'Refundable' },
                { key: 'file_attachment', label: 'File Attachment' },
                { key: 'isActive', label: 'Status', yesLabel: 'Active', noLabel: 'Inactive' },
                { key: 'sell_by_fraction', label: 'Sell By Fraction' },
              ].map(({ key, label, yesLabel, noLabel }) => (
                <ToggleField
                  key={key}
                  label={label}
                  name={key}
                  value={formData[key]}
                  onChange={(value) => setFormData({ ...formData, [key]: value })}
                  yesLabel={yesLabel}
                  noLabel={noLabel}
                />
              ))}
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              {mode === 'edit' ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;