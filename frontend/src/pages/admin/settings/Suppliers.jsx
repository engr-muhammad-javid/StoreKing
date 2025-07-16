import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PageHeader from "../../../components/admin/PageHeader";
import {
  Table,
  CrudModal,
  ConfirmationDialog,
  ActionButtons,
  ReactPaginate,
} from "../../../components/common";
import {
  fetchSuppliers,
  deleteSupplier,
  resetSupplierState,
} from "../../../store/slices/supplierSlice";
import { openModal, closeModal } from "../../../store/slices/modalSlice";
import { hasPermission } from "../../../utils/permissions";

const Suppliers = () => {
  const dispatch = useDispatch();
  const { suppliers, loading, error } = useSelector((state) => state.supplier);
  const { permissions } = useSelector((state) => state.auth);

  // Permission checks
  const canCreate = hasPermission(permissions, "contacts/suppliers", "create");
  const canEdit = hasPermission(permissions, "contacts/suppliers", "update");
  const canDelete = hasPermission(permissions, "contacts/suppliers", "delete");
  const canView = hasPermission(permissions, "contacts/suppliers", "view");
  const canRenderActions = canEdit || canDelete;

  const [page, setPage] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    if (canView) dispatch(fetchSuppliers());
    return () => dispatch(resetSupplierState());
  }, [dispatch, canView]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetSupplierState());
    }
  }, [error, dispatch]);

  const handleAdd = () => {
    dispatch(closeModal());
    dispatch(openModal({ entity: "supplier", mode: "add" }));
  };

  const handleEdit = (data) => {
    dispatch(closeModal());
    dispatch(openModal({ entity: "supplier", mode: "edit", initialData: data }));
  };

  const handleDelete = (id) => {
    setConfirmOpen(true);
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    const result = await dispatch(deleteSupplier(deletingId));
    if (deleteSupplier.fulfilled.match(result)) {
      toast.success("Deleted successfully");
    } else {
      toast.error(result.payload || "Failed to delete");
    }
    setConfirmOpen(false);
    setDeletingId(null);
  };

  const columns = [
    { key: "company", header: "Company" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
  ];

  const paginated = suppliers.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const totalPages = Math.ceil(suppliers.length / itemsPerPage);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <PageHeader title="Suppliers" onAdd={canCreate ? handleAdd : null} />

      <Table
        columns={columns}
        data={paginated}
        loading={loading.fetch}
        emptyMessage="No suppliers found."
        renderRowActions={
          canRenderActions
            ? (row) => (
                <ActionButtons
                  onEdit={canEdit ? () => handleEdit(row) : null}
                  onDelete={canDelete ? () => handleDelete(row._id) : null}
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
            pageClassName="px-3 py-1 border rounded-md"
            activeClassName="bg-blue-600 text-white"
          />
        </div>
      )}

      <CrudModal />
      <ConfirmationDialog
        isOpen={confirmOpen}
        onConfirm={confirmDelete}
        onClose={() => setConfirmOpen(false)}
        message="Are you sure you want to delete this supplier?"
      />
    </div>
  );
};

export default Suppliers;
