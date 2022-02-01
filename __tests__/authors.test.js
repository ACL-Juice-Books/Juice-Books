const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Author = require('../lib/models/Author.js');

describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should create an author', async () => {
    const res = await request(app).post('/api/v1/authors').send({
      name: 'Jay Kristoff',
      dateOfBirth: '11/12/1973', //prettier-ignore
      placeOfBirth: 'Australia',
    });

    expect(res.body).toEqual({
      id: expect.any(String),
      name: 'Jay Kristoff',
      dateOfBirth: '11/12/1973', //prettier-ignore
      placeOfBirth: 'Australia',
    });
  });

  it('should get an author by id', async () => {
    const author = {
      id: '1',
      name: 'Nicholas Eames',
      dateOfBirth: '11/10/2020', //prettier-ignore
      placeOfBirth: 'USA',
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
    const res = await request(app).get('/api/v1/authors/1');
    expect(res.body).toEqual(author);
  });

  it('should list all of the authors', async () => {
    const author1 = {
      id: '1',
      name: 'Nicholas Eames',
      dateOfBirth: '11/10/2020', //prettier-ignore
      placeOfBirth: 'USA',
    };
    const author4 = await Author.insert({
      name: 'Frank Herbert',
      dateOfBirth: '10/08/1920', //prettier-ignore
      placeOfBirth: 'Washington',
    });
    const author5 = await Author.insert({
      name: 'Margaret Mitchell',
      dateOfBirth: '11/08/1900', //prettier-ignore
      placeOfBirth: 'Georgia',
    });
    const res = await request(app).get('/api/v1/authors');
    expect(res.body).toEqual([author1, author4, author5]);
  });
});
