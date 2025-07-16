import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../../../components/admin/PageHeader';
import {
  Table,
  CrudModal,
  ConfirmationDialog,
  ActionButtons,
  ReactPaginate,
} from '../../../components/common';
import {
  fetchLanguages,
  deleteLanguage,
  resetLanguageState,
} from '../../../store/slices/languageSlice';
import { openModal, closeModal } from '../../../store/slices/modalSlice';
import { toast } from 'react-toastify';
import { hasPermission } from '../../../utils/permissions';

const Languages = () => {
  const dispatch = useDispatch();
  const { languages, loading } = useSelector((state) => state.language);
  const { permissions } = useSelector((state) => state.auth);

  // Permissions
  const canCreate = hasPermission(permissions, 'localization/languages', 'create');
  const canEdit = hasPermission(permissions, 'localization/languages', 'update');
  const canDelete = hasPermission(permissions, 'localization/languages', 'delete');
  const canView = hasPermission(permissions, 'localization/languages', 'view');
  const canRenderActions = canEdit || canDelete;

  const [page, setPage] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    if (canView) dispatch(fetchLanguages());
    return () => dispatch(resetLanguageState());
  }, [dispatch, canView]);

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'code', header: 'Code' },
    {
      key: 'isActive',
      header: 'Status',
      render: (item) => (
        <span className={`px-2 py-1 text-sm rounded ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  const handleAdd = () => {
    dispatch(closeModal());
    dispatch(openModal({ entity: 'language', mode: 'add' }));
  };

  const handleEdit = (item) => {
    dispatch(closeModal());
    dispatch(openModal({ entity: 'language', mode: 'edit', initialData: item }));
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const res = await dispatch(deleteLanguage(deleteId));
    toast[res.meta.requestStatus === 'fulfilled' ? 'success' : 'error'](res.payload || 'Delete failed');
    setConfirmOpen(false);
    setDeleteId(null);
  };

  const paginated = languages.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const totalPages = Math.ceil(languages.length / itemsPerPage);

  return (
    <div className="bg-white shadow p-6 rounded">
      <PageHeader title="Languages" onAdd={canCreate ? handleAdd : null} />
      <Table
        columns={columns}
        data={paginated}
        loading={loading.fetch}
        emptyMessage="No languages found."
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
        message="Are you sure you want to delete this language?"
      />
    </div>
  );
};

export default Languages;
