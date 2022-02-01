const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Reviewer = require('../lib/models/Reviewer.js');

const mockReviewer = {
  name: 'test-reviewer-name',
  company: 'test-company-name',
};

describe('backend routes', () => {
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

  it('it should insert a new reviewer and get an array with an object in the correct shape', async () => {
    await Reviewer.insert(mockReviewer);
    const actual = await request(app).get('/api/v1/reviewers/');
    const expected = [{ ...mockReviewer, id: expect.any(String) }];
    expect(actual.body).toEqual(expected);
  });
});
