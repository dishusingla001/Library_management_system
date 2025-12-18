const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get dashboard stats
router.get('/stats', async (req, res, next) => {
  try {
    const [memberCount] = await db.query('SELECT COUNT(*) as total FROM Member');
    res.json({ total: memberCount[0].total });
  } catch (error) {
    next(error);
  }
});

// Get all users (with search and pagination)
router.get('/', async (req, res, next) => {
  try {
    const q = req.query.q || '';
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const offset = parseInt(req.query.offset) || 0;

    let query = `
      SELECT Member_Id as id, Member_Name as full_name, Email as email, 
             Member_Name as username, 'user' as role, '' as phone, '' as address, 
             NOW() as created_at
      FROM Member 
      WHERE 1=1
    `;
    const params = [];

    if (q) {
      query += ` AND (Member_Name LIKE ? OR Email LIKE ? OR Member_Id = ?)`;
      params.push(`%${q}%`, `%${q}%`, q);
    }

    query += ` ORDER BY Member_Id DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM Member WHERE 1=1';
    const countParams = [];
    if (q) {
      countQuery += ` AND (Member_Name LIKE ? OR Email LIKE ? OR Member_Id = ?)`;
      countParams.push(`%${q}%`, `%${q}%`, q);
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

// Get user by ID
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT Member_Id as id, Member_Name as full_name, Member_Name as username, 
              Email as email, 'user' as role, '' as phone, '' as address, NOW() as created_at 
       FROM Member WHERE Member_Id = ?`,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

// Create new user
router.post('/', async (req, res, next) => {
  try {
    const { full_name, email } = req.body;

    if (!full_name) {
      return res.status(400).json({ error: 'Member name is required' });
    }

    const [result] = await db.query(
      `INSERT INTO Member (Member_Name, Email) VALUES (?, ?)`,
      [full_name, email || null]
    );

    res.status(201).json({
      message: 'User created successfully',
      userId: result.insertId
    });
  } catch (error) {
    next(error);
  }
});

// Update user
router.put('/:id', async (req, res, next) => {
  try {
    const { full_name, email } = req.body;
    const updates = [];
    const params = [];

    if (full_name) {
      updates.push('Member_Name = ?');
      params.push(full_name);
    }
    if (email !== undefined) {
      updates.push('Email = ?');
      params.push(email);
    }

    if (!updates.length) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(req.params.id);
    const [result] = await db.query(
      `UPDATE Member SET ${updates.join(', ')} WHERE Member_Id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Delete user
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM Member WHERE Member_Id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
