import React, { useState, useEffect } from 'react';
import { bookService } from '../services';

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    publication_year: '',
    category: '',
    copies_total: 1,
    copies_available: 1
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const response = await bookService.getAll({ q: query, limit: 50 });
      setBooks(response.data.data);
      if (query && response.data.data.length === 0) {
        setError(`No book found matching "${query}"`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadBooks(searchQuery);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (mode, book = null) => {
    setModalMode(mode);
    setSelectedBook(book);
    if (book) {
      setFormData({
        isbn: book.isbn || '',
        title: book.title || '',
        author: book.author || '',
        publisher: book.publisher || '',
        publication_year: book.publication_year || '',
        category: book.category || '',
        copies_total: book.copies_total || 1,
        copies_available: book.copies_available || 1
      });
    } else {
      setFormData({
        isbn: '',
        title: '',
        author: '',
        publisher: '',
        publication_year: '',
        category: '',
        copies_total: 1,
        copies_available: 1
      });
    }
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBook(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (modalMode === 'create') {
        await bookService.create(formData);
        setSuccess('Book created successfully!');
      } else if (modalMode === 'edit') {
        await bookService.update(selectedBook.id, formData);
        setSuccess('Book updated successfully!');
      }
      loadBooks(searchQuery);
      setTimeout(() => {
        closeModal();
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await bookService.delete(bookId);
      setSuccess('Book deleted successfully!');
      loadBooks(searchQuery);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete book');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Books Management</h1>
        <button className="btn btn-primary" onClick={() => openModal('create')}>
          + Add New Book
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title, author, ISBN, category, or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
        <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); loadBooks(''); }}>
          Clear
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading">Loading books</div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <h3>No books found</h3>
            <p>Add books or try a different search</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>ISBN</th>
                <th>Title</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>Year</th>
                <th>Category</th>
                <th>Copies</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.isbn || 'N/A'}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publisher || 'N/A'}</td>
                  <td>{book.publication_year || 'N/A'}</td>
                  <td>{book.category || 'N/A'}</td>
                  <td>{book.copies_total}</td>
                  <td>
                    <span className={`badge ${book.copies_available > 0 ? 'badge-success' : 'badge-danger'}`}>
                      {book.copies_available}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-secondary" onClick={() => openModal('view', book)}>
                        View
                      </button>
                      <button className="btn btn-primary" onClick={() => openModal('edit', book)}>
                        Edit
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(book.id)}>
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
              {modalMode === 'create' ? 'Add New Book' : 
               modalMode === 'edit' ? 'Edit Book' : 'Book Details'}
            </h2>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {modalMode === 'view' ? (
              <div>
                <div className="form-group">
                  <label>Book ID:</label>
                  <p style={{ padding: '12px', background: '#f8f9fa', borderRadius: '5px' }}>
                    {selectedBook.id}
                  </p>
                </div>
                <div className="form-group">
                  <label>ISBN:</label>
                  <p style={{ padding: '12px', background: '#f8f9fa', borderRadius: '5px' }}>
                    {selectedBook.isbn || 'N/A'}
                  </p>
                </div>
                <div className="form-group">
                  <label>Title:</label>
                  <p style={{ padding: '12px', background: '#f8f9fa', borderRadius: '5px' }}>
                    {selectedBook.title}
                  </p>
                </div>
                <div className="form-group">
                  <label>Author:</label>
                  <p style={{ padding: '12px', background: '#f8f9fa', borderRadius: '5px' }}>
                    {selectedBook.author}
                  </p>
                </div>
                <div className="form-group">
                  <label>Publisher:</label>
                  <p style={{ padding: '12px', background: '#f8f9fa', borderRadius: '5px' }}>
                    {selectedBook.publisher || 'N/A'}
                  </p>
                </div>
                <div className="form-group">
                  <label>Publication Year:</label>
                  <p style={{ padding: '12px', background: '#f8f9fa', borderRadius: '5px' }}>
                    {selectedBook.publication_year || 'N/A'}
                  </p>
                </div>
                <div className="form-group">
                  <label>Category:</label>
                  <p style={{ padding: '12px', background: '#f8f9fa', borderRadius: '5px' }}>
                    {selectedBook.category || 'N/A'}
                  </p>
                </div>
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                  <button className="btn btn-primary" onClick={() => setModalMode('edit')}>
                    Edit Book
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Author *</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Publisher</label>
                  <input
                    type="text"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Publication Year</label>
                  <input
                    type="number"
                    name="publication_year"
                    value={formData.publication_year}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Total Copies *</label>
                  <input
                    type="number"
                    name="copies_total"
                    value={formData.copies_total}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Available Copies *</label>
                  <input
                    type="number"
                    name="copies_available"
                    value={formData.copies_available}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {modalMode === 'create' ? 'Create Book' : 'Update Book'}
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

export default Books;
