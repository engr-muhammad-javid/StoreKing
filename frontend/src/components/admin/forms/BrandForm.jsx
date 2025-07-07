import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { closeModal } from '../../../store/slices/modalSlice';
import { createBrand, updateBrand } from '../../../store/slices/brandSlice';
import {
  initializeForm,
  updateFormField,
  setFormErrors,
  setSubmitting,
  resetForm,
} from '../../../store/slices/formSlice';
import { TextInput, Textarea, SwitchToggle } from '../../common';
import { IoClose } from 'react-icons/io5';
import { FaSave } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const BrandForm = ({ initialData = {}, mode = 'add' }) => {
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.form.forms.brand || {});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    dispatch(
      initializeForm({
        entity: 'brand',
        initialData: {
          name: initialData.name || '',
          description: initialData.description || '',
          slug: initialData.slug || '',
          image: initialData.image || '',
          isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        },
        mode,
      })
    );
  }, [dispatch, initialData, mode]);

  const validateForm = () => {
    const newErrors = {};
    if (!formState?.formData?.name) newErrors.name = 'Name is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch(
      updateFormField({
        entity: 'brand',
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
        dispatch(setFormErrors({ entity: 'brand', errors: validationErrors }));
        Object.entries(validationErrors).forEach(([key, err]) =>
          toast.error(err, { toastId: `validation-error-${key}-${mode}` })
        );
        setHasSubmitted(false);
        return;
      }

      dispatch(setSubmitting({ entity: 'brand', isSubmitting: true }));
      try {
        const action =
          mode === 'edit'
            ? updateBrand({ data: formState.formData, id: initialData._id })
            : createBrand(formState.formData);
        const result = await dispatch(action);
        if (result.meta.requestStatus === 'rejected') {
          throw new Error(result.payload || 'Submission failed');
        }
        toast.success(`Brand ${mode === 'edit' ? 'updated' : 'added'} successfully!`, {
          toastId: `success-${mode}`,
        });
        dispatch(closeModal());
        dispatch(resetForm({ entity: 'brand' }));
      } catch (error) {
        toast.error('Error Occurred: ' + error.message);
      } finally {
        dispatch(setSubmitting({ entity: 'brand', isSubmitting: false }));
        setHasSubmitted(false);
      }
    },
    [dispatch, formState, mode, initialData, hasSubmitted]
  );

  const handleClose = useCallback(() => {
    dispatch(closeModal());
    dispatch(resetForm({ entity: 'brand' }));
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
          aria-describedby={formState.errors?.name ? 'name-error' : undefined}
        />
        <TextInput
          label="Slug"
          name="slug"
          value={formState.formData?.slug || ''}
          onChange={handleChange}
          error={formState.errors?.slug}
          aria-describedby={formState.errors?.slug ? 'slug-error' : undefined}
        />
        <TextInput
          label="Image URL"
          name="image"
          value={formState.formData?.image || ''}
          onChange={handleChange}
          error={formState.errors?.image}
          aria-describedby={formState.errors?.image ? 'image-error' : undefined}
        />
        <SwitchToggle
          label="Status"
          name="isActive"
          checked={!!formState.formData?.isActive}
          onChange={handleChange}
          yesLabel="Active"
          noLabel="Inactive"
        />
        <div className="col-span-2">
          <Textarea
            label="Description"
            name="description"
            value={formState.formData?.description || ''}
            onChange={handleChange}
            error={formState.errors?.description}
            aria-describedby={formState.errors?.description ? 'description-error' : undefined}
          />
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

export default BrandForm;
