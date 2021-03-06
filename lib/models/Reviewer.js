// Model Time!
const pool = require('../utils/pool');

module.exports = class Reviewer {
  id;
  name;
  company;
  reviews;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.company = row.company;
    this.reviews = row.reviews || [];
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
    const { rows } = await pool.query(
      `SELECT 
        reviewers.*,
        jsonb_agg(to_jsonb(review.*)) AS reviews
      FROM 
        reviewers
      LEFT JOIN
        review
      ON
        reviewers.id = review.reviewer_id
      WHERE
        reviewers.id=$1
      GROUP BY
        reviewers.id`,
      [id]
    );
    if (!rows[0]) {
      const error = new Error('selected reviewer does not exist');
      error.status = 404;
      throw error;
    }
    return new Reviewer(rows[0]);
  }

  static async updateById(id, updateObj) {
    const getByIdResp = await Reviewer.getById(id);

    const name = updateObj.name ?? getByIdResp.name;
    const company = updateObj.company ?? getByIdResp.company;

    const { rows } = await pool.query(
      'UPDATE reviewers SET name=$1, company=$2 WHERE id=$3 RETURNING *',
      [name, company, id]
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
