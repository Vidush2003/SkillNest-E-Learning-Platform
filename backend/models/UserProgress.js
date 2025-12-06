const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    completedLessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    }]
});

// To ensure a student has only one progress document per course
UserProgressSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.models.UserProgress || mongoose.model('UserProgress', UserProgressSchema);