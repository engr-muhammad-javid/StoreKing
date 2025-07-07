import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import { closeModal } from '../../store/slices/modalSlice';

const ModalWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { isOpen, entity, mode } = useSelector((state) => state.modal);

  if (!isOpen) return null;

  // Generate title based on entity and mode
  const title = entity
    ? `${mode === 'edit' ? 'Edit' : 'Add'} ${entity.charAt(0).toUpperCase() + entity.slice(1)}`
    : 'Modal';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[60vw] max-h-[90vh] shadow-lg relative flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700"
            onClick={() => dispatch(closeModal())}
          >
            <IoClose size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-auto px-6 py-4">{children}</div>
      </div>
    </div>
  );
};

export default ModalWrapper;