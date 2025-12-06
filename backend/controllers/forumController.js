const Thread = require('../models/Thread');
const Course = require('../models/Course');

// @desc    Create a new forum thread
// @route   POST /api/forum
const createThread = async (req, res) => {
    const { title, body, courseId } = req.body;
    try {
        // Optional: Check karega ki user enrolled hai ya nhi
        const course = await Course.findById(courseId);
        if (!course.enrolledStudents.includes(req.user.id) && course.teacher.toString() !== req.user.id) {
            return res.status(403).json({ message: "You must be enrolled in the course to post." });
        }

        const newThread = new Thread({
            title,
            body,
            course: courseId,
            user: req.user.id
        });

        const thread = await newThread.save();
        res.status(201).json(thread);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all threads for a course
// @route   GET /api/forum/course/:courseId
const getThreadsByCourse = async (req, res) => {
    try {
        const threads = await Thread.find({ course: req.params.courseId })
            .populate('user', 'name')
            .populate('replies.user', 'name');
        res.json(threads);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const addReplyToThread = async (req, res) => {
    const { body } = req.body; // Reply ka content

    try {
        const thread = await Thread.findById(req.params.threadId);

        if (!thread) {
            return res.status(404).json({ message: 'Thread not found' });
        }

        const newReply = {
            body: body,
            user: req.user.id // Logged-in user (teacher/student)
        };

        thread.replies.push(newReply);
        await thread.save();
        
        res.status(201).json(thread.replies);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    createThread,
    getThreadsByCourse,
    addReplyToThread
};
