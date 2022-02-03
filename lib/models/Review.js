const pool = require('../utils/pool');

module.exports = class Review {
  id;
  rating;
  review;
  reviewer_id;
  book_id;
  book;

  constructor(row) {
    this.id = row.id;
    this.rating = row.rating;
    this.review = row.review;
    this.reviewer_id = row.reviewer_id;
    this.book_id = row.book_id;
    if(row.book?.length > 0) {
      this.book = {
        id: String(row.book[0]?.id) ?? '-1',
        title: row.book[0]?.title ?? ''
      };
    }
  }

  static async insert({ rating, reviewer_id, review, book_id }) {
    const { rows } = await pool.query(`
      INSERT INTO review (rating, reviewer_id, review, book_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [rating, reviewer_id, review, book_id]);

    return new Review(rows[0]);
  }

  static async getTop() {
    const { rows } = await pool.query(`
      SELECT
        review.*,
        jsonb_agg(to_jsonb(book) - 'publisher' - 'released') as book
      FROM review
      LEFT JOIN book
      ON book.id = review.book_id
      GROUP BY review.id
      ORDER BY rating DESC
      LIMIT 100
    `);

    //console.log(rows);
    return rows.map(row => new Review(row));
  }

  static async delete(id) {
    const { rows } = await pool.query(`
      DELETE FROM review
      WHERE id=$1
      RETURNING *;
    `, [id]);

    return new Review(rows[0]);
  }
};
