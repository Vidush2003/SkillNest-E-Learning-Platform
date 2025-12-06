import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { MessageCircle, Users, BookOpen, Send, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { discussionAPI, courseAPI } from '../utils/api';

const Discussion = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id: paramCourseId } = useParams(); // for /discussion/:id route
  const [searchParams] = useSearchParams();
  const [discussions, setDiscussions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Check both ?course= and /discussion/:id
        const courseId = searchParams.get('course') || paramCourseId;
        console.log('Discussion component - courseId from URL:', courseId);

        if (!courseId) {
          console.log('No courseId found, redirecting to courses');
          navigate('/courses');
          return;
        }

        setSelectedCourse(courseId);

        // Fetch course details
        const courseResponse = await courseAPI.getById(courseId);
        const courseData = courseResponse.data;

        // Fetch discussions for this course
        try {
          const discussionsResponse = await discussionAPI.getByCourse(courseId);
          setDiscussions(discussionsResponse.data || []);
        } catch (err) {
          console.error('Error fetching discussions:', err);
          setDiscussions([]);
        }

        // Sample messages for demo
        setMessages([
          {
            id: 1,
            user: 'Teacher',
            message: `Welcome to the ${courseData.title} discussion room! Feel free to ask questions and share your thoughts.`,
            timestamp: new Date().toLocaleTimeString(),
            likes: 5
          },
          {
            id: 2,
            user: 'Student',
            message: 'Hi everyone! Excited to learn about this topic.',
            timestamp: new Date().toLocaleTimeString(),
            likes: 2
          }
        ]);

        // Fetch all courses for sidebar navigation
        const coursesResponse = await courseAPI.getAll();
        setCourses(coursesResponse.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, paramCourseId, navigate]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      user: user?.name || 'Anonymous',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString(),
      likes: 0
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage('');
  };

  const handleLike = (messageId) => {
    setMessages((msgs) =>
      msgs.map((msg) =>
        msg.id === messageId ? { ...msg, likes: msg.likes + 1 } : msg
      )
    );
  };

  const selectedCourseData = courses.find((c) => c._id === selectedCourse);

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>Please Login</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            You need to be logged in to access discussions.
          </p>
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
            Loading discussion room...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
          color: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}
      >
        <MessageCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.9 }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Discussion Room</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
          {selectedCourseData?.title || 'Course Discussion'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        {/* Chat Area */}
        <div>
          {/* Messages */}
          <div
            style={{
              backgroundColor: 'var(--light-bg)',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '2rem',
              maxHeight: '500px',
              overflowY: 'auto'
            }}
          >
            <h3
              style={{
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <MessageCircle size={20} />
              Messages ({messages.length})
            </h3>

            {messages.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      backgroundColor: 'white',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border-color)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                      }}
                    >
                      <strong style={{ color: 'var(--primary-color)' }}>{msg.user}</strong>
                      <small style={{ color: 'var(--text-secondary)' }}>{msg.timestamp}</small>
                    </div>
                    <p style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>
                      {msg.message}
                    </p>
                    <button
                      onClick={() => handleLike(msg.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      <Heart size={14} />
                      {msg.likes}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p
                style={{
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                  padding: '2rem'
                }}
              >
                No messages yet. Be the first to start the conversation!
              </p>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '1px solid var(--border-color)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h4 style={{ marginBottom: '1rem' }}>Send a Message</h4>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Send size={16} />
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Course Info */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3
              style={{
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <BookOpen size={20} />
              Course Info
            </h3>
            {selectedCourseData && (
              <div>
                <h4 style={{ marginBottom: '0.5rem' }}>{selectedCourseData.title}</h4>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    marginBottom: '1rem'
                  }}
                >
                  {selectedCourseData.description}
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <Users size={16} />
                  {selectedCourseData.enrolledStudents?.length || 0} students enrolled
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => navigate(`/course/${selectedCourse}`)}
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                <BookOpen size={16} style={{ marginRight: '0.5rem' }} />
                Back to Course
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                <BookOpen size={16} style={{ marginRight: '0.5rem' }} />
                All Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discussion;
