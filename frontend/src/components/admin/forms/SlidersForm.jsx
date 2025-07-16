import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { closeModal } from '../../../store/slices/modalSlice';
import {
  createSlider,
  updateSlider,
} from '../../../store/slices/sliderSlice';
import {
  initializeForm,
  updateFormField,
  setFormErrors,
  setSubmitting,
  resetForm,
} from '../../../store/slices/formSlice';
import { TextInput, Textarea, SwitchToggle, ImageUploader } from '../../common';
import { IoClose } from 'react-icons/io5';
import { FaSave } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const SlidersForm = ({ initialData = {}, mode = 'add' }) => {
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.form.forms.slider || {});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    dispatch(
      initializeForm({
        entity: 'slider',
        initialData: {
          title: initialData.title || '',
          link: initialData.link || '',
          image: initialData.image || '',
          description: initialData.description || '',
          isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        },
        mode,
      })
    );
  }, [dispatch, initialData, mode]);

  const validateForm = () => {
    const errors = {};
    if (!formState?.formData?.title) errors.title = 'Title is required';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch(
      updateFormField({
        entity: 'slider',
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
        dispatch(setFormErrors({ entity: 'slider', errors: validationErrors }));
        Object.entries(validationErrors).forEach(([key, err]) => {
          toast.error(err);
        });
        setHasSubmitted(false);
        return;
      }

      dispatch(setSubmitting({ entity: 'slider', isSubmitting: true }));

      const action =
        mode === 'edit'
          ? updateSlider({ data: formState.formData, id: initialData._id })
          : createSlider(formState.formData);

      const result = await dispatch(action);
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success(`Slider ${mode === 'edit' ? 'updated' : 'created'} successfully`);
        dispatch(closeModal());
        dispatch(resetForm({ entity: 'slider' }));
      } else {
        toast.error(result.payload || 'Submission failed');
      }

      dispatch(setSubmitting({ entity: 'slider', isSubmitting: false }));
      setHasSubmitted(false);
    },
    [dispatch, formState, mode, initialData, hasSubmitted]
  );

  const handleClose = () => {
    dispatch(closeModal());
    dispatch(resetForm({ entity: 'slider' }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Title *"
          name="title"
          value={formState.formData?.title || ''}
          onChange={handleChange}
          required
          error={formState.errors?.title}
        />
        <TextInput
          label="Link"
          name="link"
          value={formState.formData?.link || ''}
          onChange={handleChange}
        />
        <ImageUploader
          label="Image"
          name="image"
          value={formState.formData?.image}
          onChange={handleChange}
          error={formState.errors?.image}
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
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
        >
          <IoClose className="inline mr-1" />
          Close
        </button>
        <button
          type="submit"
          className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
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

export default SlidersForm;
