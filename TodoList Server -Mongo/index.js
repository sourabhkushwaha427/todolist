const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require('./db');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

// Connect to database
connectDB();

app.use(cors({
  origin: '*',
  credentials: true,
}));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routers
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('Task Management API (Mongoose) is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});