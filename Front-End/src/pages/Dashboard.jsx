import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardWidget from '../components/DashboardWidget';
import { BookOpen, Award, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { courseAPI, quizAPI, userAPI } from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // If no user, don't try to fetch data
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user's enrolled courses
        const enrollmentsResponse = await userAPI.getEnrollments();
        console.log('Enrollments response:', enrollmentsResponse);
        const enrollments = enrollmentsResponse.data || [];

        if (enrollments.length === 0) {
          setEnrolledCourses([]);
          setUpcomingQuizzes([]);
          setLoading(false);
          return;
        }

        // Fetch course details and progress for each enrollment
        const coursePromises = enrollments.map(enrollment =>
          courseAPI.getById(enrollment._id || enrollment.courseId).catch(err => {
            console.warn(`Failed to fetch course ${enrollment._id || enrollment.courseId}:`, err);
            return null;
          })
        );

        const progressPromises = enrollments.map(enrollment =>
          userAPI.getProgress(enrollment._id || enrollment.courseId).catch(err => {
            console.warn(`Failed to fetch progress for course ${enrollment._id || enrollment.courseId}:`, err);
            return { data: { percentage: 0, completedLessons: [] } };
          })
        );

        const [courseResponses, progressResponses] = await Promise.all([
          Promise.all(coursePromises),
          Promise.all(progressPromises)
        ]);

        const courses = courseResponses
          .filter(response => response !== null)
          .map((response, index) => ({
            ...response.data,
            progress: progressResponses[index]?.data?.percentage || 0,
            completedLessons: progressResponses[index]?.data?.completedLessons || [],
            enrolledDate: enrollments[index].enrolledDate
          }));

        setEnrolledCourses(courses);

        // Fetch quizzes for enrolled courses
        const quizPromises = enrollments.map(enrollment => 
          quizAPI.getByCourse(enrollment._id || enrollment.courseId).catch(err => {
            console.warn(`Failed to fetch quizzes for course ${enrollment._id || enrollment.courseId}:`, err);
            return { data: [] };
          })
        );
        
        const quizResponses = await Promise.all(quizPromises);
        const quizzes = quizResponses.flatMap(response => response.data || []);
        setUpcomingQuizzes(quizzes);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter((c) => c.progress === 100).length;
  const averageProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length
        )
      : 0;

  // If no user, redirect to login (handled by ProtectedRoute)
  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <AlertCircle size={48} style={{ margin: '0 auto 1rem', color: 'var(--error-color)' }} />
          <h3>Error Loading Dashboard</h3>
          <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user.name}! 👋</h1>
        <p className="page-description">
          Here's what's happening with your learning journey
        </p>
      </div>

      {/* Stats Widgets */}
      <div className="content-grid" style={{ marginBottom: '2rem' }}>
        <DashboardWidget
          title="Enrolled Courses"
          value={totalCourses}
          description="Active learning paths"
          icon={<BookOpen size={24} />}
          color="#4f46e5"
        />
        <DashboardWidget
          title="Completed Courses"
          value={completedCourses}
          description="Successfully finished"
          icon={<Award size={24} />}
          color="#10b981"
        />
        <DashboardWidget
          title="Average Progress"
          value={`${averageProgress}%`}
          description="Overall completion"
          icon={<TrendingUp size={24} />}
          color="#f59e0b"
        />
        <DashboardWidget
          title="Upcoming Quizzes"
          value={upcomingQuizzes.length}
          description="Tests to complete"
          icon={<Clock size={24} />}
          color="#ef4444"
        />
      </div>

      {/* Enrolled Courses */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>My Courses</h2>
          <Link to="/courses" className="btn btn-outline">
            Browse All Courses
          </Link>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="content-grid">
            {enrolledCourses.map((course) => (
              <div key={course._id} className="card">
                <img
                  src={course.thumbnail || `https://images.unsplash.com/photo-${course._id}?w=400`}
                  alt={course.title}
                  className="course-thumbnail"
                  style={{ borderRadius: '0.5rem', marginBottom: '1rem' }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400';
                  }}
                />
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                  {course.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {course.description}
                </p>

                {/* Progress Bar */}
                <div className="progress-container">
                  <div className="progress-header">
                    <span style={{ fontWeight: 500 }}>Progress</span>
                    <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
                      {course.progress}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                <Link
                  to={`/courses/${course._id}`}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '1rem' }}
                >
                  Continue Learning
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <BookOpen size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-secondary)' }} />
            <h3>No Enrolled Courses</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Start your learning journey by enrolling in a course
            </p>
            <Link to="/courses" className="btn btn-primary">
              Browse Courses
            </Link>
          </div>
        )}
      </div>

      {/* Upcoming Quizzes */}
      {upcomingQuizzes.length > 0 && (
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Upcoming Quizzes</h2>
          <div className="content-grid">
            {upcomingQuizzes.map((quiz) => (
              <div key={quiz._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.125rem' }}>{quiz.title}</h3>
                  <span className="badge badge-warning">Pending</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {quiz.description}
                </p>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  <div>Duration: {quiz.duration} minutes</div>
                  <div>Questions: {quiz.totalQuestions}</div>
                  <div>Passing Score: {quiz.passingScore}%</div>
                </div>
                <Link
                  to={`/quiz/${quiz._id}`}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Start Quiz
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
