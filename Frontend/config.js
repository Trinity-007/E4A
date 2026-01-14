// E4A Frontend Configuration
// Update API_BASE_URL based on your deployment

// Production (Render)
// const API_BASE_URL = 'https://your-render-backend-url/api';

// Staging (localhost)
const API_BASE_URL = 'http://localhost:3000/api';

// Detect environment and set URL automatically
const getAPIBase = () => {
  // If on Netlify (Render/production domain)
  if (window.location.hostname.includes('netlify')) {
    // You'll set this as an environment variable in Netlify
    return window.API_BASE || 'http://localhost:3000/api';
  }
  // If on Render (backend domain)
  if (window.location.hostname.includes('render')) {
    return 'https://' + window.location.hostname + '/api';
  }
  // Default to localhost for local development
  return 'http://localhost:3000/api';
};

export const config = {
  apiBase: getAPIBase()
};
