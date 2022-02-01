// Model Time!
const pool = require('../utils/pool');

module.exports = class Reviewer {
  id;
  name;
  company;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.company = row.company;
  }

  static async insert({ name, company }) {
    const { rows } = await pool.query(
      'INSERT INTO reviewers(name, company) VALUES($1, $2) RETURNING*',
      [name, company]
    );
    return new Reviewer(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM reviewers');
    return rows.map((row) => new Reviewer(row));
  }

  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM reviewers WHERE id=$1', [
      id,
    ]);
    if (!rows[0]) {
      const error = new Error('selected reviewer does not exist');
      error.status = 404;
      throw error;
    }
    return new Reviewer(rows[0]);
    // LATER:
    //   make call for reviews associated with this reviewers id.
    //   append returning reviews array to the newReviewer.
    //   return the newReviewer.
  }

  static async updateById(id, updateObj) {
    const getByIdResp = await Reviewer.getById(id);

    const name = updateObj.name ?? getByIdResp.name;
    const company = updateObj.company ?? getByIdResp.company;

    const { rows } = await pool.query(
      'UPDATE reviewers SET name=$1, company=$2 RETURNING *',
      [name, company]
    );
    return new Reviewer(rows[0]);
  }

  static async deleteById(id) {
    const { rows } = await pool.query(
      'DELETE FROM reviewers WHERE id=$1 RETURNING *',
      [id]
    );
    return new Reviewer(rows[0]);
  }
};
