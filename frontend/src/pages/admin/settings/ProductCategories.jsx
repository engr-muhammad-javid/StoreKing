import React, { useState, useEffect, useCallback} from 'react';
import { FaPlus } from 'react-icons/fa';
import From from '../../../components/admin/settings/category/Form';
import Row from '../../../components/admin/settings/category/Row';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'; 

import { 
  fetchCategories, 
  createCategory, 
  updateCategory,
  resetCategoryState,
  clearCurrentCategory
} from '../../../store/slices/productCategorySlice';

const ProductCategories = () => {

  const dispatch = useDispatch();
  const { categories, loading } = useSelector(state => state.productCategory);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
 

  const handleAdd = () => {
        setEditingCategory(null);
        setModalOpen(true);
  };

  const handleEdit = (category) => {
        setEditingCategory(category);
        setModalOpen(true);
  };


  const handleSubmit = async (data) => {
    const action = editingCategory
    ? updateCategory({ data, id: editingCategory._id })
    : createCategory(data);

    try{
        const result = await dispatch(action);
        if(result.meta.requestStatus === 'rejected'){
            toast.error(result.payload || `Failed to ${editingCategory ? "update" : "create"} category`);
        }else{
            toast.success(result.payload.message || `Category ${editingCategory ? "updated" : "created"} successfully`);
            dispatch(fetchCategories());
            setModalOpen(false);
            dispatch(clearCurrentCategory());
        }
    }catch(error){
        toast.error("An error occurred: " + error.message);
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
    return () => {
      dispatch(resetCategoryState());
    };
  }, [dispatch]);

 
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Product Categories</h2>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <FaPlus /> Add New
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading categories...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Parent Category</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
                {categories.length === 0 ? (
                <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                        No categories found.
                    </td>
                    </tr>
                ) : ( 
                    categories.map((category) => (

                        <Row
                            key={category._id}
                            id={category._id}
                            name={category.name}
                            parent={category.parent}
                            isActive={category.isActive}
                            fullData={category}
                            onEdit={handleEdit}
                        />
                        ))
                    )}

            </tbody>
          </table>
        </div>
      )}
      <From
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingCategory}
        existingCategories={categories}
        mode={editingCategory ? 'edit' : 'add'}
      />
    </div>
  );
};

export default ProductCategories;