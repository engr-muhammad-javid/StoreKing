import React, { useEffect, useState } from 'react';
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
  fetchBenefits,
  deleteBenefit,
  resetBenefitState,
} from '../../../store/slices/benefitSlice';
import { openModal, closeModal } from '../../../store/slices/modalSlice';
import { hasPermission } from '../../../utils/permissions';

const Benefits = () => {
  const dispatch = useDispatch();
  const { benefits, loading } = useSelector((state) => state.benefit);
  const { permissions } = useSelector((state) => state.auth);

  // Permission checks
  const canCreate = hasPermission(permissions, 'settings/benefits', 'create');
  const canEdit = hasPermission(permissions, 'settings/benefits', 'update');
  const canDelete = hasPermission(permissions, 'settings/benefits', 'delete');
  const canView = hasPermission(permissions, 'settings/benefits', 'view');
  const canRenderActions = canEdit || canDelete;

  const [page, setPage] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [delId, setDelId] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    if (canView) dispatch(fetchBenefits());
    return () => dispatch(resetBenefitState());
  }, [dispatch, canView]);

  const handleAdd = () => {
    dispatch(closeModal());
    dispatch(openModal({ entity: 'benefit', mode: 'add' }));
  };

  const handleEdit = (item) => {
    dispatch(closeModal());
    dispatch(openModal({ entity: 'benefit', mode: 'edit', initialData: item }));
  };

  const handleDelete = (id) => {
    setDelId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const res = await dispatch(deleteBenefit(delId));
    toast[res.meta.requestStatus === 'fulfilled' ? 'success' : 'error'](res.payload || 'Error deleting benefit');
    setConfirmOpen(false);
    setDelId(null);
  };

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'description', header: 'Description' },
    {
      key: 'isActive',
      header: 'Status',
      render: (item) => (
        <span
          className={`px-2 py-1 rounded text-sm ${
            item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  const paginated = benefits.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const pageCount = Math.ceil(benefits.length / itemsPerPage);

  return (
    <div className="bg-white shadow p-6 rounded">
      <PageHeader title="Benefits" onAdd={canCreate ? handleAdd : null} />

      <Table
        columns={columns}
        data={paginated}
        loading={loading.fetch || loading.delete}
        emptyMessage="No benefits found."
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

      {pageCount > 1 && (
        <div className="flex justify-end mt-4">
          <ReactPaginate
            pageCount={pageCount}
            onPageChange={({ selected }) => setPage(selected)}
            previousLabel="Prev"
            nextLabel="Next"
            containerClassName="flex gap-2"
            pageClassName="px-3 py-1 border rounded"
            activeClassName="bg-blue-600 text-white"
          />
        </div>
      )}

      <CrudModal />
      <ConfirmationDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Delete this benefit?"
      />
    </div>
  );
};

export default Benefits;
