const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Routes
router.get('/getEmailLayout', emailController.getEmailLayout);
router.post('/uploadEmailConfig', emailController.uploadEmailConfig);
router.post('/renderAndDownloadTemplate', emailController.renderAndDownloadTemplate);

// Route to handle image upload
router.post('/uploadImage', upload.single('image'), (req, res) => {
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  });

module.exports = router;
