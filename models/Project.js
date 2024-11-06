// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  projectTitle: {
    type: String,
    required: true,
  },
  dateProject: {
    type: Date,
    default: Date.now,
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'normal', 'low'],
    default: 'normal',
  },
  price: {
    type: Number,
    required: true,
  },
  projectCompletionTime: {
    type: String,
    required: true,
  },
  websiteType: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  development: {
    assignDeveloper: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  figmaDesign: {
    assignDeveloper: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  backendDevelopment: {
    assignDeveloper: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  activities: {
    type: String,
    enum: ['assigned', 'started', 'in progress', 'bug', 'completed', 'commented'],
    default: 'assigned',
  },
  daysLeftToCompletion: {
    type: Number,
  },
  assets: [
    {
      url: String,
      type: String,
    },
  ],
  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

module.exports = mongoose.model('Project', projectSchema);
