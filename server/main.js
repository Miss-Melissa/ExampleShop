require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = 5000;

connectDB();

app.use(cors());
app.use(express.json());  // Replace bodyParser with express.json()

// Use productRoutes for /products endpoint
app.use('/products', productRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});
