// src/pages/admin/sliders/Sliders.jsx
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
  fetchSliders,
  deleteSlider,
  resetSliderState,
} from '../../../store/slices/sliderSlice';
import { openModal, closeModal } from '../../../store/slices/modalSlice';
import { hasPermission } from '../../../utils/permissions';

const Sliders = () => {
  const dispatch = useDispatch();
  const { sliders, loading, error } = useSelector((state) => state.slider);
  const { permissions } = useSelector(state => state.auth);

  // Check permissions
  const canCreate = hasPermission(permissions, 'settings/sliders', 'create');
  const canEdit = hasPermission(permissions, 'settings/sliders', 'update');
  const canDelete = hasPermission(permissions, 'settings/sliders', 'delete');
  const canView = hasPermission(permissions, 'settings/sliders', 'view');
  const canRenderActions = canEdit || canDelete;
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  const columns = [
    { key: 'title', header: 'Title' },
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
    dispatch(openModal({ entity: 'slider', mode: 'add' }));
  };

  const handleEdit = (slider) => {
    dispatch(closeModal());
    dispatch(openModal({ entity: 'slider', mode: 'edit', initialData: slider }));
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    const result = await dispatch(deleteSlider(deletingId));
    if (deleteSlider.fulfilled.match(result)) {
      toast.success('Slider deleted successfully!');
    } else {
      toast.error(result.payload || 'Failed to delete slider');
    }
    setDeletingId(null);
    setConfirmOpen(false);
  };

  useEffect(() => {
    if (canView) dispatch(fetchSliders());
    return () => dispatch(resetSliderState());
  }, [dispatch, canView]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetSliderState());
    }
  }, [error, dispatch]);

  const paginated = sliders.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const totalPages = Math.ceil(sliders.length / itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <PageHeader title="Sliders" onAdd={canCreate ? handleAdd : null} />

      <Table
        columns={columns}
        data={paginated}
        loading={loading.fetch}
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
            previousLabel="Previous"
            nextLabel="Next"
            breakLabel="..."
            pageCount={totalPages}
            onPageChange={({ selected }) => setPage(selected)}
            containerClassName="flex gap-2"
            activeClassName="bg-green-600 text-white"
            pageClassName="px-3 py-1 border rounded-md cursor-pointer"
            nextClassName="px-3 py-1 border rounded-md cursor-pointer"
            previousClassName="px-3 py-1 border rounded-md cursor-pointer"
          />
        </div>
      )}

      <CrudModal />

      <ConfirmationDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this slider?"
      />
    </div>
  );
};

export default Sliders;
