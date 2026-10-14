
# Library Books API

## Overview

The Library Books API allows users to list, retrieve, create, update,
delete and search for books by author.

Base URL: `https://api.example.com`

## Endpoints

### 1. List all books

- **Method:** GET
- **Path:** `/books`
- **Description:** Returns a list of books.
- **Success status:** `200 OK`
- **Request body:** None.

### 2. Get one book

- **Method:** GET
- **Path:** `/books/42`
- **Description:** Returns the book with ID 42.
- **Success status:** `200 OK`
- **Request body:** None.

### 3. Create a book

- **Method:** POST
- **Path:** `/books`
- **Description:** Creates a new book.
- **Success status:** `201 Created`
- **Example request body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "year": 1958
}
```

### 4. Update a book

- **Method:** PUT
- **Path:** `/books/42`
- **Description:** Replaces the details of book 42.
- **Success status:** `200 OK`
- **Example request body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "year": 1958
}
```

### 5. Delete a book

- **Method:** DELETE
- **Path:** `/books/42`
- **Description:** Deletes book 42.
- **Success status:** `204 No Content`
- **Request body:** None.

### 6. List books by author

- **Method:** GET
- **Path:** `/books?author=Chinua%20Achebe`
- **Description:** Returns books written by Chinua Achebe.
- **Success status:** `200 OK`
- **Request body:** None.

## Error Responses

### 400 Bad Request

Returned when the request contains invalid data.

**Example:** Creating a book without a required title or author.

### 404 Not Found

Returned when the requested resource does not exist.

**Example:** Requesting `GET /books/9999` when no book has ID 9999.

## Notes

- GET retrieves data.
- POST creates a resource.
- PUT replaces an existing resource.
- PATCH updates selected fields.
- DELETE removes a resource.
- Query parameters, such as `author`, filter the results.
