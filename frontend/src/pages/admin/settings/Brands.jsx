import React, { useState, useEffect} from 'react';
import { FaPlus } from 'react-icons/fa';
import Form from '../../../components/admin/settings/brand/Form';
import Row from '../../../components/admin/settings/brand/Row';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'; 

import { 
  fetchBrands, 
  createBrand, 
  updateBrand,
  resetBrandState,
  clearCurrentBrand
} from '../../../store/slices/brandSlice';

const Brands = () => {

  const dispatch = useDispatch();
  const { brands, loading } = useSelector(state => state.productBrand);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
 

  const handleAdd = () => {
        setEditingBrand(null);
        setModalOpen(true);
  };

  const handleEdit = (brand) => {
        setEditingBrand(brand);
        setModalOpen(true);
  };


  const handleSubmit = async (data) => {
    const action = editingBrand
    ? updateBrand({ data, id: editingBrand._id })
    : createBrand(data);

    try{
        const result = await dispatch(action);
        if(result.meta.requestStatus === 'rejected'){
            toast.error(result.payload || `Failed to ${editingBrand ? "update" : "create"} brand`);
        }else{
            toast.success(result.payload.message || `Brand ${editingBrand ? "updated" : "created"} successfully`);
            dispatch(fetchBrands());
            setModalOpen(false);
            dispatch(clearCurrentBrand());
        }
    }catch(error){
        toast.error("An error occurred: " + error.message);
    }
  };

  useEffect(() => {
    dispatch(fetchBrands());
    return () => {
      dispatch(resetBrandState());
    };
  }, [dispatch]);

 
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Product Brands</h2>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <FaPlus /> Add New
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading brands...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Parent Brand</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
                {brands.length === 0 ? (
                <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                        No brands found.
                    </td>
                    </tr>
                ) : ( 
                    brands.map((brand) => (

                        <Row
                            key={brand._id}
                            fullData={brand}
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
        initialData={editingBrand}
        mode={editingBrand ? 'edit' : 'add'}
      />
    </div>
  );
};

export default Brands;