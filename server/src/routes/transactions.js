const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get dashboard stats
router.get('/stats', async (req, res, next) => {
  try {
    const [totalCount] = await db.query('SELECT COUNT(*) as total FROM Issue_Return');
    const [activeCount] = await db.query('SELECT COUNT(*) as total FROM Issue_Return WHERE Return_Date IS NULL');
    res.json({ 
      total: totalCount[0].total,
      active: activeCount[0].total 
    });
  } catch (error) {
    next(error);
  }
});

// Get all transactions (with search and filters)
router.get('/', async (req, res, next) => {
  try {
    const q = req.query.q || '';
    const status = req.query.status; // 'issued', 'returned', 'overdue'
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const offset = parseInt(req.query.offset) || 0;

    let query = `
      SELECT 
        ir.Issue_Id as id, 
        ir.Issue_Date as issue_date, 
        ir.Due_Date as due_date, 
        ir.Return_Date as return_date,
        ir.Book_Id as book_id,
        ir.Member_Id as user_id,
        ir.Employee_Id as employee_id,
        m.Member_Name as user_name,
        b.Title as book_title,
        b.ISBN as book_isbn,
        CASE 
          WHEN ir.Return_Date IS NOT NULL THEN 'returned'
          WHEN ir.Due_Date < CURDATE() AND ir.Return_Date IS NULL THEN 'overdue'
          ELSE 'issued'
        END as status
      FROM Issue_Return ir
      LEFT JOIN Member m ON ir.Member_Id = m.Member_Id
      LEFT JOIN Books b ON ir.Book_Id = b.Book_Id
      WHERE 1=1
    `;
    const params = [];

    if (q) {
      query += ` AND (ir.Issue_Id = ? OR m.Member_Name LIKE ? OR b.Title LIKE ?)`;
      params.push(q, `%${q}%`, `%${q}%`);
    }

    if (status) {
      if (status === 'issued') {
        query += ` AND ir.Return_Date IS NULL AND ir.Due_Date >= CURDATE()`;
      } else if (status === 'returned') {
        query += ` AND ir.Return_Date IS NOT NULL`;
      } else if (status === 'overdue') {
        query += ` AND ir.Return_Date IS NULL AND ir.Due_Date < CURDATE()`;
      }
    }

    query += ` ORDER BY ir.Issue_Date DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await db.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM Issue_Return ir 
      LEFT JOIN Member m ON ir.Member_Id = m.Member_Id 
      LEFT JOIN Books b ON ir.Book_Id = b.Book_Id WHERE 1=1`;
    const countParams = [];
    if (q) {
      countQuery += ` AND (ir.Issue_Id = ? OR m.Member_Name LIKE ? OR b.Title LIKE ?)`;
      countParams.push(q, `%${q}%`, `%${q}%`);
    }
    if (status) {
      if (status === 'issued') {
        countQuery += ` AND ir.Return_Date IS NULL AND ir.Due_Date >= CURDATE()`;
      } else if (status === 'returned') {
        countQuery += ` AND ir.Return_Date IS NOT NULL`;
      } else if (status === 'overdue') {
        countQuery += ` AND ir.Return_Date IS NULL AND ir.Due_Date < CURDATE()`;
      }
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

// Get transaction by ID
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        ir.Issue_Id as id, 
        ir.Issue_Date as issue_date, 
        ir.Due_Date as due_date, 
        ir.Return_Date as return_date,
        ir.Book_Id as book_id,
        ir.Member_Id as user_id,
        ir.Employee_Id as employee_id,
        m.Member_Name as user_name,
        b.Title as book_title,
        b.ISBN as book_isbn,
        CASE 
          WHEN ir.Return_Date IS NOT NULL THEN 'returned'
          WHEN ir.Due_Date < CURDATE() AND ir.Return_Date IS NULL THEN 'overdue'
          ELSE 'issued'
        END as status
       FROM Issue_Return ir
       LEFT JOIN Member m ON ir.Member_Id = m.Member_Id
       LEFT JOIN Books b ON ir.Book_Id = b.Book_Id
       WHERE ir.Issue_Id = ?`,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

// Issue a book (create transaction)
router.post('/issue', async (req, res, next) => {
  try {
    const { user_id, book_id, due_date, employee_id = 1 } = req.body;

    if (!user_id || !book_id) {
      return res.status(400).json({ error: 'Member ID and Book ID are required' });
    }

    // Check if book is available
    const [bookRows] = await db.query('SELECT Availability_Status FROM Books WHERE Book_Id = ?', [book_id]);
    if (!bookRows.length) {
      return res.status(404).json({ error: 'Book not found' });
    }
    if (bookRows[0].Availability_Status !== 'Available') {
      return res.status(400).json({ error: 'Book not available' });
    }

    // Calculate due date (default 14 days from now)
    const dueDate = due_date || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Create transaction
    const [result] = await db.query(
      `INSERT INTO Issue_Return (Book_Id, Member_Id, Employee_Id, Issue_Date, Due_Date) 
       VALUES (?, ?, ?, CURDATE(), ?)`,
      [book_id, user_id, employee_id, dueDate]
    );

    // Update book availability
    await db.query(
      'UPDATE Books SET Availability_Status = ? WHERE Book_Id = ?',
      ['Issued', book_id]
    );

    res.status(201).json({
      message: 'Book issued successfully',
      transactionId: result.insertId
    });
  } catch (error) {
    next(error);
  }
});

// Return a book
router.post('/return/:id', async (req, res, next) => {
  try {
    const transactionId = req.params.id;
    const { fine } = req.body;

    // Get transaction details
    const [transactionRows] = await db.query(
      'SELECT * FROM Issue_Return WHERE Issue_Id = ? AND Return_Date IS NULL',
      [transactionId]
    );

    if (!transactionRows.length) {
      return res.status(404).json({ error: 'Transaction not found or already returned' });
    }

    const transaction = transactionRows[0];

    // Update transaction
    await db.query(
      `UPDATE Issue_Return SET Return_Date = CURDATE() WHERE Issue_Id = ?`,
      [transactionId]
    );

    // Update book availability
    await db.query(
      'UPDATE Books SET Availability_Status = ? WHERE Book_Id = ?',
      ['Available', transaction.Book_Id]
    );

    res.json({ message: 'Book returned successfully' });
  } catch (error) {
    next(error);
  }
});

// Delete transaction (admin only, for corrections)
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM Issue_Return WHERE Issue_Id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
