const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User');
const Lesson = require('./models/Lesson');
const Quiz = require('./models/Quiz');
const Thread = require('./models/Thread');
const dotenv = require('dotenv');

dotenv.config();

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/skillnestDB';
const mongoUri = (process.env.MONGO_URI && process.env.MONGO_URI.trim()) || DEFAULT_URI;

const coursesData = [
  {
    title: "Introduction to Web Development",
    description: "Learn the basics of HTML, CSS, and JavaScript.",
    category: "Programming",
    published: true,
    lessons: [
      {
        title: "1. Basics of HTML and CSS",
        content: "Learn the fundamentals of HTML including tags, elements, and document structure. HTML (HyperText Markup Language) is the standard markup language for creating web pages. Master CSS (Cascading Style Sheets) to style your HTML elements. Learn about selectors, properties, and how to create beautiful web designs.",
        videoUrl: "https://www.youtube.com/embed/kUMe1FH4CHE"
      },
      {
        title: "2. Basics of JavaScript",
        content: "Introduction to JavaScript programming. Learn variables, functions, and how to make your web pages interactive.",
        videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk"
      },
      {
        title: "3. Advanced HTML and CSS",
        content: "Master advanced HTML and CSS techniques including responsive design, flexbox, grid layouts, animations, and modern CSS features.",
        videoUrl: "https://www.youtube.com/embed/yfoY53QXEnI"
      },
      {
        title: "4. React Basics",
        content: "Learn the fundamentals of React including components, props, state, and JSX. Build your first React applications.",
        videoUrl: "https://www.youtube.com/embed/y17RuWkWdn8"
      },
      {
        title: "5. Advanced React",
        content: "Master advanced React concepts including hooks, context API, routing, and state management.",
        videoUrl: "https://www.youtube.com/embed/3JluqTojuME"
      },
      {
        title: "6. Final Project",
        content: "Put it all together by building a complete full-stack web application using HTML, CSS, JavaScript, and React.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_20mb.mp4"
      }
    ],
    quizzes: [
      {
        title: "HTML Basics Quiz",
        questions: [
          {
            text: "What does HTML stand for?",
            options: [
              { text: "Hyperlinks and Text Markup Language", correct: false },
              { text: "Hyper Text Markup Language", correct: true }, // ✅ Answer: B
              { text: "Home Tool Markup Language", correct: false },
              { text: "Hyper Tool Multi Language", correct: false }
            ]
          },
          {
            text: "Which HTML tag is used to define an internal style sheet?",
            options: [
              { text: "<style>", correct: true }, // ✅ Answer: A
              { text: "<css>", correct: false },
              { text: "<script>", correct: false },
              { text: "<design>", correct: false }
            ]
          },
          {
            text: "Choose the correct HTML element for the largest heading:",
            options: [
              { text: "<heading>", correct: false },
              { text: "<h6>", correct: false },
              { text: "<h1>", correct: true }, // ✅ Answer: C
              { text: "<head>", correct: false }
            ]
          },
          {
            text: "Which HTML attribute specifies an alternate text for an image?",
            options: [
              { text: "title", correct: false },
              { text: "src", correct: false },
              { text: "alt", correct: true }, // ✅ Answer: C
              { text: "href", correct: false }
            ]
          },
          {
            text: "What is the correct HTML element for inserting a line break?",
            options: [
              { text: "<lb>", correct: false },
              { text: "<break>", correct: false },
              { text: "<br>", correct: true }, // ✅ Answer: C
              { text: "<line>", correct: false }
            ]
          },
          {
            text: "Which of the following is used to create a hyperlink in HTML?",
            options: [
              { text: "<link>", correct: false },
              { text: "<href>", correct: false },
              { text: "<a>", correct: true }, // ✅ Answer: C
              { text: "<url>", correct: false }
            ]
          },
          {
            text: "How can you make a numbered list?",
            options: [
              { text: "<ul>", correct: false },
              { text: "<ol>", correct: true }, // ✅ Answer: B
              { text: "<list>", correct: false },
              { text: "<dl>", correct: false }
            ]
          },
          {
            text: "Which HTML tag is used to define a table row?",
            options: [
              { text: "<td>", correct: false },
              { text: "<tr>", correct: true }, // ✅ Answer: B
              { text: "<th>", correct: false },
              { text: "<table>", correct: false }
            ]
          },
          {
            text: "Which HTML element is used for the title of a document?",
            options: [
              { text: "<meta>", correct: false },
              { text: "<title>", correct: true }, // ✅ Answer: B
              { text: "<head>", correct: false },
              { text: "<header>", correct: false }
            ]
          },
          {
            text: "Which of the following elements is used to display a list of items with bullets?",
            options: [
              { text: "<ol>", correct: false },
              { text: "<ul>", correct: true }, // ✅ Answer: B
              { text: "<dl>", correct: false },
              { text: "<li>", correct: false }
            ]
          }
        ]
      },
      {
        title: "CSS Fundamentals Quiz",
        questions: [
          {
            text: "What does CSS stand for?",
            options: [
              { text: "Computer Style Sheets", correct: false },
              { text: "Cascading Style Sheets", correct: true },
              { text: "Creative Style Sheets", correct: false },
              { text: "Colorful Style Sheets", correct: false }
            ]
          },
          {
            text: "Which property is used to change the background color?",
            options: [
              { text: "color", correct: false },
              { text: "bgcolor", correct: false },
              { text: "background-color", correct: true },
              { text: "background", correct: false }
            ]
          }
        ]
      }
    ]
  },
  {
    title: "Data Structures in Python",
    description: "Understand core data structures like arrays, lists, and trees.",
    category: "Programming",
    published: true,
    lessons: [
      {
        title: "1. Introduction to Data Structures",
        content: "Learn what data structures are and why they're important in programming. Understand the fundamentals of organizing and storing data efficiently.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
      },
      {
        title: "2. Arrays and Lists",
        content: "Master Python lists and arrays. Learn about indexing, slicing, and common list operations.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4"
      },
      {
        title: "3. Stacks and Queues",
        content: "Understand stack and queue data structures. Learn about LIFO and FIFO principles and their implementations.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4"
      },
      {
        title: "4. Trees and Binary Trees",
        content: "Explore tree data structures and binary trees. Learn about tree traversal algorithms and their applications.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_10mb.mp4"
      },
      {
        title: "5. Hash Tables and Dictionaries",
        content: "Master hash tables and Python dictionaries. Understand hashing, collisions, and efficient data retrieval.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_20mb.mp4"
      }
    ]
  },
  {
    title: "Machine Learning Foundations",
    description: "An introduction to ML concepts and algorithms.",
    category: "Data Science",
    published: true,
    lessons: [
      {
        title: "1. What is Machine Learning?",
        content: "Introduction to machine learning concepts, types of learning, and real-world applications.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
      },
      {
        title: "2. Supervised Learning",
        content: "Learn about supervised learning algorithms including linear regression and classification.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4"
      },
      {
        title: "3. Unsupervised Learning",
        content: "Explore unsupervised learning techniques like clustering and dimensionality reduction.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4"
      },
      {
        title: "4. Model Evaluation",
        content: "Learn how to evaluate machine learning models using various metrics and validation techniques.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_10mb.mp4"
      },
      {
        title: "5. Neural Networks Basics",
        content: "Introduction to neural networks and deep learning fundamentals.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_20mb.mp4"
      }
    ]
  },
  {
    title: "Digital Marketing 101",
    description: "Learn SEO, SEM, and social media marketing.",
    category: "Marketing",
    published: true,
    lessons: [
      {
        title: "1. Introduction to Digital Marketing",
        content: "Overview of digital marketing landscape and key strategies for online success.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
      },
      {
        title: "2. Search Engine Optimization (SEO)",
        content: "Master SEO techniques including keyword research, on-page optimization, and link building.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4"
      },
      {
        title: "3. Social Media Marketing",
        content: "Learn effective social media strategies for different platforms and audience engagement.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4"
      },
      {
        title: "4. Content Marketing",
        content: "Create compelling content strategies that drive traffic and build brand authority.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_10mb.mp4"
      },
      {
        title: "5. Analytics and Measurement",
        content: "Track and measure the success of your digital marketing campaigns using analytics tools.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_20mb.mp4"
      }
    ]
  },
  {
    title: "Graphic Design with Figma",
    description: "Master UI/UX design principles using Figma.",
    category: "Design",
    published: true,
    lessons: [
      {
        title: "1. Figma Interface Overview",
        content: "Get familiar with Figma's interface, tools, and workspace organization.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
      },
      {
        title: "2. UI/UX Design Principles",
        content: "Learn fundamental design principles including layout, typography, and color theory.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4"
      },
      {
        title: "3. Creating Wireframes",
        content: "Design effective wireframes to plan and communicate your design concepts.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4"
      },
      {
        title: "4. Prototyping Interactions",
        content: "Create interactive prototypes to demonstrate user flows and experiences.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_10mb.mp4"
      },
      {
        title: "5. Design Systems",
        content: "Build and maintain consistent design systems for scalable product design.",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_20mb.mp4"
      }
    ]
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log(`MongoDB connected for seeding at ${mongoUri}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const seedCourses = async () => {
  try {
    await connectDB();

    // Ensure demo users exist (Admin, Teacher, Learner)
    const bcrypt = require('bcryptjs');

    // Admin
    let admin = await User.findOne({ email: 'admin@elearn.com' });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      admin = new User({
        name: 'Demo Admin',
        email: 'admin@elearn.com',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('Demo Admin created: admin@elearn.com / admin123');
    } else {
      console.log('Demo Admin already exists.');
    }

    // Teacher
    let teacher = await User.findOne({ email: 'teacher@elearn.com' });
    if (!teacher) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('teacher123', salt);
      teacher = new User({
        name: 'Demo Teacher',
        email: 'teacher@elearn.com',
        password: hashedPassword,
        role: 'teacher'
      });
      await teacher.save();
      console.log('Demo Teacher created: teacher@elearn.com / teacher123');
    } else {
      console.log('Demo Teacher already exists.');
    }

    // Learner (Student)
    let learner = await User.findOne({ email: 'learner@elearn.com' });
    if (!learner) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('learner123', salt);
      learner = new User({
        name: 'Demo Learner',
        email: 'learner@elearn.com',
        password: hashedPassword,
        role: 'student'
      });
      await learner.save();
      console.log('Demo Learner created: learner@elearn.com / learner123');
    } else {
      console.log('Demo Learner already exists.');
    }
    
    // Clear existing courses, lessons, quizzes, and threads
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    await Thread.deleteMany({});
    console.log('Existing courses, lessons, quizzes, and threads cleared.');

    // Create new courses with teacher reference and their lessons and quizzes
    for (const courseData of coursesData) {
      const { lessons, quizzes, ...courseInfo } = courseData;

      const course = new Course({
        ...courseInfo,
        teacher: teacher._id
      });
      await course.save();

      // Create lessons for this course
      if (lessons && lessons.length > 0) {
        for (const lessonData of lessons) {
          const lesson = new Lesson({
            ...lessonData,
            course: course._id
          });
          await lesson.save();
        }
      }

      // Create quizzes for this course
      if (quizzes && quizzes.length > 0) {
        for (const quizData of quizzes) {
          const quiz = new Quiz({
            title: quizData.title,
            course: course._id,
            questions: quizData.questions
          });
          await quiz.save();
        }
      }

      console.log(`Created course: ${course.title} with ${lessons?.length || 0} lessons and ${quizzes?.length || 0} quizzes`);
    }

    // Create sample discussion threads
    const sampleThreads = [
      {
        title: "Welcome to Web Development Course!",
        body: "Hi everyone! I'm excited to start this journey into web development. HTML, CSS, and JavaScript are the building blocks of the web. What are you most looking forward to learning?",
        course: (await Course.findOne({ title: "Introduction to Web Development" }))._id,
        user: teacher._id,
        replies: [
          {
            user: teacher._id,
            body: "Great to see everyone here! We'll start with HTML basics and build up to creating full websites. Feel free to ask questions anytime!",
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
          }
        ]
      },
      {
        title: "CSS Layout Questions",
        body: "I'm having trouble understanding Flexbox vs Grid. Can someone explain when to use each one?",
        course: (await Course.findOne({ title: "Introduction to Web Development" }))._id,
        user: teacher._id,
        replies: [
          {
            user: teacher._id,
            body: "Great question! Use Flexbox for one-dimensional layouts (rows or columns) and Grid for two-dimensional layouts. We'll cover both in detail in the CSS lessons.",
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
          }
        ]
      },
      {
        title: "Python Data Structures Help",
        body: "Can someone explain the difference between lists and tuples in Python? When should I use each one?",
        course: (await Course.findOne({ title: "Data Structures in Python" }))._id,
        user: teacher._id,
        replies: []
      }
    ];

    for (const threadData of sampleThreads) {
      const thread = new Thread(threadData);
      await thread.save();
    }

    console.log(`Created ${sampleThreads.length} sample discussion threads`);
    console.log('Courses, lessons, quizzes, and discussions seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seedCourses();
