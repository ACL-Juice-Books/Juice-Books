const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Reviewer = require('../lib/models/Reviewer.js');
const Review = require('../lib/models/Review.js');

const mockReviewer = {
  name: 'test-reviewer-name',
  company: 'test-company-name',
};

const mockReview = {
  rating: 2,
  reviewer_id: '1',
  review: 'is really good',
  book_id: '1',
};

describe('reviewer routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('it should post new reviewer and return an object in the correct shape', async () => {
    const actual = await request(app)
      .post('/api/v1/reviewers/')
      .send(mockReviewer);
    const expected = { ...mockReviewer, id: expect.any(String), reviews: [] };
    expect(actual.body).toEqual(expected);
  });

  it('it should get an array with an object in the correct shape', async () => {
    await Reviewer.insert(mockReviewer);
    const actual = await request(app).get('/api/v1/reviewers/');
    const expected = [{ ...mockReviewer, id: expect.any(String), reviews: [] }];
    expect(actual.body).toEqual(expect.arrayContaining(expected));
  });

  it('it should getbyid an object in the correct shape', async () => {
    const { id } = await Reviewer.insert(mockReviewer);
    await Review.insert({ ...mockReview, reviewer_id: id });
    const actual = await request(app).get(`/api/v1/reviewers/${id}`);

    const expected = {
      ...mockReviewer,
      id,
      reviews: [
        {
          ...mockReview,
          book_id: expect.any(Number),
          reviewer_id: Number(id),
          id: expect.any(Number),
        },
      ],
    };

    // const expected = { ...mockReviewer, id };
    expect(actual.body).toEqual(expected);
  });

  it('it should update an existing reviewer and return with an object in the correct shape', async () => {
    const { id } = await Reviewer.insert(mockReviewer);
    const actual = await request(app)
      .patch(`/api/v1/reviewers/${id}`)
      .send({ name: 'new-test-reviewer-name' });
    const expected = {
      ...mockReviewer,
      id,
      name: 'new-test-reviewer-name',
      reviews: [],
    };
    expect(actual.body).toEqual(expected);
  });

  it('it should delete an existing reviewer, getbyid should throw error', async () => {
    const { id } = await Reviewer.insert(mockReviewer);
    const actual = await request(app).delete(`/api/v1/reviewers/${id}`);
    const expected = { ...mockReviewer, id, reviews: [] };
    expect(actual.body).toEqual(expected);
    expect(async () => await Reviewer.getById(id)).rejects.toThrow();
  });

  it('it should attempt to delete a reviewer with reviews and return an error', async () => {
    const { id } = await Reviewer.insert(mockReviewer);
    await Review.insert(mockReview);
    const deleteResponse = await request(app).delete(`/api/v1/reviewers/${id}`);
    expect(deleteResponse.body).toEqual('no');
  });
});
