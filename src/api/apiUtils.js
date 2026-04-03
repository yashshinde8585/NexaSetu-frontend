// Normalizes error responses from API calls to a consistent format.
export const normalizeError = (error) => {
  const genericMessage = 'Something went wrong. Please try again later.';

  if (!error.response) {
    // Network errors, server down, etc.
    return {
      message:
        error.message === 'Network Error'
          ? 'Server is unreachable. Please check your connection.'
          : error.message || genericMessage,
      status: 0,
      data: null,
      isDisconnected: true,
    };
  }

  const { status, data } = error.response;

  return {
    message: data.message || data.error || genericMessage,
    status: status,
    data: data,
    isDisconnected: false,
    validationErrors: data.errors || null,
  };
};

// Normalizes successful API responses for a consistent structure across the app.
export const normalizeResponse = (response) => {
  return {
    data: response.data,
    status: response.status,
    headers: response.headers,
  };
};
