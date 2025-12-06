const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');
const Course = require('../models/Course');

const createQuiz = async (req, res) => {
    const { title, courseId, questions } = req.body;

    try {
        const course = await Course.findById(courseId);
        
        //course check karega
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if the user is the teacher of the course
        if (course.teacher.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const newQuiz = new Quiz({
            title,
            course: courseId,
            questions
        });

        const quiz = await newQuiz.save();
        res.status(201).json(quiz);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const submitAttempt = async (req, res) => {
    const { answers } = req.body;

    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        let score = 0;
        quiz.questions.forEach((question, index) => {
            const correctOptionIndex = question.options.findIndex(option => option.correct);
            if (answers[index] === correctOptionIndex) {
                score++;
            }
        });

        const newAttempt = new Attempt({
            quiz: req.params.id,
            student: req.user.id,
            answers: answers.map((chosenIndex, questionIndex) => ({
                questionIndex,
                chosenOptionIndex: chosenIndex
            })),
            score
        });

        await newAttempt.save();
        res.status(201).json({ 
            message: 'Attempt submitted successfully',
            score: score,
            total: quiz.questions.length
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getQuizById = async (req, res) => {
    try {
        // Include correct answers for quiz functionality (needed for scoring and answer review)
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });
        res.json(quiz);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getQuizzesByCourse = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ course: req.params.courseId });
        res.json(quizzes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate('course', 'title');
        res.json(quizzes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const updateQuiz = async (req, res) => {
    const { title, course, questions } = req.body;

    try {
        let quiz = await Quiz.findById(req.params.id);
        
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Check if user is authorized to update (teacher of the course or admin)
        const courseDoc = await Course.findById(quiz.course);
        if (courseDoc.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        quiz.title = title || quiz.title;
        quiz.course = course || quiz.course;
        quiz.questions = questions || quiz.questions;

        const updatedQuiz = await quiz.save();
        res.json(updatedQuiz);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Check if user is authorized to delete (teacher of the course or admin)
        const course = await Course.findById(quiz.course);
        if (course.teacher.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await Quiz.findByIdAndDelete(req.params.id);
        res.json({ message: 'Quiz deleted successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    createQuiz,
    submitAttempt,
    getQuizzesByCourse,
    getQuizById,
    getAllQuizzes,
    updateQuiz,
    deleteQuiz
};
