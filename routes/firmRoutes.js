const express = require('express');
const router = express.Router();
const { addFirm, upload, deleteFirmById } = require('../controllers/firmController');
const verifyToken = require('../middlewares/verifyToken');
const path = require('path');

// Add Firm
router.post('/add-firm', verifyToken, upload.single('image'), addFirm);

// Serve uploaded images
router.get('/uploads/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  res.setHeader('Content-Type', 'image/jpeg');
  res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});

// Delete firm
router.delete('/:firmId', deleteFirmById);

module.exports = router;