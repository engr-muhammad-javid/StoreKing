// src/components/admin/forms/TaxForm.js
import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { closeModal } from '../../../store/slices/modalSlice';
import {
  createTax,
  updateTax,
} from '../../../store/slices/taxSlice';
import {
  initializeForm,
  updateFormField,
  setFormErrors,
  setSubmitting,
  resetForm,
} from '../../../store/slices/formSlice';
import { TextInput, SwitchToggle } from '../../common';
import { IoClose } from 'react-icons/io5';
import { FaSave } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const TaxForm = ({ initialData = {}, mode = 'add' }) => {
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.form.forms.tax || {});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    dispatch(
      initializeForm({
        entity: 'tax',
        initialData: {
          name: initialData.name || '',
          code: initialData.code || '',
          taxRate: initialData.taxRate || '',
          isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        },
        mode,
      })
    );
  }, [dispatch, initialData, mode]);

  const validateForm = () => {
    const errors = {};
    if (!formState?.formData?.name) errors.name = 'Name is required';
    if (!formState?.formData?.code) errors.code = 'Code is required';
    if (formState?.formData?.taxRate === '') errors.taxRate = 'Rate is required';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch(
      updateFormField({
        entity: 'tax',
        name,
        value: type === 'checkbox' ? checked : value,
      })
    );
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (formState.isSubmitting || hasSubmitted) return;
      setHasSubmitted(true);

      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        dispatch(setFormErrors({ entity: 'tax', errors: validationErrors }));
        Object.entries(validationErrors).forEach(([key, msg]) =>
          toast.error(msg, { toastId: `tax-error-${key}` })
        );
        setHasSubmitted(false);
        return;
      }

      dispatch(setSubmitting({ entity: 'tax', isSubmitting: true }));
      try {
        const action =
          mode === 'edit'
            ? updateTax({ data: formState.formData, id: initialData._id })
            : createTax(formState.formData);

        const result = await dispatch(action);
        if (result.meta.requestStatus === 'rejected') {
          throw new Error(result.payload || 'Submission failed');
        }

        toast.success(`Tax ${mode === 'edit' ? 'updated' : 'created'} successfully!`);
        dispatch(closeModal());
        dispatch(resetForm({ entity: 'tax' }));
      } catch (error) {
        toast.error('Error: ' + error.message);
      } finally {
        dispatch(setSubmitting({ entity: 'tax', isSubmitting: false }));
        setHasSubmitted(false);
      }
    },
    [dispatch, formState, hasSubmitted, mode, initialData]
  );

  const handleClose = useCallback(() => {
    dispatch(closeModal());
    dispatch(resetForm({ entity: 'tax' }));
  }, [dispatch]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Name *"
          name="name"
          value={formState.formData?.name || ''}
          onChange={handleChange}
          required
          error={formState.errors?.name}
        />
        <TextInput
          label="Code *"
          name="code"
          value={formState.formData?.code || ''}
          onChange={handleChange}
          required
          error={formState.errors?.code}
        />
        <TextInput
          label="Tax Rate (%) *"
          name="taxRate"
          type="number"
          value={formState.formData?.taxRate || ''}
          onChange={handleChange}
          required
          error={formState.errors?.taxRate}
        />
        <SwitchToggle
          label="Status"
          name="isActive"
          checked={!!formState.formData?.isActive}
          onChange={handleChange}
          yesLabel="Active"
          noLabel="Inactive"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
          disabled={formState.isSubmitting}
        >
          <IoClose className="inline mr-1" /> Close
        </button>
        <button
          type="submit"
          className={`px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center ${
            formState.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
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

export default TaxForm;
