import React, { useState, useEffect } from 'react';
import { userService } from '../services';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const response = await userService.getAll({ q: query, limit: 50 });
      setUsers(response.data.data);
      if (query && response.data.data.length === 0) {
        setError(`No user found with ID or name "${query}"`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers(searchQuery);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || ''
      });
    } else {
      setFormData({
        full_name: '',
        email: ''
      });
    }
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (modalMode === 'create') {
        await userService.create(formData);
        setSuccess('Member created successfully!');
      } else if (modalMode === 'edit') {
        await userService.update(selectedUser.id, formData);
        setSuccess('Member updated successfully!');
      }
      loadUsers(searchQuery);
      setTimeout(() => {
        closeModal();
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;

    try {
      await userService.delete(userId);
      setSuccess('Member deleted successfully!');
      loadUsers(searchQuery);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleGetUserById = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a user ID');
      return;
    }
    loadUsers(searchQuery);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Members Management</h1>
        <button className="btn btn-primary" onClick={() => openModal('create')}>
          + Add New Member
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Member ID, name, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
        <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); loadUsers(''); }}>
          Clear
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading">Loading users</div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <h3>No members found</h3>
            <p>Add members or try a different search</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.full_name}</td>
                  <td>{user.email || 'N/A'}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-secondary" onClick={() => openModal('view', user)}>
                        View
                      </button>
                      <button className="btn btn-primary" onClick={() => openModal('edit', user)}>
                        Edit
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>
              {modalMode === 'create' ? 'Add New Member' : 
               modalMode === 'edit' ? 'Edit Member' : 'Member Details'}
            </h2>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {modalMode === 'view' ? (
              <div>
                <div className="form-group">
                  <label>Member ID:</label>
                  <p style={{ padding: '12px', background: '#f8f9fa', borderRadius: '5px' }}>
                    {selectedUser.id}
                  </p>
                </div>
                <div className="form-group">
                  <label>Name:</label>
                  <p style={{ padding: '12px', background: '#f8f9fa', borderRadius: '5px' }}>
                    {selectedUser.full_name}
                  </p>
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <p style={{ padding: '12px', background: '#f8f9fa', borderRadius: '5px' }}>
                    {selectedUser.email || 'N/A'}
                  </p>
                </div>
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                  <button className="btn btn-primary" onClick={() => setModalMode('edit')}>
                    Edit Member
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Member Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {modalMode === 'create' ? 'Create Member' : 'Update Member'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
