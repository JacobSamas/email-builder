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

// Get email template by ID
exports.getTemplateById = async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: "Template not found" });
    }
    res.json({ success: true, template });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching template" });
  }
};

// Download email template by ID
exports.downloadTemplateById = async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: "Template not found" });
    }

    const renderedHTML = `
      <html>
      <head><title>${template.title}</title></head>
      <body>
        <h1>${template.title}</h1>
        <p>${template.content}</p>
        <footer>${template.footer}</footer>
        ${template.imageUrl ? `<img src="${template.imageUrl}" alt="Email Image" style="max-width:100%;"/>` : ""}
      </body>
      </html>
    `;

    res.setHeader('Content-Disposition', `attachment; filename="email-template-${template._id}.html"`);
    res.setHeader('Content-Type', 'text/html');
    res.send(renderedHTML);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error generating template download" });
  }
};


