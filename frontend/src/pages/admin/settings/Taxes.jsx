// src/pages/admin/settings/Taxes.jsx

import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import Form from '../../../components/admin/settings/tax/Form';
import Row from '../../../components/admin/settings/tax/Row';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  fetchTaxes,
  createTax,
  updateTax,
  resetTaxState,
  clearCurrentTax,
} from '../../../store/slices/taxSlice';

const Taxes = () => {
  const dispatch = useDispatch();
  const { taxes, loading } = useSelector((state) => state.tax);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTax, setEditingTax] = useState(null);

  const handleAdd = () => {
    setEditingTax(null);
    setModalOpen(true);
  };

  const handleEdit = (tax) => {
    setEditingTax(tax);
    setModalOpen(true);
  };

  const handleSubmit = async (data) => {
    const action = editingTax
      ? updateTax({ data, id: editingTax._id })
      : createTax(data);

    try {
      const result = await dispatch(action);
      if (result.meta.requestStatus === 'rejected') {
        toast.error(result.payload || `Failed to ${editingTax ? 'update' : 'create'} tax`);
      } else {
        toast.success(result.payload.message || `Tax ${editingTax ? 'updated' : 'created'} successfully`);
        dispatch(fetchTaxes());
        setModalOpen(false);
        dispatch(clearCurrentTax());
      }
    } catch (error) {
      toast.error('An error occurred: ' + error.message);
    }
  };

  useEffect(() => {
    dispatch(fetchTaxes());
    return () => {
      dispatch(resetTaxState());
    };
  }, [dispatch]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Taxes</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <FaPlus /> Add New
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading Taxes...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Code</th>
                <th className="px-4 py-3 text-left font-medium">Rate (%)</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {taxes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No taxes found.
                  </td>
                </tr>
              ) : (
                taxes.map((tax) => (
                  <Row key={tax._id} fullData={tax} onEdit={handleEdit} />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Form
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingTax}
        mode={editingTax ? 'edit' : 'add'}
      />
    </div>
  );
};

export default Taxes;
