import React, { useState, useEffect} from 'react';
import { FaPlus } from 'react-icons/fa';
import Form from '../../../components/admin/settings/currency/Form';
import Row from '../../../components/admin/settings/currency/Row';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'; 

import { 
  fetchCurrencies, 
  createCurrency, 
  updateCurrency,
  resetCurrencyState,
  clearCurrentCurrency
} from '../../../store/slices/currencySlice';

const Currencies = () => {

  const dispatch = useDispatch();
  const { currencies, loading } = useSelector(state => state.currency);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState(null);
 

  const handleAdd = () => {
        setEditingCurrency(null);
        setModalOpen(true);
  };

  const handleEdit = (currency) => {
        setEditingCurrency(currency);
        setModalOpen(true);
  };


  const handleSubmit = async (data) => {
    const action = editingCurrency
    ? updateCurrency({ data, id: editingCurrency._id })
    : createCurrency(data);

    try{
        const result = await dispatch(action);
        if(result.meta.requestStatus === 'rejected'){
            toast.error(result.payload || `Failed to ${editingCurrency ? "update" : "create"} currency`);
        }else{
            toast.success(result.payload.message || `Currency ${editingCurrency ? "updated" : "created"} successfully`);
            dispatch(fetchCurrencies());
            setModalOpen(false);
            dispatch(clearCurrentCurrency());
        }
    }catch(error){
        toast.error("An error occurred: " + error.message);
    }
  };

  useEffect(() => {
    dispatch(fetchCurrencies());
    return () => {
      dispatch(resetCurrencyState());
    };
  }, [dispatch]);

 
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Product Currencies</h2>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <FaPlus /> Add New
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading currencies...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Symbol</th>
                <th className="px-4 py-3 text-left font-medium">Code</th>
                <th className="px-4 py-3 text-left font-medium">Is Cryptocurrency</th>
                <th className="px-4 py-3 text-left font-medium">Exchange Rate</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
                {currencies.length === 0 ? (
                <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                        No currencies found.
                    </td>
                    </tr>
                ) : ( 
                    currencies.map((currency) => (

                        <Row
                            key={currency._id}
                            fullData={currency}
                            onEdit={handleEdit}
                        />
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
        initialData={editingCurrency}
        mode={editingCurrency ? 'edit' : 'add'}
      />
    </div>
  );
};

export default Currencies;