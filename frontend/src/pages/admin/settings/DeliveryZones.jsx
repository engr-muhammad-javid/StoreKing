import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PageHeader from '../../../components/admin/PageHeader';
import { Table, CrudModal, ConfirmationDialog, ActionButtons, ReactPaginate } from '../../../components/common';
import {
  fetchDeliveryZones,
  deleteDeliveryZone,
  resetDeliveryZoneState
} from '../../../store/slices/deliveryZoneSlice';
import { openModal, closeModal } from '../../../store/slices/modalSlice';

const DeliveryZones = () => {
  const dispatch = useDispatch();
  const { deliveryZones, loading, error } = useSelector(state => state.deliveryZone);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'latitude', header: 'Latitude' },
    { key: 'longitude', header: 'Longitude' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'deliveryRadiusKm', header: 'Radius (KM)' },
    { key: 'deliveryChargePerKm', header: 'Charge/KM' },
    { key: 'minimumOrderAmount', header: 'Min Order' },
    {
      key: 'isActive',
      header: 'Status',
      render: (item) => (
        <span className={`px-3 py-1 text-xs rounded-full font-semibold ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  const handleAdd = () => {
    dispatch(closeModal());
    dispatch(openModal({ entity: 'deliveryZone', mode: 'add' }));
  };

  const handleEdit = (item) => {
    dispatch(closeModal());
    dispatch(openModal({ entity: 'deliveryZone', mode: 'edit', initialData: item }));
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      const result = await dispatch(deleteDeliveryZone(deletingId));
      if (deleteDeliveryZone.fulfilled.match(result)) {
        toast.success('Delivery Zone deleted successfully!');
      } else {
        toast.error(error || 'Failed to delete Delivery Zone');
      }
    } catch (err) {
      toast.error('An error occurred: ' + err.message);
    } finally {
      setDeletingId(null);
      setConfirmOpen(false);
    }
  };

  useEffect(() => {
    dispatch(fetchDeliveryZones());
    return () => dispatch(resetDeliveryZoneState());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetDeliveryZoneState());
    }
  }, [error, dispatch]);

  const paginated = deliveryZones.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const totalPages = Math.ceil(deliveryZones.length / itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <PageHeader title="Delivery Zones" onAdd={handleAdd} />

      <Table
        columns={columns}
        data={paginated}
        loading={loading.fetch || loading.delete}
        emptyMessage="No delivery zones found."
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
            previousLabel="Previous"
            nextLabel="Next"
            pageCount={totalPages}
            onPageChange={({ selected }) => setPage(selected)}
            containerClassName="flex gap-2 items-center"
            pageClassName="px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
            activeClassName="bg-blue-600 text-white border-blue-600"
          />
        </div>
      )}

      <CrudModal />

      <ConfirmationDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this Delivery Zone?"
      />
    </div>
  );
};

export default DeliveryZones;
