import React from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const ActionButtons = ({ onView, onEdit, onDelete }) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {onView && (
        <button
          onClick={onView}
          className="flex items-center gap-1 border border-green-600 text-green-600 px-3 py-1 text-xs rounded hover:bg-green-50"
        >
          <FaEye /> View
        </button>
      )}
      {onEdit && (
        <button
          onClick={onEdit}
          className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 text-xs rounded hover:bg-green-700"
        >
          <FaEdit /> Edit
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 text-xs rounded hover:bg-red-700"
        >
          <FaTrash /> Delete
        </button>
      )}
    </div>
  );
};

export default ActionButtons;