import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
// import CategoryModal from '../../../components/admin/settings/category/CategoryModal';
import CategoryRow from '../../../components/admin/settings/category/CategoryRow';
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
  const { 
    categories, 
    loading, 
    error, 
    success,
    currentCategory 
  } = useSelector(state => state.productCategory);

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
      if (editingCategory) {
          try {
      
              const result = await dispatch(updateCategory(data));
      
              if (updateCategory.rejected.match(result)) {
                  toast.error(result.payload || "Catwegory Not Updated");
              } else {
                  toast.success(result.payload.message || "Category Updated successfully!");
              }
      
          } catch (error) {
            toast.error("Failed to update Address: " + error.message);
          }


      } else {
          try {
      
              const result = await dispatch(createCategory(data));
      
              if (createCategory.rejected.match(result)) {
                  toast.error(result.payload || "Category Not Created");
              } else {
                  toast.success(result.payload.message || "Category Created successfully!");
              }
      
          } catch (error) {
            toast.error("Failed to create Category: " + error.message);
          }
      }
  };



  useEffect(() => {
    dispatch(fetchCategories());
    return () => {
      dispatch(resetCategoryState());
    };
  }, [dispatch]);

 
  // useEffect(() => {
  //   if (error) {
  //     toast.error(error);
  //     dispatch(resetCategoryState());
  //   }
  // }, [error, dispatch]);

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
              {categories.map((category, index) => (

                  <CategoryRow
                      key={`category-${index}`}
                      id={category._id}
                      name={category.name}
                      parent={category.parent}
                      isActive={category.isActive}
                      fullData={category}
                      onEdit={handleEdit}
                  />
                ))}

            </tbody>
          </table>
        </div>
      )}

      {/* <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditMode(false);
          setCategoryForm({ name: '', parent: null, isActive: true });
        }}
        categoryData={categoryForm}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        existingCategories={categories}
        isEdit={editMode}
        loading={loading}
      /> */}
    </div>
  );
};

export default ProductCategories;