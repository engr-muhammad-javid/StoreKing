// src/components/common/PageHeader.js
import React from 'react';
import { FaPlus } from 'react-icons/fa';

const PageHeader = ({ title, onAdd }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        <FaPlus /> Add New
      </button>
    </div>
  );
};

export default PageHeader;
