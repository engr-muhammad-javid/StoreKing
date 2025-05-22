import React, { useState, useRef, useEffect } from 'react';
import { FaHome, FaBriefcase, FaMapMarkerAlt, FaEllipsisV } from 'react-icons/fa';
import { deleteAddress } from "../../store/slices/authSlice";
import { toast } from 'react-toastify'; 
import { useDispatch} from "react-redux";


const AddressCard = ({ id, type, address, fullData, onEdit }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const dispatch = useDispatch();

  const getIcon = () => {
    switch (type.toLowerCase()) {
      case 'home':
        return <FaHome className="text-gray-600 mr-3" />;
      case 'office':
        return <FaBriefcase className="text-gray-600 mr-3" />;
      default:
        return <FaMapMarkerAlt className="text-gray-600 mr-3" />;
    }
  };

  const handleDelete = async () => {
    
      const data = {
        addressId: id
      };

      try {
          const result = await dispatch(deleteAddress(data));

          if (deleteAddress.rejected.match(result)) {
              toast.error(result.payload || "Address Not Deleted");
          } else {
              toast.success(result.payload.message || "Address Deleted successfully!");
          }

      }catch(error){
          toast.error("Failed to delete address: " + error.message);
      }
  }



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          {getIcon()}
          <h3 className="text-lg font-medium capitalize">{type}</h3>
        </div>

        {/* Menu Button */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FaEllipsisV />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-24 bg-white border rounded shadow-md z-10">
              <button
                onClick={() => onEdit(fullData)}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleDelete();
                }}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-800 pl-8 mt-2">{address}</p>
    </div>
  );
};

export default AddressCard;
