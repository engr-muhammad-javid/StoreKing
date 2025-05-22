import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaChevronDown, FaChevronUp, FaQuestionCircle, FaSignOutAlt, FaUserEdit, FaKey } from 'react-icons/fa';

const AccountDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <span className="font-medium">John Doe</span>
        {isOpen ? (
          <FaChevronUp className="text-gray-500" />
        ) : (
          <FaChevronDown className="text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
          role="menu"
        >
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-gray-500 truncate">admin@example.com</p>
            <p className="text-xs text-gray-500">+8801254875855</p>
            <p className="text-xs text-gray-500">$0.00</p>
          </div>
          
          {/* Actions */}
          <div className="py-1">
            <DropdownItem icon={<FaUserEdit />} text="Edit Profile" />
            <DropdownItem icon={<FaKey />} text="Change Password" />
          </div>
          
          {/* Footer */}
          <div className="py-1 border-t border-gray-100">
            <DropdownItem icon={<FaQuestionCircle />} text="Help" />
            <DropdownItem icon={<FaSignOutAlt />} text="Logout" />
          </div>
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({ icon, text }) => (
  <a 
    href="#" 
    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
    role="menuitem"
  >
    <span className="mr-3 text-gray-400">{icon}</span>
    {text}
  </a>
);

export default AccountDropdown;