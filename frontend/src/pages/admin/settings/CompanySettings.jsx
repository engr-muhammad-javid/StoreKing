import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

import {
  fetchCompany,
  createCompany,
  updateCompany,
  resetCompanyState,
} from "../../../store/slices/companySlice";

import {
  initializeForm,
  updateFormField,
  setSubmitting,
  resetForm,
} from "../../../store/slices/formSlice";

import {
  TextInput,
  SelectInput,
} from "../../../components/common";

import { hasPermission } from "../../../utils/permissions";

const CompanySettings = () => {
  const dispatch = useDispatch();
  const { company, loading } = useSelector((state) => state.company);
  const formState = useSelector((state) => state.form.forms.companySettings || {});
  const { permissions } = useSelector((state) => state.auth);

  const canView = hasPermission(permissions, "settings/company", "view");
  const canEdit = hasPermission(permissions, "settings/company", "update");
  const canCreate = hasPermission(permissions, "settings/company", "create");
  const canSubmit = company ? canEdit : canCreate;

  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (canView) {
      dispatch(fetchCompany());
    }
    return () => dispatch(resetCompanyState());
  }, [dispatch, canView]);

  useEffect(() => {
    dispatch(
      initializeForm({
        entity: "companySettings",
        initialData: {
          name: company?.name || "",
          email: company?.email || "",
          phone: company?.phone || "",
          website: company?.website || "",
          city: company?.city || "",
          state: company?.state || "",
          countryCode: company?.countryCode || "",
          zipCode: company?.zipCode || "",
          address: company?.address || "",
          latitude: company?.latitude || "",
          longitude: company?.longitude || "",
        },
        mode: company ? "edit" : "add",
      })
    );
  }, [dispatch, company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormField({ entity: "companySettings", name, value }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (formState.isSubmitting || hasSubmitted || !canSubmit) return;

      setHasSubmitted(true);
      dispatch(setSubmitting({ entity: "companySettings", isSubmitting: true }));

      const formData = new FormData();
      Object.entries(formState.formData || {}).forEach(([k, v]) => {
        if (v !== null && typeof v !== "object") formData.append(k, v);
      });

      try {
        const action = company
          ? updateCompany({ data: formData })
          : createCompany(formData);
        await dispatch(action).unwrap();
        toast.success(`Company ${company ? "updated" : "created"} successfully!`);
      } catch (err) {
        toast.error(err.message || "Failed to save company settings");
      } finally {
        dispatch(setSubmitting({ entity: "companySettings", isSubmitting: false }));
        setHasSubmitted(false);
      }
    },
    [dispatch, formState, company, hasSubmitted, canSubmit]
  );

  const isLoadingCompany = loading.fetch;
  const isSubmitting = formState.isSubmitting;

  if (!canView) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-red-600 font-semibold">
        You do not have permission to view this page.
      </div>
    );
  }

  if (isLoadingCompany) {
    return (
      <div className="flex items-center justify-center py-6">
        <ClipLoader color="#007bff" size={30} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">Company Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <TextInput label="Company Name" name="name" value={formState.formData?.name} onChange={handleChange} required />
          <TextInput label="Email" name="email" value={formState.formData?.email} onChange={handleChange} required />
          <TextInput label="Phone" name="phone" value={formState.formData?.phone} onChange={handleChange} required />
          <TextInput label="Website" name="website" value={formState.formData?.website} onChange={handleChange} />
          <TextInput label="City" name="city" value={formState.formData?.city} onChange={handleChange} required />
          <TextInput label="State" name="state" value={formState.formData?.state} onChange={handleChange} required />
          <SelectInput
            label="Country Code"
            name="countryCode"
            value={formState.formData?.countryCode}
            onChange={handleChange}
            required
            options={[
              { label: "Select Country", value: "" },
              { label: "Bangladesh (BGD)", value: "Bangladesh (BGD)" },
              { label: "India (IND)", value: "India (IND)" },
              { label: "Pakistan (PAK)", value: "Pakistan (PAK)" },
              { label: "United States (USA)", value: "United States (USA)" },
              { label: "United Kingdom (GBR)", value: "United Kingdom (GBR)" },
            ]}
          />
          <TextInput label="Zip Code" name="zipCode" value={formState.formData?.zipCode} onChange={handleChange} required />
          <TextInput label="Address" name="address" value={formState.formData?.address} onChange={handleChange} required />
          <TextInput label="Latitude" name="latitude" value={formState.formData?.latitude} onChange={handleChange} />
          <TextInput label="Longitude" name="longitude" value={formState.formData?.longitude} onChange={handleChange} />
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={isSubmitting || !canSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : company ? "Update Company" : "Create Company"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanySettings;
