const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
let port = 3001

require('dotenv').config();

const app = express();

app.use(cors());

app.use(express.json());

const userRoutes = require('../routes/userRoutes');
const applicationRoutes = require('../routes/applicationRoutes');
const jobRoutes = require('../routes/jobRoutes');
const companyRoutes = require('../routes/companyRoutes');

app.use('/users', userRoutes);
app.use('/applications', applicationRoutes);
app.use('/jobs', jobRoutes);
app.use('/companies', companyRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Connected to MongoDB');
});

db.on('error', (err) => {
  console.log('MongoDB connection error:', err);
});

db.on('disconnected', () => {
  console.log('MongoDB connection disconnected');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;