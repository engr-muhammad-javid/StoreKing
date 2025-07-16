import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  createOutlet,
  updateOutlet
} from "../../../store/slices/outletSlice";
import { fetchDeliveryZones } from "../../../store/slices/deliveryZoneSlice";
import { closeModal } from "../../../store/slices/modalSlice";
import {
  initializeForm,
  updateFormField,
  setFormErrors,
  setSubmitting,
  resetForm
} from "../../../store/slices/formSlice";
import {
  TextInput,
  Textarea,
  SelectInput,
  SwitchToggle
} from "../../common";
import { IoClose } from "react-icons/io5";
import { FaSave } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const OutletForm = ({ initialData = {}, mode = "add" }) => {
  const dispatch = useDispatch();
  const form = useSelector(s => s.form.forms.outlet || {});
  const dz = useSelector(s => s.deliveryZone);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    dispatch(fetchDeliveryZones());
    dispatch(initializeForm({
      entity: "outlet",
      initialData: {
        name: initialData.name || "",
        latitude: initialData.latitude || "",
        longitude: initialData.longitude || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        deliveryZone: initialData.deliveryZone?._id || "",
        isActive: initialData.isActive ?? true,
        address: initialData.address || ""
      },
      mode
    }));
  }, [dispatch, initialData, mode]);

  const validate = () => {
    const e = {};
    if (!form.formData?.name) e.name = "Name required";
    if (!form.formData?.deliveryZone) e.deliveryZone = "Select a delivery zone";
    return e;
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    dispatch(updateFormField({
      entity: "outlet",
      name,
      value: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = useCallback(async e => {
    e.preventDefault();
    if (form.isSubmitting || submitted) return;
    setSubmitted(true);

    const errs = validate();
    if (Object.keys(errs).length) {
      dispatch(setFormErrors({ entity: "outlet", errors: errs }));
      Object.values(errs).forEach(m => toast.error(m));
      setSubmitted(false);
      return;
    }

    dispatch(setSubmitting({ entity: "outlet", isSubmitting: true }));
    try {
      const action = mode === "edit"
        ? updateOutlet({ id: initialData._id, data: form.formData })
        : createOutlet(form.formData);
      const res = await dispatch(action);
      if (res.meta.requestStatus === "rejected") throw new Error(res.payload);

      toast.success(`Outlet ${mode === "edit" ? "updated" : "created"}!`);
      dispatch(closeModal());
      dispatch(resetForm({ entity: "outlet" }));
    } catch (err) {
      toast.error("Failed: " + err.message);
    } finally {
      dispatch(setSubmitting({ entity: "outlet", isSubmitting: false }));
      setSubmitted(false);
    }
  }, [dispatch, form, initialData, mode, submitted]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput label="Name *" name="name" value={form.formData?.name || ""} onChange={handleChange} error={form.errors?.name} />
        <TextInput label="Latitude" name="latitude" value={form.formData?.latitude || ""} onChange={handleChange} />
        <TextInput label="Longitude" name="longitude" value={form.formData?.longitude || ""} onChange={handleChange} />
        <TextInput label="Email" name="email" type="email" value={form.formData?.email || ""} onChange={handleChange} />
        <TextInput label="Phone" name="phone" value={form.formData?.phone || ""} onChange={handleChange} />

        <SelectInput
          label="Delivery Zone *"
          name="deliveryZone"
          value={form.formData?.deliveryZone || ""}
          onChange={handleChange}
          options={dz.zones.map(z => ({ label: z.name, value: z._id }))}
          placeholder="Select Delivery Zone"
          error={form.errors?.deliveryZone}
        />

        <SwitchToggle label="Status" name="isActive" checked={!!form.formData?.isActive} onChange={handleChange} />
        <Textarea label="Address" name="address" value={form.formData?.address || ""} onChange={handleChange} />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => { dispatch(closeModal()); dispatch(resetForm({ entity: "outlet" })); }}
          className="px-4 py-2 border text-gray-700 rounded-md"
          disabled={form.isSubmitting}
        >
          <IoClose className="mr-1 inline" /> Close
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center"
          disabled={form.isSubmitting}
        >
          {form.isSubmitting ? <ClipLoader size={16} color="#fff" className="mr-2" /> : <FaSave className="mr-1 inline" />}
          {form.isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default OutletForm;
