// src/components/admin/forms/UnitForm.js
import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../../../store/slices/modalSlice';
import { createUnit, updateUnit } from '../../../store/slices/unitSlice';
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
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

const UnitForm = ({ initialData = {}, mode = 'add' }) => {
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.form.forms.unit || {});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    dispatch(
      initializeForm({
        entity: 'unit',
        initialData: {
          name: initialData.name || '',
          code: initialData.code || '',
          isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        },
        mode,
      })
    );
  }, [dispatch, initialData, mode]);

  const validateForm = () => {
    const newErrors = {};
    if (!formState?.formData?.name) newErrors.name = 'Name is required';
    if (!formState?.formData?.code) newErrors.code = 'Code is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch(
      updateFormField({
        entity: 'unit',
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
        dispatch(setFormErrors({ entity: 'unit', errors: validationErrors }));
        Object.entries(validationErrors).forEach(([key, err]) =>
          toast.error(err, { toastId: `validation-error-${key}-${mode}` })
        );
        setHasSubmitted(false);
        return;
      }

      dispatch(setSubmitting({ entity: 'unit', isSubmitting: true }));
      try {
        const action =
          mode === 'edit'
            ? updateUnit({ data: formState.formData, id: initialData._id })
            : createUnit(formState.formData);
        const result = await dispatch(action);
        if (result.meta.requestStatus === 'rejected') {
          throw new Error(result.payload || 'Submission failed');
        }
        toast.success(`Unit ${mode === 'edit' ? 'updated' : 'added'} successfully!`);
        dispatch(closeModal());
        dispatch(resetForm({ entity: 'unit' }));
      } catch (error) {
        toast.error('Error Occurred: ' + error.message);
      } finally {
        dispatch(setSubmitting({ entity: 'unit', isSubmitting: false }));
        setHasSubmitted(false);
      }
    },
    [dispatch, formState, mode, initialData, hasSubmitted]
  );

  const handleClose = useCallback(() => {
    dispatch(closeModal());
    dispatch(resetForm({ entity: 'unit' }));
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

export default UnitForm;
