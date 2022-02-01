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

    return new Book(rows[0]);
  }
};
