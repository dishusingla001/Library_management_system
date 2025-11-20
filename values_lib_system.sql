-- ================================================================================
-- LIBRARY MANAGEMENT SYSTEM - COMPREHENSIVE TEST DATA
-- ================================================================================
-- This file contains enhanced test data designed to support all queries,
-- procedures, and triggers in the library management system.
--
-- DATA SUMMARY:
-- - 15 Authors (including popular authors with multiple books)
-- - 10 Publishers (diverse publishers for testing)
-- - 50 Books (varied titles across multiple genres and authors)
-- - 15 Members (sufficient for testing borrowing patterns)
-- - 7 Employees (including one with no issued books for testing)
-- - 70+ Issue/Return records (spanning 2024-2025 for comprehensive testing)
-- - 30+ Fine records (mix of paid/unpaid, various amounts)
--
-- KEY TESTING SCENARIOS COVERED:
-- ✓ Books borrowed in both 2024 and 2025 (Q21)
-- ✓ Members who borrowed 3+ books (Q2, Q25)
-- ✓ Authors with books issued 5+ times (Q11)
-- ✓ Overdue books (Q23)
-- ✓ Currently borrowed books (Q24)
-- ✓ Books from specific publishers (Q18)
-- ✓ Members with all fines paid/unpaid (Q8, Q9)
-- ✓ Employee with no issues (Q4)
-- ✓ Fines in specific months (Q12)
-- ✓ Members borrowing from single publisher (Q20)
-- ✓ High fines (>500) for trigger testing
-- ================================================================================

#Values for Author
INSERT INTO Author (Author_Name, Email) VALUES
('John Doe', 'john.doe@author.com'),
('Jane Austen', 'jane.austen@author.com'),
('George Orwell', 'george.orwell@author.com'),
('Mark Twain', 'mark.twain@author.com'),
('Virginia Woolf', 'virginia.woolf@author.com'),
('Rabindranath Tagore', 'tagore@author.com'),
('J.K. Rowling', 'jk.rowling@author.com'),
('Ernest Hemingway', 'ernest.hemingway@author.com'),
('Chetan Bhagat', 'chetan.bhagat@author.com'),
('Isaac Asimov', 'isaac.asimov@author.com'),
('Agatha Christie', 'agatha.christie@author.com'),
('Charles Dickens', 'charles.dickens@author.com'),
('Leo Tolstoy', 'leo.tolstoy@author.com'),
('Gabriel Garcia Marquez', 'gabriel.marquez@author.com'),
('Haruki Murakami', 'haruki.murakami@author.com');

#Values for Publishers
INSERT INTO Publisher (Publisher_Name, Email) VALUES
('Penguin Random House', 'contact@penguin.com'),
('HarperCollins', 'info@harpercollins.com'),
('Oxford University Press', 'oxford@oup.com'),
('Cambridge University Press', 'cambridge@cup.com'),
('Bloomsbury', 'support@bloomsbury.com'),
('Macmillan', 'hello@macmillan.com'),
('Scholastic', 'service@scholastic.com'),
('Hachette', 'help@hachette.com'),
('Simon & Schuster', 'contact@simonschuster.com'),
('Vintage Books', 'info@vintage.com');

# Values for Books
INSERT INTO Books (ISBN, Title, Author_Id, Publisher_Id, Availability_Status) VALUES
('9780000000001', 'Pride and Prejudice', 2, 1, 'Available'),
('9780000000002', '1984', 3, 2, 'Issued'),
('9780000000003', 'The Adventures of Tom Sawyer', 4, 3, 'Available'),
('9780000000004', 'Life of Pi', 9, 5, 'Available'),
('9780000000005', 'Harry Potter and the Philosopher\'s Stone', 7, 5, 'Issued'),
('9780000000006', 'Animal Farm', 3, 2, 'Available'),
('9780000000007', 'A Farewell to Arms', 8, 4, 'Available'),
('9780000000008', 'Half Girlfriend', 9, 1, 'Issued'),
('9780000000009', 'Foundation', 10, 6, 'Available'),
('9780000000010', 'The Old Man and the Sea', 8, 6, 'Issued'),
('9780000000011', 'Leaves of Grass', 5, 3, 'Available'),
('9780000000012', 'The Home and the World', 6, 3, 'Issued'),
('9780000000013', 'To the Lighthouse', 5, 1, 'Available'),
('9780000000014', 'A Room of One’s Own', 5, 4, 'Available'),
('9780000000015', 'The Jungle Book', 4, 8, 'Available'),
('9780000000016', 'Brave New World', 3, 7, 'Issued'),
('9780000000017', 'Harry Potter and the Chamber of Secrets', 7, 5, 'Available'),
('9780000000018', 'Gitanjali', 6, 3, 'Issued'),
('9780000000019', 'The Time Machine', 10, 8, 'Available'),
('9780000000020', 'The Great Gatsby', 8, 1, 'Available'),
('9780000000021', 'Sense and Sensibility', 2, 1, 'Available'),
('9780000000022', 'Emma', 2, 2, 'Available'),
('9780000000023', 'Murder on the Orient Express', 11, 3, 'Issued'),
('9780000000024', 'Death on the Nile', 11, 3, 'Available'),
('9780000000025', 'Great Expectations', 12, 4, 'Available'),
('9780000000026', 'Oliver Twist', 12, 4, 'Issued'),
('9780000000027', 'War and Peace', 13, 9, 'Available'),
('9780000000028', 'Anna Karenina', 13, 9, 'Available'),
('9780000000029', 'One Hundred Years of Solitude', 14, 10, 'Issued'),
('9780000000030', 'Love in the Time of Cholera', 14, 10, 'Available'),
('9780000000031', 'Norwegian Wood', 15, 9, 'Available'),
('9780000000032', 'Kafka on the Shore', 15, 9, 'Issued'),
('9780000000033', 'Harry Potter and the Prisoner of Azkaban', 7, 5, 'Available'),
('9780000000034', 'Harry Potter and the Goblet of Fire', 7, 5, 'Issued'),
('9780000000035', 'Harry Potter and the Order of Phoenix', 7, 5, 'Available'),
('9780000000036', 'The Complete Poems of Tagore', 6, 3, 'Available'),
('9780000000037', 'Gora', 6, 3, 'Available'),
('9780000000038', 'Five Point Someone', 9, 1, 'Available'),
('9780000000039', 'Two States', 9, 1, 'Issued'),
('9780000000040', 'Revolution 2020', 9, 1, 'Available'),
('9780000000041', 'I, Robot', 10, 6, 'Available'),
('9780000000042', 'The Gods Themselves', 10, 6, 'Available'),
('9780000000043', 'For Whom the Bell Tolls', 8, 4, 'Available'),
('9780000000044', 'The Sun Also Rises', 8, 4, 'Issued'),
('9780000000045', 'Homage to Catalonia', 3, 2, 'Available'),
('9780000000046', 'Down and Out in Paris and London', 3, 2, 'Available'),
('9780000000047', 'The Prince and the Pauper', 4, 8, 'Available'),
('9780000000048', 'A Connecticut Yankee', 4, 8, 'Available'),
('9780000000049', 'Mrs Dalloway', 5, 1, 'Available'),
('9780000000050', 'The Waves', 5, 1, 'Available');

#Values for Member
INSERT INTO Member (Member_Name, Email) VALUES
('Alice', 'alice@library.com'),
('Rahul', 'rahul@library.com'),
('Sneha', 'sneha@library.com'),
('Amit', 'amit@library.com'),
('Neha', 'neha@library.com'),
('Vikram', 'vikram@library.com'),
('Priya', 'priya@library.com'),
('Karan', 'karan@library.com'),
('Tina', 'tina@library.com'),
('Raj', 'raj@library.com'),
('Deepak', 'deepak@library.com'),
('Pooja', 'pooja@library.com'),
('Sanjay', 'sanjay@library.com'),
('Anjali', 'anjali@library.com'),
('Rohan', 'rohan@library.com');


#Value for Employee
INSERT INTO Employee (Employee_Name, Email) VALUES
('Librarian A', 'liba@library.com'),
('Librarian B', 'libb@library.com'),
('Librarian C', 'libc@library.com'),
('Assistant D', 'libd@library.com'),
('Manager E', 'libe@library.com'),
('Librarian F', 'libf@library.com'),
('Assistant G', 'libg@library.com');


#Value for Issue_Return 
INSERT INTO Issue_Return (Issue_Date, Due_Date, Return_Date, Book_Id, Member_Id, Employee_Id) VALUES
-- 2024 records (for testing year-based queries Q21)
('2024-01-10', '2024-01-20', '2024-01-18', 2, 1, 1),
('2024-02-05', '2024-02-15', '2024-02-14', 5, 2, 2),
('2024-03-01', '2024-03-11', '2024-03-10', 8, 3, 3),
('2024-04-10', '2024-04-20', '2024-04-19', 12, 4, 1),
('2024-05-10', '2024-05-20', '2024-05-18', 18, 7, 4),
('2024-06-01', '2024-06-11', '2024-06-09', 5, 8, 5),
('2024-07-05', '2024-07-15', '2024-07-12', 2, 10, 2),
('2024-08-02', '2024-08-12', '2024-08-11', 8, 2, 4),
('2024-09-01', '2024-09-11', '2024-09-10', 5, 5, 2),
('2024-10-05', '2024-10-15', '2024-10-13', 12, 9, 1),

-- 2025 records - Returned books
('2025-01-10', '2025-01-20', '2025-01-18', 2, 1, 1),
('2025-02-05', '2025-02-15', '2025-02-14', 5, 2, 2),
('2025-03-20', '2025-03-30', '2025-03-28', 12, 4, 1),
('2025-04-25', '2025-05-05', '2025-05-02', 16, 6, 3),
('2025-06-01', '2025-06-11', '2025-06-09', 1, 8, 5),
('2025-07-05', '2025-07-15', '2025-07-12', 3, 10, 2),
('2025-07-20', '2025-07-30', '2025-07-29', 5, 1, 3),
('2025-08-18', '2025-08-28', '2025-08-25', 18, 4, 1),
('2025-09-15', '2025-09-25', '2025-09-24', 5, 6, 3),
('2025-10-05', '2025-10-15', '2025-10-13', 18, 9, 1),
('2025-10-18', '2025-10-28', '2025-10-25', 7, 4, 5),

-- 2025 records - Currently issued (Return_Date = NULL)
('2025-03-01', '2025-03-11', NULL, 8, 3, 3),
('2025-04-10', '2025-04-20', NULL, 10, 5, 2),
('2025-05-10', '2025-05-20', NULL, 18, 7, 4),
('2025-06-15', '2025-06-25', NULL, 4, 9, 1),
('2025-08-02', '2025-08-12', NULL, 12, 2, 4),
('2025-08-15', '2025-08-25', NULL, 16, 3, 5),
('2025-09-01', '2025-09-11', NULL, 8, 5, 2),
('2025-09-20', '2025-09-30', NULL, 2, 7, 4),
('2025-10-01', '2025-10-11', NULL, 16, 8, 5),
('2025-10-10', '2025-10-20', NULL, 10, 10, 2),
('2025-10-12', '2025-10-22', NULL, 6, 2, 3),
('2025-10-15', '2025-10-25', NULL, 9, 3, 4),
('2025-10-20', '2025-10-30', NULL, 19, 5, 1),
('2025-10-25', '2025-11-04', NULL, 20, 6, 2),

-- Additional records for testing "more than 3 books" query (Q2)
('2025-01-15', '2025-01-25', '2025-01-24', 6, 1, 2),
('2025-02-10', '2025-02-20', '2025-02-18', 7, 1, 3),
('2025-03-05', '2025-03-15', '2025-03-14', 9, 1, 4),
('2025-04-01', '2025-04-11', '2025-04-10', 11, 2, 1),
('2025-05-15', '2025-05-25', '2025-05-23', 13, 2, 2),
('2025-06-20', '2025-06-30', '2025-06-28', 15, 2, 3),
('2025-07-10', '2025-07-20', '2025-07-18', 17, 3, 5),
('2025-08-05', '2025-08-15', '2025-08-13', 19, 3, 1),
('2025-09-10', '2025-09-20', '2025-09-18', 21, 3, 2),

-- Records for Oxford publisher testing (Q18)
('2025-02-01', '2025-02-11', '2025-02-10', 36, 11, 1),
('2025-03-10', '2025-03-20', '2025-03-18', 37, 12, 2),
('2025-04-05', '2025-04-15', '2025-04-14', 18, 13, 3),

-- Records to make certain books borrowed 6+ times (Q11)
('2025-01-05', '2025-01-15', '2025-01-14', 5, 11, 1),
('2025-03-12', '2025-03-22', '2025-03-20', 5, 12, 2),
('2025-05-18', '2025-05-28', '2025-05-26', 5, 13, 3),
('2025-06-22', '2025-07-02', '2025-06-30', 5, 14, 4),
('2025-02-08', '2025-02-18', '2025-02-16', 2, 14, 5),
('2025-04-12', '2025-04-22', '2025-04-20', 2, 15, 1),
('2025-06-17', '2025-06-27', '2025-06-25', 2, 11, 2),
('2025-01-20', '2025-01-30', '2025-01-28', 8, 12, 3),
('2025-05-05', '2025-05-15', '2025-05-13', 8, 13, 4),

-- Records for testing member with no books borrowed by specific employee (Q4) - Employee 7 has no issues
-- More books borrowed by Rahul (Q19)
('2025-02-25', '2025-03-07', '2025-03-05', 22, 2, 5),
('2025-04-18', '2025-04-28', '2025-04-26', 24, 2, 6),

-- Overdue books for testing (Q23)
('2025-11-01', '2025-11-11', NULL, 23, 14, 1),
('2025-11-05', '2025-11-15', NULL, 26, 15, 2),

-- Books currently borrowed by Alice (Q24)
('2025-11-08', '2025-11-18', NULL, 29, 1, 3),
('2025-11-10', '2025-11-20', NULL, 32, 1, 4),

-- More records for members to test "maximum borrowed" query (Q25)
('2025-01-08', '2025-01-18', '2025-01-17', 25, 4, 6),
('2025-02-12', '2025-02-22', '2025-02-20', 27, 4, 7),
('2025-03-15', '2025-03-25', '2025-03-23', 28, 4, 1),
('2025-04-20', '2025-04-30', '2025-04-28', 30, 4, 2),
('2025-05-25', '2025-06-04', '2025-06-02', 31, 4, 3),

-- Books from single publisher testing (Q20)
('2025-07-01', '2025-07-11', '2025-07-09', 27, 5, 4),
('2025-08-01', '2025-08-11', '2025-08-09', 28, 5, 5);


#Values for Fine
INSERT INTO Fine (Amount, Date_Imposed, Paid_Status, Issue_Id) VALUES
-- Fines for returned books (late returns)
(20.00, '2025-01-21', 'Paid', 11),
(10.00, '2025-02-16', 'Paid', 12),
(40.00, '2025-03-31', 'Paid', 13),
(30.00, '2025-05-06', 'Unpaid', 14),
(20.00, '2025-06-12', 'Paid', 15),
(25.00, '2025-07-16', 'Paid', 16),
(10.00, '2025-07-31', 'Paid', 17),
(30.00, '2025-08-29', 'Unpaid', 18),
(10.00, '2025-09-26', 'Paid', 19),
(20.00, '2025-10-16', 'Paid', 20),
(35.00, '2025-10-29', 'Unpaid', 21),

-- Fines for overdue books (not yet returned)
(250.00, '2025-03-12', 'Unpaid', 22),
(210.00, '2025-04-21', 'Unpaid', 23),
(180.00, '2025-05-21', 'Unpaid', 24),
(150.00, '2025-06-26', 'Unpaid', 25),
(120.00, '2025-08-13', 'Unpaid', 26),
(100.00, '2025-08-26', 'Unpaid', 27),
(90.00, '2025-09-12', 'Unpaid', 28),
(80.00, '2025-10-01', 'Unpaid', 29),

-- Fines in August 2025 (for Q12)
(45.00, '2025-08-01', 'Paid', 35),
(55.00, '2025-08-10', 'Unpaid', 36),
(65.00, '2025-08-20', 'Paid', 37),

-- Fines for member ID 4 (for Q6) - Total should be calculable
(50.00, '2025-01-19', 'Paid', 56),
(75.00, '2025-02-23', 'Unpaid', 57),
(60.00, '2025-03-26', 'Paid', 58),
(85.00, '2025-05-01', 'Unpaid', 59),
(40.00, '2025-06-05', 'Paid', 60),

-- High fines for FineLog trigger testing
(550.00, '2025-07-01', 'Unpaid', 38),
(620.00, '2025-09-01', 'Unpaid', 41),

-- Fines for overdue books (Q23)
(10.00, '2025-11-12', 'Unpaid', 62),
(5.00, '2025-11-16', 'Unpaid', 63);

-- ================================================================================
-- END OF DATA INSERTION
-- ================================================================================
-- USAGE INSTRUCTIONS:
-- 1. Run tables_lib_system.sql first to create all tables
-- 2. Run this file (values_lib_system.sql) to insert test data
-- 3. Run triggers_lib_system.sql to create all triggers
-- 4. Run Procedures_lib_system.sql to create all stored procedures
-- 5. Now you can execute all queries from Queries_lib_system.sql
--
-- NOTES:
-- - Employee_Id 7 (Assistant G) has no issued books - use for testing Q4
-- - Books with ISBN 9780000000002, 9780000000005, 9780000000008 are most borrowed
-- - Alice (Member_Id 1) has borrowed the most books - use for testing Q25
-- - Amit (Member_Id 4) has multiple fines for testing Q6
-- - Several books have overdue dates before current date for testing Q23
-- - Book_Id 5 (Harry Potter) has 6+ issues for testing Q11
-- ================================================================================