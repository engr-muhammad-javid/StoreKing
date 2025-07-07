import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PageHeader from '../../../components/admin/PageHeader';
import { Table, CrudModal, ConfirmationDialog, ActionButtons, ReactPaginate } from '../../../components/common';
import { 
  fetchBrands,
  deleteBrand,
  resetBrandState
} from '../../../store/slices/brandSlice';
import { openModal, closeModal } from '../../../store/slices/modalSlice';

const Brands = () => {
  const dispatch = useDispatch();
  const { brands, loading, error } = useSelector(state => state.brand);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingBrandId, setDeletingBrandId] = useState(null);
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
    {
      key: 'image',
      header: 'Image',
      render: (item) =>
        item.image ? (
          <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
        ) : (
          'No Image'
        ),
    },
    { key: 'slug', header: 'Slug' },
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
    dispatch(openModal({ entity: 'brand', mode: 'add' }));
  };

  const handleEdit = (brand) => {
    setConfirmOpen(false);
    dispatch(closeModal());
    dispatch(openModal({ entity: 'brand', mode: 'edit', initialData: brand }));
  };

  const handleDelete = (id) => {
    dispatch(closeModal());
    setDeletingBrandId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingBrandId) {
      setConfirmOpen(false);
      return;
    }
    try {
      const result = await dispatch(deleteBrand(deletingBrandId));
      if (deleteBrand.fulfilled.match(result)) {
        toast.success('Brand deleted successfully!');
        const newTotalPages = Math.ceil((brands.length - 1) / itemsPerPage);
        if (page >= newTotalPages && page > 0) {
          setPage(newTotalPages - 1);
        }
      } else {
        toast.error(error || 'Failed to delete brand');
      }
    } catch (err) {
      toast.error('An error occurred: ' + err.message);
    } finally {
      setDeletingBrandId(null);
      setConfirmOpen(false);
    }
  };

  useEffect(() => {
    dispatch(fetchBrands());
    setConfirmOpen(false);
    return () => {
      dispatch(resetBrandState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetBrandState());
    }
  }, [error, dispatch]);

  const paginatedBrands = brands.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const totalPages = Math.ceil(brands.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setPage(selected);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <PageHeader title="Product Brands" onAdd={handleAdd} />

      <Table
        columns={columns}
        data={paginatedBrands}
        loading={loading.fetch || loading.delete}
        emptyMessage="No brands found."
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
        message="Are you sure you want to delete this brand?"
      />
    </div>
  );
};

export default Brands;
