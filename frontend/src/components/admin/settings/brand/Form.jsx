import React, { useEffect, useState, useCallback } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

const Form = ({ isOpen, onClose, onSubmit, initialData = {}, mode = 'add' }) => {
 
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    image: '',
    isActive: true,

  });

  useEffect(() => {

    const {
      name = '',
      description = '',
      slug = '',
      image = '',
      isActive = true
    } = initialData || {};

    setFormData({
      name,
      description,
      slug,
      image,
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
          <h2 className="text-lg font-semibold mb-6">Product Brands</h2>

          {/* Name */}
          <div className="mb-4">
            <label htmlFor="brandName" className="block text-xs font-medium text-gray-600 mb-1 uppercase">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

         {/* Image Upload */}
        <div className="mb-4">
            <label htmlFor="brandImage" className="block text-xs font-medium text-gray-600 mb-1 uppercase">
                Image (640px, 960px)
            </label>
            {typeof formData.image === 'string' && formData.image && (
                <img src={formData.image} alt="Brand" className="w-24 h-auto mb-2 rounded border" />
            )}
            <input
                id="imageUpload"
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                className="w-full border border-gray-300 rounded-md text-sm file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-50 file:text-gray-700"
            />
        </div>
          
          <div className="mb-4">
            <label htmlFor="brandSlug" className="block text-xs font-medium text-gray-600 mb-1 uppercase">URL Key *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="brandDescription" className="block text-xs font-medium text-gray-600 mb-1 uppercase">Description</label>
            <textarea
               value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="3"
            />
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
              disabled={!formData.name || !formData.slug}
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
