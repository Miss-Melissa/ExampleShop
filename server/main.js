require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure required environment variables are present
if (!PORT) {
  console.error("Error: DB_URI is not defined in the environment variables.");
  process.exit(1);
}

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Use productRoutes for /products endpoint
app.use('/products', productRoutes);

// Logging Middleware (Optional)
// You can use morgan or any other logging library for production logging.
// Here is a basic console log version for debugging purposes:
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Error Handling Middleware (Optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown for production
process.on('SIGINT', () => {
  console.log('Server shutting down gracefully...');
  process.exit(0);
});
