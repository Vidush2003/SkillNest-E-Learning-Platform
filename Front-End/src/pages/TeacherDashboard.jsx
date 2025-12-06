import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Users,
  MessageSquare,
  Plus,
  Eye,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { courseAPI, quizAPI, discussionAPI } from '../utils/api';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalDiscussions: 0,
    totalQuizzes: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch teacher's courses
        const coursesResponse = await courseAPI.getAll();
        const teacherCourses = coursesResponse.data.filter(course =>
          course.teacher && course.teacher._id === user.id
        );
        setCourses(teacherCourses);

        // Calculate stats
        const totalStudents = teacherCourses.reduce((sum, course) =>
          sum + (course.enrolledStudents?.length || 0), 0
        );

        // Fetch discussions for teacher's courses
        const discussionPromises = teacherCourses.map(course =>
          discussionAPI.getByCourse(course._id).catch(() => ({ data: [] }))
        );
        const discussionResponses = await Promise.all(discussionPromises);
        const allDiscussions = discussionResponses.flatMap(response => response.data || []);
        setDiscussions(allDiscussions);

        // Fetch quizzes for teacher's courses
        const quizPromises = teacherCourses.map(course =>
          quizAPI.getByCourse(course._id).catch(() => ({ data: [] }))
        );
        const quizResponses = await Promise.all(quizPromises);
        const totalQuizzes = quizResponses.reduce((sum, response) =>
          sum + (response.data?.length || 0), 0
        );

        setStats({
          totalCourses: teacherCourses.length,
          totalStudents,
          totalDiscussions: allDiscussions.length,
          totalQuizzes
        });

      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error('Error fetching teacher dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading teacher dashboard...</p>
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
        <h1 className="page-title">Teacher Dashboard</h1>
        <p className="page-description">
          Manage your courses, monitor student progress, and engage with learners
        </p>
      </div>

      {/* Stats Widgets */}
      <div className="content-grid" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <BookOpen size={32} style={{ margin: '0 auto 1rem', color: 'var(--primary-color)' }} />
          <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            {stats.totalCourses}
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>My Courses</p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <Users size={32} style={{ margin: '0 auto 1rem', color: '#10b981' }} />
          <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            {stats.totalStudents}
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>Total Students</p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <MessageSquare size={32} style={{ margin: '0 auto 1rem', color: '#f59e0b' }} />
          <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            {stats.totalDiscussions}
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>Discussions</p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <Award size={32} style={{ margin: '0 auto 1rem', color: '#ef4444' }} />
          <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            {stats.totalQuizzes}
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>Quizzes Created</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Quick Actions</h2>
        <div className="content-grid">
          <Link to="/admin/courses" className="card" style={{
            textAlign: 'center',
            padding: '2rem',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'transform 0.2s'
          }}>
            <Plus size={48} style={{ margin: '0 auto 1rem', color: 'var(--primary-color)' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Add New Course</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Create a new course for your students
            </p>
          </Link>

          <Link to="/admin/quizzes" className="card" style={{
            textAlign: 'center',
            padding: '2rem',
            textDecoration: 'none',
            color: 'inherit'
          }}>
            <Award size={48} style={{ margin: '0 auto 1rem', color: '#10b981' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Add Quiz</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Create assessments for your courses
            </p>
          </Link>
        </div>
      </div>

      {/* My Courses */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>My Courses</h2>
          <Link to="/admin/courses" className="btn btn-outline">
            Manage All Courses
          </Link>
        </div>

        {courses.length > 0 ? (
          <div className="content-grid">
            {courses.map((course) => (
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <Users size={16} />
                    {course.enrolledStudents?.length || 0} students
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle size={16} />
                    {course.published ? 'Published' : 'Draft'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link
                    to={`/courses/${course._id}`}
                    className="btn btn-primary"
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    View Course
                  </Link>
                  <Link
                    to={`/discussions?course=${course._id}`}
                    className="btn btn-outline"
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    Discussions
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <BookOpen size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-secondary)' }} />
            <h3>No Courses Yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Start by creating your first course
            </p>
            <Link to="/admin/courses" className="btn btn-primary">
              Create Course
            </Link>
          </div>
        )}
      </div>

      {/* Recent Discussions */}
      {discussions.length > 0 && (
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Recent Discussions</h2>
          <div className="content-grid">
            {discussions.slice(0, 6).map((discussion) => (
              <div key={discussion._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                    {discussion.title}
                  </h3>
                  <span className="badge badge-primary">
                    {discussion.replies?.length || 0} replies
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {discussion.body.substring(0, 100)}...
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  By {discussion.user?.name || 'Anonymous'} • {new Date(discussion.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
