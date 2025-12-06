import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import VideoPlayer from '../components/VideoPlayer';
import PDFViewer from '../components/PDFViewer';
import {
  BookOpen,
  Clock,
  Users,
  Star,
  PlayCircle,
  FileText,
  ArrowLeft,
  AlertCircle,
  ChevronRight,
  Award,
  Edit,
  Plus
} from 'lucide-react';
import { courseAPI, userAPI, quizAPI, lessonAPI } from '../utils/api';

const CourseDetail = () => {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [error, setError] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!user || !user.id) return;

      try {
        setLoadingCourse(true);
        setError('');

        // Fetch course details
        const courseResponse = await courseAPI.getById(id);
        setCourse(courseResponse.data);

        // Check if user is the teacher of this course
        const isUserTeacher = user.role === 'teacher' && courseResponse.data.teacher?._id === user.id;
        setIsTeacher(isUserTeacher);

        // Fetch user enrollments
        const enrollmentsResponse = await userAPI.getEnrollments();
        const userEnrollments = enrollmentsResponse.data || [];
        setEnrollments(userEnrollments);

        // Check if user is enrolled in this course or is the teacher
        const isUserEnrolled = userEnrollments.some((enrollment) => enrollment._id === id) || isUserTeacher;
        setIsEnrolled(isUserEnrolled);

        // Fetch lessons and quizzes (show all content for teachers and enrolled students)
        try {
          const [lessonsResponse, quizzesResponse] = await Promise.all([
            isUserEnrolled || isUserTeacher ? lessonAPI.getByCourse(id) : Promise.resolve({ data: [] }),
            quizAPI.getByCourse(id)
          ]);
          setLessons(lessonsResponse.data || []);
          setQuizzes(quizzesResponse.data || []);

          // Set first lesson as selected if available
          if (lessonsResponse.data && lessonsResponse.data.length > 0) {
            setSelectedLesson(lessonsResponse.data[0]);
          }
        } catch (err) {
          console.error('Error fetching course content:', err);
        }
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('Failed to load course details. Please try again.');
      } finally {
        setLoadingCourse(false);
      }
    };

    fetchCourseData();
  }, [id, user]);

  const handleEnroll = async () => {
    try {
      await courseAPI.enroll(id);
      setIsEnrolled(true);
      // Refresh enrollments
      const enrollmentsResponse = await userAPI.getEnrollments();
      setEnrollments(enrollmentsResponse.data || []);
      alert('Successfully enrolled in the course!');
    } catch (err) {
      console.error('Error enrolling in course:', err);
      alert('Failed to enroll in the course. Please try again.');
    }
  };

  if (loading || loadingCourse) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <AlertCircle size={48} style={{ margin: '0 auto 1rem', color: 'var(--error-color)' }} />
          <h3>Error Loading Course</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{error}</p>
          <button onClick={() => navigate('/courses')} className="btn btn-primary">
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <AlertCircle size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-secondary)' }} />
          <h3>Course not found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            The course you're looking for doesn't exist or has been removed.
          </p>
          <button onClick={() => navigate('/courses')} className="btn btn-primary">
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button
        onClick={() => navigate('/courses')}
        className="btn btn-outline"
        style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <ArrowLeft size={16} />
        Back to Courses
      </button>

      {!isEnrolled && !isTeacher ? (
        // Course Overview (Not Enrolled)
        <div>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <img
              src={course.thumbnail}
              alt={course.title}
              style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1.5rem' }}
            />

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <span className="badge badge-primary">{course.category || 'General'}</span>
              <span className="badge badge-success">
                Published
              </span>
            </div>

            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{course.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginBottom: '1.5rem' }}>
              {course.description}
            </p>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={20} color="var(--primary-color)" />
                <span>{course.enrolledStudents?.length || 0} students enrolled</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={20} color="var(--primary-color)" />
                <span>Instructor: {course.teacher?.name || 'TBA'}</span>
              </div>
            </div>

            <button onClick={handleEnroll} className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '0.875rem 2rem' }}>
              Enroll Now
            </button>
          </div>

          {/* Course Information */}
          <div className="card">
            <h2 style={{ marginBottom: '1.5rem' }}>About This Course</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              This course covers {course.category || 'various topics'} in depth.
              Lessons and modules will be available once you enroll.
            </p>
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--light-bg)', borderRadius: '0.5rem' }}>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>What you'll learn:</h4>
              <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
                <li>Comprehensive understanding of {course.category || 'the subject'}</li>
                <li>Practical skills and hands-on experience</li>
                <li>Access to course materials and resources</li>
                <li>Certificate upon completion</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        // Enrolled - Course Learning Interface
        <div>
          {/* Course Header */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{course.title}</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Instructor: {course.teacher?.name || 'TBA'}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                {isTeacher && (
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/admin/courses')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Edit size={16} />
                    Edit Course
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="split-layout">
            {/* Main Content Area */}
            <div>
              {selectedLesson && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem' }}>{selectedLesson.title}</h2>
                  </div>

                  {selectedLesson.videoUrl ? (
                    <VideoPlayer url={selectedLesson.videoUrl} title={selectedLesson.title} />
                  ) : (
                    <div style={{
                      height: '300px',
                      backgroundColor: 'var(--light-bg)',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <PlayCircle size={48} />
                        <p style={{ marginTop: '1rem' }}>Video content will be available soon</p>
                      </div>
                    </div>
                  )}

                  {selectedLesson.content && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <h3 style={{ marginBottom: '1rem' }}>Lesson Content</h3>
                      <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        {selectedLesson.content}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedQuiz && (
                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Award size={20} color="var(--primary-color)" />
                    <h2 style={{ fontSize: '1.25rem' }}>{selectedQuiz.title}</h2>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Test your knowledge with this quiz
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/quiz/${selectedQuiz._id}`)}
                  >
                    Start Quiz
                  </button>
                </div>
              )}

              {!selectedLesson && !selectedQuiz && (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <BookOpen size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-secondary)' }} />
                  <h3>Welcome to {course.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Select a lesson from the sidebar to start learning
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              {/* Lessons Section */}
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Course Lessons</h3>
                {lessons.length > 0 ? (
                  <div>
                    {lessons.map((lesson, index) => (
                      <div
                        key={lesson._id}
                        style={{
                          padding: '0.75rem',
                          marginBottom: '0.5rem',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          backgroundColor: selectedLesson?._id === lesson._id ? '#eef2ff' : 'var(--light-bg)',
                          border: selectedLesson?._id === lesson._id ? '2px solid var(--primary-color)' : '2px solid transparent',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                        onClick={() => {
                          setSelectedLesson(lesson);
                          setSelectedQuiz(null);
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                            {index + 1}. {lesson.title}
                          </div>
                          {lesson.videoUrl && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <PlayCircle size={12} />
                              Video Lesson
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    No lessons available yet. Check back soon!
                  </p>
                )}
              </div>

              {/* Quizzes Section */}
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Course Quizzes</h3>
                {quizzes.length > 0 ? (
                  <div>
                    {quizzes.map((quiz) => (
                      <div
                        key={quiz._id}
                        style={{
                          padding: '0.75rem',
                          marginBottom: '0.5rem',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          backgroundColor: selectedQuiz?._id === quiz._id ? '#eef2ff' : 'var(--light-bg)',
                          border: selectedQuiz?._id === quiz._id ? '2px solid var(--primary-color)' : '2px solid transparent',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                        onClick={() => {
                          setSelectedQuiz(quiz);
                          setSelectedLesson(null);
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Award size={16} />
                            {quiz.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {quiz.questions?.length || 0} questions
                          </div>
                        </div>
                        <ChevronRight size={16} color="var(--text-secondary)" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    No quizzes available yet.
                  </p>
                )}
              </div>

              {/* Discussion Section */}
              <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Course Discussion</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Connect with other students and instructors
                </p>
                <button
                  className="btn btn-outline"
                  style={{ width: '100%' }}
                  onClick={() => navigate(`/discussions?course=${course._id}`)}
                >
                  Join Discussion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;