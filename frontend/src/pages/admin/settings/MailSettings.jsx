// src/pages/settings/MailSettings.js
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

import {
  fetchMail,
  createMail,
  updateMail,
  resetMailState,
} from "../../../store/slices/mailSlice";

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

const MailSettings = () => {
  const dispatch = useDispatch();
  const { mail, loading } = useSelector((state) => state.mail);
  const formState = useSelector((state) => state.form.forms.mailSettings || {});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    dispatch(fetchMail());
    return () => dispatch(resetMailState());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      initializeForm({
        entity: "mailSettings",
        initialData: {
          mailHost: mail?.mailHost || "",
          mailPort: mail?.mailPort || "",
          mailUsername: mail?.mailUsername || "",
          mailPassword: mail?.mailPassword || "",
          mailFromName: mail?.mailFromName || "",
          mailFromEmail: mail?.mailFromEmail || "",
          mailEncryption: mail?.mailEncryption || "SSL",
        },
        mode: mail ? "edit" : "add",
      })
    );
  }, [dispatch, mail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormField({ entity: "mailSettings", name, value }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (formState.isSubmitting || hasSubmitted) return;
      setHasSubmitted(true);
      dispatch(setSubmitting({ entity: "mailSettings", isSubmitting: true }));

      const formData = new FormData();
      Object.entries(formState.formData || {}).forEach(([k, v]) => {
        if (v !== null && typeof v !== "object") formData.append(k, v);
      });

      try {
        const action = mail
          ? updateMail({ data: formData })
          : createMail(formData);
        await dispatch(action).unwrap();
        toast.success(`Mail settings ${mail ? "updated" : "created"} successfully!`);
      } catch (err) {
        toast.error(err.message || "Error occurred");
      } finally {
        dispatch(setSubmitting({ entity: "mailSettings", isSubmitting: false }));
        setHasSubmitted(false);
      }
    },
    [dispatch, formState, mail, hasSubmitted]
  );

  const isLoading = loading.fetch || formState.isSubmitting;

  if (loading.fetch) {
    return (
      <div className="flex items-center justify-center py-6">
        <ClipLoader color="#007bff" size={30} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">Mail Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <TextInput
            label="Mail Host"
            name="mailHost"
            value={formState.formData?.mailHost}
            onChange={handleChange}
          />
          <TextInput
            label="Mail Port"
            name="mailPort"
            value={formState.formData?.mailPort}
            onChange={handleChange}
          />
          <TextInput
            label="Mail Username"
            name="mailUsername"
            value={formState.formData?.mailUsername}
            onChange={handleChange}
          />
          <TextInput
            label="Mail Password"
            name="mailPassword"
            value={formState.formData?.mailPassword}
            onChange={handleChange}
            type="password"
          />
          <TextInput
            label="Mail From Name"
            name="mailFromName"
            value={formState.formData?.mailFromName}
            onChange={handleChange}
          />
          <TextInput
            label="Mail From Email"
            name="mailFromEmail"
            value={formState.formData?.mailFromEmail}
            onChange={handleChange}
          />
          <SelectInput
            label="Mail Encryption"
            name="mailEncryption"
            value={formState.formData?.mailEncryption}
            onChange={handleChange}
            options={[
              { label: "SSL", value: "SSL" },
              { label: "TLS", value: "TLS" },
            ]}
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {formState.isSubmitting
              ? "Saving..."
              : mail
              ? "Update Settings"
              : "Create Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MailSettings;
