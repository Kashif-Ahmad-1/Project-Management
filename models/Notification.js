const mongoose = require('mongoose');

// Notification Schema
const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    status: { type: String, enum: ['unread', 'read'], default: 'unread' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
