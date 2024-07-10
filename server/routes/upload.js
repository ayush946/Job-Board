const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const ensureDirectoryExistence = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDirectoryExistence('uploads/resumes');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, 'uploads/resumes');
    } else {
      cb(new Error('Invalid file type. Only PDF files are allowed.'), false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `resume-${Date.now()}${path.extname(file.originalname)}`);
  }
});


const upload = multer({ storage });


const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileType: { type: String, required: true },
  filePath: { type: String, required: true }
});

const Resume = mongoose.model('Resume', resumeSchema);

router.post('/resume', upload.single('file'), async (req, res) => {
  console.log(req.file);
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const resume = new Resume({
    fileType: 'resume',
    filePath: req.file.path
  });

  try {
    await resume.save();
    res.status(201).json({ message: 'Resume uploaded successfully', resume });
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload resume', error: err.message });
  }
});

module.exports = router;
