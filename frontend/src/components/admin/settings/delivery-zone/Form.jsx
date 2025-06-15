import React, { useState, useEffect, useCallback } from 'react';
import ModalWrapper from '../../../common/ModalWrapper';
import TextInput from '../../../common/TextInput';
import EmailInput from '../../../common/EmailInput';
import NumberInput from '../../../common/NumberInput';
import Textarea from '../../../common/Textarea';
import RadioGroup from '../../../common/RadioGroup';
import { FaSave, FaTimes } from 'react-icons/fa';

const Form = ({ isOpen, onClose, onSubmit, initialData = {}, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    email: '',
    phone: '',
    deliveryRadiusKm: '',
    deliveryChargePerKm: '',
    minimumOrderAmount: '',
    address: '',
    isActive: true,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...initialData,
      isActive: initialData?.isActive !== false,
    }));
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const result = onSubmit(formData);
      if (result?.then) {
        result.then(() => onClose());
      } else {
        onClose();
      }
    },
    [formData, onSubmit, onClose]
  );

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={`${mode === 'edit' ? 'Edit' : 'Add'} Delivery Zone`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput label="Name" name="name" value={formData.name} onChange={handleChange} required />
          <EmailInput label="Email" name="email" value={formData.email} onChange={handleChange} required />
          <TextInput label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
          <NumberInput label="Delivery Radius (km)" name="deliveryRadiusKm" value={formData.deliveryRadiusKm} onChange={handleChange} required />
          <NumberInput label="Charge Per Km" name="deliveryChargePerKm" value={formData.deliveryChargePerKm} onChange={handleChange} required />
          <NumberInput label="Minimum Order Amount" name="minimumOrderAmount" value={formData.minimumOrderAmount} onChange={handleChange} required />
          <TextInput label="Latitude" name="latitude" value={formData.latitude} onChange={handleChange} required />
          <TextInput label="Longitude" name="longitude" value={formData.longitude} onChange={handleChange} required />
          <RadioGroup
            label="Status"
            name="isActive"
            value={formData.isActive}
            onChange={handleChange}
            options={[
              { label: 'Active', value: true },
              { label: 'Inactive', value: false },
            ]}
            required
          />
        </div>

        <Textarea label="Address" name="address" value={formData.address} onChange={handleChange} required />

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
          >
            <FaTimes className="inline mr-1" />
            Close
          </button>
          <button
            type="submit"
            disabled={!formData.name || !formData.address}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            <FaSave className="inline mr-1" />
            Save
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default Form;
