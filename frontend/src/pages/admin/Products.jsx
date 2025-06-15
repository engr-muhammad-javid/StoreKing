import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Table from '../../components/common/Table';
import CrudModal from '../../components/common/CrudModal';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import ActionButtons from '../../components/common/ActionButtons';
import ProductForm from '../../components/admin/product/ProductForm';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  resetProductState,
} from '../../store/slices/productSlice';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const columns = [
    { key: 'name', header: 'Name' },
    {
      key: 'category_id',
      header: 'Category',
      render: (item) => item.category_id?.name || 'N/A',
    },
    { key: 'price', header: 'Buying Price' },
    { key: 'salePrice', header: 'Selling Price' },
    {
      key: 'isActive',
      header: 'Status',
      render: (item) => (
        <span
          className={`px-3 py-1 text-xs rounded-full font-semibold ${
            item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeletingProductId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const result = await dispatch(deleteProduct(deletingProductId));
      if (deleteProduct.fulfilled.match(result)) {
        toast.success('Product deleted successfully!');
        dispatch(fetchProducts());
      } else {
        toast.error(result.payload || 'Failed to delete product');
      }
    } catch (error) {
      toast.error('An error occurred: ' + error.message);
    }
  };

  const handleSubmit = async (data) => {
    const action = editingProduct
      ? updateProduct({ data, id: editingProduct._id })
      : createProduct(data);

    try {
      const result = await dispatch(action);
      if (result.meta.requestStatus === 'rejected') {
        toast.error(result.payload?.message || `Failed to ${editingProduct ? 'update' : 'create'} product`);
      } else {
        toast.success(result.payload?.message || `Product ${editingProduct ? 'updated' : 'created'} successfully`);
        dispatch(fetchProducts());
        setModalOpen(false);
      }
    } catch (error) {
      toast.error('An error occurred: ' + error.message);
    }
  };

  useEffect(() => {
    dispatch(fetchProducts());
    return () => {
      dispatch(resetProductState());
    };
  }, [dispatch]);

  // Basic pagination
  const paginatedProducts = products.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(products.length / itemsPerPage);

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

      <Table
        columns={columns}
        data={paginatedProducts}
        loading={loading}
        emptyMessage="No products found."
        renderRowActions={(item) => (
          <ActionButtons
            // onView={() => alert('View not implemented')} // Implement view logic if needed
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item._id)}
          />
        )}
      />

      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">{`Page ${page} of ${totalPages}`}</span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <CrudModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        FormComponent={ProductForm}
        initialData={editingProduct}
        mode={editingProduct ? 'edit' : 'add'}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
      />

      <ConfirmationDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this product?"
      />
    </div>
  );
};

export default Products;