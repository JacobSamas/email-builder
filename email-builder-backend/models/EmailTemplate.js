const mongoose = require('mongoose');

const EmailTemplateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    footer: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmailTemplate', EmailTemplateSchema);
