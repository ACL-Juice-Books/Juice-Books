const pool = require('../utils/pool.js');

module.exports = class Book {
  id;
  title;
  publisher;
  released;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.publisher = row.publisher;
    this.released = row.released;
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
    const { rows } = await pool.query('SELECT * FROM book WHERE id=$1;', [id]);
    const publisherId = rows[0].publisher;
    const publisherResult = await pool.query(`
      SELECT id, name FROM publishers
      WHERE id = $1
    `, [publisherId]);
    const authorsResult = await pool.query(`
      SELECT authors.id, authors.name FROM books_authors
      LEFT JOIN authors
      ON authors.id = books_authors.author_id
      WHERE book_id = $1
    `, [id]);

    const publisher = publisherResult.rows[0];
    const authors = authorsResult.rows;

    const book = new Book(rows[0]);
    book.publisher = publisher;
    book.authors = authors;
    return book;
  }
};
