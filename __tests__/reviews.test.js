const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('reviewer routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('can post a review', async () => {
    const review = {
      rating: 3,
      reviewer_id: '1',
      review: 'is real good',
      book_id: '1'
    };

    const actual = await request(app).post('/api/v1/reviews')
      .send(review);

    review.id = '2';
    expect(actual.body).toEqual(review);
  });

  it('can delete a review', async () => {
    const review = {
      rating: 2,
      reviewer_id: '1',
      review: 'is really good',
      book_id: '1'
    };

    const postResult = await request(app).post('/api/v1/reviews')
      .send(review);

    const postedReview = postResult.body;

    await request(app).delete(`/api/v1/reviews/${postedReview.id}`);

    const reviewsResult = await request(app).get('/api/v1/reviews');
    const reviews = reviewsResult.body;

    expect(reviews).not.toEqual(expect.arrayContaining([postedReview]));
  });

  it('can get 100 highest rated reviews', async () => {
    const review = {
      rating: 5,
      reviewer_id: '1',
      review: 'is really good',
      book_id: '1'
    };

    for(let i = 0; i < 97; i++) {
      await request(app).post('/api/v1/reviews')
        .send(review);
    }

    const review2 = {
      rating: 4,
      reviewer_id: '1',
      review: 'is pretty good',
      book_id: '1'
    };

    for(let i = 0; i < 3; i++) {
      await request(app).post('/api/v1/reviews')
        .send(review2);
    }

    const reviewsResult = await request(app).get('/api/v1/reviews');

    review.id = expect.any(String);
    const expected = new Array(97).fill(review, 0, 97);
    review2.id = expect.any(String);
    expected.push(review2);
    expected.push(review2);
    expected.push(review2);

    expect(reviewsResult.body).toEqual(expected);
  });
});
