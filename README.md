# 📚 Library Management System - Web Application

A full-stack web application with admin panel for managing library operations. Admin can search by ID, manage users, books, and transactions (issue/return books).

## 🎯 Features

### Admin Dashboard
- **🔍 Search by ID**: Admin can search users, books, or transactions by their ID
- **👥 User Management**: View, add, edit, and delete users with full details
- **📚 Book Management**: Manage books with availability tracking
- **📖 Transaction Management**: Issue/return books, track overdue, manage fines
- **📊 Real-time Stats**: Dashboard with counts and recent activity
- **🔐 Role-based Access**: Admin, Librarian, and User roles with JWT authentication

### Key Capabilities
- Search users by ID, username, name, or email
- Search books by ID, title, author, ISBN, or category
- Search transactions by ID, user, or book
- Filter transactions by status (issued, returned, overdue)
- Issue books with automatic due date calculation (14 days default)
- Return books with fine calculation
- View detailed information in modals
- Edit records with validation
- Delete records with confirmation

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express**: REST API server
- **MySQL**: Database (mysql2 driver)
- **JWT**: Token-based authentication
- **bcrypt**: Password hashing
- **Joi**: Input validation

### Frontend
- **React 18**: UI library
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **CSS3**: Responsive styling

## 🗄️ Database Schema (Existing SQL Files)

Your existing SQL files define the database structure:
- `tables_lib_system.sql` - Creates tables for books, users, transactions
- `values_lib_system.sql` - Seeds initial data
- `Procedures_lib_system.sql` - Stored procedures
- `triggers_lib_system.sql` - Automated triggers for data integrity

### Main Tables Expected
- **users**: User accounts with roles (admin/librarian/user)
- **books**: Book inventory with availability tracking
- **transactions**: Issue/return records with dates and fines

## 📁 Project Structure

```
Library_management_system/
├── server/                    # Backend API (Node.js/Express)
│   ├── src/
│   │   ├── config/db.js      # MySQL connection
│   │   ├── middleware/       # Auth & error handling
│   │   ├── routes/           # API endpoints
│   │   └── index.js          # Server entry
│   └── package.json
│
├── client/                    # Frontend (React/Vite)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Dashboard, Users, Books, Transactions
│   │   ├── services/         # API calls (axios)
│   │   └── App.jsx
│   └── package.json
│
├── tables_lib_system.sql      # Your existing DB schema
├── values_lib_system.sql      # Your existing seed data
├── Procedures_lib_system.sql  # Your existing procedures
├── triggers_lib_system.sql    # Your existing triggers
└── README.md
```

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** v16+ → [Download](https://nodejs.org/)
- **MySQL** v8.0+ → [Download](https://dev.mysql.com/downloads/)

### Step 1: Database Setup

**Create database and import your SQL files:**

```powershell
# In MySQL or command line
mysql -u root -p

# Create database
CREATE DATABASE library;
USE library;

# Import your existing SQL files
source tables_lib_system.sql;
source values_lib_system.sql;
source Procedures_lib_system.sql;
source triggers_lib_system.sql;
```

Or using PowerShell:

```powershell
cd "D:\2 year\DBMS\Database_lib_system\Library_management_system"
mysql -u root -p library < tables_lib_system.sql
mysql -u root -p library < values_lib_system.sql
mysql -u root -p library < Procedures_lib_system.sql
mysql -u root -p library < triggers_lib_system.sql
```

### Step 2: Backend Setup

```powershell
# Navigate to server folder
cd server

# Install dependencies
npm install

# Create environment file
Copy-Item .env.example .env

# Edit .env with your MySQL credentials
notepad .env
```

**Configure `.env`:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=library
PORT=3000
JWT_SECRET=your_random_secret_key_here
```

**Start backend:**
```powershell
npm run dev    # Development with auto-reload
# OR
npm start      # Production
```

Backend runs on: **http://localhost:3000**

### Step 3: Frontend Setup

**Open new terminal** (keep backend running):

```powershell
# Navigate to client folder
cd client

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs on: **http://localhost:5173**

### Step 4: Create Admin User

**Using PowerShell (with backend running):**

```powershell
$body = @{
    username = "admin"
    password = "admin123"
    full_name = "System Administrator"
    email = "admin@library.com"
    role = "admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3000/api/auth/register -Method POST -Body $body -ContentType "application/json"
```

### Step 5: Login

1. Open **http://localhost:5173**
2. Login with:
   - **Username**: `admin`
   - **Password**: `admin123`

## 📖 Usage Guide

### 🔍 Search User by ID (Main Feature)
1. Go to **Users** page
2. Enter user ID in search bar
3. Click **Search**
4. View complete user information
5. Click **View** for detailed modal
6. **Edit** or **Delete** as needed

### 👥 User Management
- **View All**: Navigate to Users from sidebar
- **Add User**: Click "+ Add New User"
- **Search**: By ID, username, name, or email
- **Edit**: Click Edit button on any row
- **View Details**: Click View for full info modal
- **Delete**: Click Delete (requires confirmation)

### 📚 Book Management
- **View All Books**: Navigate to Books page
- **Search**: By ID, title, author, ISBN, category
- **Add Book**: Click "+ Add New Book"
- **Check Availability**: See available copies count
- **Edit/Delete**: Use action buttons

### 📖 Transaction Management
- **Issue Book**:
  1. Click "📖 Issue Book"
  2. Enter User ID (search users first to find ID)
  3. Enter Book ID (search books first)
  4. Set due date (default: 14 days)
  5. Submit

- **Return Book**:
  1. Find issued transaction
  2. Click "Return"
  3. Enter fine if overdue
  4. Confirm return

- **Track Overdue**: Red badge shows overdue books
- **Filter by Status**: Use dropdown (All/Issued/Returned)

### 📊 Dashboard
- View total books, users, active issues
- See recent transactions
- Quick overview of system status

## 🔌 API Endpoints