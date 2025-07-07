import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  forms: {}, // Store form data by entity (e.g., { product: { formData, errors, isSubmitting } })
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    initializeForm: (state, action) => {
      const { entity, initialData = {}, mode = 'add' } = action.payload;
      state.forms[entity] = {
        formData: initialData,
        errors: {},
        isSubmitting: false,
        mode,
      };
    },
    updateFormField: (state, action) => {
      const { entity, name, value } = action.payload;
      state.forms[entity].formData[name] = value;
      state.forms[entity].errors[name] = ''; // Clear error on change
    },
    setFormErrors: (state, action) => {
      const { entity, errors } = action.payload;
      state.forms[entity].errors = errors;
    },
    setSubmitting: (state, action) => {
      const { entity, isSubmitting } = action.payload;
      state.forms[entity].isSubmitting = isSubmitting;
    },
    resetForm: (state, action) => {
      const { entity } = action.payload;
      state.forms[entity] = {
        formData: {},
        errors: {},
        isSubmitting: false,
        mode: 'add',
      };
    },
  },
});

export const { initializeForm, updateFormField, setFormErrors, setSubmitting, resetForm } = formSlice.actions;
export default formSlice.reducer;