// src/pages/admin/Taxes.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PageHeader from '../../../components/admin/PageHeader';
import {
  Table,
  CrudModal,
  ConfirmationDialog,
  ActionButtons,
  ReactPaginate,
} from '../../../components/common';
import {
  fetchTaxes,
  deleteTax,
  resetTaxState,
} from '../../../store/slices/taxSlice';
import { openModal, closeModal } from '../../../store/slices/modalSlice';

const Taxes = () => {
  const dispatch = useDispatch();
  const { taxes, loading, error } = useSelector((state) => state.tax);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'code', header: 'Code' },
    { key: 'taxRate', header: 'Rate (%)' },
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
    dispatch(openModal({ entity: 'tax', mode: 'add' }));
  };

  const handleEdit = (item) => {
    setConfirmOpen(false);
    dispatch(closeModal());
    dispatch(openModal({ entity: 'tax', mode: 'edit', initialData: item }));
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    const result = await dispatch(deleteTax(deletingId));
    if (deleteTax.fulfilled.match(result)) {
      toast.success('Tax deleted successfully!');
      const newTotalPages = Math.ceil((taxes.length - 1) / itemsPerPage);
      if (page >= newTotalPages && page > 0) {
        setPage(newTotalPages - 1);
      }
    } else {
      toast.error(error || 'Failed to delete tax');
    }
    setDeletingId(null);
    setConfirmOpen(false);
  };

  useEffect(() => {
    dispatch(fetchTaxes());
    return () => {
      dispatch(resetTaxState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetTaxState());
    }
  }, [error, dispatch]);

  const paginatedData = taxes.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const totalPages = Math.ceil(taxes.length / itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <PageHeader title="Taxes" onAdd={handleAdd} />

      <Table
        columns={columns}
        data={paginatedData}
        loading={loading.fetch || loading.delete}
        emptyMessage="No taxes found."
        renderRowActions={(item) => (
          <ActionButtons onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item._id)} />
        )}
      />

      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <ReactPaginate
            previousLabel="Previous"
            nextLabel="Next"
            pageCount={totalPages}
            onPageChange={({ selected }) => setPage(selected)}
            containerClassName="flex gap-2 items-center"
            pageClassName="px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
            activeClassName="bg-blue-600 text-white border-blue-600"
            previousClassName="px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
            nextClassName="px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
            disabledClassName="opacity-50 cursor-not-allowed"
            breakClassName="px-3 py-1"
          />
        </div>
      )}

      <CrudModal />
      <ConfirmationDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this tax?"
      />
    </div>
  );
};

export default Taxes;
