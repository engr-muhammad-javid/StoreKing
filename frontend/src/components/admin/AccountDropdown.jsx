import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaChevronDown, FaChevronUp, FaQuestionCircle, FaSignOutAlt, FaUserEdit, FaKey } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from 'react-router-dom';
import { logout } from "../../store/slices/authSlice";

const AccountDropdown = () => {
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
          <FaUser />
        </div>
        <span className="font-medium">{user.name}</span>
        {isOpen ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
          role="menu"
        >
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <p className="text-xs text-gray-500">{user.phone}</p>
          </div>

          {/* Actions */}
          <div className="py-1">
            <DropdownItem icon={<FaUserEdit />} text="Edit Profile" to="/admin/profile/edit-profile" />
            <DropdownItem icon={<FaKey />} text="Change Password" to="/admin/profile/change-password" />
            <DropdownItem icon={<FaSignOutAlt />} text="Logout" onClick={handleLogout} />
          </div>
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({ icon, text, to, onClick }) => {
  if (to) {
    return (
      <Link 
        to={to}
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        role="menuitem"
      >
        <span className="mr-3 text-gray-400">{icon}</span>
        {text}
      </Link>
    );
  }

  return (
    <button 
      onClick={onClick}
      className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      role="menuitem"
    >
      <span className="mr-3 text-gray-400">{icon}</span>
      {text}
    </button>
  );
};

export default AccountDropdown;
