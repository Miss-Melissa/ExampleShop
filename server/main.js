require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure that required environment variables are present
if (!process.env.PORT) {
  console.error("Error: DB_URI is not defined in the environment variables.");
  process.exit(1);
}

if (!process.env.PORT) {
  console.error("Error: PORT is not defined in the environment variables.");
  process.exit(1);
}


connectDB();

// Middleware
app.use(cors());  // Allows all origins (for development purposes)
app.use(express.json());  // For parsing JSON requests

// Serve static files (image uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use productRoutes for /products endpoint
app.use('/products', productRoutes);

// Log each request (optional)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Error Handling Middleware
// Catching errors in async routes (e.g., DB issues, malformed requests)
app.use((err, req, res, next) => {
  console.error('Error:', err.message || err);
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong!' });
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown for production
process.on('SIGINT', async () => {
  console.log('Server shutting down gracefully...');
  
  // Close the MongoDB connection gracefully
  if (connectDB.connection) {
    try {
      await connectDB.connection.close();
      console.log('MongoDB connection closed.');
    } catch (error) {
      console.error('Error while closing MongoDB connection:', error);
    }
  }
  
  // Stop the server
  server.close(() => {
    console.log('Server stopped.');
    process.exit(0);
  });
});

