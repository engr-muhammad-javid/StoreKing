import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBenefit, updateBenefit } from '../../../store/slices/benefitSlice';
import { closeModal } from '../../../store/slices/modalSlice';
import {
  initializeForm, updateFormField, setFormErrors, setSubmitting, resetForm
} from '../../../store/slices/formSlice';
import { TextInput, Textarea, SwitchToggle, ImageUploader } from '../../common';
import { toast } from 'react-toastify';
import { FaSave } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { ClipLoader } from 'react-spinners';

const BenefitForm = ({ initialData = {}, mode = 'add' }) => {
  const dispatch = useDispatch();
  const form = useSelector(s => s.form.forms.benefit || {});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    dispatch(initializeForm({
      entity: 'benefit',
      initialData: {
        title: initialData.title || '',
        image: initialData.image || '',
        description: initialData.description || '',
        isActive: initialData.isActive ?? true
      },
      mode
    }));
  }, [dispatch, initialData, mode]);

  const validate = () => {
    const errors = {};
    if (!form.formData?.title) errors.title = 'Title is required';
    return errors;
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    dispatch(updateFormField({ entity: 'benefit', name, value: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (form.isSubmitting || submitted) return;
    setSubmitted(true);

    const errors = validate();
    if (Object.keys(errors).length) {
      dispatch(setFormErrors({ entity: 'benefit', errors }));
      Object.values(errors).forEach(msg => toast.error(msg));
      setSubmitted(false);
      return;
    }

    dispatch(setSubmitting({ entity: 'benefit', isSubmitting: true }));
    try {
      const action = mode === 'edit'
        ? updateBenefit({ id: initialData._id, data: form.formData })
        : createBenefit(form.formData);
      const result = await dispatch(action);
      if (result.meta.requestStatus === 'rejected') throw new Error(result.payload);

      toast.success(`Benefit ${mode === 'edit' ? 'updated' : 'added'} successfully`);
      dispatch(closeModal());
      dispatch(resetForm({ entity: 'benefit' }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      dispatch(setSubmitting({ entity: 'benefit', isSubmitting: false }));
      setSubmitted(false);
    }
  }, [dispatch, form, initialData, mode, submitted]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TextInput label="Title *" name="title" value={form.formData?.title || ''} onChange={handleChange} error={form.errors?.title} />
      <ImageUploader label="Image" name="image" value={form.formData?.image || ''} onChange={handleChange} />
      <Textarea label="Description" name="description" value={form.formData?.description || ''} onChange={handleChange} />
      <SwitchToggle label="Status" name="isActive" checked={!!form.formData?.isActive} onChange={handleChange} />
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={() => { dispatch(closeModal()); dispatch(resetForm({ entity: 'benefit' })); }} className="px-4 py-2 border text-gray-700 rounded-md" disabled={form.isSubmitting}>
          <IoClose className="mr-1 inline" /> Close
        </button>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center" disabled={form.isSubmitting}>
          {form.isSubmitting ? <ClipLoader size={16} color="#fff" className="mr-2" /> : <FaSave className="mr-1 inline" />}
          {form.isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default BenefitForm;
