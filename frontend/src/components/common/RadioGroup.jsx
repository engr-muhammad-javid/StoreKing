import React from 'react';

const RadioGroup = ({ label, name, value, onChange, options = [], required = false, className }) => (
  <div className={className}>
    <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">
      {label} {required && '*'}
    </label>
    <div className="flex items-center gap-4 mt-2">
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-1">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={String(value) === String(option.value)}
            onChange={() => onChange({ target: { name, value: option.value } })}
            required={required}
          />
          {option.label}
        </label>
      ))}
    </div>
  </div>
);

export default RadioGroup;
