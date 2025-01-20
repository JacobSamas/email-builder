const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const multer = require('multer');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Email Template Routes
router.get('/getEmailLayout', emailController.getEmailLayout);
router.post('/uploadEmailConfig', emailController.uploadEmailConfig);
router.post('/renderAndDownloadTemplate', emailController.renderAndDownloadTemplate);
router.get('/getAllTemplates', emailController.getAllTemplates);
router.get('/getTemplate/:id', emailController.getTemplateById);
router.get('/downloadTemplate/:id', emailController.downloadTemplateById);



// Image Upload Route
router.post('/uploadImage', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }
    
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.json({ imageUrl });
});

module.exports = router;
