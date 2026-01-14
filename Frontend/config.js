// E4A Configuration File
// Update API_BASE_URL based on your deployment

const API_BASE_URL = 'http://localhost:3000/api';

// For Netlify deployment, you have several options:
// 
// Option 1: Deploy your backend to Railway.app or Render.com
//   Then update this to: 'https://your-backend-domain.com/api'
//
// Option 2: Use ngrok to tunnel your local backend
//   Install: npm install -g ngrok
//   Run: ngrok http 3000
//   Then update this to: 'https://your-ngrok-url/api'
//
// Option 3: Keep local and test with: npm run dev
//   This serves both frontend and backend from localhost:3000
//
// IMPORTANT: After updating this file, deploy to Netlify again

export const config = {
  apiBase: API_BASE_URL
};
