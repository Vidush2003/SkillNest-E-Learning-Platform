import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Trash2, 
  Shield, 
  Mail, 
  Calendar,
  Filter,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { userAPI } from '../utils/api'; // Note: Iska update niche step 2 me hai

const AdminUserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // all, student, teacher, admin

  // Fetch Users on Load
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Agar backend me API ready nahi hai to ye fail hoga, 
      // filhal maine assume kiya hai ki userAPI.getAll() exist karta hai.
      const response = await userAPI.getAll(); 
      setUsers(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      // Fallback for demo if API fails (Optional: remove in production)
      // setUsers([
      //   { _id: '1', name: 'Demo Admin', email: 'admin@test.com', role: 'admin', createdAt: '2023-01-01' },
      //   { _id: '2', name: 'Rahul Student', email: 'rahul@test.com', role: 'student', createdAt: '2023-02-15' },
      // ]);
      setError('Failed to load users. Please check API connection.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await userAPI.delete(userId);
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete user');
      }
    }
  };

  // Filter Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'badge-danger'; // Red
      case 'teacher': return 'badge-primary'; // Blue/Purple
      default: return 'badge-success'; // Green for students
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">User Management</h1>
        <p className="page-description">
          Manage platform users, roles, and permissions
        </p>
      </div>

      {/* Controls Section: Search & Filter */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Search Bar */}
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="form-input"
              style={{ paddingLeft: '2.5rem', width: '100%' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Role Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={20} color="var(--text-secondary)" />
            <select 
              className="form-input" 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ width: '150px' }}
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          <div style={{ marginLeft: 'auto', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
            Total Users: {filteredUsers.length}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '0.5rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="card">
        {filteredUsers.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>User Info</th>
                  <th>Role</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                          width: '40px', height: '40px', 
                          borderRadius: '50%', backgroundColor: 'var(--light-bg)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 'bold', color: 'var(--primary-color)'
                        }}>
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{user.name || 'Unknown User'}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Mail size={12} /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getRoleBadgeColor(user.role)}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Shield size={12} />
                        {user.role ? user.role.toUpperCase() : 'STUDENT'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={14} />
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td>
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '0.5rem' }}
                        onClick={() => handleDeleteUser(user._id)}
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>No users found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserManager;