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
  fetchAttributes,
  deleteAttribute,
  resetAttributeState,
} from '../../../store/slices/attributeSlice';
import { openModal, closeModal } from '../../../store/slices/modalSlice';
import { hasPermission } from '../../../utils/permissions';

const Attributes = () => {
  const dispatch = useDispatch();
  const { attributes, loading, error } = useSelector((state) => state.attribute);
  const { permissions } = useSelector((state) => state.auth);

  // Permission checks
  const canCreate = hasPermission(permissions, 'settings/attributes', 'create');
  const canEdit = hasPermission(permissions, 'settings/attributes', 'update');
  const canDelete = hasPermission(permissions, 'settings/attributes', 'delete');
  const canView = hasPermission(permissions, 'settings/attributes', 'view');
  const canRenderActions = canEdit || canDelete;

  const [page, setPage] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const itemsPerPage = 10;

  const handleAdd = () => {
    dispatch(closeModal());
    dispatch(openModal({ entity: 'attribute', mode: 'add' }));
  };

  const handleEdit = (attr) => {
    dispatch(closeModal());
    dispatch(openModal({ entity: 'attribute', mode: 'edit', initialData: attr }));
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const result = await dispatch(deleteAttribute(deletingId));
    if (deleteAttribute.fulfilled.match(result)) {
      toast.success('Attribute deleted successfully');
    } else {
      toast.error(result.payload || 'Failed to delete');
    }
    setConfirmOpen(false);
    setDeletingId(null);
  };

  useEffect(() => {
    if (canView) dispatch(fetchAttributes());
    return () => {
      dispatch(resetAttributeState());
    };
  }, [dispatch, canView]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAttributeState());
    }
  }, [error, dispatch]);

  const paginatedData = attributes.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const totalPages = Math.ceil(attributes.length / itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <PageHeader title="Attributes" onAdd={canCreate ? handleAdd : null} />

      <Table
        columns={[{ key: 'name', header: 'Name' }]}
        data={paginatedData}
        loading={loading.fetch || loading.delete}
        emptyMessage="No attributes found."
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
            previousLabel="Previous"
            nextLabel="Next"
            breakLabel="..."
            containerClassName="flex gap-2"
            pageClassName="px-3 py-1 border border-gray-300 rounded-md"
            activeClassName="bg-blue-600 text-white border-blue-600"
          />
        </div>
      )}

      <CrudModal />
      <ConfirmationDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this attribute?"
      />
    </div>
  );
};

export default Attributes;
