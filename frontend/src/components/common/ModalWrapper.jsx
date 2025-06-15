import React from 'react';
import { IoClose } from 'react-icons/io5';

const ModalWrapper = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-5xl h-[90vh] shadow-lg relative flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <IoClose size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-auto px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalWrapper;