show databases;

#create the database
CREATE DATABASE library_management_system;

use library_management_system;

-- Creates the Author table
CREATE TABLE Author (
    Author_Id INT AUTO_INCREMENT PRIMARY KEY,
    Author_Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE
);

-- Creates the Publisher table
CREATE TABLE Publisher (
    Publisher_Id INT AUTO_INCREMENT PRIMARY KEY,
    Publisher_Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE
);

-- Creates the Books table
-- This table links to Author and Publisher
CREATE TABLE Books (
    Book_Id INT AUTO_INCREMENT PRIMARY KEY,
    ISBN VARCHAR(13) NOT NULL UNIQUE,
    Title VARCHAR(255) NOT NULL,
    Availability_Status VARCHAR(50) DEFAULT 'Available',
    
    -- Foreign Keys
    Author_Id INT,
    Publisher_Id INT,
    FOREIGN KEY (Author_Id) REFERENCES Author(Author_Id),
    FOREIGN KEY (Publisher_Id) REFERENCES Publisher(Publisher_Id)
);

-- Creates the Member table (for students, teachers)
CREATE TABLE Member (
    Member_Id INT AUTO_INCREMENT PRIMARY KEY,
    Member_Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE
);

-- Creates the Employee table (Librarian)
-- This table is based on your ERD 
CREATE TABLE Employee (
    Employee_Id INT AUTO_INCREMENT PRIMARY KEY,
    Employee_Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE
);

-- Creates the Issue_Return table
-- This is a 'transaction' table that links a Member, a Book, and an Employee
CREATE TABLE Issue_Return (
    Issue_Id INT AUTO_INCREMENT PRIMARY KEY,
    Issue_Date DATE NOT NULL,
    Due_Date DATE NOT NULL,
    Return_Date DATE DEFAULT NULL, -- NULL means it's not yet returned
    
    -- Foreign Keys
    Book_Id INT,
    Member_Id INT,
    Employee_Id INT, -- The employee who processed the issue
    FOREIGN KEY (Book_Id) REFERENCES Books(Book_Id),
    FOREIGN KEY (Member_Id) REFERENCES Member(Member_Id),
    FOREIGN KEY (Employee_Id) REFERENCES Employee(Employee_Id)
);

-- Creates the Fine table
-- This table links directly to the specific Issue_Return transaction
CREATE TABLE Fine (
    Fine_Id INT AUTO_INCREMENT PRIMARY KEY,
    Amount DECIMAL(10, 2) NOT NULL,
    Date_Imposed DATE NOT NULL,
    Paid_Status VARCHAR(50) DEFAULT 'Unpaid',
    
    -- Foreign Key
    Issue_Id INT,
    FOREIGN KEY (Issue_Id) REFERENCES Issue_Return(Issue_Id)
);









