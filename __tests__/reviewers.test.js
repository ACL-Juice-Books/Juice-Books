const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

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

  it('it should post a new reviewer and return an object in the correct shape', async () => {
    const actual = request(app).post('/api/v1/reviewers/').send(mockReviewer);
    const expected = { ...mockReviewer, id: expect.any(String) };
    expect(actual).toEqual(expected);
  });
});
