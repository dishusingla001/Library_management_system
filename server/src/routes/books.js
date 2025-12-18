const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get dashboard stats
router.get('/stats', async (req, res, next) => {
  try {
    const [bookCount] = await db.query('SELECT COUNT(*) as total FROM Books');
    res.json({ total: bookCount[0].total });
  } catch (error) {
    next(error);
  }
});

// Get all books (with search and pagination)
router.get('/', async (req, res, next) => {
  try {
    const q = req.query.q || '';
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const offset = parseInt(req.query.offset) || 0;

    let query = `
      SELECT 
        b.Book_Id as id, 
        b.ISBN as isbn, 
        b.Title as title, 
        a.Author_Name as author, 
        p.Publisher_Name as publisher,
        b.Availability_Status as availability_status
      FROM Books b
      LEFT JOIN Author a ON b.Author_Id = a.Author_Id
      LEFT JOIN Publisher p ON b.Publisher_Id = p.Publisher_Id
      WHERE 1=1
    `;
    const params = [];

    if (q) {
      query += ` AND (b.Title LIKE ? OR a.Author_Name LIKE ? OR b.ISBN LIKE ? OR b.Book_Id = ?)`;
      params.push(`%${q}%`, `%${q}%`, `%${q}%`, q);
    }

    query += ` ORDER BY b.Book_Id DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await db.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM Books b 
      LEFT JOIN Author a ON b.Author_Id = a.Author_Id 
      LEFT JOIN Publisher p ON b.Publisher_Id = p.Publisher_Id WHERE 1=1`;
    const countParams = [];
    if (q) {
      countQuery += ` AND (b.Title LIKE ? OR a.Author_Name LIKE ? OR b.ISBN LIKE ? OR b.Book_Id = ?)`;
      countParams.push(`%${q}%`, `%${q}%`, `%${q}%`, q);
    }
    const [countResult] = await db.query(countQuery, countParams);

    res.json({
      data: rows,
      total: countResult[0].total,
      limit,
      offset
    });
  } catch (error) {
    next(error);
  }
});

// Get book by ID
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        b.Book_Id as id, 
        b.ISBN as isbn, 
        b.Title as title, 
        a.Author_Name as author,
        b.Author_Id as author_id,
        p.Publisher_Name as publisher,
        b.Publisher_Id as publisher_id,
        b.Availability_Status as availability_status
      FROM Books b
      LEFT JOIN Author a ON b.Author_Id = a.Author_Id
      LEFT JOIN Publisher p ON b.Publisher_Id = p.Publisher_Id
      WHERE b.Book_Id = ?
    `, [req.params.id]);

    if (!rows.length) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

// Create new book
router.post('/', async (req, res, next) => {
  try {
    const { isbn, title, author, publisher, publication_year, category, copies_total } = req.body;

    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }

    const copies_available = copies_total || 1;

    const [result] = await db.query(
      `INSERT INTO books (isbn, title, author, publisher, publication_year, category, copies_total, copies_available) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [isbn || null, title, author, publisher || null, publication_year || null, 
       category || null, copies_total || 1, copies_available]
    );

    res.status(201).json({
      message: 'Book created successfully',
      bookId: result.insertId
    });
  } catch (error) {
    next(error);
  }
});

// Update book
router.put('/:id', async (req, res, next) => {
  try {
    const { isbn, title, author, publisher, publication_year, category, copies_total, copies_available } = req.body;
    const updates = [];
    const params = [];

    if (isbn !== undefined) {
      updates.push('isbn = ?');
      params.push(isbn);
    }
    if (title) {
      updates.push('title = ?');
      params.push(title);
    }
    if (author) {
      updates.push('author = ?');
      params.push(author);
    }
    if (publisher !== undefined) {
      updates.push('publisher = ?');
      params.push(publisher);
    }
    if (publication_year !== undefined) {
      updates.push('publication_year = ?');
      params.push(publication_year);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      params.push(category);
    }
    if (copies_total !== undefined) {
      updates.push('copies_total = ?');
      params.push(copies_total);
    }
    if (copies_available !== undefined) {
      updates.push('copies_available = ?');
      params.push(copies_available);
    }

    if (!updates.length) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(req.params.id);
    const [result] = await db.query(
      `UPDATE books SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ message: 'Book updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Delete book
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM books WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
