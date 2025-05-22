// utils/normalizeError.js

export const normalizeErrorMessage = (err) => {
  let message = 'An unexpected error occurred';

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map((e) => `${e.path}: ${e.message}`)
      .join(', ');
  }

  // Duplicate Key Error (MongoDB)
  else if (err.code === 11000) {
    const fields = Object.keys(err.keyPattern || err.keyValue || {});
    message = `Duplicate value for: ${fields.join(', ')}`;
  }

  // Invalid ObjectId or CastError
  else if (err.name === 'CastError') {
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Any other known message
  else if (err.message) {
    message = err.message;
  }

  return message;
};
