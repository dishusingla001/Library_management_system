import React, { useState, useEffect } from 'react';
import { userService, bookService, transactionService } from '../services';

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalTransactions: 0,
    activeIssues: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [usersStats, booksStats, transactionsStats, transactionsData] = await Promise.all([
        userService.getStats(),
        bookService.getStats(),
        transactionService.getStats(),
        transactionService.getAll({ limit: 5 })
      ]);

      setStats({
        totalUsers: usersStats.data.total || 0,
        totalBooks: booksStats.data.total || 0,
        totalTransactions: transactionsStats.data.total || 0,
        activeIssues: transactionsStats.data.active || 0
      });

      setRecentTransactions(transactionsData.data.data || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Set default values on error
      setStats({
        totalUsers: 0,
        totalBooks: 0,
        totalTransactions: 0,
        activeIssues: 0
      });
      setRecentTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="dashboard-cards">
        <div className="card primary">
          <h3>Total Books</h3>
          <div className="number">{stats.totalBooks}</div>
        </div>
        <div className="card">
          <h3>Total Users</h3>
          <div className="number">{stats.totalUsers}</div>
        </div>
        <div className="card">
          <h3>Active Issues</h3>
          <div className="number">{stats.activeIssues}</div>
        </div>
        <div className="card">
          <h3>Total Transactions</h3>
          <div className="number">{stats.totalTransactions}</div>
        </div>
      </div>

      <div className="table-container">
        <h2 style={{ padding: '20px', borderBottom: '1px solid #e9ecef', marginBottom: 0 }}>
          Recent Transactions
        </h2>
        {recentTransactions.length === 0 ? (
          <div className="empty-state">
            <h3>No transactions yet</h3>
            <p>Start issuing books to see transactions here</p>
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
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.full_name || transaction.username}</td>
                  <td>{transaction.book_title}</td>
                  <td>{new Date(transaction.issue_date).toLocaleDateString()}</td>
                  <td>{new Date(transaction.due_date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge badge-${
                      transaction.status === 'returned' ? 'success' : 
                      transaction.status === 'issued' ? 'info' : 'warning'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
