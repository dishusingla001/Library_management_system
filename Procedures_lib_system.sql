#Procedures

-- Add a New Book --
DELIMITER $$
CREATE PROCEDURE AddBook(
    IN p_ISBN VARCHAR(13),
    IN p_Title VARCHAR(255),
    IN p_Availability VARCHAR(50),
    IN p_Author_Id INT,
    IN p_Publisher_Id INT
)
BEGIN
    INSERT INTO Books (ISBN, Title, Availability_Status , Author_Id, Publisher_Id)
    VALUES (p_ISBN, p_Title,p_Availability, p_Author_Id, p_Publisher_Id);
END$$
DELIMITER ;

SELECT * FROM BOOKS;
DESC BOOKS;
CALL AddBook('9781234567890', 'The Secret Garden','Available', 1, 2);

-- Add a New Member --
DELIMITER $$
CREATE PROCEDURE AddMember(
    IN p_Name VARCHAR(255),
    IN p_Email VARCHAR(255)
)
BEGIN
    INSERT INTO Member (Member_Name, Email)
    VALUES (p_Name, p_Email);
END$$
DELIMITER ;

SELECT * FROM MEMBER;
CALL AddMember('Ravi Sharma', 'ravi.sharma@example.com');

-- Issue a Book --
DELIMITER $$
CREATE PROCEDURE IssueBook(
    IN p_Book_Id INT,
    IN p_Member_Id INT,
    IN p_Employee_Id INT,
    IN p_Due_Date DATE
)
BEGIN
    INSERT INTO Issue_Return (Book_Id, Member_Id, Employee_Id, Issue_Date, Due_Date)
    VALUES (p_Book_Id, p_Member_Id, p_Employee_Id, CURDATE(), p_Due_Date);

    UPDATE Books
    SET Availability_Status = 'Issued'
    WHERE Book_Id = p_Book_Id;
END$$
DELIMITER ;

SELECT * FROM ISSUE_RETURN;
SELECT * FROM BOOKS;
CALL IssueBook(11, 3, 1, '2025-11-10');

-- Return a Book -- 
DELIMITER $$
CREATE PROCEDURE ReturnBook(
    IN p_Issue_Id INT,
    IN p_Return_Date DATE
)
BEGIN
    UPDATE Issue_Return
    SET Return_Date = p_Return_Date
    WHERE Issue_Id = p_Issue_Id;

    UPDATE Books
    SET Availability_Status = 'Available'
    WHERE Book_Id = (SELECT Book_Id FROM Issue_Return WHERE Issue_Id = p_Issue_Id);

    -- If late, insert fine
    IF (SELECT DATEDIFF(p_Return_Date, Due_Date) FROM Issue_Return WHERE Issue_Id = p_Issue_Id) > 0 THEN
        INSERT INTO Fine (Issue_Id, Amount, Date_Imposed)
        VALUES (p_Issue_Id, 
                (SELECT DATEDIFF(p_Return_Date, Due_Date) FROM Issue_Return WHERE Issue_Id = p_Issue_Id),
                p_Return_Date);
    END IF;
END$$
DELIMITER ;

SELECT * FROM Issue_Return;
SELECT * FROM BOOKS;
CALL ReturnBook(28, '2025-11-12');

-- Show All Available Books --
DELIMITER $$
CREATE PROCEDURE ShowAvailableBooks()
BEGIN
    SELECT Book_Id, Title, ISBN
    FROM Books
    WHERE Availability_Status = 'Available';
END$$
DELIMITER ;

CALL ShowAvailableBooks();

-- Show All Borrowed Books --

DELIMITER $$
CREATE PROCEDURE ShowBorrowedBooks()
BEGIN
    SELECT b.Title, m.Member_Name, ir.Issue_Date, ir.Due_Date
    FROM Issue_Return ir
    JOIN Books b ON ir.Book_Id = b.Book_Id
    JOIN Member m ON ir.Member_Id = m.Member_Id
    WHERE ir.Return_Date IS NULL;
END$$
DELIMITER ;

SELECT * FROM BOOKS;
SELECT * FROM ISSUE_RETURN;
SELECT * FROM MEMBER;

CALL ShowBorrowedBooks();

-- Show All Fines for a Member --
DELIMITER $$
CREATE PROCEDURE ShowMemberFines(
    IN p_Member_Id INT
)
BEGIN
    SELECT f.Fine_Id, f.Amount, f.Paid_Status, f.Date_Imposed
    FROM Fine f
    JOIN Issue_Return ir ON f.Issue_Id = ir.Issue_Id
    WHERE ir.Member_Id = p_Member_Id;
END$$
DELIMITER ;

SELECT * FROM FINE;
SELECT * FROM ISSUE_RETURN;
SELECT * FROM MEMBER;

CALL ShowMemberFines(3);

-- Pay Fine --
DELIMITER $$
CREATE PROCEDURE PayFine(
    IN p_Fine_Id INT
)
BEGIN
    UPDATE Fine
    SET Paid_Status = 'Paid'
    WHERE Fine_Id = p_Fine_Id;
END$$
DELIMITER ;

SELECT * FROM ISSUE_RETURN;
SELECT * FROM FINE;
CALL PayFine(2);

-- Get Member Borrow History --
DELIMITER $$
CREATE PROCEDURE GetMemberBorrowHistory(
    IN p_Member_Id INT
)
BEGIN
    SELECT m.Member_Name, b.Title, ir.Issue_Date, ir.Return_Date
    FROM Issue_Return ir
    JOIN Books b ON ir.Book_Id = b.Book_Id
    JOIN Member m ON  ir.Member_Id = m.Member_Id
    WHERE ir.Member_Id = p_Member_Id;
END$$
DELIMITER ;

SELECT * FROM ISSUE_RETURN;
SELECT * FROM MEMBER;
CALL GetMemberBorrowHistory(5);

-- Get Top Borrowed Books --

DELIMITER $$
CREATE PROCEDURE TopBorrowedBooks()
BEGIN
    SELECT b.Title, COUNT(ir.Issue_Id) AS Times_Borrowed
    FROM Books b
    JOIN Issue_Return ir ON b.Book_Id = ir.Book_Id
    GROUP BY b.Book_Id
    ORDER BY Times_Borrowed DESC
    LIMIT 5;
END$$
DELIMITER ;

CALL TopBorrowedBooks();


