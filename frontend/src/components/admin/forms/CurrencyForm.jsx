import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { closeModal } from '../../../store/slices/modalSlice';
import { createCurrency, updateCurrency } from '../../../store/slices/currencySlice';
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

const CurrencyForm = ({ initialData = {}, mode = 'add' }) => {
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.form.forms.currency || {});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    dispatch(
      initializeForm({
        entity: 'currency',
        initialData: {
          name: initialData.name || '',
          symbol: initialData.symbol || '',
          code: initialData.code || '',
          exchangeRate: initialData.exchangeRate || '',
          isCryptocurrency: initialData.isCryptocurrency || false,
          isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        },
        mode,
      })
    );
  }, [dispatch, initialData, mode]);

  const validateForm = () => {
    const errors = {};
    if (!formState.formData?.name) errors.name = 'Name is required';
    if (!formState.formData?.symbol) errors.symbol = 'Symbol is required';
    if (!formState.formData?.code) errors.code = 'Code is required';
    if (formState.formData?.exchangeRate === '' || isNaN(formState.formData?.exchangeRate)) {
      errors.exchangeRate = 'Exchange Rate must be a number';
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch(
      updateFormField({
        entity: 'currency',
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
        dispatch(setFormErrors({ entity: 'currency', errors: validationErrors }));
        Object.entries(validationErrors).forEach(([key, err]) =>
          toast.error(err, { toastId: `validation-error-${key}-${mode}` })
        );
        setHasSubmitted(false);
        return;
      }

      dispatch(setSubmitting({ entity: 'currency', isSubmitting: true }));
      try {
        const action =
          mode === 'edit'
            ? updateCurrency({ data: formState.formData, id: initialData._id })
            : createCurrency(formState.formData);

        const result = await dispatch(action);
        if (result.meta.requestStatus === 'rejected') {
          throw new Error(result.payload || 'Submission failed');
        }

        toast.success(`Currency ${mode === 'edit' ? 'updated' : 'added'} successfully!`);
        dispatch(closeModal());
        dispatch(resetForm({ entity: 'currency' }));
      } catch (error) {
        toast.error('Error occurred: ' + error.message);
      } finally {
        dispatch(setSubmitting({ entity: 'currency', isSubmitting: false }));
        setHasSubmitted(false);
      }
    },
    [dispatch, formState, mode, initialData, hasSubmitted]
  );

  const handleClose = useCallback(() => {
    dispatch(closeModal());
    dispatch(resetForm({ entity: 'currency' }));
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
          label="Symbol *"
          name="symbol"
          value={formState.formData?.symbol || ''}
          onChange={handleChange}
          required
          error={formState.errors?.symbol}
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
          label="Exchange Rate *"
          name="exchangeRate"
          type="number"
          step="any"
          value={formState.formData?.exchangeRate || ''}
          onChange={handleChange}
          required
          error={formState.errors?.exchangeRate}
        />
        <SwitchToggle
          label="Is Cryptocurrency"
          name="isCryptocurrency"
          checked={!!formState.formData?.isCryptocurrency}
          onChange={handleChange}
          yesLabel="Yes"
          noLabel="No"
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
          <IoClose className="inline mr-1" />
          Close
        </button>
        <button
          type="submit"
          className={`px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 ${
            formState.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          } flex items-center`}
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

export default CurrencyForm;
