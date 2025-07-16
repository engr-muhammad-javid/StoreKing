import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

import {
  fetchCookie,
  createCookie,
  updateCookie,
  resetCookieState,
} from "../../../store/slices/cookieSlice";
import {
  initializeForm,
  updateFormField,
  setSubmitting,
} from "../../../store/slices/formSlice";

import { SelectInput, Textarea } from "../../../components/common";
import { hasPermission } from "../../../utils/permissions";

const CookieSettings = () => {
  const dispatch = useDispatch();
  const { cookie, loading } = useSelector((state) => state.cookie);
  const formState = useSelector((state) => state.form.forms.cookieSettings || {});
  const { permissions } = useSelector((state) => state.auth);

  const canView = hasPermission(permissions, "settings/cookies", "view");
  const canCreate = hasPermission(permissions, "settings/cookies", "create");
  const canUpdate = hasPermission(permissions, "settings/cookies", "update");
  const canSubmit = cookie ? canUpdate : canCreate;

  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (canView) dispatch(fetchCookie());
    return () => dispatch(resetCookieState());
  }, [dispatch, canView]);

  useEffect(() => {
    dispatch(
      initializeForm({
        entity: "cookieSettings",
        initialData: {
          cookiesDetailsPage: cookie?.cookiesDetailsPage || "",
          cookiesSummary: cookie?.cookiesSummary || "",
        },
        mode: cookie ? "edit" : "add",
      })
    );
  }, [dispatch, cookie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormField({ entity: "cookieSettings", name, value }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (formState.isSubmitting || hasSubmitted || !canSubmit) return;
      setHasSubmitted(true);
      dispatch(setSubmitting({ entity: "cookieSettings", isSubmitting: true }));

      const formData = new FormData();
      Object.entries(formState.formData || {}).forEach(([k, v]) => {
        if (v !== null && typeof v !== "object") formData.append(k, v);
      });

      try {
        const action = cookie ? updateCookie({ data: formData }) : createCookie(formData);
        await dispatch(action).unwrap();
        toast.success(`Cookies settings ${cookie ? "updated" : "created"} successfully!`);
      } catch (err) {
        toast.error(err.message || "Error occurred");
      } finally {
        dispatch(setSubmitting({ entity: "cookieSettings", isSubmitting: false }));
        setHasSubmitted(false);
      }
    },
    [dispatch, formState, cookie, hasSubmitted, canSubmit]
  );

  const isLoading = loading.fetch;

  if (!canView) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-red-600 font-semibold">
        You do not have permission to view this page.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <ClipLoader color="#007bff" size={30} />
      </div>
    );
  }

  const staticPages = [
    { label: "Privacy Policy", value: "privacy-policy" },
    { label: "Terms of Service", value: "terms-of-service" },
    { label: "About Us", value: "about-us" },
    { label: "Cookies Policy", value: "cookies-policy" },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">Cookies Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <SelectInput
            label="Cookies Details Page"
            name="cookiesDetailsPage"
            value={formState.formData?.cookiesDetailsPage}
            onChange={handleChange}
            options={staticPages}
          />
        </div>
        <div>
          <Textarea
            label="Cookies Summary"
            name="cookiesSummary"
            value={formState.formData?.cookiesSummary}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <div className="text-right">
          <button
            type="submit"
            disabled={formState.isSubmitting || !canSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {formState.isSubmitting
              ? "Saving..."
              : cookie
              ? "Update Settings"
              : "Create Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CookieSettings;
