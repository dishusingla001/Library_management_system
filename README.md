# 📚 Library Management System Database

A robust and feature-rich database system designed to manage library operations efficiently. This system handles books, members, loans, and automated fine calculations with enterprise-grade data integrity constraints and triggers.

## 🎯 Features

- **Complete Library Asset Management**
  - 📖 Books and ISBN tracking
  - ✍️ Author management
  - 🏢 Publisher records
  - 📊 Availability status tracking

- **Member Management**
  - 👥 Member profiles
  - 📧 Email tracking
  - 🎓 Support for students and teachers

- **Transaction Handling**
  - 📅 Book issue and return management
  - ⏰ Due date tracking
  - 💰 Automated fine calculation
  - 📋 Transaction history

- **Staff Management**
  - 👤 Employee (Librarian) records
  - 🔑 Transaction attribution

## 🗄️ Database Schema

### Core Tables

#### 📚 Books
```sql
CREATE TABLE Books (
    Book_Id INT AUTO_INCREMENT PRIMARY KEY,
    ISBN VARCHAR(13) NOT NULL UNIQUE,
    Title VARCHAR(255) NOT NULL,
    Availability_Status VARCHAR(50) DEFAULT 'Available',
    Author_Id INT,
    Publisher_Id INT
);
```

#### 👥 Member
```sql
CREATE TABLE Member (
    Member_Id INT AUTO_INCREMENT PRIMARY KEY,
    Member_Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE
);
```

#### 📖 Issue_Return
```sql
CREATE TABLE Issue_Return (
    Issue_Id INT AUTO_INCREMENT PRIMARY KEY,
    Issue_Date DATE NOT NULL,
    Due_Date DATE NOT NULL,
    Return_Date DATE DEFAULT NULL,
    Book_Id INT,
    Member_Id INT,
    Employee_Id INT
);
```

### 🔄 Smart Triggers

The system includes intelligent triggers for automated operations:

#### Insert Operations
- ✅ Validates ISBN format before book insertion
- 🔄 Updates book availability on issue
- 📝 Logs all book transactions
- 🚫 Prevents invalid date entries

#### Update Operations
- 📊 Automatically calculates fines on late returns
- 🔄 Updates book availability status
- 📝 Maintains audit logs
- ✅ Validates return dates

#### Delete Operations
- 🛡️ Prevents deletion of issued books
- 🔒 Protects members with pending returns
- 📝 Logs all deletions for audit

## 🚀 Getting Started

### Prerequisites
- MySQL 5.7+ or MariaDB 10.2+
- MySQL Workbench (recommended) or command-line client

### Installation Steps

1. **Create the Database**
```sql
source tables_lib_system.sql
```

2. **Set Up Triggers**
```sql
source triggers_lib_system.sql
```

3. **Insert Sample Data** (optional)
```sql
source values_lib_system.sql
```

## 📊 Example Queries

### Issue a Book
```sql
INSERT INTO Issue_Return (
    Issue_Date, Due_Date, Book_Id, 
    Member_Id, Employee_Id
) VALUES (
    CURDATE(), 
    DATE_ADD(CURDATE(), INTERVAL 14 DAY),
    1, 1, 1
);
```

### Return a Book
```sql
UPDATE Issue_Return 
SET Return_Date = CURDATE()
WHERE Issue_Id = 1;
```

### Check Overdue Books
```sql
SELECT 
    b.Title,
    m.Member_Name,
    ir.Due_Date,
    DATEDIFF(CURDATE(), ir.Due_Date) as Days_Overdue
FROM Issue_Return ir
JOIN Books b ON ir.Book_Id = b.Book_Id
JOIN Member m ON ir.Member_Id = m.Member_Id
WHERE ir.Return_Date IS NULL 
AND ir.Due_Date < CURDATE();
```

## 🔍 Data Integrity Features

1. **Referential Integrity**
   - All foreign keys are properly constrained
   - Cascading updates/deletes where appropriate

2. **Business Rules**
   - Books cannot be issued if already checked out
   - Members cannot be deleted with pending returns
   - Return dates must be after issue dates

3. **Audit Trail**
   - All major operations are logged
   - Complete transaction history maintained

## 🛡️ Security Considerations

- Email addresses are unique per member/employee
- ISBN numbers are validated
- Transaction dates are checked for logical consistency
- Automated logging of all critical operations

## 📈 Performance Features

- Indexed lookup fields (ISBN, Email)
- Optimized trigger operations
- Efficient date-based queries

## 🤝 Contributing

Feel free to contribute to this project:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Database design best practices from modern library systems
- MySQL documentation and community
- Academic institution requirements and feedback

---
Made with ❤️ for efficient library management