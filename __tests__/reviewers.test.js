const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Reviewer = require('../lib/models/Reviewer.js');

const mockReviewer = {
  name: 'test-reviewer-name',
  company: 'test-company-name',
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
    const expected = { ...mockReviewer, id: expect.any(String) };
    expect(actual.body).toEqual(expected);
  });

  it('it should get an array with an object in the correct shape', async () => {
    await Reviewer.insert(mockReviewer);
    const actual = await request(app).get('/api/v1/reviewers/');
    const expected = [{ ...mockReviewer, id: expect.any(String) }];
    expect(actual.body).toEqual(expected);
  });

  it('it should getbyid an object in the correct shape', async () => {
    const { id } = await Reviewer.insert(mockReviewer);
    // await Review.insert(mockReview);
    const actual = await request(app).get(`/api/v1/reviewers/${id}`);
    // const expected = { ...mockReviewer, id, reviews: [mockReviewer] };
    const expected = { ...mockReviewer, id };
    expect(actual.body).toEqual(expected);
  });

  it('it should update an existing reviewer and return with an object in the correct shape', async () => {
    const { id } = await Reviewer.insert(mockReviewer);
    const actual = await request(app)
      .update(`/api/v1/reviewers/${id}`)
      .send({ name: 'new-test-reviewer-name' });
    const expected = { ...mockReviewer, id, name: 'new-test-reviewer-name' };
    expect(actual.body).toEqual(expected);
  });
});
