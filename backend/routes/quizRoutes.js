const express = require('express');
const router = express.Router();
const { 
    createQuiz, 
    submitAttempt, 
    getQuizzesByCourse, 
    getQuizById,
    getAllQuizzes,
    updateQuiz,
    deleteQuiz
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// IMPORTANT: More specific routes must come before generic /:id routes

// Get all quizzes for a course (must come before /:id)
router.get('/course/:courseId', protect, getQuizzesByCourse);

// Submit a quiz attempt (must come before /:id)
router.post('/:id/attempt', protect, authorize('student'), submitAttempt);

// Get a single quiz by its ID
router.get('/:id', protect, getQuizById);

// Update a quiz (Teacher/Admin)
router.put('/:id', protect, authorize('teacher', 'admin'), updateQuiz);

// Delete a quiz (Teacher/Admin)
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteQuiz);

// Get all quizzes and create quiz - must be at root level
router.route('/')
  .get(protect, getAllQuizzes)
  .post(protect, authorize('teacher', 'admin'), createQuiz);

module.exports = router;