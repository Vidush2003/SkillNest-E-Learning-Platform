const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Environment variables load karo
dotenv.config();

// Database se connect karo
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ek basic test route
app.get('/', (req, res) => res.send('SkillNest API chal raha hai...'));

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes')); 
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/forum', require('./routes/forumRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server port ${PORT} par shuru ho gaya hai`));