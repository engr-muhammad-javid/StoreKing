import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../../store/slices/modalSlice';
import {
  createAttribute,
  updateAttribute,
} from '../../../store/slices/attributeSlice';
import {
  initializeForm,
  updateFormField,
  setFormErrors,
  setSubmitting,
  resetForm,
} from '../../../store/slices/formSlice';
import { TextInput } from '../../common';
import { IoClose } from 'react-icons/io5';
import { FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

const AttributeForm = ({ initialData = {}, mode = 'add' }) => {
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.form.forms.attribute || {});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    dispatch(
      initializeForm({
        entity: 'attribute',
        initialData: {
          name: initialData.name || '',
        },
        mode,
      })
    );
  }, [dispatch, initialData, mode]);

  const validateForm = () => {
    const errors = {};
    if (!formState.formData?.name) {
      errors.name = 'Name is required';
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormField({ entity: 'attribute', name, value }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (formState.isSubmitting || hasSubmitted) return;
      setHasSubmitted(true);

      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        dispatch(setFormErrors({ entity: 'attribute', errors: validationErrors }));
        Object.entries(validationErrors).forEach(([key, msg]) =>
          toast.error(msg, { toastId: `error-${key}` })
        );
        setHasSubmitted(false);
        return;
      }

      dispatch(setSubmitting({ entity: 'attribute', isSubmitting: true }));
      try {
        const action =
          mode === 'edit'
            ? updateAttribute({ data: formState.formData, id: initialData._id })
            : createAttribute(formState.formData);
        const result = await dispatch(action);
        if (result.meta.requestStatus === 'rejected') {
          throw new Error(result.payload || 'Submission failed');
        }
        toast.success(`Attribute ${mode === 'edit' ? 'updated' : 'added'} successfully`);
        dispatch(closeModal());
        dispatch(resetForm({ entity: 'attribute' }));
      } catch (err) {
        toast.error('Error: ' + err.message);
      } finally {
        dispatch(setSubmitting({ entity: 'attribute', isSubmitting: false }));
        setHasSubmitted(false);
      }
    },
    [dispatch, formState, mode, initialData, hasSubmitted]
  );

  const handleClose = () => {
    dispatch(closeModal());
    dispatch(resetForm({ entity: 'attribute' }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TextInput
        label="Name *"
        name="name"
        value={formState.formData?.name || ''}
        onChange={handleChange}
        required
        error={formState.errors?.name}
      />

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
        >
          <IoClose className="inline mr-1" /> Close
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? (
            <ClipLoader color="#fff" size={16} className="mr-2" />
          ) : (
            <FaSave className="mr-2" />
          )}
          {formState.isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default AttributeForm;
