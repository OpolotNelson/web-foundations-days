
# School Database Design

## 1. Tables

**Students:** Stores each student's ID, full name and email address. The student ID is the primary key, and each email address must be unique.

**Courses:** Stores the courses offered by the school. Each course has a unique course ID and course name.

**Enrolments:** Connects students to the courses they take and stores their grades. The student ID and course ID form a composite primary key, which prevents a student from enrolling on the same course twice. Both columns are foreign keys.

## 2. Relationships

The relationship between students and enrolments is one-to-many because one student can enrol on several courses, while each enrolment record belongs to one student.

The relationship between courses and enrolments is also one-to-many because one course can have many students, while each enrolment record refers to one course.

Students and courses therefore have a many-to-many relationship: a student can take several courses, and a course can have several students. The enrolments table is necessary to connect these two tables and store additional information, such as each student's grade.

## 3. Index

I would add an index on the `course_id` column in the enrolments table. This would help the database find students enrolled on a particular course more efficiently and support queries that count enrolments per course.

## 4. SQL or NoSQL?

I would choose a relational SQL database for this school system. The data has clear relationships between students, courses and enrolments, and the system needs primary keys, foreign keys and rules to prevent duplicate enrolments. SQL supports these requirements and allows the school to retrieve related information using JOINs and calculate enrolment totals using GROUP BY. SQLite is suitable for this assignment because it supports these relational database features without requiring a separate database server.
