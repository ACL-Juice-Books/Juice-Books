const pool = require('../utils/pool');

module.exports = class Review {
  id;
  rating;
  review;
  reviewer_id;
  book_id;

  constructor(row) {
    this.id = row.id;
    this.rating = row.rating;
    this.review = row.review;
    this.reviewer_id = row.reviewer_id;
    this.book_id = row.book_id;
  }

  static async insert({ rating, reviewer_id, review, book_id }) {
    const { rows } = await pool.query(`
      INSERT INTO review (rating, reviewer_id, review, book_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [rating, reviewer_id, review, book_id]);

    return new Review(rows[0]);
  }

};
