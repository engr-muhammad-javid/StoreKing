import React, { useEffect, useState, useCallback } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

const Form = ({ isOpen, onClose, onSubmit, initialData = {}, mode = 'add' }) => {
 
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    code: '',
    isCryptocurrency: false,
    exchangeRate: '',

  });

  useEffect(() => {

    const {
      name = '',
      symbol = '',
      code = '',
      isCryptocurrency = false,
      exchangeRate = '',
    } = initialData || {};

    setFormData({
      name,
      symbol,
      code,
      isCryptocurrency,
      exchangeRate
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
            <label htmlFor="currencyName" className="block text-xs font-medium text-gray-600 mb-1 uppercase">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Symbol */}
          <div className="mb-4">
            <label htmlFor="currencySymbol" className="block text-xs font-medium text-gray-600 mb-1 uppercase">Symbol *</label>
            <input
              type="text"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* code */}
          <div className="mb-4">
            <label htmlFor="currencyCode" className="block text-xs font-medium text-gray-600 mb-1 uppercase">Code *</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* isCryptocurrency */}
          <div className="mb-4">
            <label htmlFor="currencyisCryptocurrency" className="block text-xs font-medium text-gray-600 mb-1 uppercase">
                isCryptocurrency *
            </label>
            <div className="flex gap-4">
                <label>
                    <input 
                        type="radio" 
                        name="isCryptocurrency" 
                        value="true"
                        checked={formData.isCryptocurrency === true}
                       onChange={(e) => setFormData({ ...formData, isCryptocurrency: e.target.value })}
                    /> 
                    Yes
                </label>
                <label>
                    <input 
                        type="radio" 
                        name="isCryptocurrency"
                        value="false"
                        checked={formData.isCryptocurrency === false} 
                       onChange={(e) => setFormData({ ...formData, isCryptocurrency: e.target.value })}
                    /> 
                    No
                </label>
            </div>
          </div>

           {/* exchangeRate */}
          <div className="mb-4">
            <label htmlFor="currencyexchangeRate" className="block text-xs font-medium text-gray-600 mb-1 uppercase">Exchange Rate *</label>
            <input
             id="currencyexchangeRate"
              type="text"
              value={formData.exchangeRate}
              onChange={(e) => setFormData({ ...formData, exchangeRate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
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
              disabled={!formData.name || !formData.code || !formData.symbol}
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
