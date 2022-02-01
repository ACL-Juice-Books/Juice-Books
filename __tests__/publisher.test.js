const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Publisher = require('../lib/models/Publisher.js');

describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should create a publisher', async () => {
    const res = await request(app).post('/api/v1/publishers').send({
      name: 'Penguin',
      city: 'Seattle',
      country: 'USA',
    });

    expect(res.body).toEqual({
      id: expect.any(String),
      name: 'Penguin',
      city: 'Seattle',
      country: 'USA',
    });
  });

  it('should get an publisher by id', async () => {
    const publisher = {
      id: '1',
      name: 'bob',
      city: null,
      country: null,
      books: [
        {
          id: '1',
          title: 'Harry Potter',
        },
        {
          id: '2',
          title: 'Harry Potter 2',
        },
      ],
    };
    const res = await request(app).get('/api/v1/publishers/1');
    expect(res.body).toEqual(publisher);
  });

  it('should list all the publishers', async () => {
    const publisher = await Publisher.insert({
      name: 'Penguin',
      city: 'Seattle',
      country: 'USA',
    });
    const publisher2 = await Publisher.insert({
      name: 'Double Day',
      city: 'Prescott',
      country: 'USA',
    });
    const res = await request(app).get('/api/v1/publishers');
    expect(res.body).toEqual(expect.arrayContaining([publisher, publisher2]));
  });

  it('should delete a publisher by id', async () => {
    const noPublisher = await Publisher.insert({
      name: 'Double Day',
      city: 'Prescott',
      country: 'USA',
    });
    const res = await request(app).delete(
      `/api/v1/publishers/${noPublisher.id}`
    );
    expect(res.body).toEqual(noPublisher);
    expect(await Publisher.getById(noPublisher.id)).toBeNull();
  });
});
