import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/UserRoleContext';
import { ThumbsUp, MessageCircle, Trash2, Flag } from 'lucide-react';

const DiscussionThread = ({ discussion, onDelete, onComment, onLike }) => {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { isAdmin } = useRole();

  // Simple profanity filter
  const filterProfanity = (text) => {
    const bannedWords = ['bad', 'stupid', 'hate', 'damn']; // Add more as needed
    let filtered = text;
    bannedWords.forEach((word) => {
      const regex = new RegExp(word, 'gi');
      filtered = filtered.replace(regex, '****');
    });
    return filtered;
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setSubmitting(true);
      const filteredComment = filterProfanity(comment);
      await onComment(discussion._id, filteredComment);
      setComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="discussion-card">
      <div className="discussion-header">
        <div className="discussion-author">
          <div className="author-avatar">{getInitials(discussion.user?.name || 'U')}</div>
          <div className="author-info">
            <div className="author-name">{discussion.user?.name || 'Unknown User'}</div>
            <div className="discussion-time">{formatDate(discussion.createdAt)}</div>
          </div>
        </div>
        {isAdmin && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="action-btn" title="Flag">
              <Flag size={16} />
            </button>
            <button
              className="action-btn"
              onClick={() => onDelete(discussion._id)}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <h3 className="discussion-title">{discussion.title}</h3>
      <p className="discussion-content">{discussion.body}</p>

      <div className="discussion-actions">
        <button className="action-btn" onClick={() => onLike(discussion._id)}>
          <ThumbsUp size={16} />
          <span>0</span> {/* Likes not implemented yet */}
        </button>
        <button
          className="action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle size={16} />
          <span>{discussion.replies?.length || 0} Comments</span>
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          {discussion.replies?.map((reply, index) => (
            <div key={index} className="comment">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <strong>{reply.user?.name || 'Anonymous'}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {formatDate(reply.createdAt)}
                  </span>
                </div>
                <button className="action-btn" style={{ padding: '0.25rem' }}>
                  <ThumbsUp size={14} />
                  <span>0</span>
                </button>
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>{reply.body}</p>
            </div>
          ))}

          <form onSubmit={handleCommentSubmit} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <textarea
                className="form-input"
                rows="3"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={submitting}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DiscussionThread;
