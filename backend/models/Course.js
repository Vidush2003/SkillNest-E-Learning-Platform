const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String },
  published: { type: Boolean, default: false },
  
  
  enrolledStudents: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [] 
  },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Course || mongoose.model('Course', CourseSchema);