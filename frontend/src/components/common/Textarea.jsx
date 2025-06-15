import React from 'react';

const Textarea = ({ label, name, value, onChange, required = false, rows = 3, className }) => (
  <div className={className}>
    <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">
      {label} {required && '*'}
    </label>
    <textarea
      name={name}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
);

export default Textarea;
