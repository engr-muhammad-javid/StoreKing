import React from 'react';

const SelectInput = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  placeholder = 'Select',
  className
}) => {
  return (
    <div className={className}>
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className="mb-1 font-medium text-sm text-gray-700">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
    </div>
  );
};

export default SelectInput;
