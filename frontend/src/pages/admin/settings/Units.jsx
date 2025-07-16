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
  fetchUnits,
  deleteUnit,
  resetUnitState,
} from '../../../store/slices/unitSlice';
import { openModal, closeModal } from '../../../store/slices/modalSlice';
import { hasPermission } from '../../../utils/permissions';

const Units = () => {
  const dispatch = useDispatch();
  const { units, loading, error } = useSelector((state) => state.unit);
  const { permissions } = useSelector((state) => state.auth);

  const canView = hasPermission(permissions, 'settings/units', 'view');
  const canCreate = hasPermission(permissions, 'settings/units', 'create');
  const canEdit = hasPermission(permissions, 'settings/units', 'update');
  const canDelete = hasPermission(permissions, 'settings/units', 'delete');
  const canRenderActions = canEdit || canDelete;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingUnitId, setDeletingUnitId] = useState(null);
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'code', header: 'Code' },
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
    dispatch(closeModal());
    dispatch(openModal({ entity: 'unit', mode: 'add' }));
  };

  const handleEdit = (unit) => {
    dispatch(closeModal());
    dispatch(openModal({ entity: 'unit', mode: 'edit', initialData: unit }));
  };

  const handleDelete = (id) => {
    setDeletingUnitId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingUnitId) return;

    try {
      const result = await dispatch(deleteUnit(deletingUnitId));
      if (deleteUnit.fulfilled.match(result)) {
        toast.success('Unit deleted successfully!');
        const newTotalPages = Math.ceil((units.length - 1) / itemsPerPage);
        if (page >= newTotalPages && page > 0) {
          setPage(newTotalPages - 1);
        }
      } else {
        toast.error(error || 'Failed to delete unit');
      }
    } catch (err) {
      toast.error('An error occurred: ' + err.message);
    } finally {
      setDeletingUnitId(null);
      setConfirmOpen(false);
    }
  };

  useEffect(() => {
    if (canView) dispatch(fetchUnits());
    return () => dispatch(resetUnitState());
  }, [dispatch, canView]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetUnitState());
    }
  }, [error, dispatch]);

  const paginatedUnits = units.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const totalPages = Math.ceil(units.length / itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <PageHeader title="Units" onAdd={canCreate ? handleAdd : null} />

      <Table
        columns={columns}
        data={paginatedUnits}
        loading={loading.fetch || loading.delete}
        emptyMessage="No units found."
        renderRowActions={
          canRenderActions
            ? (item) => (
                <ActionButtons
                  onEdit={canEdit ? () => handleEdit(item) : null}
                  onDelete={canDelete ? () => handleDelete(item._id) : null}
                />
              )
            : null
        }
      />

      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <ReactPaginate
            pageCount={totalPages}
            onPageChange={({ selected }) => setPage(selected)}
            previousLabel="Prev"
            nextLabel="Next"
            breakLabel="..."
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
        message="Are you sure you want to delete this unit?"
      />
    </div>
  );
};

export default Units;
