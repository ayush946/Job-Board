const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');

const passportConfig = require("./lib/passportConfig");

require('dotenv').config();

const app = express();
let port = process.env.PORT || 3001; // Use port from environment or default to 3001

app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize());

const skillRoutes = require("./routes/skillRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const jobRoutes   = require("./routes/jobRoutes");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/upload"); 

app.use('/skills', skillRoutes);
app.use('/applications', applicationRoutes);
app.use('/recruiter', jobRoutes);
app.use('/auth', userRoutes);
app.use('/upload', uploadRoutes);


app.get('/', (req, res) => {
  // testing route
  res.send('Hello World!');
});

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI is not defined in .env file");
  process.exit(1);
}

mongoose.connect(uri);

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
