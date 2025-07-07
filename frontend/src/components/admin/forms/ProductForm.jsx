import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { closeModal } from '../../../store/slices/modalSlice';
import { fetchCategories } from '../../../store/slices/categorySlice';
import { fetchBrands } from '../../../store/slices/brandSlice';
import { fetchUnits } from '../../../store/slices/unitSlice';
import { fetchTaxes } from '../../../store/slices/taxSlice';
import { createProduct, updateProduct } from '../../../store/slices/productSlice';
import {
  initializeForm,
  updateFormField,
  setFormErrors,
  setSubmitting,
  resetForm,
} from '../../../store/slices/formSlice';
import { TextInput, NumberInput, SelectInput, Textarea, SwitchToggle } from '../../common';
import { IoClose } from 'react-icons/io5';
import { FaSave } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const ProductForm = ({ initialData = {}, mode = 'add' }) => {
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.form.forms.product || {});

  const categoryState = useSelector((state) => state.category);
  const categories = categoryState?.categories || [];
  const categoriesLoading = categoryState?.loading?.fetch || false;
  
  const brandState = useSelector((state) => state.brand);
  const brands = brandState?.brands || [];
  const brandsLoading = brandState?.loading?.fetch || false;

  const unitState = useSelector((state) => state.unit);
  const units = unitState?.units || [];
  const unitsLoading = unitState?.loading?.fetch || false;

  const taxState = useSelector((state) => state.tax);
  const taxes = taxState?.taxes || [];
  const taxesLoading = taxState?.loading?.fetch || false;


  const [hasSubmitted, setHasSubmitted] = useState(false);
  const submitTimeoutRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
    dispatch(fetchUnits());
    dispatch(fetchTaxes());
    dispatch(
      initializeForm({
        entity: 'product',
        initialData: {
          sku: initialData.sku || '',
          name: initialData.name || '',
          slug: initialData.slug || '',
          image: initialData.image || '',
          price: initialData.price || '',
          salePrice: initialData.salePrice || '',
          weight: initialData.weight || '',
          tags: initialData.tags || '',
          category_id: initialData.category_id?._id || initialData.category_id || '',
          tax_id: initialData.tax_id?._id || initialData.tax_id || '',
          brand_id: initialData.brand_id?._id || initialData.brand_id || '',
          unit_id: initialData.unit_id?._id || initialData.unit_id || '',
          barcode: initialData.barcode || '',
          description: initialData.description || '',
          can_purchasable: initialData.can_purchasable || false,
          show_stock_out: initialData.show_stock_out || false,
          refundable: initialData.refundable || false,
          file_attachment: initialData.file_attachment || false,
          isActive: initialData.isActive !== undefined ? initialData.isActive : true,
          sell_by_fraction: initialData.sell_by_fraction || false,
        },
        mode,
      })
    );
  }, [dispatch, initialData, mode]);

  const validateForm = () => {
    const newErrors = {};
    if (!formState?.formData?.sku) newErrors.sku = 'SKU is required';
    if (!formState?.formData?.name) newErrors.name = 'Name is required';
    if (!formState?.formData?.price || Number(formState.formData.price) < 0)
      newErrors.price = 'Buying Price must be non-negative';
    if (!formState?.formData?.salePrice || Number(formState.formData.salePrice) < 0)
      newErrors.salePrice = 'Selling Price must be non-negative';
    if (!formState?.formData?.category_id) newErrors.category_id = 'Category is required';
    if (!formState?.formData?.tax_id) newErrors.tax_id = 'Tax is required';
    if (!formState?.formData?.brand_id) newErrors.brand_id = 'Brand is required';
    if (!formState?.formData?.unit_id) newErrors.unit_id = 'Unit is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch(
      updateFormField({
        entity: 'product',
        name,
        value: type === 'checkbox' ? checked : value,
      })
    );
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (formState.isSubmitting || hasSubmitted) return;

      if (submitTimeoutRef.current) return;

      submitTimeoutRef.current = setTimeout(() => {
        clearTimeout(submitTimeoutRef.current);
        submitTimeoutRef.current = null;
      }, 500);

      setHasSubmitted(true);

      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        dispatch(setFormErrors({ entity: 'product', errors: validationErrors }));
        Object.entries(validationErrors).forEach(([key, err]) =>
          toast.error(err, { toastId: `validation-error-${key}-${mode}` })
        );
        setHasSubmitted(false);
        return;
      }

      dispatch(setSubmitting({ entity: 'product', isSubmitting: true }));
      try {
        const action =
          mode === 'edit'
            ? updateProduct({ data: formState.formData, id: initialData._id })
            : createProduct(formState.formData);
        const result = await dispatch(action);
        if (result.meta.requestStatus === 'rejected') {
          throw new Error(result.payload || 'Submission failed');
        }
        toast.success(`Product ${mode === 'edit' ? 'updated' : 'added'} successfully!`, {
          toastId: `success-${mode}`,
        });
        dispatch(closeModal());
        dispatch(resetForm({ entity: 'product' }));
      } catch (error) {
         toast.error("Error Occured: "+error);
      } finally {
        dispatch(setSubmitting({ entity: 'product', isSubmitting: false }));
        setHasSubmitted(false);
      }
    },
    [dispatch, formState, mode, initialData, hasSubmitted]
  );

  const handleClose = useCallback(() => {
    dispatch(closeModal());
    dispatch(resetForm({ entity: 'product' }));
  }, [dispatch]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    []
  );

  const inputFields = [
    { label: 'SKU *', type: 'text', key: 'sku', required: true, colSpan: 2 },
    { label: 'Name *', type: 'text', key: 'name', required: true, colSpan: 2 },
    { label: 'URL Key', type: 'text', key: 'slug', colSpan: 2 },
    { label: 'Image', type: 'text', key: 'image', colSpan: 1 },
    { label: 'Buying Price *', type: 'number', key: 'price', required: true, colSpan: 1 },
    { label: 'Selling Price *', type: 'number', key: 'salePrice', required: true, colSpan: 1 },
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
      colSpan: 2,
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

 
  if (categoriesLoading || brandsLoading || unitsLoading || taxesLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <ClipLoader color="#007bff" size={30} />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!categories?.length || !brands?.length || !units?.length || !taxes?.length) {
    return (
      <div className="text-red-500 text-center py-4">
        Error: Unable to load categories, brands, units, or taxes.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" onKeyDown={handleKeyDown}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inputFields.map((field) => (
          <div key={field.key} className={`col-span-${field.colSpan}`}>
            {field.type === 'number' ? (
              <NumberInput
                label={field.label}
                name={field.key}
                value={formState.formData?.[field.key] === '' ? '' : Number(formState.formData?.[field.key])}
                onChange={handleChange}
                required={field.required}
                placeholder={field.placeholder}
                error={formState.errors?.[field.key]}
                aria-describedby={formState.errors?.[field.key] ? `${field.key}-error` : undefined}
              />
            ) : (
              <TextInput
                label={field.label}
                name={field.key}
                value={formState.formData?.[field.key] || ''}
                onChange={handleChange}
                required={field.required}
                placeholder={field.placeholder}
                error={formState.errors?.[field.key]}
                aria-describedby={formState.errors?.[field.key] ? `${field.key}-error` : undefined}
              />
            )}
            {formState.errors?.[field.key] && (
              <p id={`${field.key}-error`} className="text-red-500 text-xs mt-1">
                {formState.errors[field.key]}
              </p>
            )}
          </div>
        ))}

        {selectFields.map((field) => (
          <div key={field.key} className={`col-span-${field.colSpan}`}>
            <SelectInput
              label={field.label}
              name={field.key}
              value={formState.formData?.[field.key] || ''}
              onChange={handleChange}
              options={field.options.map((opt) => ({
                label: opt.name || opt.label,
                value: field.key === 'barcode' ? opt.value : opt._id,
              }))}
              required={field.required}
              placeholder={field.placeholder}
              error={formState.errors?.[field.key]}
              aria-describedby={formState.errors?.[field.key] ? `${field.key}-error` : undefined}
            />
            {formState.errors?.[field.key] && (
              <p id={`${field.key}-error`} className="text-red-500 text-xs mt-1">
                {formState.errors[field.key]}
              </p>
            )}
          </div>
        ))}

        {toggleFields.map((field) => (
          <div key={field.key} className={`col-span-${field.colSpan}`}>
            <SwitchToggle
              label={field.label}
              name={field.key}
              checked={!!formState.formData?.[field.key]}
              onChange={handleChange}
              yesLabel={field.yesLabel}
              noLabel={field.noLabel}
              error={formState.errors?.[field.key]}
              aria-describedby={formState.errors?.[field.key] ? `${field.key}-error` : undefined}
            />
            {formState.errors?.[field.key] && (
              <p id={`${field.key}-error`} className="text-red-500 text-xs mt-1">
                {formState.errors[field.key]}
              </p>
            )}
          </div>
        ))}

        <div className="col-span-2">
          <Textarea
            label="Description"
            name="description"
            value={formState.formData?.description || ''}
            onChange={handleChange}
            error={formState.errors?.description}
            aria-describedby={formState.errors?.description ? 'description-error' : undefined}
          />
          {formState.errors?.description && (
            <p id="description-error" className="text-red-500 text-xs mt-1">
              {formState.errors.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
          disabled={formState.isSubmitting}
        >
          <IoClose className="inline mr-1" />
          Close
        </button>
        <button
          type="submit"
          className={`px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 ${formState.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''} flex items-center`}
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? (
            <ClipLoader color="#fff" size={16} className="mr-1" />
          ) : (
            <FaSave className="inline mr-1" />
          )}
          {formState.isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
