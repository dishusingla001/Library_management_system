INSERT INTO Author (Author_Name, Email) VALUES
('John Doe', 'john.doe@author.com'),
('Jane Austen', 'jane.austen@author.com'),
('George Orwell', 'george.orwell@author.com'),
('Mark Twain', 'mark.twain@author.com'),
('Author A', 'author.a@author.com'),
('Rabindranath Tagore', 'tagore@author.com'),
('J.K. Rowling', 'jk.rowling@author.com'),
('Ernest Hemingway', 'ernest.hemingway@author.com'),
('Chetan Bhagat', 'chetan.bhagat@author.com'),
('Isaac Asimov', 'isaac.asimov@author.com');

#Values for Publishers
INSERT INTO Publisher (Publisher_Name, Email) VALUES
('Penguin Random House', 'contact@penguin.com'),
('HarperCollins', 'info@harpercollins.com'),
('Oxford University Press', 'oxford@oup.com'),
('Cambridge University Press', 'cambridge@cup.com'),
('Bloomsbury', 'support@bloomsbury.com'),
('Macmillan', 'hello@macmillan.com'),
('Scholastic', 'service@scholastic.com'),
('Hachette', 'help@hachette.com');

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
('9780000000020', 'The Great Gatsby', 8, 1, 'Available');

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
('Raj', 'raj@library.com');


#Value for Employee
INSERT INTO Employee (Employee_Name, Email) VALUES
('Librarian A', 'liba@library.com'),
('Librarian B', 'libb@library.com'),
('Librarian C', 'libc@library.com'),
('Assistant D', 'libd@library.com'),
('Manager E', 'libe@library.com');


#Value for Issue_Return 
INSERT INTO Issue_Return (Issue_Date, Due_Date, Return_Date, Book_Id, Member_Id, Employee_Id) VALUES
('2025-01-10', '2025-01-20', '2025-01-18', 2, 1, 1),
('2025-02-05', '2025-02-15', '2025-02-14', 5, 2, 2),
('2025-03-01', '2025-03-11', NULL, 8, 3, 3),
('2025-03-20', '2025-03-30', '2025-03-28', 12, 4, 1),
('2025-04-10', '2025-04-20', NULL, 10, 5, 2),
('2025-04-25', '2025-05-05', '2025-05-02', 16, 6, 3),
('2025-05-10', '2025-05-20', NULL, 18, 7, 4),
('2025-06-01', '2025-06-11', '2025-06-09', 1, 8, 5),
('2025-06-15', '2025-06-25', NULL, 4, 9, 1),
('2025-07-05', '2025-07-15', '2025-07-12', 3, 10, 2),
('2025-07-20', '2025-07-30', '2025-07-29', 5, 1, 3),
('2025-08-02', '2025-08-12', NULL, 12, 2, 4),
('2025-08-15', '2025-08-25', NULL, 16, 3, 5),
('2025-08-18', '2025-08-28', '2025-08-25', 18, 4, 1),
('2025-09-01', '2025-09-11', NULL, 8, 5, 2),
('2025-09-15', '2025-09-25', '2025-09-24', 5, 6, 3),
('2025-09-20', '2025-09-30', NULL, 2, 7, 4),
('2025-10-01', '2025-10-11', NULL, 16, 8, 5),
('2025-10-05', '2025-10-15', '2025-10-13', 18, 9, 1),
('2025-10-10', '2025-10-20', NULL, 10, 10, 2),
('2025-10-12', '2025-10-22', NULL, 6, 2, 3),
('2025-10-15', '2025-10-25', NULL, 9, 3, 4),
('2025-10-18', '2025-10-28', '2025-10-25', 7, 4, 5),
('2025-10-20', '2025-10-30', NULL, 19, 5, 1),
('2025-10-25', '2025-11-04', NULL, 20, 6, 2);

#Values for Fine
INSERT INTO Fine (Amount, Date_Imposed, Paid_Status, Issue_Id) VALUES
(50.00, '2025-01-21', 'Paid', 1),
(100.00, '2025-03-12', 'Unpaid', 3),
(75.00, '2025-04-25', 'Paid', 4),
(120.00, '2025-05-22', 'Unpaid', 5),
(60.00, '2025-06-12', 'Paid', 6),
(90.00, '2025-08-20', 'Unpaid', 12),
(150.00, '2025-08-28', 'Unpaid', 13),
(30.00, '2025-09-12', 'Paid', 15),
(110.00, '2025-09-30', 'Unpaid', 17),
(40.00, '2025-10-15', 'Paid', 20);