import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Users, Clock, AlertCircle } from 'lucide-react';
import { courseAPI, userAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Courses = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch courses and enrollments
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch courses first
        const coursesResponse = await courseAPI.getAll();
        console.log('Courses response:', coursesResponse);
        setCourses(coursesResponse.data || []);
        
        // Try to fetch enrollments, but don't fail if it doesn't work
        try {
          const enrollmentsResponse = await userAPI.getEnrollments();
          console.log('Enrollments response:', enrollmentsResponse);
          setEnrollments(enrollmentsResponse.data || []);
        } catch (enrollErr) {
          console.warn('Could not fetch enrollments:', enrollErr);
          // Set empty enrollments array if the API fails
          setEnrollments([]);
        }
      } catch (err) {
        setError('Failed to load courses. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = levelFilter === 'All' || course.level === levelFilter;

    return matchesSearch && matchesLevel;
  });

  // Check if user is enrolled
  const isEnrolled = (courseId) => {
    if (!user || !user.id) return false;
    // Check if the course exists in the enrollments array
    return enrollments.some((course) => course._id === courseId);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <AlertCircle size={48} style={{ margin: '0 auto 1rem', color: 'var(--error-color)' }} />
          <h3>Error Loading Courses</h3>
          <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Explore Courses</h1>
        <p className="page-description">
          Discover and enroll in courses to enhance your skills
        </p>
      </div>

      {/* Search and Filter */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
          <Search
            size={20}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)'
            }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <select
          className="form-input"
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          style={{ width: '200px' }}
        >
          <option value="All">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Results Count */}
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
      </p>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="content-grid">
          {filteredCourses.map((course) => (
            <div key={course._id} className="course-card">
              <img
                src={course.thumbnail || `https://images.unsplash.com/photo-${course._id}?w=400`}
                alt={course.title}
                className="course-thumbnail"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400';
                }}
              />

              <div className="course-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary">{course.level}</span>
                  {isEnrolled(course._id) && (
                    <span className="badge badge-success">Enrolled</span>
                  )}
                </div>

                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{course.description}</p>

                <div className="course-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Users size={16} />
                    {course.enrolledCount || 0}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={16} />
                    {course.duration}
                  </span>
                </div>

                <div className="course-footer">
                  <div className="course-rating">
                    <Star size={16} fill="currentColor" />
                    <span style={{ fontWeight: 600 }}>{course.rating || 0}</span>
                  </div>

                  <Link
                    to={`/courses/${course._id}`}
                    className={`btn ${isEnrolled(course._id) ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {isEnrolled(course._id) ? 'Continue' : 'View Details'}
                  </Link>
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
                  Instructor: {course.instructor}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Search size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-secondary)' }} />
          <h3>No Courses Found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default Courses;
