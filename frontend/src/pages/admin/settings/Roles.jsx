import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PageHeader from "../../../components/admin/PageHeader";
import {
  Table,
  CrudModal,
  ConfirmationDialog,
  ActionButtons,
  ReactPaginate,
} from "../../../components/common";
import {
  fetchRoles,
  deleteRole,
  resetRoleState,
} from "../../../store/slices/roleSlice";
import { openModal, closeModal } from "../../../store/slices/modalSlice";
import { toast } from "react-toastify";
import { hasPermission } from "../../../utils/permissions";

const Roles = () => {
  const dispatch = useDispatch();
  const { roles, loading, error } = useSelector((state) => state.role);
  const { permissions } = useSelector((state) => state.auth);

  const canCreate = hasPermission(permissions, "settings/roles", "create");
  const canEdit = hasPermission(permissions, "settings/roles", "update");
  const canDelete = hasPermission(permissions, "settings/roles", "delete");
  const canView = hasPermission(permissions, "settings/roles", "view");
  const canRenderActions = canEdit || canDelete;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const res = await dispatch(deleteRole(deleteId));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Role deleted");
    } else {
      toast.error(res.payload || "Failed to delete role");
    }
    setConfirmOpen(false);
    setDeleteId(null);
  };

  const handleAdd = () => {
    dispatch(closeModal());
    dispatch(openModal({ entity: "role", mode: "add" }));
  };

  const handleEdit = (role) => {
    dispatch(closeModal());
    dispatch(openModal({ entity: "role", mode: "edit", initialData: role }));
  };

  useEffect(() => {
    if (canView) dispatch(fetchRoles());
    return () => dispatch(resetRoleState());
  }, [dispatch, canView]);

  const columns = [
    { key: "name", header: "Name" },
  ];

  const paginated = roles.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const totalPages = Math.ceil(roles.length / itemsPerPage);

  return (
    <div className="bg-white shadow p-6 rounded">
      <PageHeader title="Roles" onAdd={canCreate ? handleAdd : null} />

      <Table
        columns={columns}
        data={paginated}
        loading={loading.fetch || loading.delete}
        emptyMessage="No roles found."
        renderRowActions={
          canRenderActions
            ? (r) => (
                <ActionButtons
                  onEdit={canEdit ? () => handleEdit(r) : null}
                  onDelete={canDelete ? () => handleDelete(r._id) : null}
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
        message="Delete this role?"
      />
    </div>
  );
};

export default Roles;
