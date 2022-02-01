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
    const { rows } = await pool.query('SELECT * FROM publishers WHERE id=$1;', [
      id,
    ]);

    if (!rows[0]) return null;
    return new Publisher(rows[0]);
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