const express = require('express');
const router = express.Router();
const { createThread, getThreadsByCourse, addReplyToThread } = require('../controllers/forumController');
const { protect } = require('../middleware/authMiddleware');
const { filterBadWords } = require('../middleware/badWordsFilter');

// Naya thread banane ke liye route
router.post(
    '/',
    protect,
    filterBadWords,
    createThread // Yahan sirf createThread aayega
);

// Course ke saare threads dekhne ke liye route
router.get(
    '/course/:courseId',
    protect,
    getThreadsByCourse
);

// Thread par reply karne ke liye route (yeh alag hona chahiye)
router.post(
    '/:threadId/reply',
    protect,
    filterBadWords,
    addReplyToThread
);

module.exports = router;