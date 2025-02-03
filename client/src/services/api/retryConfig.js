const retryConfig = {
  retries: 3,
  retryDelay: (retryCount) => {
    // Exponential backoff: 1s, 2s, 4s
    return Math.min(1000 * (2 ** (retryCount - 1)), 10000);
  },
  retryCondition: (error) => {
    // Retry on network errors and 5xx responses
    return (
      !error.response || 
      (error.response.status >= 500 && error.response.status <= 599) ||
      error.code === 'ECONNABORTED'
    );
  }
};

export default retryConfig; 