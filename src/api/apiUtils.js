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
      uiState: 'server-error'
    };
  }

  const { status, data } = error.response;

  // Map status codes to UI states for resilient rendering
  let uiState = 'error';
  if (status === 401) uiState = 'auth-required';
  if (status === 403) uiState = 'access-denied';
  if (status === 404) uiState = 'not-found';
  if (status >= 500) uiState = 'server-error';

  return {
    message: data.message || data.error || genericMessage,
    status: status,
    data: data,
    isDisconnected: false,
    validationErrors: data.errors || null,
    uiState: uiState
  };
};

