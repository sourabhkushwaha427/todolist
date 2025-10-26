const express = require('express');
const cors = require('cors'); 
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*', 
  credentials: true, 
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('Task Management API is running...');
});


app.listen(PORT, () => {
  console.log("Server is running");
});
