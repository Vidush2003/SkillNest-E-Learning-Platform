import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardWidget from '../components/DashboardWidget';
import { 
  Users, 
  BookOpen, 
  FileQuestion, 
  TrendingUp, 
  Download, 
  AlertCircle,
  Plus,
  Award,
  MessageSquare,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { courseAPI, quizAPI, discussionAPI } from '../utils/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState({ course: false, user: false });
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalQuizzes: 0,
    totalDiscussions: 0
  });
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch courses first (most important)
        const coursesResponse = await courseAPI.getAll();
        const allCourses = coursesResponse.data || [];

        // Try to fetch quizzes, but don't fail if it errors
        let allQuizzes = [];
        try {
          const quizzesResponse = await quizAPI.getAll();
          allQuizzes = quizzesResponse.data || [];
        } catch (quizError) {
          console.warn('Failed to load quizzes:', quizError);
          // Continue without quizzes
        }

        // Fetch discussions for all courses
        let allDiscussions = [];
        try {
          const discussionPromises = allCourses.slice(0, 10).map(course =>
            discussionAPI.getByCourse(course._id).catch(() => ({ data: [] }))
          );
          const discussionResponses = await Promise.all(discussionPromises);
          allDiscussions = discussionResponses.flatMap(response => response.data || []);
        } catch (discussionError) {
          console.warn('Failed to load discussions:', discussionError);
          // Continue without discussions
        }

        // Calculate stats
        const totalStudents = allCourses.reduce((sum, course) => 
          sum + (course.enrolledStudents?.length || 0), 0
        );

        setStats({
          totalUsers: totalStudents,
          totalCourses: allCourses.length,
          totalQuizzes: allQuizzes.length,
          totalDiscussions: allDiscussions.length
        });

        setCourses(allCourses.slice(0, 5)); // Top 5 courses
        setQuizzes(allQuizzes.slice(0, 5));
        setDiscussions(allDiscussions.slice(0, 5));

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleExportCourseStats = async () => {
    setExporting({ ...exporting, course: true });
    try {
      // Generate CSV data
      const csvData = [
        ['Course Title', 'Category', 'Enrollments', 'Teacher', 'Published'],
        ...courses.map(course => [
          course.title,
          course.category || 'N/A',
          course.enrolledStudents?.length || 0,
          course.teacher?.name || 'N/A',
          course.published ? 'Yes' : 'No'
        ])
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `course-analytics-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting({ ...exporting, course: false });
    }
  };

  const handleExportUserStats = async () => {
    setExporting({ ...exporting, user: true });
    try {
      const csvData = [
        ['Metric', 'Value'],
        ['Total Courses', stats.totalCourses],
        ['Total Quizzes', stats.totalQuizzes],
        ['Total Students', stats.totalUsers],
        ['Total Discussions', stats.totalDiscussions]
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `platform-stats-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting({ ...exporting, user: false });
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseAPI.delete(courseId);
        setCourses(courses.filter(c => c._id !== courseId));
        setStats({ ...stats, totalCourses: stats.totalCourses - 1 });
      } catch (err) {
        console.error('Error deleting course:', err);
        alert('Failed to delete course. Please try again.');
      }
    }
  };

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
          <AlertCircle size={48} style={{ margin: '0 auto 1rem', color: 'var(--danger-color)' }} />
          <h3>Error Loading Dashboard</h3>
          <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-description">
          Overview of platform analytics and statistics
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className="btn btn-outline" 
              onClick={handleExportCourseStats}
              disabled={exporting.course}
            >
              <Download size={16} />
              {exporting.course ? 'Exporting...' : 'Export Course Data'}
            </button>
            <button 
              className="btn btn-outline" 
              onClick={handleExportUserStats}
              disabled={exporting.user}
            >
              <Download size={16} />
              {exporting.user ? 'Exporting...' : 'Export Platform Stats'}
            </button>
          </div>
        </div>
        <div className="content-grid">
          <Link to="/admin/courses" className="card" style={{
            textAlign: 'center',
            padding: '2rem',
            textDecoration: 'none',
            color: 'inherit',
            cursor: 'pointer'
          }}>
            <Plus size={48} style={{ margin: '0 auto 1rem', color: 'var(--primary-color)' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Manage Courses</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Create, edit, and manage platform courses
            </p>
          </Link>
          <Link to="/admin/quizzes" className="card" style={{
            textAlign: 'center',
            padding: '2rem',
            textDecoration: 'none',
            color: 'inherit',
            cursor: 'pointer'
          }}>
            <Award size={48} style={{ margin: '0 auto 1rem', color: '#10b981' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Manage Quizzes</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Create and manage assessments
            </p>
          </Link>
          
          {/* UPDATED: Manage Users is now a Link */}
          <Link to="/admin/users" className="card" style={{
            textAlign: 'center',
            padding: '2rem',
            textDecoration: 'none',
            color: 'inherit',
            cursor: 'pointer'
          }}>
            <Users size={48} style={{ margin: '0 auto 1rem', color: '#f59e0b' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Manage Users</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              View and manage platform users
            </p>
          </Link>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="content-grid" style={{ marginBottom: '2rem' }}>
        <DashboardWidget
          title="Total Students"
          value={stats.totalUsers.toLocaleString()}
          description="Enrolled learners"
          icon={<Users size={24} />}
          color="#4f46e5"
        />
        <DashboardWidget
          title="Total Courses"
          value={stats.totalCourses}
          description="Active courses"
          icon={<BookOpen size={24} />}
          color="#10b981"
        />
        <DashboardWidget
          title="Active Quizzes"
          value={stats.totalQuizzes}
          description="Published assessments"
          icon={<FileQuestion size={24} />}
          color="#f59e0b"
        />
        <DashboardWidget
          title="Discussions"
          value={stats.totalDiscussions}
          description="Forum threads"
          icon={<MessageSquare size={24} />}
          color="#ef4444"
        />
      </div>

      {/* Recent Courses */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Recent Courses</h2>
          <Link to="/admin/courses" className="btn btn-outline">
            View All
          </Link>
        </div>
        {courses.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Category</th>
                  <th>Teacher</th>
                  <th>Students</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id}>
                    <td style={{ fontWeight: 600 }}>{course.title}</td>
                    <td>
                      <span className="badge badge-primary">
                        {course.category || 'General'}
                      </span>
                    </td>
                    <td>{course.teacher?.name || 'N/A'}</td>
                    <td>{course.enrolledStudents?.length || 0}</td>
                    <td>
                      <span className={`badge ${course.published ? 'badge-success' : 'badge-warning'}`}>
                        {course.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/courses/${course._id}`}
                          className="btn btn-outline"
                          style={{ padding: '0.5rem' }}
                          title="View"
                        >
                          <Eye size={16} />
                        </Link>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '0.5rem' }}
                          onClick={() => handleDeleteCourse(course._id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
            No courses available
          </p>
        )}
      </div>

      {/* Recent Quizzes and Discussions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Recent Quizzes */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Recent Quizzes</h2>
            <Link to="/admin/quizzes" className="btn btn-outline" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
              View All
            </Link>
          </div>
          {quizzes.length > 0 ? (
            <div>
              {quizzes.map((quiz) => (
                <div key={quiz._id} style={{
                  padding: '1rem',
                  marginBottom: '0.75rem',
                  backgroundColor: 'var(--light-bg)',
                  borderRadius: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Award size={16} color="var(--primary-color)" />
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{quiz.title}</h3>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <span>{quiz.course?.title || 'No course'}</span>
                    <span>{quiz.questions?.length || 0} questions</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem', fontStyle: 'italic' }}>
              No quizzes created yet
            </p>
          )}
        </div>

        {/* Recent Discussions */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Recent Discussions</h2>
          </div>
          {discussions.length > 0 ? (
            <div>
              {discussions.map((discussion) => (
                <div key={discussion._id} style={{
                  padding: '1rem',
                  marginBottom: '0.75rem',
                  backgroundColor: 'var(--light-bg)',
                  borderRadius: '0.5rem'
                }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    {discussion.title}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <span>By {discussion.user?.name || 'Anonymous'}</span>
                    <span className="badge badge-primary">
                      {discussion.replies?.length || 0} replies
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem', fontStyle: 'italic' }}>
              No discussions yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;