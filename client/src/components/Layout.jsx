import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>📚 Library Admin</h2>
        <nav>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Dashboard
          </Link>
          <Link to="/users" className={location.pathname === '/users' ? 'active' : ''}>
            Users
          </Link>
          <Link to="/books" className={location.pathname === '/books' ? 'active' : ''}>
            Books
          </Link>
          <Link to="/transactions" className={location.pathname === '/transactions' ? 'active' : ''}>
            Transactions
          </Link>
        </nav>
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #34495e' }}>
          <p style={{ fontSize: '14px', color: '#95a5a6' }}>Admin Panel</p>
          <p style={{ fontSize: '14px', fontWeight: 'bold' }}>System Administrator</p>
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;
