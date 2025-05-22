import React from 'react';
import { NavLink } from 'react-router-dom';
import {FaHistory, FaInfoCircle, FaKey, FaMapMarkerAlt, FaSignOutAlt, FaThLarge } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Sidebar = () => {

  const navigate = useNavigate();
  const {user} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    dispatch(logout());
    toast.success("You have Logged out");
    navigate('/login');
  };

  return (

    <div className="bg-white shadow rounded-lg p-6 w-full sm:w-64">
      <div className="text-center mb-6">
        <img
          src={user?.picture}
          alt="Avatar"
          className="w-24 h-24 rounded-full mx-auto border-4 border-green-400"
        />
        <h2 className="mt-2 font-semibold text-lg">{user?.name}</h2>
        <p className="text-sm text-gray-500">{user?.phone}</p>
      </div>

      <nav className="space-y-3">
        <NavLink
          to="/account/overview"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              isActive ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-500'
            }`
          }
        >
          <FaThLarge /> Overview
        </NavLink>

        <NavLink
          to="/account/orders"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              isActive ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-500'
            }`
          }
        >
          <FaHistory /> Order History
        </NavLink>

        <NavLink
          to="/account/info"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              isActive ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-500'
            }`
          }
        >
          <FaInfoCircle /> Account Info
        </NavLink>

        <NavLink
          to="/account/password"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              isActive ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-500'
            }`
          }
        >
          <FaKey /> Change Password
        </NavLink>

        <NavLink
          to="/account/address"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              isActive ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-green-500'
            }`
          }
        >
          <FaMapMarkerAlt /> Address
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-red-500 hover:text-red-600"
        >
          <FaSignOutAlt /> Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
