import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createLanguage,
  updateLanguage,
} from '../../../store/slices/languageSlice';
import {
  initializeForm,
  updateFormField,
  setFormErrors,
  setSubmitting,
  resetForm,
} from '../../../store/slices/formSlice';
import { closeModal } from '../../../store/slices/modalSlice';
import {
  TextInput,
  SwitchToggle,
  ImageUploader,
  SelectInput,
} from '../../common';
import { toast } from 'react-toastify';
import { IoClose } from 'react-icons/io5';
import { FaSave } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const LanguageForm = ({ initialData = {}, mode = 'add' }) => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.form.forms.language || {});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    dispatch(
      initializeForm({
        entity: 'language',
        initialData: {
          name: initialData.name || '',
          code: initialData.code || '',
          isActive: initialData.isActive ?? true,
          image: initialData.image || '',
          displayMode: initialData.displayMode || 'LTR',
        },
        mode,
      })
    );
  }, [dispatch, initialData, mode]);

  const validate = () => {
    const errors = {};
    if (!form.formData?.name) errors.name = 'Name is required';
    if (!form.formData?.code) errors.code = 'Code is required';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch(updateFormField({ entity: 'language', name, value: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (form.isSubmitting || hasSubmitted) return;

      setHasSubmitted(true);

      const errors = validate();
      if (Object.keys(errors).length > 0) {
        dispatch(setFormErrors({ entity: 'language', errors }));
        Object.values(errors).forEach((err) => toast.error(err));
        setHasSubmitted(false);
        return;
      }

      dispatch(setSubmitting({ entity: 'language', isSubmitting: true }));
      try {
        const action =
          mode === 'edit'
            ? updateLanguage({ id: initialData._id, data: form.formData })
            : createLanguage(form.formData);
        const result = await dispatch(action);
        if (result.meta.requestStatus === 'rejected') throw new Error(result.payload);

        toast.success(`Language ${mode === 'edit' ? 'updated' : 'added'} successfully`);
        dispatch(closeModal());
        dispatch(resetForm({ entity: 'language' }));
      } catch (err) {
        toast.error(err.message);
      } finally {
        dispatch(setSubmitting({ entity: 'language', isSubmitting: false }));
        setHasSubmitted(false);
      }
    },
    [dispatch, form, initialData, mode, hasSubmitted]
  );

  const displayModeOptions = [
    { value: 'LTR', label: 'Left to Right' },
    { value: 'RTL', label: 'Right to Left' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TextInput label="Name *" name="name" value={form.formData?.name || ''} onChange={handleChange} error={form.errors?.name} />
      <TextInput label="Code *" name="code" value={form.formData?.code || ''} onChange={handleChange} error={form.errors?.code} />
      <ImageUploader label="Image" name="image" value={form.formData?.image || ''} onChange={handleChange} />
      <SelectInput label="Display Mode" name="displayMode" value={form.formData?.displayMode || ''} onChange={handleChange} options={displayModeOptions} />
      <SwitchToggle label="Status" name="isActive" checked={!!form.formData?.isActive} onChange={handleChange} />

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => {
            dispatch(closeModal());
            dispatch(resetForm({ entity: 'language' }));
          }}
          className="px-4 py-2 border rounded text-gray-700"
          disabled={form.isSubmitting}
        >
          <IoClose className="mr-1 inline" /> Close
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center"
          disabled={form.isSubmitting}
        >
          {form.isSubmitting ? <ClipLoader size={16} className="mr-2" color="#fff" /> : <FaSave className="mr-1" />}
          {form.isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default LanguageForm;
