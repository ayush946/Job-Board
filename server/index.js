const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
let port = 3001

require('dotenv').config();

const app = express();

app.use(cors());

app.use(express.json());

const skillRoutes = require("./routes/skillRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

app.use('/skills', skillRoutes);
app.use('/applications', applicationRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;