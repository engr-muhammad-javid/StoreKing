import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PageHeader from '../../components/admin/PageHeader';
import { Table, CrudModal, ConfirmationDialog, ActionButtons, ReactPaginate } from '../../components/common';
import {
  fetchProducts,
  deleteProduct,
  resetProductState,
} from '../../store/slices/productSlice';
import { openModal, closeModal } from '../../store/slices/modalSlice';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [page, setPage] = useState(0);
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
    setConfirmOpen(false);
    dispatch(closeModal());
    dispatch(openModal({ entity: 'product', mode: 'add' }));
  };

  const handleEdit = (product) => {
    setConfirmOpen(false);
    dispatch(closeModal());
    dispatch(openModal({ entity: 'product', mode: 'edit', initialData: product }));
  };

  const handleDelete = (id) => {
    dispatch(closeModal());
    setDeletingProductId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingProductId) {
      setConfirmOpen(false);
      return;
    }
    try {
      const result = await dispatch(deleteProduct(deletingProductId));
      if (deleteProduct.fulfilled.match(result)) {
        toast.success('Product deleted successfully!');
        const newTotalPages = Math.ceil((products.length - 1) / itemsPerPage);
        if (page >= newTotalPages && page > 0) {
          setPage(newTotalPages - 1);
        }
      } else {
        toast.error(error || 'Failed to delete product');
      }
    } catch (err) {
      toast.error('An error occurred: ' + err.message);
    } finally {
      setDeletingProductId(null);
      setConfirmOpen(false);
    }
  };

  useEffect(() => {
    dispatch(fetchProducts());
    setConfirmOpen(false);
    return () => {
      dispatch(resetProductState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetProductState());
    }
  }, [error, dispatch]);

  const paginatedProducts = products.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setPage(selected);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <PageHeader title="Products" onAdd={handleAdd} />

      <Table
        columns={columns}
        data={paginatedProducts}
        loading={loading.fetch || loading.delete}
        emptyMessage="No products found."
        renderRowActions={(item) => (
          <ActionButtons
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item._id)}
          />
        )}
      />

      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'...'}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            containerClassName={'flex gap-2 items-center'}
            pageClassName={'px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100'}
            activeClassName={'bg-blue-600 text-white border-blue-600'}
            previousClassName={'px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100'}
            nextClassName={'px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100'}
            disabledClassName={'opacity-50 cursor-not-allowed'}
            breakClassName={'px-3 py-1'}
          />
        </div>
      )}

      <CrudModal />

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