import React from 'react';
import ModalWrapper from './ModalWrapper';

const CrudModal = ({ isOpen, onClose, onSubmit, FormComponent, initialData, mode, title }) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={title || `${mode === 'edit' ? 'Edit' : 'Add'} Item`}>
      <FormComponent
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        initialData={initialData}
        mode={mode}
      />
    </ModalWrapper>
  );
};

export default CrudModal;