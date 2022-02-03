const pool = require('../utils/pool');

module.exports = class Review {
  id;
  rating;
  review;
  book;

  constructor(row) {
    this.id = row.id;
    this.rating = row.rating;
    this.review = row.review;
    this.book = row.book;
  }

  static async insert({ rating, reviewer_id, review, book_id }) {
    const { rows } = await pool.query(`
      INSERT INTO review (rating, reviewer_id, review, book_id)
      VALUES ($1, $2, $3, $4);
    `, [rating, reviewer_id, review, book_id]);

    return new Review(rows[0]);
  }

};
