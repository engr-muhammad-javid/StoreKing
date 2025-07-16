import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

import {
  fetchOtp,
  createOtp,
  updateOtp,
  resetOtpState,
} from "../../../store/slices/otpSlice";

import {
  initializeForm,
  updateFormField,
  setSubmitting,
  resetForm,
} from "../../../store/slices/formSlice";

import { SelectInput } from "../../../components/common";
import { hasPermission } from "../../../utils/permissions";

const OtpSettings = () => {
  const dispatch = useDispatch();
  const { otp, loading } = useSelector((state) => state.otp);
  const formState = useSelector((state) => state.form.forms.otpSettings || {});
  const { permissions } = useSelector((state) => state.auth);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const canView = hasPermission(permissions, "settings/otp", "view");
  const canUpdate = hasPermission(permissions, "settings/otp", "update");

  useEffect(() => {
    if (canView) {
      dispatch(fetchOtp());
    }
    return () => dispatch(resetOtpState());
  }, [dispatch, canView]);

  useEffect(() => {
    dispatch(
      initializeForm({
        entity: "otpSettings",
        initialData: {
          otpType: otp?.otpType || "SMS",
          otpDigitLimit: otp?.otpDigitLimit || "6",
          otpExpireTime: otp?.otpExpireTime || "10 Minutes",
        },
        mode: otp ? "edit" : "add",
      })
    );
  }, [dispatch, otp]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormField({ entity: "otpSettings", name, value }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!canUpdate || formState.isSubmitting || hasSubmitted) return;

      setHasSubmitted(true);
      dispatch(setSubmitting({ entity: "otpSettings", isSubmitting: true }));

      const formData = new FormData();
      Object.entries(formState.formData || {}).forEach(([k, v]) => {
        if (v !== null && typeof v !== "object") formData.append(k, v);
      });

      try {
        const action = otp ? updateOtp({ data: formData }) : createOtp(formData);
        await dispatch(action).unwrap();
        toast.success(`OTP settings ${otp ? "updated" : "created"} successfully!`);
      } catch (err) {
        toast.error(err.message || "Error occurred");
      } finally {
        dispatch(setSubmitting({ entity: "otpSettings", isSubmitting: false }));
        setHasSubmitted(false);
      }
    },
    [dispatch, formState, otp, hasSubmitted, canUpdate]
  );

  if (!canView) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-red-600 font-semibold">
        You do not have permission to view this page.
      </div>
    );
  }

  if (loading.fetch) {
    return (
      <div className="flex items-center justify-center py-6">
        <ClipLoader color="#007bff" size={30} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">OTP Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <SelectInput
            label="OTP Type"
            name="otpType"
            value={formState.formData?.otpType}
            onChange={handleChange}
            disabled={!canUpdate}
            options={[
              { label: "SMS", value: "SMS" },
              { label: "Email", value: "Email" },
              { label: "Both", value: "Both" },
            ]}
          />
          <SelectInput
            label="OTP Digit Limit"
            name="otpDigitLimit"
            value={formState.formData?.otpDigitLimit}
            onChange={handleChange}
            disabled={!canUpdate}
            options={[
              { label: "4", value: "4" },
              { label: "6", value: "6" },
              { label: "8", value: "8" },
            ]}
          />
          <SelectInput
            label="OTP Expire Time"
            name="otpExpireTime"
            value={formState.formData?.otpExpireTime}
            onChange={handleChange}
            disabled={!canUpdate}
            options={[
              { label: "5 Minutes", value: "5 Minutes" },
              { label: "10 Minutes", value: "10 Minutes" },
              { label: "15 Minutes", value: "15 Minutes" },
              { label: "20 Minutes", value: "20 Minutes" },
              { label: "30 Minutes", value: "30 Minutes" },
              { label: "60 Minutes", value: "60 Minutes" },
            ]}
          />
        </div>

        {canUpdate && (
          <div className="text-right">
            <button
              type="submit"
              disabled={formState.isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {formState.isSubmitting
                ? "Saving..."
                : otp
                ? "Update Settings"
                : "Create Settings"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default OtpSettings;
