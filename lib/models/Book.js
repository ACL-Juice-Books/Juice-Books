const pool = require('../utils/pool.js');

module.exports = class Book {
  id;
  title;
  publisher;
  released;
  reviews;
  authors;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.publisher = row.publisher;
    this.released = row.released;
    this.reviews = row.reviews;
    this.authors = row.authors;
  }

  static async insert({ title, publisher, released }) {
    const { rows } = await pool.query(`
      INSERT INTO book (title, publisher, released)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [title, publisher, released]);

    return new Book(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM book;');

    return rows.map(row => new Book(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(`
      WITH nested_reviews AS (
        SELECT
          review.id,
          rating,
          review,
          book_id,
          jsonb_agg(to_jsonb(reviewers) - 'company')->0 as reviewer
        FROM review
        LEFT JOIN reviewers
        ON review.reviewer_id = reviewers.id
        GROUP BY review.id
      )
      
      SELECT 
        book.id,
        book.title,
        book.released,
        jsonb_agg(to_jsonb(publishers) - 'city' - 'state' - 'country')->0 as publisher,
        jsonb_agg(to_jsonb(authors) - 'date_of_birth' - 'place_of_birth') as authors,
        jsonb_agg(to_jsonb(nested_reviews) - 'book_id') as reviews
      FROM books_authors
      LEFT JOIN book
      ON books_authors.book_id = book.id
      LEFT JOIN authors
      ON books_authors.author_id = authors.id
      LEFT JOIN publishers
      ON book.publisher = publishers.id
      LEFT JOIN nested_reviews
      ON nested_reviews.book_id = book.id
      WHERE book.id=$1
      GROUP BY book.id
      `, [id]);

    const book = new Book(rows[0]);
    return book;
  }
};
