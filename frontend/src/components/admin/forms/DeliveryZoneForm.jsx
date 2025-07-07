import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { IoClose } from 'react-icons/io5';
import { FaSave } from 'react-icons/fa';

import { closeModal } from '../../../store/slices/modalSlice';
import { createDeliveryZone, updateDeliveryZone } from '../../../store/slices/deliveryZoneSlice';
import {
  initializeForm,
  updateFormField,
  setFormErrors,
  setSubmitting,
  resetForm,
} from '../../../store/slices/formSlice';

import { TextInput, Textarea, SwitchToggle } from '../../common';

const DeliveryZoneForm = ({ initialData = {}, mode = 'add' }) => {
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.form.forms.deliveryZone || {});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    dispatch(
      initializeForm({
        entity: 'deliveryZone',
        initialData: {
          name: initialData.name || '',
          latitude: initialData.latitude || '',
          longitude: initialData.longitude || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          deliveryRadiusKm: initialData.deliveryRadiusKm || '',
          deliveryChargePerKm: initialData.deliveryChargePerKm || '',
          minimumOrderAmount: initialData.minimumOrderAmount || '',
          isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        },
        mode,
      })
    );
  }, [dispatch, initialData, mode]);

  const validateForm = () => {
    const errors = {};
    if (!formState?.formData?.name) errors.name = 'Name is required';
    if (!formState?.formData?.latitude) errors.latitude = 'Latitude is required';
    if (!formState?.formData?.longitude) errors.longitude = 'Longitude is required';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch(
      updateFormField({
        entity: 'deliveryZone',
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
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        dispatch(setFormErrors({ entity: 'deliveryZone', errors }));
        Object.entries(errors).forEach(([k, v]) => toast.error(v));
        setHasSubmitted(false);
        return;
      }

      dispatch(setSubmitting({ entity: 'deliveryZone', isSubmitting: true }));
      try {
        const action =
          mode === 'edit'
            ? updateDeliveryZone({ id: initialData._id, data: formState.formData })
            : createDeliveryZone(formState.formData);

        const result = await dispatch(action);
        if (result.meta.requestStatus === 'rejected') throw new Error(result.payload || 'Submission failed');

        toast.success(`Delivery Zone ${mode === 'edit' ? 'updated' : 'added'} successfully`);
        dispatch(closeModal());
        dispatch(resetForm({ entity: 'deliveryZone' }));
      } catch (error) {
        toast.error('Error: ' + error.message);
      } finally {
        dispatch(setSubmitting({ entity: 'deliveryZone', isSubmitting: false }));
        setHasSubmitted(false);
      }
    },
    [dispatch, formState, mode, initialData, hasSubmitted]
  );

  const handleClose = () => {
    dispatch(closeModal());
    dispatch(resetForm({ entity: 'deliveryZone' }));
  };

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
          label="Latitude *"
          name="latitude"
          value={formState.formData?.latitude || ''}
          onChange={handleChange}
          required
          error={formState.errors?.latitude}
        />

        <TextInput
          label="Longitude *"
          name="longitude"
          value={formState.formData?.longitude || ''}
          onChange={handleChange}
          required
          error={formState.errors?.longitude}
        />

        <TextInput
          label="Email"
          name="email"
          value={formState.formData?.email || ''}
          onChange={handleChange}
          error={formState.errors?.email}
        />

        <TextInput
          label="Phone"
          name="phone"
          value={formState.formData?.phone || ''}
          onChange={handleChange}
          error={formState.errors?.phone}
        />

        <TextInput
          label="Delivery Radius (KM)"
          name="deliveryRadiusKm"
          type="number"
          value={formState.formData?.deliveryRadiusKm || ''}
          onChange={handleChange}
          error={formState.errors?.deliveryRadiusKm}
        />

        <TextInput
          label="Charge Per KM"
          name="deliveryChargePerKm"
          type="number"
          value={formState.formData?.deliveryChargePerKm || ''}
          onChange={handleChange}
          error={formState.errors?.deliveryChargePerKm}
        />

        <TextInput
          label="Minimum Order Amount"
          name="minimumOrderAmount"
          type="number"
          value={formState.formData?.minimumOrderAmount || ''}
          onChange={handleChange}
          error={formState.errors?.minimumOrderAmount}
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

export default DeliveryZoneForm;
