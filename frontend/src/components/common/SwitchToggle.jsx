import React from 'react';

const SwitchToggle = ({ label, name, checked, onChange, yesLabel = 'Yes', noLabel = 'No', className }) => {
  return (
    <div className={className}>
    <div className="flex flex-col">
      <label className="text-xs font-medium text-gray-600 mb-1 uppercase">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">{noLabel}</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
        </label>
        <span className="text-sm text-gray-500">{yesLabel}</span>
      </div>
    </div>
    </div>
  );
};

export default SwitchToggle;
