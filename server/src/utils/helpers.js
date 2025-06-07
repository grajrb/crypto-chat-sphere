// Utility functions for the server

/**
 * Format a MongoDB document to match the frontend expected format
 * @param {Object} doc - MongoDB document
 * @returns {Object} Formatted document with id instead of _id
 */
export const formatMongoDocument = (doc) => {
  if (!doc) return null;
  
  const formatted = { ...doc.toObject() };
  formatted.id = formatted._id.toString();
  delete formatted._id;
  delete formatted.__v;
  
  return formatted;
};

/**
 * Format an array of MongoDB documents
 * @param {Array} docs - Array of MongoDB documents
 * @returns {Array} Array of formatted documents
 */
export const formatMongoDocuments = (docs) => {
  if (!docs) return [];
  return docs.map(formatMongoDocument);
};

/**
 * Generate a default response for API errors
 * @param {Error} error - The error object
 * @param {string} errorMessage - Custom error message
 * @returns {Object} Error response object
 */
export const errorResponse = (error, errorMessage = 'Server error') => {
  console.error(error);
  return {
    success: false,
    message: errorMessage,
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  };
};
