import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { courseAPI } from '../utils/api';

const AdminCourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    published: true
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseAPI.getAll();
        setCourses(response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      published: true
    });
    setShowModal(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category || '',
      published: course.published
    });
    setShowModal(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseAPI.delete(courseId);
        setCourses(courses.filter((c) => c._id !== courseId));
      } catch (err) {
        console.error('Error deleting course:', err);
        alert('Failed to delete course. Please try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      if (editingCourse) {
        // Update existing course
        const response = await courseAPI.update(editingCourse._id, formData);
        setCourses(courses.map(course =>
          course._id === editingCourse._id ? response.data : course
        ));
      } else {
        // Create new course
        const response = await courseAPI.create(formData);
        setCourses([...courses, response.data]);
      }

      setShowModal(false);
    } catch (err) {
      console.error('Error saving course:', err);
      alert('Failed to save course. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Module Management (nested within course)
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [moduleData, setModuleData] = useState({
    title: '',
    description: '',
    materials: []
  });

  const handleAddModule = (course) => {
    setSelectedCourse(course);
    setModuleData({ title: '', description: '', materials: [] });
    setShowModuleModal(true);
  };

  const handleModuleSubmit = (e) => {
    e.preventDefault();

    setCourses(
      courses.map((c) =>
        c.id === selectedCourse.id
          ? {
              ...c,
              modules: [
                ...c.modules,
                {
                  id: c.modules.length + 1,
                  ...moduleData
                }
              ]
            }
          : c
      )
    );

    setShowModuleModal(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">Course Management</h1>
            <p className="page-description">
              Create, edit, and manage courses
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleCreateCourse}>
            <Plus size={20} />
            Add Course
          </button>
        </div>
      </div>

      {/* Loading/Error States */}
      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading courses...</p>
        </div>
      )}

      {error && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--error-color)' }}>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
            style={{ marginTop: '1rem' }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Courses Table */}
      {!loading && !error && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Enrollments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td>#{course._id.slice(-6)}</td>
                  <td style={{ fontWeight: 600 }}>{course.title}</td>
                  <td>{course.category || 'General'}</td>
                  <td>
                    <span className={`badge ${course.published ? 'badge-success' : 'badge-secondary'}`}>
                      {course.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{course.enrolledStudents?.length || 0}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn btn-outline"
                        style={{ padding: '0.5rem' }}
                        onClick={() => handleEditCourse(course)}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
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
      )}

      {/* Course Form Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Course Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter course title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows="4"
                  placeholder="Enter course description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Programming, Data Science, Design"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    disabled={submitting}
                  />
                  Publish Course
                </label>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Published courses are visible to all students
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : (editingCourse ? 'Update Course' : 'Create Course')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Module Form Modal */}
      {showModuleModal && (
        <div className="modal-overlay" onClick={() => setShowModuleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add Module to {selectedCourse?.title}</h2>
              <button className="modal-close" onClick={() => setShowModuleModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleModuleSubmit}>
              <div className="form-group">
                <label className="form-label">Module Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter module title"
                  value={moduleData.title}
                  onChange={(e) => setModuleData({ ...moduleData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows="3"
                  placeholder="Enter module description"
                  value={moduleData.description}
                  onChange={(e) => setModuleData({ ...moduleData, description: e.target.value })}
                  required
                />
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Note: Materials (PDFs, videos) can be added after creating the module
              </p>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModuleModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseManager;
