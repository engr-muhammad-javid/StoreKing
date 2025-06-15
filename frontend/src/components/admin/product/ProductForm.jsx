import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchCategories } from '../../../store/slices/categorySlice';
import { fetchBrands } from '../../../store/slices/brandSlice';
import { fetchUnits } from '../../../store/slices/unitSlice';
import { fetchTaxes } from '../../../store/slices/taxSlice';
import ModalWrapper from '../../common/ModalWrapper';
import TextInput from '../../common/TextInput';
import NumberInput from '../../common/NumberInput';
import SelectInput from '../../common/SelectInput';
import Textarea from '../../common/Textarea';
import SwitchToggle from '../../common/SwitchToggle';
import { FaSave, IoClose } from 'react-icons/io5';
import { ClipLoader } from 'react-spinners';

const ProductForm = ({ isOpen, onClose, onSubmit, initialData = {}, mode = 'add' }) => {
  const initialFormData = {
    sku: '',
    name: '',
    slug: '',
    image: '',
    price: '',
    salePrice: '',
    weight: '',
    tags: '',
    category_id: '',
    tax_id: '',
    brand_id: '',
    unit_id: '',
    barcode: '',
    description: '',
    can_purchasable: false,
    show_stock_out: false,
    refundable: false,
    file_attachment: false,
    isActive: true,
    sell_by_fraction: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { categories, loading: categoriesLoading } = useSelector((state) => state.productCategory);
  const { brands, loading: brandsLoading } = useSelector((state) => state.productBrand);
  const { units, loading: unitsLoading } = useSelector((state) => state.unit);
  const { taxes, loading: taxesLoading } = useSelector((state) => state.tax);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
    dispatch(fetchUnits());
    dispatch(fetchTaxes());
  }, [dispatch]);

  useEffect(() => {
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
      can_purchasable = false,
      show_stock_out = false,
      refundable = false,
      file_attachment = false,
      unit_id = '',
      weight = '',
      tags = '',
      sell_by_fraction = false,
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
    setErrors({});
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.sku) newErrors.sku = 'SKU is required';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.price || Number(formData.price) < 0) newErrors.price = 'Buying Price must be non-negative';
    if (!formData.salePrice || Number(formData.salePrice) < 0) newErrors.salePrice = 'Selling Price must be non-negative';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.tax_id) newErrors.tax_id = 'Tax is required';
    if (!formData.brand_id) newErrors.brand_id = 'Brand is required';
    if (!formData.unit_id) newErrors.unit_id = 'Unit is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        Object.values(validationErrors).forEach((err) => toast.error(err));
        return;
      }

      setIsSubmitting(true);
      try {
        const result = await onSubmit(formData);
        if (result?.meta?.requestStatus === 'rejected') {
          throw new Error(result.payload?.message || 'Submission failed');
        }
        setIsSubmitting(false);
        onClose();
      } catch (error) {
        setIsSubmitting(false);
        toast.error(error.message);
      }
    },
    [formData, onSubmit, onClose]
  );

  const handleClose = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  }, [onClose]);

  const inputFields = [
    { label: 'SKU *', type: 'text', key: 'sku', required: true, colSpan: 2 },
    { label: 'Name *', type: 'text', key: 'name', required: true, colSpan: 2 },
    { label: 'URL Key', type: 'text', key: 'slug', colSpan: 1 },
    { label: 'Image', type: 'text', key: 'image', colSpan: 1 },
    { label: 'Buying Price *', type: 'number', key: 'price', required: true, colSpan: 2 },
    { label: 'Selling Price *', type: 'number', key: 'salePrice', required: true, colSpan: 2 },
    { label: 'Weight', type: 'number', key: 'weight', colSpan: 1 },
    { label: 'Tags', type: 'text', key: 'tags', placeholder: 'e.g., electronics, gadgets', colSpan: 1 },
  ];

  const selectFields = [
    { label: 'Category *', key: 'category_id', options: categories, required: true, placeholder: 'Select Category', colSpan: 1 },
    { label: 'Tax *', key: 'tax_id', options: taxes, required: true, placeholder: 'Select Tax', colSpan: 1 },
    { label: 'Brand *', key: 'brand_id', options: brands, required: true, placeholder: 'Select Brand', colSpan: 1 },
    { label: 'Unit *', key: 'unit_id', options: units, required: true, placeholder: 'Select Unit', colSpan: 1 },
    {
      label: 'Barcode',
      key: 'barcode',
      options: [
        { value: 'EAN-13', label: 'EAN-13' },
        { value: 'UPC', label: 'UPC' },
      ],
      placeholder: 'Select Barcode',
      colSpan: 1,
    },
  ];

  const toggleFields = [
    { key: 'can_purchasable', label: 'Can Purchasable', yesLabel: 'Yes', noLabel: 'No', colSpan: 1 },
    { key: 'show_stock_out', label: 'Show Stock Out', yesLabel: 'Enabled', noLabel: 'Disabled', colSpan: 1 },
    { key: 'refundable', label: 'Refundable', yesLabel: 'Yes', noLabel: 'No', colSpan: 1 },
    { key: 'file_attachment', label: 'File Attachment', yesLabel: 'Yes', noLabel: 'No', colSpan: 1 },
    { key: 'isActive', label: 'Status', yesLabel: 'Active', noLabel: 'Inactive', colSpan: 1 },
    { key: 'sell_by_fraction', label: 'Sell by Fraction', yesLabel: 'Yes', noLabel: 'No', colSpan: 1 },
  ];

  if (!isOpen) return null;

  if (categoriesLoading || brandsLoading || unitsLoading || taxesLoading) {
    return (
      <ModalWrapper isOpen={isOpen} onClose={handleClose} title="Loading">
        <div className="flex items-center justify-center py-4">
          <ClipLoader color="#007bff" size={30} />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper isOpen={isOpen} onClose={handleClose} title={`${mode === 'edit' ? 'Edit' : 'Add'} Product`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {inputFields.map((field) => (
            <div key={field.key} className={`col-span-${field.colSpan}`}>
              {field.type === 'number' ? (
                <NumberInput
                  label={field.label}
                  name={field.key}
                  value={formData[field.key] === '' ? '' : Number(formData[field.key])}
                  onChange={handleChange}
                  required={field.required}
                  placeholder={field.placeholder}
                  error={errors[field.key]}
                  aria-describedby={errors[field.key] ? `${field.key}-error` : undefined}
                />
              ) : (
                <TextInput
                  label={field.label}
                  name={field.key}
                  value={formData[field.key] || ''}
                  onChange={handleChange}
                  required={field.required}
                  placeholder={field.placeholder}
                  error={errors[field.key]}
                  aria-describedby={errors[field.key] ? `${field.key}-error` : undefined}
                />
              )}
              {errors[field.key] && (
                <p id={`${field.key}-error`} className="text-red-500 text-xs mt-1">
                  {errors[field.key]}
                </p>
              )}
            </div>
          ))}

          {selectFields.map((field) => (
            <div key={field.key} className={`col-span-${field.colSpan}`}>
              <SelectInput
                label={field.label}
                name={field.key}
                value={formData[field.key] || ''}
                onChange={handleChange}
                options={field.options.map((opt) => ({
                  label: opt.name || opt.label,
                  value: field.key === 'barcode' ? opt.value : opt._id,
                }))}
                required={field.required}
                placeholder={field.placeholder}
                error={errors[field.key]}
                aria-describedby={errors[field.key] ? `${field.key}-error` : undefined}
              />
              {errors[field.key] && (
                <p id={`${field.key}-error`} className="text-red-500 text-xs mt-1">
                  {errors[field.key]}
                </p>
              )}
            </div>
          ))}

          {toggleFields.map((field) => (
            <div key={field.key} className={`col-span-${field.colSpan}`}>
              <SwitchToggle
                label={field.label}
                name={field.key}
                checked={!!formData[field.key]}
                onChange={handleChange}
                yesLabel={field.yesLabel}
                noLabel={field.noLabel}
                error={errors[field.key]}
                aria-describedby={errors[field.key] ? `${field.key}-error` : undefined}
              />
              {errors[field.key] && (
                <p id={`${field.key}-error`} className="text-red-500 text-xs mt-1">
                  {errors[field.key]}
                </p>
              )}
            </div>
          ))}

          <div className="col-span-3">
            <Textarea
              label="Description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              error={errors.description}
              aria-describedby={errors.description ? 'description-error' : undefined}
            />
            {errors.description && (
              <p id="description-error" className="text-red-500 text-xs mt-1">
                {errors.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
            disabled={isSubmitting}
          >
            <IoClose className="inline mr-1" />
            Close
          </button>
          <button
            type="submit"
            disabled={isSubmitting || Object.keys(errors).length > 0}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? (
              <ClipLoader color="#fff" size={16} className="mr-1" />
            ) : (
              <FaSave className="inline mr-1" />
            )}
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default ProductForm;