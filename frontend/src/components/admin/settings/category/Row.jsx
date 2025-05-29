import React from 'react'
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { deleteCategory } from '../../../../store/slices/productCategorySlice';
import { toast } from 'react-toastify'; 
import { useDispatch} from "react-redux";

export default function Row({fullData, onEdit }) {
    
    const dispatch = useDispatch();

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            dispatch(deleteCategory(id))
            .then((result) => {
                if (deleteCategory.fulfilled.match(result)) {
                toast.success("Category deleted successfully!");
                }
                if (deleteCategory.rejected.match(result)) {
                toast.error(result.payload || "Failed to delete category");
                }
            });
        }
    };

  return (
     <tr key={fullData.id} className="border-t hover:bg-gray-50">
        <td className="px-4 py-3">{fullData.name}</td>
        <td className="px-4 py-3">{fullData.parent?.name || '-'}</td>
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
            onClick={() => handleDelete(fullData.id)}
            className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 text-xs rounded hover:bg-red-700"
        >
            <FaTrash /> Delete
        </button>
        </td>
    </tr>
  )
}
