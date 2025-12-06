const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  videoUrl: { type: String },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }
});

module.exports = mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);