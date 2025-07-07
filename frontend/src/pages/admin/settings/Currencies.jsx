import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PageHeader from '../../../components/admin/PageHeader';
import { Table, CrudModal, ConfirmationDialog, ActionButtons, ReactPaginate } from '../../../components/common';
import {
  fetchCurrencies,
  deleteCurrency,
  resetCurrencyState
} from '../../../store/slices/currencySlice';
import { openModal, closeModal } from '../../../store/slices/modalSlice';

const Currencies = () => {
  const dispatch = useDispatch();
  const { currencies, loading, error } = useSelector(state => state.currency);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingCurrencyId, setDeletingCurrencyId] = useState(null);
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'symbol', header: 'Symbol' },
    { key: 'code', header: 'Code' },
    {
      key: 'exchangeRate',
      header: 'Exchange Rate',
      render: (item) => Number(item.exchangeRate).toFixed(4)
    },
    {
      key: 'isCryptocurrency',
      header: 'Crypto',
      render: (item) =>
        item.isCryptocurrency ? (
          <span className="text-green-700 font-semibold">Yes</span>
        ) : (
          <span className="text-gray-500">No</span>
        ),
    },
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
    dispatch(openModal({ entity: 'currency', mode: 'add' }));
  };

  const handleEdit = (currency) => {
    setConfirmOpen(false);
    dispatch(closeModal());
    dispatch(openModal({ entity: 'currency', mode: 'edit', initialData: currency }));
  };

  const handleDelete = (id) => {
    dispatch(closeModal());
    setDeletingCurrencyId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingCurrencyId) return;
    try {
      const result = await dispatch(deleteCurrency(deletingCurrencyId));
      if (deleteCurrency.fulfilled.match(result)) {
        toast.success('Currency deleted successfully!');
        const newTotalPages = Math.ceil((currencies.length - 1) / itemsPerPage);
        if (page >= newTotalPages && page > 0) {
          setPage(newTotalPages - 1);
        }
      } else {
        toast.error(error || 'Failed to delete currency');
      }
    } catch (err) {
      toast.error('An error occurred: ' + err.message);
    } finally {
      setDeletingCurrencyId(null);
      setConfirmOpen(false);
    }
  };

  useEffect(() => {
    dispatch(fetchCurrencies());
    return () => {
      dispatch(resetCurrencyState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetCurrencyState());
    }
  }, [error, dispatch]);

  const paginated = currencies.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const totalPages = Math.ceil(currencies.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setPage(selected);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <PageHeader title="Currencies" onAdd={handleAdd} />

      <Table
        columns={columns}
        data={paginated}
        loading={loading.fetch || loading.delete}
        emptyMessage="No currencies found."
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
        message="Are you sure you want to delete this currency?"
      />
    </div>
  );
};

export default Currencies;
