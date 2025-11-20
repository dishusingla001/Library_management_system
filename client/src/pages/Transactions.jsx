import React, { useState, useEffect } from 'react';
import { transactionService, userService, bookService } from '../services';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [issueFormData, setIssueFormData] = useState({
    user_id: '',
    book_id: '',
    due_date: ''
  });
  const [returnFormData, setReturnFormData] = useState({
    fine: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadTransactions();
    // Set default due date to 14 days from now
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 14);
    setIssueFormData(prev => ({
      ...prev,
      due_date: defaultDueDate.toISOString().split('T')[0]
    }));
  }, []);

  const loadTransactions = async (query = '', status = '') => {
    setLoading(true);
    setError('');
    try {
      const params = { q: query, limit: 50 };
      if (status) params.status = status;
      const response = await transactionService.getAll(params);
      setTransactions(response.data.data);
      if (query && response.data.data.length === 0) {
        setError(`No transaction found matching "${query}"`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadTransactions(searchQuery, statusFilter);
  };

  const handleIssueInputChange = (e) => {
    const { name, value } = e.target;
    setIssueFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReturnInputChange = (e) => {
    const { name, value } = e.target;
    setReturnFormData(prev => ({ ...prev, [name]: value }));
  };

  const openIssueModal = () => {
    setShowIssueModal(true);
    setError('');
    setSuccess('');
  };

  const openReturnModal = (transaction) => {
    setSelectedTransaction(transaction);
    setReturnFormData({ fine: 0 });
    setShowReturnModal(true);
    setError('');
    setSuccess('');
  };

  const closeModals = () => {
    setShowIssueModal(false);
    setShowReturnModal(false);
    setSelectedTransaction(null);
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await transactionService.issue(issueFormData);
      setSuccess('Book issued successfully!');
      loadTransactions(searchQuery, statusFilter);
      setTimeout(() => {
        closeModals();
        setSuccess('');
        setIssueFormData({
          user_id: '',
          book_id: '',
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to issue book');
    }
  };

  const handleReturnBook = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await transactionService.return(selectedTransaction.id, returnFormData.fine);
      setSuccess('Book returned successfully!');
      loadTransactions(searchQuery, statusFilter);
      setTimeout(() => {
        closeModals();
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to return book');
    }
  };

  const handleDelete = async (transactionId) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;

    try {
      await transactionService.delete(transactionId);
      setSuccess('Transaction deleted successfully!');
      loadTransactions(searchQuery, statusFilter);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete transaction');
    }
  };

  const getStatusBadge = (status, dueDate, returnDate) => {
    if (status === 'returned') return 'badge-success';
    if (status === 'issued' && new Date(dueDate) < new Date() && !returnDate) return 'badge-danger';
    return 'badge-info';
  };

  const getStatusText = (status, dueDate, returnDate) => {
    if (status === 'returned') return 'Returned';
    if (status === 'issued' && new Date(dueDate) < new Date() && !returnDate) return 'Overdue';
    return 'Issued';
  };

  return (
    <div>
      <div className="page-header">
        <h1>Transactions Management</h1>
        <button className="btn btn-success" onClick={openIssueModal}>
          📖 Issue Book
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by transaction ID, user name, or book title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="issued">Issued</option>
          <option value="returned">Returned</option>
        </select>
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
        <button className="btn btn-secondary" onClick={() => { 
          setSearchQuery(''); 
          setStatusFilter(''); 
          loadTransactions('', ''); 
        }}>
          Clear
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading">Loading transactions</div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <h3>No transactions found</h3>
            <p>Issue books to see transactions here</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Book</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Fine</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>
                    <div>
                      <div>{transaction.full_name}</div>
                      <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                        ({transaction.username})
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div>{transaction.book_title}</div>
                      <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                        by {transaction.book_author}
                      </div>
                    </div>
                  </td>
                  <td>{new Date(transaction.issue_date).toLocaleDateString()}</td>
                  <td>{new Date(transaction.due_date).toLocaleDateString()}</td>
                  <td>{transaction.return_date ? new Date(transaction.return_date).toLocaleDateString() : 'Not returned'}</td>
                  <td>${transaction.fine || 0}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(transaction.status, transaction.due_date, transaction.return_date)}`}>
                      {getStatusText(transaction.status, transaction.due_date, transaction.return_date)}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      {transaction.status === 'issued' && (
                        <button 
                          className="btn btn-success" 
                          onClick={() => openReturnModal(transaction)}
                        >
                          Return
                        </button>
                      )}
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleDelete(transaction.id)}
                      >
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

      {/* Issue Book Modal */}
      {showIssueModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Issue Book</h2>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleIssueBook}>
              <div className="form-group">
                <label>User ID *</label>
                <input
                  type="number"
                  name="user_id"
                  value={issueFormData.user_id}
                  onChange={handleIssueInputChange}
                  placeholder="Enter user ID"
                  required
                />
              </div>
              <div className="form-group">
                <label>Book ID *</label>
                <input
                  type="number"
                  name="book_id"
                  value={issueFormData.book_id}
                  onChange={handleIssueInputChange}
                  placeholder="Enter book ID"
                  required
                />
              </div>
              <div className="form-group">
                <label>Due Date *</label>
                <input
                  type="date"
                  name="due_date"
                  value={issueFormData.due_date}
                  onChange={handleIssueInputChange}
                  required
                />
              </div>
              <div className="alert alert-info">
                <strong>Tip:</strong> Search for users and books in their respective pages to get IDs
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModals}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Issue Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Book Modal */}
      {showReturnModal && selectedTransaction && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Return Book</h2>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="alert alert-info">
              <p><strong>Transaction ID:</strong> {selectedTransaction.id}</p>
              <p><strong>User:</strong> {selectedTransaction.full_name}</p>
              <p><strong>Book:</strong> {selectedTransaction.book_title}</p>
              <p><strong>Due Date:</strong> {new Date(selectedTransaction.due_date).toLocaleDateString()}</p>
            </div>

            <form onSubmit={handleReturnBook}>
              <div className="form-group">
                <label>Fine Amount ($)</label>
                <input
                  type="number"
                  name="fine"
                  value={returnFormData.fine}
                  onChange={handleReturnInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModals}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Confirm Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
