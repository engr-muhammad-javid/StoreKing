import React, { useEffect, useState, useCallback } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

const Form = ({ isOpen, onClose, onSubmit, initialData = {}, mode = 'add' }) => {
 
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    isActive: true,

  });

  useEffect(() => {

    const {
      name = '',
      code = '',
      isActive = true
    } = initialData || {};

    setFormData({
      name,
      code,
      isActive: isActive !== false,
    });

  }, [initialData]);

  const handleSubmit = useCallback(
  (e) => {
    e.preventDefault();
    const result = onSubmit(formData);
    if (result?.then) {
      result.then(() => onClose());
    } else {
      onClose(); // fallback
    }
  },
  [formData, onSubmit, onClose]
);


  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-xl shadow-lg relative">
        <form onSubmit={handleSubmit} className="p-6" encType="multipart/form-data">
          {/* Close Button */}
          <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={onClose}>
            <IoClose size={20} />
          </button>

          {/* Title */}
          <h2 className="text-lg font-semibold mb-6">Units</h2>

          {/* Name */}
          <div className="mb-4">
            <label htmlFor="unitName" className="block text-xs font-medium text-gray-600 mb-1 uppercase">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>


           {/* Code */}
          <div className="mb-4">
            <label htmlFor="unitCode" className="block text-xs font-medium text-gray-600 mb-1 uppercase">Name *</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Status */}
          <div className="flex items-center gap-4 mt-2">
            <label htmlFor="brandStatus">
              <input
                type="radio"
                name="status"
                value="active"
                checked={formData.isActive === true}
                onChange={() => setFormData({ ...formData, isActive: true })}
              />
              Active
            </label>
            <label>
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={formData.isActive === false}
                onChange={() => setFormData({ ...formData, isActive: false })}
              />
              Inactive
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
            >
              <FaTimes className="inline mr-2" />
              Close
            </button>
            <button
              type="submit"
              disabled={!formData.name || !formData.code}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              <FaSave className="inline mr-2" />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>

  );
};

export default Form;
