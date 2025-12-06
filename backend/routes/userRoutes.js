const express = require('express');
const router = express.Router();
const { 
    getAllUsers, 
    deleteUser,
    getUserProfile,
    updateUserProfile,
    changePassword,
    getUserEnrollments,
    updateUserProgress
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// === PROFILE ROUTES (For any logged-in user) ===
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/profile/change-password', protect, changePassword);

// === USER COURSE ROUTES ===
router.get('/enrollments', protect, getUserEnrollments);
router.post('/progress', protect, updateUserProgress);

// === ADMIN ROUTES (For admin only) ===
router.get('/', protect, authorize('admin'), getAllUsers);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;