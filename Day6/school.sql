
PRAGMA foreign_keys = ON;

-- 1. Create the students table
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- 2. Create the courses table
CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL UNIQUE
);

-- 3. Create the enrolments table
-- This links students to courses and stores each student's grade.
CREATE TABLE enrolments (
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade REAL NOT NULL CHECK (grade >= 0 AND grade <= 100),

    PRIMARY KEY (student_id, course_id),

    FOREIGN KEY (student_id)
        REFERENCES students(student_id)
        ON DELETE CASCADE,

    FOREIGN KEY (course_id)
        REFERENCES courses(course_id)
        ON DELETE CASCADE
);

-- 4. Insert sample students
INSERT INTO students (student_id, name, email) VALUES
(1, 'Amina Okello', 'amina@example.com'),
(2, 'Brian Ouma', 'brian@example.com'),
(3, 'Carol Atim', 'carol@example.com'),
(4, 'Daniel Otim', 'daniel@example.com');

-- 5. Insert sample courses
INSERT INTO courses (course_id, course_name) VALUES
(1, 'Database Systems'),
(2, 'Web Development'),
(3, 'Computer Networking');

-- 6. Insert sample enrolments
INSERT INTO enrolments (student_id, course_id, grade) VALUES
(1, 1, 82),
(1, 2, 88),
(2, 1, 75),
(2, 2, 79),
(3, 3, 91);

-- QUERY 1: Find all courses taken by one student, by name
SELECT s.name, c.course_name, e.grade
FROM students AS s
JOIN enrolments AS e ON s.student_id = e.student_id
JOIN courses AS c ON e.course_id = c.course_id
WHERE s.name = 'Amina Okello';

-- QUERY 2: Find all students enrolled on one course
SELECT c.course_name, s.name, e.grade
FROM courses AS c
JOIN enrolments AS e ON c.course_id = e.course_id
JOIN students AS s ON e.student_id = s.student_id
WHERE c.course_name = 'Database Systems';

-- QUERY 3: Count the students enrolled in each course
SELECT c.course_name,
       COUNT(e.student_id) AS number_of_students
FROM courses AS c
LEFT JOIN enrolments AS e ON c.course_id = e.course_id
GROUP BY c.course_id, c.course_name
ORDER BY c.course_name;

-- QUERY 4: Find students who have no enrolments
SELECT s.student_id, s.name, s.email
FROM students AS s
LEFT JOIN enrolments AS e ON s.student_id = e.student_id
WHERE e.student_id IS NULL;

-- QUERY 5: Update one student's grade for one course
UPDATE enrolments
SET grade = 85
WHERE student_id = (
    SELECT student_id
    FROM students
    WHERE name = 'Brian Ouma'
)
AND course_id = (
    SELECT course_id
    FROM courses
    WHERE course_name = 'Web Development'
);
-- Verify the updated grade
SELECT s.name, c.course_name, e.grade
FROM enrolments AS e
JOIN students AS s ON e.student_id = s.student_id
JOIN courses AS c ON e.course_id = c.course_id
WHERE s.name = 'Brian Ouma'
  AND c.course_name = 'Web Development';
