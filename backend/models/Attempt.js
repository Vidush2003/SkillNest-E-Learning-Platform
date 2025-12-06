const mongoose = require('mongoose');

const AttemptSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{
    questionIndex: Number,
    chosenOptionIndex: Number
  }],
  score: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Attempt || mongoose.model('Attempt', AttemptSchema);