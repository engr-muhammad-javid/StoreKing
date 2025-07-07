import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { closeModal } from '../../../store/slices/modalSlice';
import { fetchCategories,createCategory, updateCategory } from '../../../store/slices/categorySlice';
import {
  initializeForm,
  updateFormField,
  setFormErrors,
  setSubmitting,
  resetForm,
} from '../../../store/slices/formSlice';
import { TextInput, SelectInput, Textarea, SwitchToggle } from '../../common';
import { IoClose } from 'react-icons/io5';
import { FaSave } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const CategoryForm = ({ initialData = {}, mode = 'add' }) => {
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.form.forms.category || {});
  const categoryState = useSelector((state) => state.category);
  const categories = categoryState?.categories || [];
  const categoriesLoading = categoryState?.loading?.fetch || false;
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(
      initializeForm({
        entity: 'category',
        initialData: {
          name: initialData.name || '',
          description: initialData.description || '',
          url_key: initialData.url_key || '',
          parent: initialData.parent?._id || initialData.parent || '',
          isActive: initialData.isActive !== undefined ? initialData.isActive : true,
          image: initialData.image || '',
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
        entity: 'category',
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
        dispatch(setFormErrors({ entity: 'category', errors: validationErrors }));
        Object.entries(validationErrors).forEach(([key, err]) =>
          toast.error(err, { toastId: `validation-error-${key}-${mode}` })
        );
        setHasSubmitted(false);
        return;
      }

      dispatch(setSubmitting({ entity: 'category', isSubmitting: true }));
      try {
        const action =
          mode === 'edit'
            ? updateCategory({ data: formState.formData, id: initialData._id })
            : createCategory(formState.formData);
        const result = await dispatch(action);
        if (result.meta.requestStatus === 'rejected') {
          throw new Error(result.payload || 'Submission failed');
        }
        toast.success(`Category ${mode === 'edit' ? 'updated' : 'added'} successfully!`, {
          toastId: `success-${mode}`,
        });
        dispatch(closeModal());
        dispatch(resetForm({ entity: 'category' }));
      } catch (error) {
        toast.error('Error Occurred: ' + error.message);
      } finally {
        dispatch(setSubmitting({ entity: 'category', isSubmitting: false }));
        setHasSubmitted(false);
      }
    },
    [dispatch, formState, mode, initialData, hasSubmitted]
  );

  const handleClose = useCallback(() => {
    dispatch(closeModal());
    dispatch(resetForm({ entity: 'category' }));
  }, [dispatch]);

  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <ClipLoader color="#007bff" size={30} />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!categories?.length) {
    return (
      <div className="text-red-500 text-center py-4">
        Error: Unable to load categories.
      </div>
    );
  }

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
          label="URL Key"
          name="url_key"
          value={formState.formData?.url_key || ''}
          onChange={handleChange}
          error={formState.errors?.url_key}
          aria-describedby={formState.errors?.url_key ? 'url_key-error' : undefined}
        />
        <TextInput
          label="Image URL"
          name="image"
          value={formState.formData?.image || ''}
          onChange={handleChange}
          error={formState.errors?.image}
          aria-describedby={formState.errors?.image ? 'image-error' : undefined}
        />
        <SelectInput
          label="Parent Category"
          name="parent"
          value={formState.formData?.parent || ''}
          onChange={handleChange}
          options={categories.map((cat) => ({
            label: cat.name,
            value: cat._id,
          }))}
          placeholder="Select Parent Category"
          error={formState.errors?.parent}
          aria-describedby={formState.errors?.parent ? 'parent-error' : undefined}
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

export default CategoryForm;
