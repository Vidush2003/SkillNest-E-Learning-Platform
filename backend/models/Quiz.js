const mongoose = require('mongoose');


const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  questions: [{
    text: String,
    options: [{ text: String, correct: Boolean }]
  }]
});

module.exports = mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);