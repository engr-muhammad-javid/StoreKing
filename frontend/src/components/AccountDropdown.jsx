import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { hasPermission } from "../utils/permissions";

import {
  FaUserCircle,
  FaTachometerAlt,
  FaHistory,
  FaLock,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaUser,
} from 'react-icons/fa';

const AccountDropdown = () => {
  const { user, permissions } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAccountClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      setIsOpen(!isOpen);
    }
  };

  const canAccessDashboard = hasPermission(permissions, 'dashboard');

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button onClick={handleAccountClick} className="flex items-center text-green-600 font-semibold">
        <FaUserCircle className="text-2xl mr-1" />
        Account
        {user && (
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {user && isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-lg z-50 p-4">
          <div className="flex items-center mb-4 border-b pb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src={user.picture || '/default-avatar.png'}
                alt="Profile"
                className="w-full h-full object-cover border border-gray-300"
              />
            </div>
            <div className="ml-3">
              <div className="text-lg font-semibold text-gray-800">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>

          <ul className="space-y-3">
            {canAccessDashboard && (
              <li>
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `flex items-center ${isActive ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`
                  }
                >
                  <FaTachometerAlt className="mr-3 text-lg" />
                  Dashboard
                </NavLink>
              </li>
            )}

            <li>
              <NavLink to="/account/orders" className={({ isActive }) =>
                `flex items-center ${isActive ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`
              }>
                <FaHistory className="mr-3 text-lg" />
                Order History
              </NavLink>
            </li>

            <li>
              <NavLink to="/account/info" className={({ isActive }) =>
                `flex items-center ${isActive ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`
              }>
                <FaUser className="mr-3 text-lg" />
                Account Info
              </NavLink>
            </li>

            <li>
              <NavLink to="/account/password" className={({ isActive }) =>
                `flex items-center ${isActive ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`
              }>
                <FaLock className="mr-3 text-lg" />
                Change Password
              </NavLink>
            </li>

            <li>
              <NavLink to="/account/address" className={({ isActive }) =>
                `flex items-center ${isActive ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`
              }>
                <FaMapMarkerAlt className="mr-3 text-lg" />
                Address
              </NavLink>
            </li>

            <li
              onClick={handleLogout}
              className="flex items-center text-gray-700 hover:text-red-600 cursor-pointer"
            >
              <FaSignOutAlt className="mr-3 text-lg" />
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;
