const mongoose = require('mongoose');

const ThreadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  replies: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    body: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Thread || mongoose.model('Thread', ThreadSchema);