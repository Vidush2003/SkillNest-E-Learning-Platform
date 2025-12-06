const User = require('../models/User');
const Course = require('../models/Course');
const UserProgress = require('../models/UserProgress');
const bcrypt = require('bcryptjs');

// === ADMIN FUNCTIONS ===
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// === PROFILE FUNCTIONS ===
const getUserProfile = async (req, res) => {
    res.json(req.user);
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.bio = req.body.bio || user.bio;
            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// === USER COURSE FUNCTIONS ===
const getUserEnrollments = async (req, res) => {
    try {
        const courses = await Course.find({ enrolledStudents: req.user.id }).populate('teacher', 'name');
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const updateUserProgress = async (req, res) => {
    const { courseId, moduleId } = req.body;
    const studentId = req.user.id;

    try {
        let progress = await UserProgress.findOne({ student: studentId, course: courseId });

        // If no progress document exists, create one
        if (!progress) {
            progress = await UserProgress.create({ student: studentId, course: courseId });
        }

        // Add lesson to completedLessons if it's not already there
        if (!progress.completedLessons.includes(moduleId)) {
            progress.completedLessons.push(moduleId);
            await progress.save();
        }
        
        res.json(progress);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getAllUsers,
    deleteUser,
    getUserProfile,
    updateUserProfile,
    changePassword,
    getUserEnrollments,
    updateUserProgress
};