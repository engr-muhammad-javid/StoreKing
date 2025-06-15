import React from 'react';
import ActionButtons from '../../components/common/ActionButtons';

const Row = ({ fullData, onEdit, onDelete }) => {
  return (
    <tr key={fullData._id} className="border-t hover:bg-gray-50">
      <td className="px-4 py-3">{fullData.name}</td>
      <td className="px-4 py-3">{fullData.category_id?.name || 'N/A'}</td>
      <td className="px-4 py-3">{fullData.price}</td>
      <td className="px-4 py-3">{fullData.salePrice}</td>
      <td className="px-4 py-3">
        <span
          className={`px-3 py-1 text-xs rounded-full font-semibold ${
            fullData.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {fullData.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-4 py-3">
        <ActionButtons
          // onView={() => alert('View not implemented')}
          onEdit={() => onEdit(fullData)}
          onDelete={() => onDelete(fullData._id)}
        />
      </td>
    </tr>
  );
};

export default Row;