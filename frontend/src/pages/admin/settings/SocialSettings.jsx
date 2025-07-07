// src/pages/settings/SocialSettings.js
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

import {
  fetchSocial,
  createSocial,
  updateSocial,
  resetSocialState,
} from "../../../store/slices/socialSlice";

import {
  initializeForm,
  updateFormField,
  setSubmitting
} from "../../../store/slices/formSlice";

import { TextInput } from "../../../components/common";

const SocialSettings = () => {
  const dispatch = useDispatch();
  const { social, loading } = useSelector((state) => state.social);
  const formState = useSelector((state) => state.form.forms.socialSettings || {});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    dispatch(fetchSocial());
    return () => dispatch(resetSocialState());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      initializeForm({
        entity: "socialSettings",
        initialData: {
          facebook: social?.facebook || "",
          youtube: social?.youtube || "",
          instagram: social?.instagram || "",
          twitter: social?.twitter || "",
        },
        mode: social ? "edit" : "add",
      })
    );
  }, [dispatch, social]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormField({ entity: "socialSettings", name, value }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (formState.isSubmitting || hasSubmitted) return;
      setHasSubmitted(true);
      dispatch(setSubmitting({ entity: "socialSettings", isSubmitting: true }));

      const formData = new FormData();
      Object.entries(formState.formData || {}).forEach(([key, val]) => {
        if (val !== null && typeof val !== "object") formData.append(key, val);
      });

      try {
        const action = social ? updateSocial({ data: formData }) : createSocial(formData);
        await dispatch(action).unwrap();
        toast.success(`Social settings ${social ? "updated" : "created"} successfully!`);
      } catch (err) {
        toast.error(err.message || "Error occurred");
      } finally {
        dispatch(setSubmitting({ entity: "socialSettings", isSubmitting: false }));
        setHasSubmitted(false);
      }
    },
    [dispatch, formState, social, hasSubmitted]
  );

  if (loading.fetch) {
    return (
      <div className="flex items-center justify-center py-6">
        <ClipLoader color="#007bff" size={30} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">Social Media Links</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <TextInput label="Facebook" name="facebook" value={formState.formData?.facebook} onChange={handleChange} />
          <TextInput label="YouTube" name="youtube" value={formState.formData?.youtube} onChange={handleChange} />
          <TextInput label="Instagram" name="instagram" value={formState.formData?.instagram} onChange={handleChange} />
          <TextInput label="Twitter" name="twitter" value={formState.formData?.twitter} onChange={handleChange} />
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {formState.isSubmitting
              ? "Saving..."
              : social
              ? "Update Settings"
              : "Create Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SocialSettings;
