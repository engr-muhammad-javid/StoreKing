import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  fetchCompany,
  createCompany,
  updateCompany,
} from '../../../store/slices/companySlice';

const Company = () => {
  const dispatch = useDispatch();
  const {company, loading } = useSelector((state) => state.company);
  const [companyData, setCompanyData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    city: '',
    state: '',
    countryCode: '',
    zipCode: '',
    address: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    dispatch(fetchCompany());
  }, [dispatch]);

  useEffect(() => {
    if (company) {
      setCompanyData((prev) => ({
        ...prev,
        ...company,
      }));
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(companyData).forEach(([key, value]) => {
      if (value !== null && typeof value !== 'object') {
        formData.append(key, value);
      }
    });

    try {
      if (!company) {
        await dispatch(createCompany(formData)).unwrap();
        toast.success('Company created successfully!');
      } else {
        await dispatch(updateCompany({ data: formData, id: company._id })).unwrap();
        toast.success('Company updated successfully!');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to save company details');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Company</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 form-row">
          <div className="form-col-12 sm:form-col-6">
            <label htmlFor="name" className="block text-sm font-medium mb-1 db-field-title required">Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={companyData.name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 db-field-control"
              required
            />
          </div>

          <div className="form-col-12 sm:form-col-6">
            <label htmlFor="latitude" className="block text-sm font-medium mb-1 db-field-title">Latitude/Longitude</label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="latitude"
                name="latitude"
                value={companyData.latitude}
                onChange={handleChange}
                className="w-1/2 border rounded-md px-3 py-2 db-field-control"
                placeholder="Latitude"
              />
              <input
                type="text"
                id="longitude"
                name="longitude"
                value={companyData.longitude}
                onChange={handleChange}
                className="w-1/2 border rounded-md px-3 py-2 db-field-control"
                placeholder="Longitude"
              />
            </div>
          </div>

          <div className="form-col-12 sm:form-col-6">
            <label htmlFor="email" className="block text-sm font-medium mb-1 db-field-title required">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={companyData.email}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 db-field-control"
              required
            />
          </div>

          <div className="form-col-12 sm:form-col-6">
            <label htmlFor="phone" className="block text-sm font-medium mb-1 db-field-title required">Phone <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={companyData.phone}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 db-field-control"
              required
            />
          </div>

          <div className="form-col-12 sm:form-col-6">
            <label htmlFor="website" className="block text-sm font-medium mb-1 db-field-title">Website</label>
            <input
              type="text"
              id="website"
              name="website"
              value={companyData.website}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 db-field-control"
            />
          </div>

          <div className="form-col-12 sm:form-col-6">
            <label htmlFor="city" className="block text-sm font-medium mb-1 db-field-title required">City <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="city"
              name="city"
              value={companyData.city}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 db-field-control"
              required
            />
          </div>

          <div className="form-col-12 sm:form-col-6">
            <label htmlFor="state" className="block text-sm font-medium mb-1 db-field-title required">State <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="state"
              name="state"
              value={companyData.state}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 db-field-control"
              required
            />
          </div>

          <div className="form-col-12 sm:form-col-6">
            <label htmlFor="countryCode" className="block text-sm font-medium mb-1 db-field-title required">Country Code <span className="text-red-500">*</span></label>
            <select
              id="countryCode"
              name="countryCode"
              value={companyData.countryCode}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 db-field-control"
              required
            >
              <option value="">Select Country</option>
              {[
                'Bangladesh (BGD)',
                'India (IND)',
                'Pakistan (PAK)',
                'United States (USA)',
                'United Kingdom (GBR)',
              ].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="form-col-12 sm:form-col-6">
            <label htmlFor="zipCode" className="block text-sm font-medium mb-1 db-field-title required">Zip Code <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={companyData.zipCode}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 db-field-control"
              required
            />
          </div>

          <div className="form-col-12">
            <label htmlFor="address" className="block text-sm font-medium mb-1 db-field-title required">Address <span className="text-red-500">*</span></label>
            <textarea
              id="address"
              name="address"
              value={companyData.address}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 db-field-control"
              rows="3"
              required
            />
          </div>
        </div>

        <div className="form-col-12 text-left">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 db-btn"
            disabled={loading}
          >
            <i className="lab lab-fill-save mr-2"></i>
            {loading ? 'Saving...' : !company ? 'Create Company' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Company;