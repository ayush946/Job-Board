const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const passportConfig = require("./lib/passportConfig");
require('dotenv').config();

const app = express();
let port = process.env.PORT || 3001; // Use port from environment or default to 3001

app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize());
// app.use(passport.initialize());

const skillRoutes = require("./routes/skillRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const jobRoutes   = require("./routes/jobRoutes");
const userRoutes = require("./routes/userRoutes");

app.use('/skills', skillRoutes);
app.use('/applications', applicationRoutes);
app.use('/recruiter', jobRoutes);
app.use('/auth', userRoutes);

app.get('/', (req, res) => {
  // testing route
  res.send('Hello World!');
});

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI is not defined in .env file");
  process.exit(1);
}

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
