require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const uploadRoutes = require('./routes/upload');
const negotiationRoutes = require('./routes/negotiations');
const verificationRoutes = require('./routes/verifications');
const sellerAPIRoutes = require('./routes/seller-api');

const app = express();

// Enhanced CORS configuration for Netlify and local testing
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from:
    // - localhost (local development)
    // - ngrok tunnels
    // - Railway/Render deployments
    // - Any Netlify deployment
    const allowedOrigins = [
      /localhost/,
      /127\.0\.0\.1/,
      /ngrok\.io$/,
      /railway\.app$/,
      /onrender\.com$/,
      /netlify\.app$/,
      /herokuapp\.com$/
    ];
    
    // Allow requests without origin (like Postman, curl)
    if (!origin) return callback(null, true);
    
    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(pattern => 
      pattern instanceof RegExp ? pattern.test(origin) : origin === pattern
    );
    
    if (isAllowed || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/e4a_db';

// connect to MongoDB
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// serve frontend static files
app.use(express.static(path.join(__dirname, '..', '..', 'Frontend')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/negotiations', negotiationRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/seller', sellerAPIRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'index.html'));
});

app.listen(PORT, () => console.log(`✅ Production backend listening on ${PORT}`));
