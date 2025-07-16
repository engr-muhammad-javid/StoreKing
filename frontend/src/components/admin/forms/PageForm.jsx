import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPage, updatePage } from '../../../store/slices/pageSlice';
import {
  initializeForm, updateFormField, setFormErrors, setSubmitting, resetForm
} from '../../../store/slices/formSlice';
import { closeModal } from '../../../store/slices/modalSlice';
import { TextInput, Textarea, SwitchToggle, ImageUploader, SelectInput } from '../../common';
import { toast } from 'react-toastify';
import { IoClose } from 'react-icons/io5';
import { FaSave } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const PageForm = ({ initialData = {}, mode = 'add' }) => {
  const dispatch = useDispatch();
  const form = useSelector((s) => s.form.forms.page || {});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const menuSections = [
    { value: 'footer', label: 'Footer' },
    { value: 'header', label: 'Header' },
    { value: 'sidebar', label: 'Sidebar' }
  ];

  const menuTemplates = [
    { value: 'about', label: 'About Template' },
    { value: 'services', label: 'Services Template' },
    { value: 'faq', label: 'FAQ Template' }
  ];

  useEffect(() => {
    dispatch(initializeForm({
      entity: 'page',
      initialData: {
        title: initialData.title || '',
        image: initialData.image || '',
        isActive: initialData.isActive ?? true,
        description: initialData.description || '',
        menuSection: initialData.menuSection || '',
        menuTemplate: initialData.menuTemplate || ''
      },
      mode
    }));
  }, [dispatch, initialData, mode]);

  const validate = () => {
    const errors = {};
    if (!form.formData?.title) errors.title = 'Title is required';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch(updateFormField({ entity: 'page', name, value: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (form.isSubmitting || hasSubmitted) return;

    setHasSubmitted(true);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      dispatch(setFormErrors({ entity: 'page', errors }));
      Object.entries(errors).forEach(([_, err]) => toast.error(err));
      setHasSubmitted(false);
      return;
    }

    dispatch(setSubmitting({ entity: 'page', isSubmitting: true }));
    try {
      const action = mode === 'edit'
        ? updatePage({ id: initialData._id, data: form.formData })
        : createPage(form.formData);
      const result = await dispatch(action);
      if (result.meta.requestStatus === 'rejected') throw new Error(result.payload);

      toast.success(`Page ${mode === 'edit' ? 'updated' : 'added'} successfully`);
      dispatch(closeModal());
      dispatch(resetForm({ entity: 'page' }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      dispatch(setSubmitting({ entity: 'page', isSubmitting: false }));
      setHasSubmitted(false);
    }
  }, [dispatch, form, initialData, mode, hasSubmitted]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TextInput label="Title *" name="title" value={form.formData?.title || ''} onChange={handleChange} error={form.errors?.title} />
      <ImageUploader label="Image" name="image" value={form.formData?.image || ''} onChange={handleChange} />
      <SelectInput label="Menu Section" name="menuSection" value={form.formData?.menuSection || ''} onChange={handleChange} options={menuSections} />
      <SelectInput label="Menu Template" name="menuTemplate" value={form.formData?.menuTemplate || ''} onChange={handleChange} options={menuTemplates} />
      <Textarea label="Description" name="description" value={form.formData?.description || ''} onChange={handleChange} />
      <SwitchToggle label="Status" name="isActive" checked={!!form.formData?.isActive} onChange={handleChange} />
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={() => { dispatch(closeModal()); dispatch(resetForm({ entity: 'page' })); }} className="px-4 py-2 border rounded text-gray-700" disabled={form.isSubmitting}>
          <IoClose className="mr-1 inline" /> Close
        </button>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center" disabled={form.isSubmitting}>
          {form.isSubmitting ? <ClipLoader size={16} className="mr-2" color="#fff" /> : <FaSave className="mr-1" />}
          {form.isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default PageForm;
