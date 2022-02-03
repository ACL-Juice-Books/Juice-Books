const pool = require('../utils/pool');

module.exports = class Publisher {
  id;
  name;
  city;
  state;
  country;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.city = row.city;
    this.country = row.country;
    row.books && (this.books = row.books);
  }

  static async insert({ name, city, state, country }) {
    const { rows } = await pool.query(
      'INSERT INTO publishers(name, city, state, country) VALUES ($1, $2, $3, $4) RETURNING *;',
      [name, city, state, country]
    );
    return new Publisher(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM publishers;');
    return rows.map((row) => new Publisher(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `SELECT publishers.*,
      jsonb_agg(to_jsonb(book) - 'released' - 'publisher') AS books
      FROM publishers
      LEFT JOIN book
      ON publishers.id = book.publisher
      WHERE publishers.id=$1
      GROUP BY publishers.id;`,
      [id]
    );

    if (!rows[0]) return null;
    const publisher = new Publisher(rows[0]);

    return publisher;
  }

  static async deleteById(id) {
    const { rows } = await pool.query(
      'DELETE FROM publishers WHERE id=$1 RETURNING *;',
      [id]
    );
    if (!rows[0]) return null;
    return new Publisher(rows[0]);
  }
};
