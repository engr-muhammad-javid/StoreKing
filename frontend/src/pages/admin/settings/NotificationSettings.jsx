import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

import {
  fetchNotification,
  createNotification,
  updateNotification,
  resetNotificationState,
} from "../../../store/slices/notificationSlice";

import {
  initializeForm,
  updateFormField,
  setSubmitting,
  resetForm,
} from "../../../store/slices/formSlice";

import { TextInput } from "../../../components/common";
import { hasPermission } from "../../../utils/permissions";

const NotificationSettings = () => {
  const dispatch = useDispatch();
  const { notification, loading } = useSelector((state) => state.notification);
  const formState = useSelector((state) => state.form.forms.notificationSettings || {});
  const { permissions } = useSelector((state) => state.auth);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const canView = hasPermission(permissions, "settings/notifications", "view");
  const canUpdate = hasPermission(permissions, "settings/notifications", "update");

  useEffect(() => {
    if (canView) dispatch(fetchNotification());
    return () => dispatch(resetNotificationState());
  }, [dispatch, canView]);

  useEffect(() => {
    dispatch(
      initializeForm({
        entity: "notificationSettings",
        initialData: {
          firebasePublicVapidKey: notification?.firebasePublicVapidKey || "",
          firebaseApiKey: notification?.firebaseApiKey || "",
          firebaseAuthDomain: notification?.firebaseAuthDomain || "",
          firebaseProjectId: notification?.firebaseProjectId || "",
          firebaseStorageBucket: notification?.firebaseStorageBucket || "",
          firebaseMessageSenderId: notification?.firebaseMessageSenderId || "",
          firebaseAppId: notification?.firebaseAppId || "",
          firebaseMeasurementId: notification?.firebaseMeasurementId || "",
          firebaseJsonFile: null,
        },
        mode: notification ? "edit" : "add",
      })
    );
  }, [dispatch, notification]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const fieldValue = files ? files[0] : value;
    dispatch(updateFormField({ entity: "notificationSettings", name, value: fieldValue }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!canUpdate || formState.isSubmitting || hasSubmitted) return;

      setHasSubmitted(true);
      dispatch(setSubmitting({ entity: "notificationSettings", isSubmitting: true }));

      const formData = new FormData();
      Object.entries(formState.formData || {}).forEach(([key, val]) => {
        if (val !== null && typeof val !== "object") formData.append(key, val);
        if (val instanceof File) formData.append(key, val);
      });

      try {
        const action = notification
          ? updateNotification({ data: formData })
          : createNotification(formData);
        await dispatch(action).unwrap();
        toast.success(`Notification settings ${notification ? "updated" : "created"} successfully!`);
      } catch (err) {
        toast.error(err.message || "Error occurred");
      } finally {
        dispatch(setSubmitting({ entity: "notificationSettings", isSubmitting: false }));
        setHasSubmitted(false);
      }
    },
    [dispatch, formState, notification, hasSubmitted, canUpdate]
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
      <h2 className="text-2xl font-semibold mb-6">Notification Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <TextInput label="Firebase Public VAPID Key" name="firebasePublicVapidKey" value={formState.formData?.firebasePublicVapidKey} onChange={handleChange} disabled={!canUpdate} />
          <TextInput label="Firebase API Key" name="firebaseApiKey" value={formState.formData?.firebaseApiKey} onChange={handleChange} disabled={!canUpdate} />
          <TextInput label="Firebase Auth Domain" name="firebaseAuthDomain" value={formState.formData?.firebaseAuthDomain} onChange={handleChange} disabled={!canUpdate} />
          <TextInput label="Firebase Project ID" name="firebaseProjectId" value={formState.formData?.firebaseProjectId} onChange={handleChange} disabled={!canUpdate} />
          <TextInput label="Firebase Storage Bucket" name="firebaseStorageBucket" value={formState.formData?.firebaseStorageBucket} onChange={handleChange} disabled={!canUpdate} />
          <TextInput label="Firebase Message Sender ID" name="firebaseMessageSenderId" value={formState.formData?.firebaseMessageSenderId} onChange={handleChange} disabled={!canUpdate} />
          <TextInput label="Firebase App ID" name="firebaseAppId" value={formState.formData?.firebaseAppId} onChange={handleChange} disabled={!canUpdate} />
          <TextInput label="Firebase Measurement ID" name="firebaseMeasurementId" value={formState.formData?.firebaseMeasurementId} onChange={handleChange} disabled={!canUpdate} />

          <div className="form-col-12">
            <label htmlFor="firebaseJsonFile" className="block text-sm font-medium mb-1 db-field-title">
              Firebase JSON File
            </label>
            <input
              type="file"
              id="firebaseJsonFile"
              name="firebaseJsonFile"
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 db-field-control"
              accept=".json"
              disabled={!canUpdate}
            />
          </div>
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
                : notification
                ? "Update Settings"
                : "Create Settings"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default NotificationSettings;
