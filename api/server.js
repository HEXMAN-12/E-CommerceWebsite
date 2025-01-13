const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3000;

// Enable compression
app.use(compression());

// Security with helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:", "http:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https:", "http:"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https:", "http:"],
      fontSrc: ["'self'", "https:", "http:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? [/\.vercel\.app$/, /localhost/] : '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Cache static files
app.use(express.static(path.join(__dirname, '../'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
  etag: true,
  lastModified: true,
}));

// Load product data with error handling
let productsData;
try {
  productsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf8'));
} catch (error) {
  console.error('Failed to load products data:', error);
  productsData = { products: [] };
}

// API rate limiting (simple in-memory implementation)
const rateLimit = new Map();
const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // per minute

function rateLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, firstRequest: now });
    return next();
  }

  const userData = rateLimit.get(ip);
  if (now - userData.firstRequest > WINDOW_SIZE) {
    userData.count = 1;
    userData.firstRequest = now;
    return next();
  }

  if (userData.count > MAX_REQUESTS) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  userData.count++;
  next();
}

// API endpoints with error handling
app.get('/api/products', rateLimiter, (req, res) => {
  try {
    res.json(productsData.products);
  } catch (error) {
    console.error('Error serving products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products/:id', rateLimiter, (req, res) => {
  try {
    const product = productsData.products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error serving product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling for non-existent routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    next();
  }
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Clean up rate limit data periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimit.entries()) {
    if (now - data.firstRequest > WINDOW_SIZE) {
      rateLimit.delete(ip);
    }
  }
}, WINDOW_SIZE);

// Start server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Environment:', process.env.NODE_ENV || 'development');
  });
}

module.exports = app; 