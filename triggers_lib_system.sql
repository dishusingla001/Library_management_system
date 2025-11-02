USE library_management_system;



-- ===== INSERT TRIGGERS =====
-- BEFORE INSERT on Books: ensure ISBN length = 13
DELIMITER $$
CREATE TRIGGER before_insert_books
BEFORE INSERT ON Books
FOR EACH ROW
BEGIN
    IF CHAR_LENGTH(NEW.ISBN) != 13 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ISBN must be 13 characters long';
    END IF;
END$$
DELIMITER ;

INSERT INTO Books (ISBN, Title, Author_Id, Publisher_Id, Availability_Status) VALUES
('978000000','Harry Potter', 3, 6, 'Available');

select * from books;

-- BEFORE INSERT on Issue_Return: ensure Due_Date is not before Issue_Date
DELIMITER $$
CREATE TRIGGER before_insert_issue_return
BEFORE INSERT ON Issue_Return
FOR EACH ROW
BEGIN
    IF NEW.Due_Date < NEW.Issue_Date THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Due_Date cannot be before Issue_Date';
    END IF;
END$$
DELIMITER ;

INSERT INTO Issue_Return (Issue_Date, Due_Date, Return_Date, Book_Id, Member_Id, Employee_Id) VALUES
('2025-01-10', '2025-01-08', '2025-01-18', 3, 2, 2);

-- AFTER INSERT on Issue_Return:

DELIMITER $$
CREATE TRIGGER after_issue_book
AFTER INSERT ON Issue_Return
FOR EACH ROW
BEGIN
    UPDATE Books
    SET Availability_Status = 'Issued'
    WHERE Book_Id = NEW.Book_Id;
END$$
DELIMITER ;

SELECT * FROM BOOKS;
SELECT * FROM ISSUE_RETURN;
INSERT INTO Issue_Return (Issue_Date, Due_Date, Return_Date, Book_Id, Member_Id, Employee_Id) VALUES
('2025-10-31', '2025-11-10',NULL,1, 4, 4);

-- AFTER INSERT on FINE: mark the book as Issued and log

CREATE TABLE FineLog (
    Log_Id INT AUTO_INCREMENT PRIMARY KEY,
    Fine_Id INT,
    Fine_Level VARCHAR(50),  -- 'High Fine' or 'Normal Fine'
    Fine_Amount DECIMAL(10,2),
    Date_Logged TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Fine_Id) REFERENCES Fine(Fine_Id)
);

DELIMITER $$
CREATE TRIGGER after_insert_fine
AFTER INSERT ON Fine
FOR EACH ROW
BEGIN
    IF NEW.Amount > 500 THEN
        INSERT INTO FineLog (Fine_Id, Fine_Level, Fine_Amount)
        VALUES (NEW.Fine_Id, 'High Fine', NEW.Amount);
    ELSE
        INSERT INTO FineLog (Fine_Id, Fine_Level, Fine_Amount)
        VALUES (NEW.Fine_Id, 'Normal Fine', NEW.Amount);
    END IF;
END$$
DELIMITER ;


SELECT * FROM FINE;
SELECT * FROM FineLog;
INSERT INTO Fine (Amount, Date_Imposed, Paid_Status, Issue_Id) VALUES
(510.00, '2025-10-31', 'UnPaid', 1);

-- ===== UPDATE TRIGGERS =====
#BEFORE UPDATE TRIGGER
#--Prevent Updating Publisher to NULL IN THE BOOKS TABLE 

DELIMITER $$
CREATE TRIGGER before_update_books_check_publisher
BEFORE UPDATE ON Books
FOR EACH ROW
BEGIN
    -- Prevent publisher from being set to NULL
    IF NEW.Publisher_Id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Publisher cannot be NULL';
    END IF;
END$$
DELIMITER ;

SELECT * FROM BOOKS;
DESC BOOKS;

UPDATE Books SET Title = 'New Book Title',Publisher_Id=NULL WHERE Book_Id = 3;

-- BEFORE UPDATE on Issue_Return: Stop an update if the Return Date is before the Issue Date.
DELIMITER $$
CREATE TRIGGER before_update_issue_return_check_dates
BEFORE UPDATE ON Issue_Return
FOR EACH ROW
BEGIN
    -- Return date cannot be before issue date
    IF NEW.Return_Date IS NOT NULL AND NEW.Return_Date < NEW.Issue_Date THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Return date cannot be before issue date';
    END IF;
END$$
DELIMITER ;

-- ❌ This will FAIL because Return_Date < Issue_Date
UPDATE Issue_Return SET Return_Date = '2024-01-01' WHERE Issue_Id = 1;
SELECT * FROM ISSUE_RETURN;

-- AFTER UPDATE on Books: log status changes
# When a book’s status changes, record the change in a log table.

CREATE TABLE update_book_log (
    Log_Id INT AUTO_INCREMENT PRIMARY KEY,
    Table_Name VARCHAR(50),
    Action VARCHAR(255),
    Log_Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$
CREATE TRIGGER after_update_books_log
AFTER UPDATE ON Books
FOR EACH ROW
BEGIN
    -- Log only when status changes
    IF OLD.Availability_Status <> NEW.Availability_Status THEN
        INSERT INTO  update_book_log (Table_Name, Action)
        VALUES ('Books', CONCAT('Book status changed from ', OLD.Availability_Status, ' to ', NEW.Availability_Status));
    END IF;
END$$
DELIMITER ;

-- Change availability to trigger log
UPDATE Books SET Availability_Status = 'Issued' WHERE Book_Id = 4;
SELECT * FROM BOOKS;
SELECT * FROM update_book_log;

-- AFTER UPDATE on Issue_Return: When a book is returned, mark it as available.
DELIMITER $$
CREATE TRIGGER after_update_issue_return_available
AFTER UPDATE ON Issue_Return
FOR EACH ROW
BEGIN
    -- If the book was just returned
    IF OLD.Return_Date IS NULL AND NEW.Return_Date IS NOT NULL THEN
        UPDATE Books 
        SET Availability_Status = 'Available'
        WHERE Book_Id = NEW.Book_Id;
    END IF;
END$$
DELIMITER ;

-- Update to set Return_Date (marks the book as returned)
UPDATE Issue_Return SET Return_Date = CURDATE() WHERE Issue_Id = 5;
SELECT * FROM ISSUE_RETURN ;
SELECT * FROM BOOKS;

-- ===== DELETE TRIGGERS =====
-- BEFORE DELETE on Books: Prevent deleting a book if it’s not available.
DELIMITER $$
CREATE TRIGGER before_delete_books
BEFORE DELETE ON Books
FOR EACH ROW
BEGIN
    IF OLD.Availability_Status = 'Issued' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete — Book is currently issued.';
    END IF;
END$$
DELIMITER ;

DELETE FROM Books WHERE Book_Id = 20;
SELECT * FROM books;
--DONE----
-- BEFORE DELETE on Member: Prevent deleting a member if they have unpaid fines.
DELIMITER $$
CREATE TRIGGER before_delete_member
BEFORE DELETE ON Member
FOR EACH ROW
BEGIN
    -- If the member has any unpaid fine (via Issue_Return -> Fine), block deletion
    IF EXISTS (
        SELECT 1
        FROM Issue_Return ir
        JOIN Fine f ON ir.Issue_Id = f.Issue_Id
        WHERE ir.Member_Id = OLD.Member_Id
          AND f.Paid_Status = 'Unpaid'
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete member: member has unpaid fines.';
    END IF;
END$$
DELIMITER ;


SELECT * FROM MEMBER;
SELECT * FROM FINE;
SELECT * FROM ISSUE_RETURN;
DELETE FROM MEMBER WHERE Member_Id = 1;
