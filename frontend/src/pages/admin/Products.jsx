import React, { useState, useEffect, useCallback} from 'react';
import { FaPlus } from 'react-icons/fa';
import Form from '../../components/admin/product/Form';
import Row from '../../components/admin/product/Row';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'; 

import { 
  fetchProducts, 
  createProduct, 
  updateProduct,
  resetProductState,
  clearCurrentProduct
} from '../../store/slices/productSlice';

const Products = () => {

  const dispatch = useDispatch();
  const {products, loading } = useSelector(state => state.product);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
 
  console.log(products);

  const handleAdd = () => {
        setEditingProduct(null);
        setModalOpen(true);
  };

  const handleEdit = (product) => {
        setEditingProduct(product);
        setModalOpen(true);
  };


  const handleSubmit = async (data) => {
    const action = editingProduct
    ? updateProduct({ data, id: editingProduct._id })
    : createProduct(data);

    try{
        const result = await dispatch(action);
        if(result.meta.requestStatus === 'rejected'){
            toast.error(result.payload || `Failed to ${editingProduct ? "update" : "create"} product`);
        }else{
            toast.success(result.payload.message || `Product ${editingProduct ? "updated" : "created"} successfully`);
            dispatch(fetchProducts());
            setModalOpen(false);
            dispatch(clearCurrentProduct());
        }
    }catch(error){
        toast.error("An error occurred: " + error.message);
    }
  };

  useEffect(() => {
    dispatch(fetchProducts());
    return () => {
      dispatch(resetProductState());
    };
  }, [dispatch]);

 
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Products</h2>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <FaPlus /> Add New
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading products...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
                {products.length === 0 ? (
                <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                        No products found.
                    </td>
                    </tr>
                ) : ( 
                    products.map((product) => (

                        <Row
                            key={product._id}
                            id={product._id}
                            name={product.name}
                            isActive={product.isActive}
                            fullData={product}
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
        initialData={editingProduct}
        mode={editingProduct ? 'edit' : 'add'}
      />
    </div>
  );
};

export default Products;