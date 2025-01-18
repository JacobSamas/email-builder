const fs = require('fs');
const path = require('path');
const EmailTemplate = require('../models/EmailTemplate');

// Fetch the email layout
exports.getEmailLayout = (req, res) => {
  const layoutPath = path.join(__dirname, '../layout.html');
  fs.readFile(layoutPath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to load layout' });
    }
    res.send(data);
  });
};

// Save email configuration
exports.uploadEmailConfig = async (req, res) => {
  try {
    const emailTemplate = new EmailTemplate(req.body);
    await emailTemplate.save();
    res.json({ success: true, emailTemplate });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save email config', error });
  }
};

// Render and download the final HTML
exports.renderAndDownloadTemplate = (req, res) => {
  const { title, content, footer, imageUrl } = req.body;

  const layoutPath = path.join(__dirname, '../layout.html');
  fs.readFile(layoutPath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to load layout' });
    }

    const renderedHtml = data
      .replace('{{title}}', title)
      .replace('{{content}}', content)
      .replace('{{footer}}', footer)
      .replace('{{imageUrl}}', imageUrl);

    res.setHeader('Content-Disposition', 'attachment; filename="email.html"');
    res.send(renderedHtml);
  });
};
