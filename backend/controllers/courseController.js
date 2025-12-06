const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const UserProgress = require('../models/UserProgress')
// @desc    Get all courses (with search and filter)
// @route   GET /api/courses?keyword=...
const getAllCourses = async (req, res) => {
    try {
        // Naya logic start: URL se keyword nikalte hain
        const keyword = req.query.keyword ? {
            $or: [
                { title: { $regex: req.query.keyword, $options: 'i' } }, // 'i' for case-insensitive
                { description: { $regex: req.query.keyword, $options: 'i' } }
            ]
        } : {}; // Agar keyword nahi hai, to object khaali rahega

        // Database query object mein keyword ko jodte hain
        const courses = await Course.find({ ...keyword, published: true }).populate('teacher', 'name');
        
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get a single course by ID
// @route   GET /api/courses/:id
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('teacher', 'name');
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Teacher)
const createCourse = async (req, res) => {
    const { title, description, category } = req.body;
    try {
        const newCourse = new Course({
            title,
            description,
            category,
            teacher: req.user.id // from protect middleware
        });
        const course = await newCourse.save();
        res.status(201).json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Add a lesson to a course
// @route   POST /api/courses/:courseId/lessons
// @access  Private (Teacher)
const addLesson = async (req, res) => {
    const { title, content, videoUrl } = req.body;
    try {
        const course = await Course.findById(req.params.courseId);

        // Make sure the user adding the lesson is the teacher of the course
        if (course.teacher.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const newLesson = new Lesson({
            title,
            content,
            videoUrl,
            course: req.params.courseId
        });

        const lesson = await newLesson.save();
        res.status(201).json(lesson);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const enrollInCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Check if student is already enrolled
        if (course.enrolledStudents.includes(req.user.id)) {
            return res.status(400).json({ msg: 'Student already enrolled' });
        }

        course.enrolledStudents.push(req.user.id);
        await course.save();

        res.json(course.enrolledStudents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const updateCourse = async (req, res) => {
    try {
        let course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ msg: 'Course not found' });

        if (course.teacher.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        course = await Course.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ msg: 'Course not found' });
        
        if (course.teacher.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Course.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Course removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all lessons for a course
// @route   GET /api/courses/:courseId/lessons
const getLessonsByCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course.enrolledStudents.includes(req.user.id) && course.teacher.toString() !== req.user.id) {
            return res.status(403).json({ message: "You must be enrolled to view lessons." });
        }
        const lessons = await Lesson.find({ course: req.params.courseId });
        res.json(lessons);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const markLessonAsComplete = async (req, res) => {
    const { courseId, lessonId } = req.params;
    const studentId = req.user.id;

    try {
        let progress = await UserProgress.findOne({ student: studentId, course: courseId });

        // If no progress document exists, create one
        if (!progress) {
            progress = await UserProgress.create({ student: studentId, course: courseId });
        }

        // Add lesson to completedLessons if it's not already there
        if (!progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
            await progress.save();
        }
        
        res.json(progress);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getUserProgress = async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.user.id;

    try {
        const totalLessons = await Lesson.countDocuments({ course: courseId });
        const progress = await UserProgress.findOne({ student: studentId, course: courseId });

        if (totalLessons === 0) {
            return res.json({
                completedCount: 0,
                totalCount: 0,
                percentage: 100, // If no lessons, course is 100% complete
                completedLessons: []
            });
        }
        
        if (!progress) {
            return res.json({
                completedCount: 0,
                totalCount: totalLessons,
                percentage: 0,
                completedLessons: []
            });
        }

        const completedCount = progress.completedLessons.length;
        const percentage = Math.round((completedCount / totalLessons) * 100);

        res.json({
            completedCount,
            totalCount: totalLessons,
            percentage,
            completedLessons: progress.completedLessons
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    addLesson,
    enrollInCourse,
    updateCourse,
    deleteCourse,
    getLessonsByCourse,
    markLessonAsComplete,
    getUserProgress
};