import React, { useState } from 'react';
import { useDispatch} from "react-redux";
import { changePassword } from "../../store/slices/authSlice";
import { toast } from 'react-toastify'; 

const ChangePassword = () => {
  const dispatch = useDispatch();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    
    const data = {
        oldPass:oldPassword,
        newPass:newPassword
    };

    try {
      const result = await dispatch(changePassword(data));

      // Check for success
      if (changePassword.rejected.match(result)) {
        toast.error("Password not changed: " + result.payload);
      } else {
        toast.success("Password changed successfully!");

        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }

    } catch (error) {
      toast.error("An error occurred: " + error.message);
    }

  };

  return (
    <div className="p-6 sm:p-10">
      <h1 className="text-2xl font-bold text-green-600 mb-4">Change Password</h1>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Old Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password Confirmation <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white text-lg font-semibold px-8 py-3 rounded-full hover:bg-green-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
