import React, { useEffect, useState, useCallback } from 'react';
import { IoClose } from 'react-icons/io5';
import {useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../../store/slices/productCategorySlice';


const Form = ({ isOpen, onClose, onSubmit, initialData = {}, mode = 'add' }) => {

  const dispatch = useDispatch();

  const { categories } = useSelector(state => state.productCategory);
 
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    image: '',
    isActive: true,
    sku: '',
    category: '',
    barcode: '',
    price: '',
    salePrice: '',
    tax: '',
    brand: '',
    can_purchasable: true,
    show_stock_out: true,
    refundable: true,
    file_attachment: false,
    unit: '',
    weight: '',
    tags: '',
    status: 'active',
  });

  useEffect(() => {
    dispatch(fetchCategories());

    const {
      sku = '',
      name = '',
      description = '',
      slug ='',
      image = '',
      isActive ='',
      category = '',
      barcode = '',
      price = '',
      salePrice = '',
      tax = '',
      brand = '',
      can_purchasable = '',
      show_stock_out = '',
      refundable = '',
      file_attachment = '',
      unit = '',
      weight = '',
      tags = '',
      status = '',
    } = initialData || {};


      setFormData({
        sku,
        name,
        description,
        slug,
        image,
        isActive,
        category,
        barcode,
        price,
        salePrice,
        tax,
        brand,
        can_purchasable,
        show_stock_out,
        refundable,
        file_attachment,
        unit,
        weight,
        tags,
        status,
      });
  }, [initialData]);
  

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  }, [formData, onSubmit, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-5xl h-[90vh] shadow-lg relative overflow-hidden">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">{mode === 'edit' ? 'Edit Product' : 'Add Product'}</h2>
            <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <IoClose size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto px-6 py-4 space-y-6 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SKU */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">SKU *</label>
                <input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">Category *</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Barcode */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">Barcode</label>
                <select value={formData.barcode} onChange={(e) => setFormData({ ...formData, barcode: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="EAN-13">EAN-13</option>
                  <option value="UPC">UPC</option>
                </select>
              </div>

              {/* Buying Price */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">Buying Price *</label>
                <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
              </div>

              {/* Selling Price */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">Selling Price *</label>
                <input type="number" value={formData.salePrice} onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
              </div>

              {/* Tax */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">Tax</label>
                <select value={formData.tax} onChange={(e) => setFormData({ ...formData, tax: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="">Select</option>
                  <option value="0%">0%</option>
                  <option value="5%">5%</option>
                </select>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">Brand</label>
                <input type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>

              {/* URL Key */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">URL Key</label>
                <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>

              {/* Image */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">Image</label>
                <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">Unit</label>
                <input type="text" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">Weight</label>
                <input type="number" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">Tags</label>
                <input type="text" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., electronics, gadgets" />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">Description</label>
                <textarea rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>

              {/* Toggles */}
              {[
                { key: 'can_purchasable', label: 'Can Purchasable' },
                { key: 'show_stock_out', label: 'Show Stock Out' },
                { key: 'refundable', label: 'Refundable' },
                { key: 'file_attachment', label: 'File Attachment' },
                { key: 'isActive', label: 'Active' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">{label}</label>
                  <div className="flex gap-4">
                    <label><input type="radio" name={key} checked={formData[key] === true} onChange={() => setFormData({ ...formData, [key]: true })} /> Yes</label>
                    <label><input type="radio" name={key} checked={formData[key] === false} onChange={() => setFormData({ ...formData, [key]: false })} /> No</label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              {mode === 'edit' ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
