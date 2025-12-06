const express = require('express');
const router = express.Router();
const {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    addLesson,
    enrollInCourse,
    getLessonsByCourse,
    markLessonAsComplete,
    getUserProgress
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Teacher/Admin routes
router.post('/', protect, authorize('teacher', 'admin'), createCourse);
router.put('/:id', protect, authorize('teacher', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteCourse);
router.post('/:courseId/lessons', protect, authorize('teacher', 'admin'), addLesson);

// Student routes
router.post('/:id/enroll', protect, authorize('student'), enrollInCourse);
router.get('/:courseId/lessons', protect, authorize('student', 'teacher', 'admin'), getLessonsByCourse);

// Progress routes
router.post('/:courseId/lessons/:lessonId/complete', protect, authorize('student'), markLessonAsComplete);
router.get('/:courseId/progress', protect, authorize('student'), getUserProgress);

module.exports = router;