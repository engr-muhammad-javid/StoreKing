import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PageHeader from "../../../components/admin/PageHeader";
import {
  Table,
  CrudModal,
  ConfirmationDialog,
  ActionButtons,
  ReactPaginate
} from "../../../components/common";
import {
  fetchOutlets,
  deleteOutlet,
  resetOutletState
} from "../../../store/slices/outletSlice";
import { openModal, closeModal } from "../../../store/slices/modalSlice";
import { hasPermission } from "../../../utils/permissions";

const Outlets = () => {
  const dispatch = useDispatch();
  const { outlets, loading, error } = useSelector(state => state.outlet);
  const { permissions } = useSelector(state => state.auth);

  // Permissions
  const canCreate = hasPermission(permissions, "settings/outlets", "create");
  const canEdit = hasPermission(permissions, "settings/outlets", "update");
  const canDelete = hasPermission(permissions, "settings/outlets", "delete");
  const canView = hasPermission(permissions, "settings/outlets", "view");
  const canRenderActions = canEdit || canDelete;

  const [page, setPage] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [delId, setDelId] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    if (canView) dispatch(fetchOutlets());
    return () => dispatch(resetOutletState());
  }, [dispatch, canView]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetOutletState());
    }
  }, [error, dispatch]);

  const handleAdd = () => {
    dispatch(closeModal());
    dispatch(openModal({ entity: "outlet", mode: "add" }));
  };

  const handleEdit = (outlet) => {
    dispatch(closeModal());
    dispatch(openModal({ entity: "outlet", mode: "edit", initialData: outlet }));
  };

  const handleDelete = (id) => {
    setDelId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const res = await dispatch(deleteOutlet(delId));
    if (deleteOutlet.fulfilled.match(res)) {
      toast.success("Deleted outlet");
    } else {
      toast.error(res.payload || "Failed");
    }
    setConfirmOpen(false);
    setDelId(null);
  };

  const columns = [
    { key: "name", header: "Name" },
    {
      key: "isActive",
      header: "Status",
      render: (outlet) => (
        <span className={`px-2 py-1 rounded text-sm ${
          outlet.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {outlet.isActive ? "Active" : "Inactive"}
        </span>
      )
    }
  ];

  const paginated = outlets.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const totalPages = Math.ceil(outlets.length / itemsPerPage);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <PageHeader title="Outlets" onAdd={canCreate ? handleAdd : null} />

      <Table
        columns={columns}
        data={paginated}
        loading={loading.fetch || loading.delete}
        emptyMessage="No outlets found."
        renderRowActions={
          canRenderActions
            ? (outlet) => (
                <ActionButtons
                  onEdit={canEdit ? () => handleEdit(outlet) : null}
                  onDelete={canDelete ? () => handleDelete(outlet._id) : null}
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
        onConfirm={confirmDelete}
        onClose={() => setConfirmOpen(false)}
        message="Delete this outlet?"
      />
    </div>
  );
};

export default Outlets;
