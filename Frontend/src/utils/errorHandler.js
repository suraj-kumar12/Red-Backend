/**
 * Error extraction utility to sanitize and format API errors into user-friendly messages
 */

export const getErrorMessage = (error, fallbackMessage = 'An unexpected error occurred. Please try again.') => {
  if (!error) return fallbackMessage;

  // If already a string message
  if (typeof error === 'string') return error;

  // Network / Connection errors
  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || !error.response) {
    return 'Unable to connect to the server. Please ensure the backend is running and check your connection.';
  }

  const { status, data } = error.response;

  // If backend returned an explicit user-facing message
  if (data && data.message && typeof data.message === 'string') {
    // Sanitize technical messages
    const msg = data.message;
    if (msg.includes('Cast to ObjectId failed') || msg.includes('CastError')) {
      return 'The requested resource identifier is invalid.';
    }
    if (msg.includes('E11000 duplicate key error')) {
      return 'A record with this information already exists in the system.';
    }
    return msg;
  }

  // Standard HTTP status code fallbacks
  switch (status) {
    case 400:
      return 'Invalid request data. Please check your inputs and try again.';
    case 401:
      return 'Your session has expired or you are not logged in. Please sign in.';
    case 403:
      return 'Permission denied. Administrator privileges are required to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'Conflict: A record with this key or identifier already exists.';
    case 429:
      return 'Too many requests. Please slow down and try again in a few moments.';
    case 500:
    case 502:
    case 503:
      return 'Server encountered an issue. Please try again later.';
    default:
      return fallbackMessage;
  }
};

export default {
  getErrorMessage,
};
