import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

import {
  fetchTheme,
  createTheme,
  updateTheme,
  resetThemeState,
} from "../../../store/slices/themeSlice";

import { hasPermission } from "../../../utils/permissions"; // ✅ permission utility

const ThemeSettings = () => {
  const dispatch = useDispatch();
  const { theme, loading } = useSelector((state) => state.theme);
  const { permissions } = useSelector((state) => state.auth);

  const canView = hasPermission(permissions, "settings/theme", "view");
  const canUpdate = hasPermission(permissions, "settings/theme", "update");

  const [formData, setFormData] = useState({
    logo: null,
    favicon: null,
    footerLogo: null,
  });

  const [preview, setPreview] = useState({
    logo: null,
    favicon: null,
    footerLogo: null,
  });

  useEffect(() => {
    if (canView) {
      dispatch(fetchTheme());
    }
    return () => dispatch(resetThemeState());
  }, [dispatch, canView]);

  useEffect(() => {
    if (theme) {
      setPreview({
        logo: theme.logo || null,
        favicon: theme.favicon || null,
        footerLogo: theme.footerLogo || null,
      });
    }
  }, [theme]);

  const handleChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, [name]: file }));
    setPreview((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canUpdate) return;

    const payload = new FormData();
    Object.entries(formData).forEach(([key, file]) => {
      if (file) payload.append(key, file);
    });

    try {
      const action = theme
        ? updateTheme({ data: payload })
        : createTheme(payload);
      await dispatch(action).unwrap();
      toast.success(`Theme ${theme ? "updated" : "created"} successfully`);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  if (!canView) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-red-600 font-semibold">
        You do not have permission to view this page.
      </div>
    );
  }

  if (loading.fetch) {
    return (
      <div className="flex justify-center items-center py-10">
        <ClipLoader size={35} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">Theme</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Logo */}
          <div>
            <label className="block mb-1 font-medium">LOGO (128px,43px)</label>
            <input
              type="file"
              name="logo"
              onChange={handleChange}
              disabled={!canUpdate}
              className="block w-full border px-3 py-2"
            />
            {preview.logo && (
              <img src={preview.logo} alt="Logo Preview" className="mt-2 h-[43px]" />
            )}
          </div>

          {/* Favicon */}
          <div>
            <label className="block mb-1 font-medium">FAV ICON (120px,120px)</label>
            <input
              type="file"
              name="favicon"
              onChange={handleChange}
              disabled={!canUpdate}
              className="block w-full border px-3 py-2"
            />
            {preview.favicon && (
              <img src={preview.favicon} alt="Favicon Preview" className="mt-2 h-[48px]" />
            )}
          </div>

          {/* Footer Logo */}
          <div>
            <label className="block mb-1 font-medium">FOOTER LOGO (144px,48px)</label>
            <input
              type="file"
              name="footerLogo"
              onChange={handleChange}
              disabled={!canUpdate}
              className="block w-full border px-3 py-2"
            />
            {preview.footerLogo && (
              <img src={preview.footerLogo} alt="Footer Logo Preview" className="mt-2 h-[48px]" />
            )}
          </div>
        </div>

        {canUpdate && (
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading.create || loading.update}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              {loading.create || loading.update ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ThemeSettings;
