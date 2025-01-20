const EmailTemplate = require('../models/EmailTemplate');
const path = require('path');
const fs = require('fs');

// Get email layout template
exports.getEmailLayout = (req, res) => {
    const layoutPath = path.join(__dirname, '../templates/layout.html');
    fs.readFile(layoutPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to load email layout' });
        }
        res.send(data);
    });
};

// Save email template to database
exports.uploadEmailConfig = async (req, res) => {
    try {
        const { title, content, footer, imageUrl } = req.body;

        if (!title || !content || !footer) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newTemplate = new EmailTemplate({
            title,
            content,
            footer,
            imageUrl,
        });

        await newTemplate.save();
        res.status(201).json({ success: true, template: newTemplate });
    } catch (error) {
        console.error('Error saving template:', error);
        res.status(500).json({ error: 'Failed to save template' });
    }
};

// Render email template and download
exports.renderAndDownloadTemplate = (req, res) => {
    const { title, content, footer, imageUrl } = req.body;

    const emailHtml = `
        <h1>${title}</h1>
        <p>${content}</p>
        ${imageUrl ? `<img src="${imageUrl}" alt="Email Image"/>` : ''}
        <footer>${footer}</footer>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.attachment('email-template.html');
    res.send(emailHtml);
};

// Get all saved email templates
exports.getAllTemplates = async (req, res) => {
    try {
        const templates = await EmailTemplate.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, templates });
    } catch (error) {
        console.error('Error retrieving templates:', error);
        res.status(500).json({ error: 'Failed to retrieve templates' });
    }
};
