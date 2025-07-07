import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { IoClose } from "react-icons/io5";
import { FaSave } from "react-icons/fa";

import { fetchSite, createSite, updateSite, resetSiteState } from "../../../store/slices/siteSlice";
import {
  initializeForm,
  updateFormField,
  setSubmitting,
  resetForm,
} from "../../../store/slices/formSlice";
import {
  TextInput,
  SelectInput,
  SwitchToggle,
  RadioGroup,
} from "../../../components/common";

const SiteSettings = () => {
  const dispatch = useDispatch();
  const { site, loading } = useSelector((state) => state.site);
  const formState = useSelector((state) => state.form.forms.siteSettings || {});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    dispatch(fetchSite());
    return () => dispatch(resetSiteState());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      initializeForm({
        entity: "siteSettings",
        initialData: {
          dateFormat: site?.dateFormat || "d-m-Y",
          timeFormat: site?.timeFormat || "12 Hour",
          defaultTimezone: site?.defaultTimezone || "Asia/Dhaka",
          defaultLanguage: site?.defaultLanguage || "English",
          defaultSmsGateway: site?.defaultSmsGateway || "",
          copyright: site?.copyright || "",
          androidAppLink: site?.androidAppLink || "",
          iosAppLink: site?.iosAppLink || "",
          nonPurchaseProductMaxQty: site?.nonPurchaseProductMaxQty || "",
          digitAfterDecimal: site?.digitAfterDecimal || "",
          defaultCurrency: site?.defaultCurrency || "Dollars ($)",
          currencyPosition: site?.currencyPosition || "left",
          cashOnDelivery: site?.cashOnDelivery ?? true,
          isReturnPriceToCredit: site?.isReturnPriceToCredit ?? false,
          onlinePaymentGateway: site?.onlinePaymentGateway ?? true,
          languageSwitch: site?.languageSwitch ?? true,
          pickUp: site?.pickUp ?? false,
          emailVerification: site?.emailVerification ?? false,
          phoneVerification: site?.phoneVerification ?? false,
          appDebug: site?.appDebug ?? false,
          googleMapKey: site?.googleMapKey || "",
        },
        mode: site ? "edit" : "add",
      })
    );
  }, [dispatch, site]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch(
      updateFormField({
        entity: "siteSettings",
        name,
        value: type === "checkbox" ? checked : type === "radio" ? value === "true" : value,
      })
    );
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (formState.isSubmitting || hasSubmitted) return;
      setHasSubmitted(true);
      dispatch(setSubmitting({ entity: "siteSettings", isSubmitting: true }));

      const formData = new FormData();
      Object.entries(formState.formData || {}).forEach(([k, v]) => {
        if (v !== null && typeof v !== "object") formData.append(k, v);
      });

      try {
        const action = site ? updateSite({ data: formData }) : createSite(formData);
        const res = await dispatch(action).unwrap();
        toast.success(`Settings ${site ? "updated" : "created"} successfully!`);
      } catch (err) {
        toast.error(err.message || "Error occurred");
      } finally {
        dispatch(setSubmitting({ entity: "siteSettings", isSubmitting: false }));
        setHasSubmitted(false);
      }
    },
    [dispatch, formState, site, hasSubmitted]
  );

  const handleClose = () => {
    dispatch(resetForm({ entity: "siteSettings" }));
  };

  const loadingSubmit = formState.isSubmitting || loading.create || loading.update;
  const isLoadingSite = loading.fetch;

  if (isLoadingSite) {
    return (
      <div className="flex items-center justify-center py-6">
        <ClipLoader color="#007bff" size={30} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">Site Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <SelectInput
            label="Date Format"
            name="dateFormat"
            value={formState.formData?.dateFormat}
            onChange={handleChange}
            options={[
              { label: "d‑m‑Y (03‑06‑2025)", value: "d-m-Y" },
              { label: "m‑d‑Y (06‑03‑2025)", value: "m-d-Y" },
              { label: "Y‑m‑d (2025‑06‑03)", value: "Y-m-d" },
              // add others...
            ]}
          />
          <SelectInput
            label="Time Format"
            name="timeFormat"
            value={formState.formData?.timeFormat}
            onChange={handleChange}
            options={[
              { label: "12 Hour", value: "12 Hour" },
              { label: "24 Hour", value: "24 Hour" },
            ]}
          />
          <SelectInput
            label="Default Timezone"
            name="defaultTimezone"
            value={formState.formData?.defaultTimezone}
            onChange={handleChange}
            options={[
              { label: "Asia/Dhaka", value: "Asia/Dhaka" },
              { label: "Africa/Abidjan", value: "Africa/Abidjan" },
              // add others...
            ]}
          />
          <SelectInput
            label="Default Language"
            name="defaultLanguage"
            value={formState.formData?.defaultLanguage}
            onChange={handleChange}
            options={[
              { label: "English", value: "English" },
              { label: "Bangla", value: "Bangla" },
              { label: "Arabic", value: "Arabic" },
            ]}
          />
          <SelectInput
            label="Default SMS Gateway"
            name="defaultSmsGateway"
            value={formState.formData?.defaultSmsGateway}
            onChange={handleChange}
            options={[{ label: "--", value: "" }, { label: "Twilio", value: "Twilio" }, /*...*/]}
          />
          <TextInput
            label="Copyright"
            name="copyright"
            value={formState.formData?.copyright}
            onChange={handleChange}
          />
          <TextInput
            label="Android App Link"
            name="androidAppLink"
            value={formState.formData?.androidAppLink}
            onChange={handleChange}
          />
          <TextInput
            label="iOS App Link"
            name="iosAppLink"
            value={formState.formData?.iosAppLink}
            onChange={handleChange}
          />
          <TextInput
            label="Non‑Purchase Product Max Qty"
            name="nonPurchaseProductMaxQty"
            value={formState.formData?.nonPurchaseProductMaxQty}
            onChange={handleChange}
          />
          <TextInput
            label="Digit After Decimal"
            name="digitAfterDecimal"
            value={formState.formData?.digitAfterDecimal}
            onChange={handleChange}
          />
          <SelectInput
            label="Default Currency"
            name="defaultCurrency"
            value={formState.formData?.defaultCurrency}
            onChange={handleChange}
            options={[
              { label: "Dollars ($)", value: "Dollars ($)" },
              { label: "Rupee (₹)", value: "Rupee (₹)" },
              // etc
            ]}
          />
          <RadioGroup
            label="Currency Position"
            name="currencyPosition"
            options={[
              { label: "Left ($)", value: "left" },
              { label: "Right ($)", value: "right" },
            ]}
            value={formState.formData?.currencyPosition}
            onChange={handleChange}
          />
          <TextInput
            label="Google Map Key"
            name="googleMapKey"
            value={formState.formData?.googleMapKey}
            onChange={handleChange}
          />

          {[
            { name: "cashOnDelivery", label: "Cash On Delivery" },
            { name: "isReturnPriceToCredit", label: "Return Price To Credit" },
            { name: "onlinePaymentGateway", label: "Online Payment Gateway" },
            { name: "languageSwitch", label: "Language Switch" },
            { name: "pickUp", label: "Pick Up" },
            { name: "emailVerification", label: "Email Verification" },
            { name: "phoneVerification", label: "Phone Verification" },
            { name: "appDebug", label: "App Debug" },
          ].map(({ name, label }) => (
            <SwitchToggle
              key={name}
              label={label}
              name={name}
              checked={!!formState.formData?.[name]}
              onChange={handleChange}
            />
          ))}
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {formState.isSubmitting
              ? "Saving..."
              : site
              ? "Update Settings"
              : "Create Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SiteSettings;
