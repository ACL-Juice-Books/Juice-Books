const pool = require('../utils/pool.js');

module.exports = class Author {
  id;
  name;
  dateOfBirth;
  placeOfBirth;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
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
    const { rows } = await pool.query('SELECT * FROM authors WHERE id=$1', [
      id,
    ]);

    if (!rows[0]) return null;
    return new Author(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM authors');
    return rows.map((row) => new Author(row));
  }
};
