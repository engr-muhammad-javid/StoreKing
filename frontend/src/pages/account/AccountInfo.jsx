import React, { useState, useRef } from 'react';
import { useSelector, useDispatch} from "react-redux";
import { updateUser } from "../../store/slices/authSlice";
import { toast } from 'react-toastify'; 

const AccountInfo = () => {

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    fullName: user?.name,
    email: user?.email,
    phone: user?.phone,
    profile: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile') {
      setFormData({ ...formData, profile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const result = await dispatch(updateUser(formData));

      if (updateUser.rejected.match(result)) {
        toast.error(result.payload || "Profile Not Updated");
      } else {
        toast.success(result.payload.message || "Profile Updated successfully!");

        setFormData((prev) => ({ ...prev, profile: null }));

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

      }

    } catch (error) {
      toast.error("Failed to update account: " + error.message);
    }
    
  };

  return (

     <div className="w-full">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Account Information</h2>
        <div className="p-6 rounded-2xl shadow-card bg-white">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-1">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border rounded-md p-3"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-md p-3"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Phone <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-md p-3"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Upload Image</label>
              <input
                type="file"
                name="profile"
                onChange={handleChange}
                className="w-full border rounded-md p-3"
                ref={fileInputRef}
              />
            </div>

            <div className="col-span-2">
              <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600">
                Save Changes
              </button>
            </div>
          </form>
          </div>
    </div>
  );
};

export default AccountInfo;
