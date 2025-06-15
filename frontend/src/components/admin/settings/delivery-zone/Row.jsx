import React from 'react'
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { deletedeliveryZone } from '../../../../store/slices/deliveryZoneSlice';
import { toast } from 'react-toastify'; 
import { useDispatch} from "react-redux";

export default function Row({fullData, onEdit }) {
    
    const dispatch = useDispatch();

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete deliveryZone "${fullData.name}"?`)) {
            dispatch(deletedeliveryZone(fullData._id))
            .then((result) => {
                if (deletedeliveryZone.fulfilled.match(result)) {
                toast.success("deliveryZone deleted successfully!");
                }
                if (deletedeliveryZone.rejected.match(result)) {
                toast.error(result.payload || "Failed to delete deliveryZone");
                }
            });
        }
    };

  return (
     <tr key={fullData.id} className="border-t hover:bg-gray-50">
        <td className="px-4 py-3">{fullData.name}</td>
        <td className="px-4 py-3">{fullData.address}</td>
        <td className="px-4 py-3">
        <span className={`px-3 py-1 text-xs rounded-full font-semibold ${fullData.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {fullData.isActive ? 'Active' : 'Inactive'}
        </span>
        </td>
        <td className="px-4 py-3 flex gap-2 flex-wrap">
        <button className="flex items-center gap-1 border border-green-600 text-green-600 px-3 py-1 text-xs rounded hover:bg-green-50">
            <FaEye /> View
        </button>
        <button
            onClick={() => onEdit(fullData)}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 text-xs rounded hover:bg-green-700"
        >
            <FaEdit /> Edit
        </button>
        <button 
            onClick={() => handleDelete()}
            className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 text-xs rounded hover:bg-red-700"
        >
            <FaTrash /> Delete
        </button>
        </td>
    </tr>
  )
}
