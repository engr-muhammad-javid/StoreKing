import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';

const AddressModal = ({ isOpen, onClose, onSubmit, initialData = {}, mode = 'add' }) => {
  const [address, setAddress] = useState('');
  const [type, setType] = useState('Home');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');

  useEffect(() => {
    if (initialData) {
      setAddress(initialData.address || '');
      setType(initialData.type || 'Home');
      setLongitude(initialData.longitude || '');
      setLatitude(initialData.latitude || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      address,
      type,
      longitude,
      latitude,
      ...(initialData && initialData._id && {addressId: initialData._id }), 
    };

    onSubmit(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
        <button className="absolute top-4 right-4 text-xl" onClick={onClose}>
          <IoClose />
        </button>

        <h2 className="text-xl font-bold mb-4">
          {mode === 'edit' ? 'Edit Address' : 'Add New Address'}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full border p-2 rounded mb-4"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <input
            type="text"
            className="w-full border p-2 rounded mb-4"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
          />

          <input
            type="text"
            className="w-full border p-2 rounded mb-4"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
          />

          <div className="flex space-x-4 mb-4">
            {["Home", "Office", "Other"].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-full border ${
                  type === t
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
            {mode === 'edit' ? 'Update Address' : 'Confirm Address'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
