import React from 'react';

const ImageUploader = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  accept = 'image/*',
}) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange({
        target: {
          name,
          value: file,
          type: 'file',
        },
      });
    }
  };

  const imageUrl = typeof value === 'string' ? value : value ? URL.createObjectURL(value) : null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && '*'}
      </label>
      <input
        type="file"
        name={name}
        accept={accept}
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
      />
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Preview"
          className="mt-2 w-24 h-24 object-cover rounded shadow"
        />
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default ImageUploader;
