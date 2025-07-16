import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  createSupplier,
  updateSupplier,
} from "../../../store/slices/supplierSlice";
import { closeModal } from "../../../store/slices/modalSlice";
import {
  initializeForm,
  updateFormField,
  setFormErrors,
  setSubmitting,
  resetForm,
} from "../../../store/slices/formSlice";
import { TextInput, Textarea, SwitchToggle, ImageUploader } from "../../common";
import { IoClose } from "react-icons/io5";
import { FaSave } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const SupplierForm = ({ initialData = {}, mode = "add" }) => {
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.form.forms.supplier || {});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    dispatch(
      initializeForm({
        entity: "supplier",
        initialData: {
          company: initialData.company || "",
          name: initialData.name || "",
          email: initialData.email || "",
          phone: initialData.phone || "",
          image: initialData.image || "",
          address: initialData.address || "",
        },
        mode,
      })
    );
  }, [dispatch, initialData, mode]);

  const validateForm = () => {
    const errors = {};
    if (!formState.formData?.name) errors.name = "Name is required";
    if (!formState.formData?.email) errors.email = "Email is required";
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch(updateFormField({
      entity: "supplier",
      name,
      value: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (formState.isSubmitting || hasSubmitted) return;
      setHasSubmitted(true);

      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        dispatch(setFormErrors({ entity: "supplier", errors }));
        Object.entries(errors).forEach(([field, message]) =>
          toast.error(message)
        );
        setHasSubmitted(false);
        return;
      }

      dispatch(setSubmitting({ entity: "supplier", isSubmitting: true }));
      try {
        const action = mode === "edit"
          ? updateSupplier({ id: initialData._id, data: formState.formData })
          : createSupplier(formState.formData);
        const result = await dispatch(action);

        if (result.meta.requestStatus === "rejected") throw new Error(result.payload);

        toast.success(`Supplier ${mode === "edit" ? "updated" : "added"} successfully!`);
        dispatch(closeModal());
        dispatch(resetForm({ entity: "supplier" }));
      } catch (err) {
        toast.error("Submission failed: " + err.message);
      } finally {
        dispatch(setSubmitting({ entity: "supplier", isSubmitting: false }));
        setHasSubmitted(false);
      }
    },
    [dispatch, formState, mode, initialData, hasSubmitted]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput label="Company" name="company" value={formState.formData?.company || ""} onChange={handleChange} />
        <TextInput label="Name *" name="name" required value={formState.formData?.name || ""} onChange={handleChange} error={formState.errors?.name} />
        <TextInput label="Email *" name="email" required value={formState.formData?.email || ""} onChange={handleChange} error={formState.errors?.email} />
        <TextInput label="Phone" name="phone" value={formState.formData?.phone || ""} onChange={handleChange} />
        <ImageUploader name="image" label="Image" value={formState.formData?.image} onChange={handleChange} />
        <Textarea label="Address" name="address" value={formState.formData?.address || ""} onChange={handleChange} />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => {
            dispatch(closeModal());
            dispatch(resetForm({ entity: "supplier" }));
          }}
          className="px-4 py-2 border text-gray-700 rounded-md"
        >
          <IoClose className="inline mr-1" />
          Close
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? <ClipLoader size={16} color="#fff" className="mr-2" /> : <FaSave className="inline mr-1" />}
          {formState.isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default SupplierForm;
