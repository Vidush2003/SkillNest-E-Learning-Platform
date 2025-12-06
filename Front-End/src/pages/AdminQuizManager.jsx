import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, AlertCircle } from 'lucide-react';
import { quizAPI, courseAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AdminQuizManager = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    questions: []
  });
  const [questionForm, setQuestionForm] = useState({
    text: '',
    options: [{ text: '', correct: false }, { text: '', correct: false }, { text: '', correct: false }, { text: '', correct: false }]
  });
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesResponse, quizzesResponse] = await Promise.all([
          courseAPI.getAll(),
          quizAPI.getAll()
        ]);
        
        // Filter courses by teacher if user is a teacher
        let availableCourses = coursesResponse.data;
        if (user.role === 'teacher') {
          availableCourses = coursesResponse.data.filter(course => 
            course.teacher && course.teacher._id === user.id
          );
        }
        
        setCourses(availableCourses);
        setQuizzes(quizzesResponse.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load quizzes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleCreateQuiz = () => {
    setEditingQuiz(null);
    setFormData({
      title: '',
      course: courses[0]?._id || '',
      questions: []
    });
    setShowModal(true);
  };

  const handleEditQuiz = (quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      course: quiz.course?._id || quiz.course,
      questions: quiz.questions || []
    });
    setShowModal(true);
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await quizAPI.delete(quizId);
        setQuizzes(quizzes.filter((q) => q._id !== quizId));
      } catch (err) {
        console.error('Error deleting quiz:', err);
        alert('Failed to delete quiz. Please try again.');
      }
    }
  };

  const handleAddQuestion = () => {
    setQuestionForm({
      text: '',
      options: [{ text: '', correct: false }, { text: '', correct: false }, { text: '', correct: false }, { text: '', correct: false }]
    });
    setShowQuestionModal(true);
  };

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    const newQuestion = {
      text: questionForm.text,
      options: questionForm.options.filter(opt => opt.text.trim() !== '')
    };
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
    setShowQuestionModal(false);
  };

  const handleRemoveQuestion = (index) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const quizData = {
        title: formData.title,
        course: formData.course,
        courseId: formData.course, // Backend expects 'courseId' for creation
        questions: formData.questions
      };

      if (editingQuiz) {
        // Update existing quiz
        const response = await quizAPI.update(editingQuiz._id, quizData);
        setQuizzes(quizzes.map((q) => q._id === editingQuiz._id ? response.data : q));
      } else {
        // Create new quiz
        const response = await quizAPI.create(quizData);
        setQuizzes([...quizzes, response.data]);
      }
      setShowModal(false);
    } catch (err) {
      console.error('Error saving quiz:', err);
      alert(`Failed to save quiz: ${err.response?.data?.message || err.message}`);
    }
  };

  const getCourseTitle = (courseId) => {
    const course = courses.find((c) => c._id === courseId);
    return course ? course.title : 'Unknown Course';
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <AlertCircle size={48} style={{ margin: '0 auto 1rem', color: 'var(--danger-color)' }} />
          <h3>Error Loading Quizzes</h3>
          <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">Quiz Management</h1>
            <p className="page-description">
              Create and manage quizzes and assessments
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleCreateQuiz}>
            <Plus size={20} />
            Add Quiz
          </button>
        </div>
      </div>

      {/* Quizzes Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Course</th>
              <th>Duration</th>
              <th>Questions</th>
              <th>Passing Score</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <tr key={quiz._id}>
                  <td>#{quiz._id.slice(-6)}</td>
                  <td style={{ fontWeight: 600 }}>{quiz.title}</td>
                  <td>{quiz.course?.title || getCourseTitle(quiz.course)}</td>
                  <td>-</td>
                  <td>{quiz.questions?.length || 0}</td>
                  <td>-</td>
                  <td>
                    <span className="badge badge-success">Active</span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn btn-outline"
                        style={{ padding: '0.5rem' }}
                        onClick={() => handleEditQuiz(quiz)}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '0.5rem' }}
                        onClick={() => handleDeleteQuiz(quiz._id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  No quizzes found. Click "Add Quiz" to create your first quiz.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Quiz Form Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Quiz Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter quiz title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Course</label>
                <select
                  className="form-input"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Questions Section */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Questions</label>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleAddQuestion}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                  >
                    <Plus size={16} />
                    Add Question
                  </button>
                </div>
                
                {formData.questions.length > 0 ? (
                  <div style={{ marginTop: '1rem' }}>
                    {formData.questions.map((question, index) => (
                      <div key={index} style={{
                        padding: '1rem',
                        backgroundColor: 'var(--light-bg)',
                        borderRadius: '0.5rem',
                        marginBottom: '0.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                            {index + 1}. {question.text}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {question.options.length} options
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleRemoveQuestion(index)}
                          style={{ padding: '0.5rem' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                    No questions added yet. Click "Add Question" to get started.
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Question Form Modal */}
      {showQuestionModal && (
        <div className="modal-overlay" onClick={() => setShowQuestionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add Question</h2>
              <button className="modal-close" onClick={() => setShowQuestionModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleQuestionSubmit}>
              <div className="form-group">
                <label className="form-label">Question Text</label>
                <textarea
                  className="form-input"
                  rows="3"
                  placeholder="Enter your question"
                  value={questionForm.text}
                  onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Answer Options</label>
                {questionForm.options.map((option, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder={`Option ${index + 1}`}
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...questionForm.options];
                        newOptions[index].text = e.target.value;
                        setQuestionForm({ ...questionForm, options: newOptions });
                      }}
                      required
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
                      <input
                        type="checkbox"
                        checked={option.correct}
                        onChange={(e) => {
                          const newOptions = [...questionForm.options];
                          newOptions[index].correct = e.target.checked;
                          setQuestionForm({ ...questionForm, options: newOptions });
                        }}
                      />
                      <span style={{ fontSize: '0.875rem' }}>Correct</span>
                    </label>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowQuestionModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuizManager;
