const pool = require('../utils/pool.js');

module.exports = class Author {
  id;
  name;
  dateOfBirth;
  placeOfBirth;
  books;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    (row.books && (this.books = row.books)) || [];
    row.date_of_birth &&
      (this.dateOfBirth = row.date_of_birth.toLocaleDateString({
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      })),
      (this.placeOfBirth = row.place_of_birth);
  }

  static async insert({ name, dateOfBirth, placeOfBirth }) {
    const { rows } = await pool.query(
      'INSERT INTO authors (name, date_of_birth, place_of_birth) VALUES ($1, $2, $3) RETURNING *',
      [name, dateOfBirth, placeOfBirth]
    );
    return new Author(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
    SELECT authors.*,
    jsonb_agg(to_jsonb(book) - 'publisher') AS books
    FROM authors 
    FULL OUTER JOIN books_authors
    ON authors.id = books_authors.author_id 
    FULL OUTER JOIN book
    ON books_authors.book_id = book.id 
    WHERE authors.id=$1
    GROUP BY authors.id
    `,
      [id]
    );
    console.log(rows[0]);
    return new Author(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT id, name FROM authors');
    return rows.map((row) => new Author(row));
  }
};
